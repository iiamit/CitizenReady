/**
 * One-time script: optimizes raw lesson images extracted from the USCIS PDF.
 * Run from the project root after extract-lesson-images.py:
 *   node scripts/optimize-images.js
 *
 * Resizes to max 480px wide, converts to JPEG at 75% quality.
 * Input:  scripts/raw_images/<category>/<name>.*
 * Output: public/images/lesson/<category>/<name>.jpg
 */

import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dirname, 'raw_images');
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'lesson');

const MAX_WIDTH = 480;
const JPEG_QUALITY = 75;

async function optimizeAll() {
  let saved = 0;
  let errors = 0;

  const categories = readdirSync(RAW_DIR).filter(f =>
    statSync(join(RAW_DIR, f)).isDirectory()
  );

  for (const cat of categories) {
    const catIn = join(RAW_DIR, cat);
    const catOut = join(OUT_DIR, cat);
    mkdirSync(catOut, { recursive: true });

    const files = readdirSync(catIn);
    for (const file of files) {
      const inPath = join(catIn, file);
      // Always output as .jpg regardless of input extension
      const outName = basename(file).replace(/\.[^.]+$/, '.jpg');
      const outPath = join(catOut, outName);

      try {
        await sharp(inPath)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, progressive: true })
          .toFile(outPath);

        const sizeBefore = statSync(inPath).size;
        const sizeAfter = statSync(outPath).size;
        console.log(`  OK  ${cat}/${outName}  ${Math.round(sizeBefore/1024)}KB → ${Math.round(sizeAfter/1024)}KB`);
        saved++;
      } catch (err) {
        console.error(`  ERR ${cat}/${file}: ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`\nDone. Optimized: ${saved}, Errors: ${errors}`);
  console.log(`Output: ${OUT_DIR}`);
}

optimizeAll().catch(console.error);
