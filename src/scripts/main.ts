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

function initProgress(): void {
  const bar = doc.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;

  let ticking = false;
  const update = (): void => {
    const max = doc.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${progress.toFixed(4)})`;
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
  window.addEventListener('resize', update, { passive: true });
  update();
}

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

/* --- background music ----------------------------------------------------- */

/**
 * The track starts on its own, but quietly: `play()` from 0, then a slow
 * quadratic ramp to a low target volume, so it grows in instead of blasting.
 *
 * Browsers block audible autoplay until the page has "user activation".
 * Scrolling is NOT activation (per spec), so a wheel event alone cannot unlock
 * sound; what it can do is make an already-rolling muted track audible. That is
 * why the trigger list below mixes wheel/touch scroll with click/key: whichever
 * the visitor uses first, the music fades in from zero.
 */
const MUSIC_TARGET_VOLUME = 0.294;
const MUSIC_FADE_IN_MS = 4000;
const MUSIC_FADE_OUT_MS = 900;
const MUSIC_START_DELAY_MS = 900;
const MUSIC_END_FADE_MS = 3000;

/** Inputs that show the visitor is engaging with the page. */
const MUSIC_INTENT_EVENTS: ReadonlyArray<[string, AddEventListenerOptions]> = [
  ['wheel', { capture: true, passive: true }],
  ['touchmove', { capture: true, passive: true }],
  ['pointerdown', { capture: true }],
  ['keydown', { capture: true }],
];

/**
 * Only these count as "user activation" per the HTML spec. Scrolling does not,
 * so when playback has not started at all we must wait for a click/key press.
 */
const MUSIC_ACTIVATION_EVENTS: ReadonlyArray<[string, AddEventListenerOptions]> = [
  ['pointerdown', { capture: true }],
  ['keydown', { capture: true }],
];

function initMusic(): void {
  const audio = doc.querySelector<HTMLAudioElement>('[data-audio]');
  const button = doc.querySelector<HTMLButtonElement>('[data-music]');
  if (!audio || !button) return;

  const playLabel = button.dataset.labelPlay ?? 'Play background music';
  const pauseLabel = button.dataset.labelPause ?? 'Pause background music';

  let playing = false;
  let needsGesture = false;
  let userPaused = false;
  let ending = false;
  let fadeId = 0;
  let unbindIntent: (() => void) | null = null;

  const setUi = (): void => {
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', playing ? 'true' : 'false');
    button.setAttribute('aria-label', playing ? pauseLabel : playLabel);
    button.title = playing ? pauseLabel : playLabel;
  };

  /** Quadratic so the first seconds stay nearly silent, then it grows. */
  const ramp = (to: number, duration: number): void => {
    window.clearInterval(fadeId);
    const from = audio.volume;
    const started = performance.now();
    fadeId = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / duration);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * progress * progress));
      if (progress >= 1) window.clearInterval(fadeId);
    }, 60);
  };

  const clearIntent = (): void => {
    if (!unbindIntent) return;
    unbindIntent();
    unbindIntent = null;
  };

  const bindIntent = (
    handler: EventListener,
    events: ReadonlyArray<[string, AddEventListenerOptions]> = MUSIC_INTENT_EVENTS,
  ): void => {
    clearIntent();
    for (const [type, options] of events) {
      window.addEventListener(type, handler, options);
    }
    unbindIntent = () => {
      for (const [type, options] of events) {
        window.removeEventListener(type, handler, options);
      }
    };
  };

  const start = async (audible: boolean): Promise<boolean> => {
    audio.volume = 0;
    audio.muted = !audible;
    try {
      await audio.play();
    } catch {
      audio.muted = false;
      return false;
    }
    playing = true;
    userPaused = false;
    setUi();
    if (audible) {
      ramp(MUSIC_TARGET_VOLUME, MUSIC_FADE_IN_MS);
    } else {
      needsGesture = true;
    }
    return true;
  };

  /** The muted track is already rolling: unmute on the first scroll/click/key. */
  const enableSound = (): void => {
    if (userPaused || !needsGesture) return;
    needsGesture = false;
    audio.muted = false;
    audio.volume = 0;
    ramp(MUSIC_TARGET_VOLUME, MUSIC_FADE_IN_MS);
    clearIntent();
  };

  button.addEventListener('click', () => {
    if (playing) {
      userPaused = true;
      playing = false;
      needsGesture = false;
      ending = false;
      clearIntent();
      ramp(0, MUSIC_FADE_OUT_MS);
      setUi();
      window.setTimeout(() => {
        if (!playing) audio.pause();
      }, MUSIC_FADE_OUT_MS + 80);
      return;
    }
    userPaused = false;
    ending = false;
    audio.muted = false;
    void start(true);
  });

  /* No native `loop`: fade out over the last seconds, then restart with a fade. */
  audio.addEventListener('timeupdate', () => {
    if (!playing || ending || !Number.isFinite(audio.duration)) return;
    if (audio.duration - audio.currentTime <= MUSIC_END_FADE_MS / 1000) {
      ending = true;
      ramp(0, Math.max(200, (audio.duration - audio.currentTime) * 1000));
    }
  });

  audio.addEventListener('ended', () => {
    ending = false;
    if (!playing) return;
    audio.currentTime = 0;
    audio.volume = 0;
    void audio
      .play()
      .then(() => ramp(MUSIC_TARGET_VOLUME, MUSIC_FADE_IN_MS))
      .catch(() => {
        playing = false;
        setUi();
      });
  });

  audio.addEventListener('error', () => {
    playing = false;
    setUi();
    button.hidden = true;
  });

  setUi();

  void (async () => {
    await new Promise((resolve) => window.setTimeout(resolve, MUSIC_START_DELAY_MS));
    if (await start(true)) return; // the browser allows sound: fade in
    if (await start(false)) {
      // Strict policy: rolling silently until the first scroll/click/key.
      bindIntent(enableSound);
      return;
    }
    // Even muted playback was refused (rare): only a real click/key can start it.
    const onFirstIntent = async (): Promise<void> => {
      clearIntent();
      userPaused = false;
      audio.muted = false;
      if (await start(true)) return;
      // Still refused (e.g. a key press that the browser ignores): keep waiting.
      bindIntent(onFirstIntent, MUSIC_ACTIVATION_EVENTS);
    };
    bindIntent(onFirstIntent, MUSIC_ACTIVATION_EVENTS);
  })();
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
  initProgress();
  initScrollSpy();
  initNav();
  initMusic();
  initCopy();
  initPrint();
});
