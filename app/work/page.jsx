import { Contact } from '@/layout/contact';
import { Navbar } from '@/layout/navbar';
import { Transition } from '@/layout/transition';
import { Work } from '@/layout/work';

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'Projects',
  description:
    'Selected projects and case studies: web apps, AI products and system design, built full stack from idea to production. © Code by Mudasir Iqbal',
};

export default function WorkPage() {
  return (
    <Transition>
      <Navbar theme='dark' />
      {/* The work sits on white, as on the reference (.section-wrap-work);
          the footer's curved lip continues it */}
      <div
        className='bg-white'
        style={{ '--footer-lip': 'var(--color-white)' }}
      >
        <main>
          <Work />
        </main>
        <Contact />
      </div>
    </Transition>
  );
}
