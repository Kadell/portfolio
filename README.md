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

## Content rules

- Every claim on the site traces to `career-ops/cv.md` or `config/profile.yml`. No numbers that are not there.
- Case studies: diagrams only, never client screenshots.
- AI agent builds: one cropped screenshot or short clip each, nothing that shows application data, contacts or comp.
- Bracketed `[PLACEHOLDERS]` are deliberate and must be filled or removed before publishing.

## Placeholders still open

- `[YOUR-DOMAIN]` in `index.html` (OG tags, JSON-LD)
- `[YOUR-GITHUB]` footer link
- `[ELEVENLABS-AGENT-ID]` widget
- Jarvis card copy and both screenshot slots

## Rebuild the link-preview image

`assets/og.png` (1200×630) is rendered from `tools/og.html`, which reuses the site's own stylesheet and fonts:

```bash
node tools/build-og.mjs
```
