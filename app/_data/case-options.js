// @ts-check
/**
 * Project (case) pages. Each project is a file of its own in projects/,
 * written the short way (see project.js); projects/index.js lists them and
 * sets their order. This file holds the types and hands the list to the
 * pages.
 *
 * @typedef {{type: 'image' | 'video', src: string, alt?: string, poster?: string, controls?: boolean, width?: number, height?: number}} CaseMedia
 *   `src` is any URL (or cloudinary(id) / cloudinaryVideo(id) from media.js).
 *   Videos autoplay muted while in view; with `controls: true` they wait for
 *   a click, keep their sound and are shown uncropped.
 *   An image's pixel `width` and `height` reserve its box before it loads; in
 *   a `plain` block the screenshot then keeps its own shape. Leave them out
 *   for a file under public/assets/: the project page fills them in from
 *   media-sizes.json, which `npm run sizes` writes from the files themselves.
 * @typedef {{type: 'device', media: CaseMedia | CaseMedia[], device?: 'laptop' | 'phone', autoplay?: number, effect?: 'slide' | 'fade', paddingBottom?: boolean, background?: string}
 *   | {type: 'plain', media: CaseMedia, paddingBottom?: boolean, background?: string}
 *   | {type: 'fullwidth', media: CaseMedia, tint?: number}
 *   | {type: 'mobiles', media: CaseMedia[], background?: string}} CaseBlock
 *   device = laptop mockup (drawn frame, or `deviceFrame` PNG on the case);
 *   give it several media to get previous / next arrows on the screen, and
 *   `autoplay: 4000` to have several pictures change on their own every 4s
 *   (a click on the screen also moves it); the first picture stays up 2s
 *   longer, and the later ones also appear in the moving strip below
 *   (pictures in the laptop are shown whole on black, never cropped);
 *   `device: 'phone'` draws a phone instead, for an app that only runs on
 *   phones: its screen takes the shape of the first picture, which the
 *   others fill (give them all that shape);
 *   plain = screenshot in the container, at its own shape; two or more plain
 *   screenshots in a row are drawn as one strip that drifts from right to
 *   left and can be scrolled or dragged sideways; fullwidth = edge to edge with an
 *   optional dark `tint` 0-1; mobiles = one to three phone screenshots.
 *   `background` overrides the case colour; the last block's colour also
 *   tints the footer's curved lip.
 * @typedef {{label?: string, lead?: string, body?: string[],
 *   builtLabel?: string, built?: string[]}} CaseDescription
 *   What the project is, in your own words, under the hero. `lead` is the one
 *   opening sentence, set large and typed in word by word; `body` is one
 *   string per paragraph under it; `built` is the short list in the right-hand
 *   column -- what you made or used -- which rises in beneath the lead.
 *   `label` and `builtLabel` rename the two headings ("The project" and
 *   "What I built"). Every field is optional: fill in as much as you have
 *   written, and leave `description` out altogether until you have written
 *   something, in which case the page simply has no description section.
 * @typedef {{slug: string, title: string, tagline?: string, services: string,
 *   credits: string, location: string, year: string, liveUrl?: string,
 *   background: string,
 *   thumbnail: string, categories: import('./work-options.js').WorkCategory[],
 *   deviceFrame?: string, description?: CaseDescription, draft?: boolean,
 *   hero: {image: string, alt: string, logo: string | null},
 *   blocks: CaseBlock[]}} CaseEntry
 *   `tagline` is an optional short line set small under the title, on the
 *   project page and in the Work and Home lists ("Powered by BMW").
 *   `categories` files the project under the Work page filters; the names
 *   come from workFilters in work-options.js. `draft: true` keeps a project
 *   off the live site while it is being written: it shows in `npm run dev`
 *   and is left out of a production build (pages, lists, counts, sitemap).
 *   Left out is not the same as secret: a draft's text is still inside the
 *   script files the site sends to every browser, and its pictures under
 *   public/assets/ still answer by address. Someone who looks there can find
 *   them, so do not use a draft for anything confidential.
 */
import { withoutDrafts } from './project.js';
import { projects } from './projects/index.js';

/**
 * The projects this build shows, in the order projects/index.js gives them.
 * @type {CaseEntry[]}
 */
export const caseOptions = withoutDrafts(projects, process.env.NODE_ENV);
