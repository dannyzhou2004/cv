/**
 * Deployment-path helpers.
 *
 * The site is published either at the domain root (user/org page) or under a
 * project path such as `/cv/`. Astro exposes that prefix as
 * `import.meta.env.BASE_URL`, which always ends with a slash (`/` or `/cv/`).
 *
 * Every internal URL in this project goes through `withBase()` — never a bare
 * `"/foo"` — so a GitHub Pages project path keeps working.
 */

const BASE_URL: string = import.meta.env.BASE_URL;

/** Prefix a root-relative path with the deployment base path. */
export function withBase(path = ''): string {
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}

export type PageLang = 'en' | 'zh';

/** URL of a language page, e.g. `/cv/en/`. */
export function langUrl(lang: PageLang): string {
  return withBase(`${lang}/`);
}
