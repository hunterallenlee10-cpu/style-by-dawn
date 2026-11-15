// Usage: node scripts/test-slow-font-rail.mjs [base]
// Rail tap during a late font swap: fonts held back 2.5 s, tap at ~1 s, deck must still land in view.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const { defaultBrowserType: _b, ...dev } = devices['iPhone SE'];
const b = await chromium.launch();
const ctx = await b.newContext({ ...dev });
const p = await ctx.newPage();
await p.route('**/*.woff2', async (r) => { await new Promise((res) => setTimeout(res, 2500)); await r.continue(); });
await p.goto((process.argv[2] || 'http://localhost:3000') + '/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1000);
await p.getByRole('button', { name: /Pink plaid weather/ }).tap();
await p.waitForTimeout(3500);
const r = await p.evaluate(() => ({ deck: Math.round(document.querySelector('.deck').getBoundingClientRect().top), chips: Math.round(document.getElementById('styler-chips').getBoundingClientRect().top), vh: innerHeight }));
console.log(JSON.stringify(r), r.chips > 60 && r.chips < 140 ? 'OK: lands on the chips with the deck below' : 'MISSED');
await b.close();
