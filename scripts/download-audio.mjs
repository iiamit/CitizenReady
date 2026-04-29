/**
 * Downloads USCIS civics test audio files from the CDN into public/audio/.
 * Skips files that already exist. Safe to re-run.
 * Node 18+ required (uses native fetch).
 */
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'audio');

const BASE = 'https://www.uscis.gov/sites/default/files/document/audio';
const UNDERSCORE_TRACKS = new Set([28, 29, 39, 40, 46, 47, 51]);

// All unique track numbers referenced by AUDIO_TRACK_MAP in audio-manifest.js
const TRACKS = [
   1,  2,  7, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
  43, 44, 47, 48, 52, 55, 58, 59, 60, 61, 62, 63, 67, 68, 71, 72,
  73, 75, 76, 78, 80, 83, 85, 86, 87, 94, 95, 96, 97, 98,
];

function cdnUrl(track) {
  if (track === 100) return `${BASE}/100.mp3.mp3`;
  const pad = String(track).padStart(2, '0');
  if (UNDERSCORE_TRACKS.has(track)) return `${BASE}/Track_${track}.mp3`;
  return `${BASE}/Track%20${pad}.mp3`;
}

export function localAudioName(track) {
  return `track-${String(track).padStart(2, '0')}.mp3`;
}

async function download(track, retries = 3) {
  const dest = join(OUT_DIR, localAudioName(track));
  if (existsSync(dest)) return 'skip';

  const url = cdnUrl(track);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(dest, buf);
      return 'ok';
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

mkdirSync(OUT_DIR, { recursive: true });

let downloaded = 0, skipped = 0, failed = 0;
for (const track of TRACKS) {
  const pad = String(track).padStart(2, '0');
  try {
    const result = await download(track);
    if (result === 'skip') { skipped++; process.stdout.write('·'); }
    else { downloaded++; process.stdout.write('↓'); }
  } catch {
    failed++;
    process.stdout.write('✗');
    console.error(`\n  Failed: track ${pad}`);
  }
}

console.log(`\nAudio: ${downloaded} downloaded, ${skipped} already present, ${failed} failed (${OUT_DIR})`);
if (failed > 0) process.exit(1);
