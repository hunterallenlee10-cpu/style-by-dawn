// Mobile glitch sweep: every page on several phone profiles. Checks horizontal overflow, console
// errors, failed requests, broken images, layout shift while loading and scrolling, tap targets
// under 24px, and whether the sticky bar hides the end of the page.
// Usage: node scripts/mobile-sweep.mjs [base]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const base = (process.argv[2] || 'https://style-by-dawn.vercel.app').replace(/\/$/, '');
const out = 'screenshots/mobile-qa';
fs.mkdirSync(out, { recursive: true });

const profiles = [
  ['iPhone SE (320)', { ...devices['iPhone SE'], defaultBrowserType: undefined }],
  ['Galaxy S8 (360)', devices['Galaxy S8']],
  ['iPhone 13 (390)', { ...devices['iPhone 13'], defaultBrowserType: undefined }],
  ['Pixel 7 (412)', devices['Pixel 7']],
  ['iPhone 14 Pro Max (430)', { ...devices['iPhone 14 Pro Max'], defaultBrowserType: undefined }],
  ['Pixel 7 landscape', devices['Pixel 7 landscape']],
];
const pages = ['/', '/new', '/meet-dawn', '/visit', '/not-a-page'];
const issues = [];
const b = await chromium.launch();

for (const [name, dev] of profiles) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultBrowserType: _browser, ...ctxOpts } = dev; // always Chromium here
  const ctx = await b.newContext({ ...ctxOpts });
  const p = await ctx.newPage();
  const errs = [];
  const failed = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 140)));
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 140)));
  p.on('requestfailed', (r) => failed.push(`${r.url().slice(-60)} ${r.failure()?.errorText}`));
  p.on('response', (r) => r.status() >= 400 && !r.url().includes('not-a-page') && failed.push(`${r.status()} ${r.url().slice(-60)}`));
  const W = ctxOpts.viewport.width;
  for (const path of pages) {
    errs.length = 0;
    failed.length = 0;
    await p.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await p.goto(base + path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
    // scroll the whole page like a thumb would
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= H; y += 350) {
      await p.evaluate((yy) => window.scrollTo(0, yy), y);
      await p.waitForTimeout(70);
    }
    await p.waitForTimeout(800);
    const r = await p.evaluate((vw) => {
      const over = document.documentElement.scrollWidth - vw;
      const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.src.slice(-50));
      const unloaded = [...document.images].filter((i) => i.getBoundingClientRect().width > 0 && !i.complete).length;
      // tap targets (WCAG 2.5.8 minimum 24x24), skipping inline links inside text
      const small = [...document.querySelectorAll('a[href],button,[role=radio],summary,input')]
        .filter((el) => {
          const rr = el.getBoundingClientRect();
          if (rr.width === 0 || rr.height === 0) return false;
          if (el.closest('.sr-only') || el.classList.contains('sr-only')) return false;
          const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p');
          return !inline && (rr.width < 24 || rr.height < 24);
        })
        .map((el) => `${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 30)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
      // at the very bottom, is the last footer line above the sticky bar?
      window.scrollTo(0, document.documentElement.scrollHeight);
      const bar = document.querySelector('.fixed.bottom-0');
      const barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      const lastLine = [...document.querySelectorAll('footer p')].at(-1)?.getBoundingClientRect().bottom ?? 0;
      return { over, broken, unloaded, small: [...new Set(small)], footerHidden: lastLine > barTop + 1, cls: window.__cls };
    }, W);
    const tag = `${name} ${path}`;
    if (r.over > 0) issues.push(`${tag}: horizontal overflow ${r.over}px`);
    if (r.broken.length) issues.push(`${tag}: broken images ${r.broken.join(', ')}`);
    if (r.small.length) issues.push(`${tag}: tap targets under 24px: ${r.small.join(' | ')}`);
    if (r.footerHidden) issues.push(`${tag}: footer end hidden behind the sticky bar`);
    if (r.cls > 0.1) issues.push(`${tag}: layout shift ${r.cls.toFixed(3)}`);
    if (errs.length) issues.push(`${tag}: console errors ${[...new Set(errs)].join(' | ')}`);
    if (failed.length) issues.push(`${tag}: failed requests ${[...new Set(failed)].join(' | ')}`);
    console.log(`${tag.padEnd(42)} overflow=${r.over} cls=${r.cls.toFixed(3)} small=${r.small.length} errors=${errs.length} failed=${failed.length}`);
    if (['/', '/visit', '/new'].includes(path) && (W === 320 || W === 390 || name.includes('landscape'))) {
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${out}/${name.replace(/\W+/g, '-')}${path.replace(/\W+/g, '-')}.png` });
    }
  }
  await ctx.close();
}
await b.close();
console.log(issues.length ? `\n${issues.length} issue(s):\n- ${issues.join('\n- ')}` : '\nNo issues found.');
