// @ts-check
import { project } from '../project.js';

//? Pictures: the live site (www.javat365.com) as it was on 2026-11-04,
//? captured in a 1440x900 window and on a 390x844 phone, both at 2x. The
//? thumbnail puts its home page in a laptop and a phone on the site's own
//? purple. Text: the owner's CV ("Front-end development - Javat365.com,
//? Freelance Project") and the site's own words for what JAVAT 365 is.
export default project({
  slug: 'javat365',
  title: 'JAVAT 365',
  services: 'Front-End Development',
  categories: ['development'],
  //? The company's address on its contact page
  location: 'Atlanta, US',
  //? Not on the CV or LinkedIn yet: put the year in, then delete `draft`
  //? so the project goes live
  year: 'TBC',
  draft: true,
  liveUrl: 'https://www.javat365.com/',
  //? The purple of the site's features band
  background: '#5d449b',
  thumbnail: 'thumbnail.webp',
  description: {
    lead: 'JAVAT 365 is an all-in-one collaboration platform for small and medium-sized businesses, starting with custom-domain email through SOGo Mail.',
    body: [
      'Its site sells unlimited professional mailboxes on your own domain, with secured hosting and 15 GB per mailbox, and walks visitors through what SOGo Mail can do, with a FAQ, a blog and a contact form.',
      'As a freelance front-end developer, I built its responsive UI in React.js and Tailwind CSS from the team’s Figma designs, working closely with their UI/UX designers to get every page pixel-perfect, and made it interactive with reusable React components.',
    ],
    built: [
      'Responsive UI in React.js and Tailwind CSS',
      'Pixel-perfect pages from Figma designs',
      'Reusable, interactive React components',
      'Close collaboration with the UI/UX team',
    ],
  },
  hero: {
    'hero.webp':
      'JAVAT 365 home page: "JAVAT 365 × SOGo Mail =", unlimited professional mailboxes on your own domain, and the companies that trust it',
  },
  //? The sections under the hero, in the order of the page, then the blog
  laptop: {
    'features.webp':
      'JAVAT 365 features: "Built for reliable, scalable email", with cards for localisation, reminders, delegation and sharing',
    'faq.webp':
      'JAVAT 365 FAQ, with "What is JAVAT 365?" open, above the contact section',
    'blog.webp':
      'JAVAT 365 blog: posts filed under how-tos, comparisons, press releases and pro tips',
  },
  screens: {
    'contact.webp':
      'JAVAT 365 contact section with the address, phone and email beside a message form',
  },
  phones: {
    'mobile-home.webp': 'JAVAT 365 home page on a phone',
    'mobile-features.webp': 'JAVAT 365 features on a phone',
  },
});
