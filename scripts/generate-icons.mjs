import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svgPath = join(root, 'resources', 'icon.svg');
const outDir = join(root, 'public', 'icons');

mkdirSync(outDir, { recursive: true });

const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
];

for (const { name, size } of sizes) {
  const outPath = join(outDir, name);
  await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
  console.log(`Generated ${name} (${size}x${size})`);
}

// Also copy 32px as favicon.ico location hint
console.log('Icons generated in public/icons/');
