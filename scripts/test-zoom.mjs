// 200% zoom and reflow pass: 200% of a 1440 and 1280 screen is a 720 and 640 CSS px viewport; WCAG reflow is 320.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
const b = await chromium.launch();
let ok = true;
fs.mkdirSync('screenshots/tmp', { recursive: true });
for (const w of [720, 640, 320]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 450 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  for (const path of ['/', '/new', '/meet-dawn', '/visit']) {
    await p.goto(base + path, { waitUntil: 'networkidle' });
    const r = await p.evaluate((vw) => {
      const over = document.documentElement.scrollWidth - vw;
      // text clipped by its own box (overflow hidden with scrollWidth > clientWidth)
      const clipped = [...document.querySelectorAll('h1,h2,h3,p,a,button,li,dt,dd')].filter((el) => {
        const cs = getComputedStyle(el);
        return cs.overflowX === 'hidden' && el.clientWidth > 2 && el.scrollWidth > el.clientWidth + 1 && el.offsetParent !== null;
      }).map((el) => el.textContent.trim().slice(0, 40));
      return { over, clipped };
    }, w);
    const bad = r.over > 0 || r.clipped.length;
    if (bad) ok = false;
    console.log(`${w}px ${path}: ${r.over > 0 ? `HORIZONTAL SCROLL ${r.over}px` : 'no horizontal scroll'}${r.clipped.length ? `, clipped: ${r.clipped.join(' | ')}` : ''}`);
    if (path === '/' && w === 720) await p.screenshot({ path: 'screenshots/tmp/zoom200-home.png' });
  }
  await ctx.close();
}
await b.close();
console.log(ok ? 'Zoom pass: OK' : 'Zoom pass: PROBLEMS');
process.exit(ok ? 0 : 1);
