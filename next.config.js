const isProduction = process.env.NODE_ENV === 'production';

//? The Cloudinary account that hosts the My Friend media. The name is public:
//? it is part of every image address.
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dqbj2ip7c';

//? Said once per build: the worker processes Next starts later inherit the
//? marker and stay quiet.
if (
  isProduction &&
  !process.env.NEXT_PUBLIC_SITE_URL &&
  !process.env.VERCEL_URL &&
  !process.env.SITE_URL_WARNING_SHOWN
) {
  process.env.SITE_URL_WARNING_SHOWN = '1';
  console.warn(
    '\n[site] NEXT_PUBLIC_SITE_URL is not set. Canonical links, sitemap.xml, robots.txt and the\n' +
      '       share image will point at http://localhost:3000. Set it to the live address\n' +
      '       (https://...) before deploying; see .env.example.\n',
  );
}

//? Sent with every response.
const securityHeaders = [
  //? Browsers must not guess a file's type from its content.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  //? The site may not be shown inside a frame on another site.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

//? Pictures and videos from /public: a browser keeps them for a day, then
//? shows the copy it has while it checks for a newer one. A picture replaced
//? under the same file name can therefore take a day to reach a returning
//? visitor; give it a new name to show at once.
const mediaCache = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=86400, stale-while-revalidate=604800',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  //? No "X-Powered-By: Next.js" header.
  poweredByHeader: false,
  compiler: {
    //? Deterministic class names so server and client markup match
    styledComponents: true,
  },
  images: {
    //? Only this site's own Cloudinary uploads may go through the optimiser
    //? (a wider pattern lets anyone resize any Cloudinary picture at this
    //? site's expense); everything else comes from /public. Inline
    //? `data:image/svg+xml` placeholders cannot go through the optimiser, so
    //? components rendering them need `unoptimized` on <Image>.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${cloudName}/image/upload/**`,
      },
    ],
    formats: ['image/avif', 'image/webp'],
    //? On the live site an optimised image is kept for 30 days. While
    //? developing it is not kept at all, so replacing a file under the same
    //? name shows up on the next reload.
    minimumCacheTTL: isProduction ? 60 * 60 * 24 * 30 : 0,
  },
  async headers() {
    const rules = [{ source: '/:path*', headers: securityHeaders }];

    //? Only on the live site: while developing, a replaced file must show
    //? on the next reload.
    if (isProduction) {
      rules.push(
        { source: '/assets/:path*', headers: mediaCache },
        {
          //? The pictures in the root of /public (portrait, About photos...).
          source:
            '/:file([^/]+\\.(?:png|jpe?g|JPE?G|webp|avif|gif|svg|mp4|webm))',
          headers: mediaCache,
        },
      );
    }

    return rules;
  },
};

module.exports = nextConfig;
