//? The site's own origin: NEXT_PUBLIC_SITE_URL, set in .env once the owner
//? has a domain, so every build and host uses it. Without it (as now)
//? a Vercel build uses the project's production domain, then the address of
//? that one deployment, and local dev falls back to http://localhost:3000.
//? Every absolute URL below, plus /robots.txt, /sitemap.xml and the Open
//? Graph image, is derived from this one value. It is fixed when the site is
//? built, not when a page is requested.
const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  process.env.VERCEL_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')
).replace(/\/+$/, '');

//? Wording below is placeholder copy: it is the owner's to rewrite.
const siteName = 'Mudasir Iqbal';
export const defaultTitle = 'Mudasir Iqbal • Freelance Web and AI Developer';
const defaultDescription =
  'Freelance web and AI developer. Selected projects, case studies and how to get in touch.';

/** @type {import('next').Metadata} */
export const rootMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${siteName}`,
    default: defaultTitle,
  },
  description: defaultDescription,
  applicationName: siteName,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Web Development', 'AI Development', 'Freelance', 'Portfolio'],
  authors: [{ name: siteName, url: SITE_URL }],
  creator: siteName,
  publisher: siteName,
  //? './' makes Next resolve the canonical and the share URL against the page
  //? being rendered, so /about points at /about and a case at its own URL
  //? ('/' would point every page at Home). A page that needs a different one
  //? sets alternates.canonical itself.
  alternates: {
    canonical: './',
  },
  //? No title or description here on purpose: Next then fills the share tags
  //? from each page's own title and description.
  openGraph: {
    type: 'website',
    siteName,
    url: './',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    //? The owner's X (Twitter) handle, credited on shared links
    // creator: '@your-handle',
  },
  //? Indexable. The googleBot entry has to agree with the generic rules,
  //? otherwise the two tags contradict each other.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

//? Next 14 wants viewport and themeColor in their own export, not in metadata.
/** @type {import('next').Viewport} */
export const rootViewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1d20' },
  ],
};
