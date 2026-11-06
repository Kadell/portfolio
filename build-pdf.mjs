// Renders resume/index.html to assets/George_Kulick_Resume.pdf using the
// print stylesheet. Borrows Playwright from the sibling career-ops install
// so this repo stays dependency-free.
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(here, '..', 'career-ops', 'package.json'));
const { chromium } = require('playwright');

const input = resolve(here, 'resume', 'index.html');
const output = resolve(here, 'assets', 'George_Kulick_Resume.pdf');
mkdirSync(dirname(output), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(input).href, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: output, format: 'Letter', printBackground: true, preferCSSPageSize: true });
const pages = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight / 1056));
await browser.close();
console.log(`wrote ${output} (~${pages} page(s) by height estimate)`);
