// Mobile interaction pass with real touch input (CDP touch events and scroll gestures).
// Usage: node scripts/mobile-interactions.mjs [base] [device]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const base = (process.argv[2] || 'https://style-by-dawn.vercel.app').replace(/\/$/, '');
const devName = process.argv[3] || 'iPhone 13';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { defaultBrowserType: _browser, ...dev } = devices[devName]; // always Chromium here
const out = 'screenshots/mobile-qa';
fs.mkdirSync(out, { recursive: true });
let fails = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fails++; lastOk = m; };
let lastOk = 'start';

const b = await chromium.launch();
const ctx = await b.newContext({ ...dev });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
const errs = [];
p.on('pageerror', (e) => errs.push(`${String(e).slice(0, 110)} [after: ${lastOk}] [url: ${p.url().replace(base, '')}]`));
p.on('console', (m) => m.type() === 'error' && console.log('    console.error:', m.text().slice(0, 120)));

async function swipe(x1, y1, x2, y2, steps = 10) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + ((x2 - x1) * i) / steps, y: y1 + ((y2 - y1) * i) / steps }] });
    await p.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
// a finger drag (raw touch events; Chromium's synthesized gestures are unreliable under emulation)
const scrollGesture = (x, y, xDistance, yDistance) => swipe(x, y, x + xDistance, y + yDistance, 14);
const box = async (loc) => (await loc.boundingBox());

console.log(`${devName} ${dev.viewport.width}x${dev.viewport.height} against ${base}`);

// ---- Rail entrance: frames during the animation, no page overflow while cards slide in
await p.goto(base + '/', { waitUntil: 'commit' });
await p.waitForSelector('.rail-scroller');
let maxOver = 0;
for (const t of [100, 350, 700, 1300]) {
  await p.waitForTimeout(t === 100 ? 100 : t - [100, 350, 700, 1300][[100, 350, 700, 1300].indexOf(t) - 1]);
  maxOver = Math.max(maxOver, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await p.screenshot({ path: `${out}/rail-entrance-${t}ms.png` });
}
ok(maxOver <= 0, `no page overflow while the rail slides in (max ${maxOver}px)`);
await p.waitForLoadState('networkidle');

// ---- Rail: native swipe, snap, arrows, tap opens styler
const rail = p.locator('.rail-scroller');
await rail.scrollIntoViewIfNeeded();
let rb = await box(rail);
await scrollGesture(rb.x + rb.width * 0.8, rb.y + rb.height * 0.5, -rb.width * 0.6, 0);
await p.waitForTimeout(900);
const snap = await rail.evaluate((el) => {
  const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
  const offs = [...el.querySelectorAll('[data-rail-item]')].map((i) => i.offsetLeft - pad);
  return { left: el.scrollLeft, nearest: Math.min(...offs.map((o) => Math.abs(o - el.scrollLeft))), max: el.scrollWidth - el.clientWidth };
});
ok(snap.left > 50, `swipe moves the rail (scrollLeft ${Math.round(snap.left)})`);
ok(snap.nearest < 4 || snap.left >= snap.max - 2, `rail snaps onto a card (off by ${Math.round(snap.nearest)}px)`);
const pageXAfterSwipe = await p.evaluate(() => window.scrollX);
ok(pageXAfterSwipe === 0, 'horizontal swipe on the rail never scrolls the page sideways');
await p.getByRole('button', { name: 'Scroll the rail left' }).tap();
await p.waitForTimeout(700);
ok((await rail.evaluate((el) => el.scrollLeft)) < snap.left, 'left arrow scrolls back');
await rail.evaluate((el) => el.scrollTo({ left: 0 }));
await p.waitForTimeout(400);
await p.getByRole('button', { name: /Pink plaid weather/ }).tap();
await p.waitForTimeout(1300);
const st = await p.evaluate(() => ({
  top: document.getElementById('styler').getBoundingClientRect().top,
  checked: document.querySelector('[role=radio][aria-checked=true]')?.textContent,
  front: document.querySelector('.deck-card[data-state=p0] img')?.getAttribute('src') || '',
}));
const deckBox = await p.locator('.deck').boundingBox();
const vh = await p.evaluate(() => innerHeight);
ok(deckBox.y > 60 && deckBox.y < vh * 0.6, `tapping a rail card brings the deck into view (deck top ${Math.round(deckBox.y)} of ${vh})`);
ok(st.checked === 'Weekend easy' && st.front.includes('06-pink-plaid'), `styler selects that look (${st.checked}, front ${st.front.match(/(\d\d)-/)?.[1]})`);

// ---- Styler: chip row scrolls, deck swipe deals next, vertical swipe scrolls the page
const chips = p.locator('#styler [role=radiogroup]');
const cb = await box(chips);
const before = await chips.evaluate((el) => el.scrollLeft);
await scrollGesture(cb.x + cb.width * 0.8, cb.y + cb.height / 2, -150, 0);
await p.waitForTimeout(600);
ok((await chips.evaluate((el) => el.scrollLeft)) !== before || (await chips.evaluate((el) => el.scrollWidth <= el.clientWidth)), 'occasion chips scroll sideways');
await p.getByRole('radio', { name: 'Something fun' }).tap();
await p.waitForTimeout(700);
const deck = p.locator('.deck');
await deck.scrollIntoViewIfNeeded();
const db = await box(deck);
const lookBefore = await p.locator('#styler').getByText(/Look \d of \d/).innerText();
await swipe(db.x + db.width * 0.75, db.y + db.height * 0.5, db.x + db.width * 0.2, db.y + db.height * 0.52);
await p.waitForTimeout(700);
const lookAfter = await p.locator('#styler').getByText(/Look \d of \d/).innerText();
ok(lookBefore !== lookAfter, `swiping the deck deals the next look (${lookBefore} -> ${lookAfter})`);
const y0 = await p.evaluate(() => scrollY);
await scrollGesture(db.x + db.width / 2, db.y + db.height * 0.6, 0, -300);
await p.waitForTimeout(700);
const y1 = await p.evaluate(() => scrollY);
const lookAfterV = await p.locator('#styler').getByText(/Look \d of \d/).innerText();
ok(y1 > y0 + 100 && lookAfterV === lookAfter, `vertical swipe on the deck scrolls the page and does not deal (${Math.round(y1 - y0)}px)`);
await p.getByRole('button', { name: 'Next look' }).tap();
await p.waitForTimeout(600);
ok((await p.locator('#styler').getByText(/Look \d of \d/).innerText()) !== lookAfter, 'Next look button works by tap');

// ---- Hold Request bottom sheet from the sticky bar
await p.evaluate(() => window.scrollTo(0, 1800));
await p.waitForTimeout(400);
const yLock = await p.evaluate(() => scrollY);
await p.locator('.fixed.bottom-0').getByRole('button', { name: 'Hold it for me' }).tap();
const dlg = p.locator('dialog[open]');
await dlg.waitFor();
await p.waitForTimeout(600);
// The sheet must end exactly where the screen's own fixed UI (the sticky bar) ends
// measured in page coordinates: Playwright's boundingBox is offset while the emulated address bar is hidden
const geo = await p.evaluate(() => ({ sheet: Math.round(document.querySelector('dialog[open]').getBoundingClientRect().bottom), bar: Math.round(document.querySelector('[data-mobile-bar]').getBoundingClientRect().bottom), inner: innerHeight }));
ok(Math.abs(geo.sheet - geo.inner) < 2 && Math.abs(geo.bar - geo.inner) < 2, `Hold Request opens as a bottom sheet flush with the screen (sheet ${geo.sheet}, bar ${geo.bar}, screen ${geo.inner})`);
await scrollGesture(dev.viewport.width / 2, 40, 0, -400); // drag on the backdrop area
await p.waitForTimeout(500);
ok((await p.evaluate(() => scrollY)) === yLock, 'page behind the sheet does not scroll');
await dlg.getByRole('button', { name: 'Dinner out look' }).tap();
await dlg.getByRole('button', { name: 'L', exact: true }).tap();
await dlg.locator('button.chip:not([disabled])').first().tap();
await dlg.getByLabel(/first name/i).fill('Ann');
await dlg.getByRole('button', { name: 'Next' }).tap();
await p.waitForTimeout(400);
const send = dlg.getByRole('link', { name: 'Text my request to Style by Dawn' });
await send.scrollIntoViewIfNeeded();
const sb = await box(send);
ok(sb && sb.y + sb.height <= dev.viewport.height && sb.y >= 0, 'send button is reachable inside the sheet');
const href = await send.getAttribute('href');
ok(href.startsWith('sms:+13014613147?&body=Hi%20Dawn!'), 'send button is a real sms: link');
await p.screenshot({ path: `${out}/hold-sheet-review.png` });
await p.mouse.click(dev.viewport.width / 2, 20); // tap the backdrop
await p.waitForTimeout(400);
ok((await p.locator('dialog[open]').count()) === 0, 'tapping the backdrop closes the sheet');
ok(await p.evaluate(() => document.documentElement.style.overflow === ''), 'page scroll unlocked after closing');

// ---- FAQ accordion by tap
const q = p.getByText('What are your hours?');
await q.scrollIntoViewIfNeeded();
await q.tap();
await p.waitForTimeout(300);
ok(await p.getByText('Tuesday to Saturday 10 AM to 7 PM, Sunday 11 AM to 5 PM. Closed Monday.').isVisible(), 'FAQ opens on tap');

// ---- Back to top
const btt = p.getByRole('button', { name: 'Back to top' });
ok(await btt.isVisible(), 'back to top shows after scrolling');
await btt.tap();
await p.waitForTimeout(2500);
ok((await p.evaluate(() => scrollY)) < 5, 'back to top returns to the top');

// ---- Menu: open, navigate, closes, scroll unlocked
await p.getByRole('button', { name: 'Open menu' }).tap();
const menu = p.locator('dialog[open][aria-label=Menu]');
await menu.waitFor();
ok((await box(menu)).height >= dev.viewport.height - 1, 'menu is a full-screen sheet');
await menu.getByRole('link', { name: 'Visit' }).tap();
await p.waitForURL('**/visit');
await p.waitForTimeout(700);
ok((await p.locator('dialog[open]').count()) === 0, 'menu closes after navigating');
ok(await p.evaluate(() => document.documentElement.style.overflow === ''), 'page scroll unlocked after the menu');

// ---- /visit: #contact jump, map, inline hold
await p.getByRole('link', { name: 'Ask Dawn to hold something' }).tap();
await p.waitForTimeout(1200);
const ct = await p.evaluate(() => document.getElementById('contact-title').getBoundingClientRect().top);
ok(ct > 64 && ct < 300, `#contact lands below the sticky header (heading at ${Math.round(ct)}px)`);
const inlineChip = p.locator('#contact').getByRole('button', { name: 'Weekend easy look' });
await inlineChip.tap();
ok(await p.locator('#contact').getByText('Step 2 of 3').isVisible(), 'inline Hold Request advances by tap');
await p.getByRole('button', { name: 'Show the map' }).scrollIntoViewIfNeeded();
await p.getByRole('button', { name: 'Show the map' }).tap();
await p.waitForTimeout(800);
ok((await p.locator('iframe[title^="Map"]').count()) === 1, 'map loads on tap');

// ---- /new: filters, lightbox swipe and close
await p.goto(base + '/new', { waitUntil: 'networkidle' });
await p.getByRole('button', { name: 'Dresses' }).tap();
await p.waitForTimeout(300);
ok((await p.locator('ul.columns-2 > li').count()) === 4, 'Dresses filter shows 4 pieces');
await p.getByRole('button', { name: /Open a larger photo/ }).first().tap();
const lb = p.locator('dialog[open]');
await lb.waitFor();
const l1 = await lb.getAttribute('aria-label');
await swipe(dev.viewport.width * 0.85, dev.viewport.height * 0.45, dev.viewport.width * 0.15, dev.viewport.height * 0.46);
await p.waitForTimeout(400);
const l2 = await lb.getAttribute('aria-label');
ok(l1 !== l2, `lightbox swipes to the next photo (${l1.split(':')[0]} -> ${l2.split(':')[0]})`);
await p.screenshot({ path: `${out}/lightbox.png` });
await lb.getByRole('button', { name: 'Close the photo' }).tap();
await p.waitForTimeout(300);
ok((await p.locator('dialog[open]').count()) === 0, 'lightbox closes');

// ---- zoom is never blocked
const vp = await p.evaluate(() => document.querySelector('meta[name=viewport]')?.content);
ok(!/maximum-scale|user-scalable=no/.test(vp), `pinch zoom allowed (${vp})`);
// The browser skips a page crossfade with this rejection when the address bar moves mid-navigation.
// Navigation is unaffected and TransitionGuard keeps it out of the console, so it is not a failure.
const real = errs.filter((e) => !/Transition was aborted because of invalid state/.test(e));
ok(real.length === 0, `no page errors ${real.join(' | ')}${errs.length > real.length ? ` (${errs.length - real.length} skipped page crossfade, benign)` : ''}`);

await b.close();
console.log(fails ? `${fails} FAILURE(S)` : 'All mobile interactions passed.');
process.exit(fails ? 1 : 0);
