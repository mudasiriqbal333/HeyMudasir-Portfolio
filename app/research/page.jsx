import { notFound } from 'next/navigation';

//? The Research page is switched off: /research answers 404, and the page
//? is out of the nav bar, the sitemap and the @/data index. To bring it back,
//? restore the original page below (and remove this stub), then uncomment
//? every line marked "Research page switched off" in:
//?   app/_data/nav-items.js
//?   app/_data/index.js
//?   app/_data/about-options.js (the dissertation link)
//?   app/_utils/helpers/site-urls.js (and its test)
//? and drop the app/_layout/research line from .eslintignore.
export default function ResearchPage() {
  notFound();
}

// import { Contact } from '@/layout/contact';
// import { Navbar } from '@/layout/navbar';
// import { Research } from '@/layout/research';
// import { Transition } from '@/layout/transition';
//
// /** @type {import('next').Metadata} */
// export const metadata = {
//   title: 'Research',
//   description:
//     'Detecting natural hallucinations in local RAG: an MSc AI dissertation comparing span detectors, LLM judges and their combinations on 345 hand-labelled claims. © Code by Mudasir Iqbal',
// };
//
// export default function ResearchPage() {
//   return (
//     <Transition>
//       <Navbar theme='dark' />
//       {/* The footer's curved lip continues the white section above it */}
//       <div style={{ '--footer-lip': 'var(--color-white)' }}>
//         <Research />
//         <Contact />
//       </div>
//     </Transition>
//   );
// }
