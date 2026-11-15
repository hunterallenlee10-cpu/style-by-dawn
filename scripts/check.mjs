// npm run check: crawls a running server and exits non-zero on any rule break.
// Usage: npm run check            (http://localhost:3000)
//        CHECK_BASE=http://localhost:3100 npm run check
// Rules (BUILD-SPEC section 9): one h1 per page; no broken internal links or anchors; no leftover
// template braces, lorem or unlabelled placeholder text; zero em dashes and zero "--" in rendered text;
// alt text plus width and height on every image; every phone number and email matches lib/business.ts;
// in live mode, zero DRAFT markers and no review placeholder card.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = (process.env.CHECK_BASE || 'http://localhost:3000').replace(/\/$/, '');
const ALLOW_DRAFT = process.env.ALLOW_DRAFT_IN_LIVE === '1';
const src = fs.readFileSync(new URL('../lib/business.ts', import.meta.url), 'utf8');
const PHONE = src.match(/phoneE164: '\+1(\d{10})'/)[1];
const EMAIL = src.match(/email: '([^']+)'/)[1];

const failures = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);
const passes = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const queue = ['/'];
const seen = new Set();
const anchorChecks = []; // [fromPage, path, id]
const statusCache = new Map();
let mode = 'demo';

async function status(path) {
  if (statusCache.has(path)) return statusCache.get(path);
  const res = await fetch(BASE + path, { redirect: 'follow' });
  statusCache.set(path, res.status);
  return res.status;
}

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
  if (!res || res.status() !== 200) {
    fail(path, `status ${res?.status()}`);
    continue;
  }
  const data = await page.evaluate(() => {
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    const h1s = [...document.querySelectorAll('h1')].map((h) => h.innerText.trim());
    const links = [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.getAttribute('href'),
      text: (a.innerText || a.getAttribute('aria-label') || '').trim(),
    }));
    const imgs = [...document.querySelectorAll('img')].map((i) => ({
      src: i.getAttribute('src'),
      alt: i.getAttribute('alt'),
      w: i.getAttribute('width'),
      h: i.getAttribute('height'),
      decorative: i.getAttribute('aria-hidden') === 'true' || i.getAttribute('role') === 'presentation',
      fill: i.style.position === 'absolute' && i.style.inset === '0px',
    }));
    // text with the labelled placeholders removed
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('[data-placeholder], script, style, noscript').forEach((n) => n.remove());
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:-99999px;top:0;width:1200px';
    host.appendChild(clone);
    document.documentElement.appendChild(host);
    const cleanText = clone.innerText;
    host.remove();
    const attrs = [...document.querySelectorAll('[alt],[aria-label],[title],meta[content]')]
      .map((n) => [n.getAttribute('alt'), n.getAttribute('aria-label'), n.getAttribute('title'), n.tagName === 'META' ? n.getAttribute('content') : null])
      .flat()
      .filter(Boolean)
      .join('\n');
    return {
      robots,
      title: document.title,
      h1s,
      links,
      imgs,
      fullText: document.body.innerText,
      cleanText,
      attrs,
      html: document.documentElement.outerHTML,
      drafts: [...document.querySelectorAll('[data-draft]')].map((n) => n.getAttribute('data-draft')),
      placeholders: [...document.querySelectorAll('[data-placeholder]')].map((n) => n.getAttribute('data-placeholder')),
      ids: [...document.querySelectorAll('[id]')].map((n) => n.id),
    };
  });
  if (path === '/') mode = data.robots.includes('noindex') ? 'demo' : 'live';

  // 1. one h1
  if (data.h1s.length !== 1) fail(path, `expected 1 h1, found ${data.h1s.length} ${JSON.stringify(data.h1s)}`);

  // 2. links
  for (const l of data.links) {
    if (!l.text) fail(path, `link without text or aria-label: ${l.href}`);
    if (/^(learn more|click here|read more|more|here)$/i.test(l.text)) fail(path, `vague link text "${l.text}"`);
    let href = l.href;
    if (href.startsWith(BASE)) href = href.slice(BASE.length) || '/';
    if (href.startsWith('#')) {
      anchorChecks.push([path, path, href.slice(1)]);
      continue;
    }
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const [p, hash] = href.split('#');
    const clean = p || '/';
    if (hash) anchorChecks.push([path, clean, hash]);
    if (!seen.has(clean) && !queue.includes(clean) && !clean.match(/\.(png|jpg|svg|txt|xml|ico)$/)) queue.push(clean);
    const st = await status(clean);
    if (st !== 200) fail(path, `broken internal link ${href} (${st})`);
  }
  for (const id of data.ids) anchorChecks.push(['__ids', path, '__has:' + id]);

  // 3. leftovers
  const leftover = data.cleanText.match(/\{\{|\}\}|\$\{|\bundefined\b|\bNaN\b|\[object Object\]|lorem|ipsum|\bTODO\b|\bTBD\b|placeholder/gi);
  if (leftover) fail(path, `leftover template or placeholder text: ${[...new Set(leftover)].join(', ')}`);

  // 4. dashes
  const textAll = `${data.title}\n${data.fullText}\n${data.attrs}`;
  if (/—/.test(textAll)) fail(path, 'em dash found in rendered text');
  if (/–/.test(textAll)) fail(path, 'en dash found in rendered text');
  if (/--/.test(textAll)) fail(path, '"--" found in rendered text');

  // 5. images
  for (const i of data.imgs) {
    if (i.alt === null || (i.alt.trim() === '' && !i.decorative)) fail(path, `image without alt: ${i.src}`);
    if (!i.fill && (!i.w || !i.h)) fail(path, `image without width/height: ${i.src}`);
  }

  // 6. phone and email
  const phones = data.fullText.match(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g) || [];
  for (const ph of phones) if (ph.replace(/\D/g, '') !== PHONE) fail(path, `phone ${ph} does not match lib/business.ts`);
  for (const l of data.links) {
    if (/^(tel|sms):/.test(l.href)) {
      const digits = l.href.split('?')[0].replace(/\D/g, '').replace(/^1/, '');
      if (digits !== PHONE) fail(path, `${l.href} does not match lib/business.ts`);
    }
    if (l.href.startsWith('mailto:') && l.href.slice(7).split('?')[0] !== EMAIL) fail(path, `${l.href} does not match lib/business.ts`);
  }
  const emails = data.fullText.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [];
  for (const e of emails) if (e !== EMAIL) fail(path, `email ${e} does not match lib/business.ts`);

  // 7. live mode
  if (mode === 'live' && !ALLOW_DRAFT) {
    if (data.drafts.length) fail(path, `DRAFT content in live mode: ${data.drafts.join(', ')}`);
    if (data.placeholders.length) fail(path, `placeholder in live mode: ${data.placeholders.join(', ')}`);
    if (/\bDRAFT\b/.test(data.fullText)) fail(path, 'DRAFT text in live mode');
  }
  passes.push(`${path}  h1="${data.h1s[0] ?? ''}"  links=${data.links.length} imgs=${data.imgs.length} drafts=${data.drafts.length} placeholders=${data.placeholders.length}`);
}

// anchors
const idsByPage = new Map();
for (const [from, p, id] of anchorChecks) if (from === '__ids') {
  if (!idsByPage.has(p)) idsByPage.set(p, new Set());
  idsByPage.get(p).add(id.slice(6));
}
for (const [from, p, id] of anchorChecks) {
  if (from === '__ids' || !id) continue;
  if (!idsByPage.get(p)?.has(id)) fail(from, `anchor #${id} not found on ${p}`);
}

// 404 page
const r404 = await page.goto(BASE + '/this-is-not-on-the-rack', { waitUntil: 'networkidle' });
const h404 = await page.$$eval('h1', (h) => h.length);
if (r404?.status() !== 404) fail('/404', `status ${r404?.status()}, expected 404`);
if (h404 !== 1) fail('/404', `expected 1 h1, found ${h404}`);
else passes.push(`/this-is-not-on-the-rack  status=${r404?.status()}`);

await browser.close();

console.log(`npm run check against ${BASE} (mode: ${mode}${mode === 'live' && ALLOW_DRAFT ? ', ALLOW_DRAFT_IN_LIVE=1' : ''})`);
for (const p of passes) console.log('  ok  ' + p);
console.log(`  phone ${PHONE}, email ${EMAIL}`);
if (failures.length) {
  console.log(`\n${new Set(failures).size} failure(s):`);
  for (const f of [...new Set(failures)]) console.log('  FAIL ' + f);
  process.exit(1);
}
console.log('\nAll checks passed.');
