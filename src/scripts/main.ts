/**
 * Progressive enhancement for the CV site.
 *
 * Astro emits this as one small deferred module per page (no framework, no
 * polyfills). Everything degrades gracefully: without JS the page is complete,
 * only the reveal animation, the mobile menu, the music toggle and the copy
 * button need it.
 */

const LANG_KEY = 'cv-lang';

const doc = document;

/** Signals the inline head script that this module loaded (reveal safety net). */
doc.documentElement.setAttribute('data-ready', '1');

function ready(fn: () => void): void {
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode / storage disabled: ignore */
  }
}

/* --- scroll reveal -------------------------------------------------------- */

function initReveal(): void {
  const items = Array.from(doc.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (items.length === 0) return;

  if (reducedMotion() || typeof IntersectionObserver === 'undefined') {
    items.forEach((item) => item.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add('is-revealed');
        observer.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );

  items.forEach((item) => observer.observe(item));
}

/* --- sticky header state -------------------------------------------------- */

function initHeaderState(): void {
  const header = doc.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  let ticking = false;
  const update = (): void => {
    header.classList.toggle('is-stuck', window.scrollY > 6);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true },
  );

  update();
}

/* --- scroll spy ----------------------------------------------------------- */

function initScrollSpy(): void {
  const links = Array.from(doc.querySelectorAll<HTMLAnchorElement>('[data-spy]'));
  if (links.length === 0 || typeof IntersectionObserver === 'undefined') return;

  const pairs: { link: HTMLAnchorElement; section: HTMLElement }[] = [];
  for (const link of links) {
    const id = (link.getAttribute('href') ?? '').replace(/^#/, '');
    const section = id ? doc.getElementById(id) : null;
    if (section) pairs.push({ link, section });
  }
  if (pairs.length === 0) return;

  const visible = new Set<string>();

  const apply = (): void => {
    for (const { link, section } of pairs) {
      if (visible.has(section.id)) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting) visible.add(id);
        else visible.delete(id);
      }
      apply();
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );

  pairs.forEach(({ section }) => observer.observe(section));
}

/* --- mobile navigation ---------------------------------------------------- */

function initNav(): void {
  const header = doc.querySelector<HTMLElement>('[data-header]');
  const toggle = doc.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  if (!header || !toggle) return;

  const label = doc.querySelector<HTMLElement>('[data-nav-label]');
  const openText = toggle.dataset.labelOpen ?? '';
  const closeText = toggle.dataset.labelClose ?? '';

  const setOpen = (open: boolean): void => {
    header.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? closeText : openText);
    if (label) label.textContent = open ? closeText : openText;
  };

  setOpen(false);
  toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-nav-open')));

  doc.querySelectorAll<HTMLAnchorElement>('[data-nav] a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  const wide = window.matchMedia('(min-width: 900px)');
  wide.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* --- background music (Bilibili embed) ------------------------------------ */

function initMusic(): void {
  const button = doc.querySelector<HTMLButtonElement>('[data-music]');
  const panel = doc.querySelector<HTMLElement>('[data-music-panel]');
  const frameHost = doc.querySelector<HTMLElement>('[data-music-frame]');
  if (!button || !panel || !frameHost) return;

  const closeButton = doc.querySelector<HTMLButtonElement>('[data-music-close]');
  const openLabel = button.dataset.labelOpen ?? '';
  const closeLabel = button.dataset.labelClose ?? '';

  /** The iframe exists only while the panel is open, so nothing loads up-front. */
  const mountPlayer = (): void => {
    if (frameHost.querySelector('iframe')) return;
    const src = frameHost.dataset.src;
    if (!src) return;
    const frame = doc.createElement('iframe');
    frame.src = src;
    frame.title = panel.getAttribute('aria-label') ?? 'Bilibili player';
    frame.loading = 'eager';
    frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    frameHost.appendChild(frame);
  };

  const setOpen = (open: boolean): void => {
    panel.hidden = !open;
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.setAttribute('aria-label', open ? closeLabel : openLabel);
    button.title = open ? closeLabel : openLabel;
    if (open) {
      mountPlayer();
    } else {
      // Removing the frame is the only reliable way to stop cross-origin audio.
      frameHost.replaceChildren();
    }
  };

  button.addEventListener('click', () => setOpen(panel.hidden));
  closeButton?.addEventListener('click', () => {
    setOpen(false);
    button.focus();
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || panel.hidden) return;
    setOpen(false);
    button.focus();
  });

  // A click anywhere else closes the panel (and therefore stops the audio).
  doc.addEventListener('pointerdown', (event) => {
    if (panel.hidden) return;
    const target = event.target;
    if (target instanceof Node && (panel.contains(target) || button.contains(target))) return;
    setOpen(false);
  });

  setOpen(false);
}

/* --- copy e-mail ---------------------------------------------------------- */

function fallbackCopy(value: string): boolean {
  const area = doc.createElement('textarea');
  area.value = value;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.top = '-1000px';
  area.style.opacity = '0';
  doc.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = doc.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

function initCopy(): void {
  const buttons = Array.from(doc.querySelectorAll<HTMLButtonElement>('[data-copy]'));
  if (buttons.length === 0) return;

  const status = doc.querySelector<HTMLElement>('[data-copy-status]');

  const announce = (text: string): void => {
    if (!status) return;
    window.clearTimeout(Number(status.dataset.timer ?? '0'));
    status.textContent = text;
    status.classList.add('is-visible');
    const timer = window.setTimeout(() => {
      status.textContent = '';
      status.classList.remove('is-visible');
    }, 2800);
    status.dataset.timer = String(timer);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.copy ?? '';
      const copied = button.dataset.copied ?? 'Copied';
      if (value === '') return;

      const done = (): void => {
        announce(`${copied} · ${value}`);
        button.classList.add('is-copied');
        window.setTimeout(() => button.classList.remove('is-copied'), 1600);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(value).then(done, () => {
          if (fallbackCopy(value)) done();
        });
      } else if (fallbackCopy(value)) {
        done();
      }
    });
  });
}

/* --- print ---------------------------------------------------------------- */

function initPrint(): void {
  doc.querySelectorAll<HTMLButtonElement>('[data-print]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });
}

/* --- language persistence ------------------------------------------------- */

function initLanguage(): void {
  const current = doc.documentElement.dataset.lang;
  if (current === 'en' || current === 'zh') storageSet(LANG_KEY, current);

  doc.querySelectorAll<HTMLAnchorElement>('[data-set-lang]').forEach((link) => {
    link.addEventListener('click', () => {
      const value = link.dataset.setLang;
      if (value === 'en' || value === 'zh') storageSet(LANG_KEY, value);
    });
  });
}

ready(() => {
  initLanguage();
  initReveal();
  initHeaderState();
  initScrollSpy();
  initNav();
  initMusic();
  initCopy();
  initPrint();
});
