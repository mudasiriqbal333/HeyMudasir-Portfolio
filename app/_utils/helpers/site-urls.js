//? Static routes in the order they should appear in the sitemap. The contact
//? success page is deliberately absent: it is a thin post-submit page and must
//? never be indexed. Add { path: '/archive', priority: 0.5, changeFrequency:
//? 'yearly' } once the archive page exists; listing it before then sends
//? search engines to a 404.
const STATIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
  //? Research page switched off (see app/research/page.jsx)
  // { path: '/research', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
];

/** @param {string} origin */
const trimOrigin = origin => String(origin ?? '').replace(/\/+$/, '');

/**
 * Every indexable URL of the site. Case pages come from the case data, so the
 * sitemap cannot drift when a project is added, renamed or removed.
 *
 * @param {string} origin absolute origin, with or without a trailing slash
 * @param {{slug?: string}[]} [cases] entries from caseOptions
 * @param {Date} [lastModified] stamp put on every entry
 * @returns {{url: string, lastModified: Date, changeFrequency: string, priority: number}[]}
 */
export function sitemapRoutes(origin, cases = [], lastModified = new Date()) {
  const base = trimOrigin(origin);
  const seen = new Set();

  /** @type {{path: string, priority: number, changeFrequency: string}[]} */
  const routes = [...STATIC_ROUTES];

  for (const entry of cases) {
    const slug = typeof entry?.slug === 'string' ? entry.slug.trim() : '';

    if (!slug) continue;

    routes.push({
      path: `/work/${slug}`,
      priority: 0.7,
      changeFrequency: 'yearly',
    });
  }

  return routes
    .filter(route => {
      if (seen.has(route.path)) return false;

      seen.add(route.path);

      return true;
    })
    .map(route => ({
      url: route.path === '/' ? `${base}/` : `${base}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
}
