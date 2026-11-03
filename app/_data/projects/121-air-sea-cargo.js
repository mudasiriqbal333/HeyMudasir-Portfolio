// @ts-check
import { project } from '../project.js';

//? Pictures: the owner's exports from the Figma file, kept untouched in
//? originals/public/assets/121-air-sea-cargo. Each lost only the half-clear
//? row at its foot, which leaves the screens exactly 16:10. The hero is the
//? sign-in page framed on the page colour. Left out on purpose: the screens
//? that show phone numbers, email addresses or street addresses.
export default project({
  slug: '121-air-sea-cargo',
  title: '121 Air Sea Cargo',
  services: 'Architecture & Full Stack Lead',
  credits: 'Team AlgoTracks',
  categories: ['development'],
  location: 'Dubai, UAE',
  //? From the code: built from March to December 2025
  year: '2025',
  //? A soft sand from the app's gold (#b3892e), behind the laptop and the
  //? moving row. The framed hero has it too: make the hero again if it changes.
  background: '#e7ddc8',
  //? The owner's design (thumbnail.png, 1200x1200, kept in originals),
  //? saved as WebP at 98%: 1.36 MB down to 163 kB with no visible change,
  //? since the Next case tile loads it as it is
  thumbnail: 'thumbnail.webp',
  description: {
    lead: '121 Air Sea Cargo is the operations system of a freight company in Dubai: every sea, air and road job, its costs and invoices, the trucks and the drivers, in one place.',
    body: [
      'I designed the system end to end: the architecture, the data flow between its modules and the database schema. I then led the team that built it, working on both the back end and the front end. A job moves through one multi-step form shaped by its freight type: vessel and container for sea, airline and air waybills for air, trucks, drivers and cargo for road, with UAE deliveries handled on their own.',
      'Each job carries its purchase and sales invoices, with nominal codes, VAT, foreign currency and a profit figure that updates as they change; processed invoices are numbered and rendered as PDFs. Sign-in uses JWT, each user sees only their own country’s data, and every change to a job or an invoice is written to an audit log. The front end is Next.js with React Query, and the back end a modular Node.js and Express API in TypeScript, on PostgreSQL with Prisma.',
    ],
    built: [
      'System architecture, data flow and database design',
      'Multi-step job forms for sea, air and road freight',
      'Purchase and sales invoices with VAT, nominal codes and profit',
      'Invoice processing, serial numbers and PDF invoices',
      'Job lists with search, filters, sorting and CSV export',
      'An audit log of every change to jobs and invoices',
      'JWT sign-in and access limited by country',
      'Trucks, drivers and driver cash advances',
    ],
  },
  hero: {
    'hero.webp':
      '121 Air Sea Cargo sign-in page, over a photo of a cargo plane above a container port at sunset',
  },
  //? The jobs list first (held longest), then one job through its freight
  //? types and its costing. Pictures two to five also lead the moving row.
  laptop: {
    'sea-freight-jobs.png':
      '121 Air Sea Cargo sea freight import jobs with customer, shipper, consignee, ports and status, and tabs for air, road and UAE delivery',
    'sea-job-vessel-container.png':
      '121 Air Sea Cargo sea freight job, vessel and container step: carrier, bills of lading, ports, dates and cargo',
    'air-job-airline-cargo.png':
      '121 Air Sea Cargo air freight job, airline and cargo step: air waybills, airports, dates and weights',
    'road-job-truck-cargo.png':
      '121 Air Sea Cargo road freight job, truck and cargo step: haulier, pickup and drop-off, cargo and vehicle',
    'job-costing-invoicing.png':
      '121 Air Sea Cargo job costing: purchase and sales invoices with their stage, and the total purchase, sale and profit',
  },
  screens: {
    'add-invoices.png':
      '121 Air Sea Cargo adding purchase and sales invoices line by line, with nominal codes, VAT and currency',
    'purchase-invoices.png':
      '121 Air Sea Cargo purchase invoices for sea freight, with search, filters and CSV export',
  },
});
