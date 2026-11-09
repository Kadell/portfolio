// Builds resume/index.html from career-ops/cv.md (the canonical CV).
// Zero dependencies: handles the markdown subset cv.md uses
// (#/##/### headings, **bold**, *italic*, "- " bullets, paragraphs).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2] ?? resolve(here, '..', '..', 'career-ops', 'cv.md');
const out = resolve(here, '..', 'resume', 'index.html');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/(linkedin\.com\/in\/[\w-]+)/g, '<a href="https://$1">$1</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>');

const lines = readFileSync(src, 'utf8').split(/\r?\n/);
const html = [];
let para = [];
let item = null; // raw text of the open list item (wrapped lines are joined before inline())
let inList = false;
let lastH3 = null;
const flushPara = () => { if (para.length) { html.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
const flushItem = () => { if (item !== null) { html.push(`<li>${inline(item)}</li>`); item = null; } };
const closeList = () => { flushItem(); if (inList) { html.push('</ul>'); inList = false; } };

for (const raw of lines) {
  const line = raw.trimEnd();
  if (/^#\s/.test(line)) { flushPara(); closeList(); html.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
  if (/^##\s/.test(line)) { flushPara(); closeList(); html.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
  if (/^###\s/.test(line)) {
    flushPara(); closeList();
    const h3 = `<h3>${inline(line.slice(4))}</h3>`;
    // consecutive roles at the same employer share one heading (cv.md repeats it per role)
    if (lastH3 !== h3) html.push(h3);
    lastH3 = h3;
    continue;
  }
  if (/^-\s/.test(line)) { flushPara(); flushItem(); if (!inList) { html.push('<ul>'); inList = true; } item = line.slice(2); continue; }
  if (line === '') { flushPara(); closeList(); continue; }
  if (inList && /^\s{2,}\S/.test(raw)) { item += ' ' + line.trim(); continue; }
  // contact lines right under the name get the muted class
  if (html.length && html.length <= 3 && /\|/.test(line)) { html.push(`<p class="contact">${inline(line)}</p>`); continue; }
  para.push(line.trim());
}
flushPara(); closeList();

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Resume · George Kulick</title>
<meta name="description" content="George Kulick, solution architect: 15 years of enterprise conversational AI delivery at LivePerson and Quiq.">
<link rel="canonical" href="https://georgekulick.com/resume/">
<meta property="og:title" content="Resume · George Kulick">
<meta property="og:description" content="George Kulick, solution architect: 15 years of enterprise conversational AI delivery at LivePerson and Quiq.">
<meta property="og:type" content="profile">
<meta property="og:url" content="https://georgekulick.com/resume/">
<meta property="og:image" content="https://georgekulick.com/assets/og.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="George Kulick, solution architect in conversational AI since 2011: I ship enterprise conversational AI.">
<meta property="og:site_name" content="georgekulick.com">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Resume · George Kulick">
<meta name="twitter:description" content="George Kulick, solution architect: 15 years of enterprise conversational AI delivery at LivePerson and Quiq.">
<meta name="twitter:image" content="https://georgekulick.com/assets/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="../styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="wrap site-header">
  <a class="brand" href="../">georgekulick.com</a>
  <nav class="site-nav" aria-label="Primary">
    <a href="../#work">Case studies</a>
    <a href="../#agents">AI agent builds</a>
    <a href="../#how">How I work</a>
    <a href="../#timeline">Timeline</a>
  </nav>
</header>
<main id="main" class="wrap resume">
  <div class="actions" style="margin: 8px 0 24px">
    <a class="btn btn-primary" href="../assets/George_Kulick_Resume.pdf" download>Download PDF</a>
  </div>
${html.join('\n')}
</main>
<footer class="site-footer"><div class="wrap">
  <div>Generated from the canonical CV. Built with Claude Code.</div>
  <div><a href="mailto:gkulick@gmail.com">gkulick@gmail.com</a> · <a href="https://linkedin.com/in/gkulick">linkedin.com/in/gkulick</a></div>
</div></footer>
</body>
</html>
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, page);
console.log(`wrote ${out} from ${src}`);
