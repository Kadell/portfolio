// Appends a content hash (?v=xxxxxxxx) to every reference to a cacheable
// asset in the HTML files, so a changed file gets a new URL and neither the
// browser nor Cloudflare's edge can keep serving the old one. Idempotent;
// run after editing styles.css, assets/*.js, or replacing an asset file.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = ['styles.css', 'assets/player.js', 'assets/jarvis.mp3', 'assets/jarvis.peaks.json', 'assets/og.png', 'assets/George_Kulick_Resume.pdf'];
const PAGES = ['index.html', '404.html', 'resume/index.html'];

const hash = p => createHash('sha256').update(readFileSync(resolve(root, p))).digest('hex').slice(0, 8);
const stamps = Object.fromEntries(ASSETS.filter(a => existsSync(resolve(root, a))).map(a => [a, hash(a)]));

for (const page of PAGES) {
  const file = resolve(root, page);
  if (!existsSync(file)) continue;
  let html = readFileSync(file, 'utf8');
  const before = html;
  for (const [asset, v] of Object.entries(stamps)) {
    const name = asset.split('/').pop().replace(/[.$]/g, '\\$&');
    // match the bare filename at the end of an href/src/data-*/content attribute value, with or without an old ?v=
    const re = new RegExp('(' + name + ')(\\?v=[0-9a-f]{8})?(?=["\'])', 'g');
    html = html.replace(re, '$1?v=' + v);
  }
  if (html !== before) { writeFileSync(file, html); console.log(`stamped ${page}`); }
}
console.log(JSON.stringify(stamps));
