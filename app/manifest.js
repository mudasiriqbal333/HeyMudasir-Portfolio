import { rootMetadata } from '@/config';
import { brand } from '@/data';

//? Served at /manifest.webmanifest. Icons point at the single favicon the site
//? has (app/favicon.ico: the head from public/mudasir.png on a light grey
//? disc, 16-256px); add /icon.png and /apple-icon.png for larger artwork.
/** @returns {import('next').MetadataRoute.Manifest} */
export default function manifest() {
  return {
    name: `${brand.firstName} ${brand.lastName}`,
    short_name: brand.firstName,
    description: rootMetadata.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1c1d20',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '256x256',
        type: 'image/x-icon',
      },
    ],
  };
}
