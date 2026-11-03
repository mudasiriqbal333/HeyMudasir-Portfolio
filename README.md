# Mudasir Iqbal: portfolio

The portfolio site of Mudasir Iqbal, full stack and AI developer. Built with Next.js (app router), styled-components and Tailwind CSS, animated with Framer Motion and GSAP, with Lenis for smooth scrolling.

The layout follows [dennissnellenberg.com](https://dennissnellenberg.com); the words, pictures and projects are Mudasir's own.

## Run it

Node 22.7 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (checks the project data first)
npm run start    # serve the production build
```

## Commands

| Command               | What it does                                                       |
| --------------------- | ------------------------------------------------------------------ |
| `npm run dev`         | Development server. Refreshes the picture size table first.        |
| `npm run build`       | Production build. Stops if a project's data or pictures are wrong. |
| `npm run check`       | Everything below in one go: run it before you push.                |
| `npm run lint`        | ESLint over the code.                                              |
| `npm run lint:styles` | Stylelint over the CSS and the `*.styled.js` files.                |
| `npm run format`      | Prettier: rewrites files. `npm run format:check` only reports.     |
| `npm test`            | The unit tests, including the check of every project's data.       |
| `npm run sizes`       | Reads every picture's pixel size and prints a report per folder.   |

Every commit runs the linters on the files you changed and then the tests. If the commit is refused, read the message: it names the file and the line.

## Where things are

| Folder                       | What lives there                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `app/`                       | The pages: Home, `about`, `work`, `work/[slug]`, `contact`, the 404 and error pages, the contact API. |
| `app/_data/`                 | All the content. Change text here, not in the components.                                             |
| `app/_data/projects/`        | One file per project, plus `index.js`, which sets their order.                                        |
| `app/_layout/`               | One folder per page section (hero, work list, project page, footer, menu...).                         |
| `app/_components/`           | Small shared pieces: buttons, containers, the globe.                                                  |
| `app/_hooks/`, `app/_utils/` | Shared hooks and helpers, with their tests.                                                           |
| `app/_config/`               | Site name, address and metadata.                                                                      |
| `public/assets/<slug>/`      | The pictures and videos of each project.                                                              |
| `project-notes/`             | Notes per project: where each picture came from and what it is used for.                              |
| `scripts/`                   | The picture size script.                                                                              |
| `originals/`                 | Original, uncompressed media. Not committed, not deployed.                                            |

### Changing the words

| To change                                          | Edit                             |
| -------------------------------------------------- | -------------------------------- |
| Home hero: photo, location, role                   | `app/_data/home-options.js`      |
| About page                                         | `app/_data/about-options.js`     |
| Contact page, footer, form labels, email and phone | `app/_data/contact-options.js`   |
| Social links                                       | `app/_data/social-medias.js`     |
| Menu and top bar links                             | `app/_data/nav-items.js`         |
| Name shown in the top bar and the big rolling name | `app/_data/brand.js`             |
| Site title and description for search engines      | `app/_config/metadata.config.js` |

## How to add a project

1. Choose the slug: lower-case words joined by hyphens, for example `leave-board`. It becomes the address `/work/leave-board` and the name of the picture folder.
2. Put the pictures in `public/assets/<slug>/`. Use lower-case file names with hyphens and no spaces (`mobile-home.png`), in PNG, JPEG, WebP or GIF. You need one hero picture, one thumbnail cut square (800 px or more), and any of: laptop screenshots (close to 16:10, for example 1600x1000, or the laptop shows black bars), other screenshots, and up to three phone screens. For an app that only runs on phones, use phone screens of one shape (750x1624, for example) for a phone in place of the laptop.
3. Run `npm run sizes`. It reads every picture's pixel size into `app/_data/media-sizes.json`, so you never type a size. It also prints each picture's size and weight and flags names with capitals or spaces. Run it again whenever you add or re-crop a picture.
4. Create `app/_data/projects/<slug>.js`. Copy `jarvis.js`, or start from this:

   ```js
   // @ts-check
   import { project } from '../project.js';

   export default project({
     slug: 'leave-board', // also the folder: public/assets/leave-board/
     title: 'Leave Board',
     // tagline: 'Powered by ...', // optional short line under the title (40 characters at most)
     services: 'Full Stack Development',
     categories: ['development'], // 'development', 'consultancy' or both
     location: 'United Kingdom',
     year: '2024',
     background: '#d3dedf', // the colour behind the pictures
     thumbnail: 'thumbnail.jpg',
     // liveUrl: 'https://example.com/', // shows the "Live site" button
     description: {
       lead: 'One sentence that says what the project is.',
       body: ['A paragraph.', 'Another paragraph.'],
       built: ['What you built', 'One line each'],
     },
     hero: { 'home.png': 'What the picture shows' },
     laptop: {
       'dashboard.png': 'What the picture shows',
       'reports.png': 'What the picture shows',
     },
     // phone: { 'app-home.png': 'What the picture shows' }, // a phone instead, for a phone-only app
     screens: {
       'calendar.png': 'What the picture shows',
       'requests.png': 'What the picture shows',
     },
     phones: {
       'mobile-home.png': 'What the picture shows',
       'mobile-requests.png': 'What the picture shows',
     },
   });
   ```

   Each list is `'file name': 'alt text'`, in the order the page shows them. Only `thumbnail` is a bare file name: a picture written without its alt text (`hero: 'home.png'`) is refused with a message that shows how to write it. Several pictures in `laptop` play as a slideshow; one is shown on its own. For an app that only runs on phones, write `phone` instead of `laptop`: the same slideshow, in a phone whose screen takes the shape of the first picture, so give all its pictures that shape (`npm test` names one that differs). For a recording, write `laptop: video('intro.mp4', 'intro-poster.jpg', 'What it shows')` and import `video` next to `project`. Two or more `screens` become the moving row. Leave out any list you do not need. For any other layout, replace the lists with `blocks: [...]` written out in full; `CaseBlock` in `app/_data/case-options.js` lists what a block can be.

5. Add the project to `app/_data/projects/index.js`: one import line, and its name in the list where it should appear. The order is the order on the site. The first 4 are the "Recent work" rows on Home, the first 2 are the Home tiles on tablet and phone, and "Next case" leads to the project after it. A project added at the end does not show on Home.
6. Run `npm test`. It checks the project against the real files and says in one line what is wrong, for example `leave-board: blocks[2].media.src: /assets/leave-board/calender.png does not exist under public/`. Blocks are counted from 0 in page order: the laptop or the phone, then each screenshot, then the phones.
7. Look at it with `npm run dev`: Home, Work, `/work/<slug>`, and the "Next case" tile at the foot of the project before it. If a project added while the dev server is running says Not Found on its first visit, reload the page.
8. Not ready to publish? Add `draft: true`. The project shows in `npm run dev` and is left out of the live site: no page, no row, not in the counts or the sitemap. Left out is not secret: a draft's text is still inside the site's script files and its pictures still answer by address, so do not use it for anything confidential. Remove the line to publish.
9. Commit the project file, the picture folder and `app/_data/media-sizes.json` together.

The editor underlines a misspelled field, category or block type as you type. Changing, moving or removing a project never fails the tests by itself: a red test in `case-options.test.js` always points at something to fix in a project file, a picture or the size table.

## Pictures

- Screenshots: PNG or WebP. Photos: JPEG or WebP, never PNG (a photo saved as PNG is about ten times heavier).
- Aim for under 500 kB per picture. `npm run sizes` prints the weight of each one.
- Keep the original somewhere outside `public/` (the `originals/` folder is ignored by git for that purpose).
- A picture replaced under the same file name can take up to a day to change for a returning visitor, because browsers keep media for a day and resized thumbnails are kept for 30 days. Give a replaced picture a new name to show it at once.

## Settings (environment variables)

`.env.example` lists them with an explanation. Set them in the host's project settings; on your own machine use `.env.local`.

| Variable                            | Needed for                                                                                                                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | The site's own address (`https://...`). Canonical links, `sitemap.xml`, `robots.txt` and the share image are built from it. A production build without it prints a warning.               |
| `RESEND_API_KEY`                    | Emails each contact form message to the address on the contact page, through Resend (resend.com); Reply answers the sender. Open the Resend account with that address.                    |
| `CONTACT_TO_EMAIL`                  | Optional: another inbox for the messages.                                                                                                                                                 |
| `CONTACT_FROM_EMAIL`                | Optional: a sender of your own once your domain is verified on Resend; otherwise Resend's shared address is used.                                                                         |
| `CONTACT_WEBHOOK_URL`               | Instead of email: any address that accepts a JSON POST (Formspree, Make, Zapier, n8n...). Used only without `RESEND_API_KEY`. With neither, the live form answers "Something went wrong". |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Only for media written with `cloudinary()` or `cloudinaryVideo()` from `app/_data/media.js`. No project uses them now; it is set in `.env`.                                               |

## Before going live

- Set `NEXT_PUBLIC_SITE_URL` and `RESEND_API_KEY` (or `CONTACT_WEBHOOK_URL`) on the host, then send one real message through the form.
- Make the host build with `npm run build` (not plain `next build`), so the project data is checked first.
- Mark projects that still show placeholder pictures with `draft: true`, or finish them.
- The work is on the `mud-dev` branch; a host that deploys `main` needs it merged.

## Conventions

- New styles go in a `*.styled.js` file next to the component, using the colour and spacing variables defined in `app/globals.css`.
- Breakpoints are written `@media (max-width: 720px)`. The newer `(width <= 720px)` form is ignored by Safari before 16.4, and Stylelint rejects it.
- A hook used by one section lives beside that section; one used by two or more lives in `app/_hooks/`.
- Comments say why, in plain English. `//?` marks a note for whoever edits the file next.

## Credits

Started from the open-source [dennis-snellenberg-portfolio](https://github.com/AliBagheri2079/dennis-snellenberg-portfolio) template by Ali Bagheri. Design after [Dennis Snellenberg](https://dennissnellenberg.com).
