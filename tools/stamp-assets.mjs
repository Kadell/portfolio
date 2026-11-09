// Appends a content hash (?v=xxxxxxxx) to every reference to a cacheable
// asset, so a changed file gets a new URL and neither the browser nor
// Cloudflare's edge can keep serving the old one. Idempotent; run after
// editing styles.css or anything under assets/, and before committing.
//
// Two passes: first the JS config files that reference assets (their own hash
// changes when a reference inside them changes), then the HTML pages.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(relative(root, p).split('\\').join('/'));
  }
  return out;
}

const ASSETS = ['styles.css', ...walk(resolve(root, 'assets'))];
const CONFIGS = ['assets/projects.js'];                       // stamped first
const PAGES = ['index.html', '404.html', 'resume/index.html']; // stamped second

const hash = p => createHash('sha256').update(readFileSync(resolve(root, p))).digest('hex').slice(0, 8);
const esc = s => s.replace(/[.$]/g, '\\$&');

function stampFile(page, assets) {
  const file = resolve(root, page);
  if (!existsSync(file)) return;
  let text = readFileSync(file, 'utf8');
  const before = text;
  for (const asset of assets) {
    if (asset === page) continue;
    const name = esc(asset.split('/').pop());
    // the bare filename at the end of an attribute value or JS string, with or without an old ?v=
    const re = new RegExp('(' + name + ')(\\?v=[0-9a-f]{8})?(?=["\'])', 'g');
    text = text.replace(re, '$1?v=' + hash(asset));
  }
  if (text !== before) { writeFileSync(file, text); console.log(`stamped ${page}`); }
}

for (const cfg of CONFIGS) stampFile(cfg, ASSETS.filter(a => a !== cfg));
for (const page of PAGES) stampFile(page, ASSETS);
console.log(JSON.stringify(Object.fromEntries(ASSETS.map(a => [a, hash(a)]))));
