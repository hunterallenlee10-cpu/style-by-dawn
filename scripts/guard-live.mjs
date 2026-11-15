// Live-mode build guard. In live mode the build fails if any DRAFT marker, the review placeholder
// card, or a "// TODO: swap" remains in the source. Demo builds pass straight through.
// ALLOW_DRAFT_IN_LIVE=1 skips the guard for a local Lighthouse run only.
import fs from 'node:fs';
import path from 'node:path';

if (process.env.NEXT_PUBLIC_SITE_MODE !== 'live') {
  console.log('guard-live: demo mode, nothing to check.');
  process.exit(0);
}
if (process.env.ALLOW_DRAFT_IN_LIVE === '1') {
  console.warn('guard-live: ALLOW_DRAFT_IN_LIVE=1, DRAFT markers allowed for this local run only. Never deploy this build.');
  process.exit(0);
}
const roots = ['app', 'components', 'lib'];
const hits = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|css|mdx?)$/.test(e.name)) {
      fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (/\bDRAFT\b|data-placeholder|TODO: swap/.test(line)) hits.push(`${p}:${i + 1}: ${line.trim().slice(0, 110)}`);
      });
    }
  }
};
roots.forEach(walk);
if (hits.length) {
  console.error(`guard-live: live build refused. ${hits.length} DRAFT, placeholder or TODO: swap marker(s) remain:\n` + hits.join('\n'));
  process.exit(1);
}
console.log('guard-live: no DRAFT markers. Live build allowed.');
