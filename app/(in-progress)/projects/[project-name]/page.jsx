import { permanentRedirect } from 'next/navigation';

/**
 * Legacy URL: /projects/MyFriend -> /work/my-friend
 * @param {{params: Promise<{'project-name': string}>}} props
 */
export default async function LegacyProject({ params }) {
  const slug = (await params)['project-name']
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

  permanentRedirect(`/work/${slug}`);
}
