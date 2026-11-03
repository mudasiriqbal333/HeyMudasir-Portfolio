// @ts-check
/**
 * The short way to write a project (see projects/jarvis.js for an example):
 * the facts, then the pictures as lists of file names from
 * public/assets/<slug>/, in the order the page shows them. project() turns
 * that into the CaseEntry the pages read, so no component knows the short
 * form exists.
 *
 * @typedef {import('./case-options.js').CaseEntry} Entry
 * @typedef {import('./case-options.js').CaseMedia} Media
 * @typedef {import('./case-options.js').CaseBlock} Block
 *
 * @typedef {Record<string, string>} Pictures
 *   Pictures as `{ 'file name': 'alt text' }`, shown in the order written.
 *   A file name is looked up in public/assets/<slug>/; a full address
 *   (https://...) or a site path (/...) is used as it is.
 * @typedef {Pictures | Media | Media[]} Shown
 *   What a laptop, a phone, the screenshots or the phones show: pictures, or media
 *   written out (`video(...)`, `cloudinaryVideo(...)`), alone or in a list.
 * @typedef {Omit<Entry, 'credits' | 'hero' | 'blocks'> & {
 *   credits?: string,
 *   hero: Pictures | Entry['hero'],
 *   laptop?: Shown,
 *   phone?: Shown,
 *   screens?: Shown,
 *   phones?: Shown,
 *   blocks?: Block[]}} ProjectInput
 *   `credits` is 'Mudasir Iqbal' and `liveUrl` is '' unless given. `hero` is
 *   one picture. `laptop` with several pictures plays them as a slideshow;
 *   `phone` does the same in a phone, for an app that only runs on phones
 *   (its screen takes the shape of the first picture); `screens` become the
 *   screenshots (two or more drift past as one row); `phones` are up to
 *   three phone screens side by side. `blocks` replaces those lists with
 *   blocks written out in full, for any other layout.
 */

//? How long the laptop shows each picture of a slideshow, in ms.
const SLIDE_MS = 4000;

//? Already a place of its own: a site path, a web address or inline data.
const FULL = /^(\/|https?:|data:)/;

/**
 * 'dashboard.png' -> '/assets/<slug>/dashboard.png'.
 * @param {string} slug
 * @param {string} file
 */
const at = (slug, file) =>
  typeof file !== 'string' || FULL.test(file)
    ? file
    : `/assets/${slug}/${file}`;

/**
 * @param {Pictures | Media} shown
 * @returns {shown is Media}
 */
const isMedia = shown =>
  typeof shown.type === 'string' && typeof shown.src === 'string';

/**
 * @param {string} slug
 * @param {Media} media
 * @returns {Media}
 */
const placed = (slug, media) => ({
  ...media,
  src: at(slug, media.src),
  ...(media.poster ? { poster: at(slug, media.poster) } : {}),
});

/**
 * What to say when a picture is written in a way that cannot be read: a bare
 * file name (`hero: 'home.png'`, which looks right next to `thumbnail`), a
 * list of them in [ ], or anything else that is not { }. It is refused here,
 * by project and field, because the data test only sees what project()
 * returns: a file name would reach it as one picture per letter, or stop the
 * file from loading with an error that names nothing.
 * @param {string} slug
 * @param {string} field 'hero', 'laptop', 'phone', 'screens' or 'phones'
 * @param {unknown} given what was written there
 */
const unreadable = (slug, field, given) =>
  new Error(
    typeof given === 'string'
      ? `${slug}: "${field}" names '${given}' without alt text: write it as { '${given}': 'alt text' }`
      : `${slug}: "${field}" must be written as { 'file name': 'alt text' }`,
  );

/**
 * @param {string} slug
 * @param {'laptop' | 'phone' | 'screens' | 'phones'} field the list's name, for a refusal
 * @param {Shown} [shown]
 * @returns {Media[]}
 */
function listed(slug, field, shown) {
  if (!shown) return [];
  if (typeof shown !== 'object') throw unreadable(slug, field, shown);

  if (Array.isArray(shown)) {
    return shown.map(media => {
      if (!media || typeof media !== 'object') {
        throw unreadable(slug, field, media);
      }

      return placed(slug, media);
    });
  }
  if (isMedia(shown)) return [placed(slug, shown)];

  return Object.keys(shown).map(file => ({
    type: 'image',
    src: at(slug, file),
    alt: shown[file],
  }));
}

/**
 * @param {string} slug
 * @param {ProjectInput['hero']} hero
 * @returns {Entry['hero']}
 */
function heroOf(slug, hero) {
  //? Nothing given: left as it is, and the data test says what is missing
  if (!hero) return /** @type {Entry['hero']} */ (hero);

  if (typeof hero !== 'object' || Array.isArray(hero)) {
    throw unreadable(slug, 'hero', Array.isArray(hero) ? hero[0] : hero);
  }

  if ('image' in hero) {
    return {
      .../** @type {Entry['hero']} */ (hero),
      image: at(slug, hero.image),
      ...(hero.logo ? { logo: at(slug, hero.logo) } : {}),
    };
  }

  const files = Object.keys(hero);
  if (files.length > 1) {
    throw new Error(
      `${slug}: the hero is one picture, but ${files.length} are given (${files.join(', ')})`,
    );
  }

  return { image: at(slug, files[0]), alt: hero[files[0]], logo: null };
}

/**
 * Several pictures play by themselves: 'fade' cross-fades from one to the
 * next ('slide' would move them sideways). One item, or a list holding a
 * video, is shown as it is (a list gets previous / next arrows), because a
 * slideshow would move on while a video is playing. In the laptop every
 * picture is shown whole on black; a phone (`device: 'phone'`) fills its
 * screen with them instead.
 * @param {Media[]} media
 * @param {'laptop' | 'phone'} [device] the laptop unless 'phone'
 * @returns {Block[]}
 */
function deviceBlocks(media, device = 'laptop') {
  const which = device === 'phone' ? { device } : {};

  if (media.length < 2)
    return media.map(item => ({ type: 'device', ...which, media: item }));

  return media.every(item => item.type === 'image')
    ? [{ type: 'device', ...which, autoplay: SLIDE_MS, effect: 'fade', media }]
    : [{ type: 'device', ...which, media }];
}

/**
 * A silent, looping recording for the laptop, with the picture shown until
 * it plays. Both are file names in the project's folder.
 * @param {string} file
 * @param {string} poster
 * @param {string} alt
 * @returns {Media}
 */
export const video = (file, poster, alt) => ({
  type: 'video',
  src: file,
  poster,
  alt,
});

/**
 * One project, written the short way.
 * @param {ProjectInput} input
 * @returns {Entry}
 */
export function project(input) {
  const {
    slug,
    credits = 'Mudasir Iqbal',
    liveUrl = '',
    thumbnail,
    deviceFrame,
    hero,
    laptop,
    phone,
    screens,
    phones,
    blocks,
    ...facts
  } = input;

  //? The lists would be dropped without a word otherwise
  if (blocks && (laptop || phone || screens || phones)) {
    throw new Error(
      `${slug}: give either "blocks" or the laptop / phone / screens / phones lists, not both`,
    );
  }

  const onPhones = listed(slug, 'phones', phones);

  return {
    slug,
    ...facts,
    credits,
    liveUrl,
    thumbnail: at(slug, thumbnail),
    ...(deviceFrame ? { deviceFrame: at(slug, deviceFrame) } : {}),
    hero: heroOf(slug, hero),
    blocks: blocks ?? [
      ...deviceBlocks(listed(slug, 'laptop', laptop)),
      ...deviceBlocks(listed(slug, 'phone', phone), 'phone'),
      ...listed(slug, 'screens', screens).map(
        media => /** @type {Block} */ ({ type: 'plain', media }),
      ),
      .../** @type {Block[]} */ (
        onPhones.length ? [{ type: 'mobiles', media: onPhones }] : []
      ),
    ],
  };
}

/**
 * Gives every picture that has no typed size its real one from the table
 * scripts/media-sizes.mjs writes (app/_data/media-sizes.json). A typed size
 * always wins, and a picture the table does not know (a remote one, an
 * inline placeholder) is left without.
 *
 * Call it on the server only (app/work/[slug]/page.jsx does): the table is
 * then never sent to the browser.
 *
 * @param {Entry} entry
 * @param {Record<string, number[]>} sizes site path -> [width, height]
 * @returns {Entry}
 */
export function withSizes(entry, sizes) {
  /** @param {Media} media */
  const sized = media => {
    const known =
      media?.type === 'image' &&
      media.width == null &&
      media.height == null &&
      Object.prototype.hasOwnProperty.call(sizes, media.src);

    return known
      ? { ...media, width: sizes[media.src][0], height: sizes[media.src][1] }
      : media;
  };

  return {
    ...entry,
    blocks: entry.blocks.map(
      block =>
        /** @type {Block} */ ({
          ...block,
          media: Array.isArray(block.media)
            ? block.media.map(sized)
            : sized(block.media),
        }),
    ),
  };
}

/**
 * The projects a build publishes. An entry marked `draft: true` is left out
 * of the live site (a production build) and shown everywhere else, so a
 * project can be worked on in `npm run dev` before it goes public. It is
 * not kept secret by this: see `draft` in case-options.js.
 *
 * @template {{draft?: boolean}} T
 * @param {T[]} entries
 * @param {string | undefined} mode the build's NODE_ENV
 * @returns {T[]}
 */
export const withoutDrafts = (entries, mode) =>
  mode === 'production' ? entries.filter(entry => !entry.draft) : entries;
