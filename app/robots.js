import { SITE_URL } from '@/config';

//? Served at /robots.txt.
/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        //? The contact API and the post-submit page hold nothing to index.
        disallow: ['/api/', '/contact/success'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
