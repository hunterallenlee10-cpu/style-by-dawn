// Runs Lighthouse (the locally installed version) against a running production server.
// Usage: node scripts/lighthouse.mjs <label> [base]   -> .lighthouse/<label>-<page>-<formfactor>.json
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const label = process.argv[2] || 'run';
const base = (process.argv[3] || 'http://localhost:3000').replace(/\/$/, '');
const chrome = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const pages = process.env.LH_PAGES ? process.env.LH_PAGES.split(',') : ['/', '/new', '/meet-dawn', '/visit'];
fs.mkdirSync('.lighthouse', { recursive: true });
const rows = [];
for (const form of process.env.LH_FORMS ? process.env.LH_FORMS.split(',') : ['mobile', 'desktop']) {
  for (const p of pages) {
    const name = p === '/' ? 'home' : p.slice(1);
    const out = `.lighthouse/${label}-${name}-${form}.json`;
    const args = [
      'lighthouse', base + p, '--quiet', '--output=json', `--output-path=${out}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      ...(form === 'desktop' ? ['--preset=desktop'] : []),
    ];
    execFileSync('npx', args, { env: { ...process.env, CHROME_PATH: chrome }, stdio: ['ignore', 'ignore', 'inherit'] });
    const r = JSON.parse(fs.readFileSync(out, 'utf8'));
    const s = (k) => Math.round(r.categories[k].score * 100);
    const failing = Object.values(r.audits)
      .filter((a) => a.score !== null && a.score < 1 && ['binary', 'numeric'].includes(a.scoreDisplayMode))
      .filter((a) => r.categories.seo.auditRefs.some((x) => x.id === a.id) || r.categories.accessibility.auditRefs.some((x) => x.id === a.id) || r.categories['best-practices'].auditRefs.some((x) => x.id === a.id))
      .map((a) => a.id);
    rows.push({ page: p, form, perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo'), lcp: r.audits['largest-contentful-paint'].displayValue, cls: r.audits['cumulative-layout-shift'].displayValue, tbt: r.audits['total-blocking-time'].displayValue, failing: failing.join(', ') });
  }
}
console.log(`Lighthouse ${JSON.parse(fs.readFileSync(`.lighthouse/${label}-${pages[0] === '/' ? 'home' : pages[0].slice(1)}-${process.env.LH_FORMS ? process.env.LH_FORMS.split(',')[0] : 'mobile'}.json`, 'utf8')).lighthouseVersion} (${label}, ${base})`);
console.log('| Page | Form | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Failing (a11y/BP/SEO) |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) console.log(`| ${r.page} | ${r.form} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} | ${r.failing || 'none'} |`);
