import { notFound } from 'next/navigation';

import { caseOptions } from '@/data';
import sizes from '@/data/media-sizes.json';
import { withSizes } from '@/data/project';
import { Case } from '@/layout/case';
import { Navbar } from '@/layout/navbar';
import { Transition } from '@/layout/transition';

//? Only the projects in the list have a page. Any other address under /work/
//? is a plain 404: it is not rendered here and nothing is kept for it. Next 15
//? wants a plain value on this line (an expression stops the build), so it is
//? `false` in `npm run dev` too: if a project added while the dev server runs
//? says Not Found on its first visit, reload the page.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseOptions.map(({ slug }) => ({ slug }));
}

//? Since Next 15 the route parameters arrive as a promise.
/** @param {{params: Promise<{slug: string}>}} props */
export async function generateMetadata({ params }) {
  const { slug: wanted } = await params;
  const current = caseOptions.find(({ slug }) => slug === wanted);
  if (!current) return { title: 'Projects' };

  return {
    title: current.title,
    description: `${current.title} — ${current.services}. ${current.location}, ${current.year}. © Code by Mudasir Iqbal`,
  };
}

/** @param {{params: Promise<{slug: string}>}} props */
export default async function CasePage({ params }) {
  const { slug: wanted } = await params;
  const index = caseOptions.findIndex(({ slug }) => slug === wanted);
  if (index < 0) notFound();

  //? The pixel sizes of the pictures come from the table `npm run sizes`
  //? writes. They are attached here and nowhere else: this is a server
  //? component, so the table itself is never sent to the browser.
  const current = withSizes(caseOptions[index], sizes);
  //? The footer shows the next project's title and thumbnail and links to
  //? it; the rest of that project stays out of this page.
  const { slug, title, thumbnail } =
    caseOptions[(index + 1) % caseOptions.length];

  return (
    <Transition>
      <Navbar theme='dark' />
      <Case data={current} next={{ slug, title, thumbnail }} />
    </Transition>
  );
}
