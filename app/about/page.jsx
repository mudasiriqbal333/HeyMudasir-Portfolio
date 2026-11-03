import { About } from '@/layout/about';
import { Contact } from '@/layout/contact';
import { Navbar } from '@/layout/navbar';
import { Transition } from '@/layout/transition';

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'About',
  description:
    'Mudasir Iqbal, full stack software engineer in Pakistan: experience at AlgoTracks, REHQ, Smart TechOne and Synergy Consulting Services, a Bachelor of Software Engineering from NUST and certifications. © Code by Mudasir Iqbal',
};

export default function AboutPage() {
  return (
    <Transition>
      <Navbar theme='dark' />
      {/* The footer's curved lip continues the white feature section */}
      <div style={{ '--footer-lip': 'var(--color-white)' }}>
        <About />
        <Contact />
      </div>
    </Transition>
  );
}
