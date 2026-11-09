Build scripts. Not needed to serve the site; run from the repo root:

    node tools/build-resume.mjs   # regenerates resume/index.html from ../career-ops/cv.md
    node tools/build-pdf.mjs      # renders assets/George_Kulick_Resume.pdf
    node tools/build-og.mjs       # renders assets/og.png (link preview) from tools/og.html
    node tools/build-waveform.mjs  # recomputes assets/jarvis.peaks.json from assets/jarvis.mp3 (needs ffmpeg on PATH)
    node tools/stamp-assets.mjs    # LAST: appends ?v=<hash> to CSS/JS/media URLs so caches refresh on change
