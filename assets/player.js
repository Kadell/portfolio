// Minimal waveform audio player. Peaks are precomputed (tools/build-waveform.mjs)
// so nothing is decoded in the browser; this only draws bars and drives <audio>.
(function () {
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  async function mount(root) {
    const src = root.dataset.src;
    const btn = root.querySelector('.play');
    const wave = root.querySelector('.wave');
    const cur = root.querySelector('.cur');
    const dur = root.querySelector('.dur');

    let peaks = [];
    try { peaks = await (await fetch(root.dataset.peaks)).json(); } catch { peaks = new Array(64).fill(30); }
    const bars = peaks.map(p => {
      const b = document.createElement('span');
      b.className = 'bar';
      b.style.height = `${p}%`;
      wave.appendChild(b);
      return b;
    });

    const audio = new Audio(src);
    audio.preload = 'metadata';
    audio.addEventListener('loadedmetadata', () => { dur.textContent = fmt(audio.duration); });

    let raf = 0;
    function paint() {
      const d = audio.duration || 1;
      const ratio = audio.currentTime / d;
      const lit = Math.round(ratio * bars.length);
      bars.forEach((b, i) => b.classList.toggle('on', i < lit));
      cur.textContent = fmt(audio.currentTime);
      wave.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
      if (!audio.paused) raf = requestAnimationFrame(paint);
    }
    function setPlaying(on) {
      root.classList.toggle('playing', on);
      btn.setAttribute('aria-label', on ? 'Pause' : 'Play');
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(paint); else paint();
    }
    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => { audio.currentTime = 0; setPlaying(false); });

    btn.addEventListener('click', () => { audio.paused ? audio.play() : audio.pause(); });

    function seekTo(ratio) {
      if (!audio.duration) return;
      audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
      paint();
    }
    wave.addEventListener('click', e => {
      const r = wave.getBoundingClientRect();
      seekTo((e.clientX - r.left) / r.width);
    });
    wave.addEventListener('keydown', e => {
      const step = 0.05;
      const d = audio.duration || 1;
      if (e.key === 'ArrowRight') { e.preventDefault(); seekTo(audio.currentTime / d + step); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); seekTo(audio.currentTime / d - step); }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); btn.click(); }
    });
  }

  document.querySelectorAll('.player').forEach(mount);
})();
