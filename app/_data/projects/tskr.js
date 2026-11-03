// @ts-check
import { project } from '../project.js';

//? Consultancy, not development: the owner helped the team with the initial
//? system design and architecture. Pictures: the Word document's 2048 px
//? extracts, the sharpest copies of the owner's screens; everything is kept
//? untouched in originals/public/assets/tskr. For the laptop's 16:10 each
//? dashboard screen gets more of its own empty page at the foot (the support
//? centre first loses the browser's link preview from its bottom rows).
export default project({
  slug: 'tskr',
  title: 'TSKR',
  services: 'System Design Consultancy',
  credits: 'Team AlgoTracks',
  categories: ['consultancy'],
  //? Tskr.com is based in Kansas City (its launch announcement)
  location: 'Kansas City, US',
  //? The dates inside the screens run from late 2023 to early 2024
  year: '2024',
  //? The owner's deployment of the app, at its sign-in page
  liveUrl: 'https://tskr-black.vercel.app/auth/login',
  //? A soft peach from TSKR's own banners
  background: '#efdcd5',
  //? The owner's design (thumbnail.png, 1000x750), centred on its laptop and
  //? phone and made square with its own flat top and bottom rows
  thumbnail: 'thumbnail.webp',
  description: {
    lead: 'TSKR is a freelance marketplace built on fairness: a flat 5% fee on every completed project, no pay-to-win perks, and human support at every step.',
    body: [
      'Clients post a project in a few steps and follow it from their own dashboard. Freelancers browse and filter open projects, send proposals, chat with clients, and manage their contracts and earnings from theirs, protected from scope changes and unfair reviews.',
      'My part was consultancy, not development: at the start I worked through the initial system design and architecture with my teammates, who then built it with Next.js, Twilio, Mongoose and Sockets.',
    ],
    builtLabel: 'The product',
    built: [
      'Open projects for everyone to browse, with search and filters',
      'A step-by-step form for clients to post a project',
      'Proposals with cover letters, attachments and bids',
      'Real-time chat between clients and freelancers',
      'Contracts with the payment held in escrow',
      'Balances, bids and payouts for freelancers',
      'A support centre with tickets',
    ],
  },
  hero: {
    'hero.webp':
      'TSKR open projects for freelancers, with search, filters and two listings',
  },
  //? The freelancer's proposals first (held longest), then posting a project,
  //? contracts, money and support. Pictures two to five also lead the moving
  //? row, followed by a public project page and a proposal with its chat.
  laptop: {
    'my-proposals.png':
      'TSKR proposals a freelancer has sent, each with its fixed price, proposed cost and status',
    'post-a-project.png':
      'TSKR posting a project: title, category, scope, duration, skills and description',
    'contracts.png':
      'TSKR active projects of a freelancer, with the cost, the amount in escrow and the contract dashboard',
    'finances.png':
      'TSKR finances: account balance, bids balance, pending payout and payment methods',
    'support-centre.png':
      'TSKR support centre with a ticket form and the ticket history',
  },
  screens: {
    'project-page.png':
      'TSKR public project page with the budget, project details, description and client',
    'proposal-chat.png':
      'TSKR proposal sent to a client, with the client details and a chat beside it',
  },
});
