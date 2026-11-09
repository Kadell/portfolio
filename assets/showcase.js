// Reusable project showcase: one <dialog> that renders any entry from
// window.PORTFOLIO_PROJECTS (assets/projects.js). Opened by any element with
// data-project="<id>". Native <dialog> gives us Escape-to-close, a modal
// backdrop and background inertness; this file adds backdrop click, focus
// restoration, the infographic gallery (tabs + previous/next + enlarge) and
// scroll locking.
(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const byId = Object.fromEntries(projects.map(p => [p.id, p]));
  const svgCache = new Map();

  const el = (tag, attrs = {}, children = []) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of [].concat(children)) if (c) n.append(c);
    return n;
  };

  // ---- dialog shells -------------------------------------------------------
  const dialog = el('dialog', { class: 'showcase', 'aria-labelledby': 'sc-title' });
  const lightbox = el('dialog', { class: 'lightbox', 'aria-label': 'Enlarged infographic' });
  document.body.append(dialog, lightbox);

  let opener = null;

  function lockScroll(on) { document.documentElement.classList.toggle('modal-open', on); }

  for (const d of [dialog, lightbox]) {
    // backdrop click: the dialog element itself is the target only when the
    // click lands outside its content box
    d.addEventListener('click', e => {
      const r = d.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (e.target === d && !inside) d.close();
    });
  }
  dialog.addEventListener('close', () => {
    lockScroll(false);
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  });
  lightbox.addEventListener('close', () => {
    const back = lightboxReturn || dialog.querySelector('.sc-enlarge');
    lightboxReturn = null;
    if (back && document.contains(back)) back.focus();
  });

  // ---- SVG loading ---------------------------------------------------------
  async function loadSvg(src) {
    if (!svgCache.has(src)) {
      svgCache.set(src, fetch(src).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }));
    }
    return svgCache.get(src);
  }

  function svgNode(markup, alt) {
    const tpl = document.createElement('template');
    tpl.innerHTML = markup.trim();
    const svg = tpl.content.querySelector('svg');
    if (!svg) return el('p', { class: 'sc-fallback', text: alt });
    svg.removeAttribute('width'); svg.removeAttribute('height');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', alt);
    return svg;
  }

  // ---- image lightbox (card thumbnails, modal screenshots) -----------------
  function openImage(src, alt, caption, returnTo) {
    const close = el('button', { type: 'button', class: 'sc-close', 'aria-label': 'Close enlarged view', html: '&times;' });
    close.addEventListener('click', () => lightbox.close());
    const fig = el('figure', { class: 'lb-figure lb-img' }, [el('img', { src, alt })]);
    lightbox.classList.add('is-image');
    lightbox.replaceChildren(close, fig, el('p', { class: 'lb-caption mono', text: caption || alt }));
    lightboxReturn = returnTo || null;
    lightbox.showModal();
    close.focus();
  }
  let lightboxReturn = null;
  document.addEventListener('click', e => {
    const z = e.target.closest('.zoom[data-zoom]');
    if (!z) return;
    e.preventDefault();
    const img = z.querySelector('img');
    openImage(z.dataset.zoom, img ? img.alt : '', z.dataset.caption || z.closest('figure')?.querySelector('figcaption')?.textContent || '', z);
  });

  // ---- gallery -------------------------------------------------------------
  function gallery(items) {
    let index = 0;
    const tabs = items.map((it, i) => el('button', {
      type: 'button', role: 'tab', class: 'sc-tab', id: `sc-tab-${it.id}`,
      'aria-selected': i === 0 ? 'true' : 'false', 'aria-controls': 'sc-panel', tabindex: i === 0 ? '0' : '-1', text: it.label
    }));
    const tablist = el('div', { class: 'sc-tabs', role: 'tablist', 'aria-label': 'Infographics' }, tabs);
    const figure = el('figure', { class: 'sc-figure' });
    const caption = el('figcaption', { class: 'sc-caption' });
    const panel = el('div', { class: 'sc-panel', id: 'sc-panel', role: 'tabpanel', 'aria-labelledby': tabs[0].id }, [figure, caption]);
    const prev = el('button', { type: 'button', class: 'sc-nav sc-prev', 'aria-label': 'Previous infographic', html: '&#8592;' });
    const next = el('button', { type: 'button', class: 'sc-nav sc-next', 'aria-label': 'Next infographic', html: '&#8594;' });
    const counter = el('span', { class: 'sc-counter mono' });
    const enlarge = el('button', { type: 'button', class: 'btn sc-enlarge', text: 'Enlarge' });
    const controls = el('div', { class: 'sc-controls' }, [prev, counter, next, enlarge]);
    const root = el('div', { class: 'sc-gallery' }, [tablist, panel, controls]);

    async function show(i, focusTab) {
      index = (i + items.length) % items.length;
      const it = items[index];
      tabs.forEach((t, j) => {
        const on = j === index;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tabs[index].id);
      counter.textContent = `${index + 1} / ${items.length}`;
      caption.textContent = it.title;
      figure.replaceChildren(el('div', { class: 'sc-loading mono', text: 'loading…' }));
      try {
        const markup = await loadSvg(it.src);
        if (items[index] !== it) return; // user moved on while loading
        figure.replaceChildren(svgNode(markup, it.alt));
      } catch {
        figure.replaceChildren(el('img', { src: it.src, alt: it.alt }));
      }
      if (focusTab) tabs[index].focus();
    }

    tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
    tablist.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1, true); }
      if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      if (e.key === 'End') { e.preventDefault(); show(items.length - 1, true); }
    });
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    enlarge.addEventListener('click', async () => {
      const it = items[index];
      const close = el('button', { type: 'button', class: 'sc-close', 'aria-label': 'Close enlarged view', html: '&times;' });
      close.addEventListener('click', () => lightbox.close());
      const fig = el('figure', { class: 'lb-figure' }, [el('div', { class: 'sc-loading mono', text: 'loading…' })]);
      lightbox.classList.remove('is-image');
      lightbox.replaceChildren(close, fig, el('p', { class: 'lb-caption mono', text: it.title }));
      lightbox.showModal();
      close.focus();
      try { fig.replaceChildren(svgNode(await loadSvg(it.src), it.alt)); }
      catch { fig.replaceChildren(el('img', { src: it.src, alt: it.alt })); }
    });

    show(0);
    return root;
  }

  // ---- modal body ----------------------------------------------------------
  function render(p) {
    const close = el('button', { type: 'button', class: 'sc-close', 'aria-label': 'Close' , html: '&times;' });
    close.addEventListener('click', () => dialog.close());

    const head = el('header', { class: 'sc-head' }, [
      el('div', { class: 'sc-head-text' }, [
        el('p', { class: 'mono sc-eyebrow', text: p.eyebrow }),
        el('h2', { id: 'sc-title', class: 'sc-title', text: p.title }),
        p.subtitle && el('p', { class: 'sc-subtitle', text: p.subtitle })
      ]),
      close
    ]);

    const body = el('div', { class: 'sc-body' });

    if (p.badges?.length) body.append(el('ul', { class: 'sc-badges', 'aria-label': 'Technology' }, p.badges.map(b => el('li', { text: b }))));
    if (p.gallery?.length) body.append(gallery(p.gallery));

    if (p.screenshots?.length) {
      body.append(el('div', { class: 'sc-shots' }, p.screenshots.map(s => el('figure', { class: 'sc-shot' }, [
        el('button', { type: 'button', class: 'zoom', 'data-zoom': s.src, 'aria-label': 'Enlarge: ' + s.alt }, [
          el('img', { src: s.src, alt: s.alt, loading: 'lazy', width: s.width || '1920', height: s.height || '1080', style: s.position ? 'object-position:' + s.position : null })
        ]),
        s.caption && el('figcaption', { text: s.caption })
      ]))));
    }

    const grid = el('div', { class: 'sc-sections' });
    for (const s of p.sections || []) {
      const sec = el('section', { class: 'sc-section' }, [el('h3', { text: s.heading })]);
      for (const para of s.paragraphs || []) sec.append(el('p', { text: para }));
      if (s.items?.length) sec.append(el('ul', { class: 'card-list' }, s.items.map(i => el('li', { text: i }))));
      grid.append(sec);
    }
    body.append(grid);

    if (p.authorship) {
      body.append(el('div', { class: 'split sc-split' }, [
        el('div', {}, [el('span', { class: 'label', text: 'I designed' }), document.createTextNode(p.authorship.designed)]),
        el('div', {}, [el('span', { class: 'label', text: 'Agents wrote' }), document.createTextNode(p.authorship.wrote)])
      ]));
      if (p.authorship.credit) body.append(el('p', { class: 'sc-credit', text: p.authorship.credit }));
    }
    if (p.note) body.append(el('p', { class: 'sc-credit', text: p.note }));
    if (p.links?.length) body.append(el('div', { class: 'actions sc-links' }, p.links.map(l => el('a', { class: 'btn', href: l.href, rel: 'noopener', text: l.label }))));

    dialog.replaceChildren(head, body);
    return close;
  }

  function open(id, trigger) {
    const p = byId[id];
    if (!p) return;
    opener = trigger || document.activeElement;
    const close = render(p);
    lockScroll(true);
    dialog.showModal();
    dialog.scrollTop = 0;
    close.focus();
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-project]');
    if (btn) { e.preventDefault(); open(btn.dataset.project, btn); }
  });

  // deep link: #project=careerops
  const m = location.hash.match(/^#project=([\w-]+)$/);
  if (m && byId[m[1]]) open(m[1], document.querySelector(`[data-project="${m[1]}"]`));
})();
