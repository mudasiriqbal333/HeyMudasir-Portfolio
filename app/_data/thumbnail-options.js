// @ts-check
import { caseOptions } from './case-options.js';

/**
 * Home page "Recent projects": one entry per case page, in the same order, so the
 * two stay in sync. `background` is the case colour, shown behind the
 * thumbnail while it loads.
 * @type {{href: string, title: string, tagline?: string, services: string,
 *   year: string, image: string, background: string}[]}
 */
export const thumbnailOptions = caseOptions.map(
  ({ slug, title, tagline, services, year, thumbnail, background }) => ({
    href: `/work/${slug}`,
    title,
    tagline,
    services,
    year,
    image: thumbnail,
    background,
  }),
);
