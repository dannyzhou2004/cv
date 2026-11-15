// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Deployment base path.
 *
 * - GitHub user/org page (`<user>.github.io`) → `/`
 * - GitHub project page (`<user>.github.io/<repo>/`) → `/<repo>/`
 *
 * `BASE_PATH` is injected by the GitHub Actions workflow; locally it is unset
 * and the site is served from `/`. Astro wants `base` without a trailing slash
 * (except for the site root).
 *
 * @param {string | undefined} raw
 * @returns {string}
 */
function normalizeBase(raw) {
  const value = (raw ?? '').trim();
  if (!value || value === '/') return '/';
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  const trimmed = withLeadingSlash.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export default defineConfig({
  site: 'https://dannyzhou2004.github.io',
  base: normalizeBase(process.env.BASE_PATH),
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  devToolbar: {
    enabled: false,
  },
});
