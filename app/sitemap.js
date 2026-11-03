import { SITE_URL } from '@/config';
import { caseOptions } from '@/data';
import { sitemapRoutes } from '@/utils';

//? Served at /sitemap.xml. Case pages are derived from caseOptions, so adding
//? a project to the data adds it here too.
/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return sitemapRoutes(SITE_URL, caseOptions);
}
