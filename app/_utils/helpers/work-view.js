/**
 * Pure parts of the Work page: which entries a filter keeps, how many each
 * pill announces, and the cookie that remembers the rows / columns view.
 */

/** The two ways the list can be shown; the first is the default. */
export const WORK_VIEWS = ['rows', 'columns'];

/** Cookie that remembers the chosen view, as on the reference. */
export const VIEW_COOKIE = 'view';

/** How long the choice is kept, in days (reference: 14). */
export const VIEW_COOKIE_DAYS = 14;

/**
 * The entries a filter keeps. 'all' (or no key) keeps everything; any other
 * key keeps the entries whose `categories` list it.
 * @template {{categories?: string[]}} T
 * @param {T[]} items
 * @param {string} [key]
 * @returns {T[]}
 */
export function filterWork(items, key) {
  if (!key || key === 'all') return items;

  return items.filter(
    item => Array.isArray(item?.categories) && item.categories.includes(key),
  );
}

/**
 * How many entries each filter would show, keyed by filter key.
 * @param {{categories?: string[]}[]} items
 * @param {string[]} keys
 * @returns {Record<string, number>}
 */
export function countWork(items, keys) {
  return Object.fromEntries(
    keys.map(key => [key, filterWork(items, key).length]),
  );
}

/**
 * The remembered view in a `document.cookie` string, or null when there is
 * none or it is not a view this page knows.
 * @param {string | null | undefined} cookie
 * @returns {'rows' | 'columns' | null}
 */
export function parseViewCookie(cookie) {
  const entry = String(cookie ?? '')
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${VIEW_COOKIE}=`));

  if (!entry) return null;

  //? A cookie written or damaged by something else can hold an encoding that
  //? does not decode; that is no choice, not an error for the page.
  let value;
  try {
    value = decodeURIComponent(entry.slice(VIEW_COOKIE.length + 1));
  } catch {
    return null;
  }

  return WORK_VIEWS.includes(value) ? value : null;
}

/**
 * The `document.cookie` assignment that remembers a view for `days`, or an
 * empty string for a view this page does not know.
 * @param {string} view
 * @param {number} [days]
 */
export function viewCookie(view, days = VIEW_COOKIE_DAYS) {
  if (!WORK_VIEWS.includes(view)) return '';

  const maxAge = Math.max(0, Math.round(days * 86400));

  return `${VIEW_COOKIE}=${view}; max-age=${maxAge}; path=/; samesite=lax`;
}
