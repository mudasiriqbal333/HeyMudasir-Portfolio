import { ContactPage } from '@/layout/contact-page';
import { Navbar } from '@/layout/navbar';
import { Transition } from '@/layout/transition';

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'Contact',
  description:
    "Let's start working together. Send a message, write an email or book a call. © Code by Mudasir Iqbal",
};

export default function Contact() {
  return (
    <Transition>
      <Navbar theme='light' />
      <ContactPage />
    </Transition>
  );
}
