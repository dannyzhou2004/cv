/**
 * Tiny inline-emphasis renderer.
 *
 * Content strings may contain `**bold**` segments (see `src/data/types.ts`).
 * This helper escapes every other character and turns the `**…**` pairs into
 * `<strong>` elements — no markdown library, no raw HTML passthrough.
 *
 * Use it together with `set:html` on an element, e.g.
 *   `<li set:html={rich(entry)} />`
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape HTML special characters. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

/** Render `**bold**` as `<strong>`, escaping everything else. */
export function rich(input: string): string {
  return input
    .split('**')
    .map((segment, index) => (index % 2 === 1 ? `<strong>${escapeHtml(segment)}</strong>` : escapeHtml(segment)))
    .join('');
}

/** Same as `rich()` but returns the plain text only (handy for metadata). */
export function plain(input: string): string {
  return input.replace(/\*\*/g, '');
}
