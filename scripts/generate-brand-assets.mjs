// Regenerates the icons derived from the brush S (assets/brand/s-mark.png):
//   app/favicon.ico           16/32/48px PNG-in-ICO, S on a washi tile
//   app/apple-icon.png        180px, full washi square (iOS rounds it)
//   public/brand/s-mark.webp  transparent signature for the colophon
//
// Run with: node scripts/generate-brand-assets.mjs
// sharp is not a direct dependency; it ships with Next.js, so it is resolved
// from there.

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [ path.dirname(require.resolve("next/package.json")) ] }),
);

const MASTER = "assets/brand/s-mark.png";
// --background (washi) from app/globals.css, as hex.
const WASHI = "#f4f0e7";

// The S sits on a washi tile so it stays visible on dark tab strips.
async function tile(size, { markRatio, radius }) {
  const mark = await sharp(MASTER)
    .trim()
    .resize({ width: Math.round(size * markRatio), height: Math.round(size * markRatio), fit: "inside" })
    .png()
    .toBuffer();
  const { width, height } = await sharp(mark).metadata();
  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius * size}" fill="${WASHI}"/></svg>`,
  );

  return sharp(background)
    .composite([ { input: mark, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) } ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ICO container with PNG-compressed entries (supported by every current browser).
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([ header, ...images.map((image) => image.data) ]);
}

const favicons = [];
for (const size of [ 16, 32, 48 ]) {
  favicons.push({ size, data: await tile(size, { markRatio: 0.8, radius: 0.2 }) });
}
writeFileSync("app/favicon.ico", ico(favicons));

writeFileSync("app/apple-icon.png", await tile(180, { markRatio: 0.66, radius: 0 }));

await sharp(MASTER)
  .trim()
  .resize({ height: 96 })
  .webp({ quality: 90, alphaQuality: 95 })
  .toFile("public/brand/s-mark.webp");

console.log("Brand assets written: app/favicon.ico, app/apple-icon.png, public/brand/s-mark.webp");
