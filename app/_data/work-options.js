// @ts-check
import { caseOptions } from './case-options.js';

/**
 * Work page list: one row per case page, in the same order as the home
 * "Recent projects", so the three never drift apart. `categories` puts a case
 * under the Development / Consultancy filters; every case is listed under All.
 *
 * @typedef {Exclude<(typeof workFilters)[number]['key'], 'all'>} WorkCategory
 *   A filter key other than 'all'. It is read off workFilters below, so that
 *   list is the one place the categories are named.
 * @typedef {{href: string, title: string, tagline?: string, location: string,
 *   services: string, year: string, image: string, background: string,
 *   categories: WorkCategory[]}} WorkEntry
 * @type {WorkEntry[]}
 */
export const workOptions = caseOptions.map(
  ({
    slug,
    title,
    tagline,
    location,
    services,
    year,
    thumbnail,
    background,
    categories = [],
  }) => ({
    href: `/work/${slug}`,
    title,
    tagline,
    location,
    services,
    year,
    image: thumbnail,
    background,
    categories,
  }),
);

/**
 * The filter pills in order; 'all' matches every entry. Every other key is a
 * category a project can list: the project type (case-options.js) and the
 * data test (case-options.test.js) both take the known names from here.
 */
export const workFilters = /** @type {const} */ ([
  { key: 'all', label: 'All' },
  { key: 'development', label: 'Development' },
  //? Projects where the work was advice (system design, architecture), not code
  { key: 'consultancy', label: 'Consultancy' },
]);

/** The two-line heading over the list. */
export const workHeading = ['Creating next level', 'digital products'];
