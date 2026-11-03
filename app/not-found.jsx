import { FullLoadLinks, MessagePage } from '@/layout/message';
import { Navbar } from '@/layout/navbar';
import { Transition } from '@/layout/transition';

import { notFoundCopy } from './_layout/message/copy';

/** @type {import('next').Metadata} */
export const metadata = {
  title: '404',
  description:
    'Full stack engineer in Pakistan with a background in artificial intelligence, building web apps and AI products from idea to production. © Code by Mudasir Iqbal',
  //? Next marks a 404 answer "noindex" by itself. Without this the root
  //? layout's "index, follow" tags were printed next to that one.
  robots: { index: false },
};

//? Behind the preloader like every other page, as on the reference. The
//? preloader normally makes its word from the address; here it is given a
//? fixed one, or any link could put words of its choosing on the loading
//? screen ("/Any-Words-At-All" would show "Any Words At All").
export default function NotFound() {
  const { loader, title, paragraph, home } = notFoundCopy;

  return (
    <Transition word={loader}>
      <FullLoadLinks />
      <Navbar theme='light' />
      <MessagePage
        reveal
        title={title}
        paragraph={paragraph}
        action={{ href: '/', label: home }}
      />
    </Transition>
  );
}
