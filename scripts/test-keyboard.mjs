// Keyboard-only pass: Tab through each page and check every focus stop is visible, has a focus style,
// and is not hidden behind the sticky header or the mobile bar. Usage: node scripts/test-keyboard.mjs [base]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
const b = await chromium.launch();
let ok = true;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  for (const path of ['/', '/new', '/meet-dawn', '/visit']) {
    await p.goto(base + path, { waitUntil: 'networkidle' });
    const problems = [];
    let stops = 0, first = '';
    const seen = new Set();
    for (let i = 0; i < 160; i++) {
      await p.keyboard.press('Tab');
      await p.waitForTimeout(30);
      const info = await p.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const styled = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none';
        const cx = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1), cy = Math.min(Math.max(r.top + Math.min(r.height, 40) / 2, 1), innerHeight - 1);
        const top = document.elementFromPoint(cx, cy);
        const covered = top && !el.contains(top) && !top.contains(el) && (top.closest('header') || top.closest('.fixed'));
        const label = (el.getAttribute('aria-label') || el.innerText || el.tagName).trim().slice(0, 40).replace(/\s+/g, ' ');
        return { label, key: label + r.top + el.tagName, visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight, styled, covered: !!covered, footer: !!el.closest('footer') };
      });
      if (!info) continue;
      if (seen.has(info.key)) break;
      seen.add(info.key);
      stops++;
      if (!first) first = info.label;
      if (!info.visible) problems.push(`not in view: ${info.label}`);
      if (!info.styled) problems.push(`no focus style: ${info.label}`);
      if (info.covered) problems.push(`covered by sticky UI: ${info.label}`);
      if (info.footer && info.label.startsWith('Style by Dawn on Instagram')) break;
    }
    console.log(`${w}px ${path}: ${stops} focus stops, first "${first}"${problems.length ? '\n    ' + problems.join('\n    ') : ', all visible with focus style'}`);
    if (problems.length) ok = false;
  }
  await ctx.close();
}
await b.close();
console.log(ok ? 'Keyboard pass: OK' : 'Keyboard pass: PROBLEMS');
process.exit(ok ? 0 : 1);
