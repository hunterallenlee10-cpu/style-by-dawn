// Screenshots at 1440 and 375. Usage: node scripts/shoot.mjs [--base URL] [--full] [--out dir] [--scale N] /path:name ...
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
let base = 'http://localhost:3000', full = false, out = 'screenshots/tmp', scale = 1, widths = [1440, 375], wait = 1400, height = null;
const targets = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--base') base = args[++i];
  else if (a === '--full') full = true;
  else if (a === '--out') out = args[++i];
  else if (a === '--scale') scale = Number(args[++i]);
  else if (a === '--widths') widths = args[++i].split(',').map(Number);
  else if (a === '--wait') wait = Number(args[++i]);
  else if (a === '--height') height = Number(args[++i]);
  else targets.push(a);
}
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: height ?? (w < 500 ? 812 : 900) }, deviceScaleFactor: scale, isMobile: w < 500, hasTouch: w < 500, reducedMotion: full ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const t of targets) {
    const [path, name = path.replace(/\W+/g, '-') || 'home'] = t.split(':');
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(wait);
    if (full) {
      // walk down the page so scroll-driven reveals and lazy images settle
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(60); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }
    const file = `${out}/${name}-${w}.png`;
    await page.screenshot({ path: file, fullPage: full });
    const overflow = await page.evaluate((vw) => Math.max(document.documentElement.scrollWidth, window.innerWidth) - vw, w);
    console.log(file, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : 'no overflow');
  }
  if (errors.length) console.log(`console errors at ${w}:`, [...new Set(errors)].slice(0, 8));
  await ctx.close();
}
await browser.close();
