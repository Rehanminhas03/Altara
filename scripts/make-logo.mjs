/**
 * Bake a transparent-background PNG from the chrome-on-black logo.jpeg.
 * Alpha is derived from luminance (black background -> transparent, chrome ->
 * opaque) with a smooth ramp so edges stay clean on ANY background colour.
 */
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public/logo/logo.jpeg");
const out = join(root, "public/logo/altara-logo.png");

const alpha = await sharp(src).grayscale().linear(2.8, -30).toColourspace("b-w").toBuffer();

await sharp(src)
  .joinChannel(alpha) // RGB + luminance-alpha -> RGBA
  .trim({ threshold: 10 }) // crop the now-transparent margin
  .png()
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`✓ ${out}  (${meta.width}×${meta.height}, alpha: ${meta.hasAlpha})`);
