// Generates the link-preview image and icons from her real assets. Run: node scripts/make-assets.mjs
// - public/og-image.png (1200x630): Linen, the wordmark, "Be your best you.", photo 01 on the right
// - app/icon.svg, app/apple-icon.png (180), app/favicon.ico (32), public/icon-512.png: Rosewood "S" monogram
import fs from 'node:fs';
import sharp from 'sharp';
import opentype from 'opentype.js';

const C = { linen: '#FAF6F0', petal: '#F3E7E3', mint: '#B8CABD', rose: '#9B4555', espresso: '#2A211E', barnwood: '#6A5A54', seam: '#E5D8D0', green: '#3F5747' };
const load = (p) => opentype.parse(fs.readFileSync(p).buffer.slice(0));
const caslon = load('scripts/fonts/LibreCaslonDisplay-Regular.ttf');
const sans = load('scripts/fonts/InstrumentSans.ttf');

const wm = fs.readFileSync('components/Wordmark.tsx', 'utf8');
const WM_VB = wm.match(/WORDMARK_VIEWBOX = '([^']+)'/)[1].split(' ').map(Number);
const WM_PATHS = [...wm.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
const mono = fs.readFileSync('lib/monogram.ts', 'utf8');
const S_PATH = mono.match(/MONOGRAM_PATH = '([^']+)'/)[1];
const S_BOX = JSON.parse(mono.match(/MONOGRAM_BOX = (\{[^}]+\})/)[1].replace(/(\w+):/g, '"$1":'));

// text -> path data with letter spacing
function textPath(font, text, x, y, size, tracking = 0) {
  let cx = x;
  const out = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    out.push(`<path d="${g.getPath(cx, y, size).toPathData(2)}"/>`);
    cx += (g.advanceWidth / font.unitsPerEm) * size + tracking;
  }
  return { d: out.join(''), width: cx - x - tracking };
}

// ---------- OG image ----------
const W = 1200, H = 630;
const photo = await sharp('public/images/01-storefront-style-by-dawn-sign.jpg').resize(568, 426).jpeg({ quality: 88 }).toBuffer();
const wmW = 330, wmScale = wmW / WM_VB[2], wmH = WM_VB[3] * wmScale;
const headline = textPath(caslon, 'Be your best you.', 72, 0, 62);
const label = textPath(caslon, "WOMEN'S BOUTIQUE IN LEONARDTOWN, MD", 72, 0, 17, 2.4);
const sub = textPath(sans, "Inside Shepherd's Old Field Market, Duke Street", 72, 0, 22);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.linen}"/>
  <rect x="580" y="0" width="620" height="${H}" fill="${C.petal}"/>
  <rect x="598" y="86" width="584" height="458" rx="6" fill="${C.linen}" stroke="${C.seam}" stroke-width="2"/>
  <circle cx="890" cy="100" r="5" fill="${C.petal}" stroke="${C.seam}" stroke-width="1.5"/>
  <g transform="translate(72 ${92 - WM_VB[1] * wmScale}) scale(${wmScale}) translate(${-WM_VB[0]} 0)" fill="${C.espresso}">${WM_PATHS.map((d) => `<path d="${d}"/>`).join('')}</g>
  <g transform="translate(0 ${92 + wmH + 46})" fill="${C.barnwood}">${label.d}</g>
  <g transform="translate(0 ${92 + wmH + 120})" fill="${C.espresso}">${headline.d}</g>
  <rect x="72" y="${92 + wmH + 160}" width="40" height="3" rx="1.5" fill="${C.mint}"/>
  <g transform="translate(0 ${92 + wmH + 206})" fill="${C.espresso}">${sub.d}</g>
</svg>`;
await sharp(Buffer.from(svg)).composite([{ input: photo, left: 606, top: 102 }]).png().toFile('public/og-image.png');

// ---------- Monogram icons ----------
function iconSvg(size, { radius = 0.22, pad = 0.2 } = {}) {
  const inner = size * (1 - pad * 2);
  const scale = inner / Math.max(S_BOX.w, S_BOX.h);
  const tx = (size - S_BOX.w * scale) / 2 - S_BOX.x * scale;
  const ty = (size - S_BOX.h * scale) / 2 - S_BOX.y * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * radius}" fill="${C.petal}"/>
  <path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})" d="${S_PATH}" fill="${C.rose}"/>
</svg>`;
}
fs.writeFileSync('app/icon.svg', iconSvg(64, { pad: 0.14 }));
await sharp(Buffer.from(iconSvg(180, { radius: 0, pad: 0.16 }))).png().toFile('app/apple-icon.png');
await sharp(Buffer.from(iconSvg(512, { radius: 0.18, pad: 0.16 }))).png().toFile('public/icon-512.png');

// favicon.ico: a single 32px PNG inside an ICO container
const png32 = await sharp(Buffer.from(iconSvg(32, { pad: 0.1 }))).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(png32.length, 14); header.writeUInt32LE(22, 18);
fs.writeFileSync('app/favicon.ico', Buffer.concat([header, png32]));
console.log('wrote public/og-image.png, app/icon.svg, app/apple-icon.png, app/favicon.ico, public/icon-512.png');
