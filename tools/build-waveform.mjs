// Computes N normalized peak values (0-100) from assets/jarvis.mp3 using ffmpeg
// and writes them to assets/jarvis.peaks.json. The page's player reads that
// file, so the browser never has to decode the audio to draw the waveform.
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const input = resolve(here, '..', 'assets', 'jarvis.mp3');
const output = resolve(here, '..', 'assets', 'jarvis.peaks.json');
const BARS = Number(process.argv[2] || 96);

const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', input, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], { maxBuffer: 1 << 28 });
const samples = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length >> 1);
const per = Math.floor(samples.length / BARS);
const peaks = [];
for (let i = 0; i < BARS; i++) {
  let sum = 0;
  for (let j = i * per; j < (i + 1) * per; j++) sum += samples[j] * samples[j];
  peaks.push(Math.sqrt(sum / per));
}
const max = Math.max(...peaks) || 1;
// gentle compression so quiet speech still reads as a waveform next to louder passages
const norm = peaks.map(p => Math.max(4, Math.round(Math.pow(p / max, 0.6) * 100)));
writeFileSync(output, JSON.stringify(norm));
console.log(`wrote ${output} (${BARS} bars, ${(samples.length / 8000).toFixed(1)}s)`);
