import { defaultTitle, rootMetadata } from '@/config';
import { Contact } from '@/layout/contact';
import { Description } from '@/layout/description';
import { Header } from '@/layout/header';
import { Navbar } from '@/layout/navbar';
import { Thumbnail } from '@/layout/thumbnail';
import { Transition } from '@/layout/transition';

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'Home | Mudasir Iqbal',
  description:
    'Full stack engineer in Pakistan with a background in artificial intelligence, building web apps and AI products from idea to production. © Code by Mudasir Iqbal',
  //? A shared link to the home page shows the full site title, not "Home".
  openGraph: { ...rootMetadata.openGraph, title: defaultTitle },
  twitter: { ...rootMetadata.twitter, title: defaultTitle },
};

export default function Home() {
  return (
    <>
      <Transition>
        <Navbar theme='light' />
        <Header />
        {/* White under the hero, as on the reference; the footer's curved
            lip continues it */}
        <div
          className='bg-white'
          style={{ '--footer-lip': 'var(--color-white)' }}
        >
          <main>
            <Description />
            <Thumbnail />
          </main>
          <Contact />
        </div>
      </Transition>
    </>
  );
}
