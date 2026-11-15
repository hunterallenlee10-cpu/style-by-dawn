// Copies the 21 Drive originals from public/images/raw/ to public/images/ at full size.
// Only photo 02 is changed: the left 15% is cropped to remove a faint figure behind the glass (BUILD-SPEC section 0).
// Run: node scripts/prepare-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAW = 'public/images/raw';
const OUT = 'public/images';
const rename = {
  '01-STOREFRONT-sage-style-by-dawn-sign-BEST.jpg': '01-storefront-style-by-dawn-sign.jpg',
};

const files = fs.readdirSync(RAW).filter((f) => f.endsWith('.jpg')).sort();
if (files.length !== 21) {
  console.error(`Expected 21 photos in ${RAW}, found ${files.length}. Ask Hunter for the photos/ folder.`);
  process.exit(1);
}
for (const f of files) {
  const outName = rename[f] ?? f;
  const src = path.join(RAW, f);
  const dest = path.join(OUT, outName);
  if (f.startsWith('02-')) {
    const meta = await sharp(src).metadata();
    const left = Math.round(meta.width * 0.15);
    await sharp(src)
      .extract({ left, top: 0, width: meta.width - left, height: meta.height })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(dest);
  } else {
    fs.copyFileSync(src, dest);
  }
  const m = await sharp(dest).metadata();
  console.log(outName.padEnd(58), `${m.width}x${m.height}`);
}
