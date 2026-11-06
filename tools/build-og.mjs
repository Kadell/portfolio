// Renders tools/og.html to assets/og.png (1200x630) for link previews.
// Same borrowed-Playwright setup as build-pdf.mjs.
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(here, '..', '..', 'career-ops', 'package.json'));
const { chromium } = require('playwright');

const input = resolve(here, 'og.html');
const output = resolve(here, '..', 'assets', 'og.png');
mkdirSync(dirname(output), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(input).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: output, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(`wrote ${output}`);
