# 121 Air Sea Cargo

Slug `121-air-sea-cargo` · 9 pictures in `public/assets/121-air-sea-cargo/`, served at `/assets/121-air-sea-cargo/<file>`.
No live site: it is the internal operations system of a freight company in Dubai. Built from March to December 2025, going by the first and last commits of its front-end and back-end repositories.

| file | pixels | used for | from |
|---|---|---|---|
| hero.webp | 2240x1520 | hero | `png.png`, the sign-in page, at 1:1 on the page colour #e7ddc8 with rounded corners and a soft shadow (WebP at 98%) |
| sea-freight-jobs.png | 1920x1200 | laptop, first (held longest) | `png (1).png` |
| sea-job-vessel-container.png | 1920x1200 | laptop 2 and moving row | `png (3).png` |
| air-job-airline-cargo.png | 1920x1200 | laptop 3 and moving row | `png (7).png` |
| road-job-truck-cargo.png | 1920x1200 | laptop 4 and moving row | `png (8).png` |
| job-costing-invoicing.png | 2880x1800 | laptop 5 and moving row | `png (12).png` |
| add-invoices.png | 2880x2089 | moving row | `png (13).png` |
| purchase-invoices.png | 1920x1200 | moving row | `png (10).png` |
| thumbnail.webp | 1200x1200 | previews | the owner's design `thumbnail.png`, saved as WebP at 98% (1.36 MB down to 163 kB) |

The exports come from the project's Figma file. Each had one or two half-clear
rows at its foot (1920x1201, 2880x1802); without them the screens are exactly
16:10, so the laptop shows them whole and nothing is added. Nothing inside a
screen is changed. The page colour #e7ddc8 is a soft sand from the app's gold
#b3892e; the framed hero has it baked in, so make the hero again if
`background` changes.

All 16 exports and the owner's PNG thumbnail are kept, under their own names, in
`originals/public/assets/121-air-sea-cargo/`. Not used:

- `png (2).png` (basic job information), `png (9).png` (address management) and `png (14).png` (view address): they show phone numbers, email addresses and street addresses.
- `png (4).png`: the older layout of the costing tab, replaced by `png (12).png`.
- `png (5).png` and `png (6).png`: the add purchase and add sales invoice dialogs, a dialog over a dialog in the older layout.
- `png (11).png` (sales invoices) and `png (15).png` (air freight jobs): close repeats of `png (10).png` and `png (1).png`.

## What the owner did

System architecture and software design (data flow, database schema), then led
the team that built it, working on both the back end and the front end.

- Front end: Next.js and TypeScript, React Query, react-hook-form with zod, Radix UI (shadcn), Tailwind.
- Back end: a modular Node.js and Express API in TypeScript, Prisma on PostgreSQL, JWT sign-in, OpenAPI docs generated from the zod schemas, domain events feeding an audit log, invoice PDFs rendered with Handlebars and Puppeteer, Winston logs, Jest and Supertest, Docker Compose.
- Back-end modules: address, advance payment, audit, auth, company, driver, invoice, invoice PDF, job (sea, air, road and UAE delivery), service item, supplier, uploads, user, VAT rate, vehicle.

The client's timeline and requirement documents were read for the write-up but
are not copied here: they hold prices.
