# George Kulick · portfolio site

Static, zero-dependency site: `index.html` + `styles.css` + `resume/`. Deploys anywhere that serves files (GitHub Pages, Cloudflare Pages, Netlify).

## Build the resume page

The resume page is generated from the canonical CV in the sibling `career-ops/cv.md`, never edited by hand:

```bash
node tools/build-resume.mjs
```

Then render the PDF (uses the print stylesheet; borrows Playwright from the sibling `career-ops/` install):

```bash
node tools/build-pdf.mjs
```

## After changing CSS, JS or any asset

`styles.css` and everything under `assets/` are cached for a day or more by browsers and by Cloudflare's edge, so the HTML references them with a content hash (`styles.css?v=b79f984f`). Run this after editing a stylesheet or script, replacing a media file, or regenerating the resume page or PDF, and before committing:

```bash
node tools/stamp-assets.mjs
```

Without it a deploy ships new HTML with the old stylesheet.

## Content rules

- Every claim on the site traces to `career-ops/cv.md` or `config/profile.yml`. No numbers that are not there.
- Case studies: diagrams only, never client screenshots.
- AI agent builds: one cropped screenshot or short clip each, nothing that shows application data, contacts or comp.
- Bracketed `[PLACEHOLDERS]` are deliberate and must be filled or removed before publishing.

## Placeholders still open

- `[YOUR-DOMAIN]` in `index.html` (OG tags, JSON-LD)
- `[YOUR-GITHUB]` footer link
- Jarvis card copy and the career-ops screenshot slot

## Rebuild the link-preview image

`assets/og.png` (1200×630) is rendered from `tools/og.html`, which reuses the site's own stylesheet and fonts:

```bash
node tools/build-og.mjs
```

## Jarvis voice demo

`assets/jarvis.mp3` plays through a small waveform player (`assets/player.js`, styles in `styles.css`). The bars are precomputed so the browser never decodes audio to draw them; after replacing the recording, run:

```bash
node tools/build-waveform.mjs
```

## Project showcases (AI agent builds)

Each card's **Explore** button opens one reusable modal (`assets/showcase.js`, a native `<dialog>`) rendered from `assets/projects.js`. To add a project: add an object there (title, subtitle, badges, sections, optional `gallery` of 16:9 SVGs, optional `screenshots`, authorship, links) and give the card a button with `data-project="<id>"`. The Career Ops infographics live in `assets/infographics/` as hand-written SVGs on a 1600×900 canvas; they use the site's palette and fonts and are inlined at runtime so the fonts apply. Deep link: `/#project=careerops`.
