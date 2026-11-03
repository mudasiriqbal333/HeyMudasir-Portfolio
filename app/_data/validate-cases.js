/**
 * The checks on the project data: what lint, the editor and the build do not
 * see, and what would otherwise show up as a broken picture on the live site.
 * case-options.test.js runs them on the real projects and files;
 * validate-cases.test.js tries each of them on a made-up project.
 *
 * validateCases() itself touches nothing: what is on disk is handed to it,
 * so a test can also run it on planted mistakes. It is used by the tests and
 * by `npm run sizes` only, never by a page.
 *
 * @typedef {import('./case-options.js').CaseEntry} Entry
 * @typedef {import('./case-options.js').CaseMedia} Media
 * @typedef {{bytes: number, named?: string, format?: string, width?: number, height?: number}} FileInfo
 *   One file under public/: `named` is the picture type its extension
 *   promises, `format` the type its content really is.
 * @typedef {object} CaseContext
 * @property {string[]} categories the categories a project may list
 * @property {Record<string, FileInfo>} files every file under public/, by
 *   site path ('/assets/jarvis/02.png') spelled exactly as on disk
 * @property {Record<string, number[]>} sizes the committed media-sizes.json
 * @property {string[]} [wideThumbnails] thumbnails accepted although they
 *   are not square
 */
import { groupScreenRuns } from '../_utils/helpers/screen-strip.js';

//? The blocks the project page can draw and what a block can hold. These
//? repeat the CaseBlock and CaseMedia types in case-options.js, which only
//? the editor can read.
const BLOCK_TYPES = ['device', 'plain', 'fullwidth', 'mobiles'];
const MEDIA_TYPES = ['image', 'video'];
//? What a device block draws: the laptop unless it says 'phone'.
const DEVICES = ['laptop', 'phone'];
//? How far a picture's shape may stray from the first one in a phone before
//? the phone, which fills its screen with each, visibly crops it.
const PHONE_SHAPE = 0.02;

const TEXT_FIELDS = ['title', 'services', 'credits', 'location', 'year'];

//? Lower-case words joined by hyphens: 'my-friend', 'tow123'.
const WORDS = '[a-z0-9]+(-[a-z0-9]+)*';
const SLUG = new RegExp(`^${WORDS}$`);
//? ...and a site path made of such names: '/assets/rehq/mobile-deals.png'.
const TIDY_PATH = new RegExp(`^(/${WORDS})*/${WORDS}(\\.[a-z0-9]+)+$`);

const COLOUR = /^#[0-9a-f]{6}$/i;

//? How a file of each kind should end.
const ENDING = { png: '.png', jpeg: '.jpg', webp: '.webp', gif: '.gif' };

/**
 * Thumbnails accepted although they are not square (within 1%). The Home and
 * Work tiles and the hover preview are square, so anything else is cropped
 * there. Keep this list short, and say why for each.
 */
export const wideThumbnails = [
  //? TOW123, 1000x750, on purpose: the square tiles crop it from the
  //? centre, and the "Next case" tile shows it at 100:85. A square cut would
  //? look different in that tile, so this picture is not to be replaced.
  '/assets/tow123/thumbnail.jpg',
];

const filled = value => typeof value === 'string' && value.trim() !== '';

//? The optional line under a title ("Powered by BMW") sits in the space under
//? the title in the Work and Home rows, which holds one short line.
const TAGLINE_MAX = 40;

/**
 * A size typed in quotes: `width: '2040'`. It is told apart from a wrong
 * number, because "says 2040x1284, but the file is 2040x1284" explains
 * nothing.
 * @param {Media} media
 */
const sizeAsText = media =>
  [media?.width, media?.height].some(
    side => side != null && typeof side !== 'number',
  );

/**
 * Every picture and video of a project's blocks, with the name of its field:
 * 'blocks[0].media[2]' in a list, 'blocks[1].media' on its own.
 * @param {Entry} entry
 * @returns {{field: string, item: Media}[]}
 */
function mediaItems(entry) {
  const blocks = Array.isArray(entry?.blocks) ? entry.blocks : [];

  return blocks.flatMap((block, at) => {
    const media = block?.media;
    const field = `blocks[${at}].media`;

    if (Array.isArray(media)) {
      return media.map((item, index) => ({
        field: `${field}[${index}]`,
        item,
      }));
    }

    return media ? [{ field, item: media }] : [];
  });
}

/**
 * Every file a project names, with the field that names it: the thumbnail,
 * the hero and its logo, the device frame, and each block picture, video
 * and poster.
 * @param {Entry} entry
 * @returns {{field: string, src: string}[]}
 */
export function caseFiles(entry) {
  return [
    { field: 'thumbnail', src: entry?.thumbnail },
    { field: 'hero.image', src: entry?.hero?.image },
    { field: 'hero.logo', src: entry?.hero?.logo },
    { field: 'deviceFrame', src: entry?.deviceFrame },
    ...mediaItems(entry).flatMap(({ field, item }) => [
      { field: `${field}.src`, src: item?.src },
      { field: `${field}.poster`, src: item?.poster },
    ]),
  ].filter(({ src }) => filled(src));
}

/**
 * Checks every project and returns what is wrong, one sentence each, as
 * "<slug>: <field>: <what and why>". An empty list means all is well.
 *
 * @param {Entry[]} entries
 * @param {CaseContext} context
 * @returns {string[]}
 */
export function validateCases(entries, context) {
  const { categories, files, sizes, wideThumbnails: wide = [] } = context;
  const problems = [];
  const slugs = new Set();

  //? The same path in small letters -> how the disk spells it
  const spelled = new Map(
    Object.keys(files).map(name => [name.toLowerCase(), name]),
  );

  entries.forEach((entry, position) => {
    const name = filled(entry?.slug) ? entry.slug : `entry ${position + 1}`;
    const say = (field, text) => problems.push(`${name}: ${field}: ${text}`);

    /**
     * A file an entry names. Remote and inline pictures are not looked up.
     * @param {string} field
     * @param {string} src
     * @param {object} [expect]
     * @param {boolean} [expect.picture] must be a picture that can be measured
     * @param {boolean} [expect.square] must be square within 1%
     * @param {Media} [expect.media] the block picture it belongs to: its size is checked
     * @returns {void}
     */
    const checkFile = (field, src, { picture, square, media } = {}) => {
      if (/^(data:|https:\/\/)/.test(src)) return;

      if (/^http:\/\//.test(src)) {
        say(field, `${src} must start with https://`);

        return;
      }
      if (!/^\/(?!\/)/.test(src)) {
        say(
          field,
          `"${src}" is not a full path: write /assets/<slug>/<file>, or an https:// address`,
        );

        return;
      }

      if (!Object.hasOwn(files, src)) {
        const actual = spelled.get(src.toLowerCase());

        say(
          field,
          actual
            ? `${src} is spelled ${actual} on disk: the capitals must match exactly (a Mac opens it anyway, the live site answers 404)`
            : `${src} does not exist under public/`,
        );

        return;
      }

      const info = files[src];

      if (!TIDY_PATH.test(src)) {
        say(
          field,
          `${src}: file and folder names must be lower-case letters, digits and hyphens (no capitals, spaces or underscores)`,
        );
      }
      if (info.named && info.format && info.named !== info.format) {
        say(
          field,
          `${src} holds ${info.format.toUpperCase()} data, not ${info.named.toUpperCase()}: rename it to end in ${ENDING[info.format]}`,
        );
      }

      if (!picture) return;

      if (!info.format) {
        say(
          field,
          `${src} is not a picture the site can measure: use a PNG, JPEG, WebP or GIF`,
        );

        return;
      }

      const real = `${info.width}x${info.height}`;

      if (
        square &&
        Math.abs(info.width / info.height - 1) > 0.01 &&
        !wide.includes(src)
      ) {
        say(
          field,
          `${src} is ${real}, not square: the tiles and the hover preview crop it (cut it square, or add it to wideThumbnails in validate-cases.js if the crop is meant)`,
        );
      }

      if (!media) return;

      if (media.width != null || media.height != null) {
        //? Typed by hand: it has to be the real size (a size typed as text
        //? is reported once, with the picture's other fields)
        if (
          !sizeAsText(media) &&
          (media.width !== info.width || media.height !== info.height)
        ) {
          say(
            field.replace(/\.src$/, ''),
            `says ${media.width ?? '?'}x${media.height ?? '?'}, but ${src} is ${real}: correct the numbers, or delete them (the size is read from the file)`,
          );
        }
      } else if (!Object.hasOwn(sizes, src)) {
        say(
          field,
          `${src} has no size in media-sizes.json: run "npm run sizes" (it lists the pictures under public/assets/), or type width and height`,
        );
      } else if (sizes[src].join('x') !== real) {
        say(
          field,
          `media-sizes.json says ${sizes[src].join('x')} for ${src}, but the file is ${real}: run "npm run sizes"`,
        );
      }
    };

    //? -- the facts --------------------------------------------------------
    if (!filled(entry?.slug)) say('slug', 'is missing');
    else if (!SLUG.test(entry.slug)) {
      say(
        'slug',
        `"${entry.slug}" must be lower-case words joined by hyphens, like "my-project"`,
      );
    } else if (slugs.has(entry.slug)) {
      say(
        'slug',
        'is used by more than one project: only the first can be opened',
      );
    }
    slugs.add(entry?.slug);

    for (const field of TEXT_FIELDS) {
      if (!filled(entry?.[field])) {
        say(field, 'is missing or empty (write it as text, in quotes)');
      }
    }

    if (entry?.tagline !== undefined) {
      const length = filled(entry.tagline) ? entry.tagline.trim().length : 0;

      if (!length) {
        say(
          'tagline',
          'is empty or not text: write a short line in quotes, or leave tagline out',
        );
      } else if (length > TAGLINE_MAX) {
        say(
          'tagline',
          `is ${length} characters long: keep it to ${TAGLINE_MAX} or fewer, so it stays on one line under the title`,
        );
      }
    }

    if (!COLOUR.test(entry?.background ?? '')) {
      say(
        'background',
        `"${entry?.background}" is not a colour written as #rrggbb`,
      );
    }

    if (!Array.isArray(entry?.categories) || !entry.categories.length) {
      say(
        'categories',
        `is empty: the project would only show under "All" on the Work page (known: ${categories.join(', ')})`,
      );
    } else {
      entry.categories
        .filter(category => !categories.includes(category))
        .forEach(category =>
          say(
            'categories',
            `"${category}" is not a known category (${categories.join(', ')})`,
          ),
        );
    }

    if (entry?.liveUrl != null && entry.liveUrl !== '') {
      let secure = false;
      try {
        secure =
          /^https:\/\//.test(entry.liveUrl) &&
          new URL(entry.liveUrl).protocol === 'https:';
      } catch {
        //? Not an address at all
      }

      if (!secure) {
        say(
          'liveUrl',
          `"${entry.liveUrl}" must be empty or a full address starting with https://`,
        );
      }
    }

    //? -- the pictures outside the blocks ----------------------------------
    if (!filled(entry?.thumbnail)) {
      say('thumbnail', 'is missing: the Home and Work lists show it');
    } else {
      checkFile('thumbnail', entry.thumbnail, { picture: true, square: true });
    }

    if (!entry?.hero || typeof entry.hero !== 'object') {
      say('hero', 'is missing: every project page opens with one picture');
    } else {
      if (!filled(entry.hero.image)) say('hero.image', 'is missing');
      else checkFile('hero.image', entry.hero.image);

      if (!filled(entry.hero.alt)) {
        say('hero.alt', 'is empty: every picture needs alt text');
      }
      if (filled(entry.hero.logo)) checkFile('hero.logo', entry.hero.logo);
    }

    if (filled(entry?.deviceFrame)) {
      checkFile('deviceFrame', entry.deviceFrame);
    }

    //? -- the blocks -------------------------------------------------------
    if (!Array.isArray(entry?.blocks)) {
      say(
        'blocks',
        'is missing: give the laptop, screens and phones lists, or "blocks: []" for a page with none',
      );

      return;
    }

    entry.blocks.forEach((block, at) => {
      const field = `blocks[${at}]`;
      const media = block?.media;
      const list = Array.isArray(media);

      if (!BLOCK_TYPES.includes(block?.type)) {
        say(
          `${field}.type`,
          `"${block?.type}" is not a known block type (${BLOCK_TYPES.join(', ')}): the block would not be drawn`,
        );
      }

      if (
        block?.type === 'device' &&
        block.device != null &&
        !DEVICES.includes(block.device)
      ) {
        say(
          `${field}.device`,
          `"${block.device}" is not a known device (${DEVICES.join(', ')}): a laptop would be drawn`,
        );
      }

      if (media == null || (list && !media.length)) {
        say(
          `${field}.media`,
          'is empty: a block needs at least one picture or video',
        );
      } else if (['plain', 'fullwidth'].includes(block.type) && list) {
        say(`${field}.media`, 'takes one picture or video, not a list');
      } else if (block.type === 'mobiles' && !list) {
        say(
          `${field}.media`,
          'must be a list of one to three phone screens, in [ ]',
        );
      } else if (block.type === 'mobiles' && media.length > 3) {
        say(
          `${field}.media`,
          `holds ${media.length} phones, but only the first 3 are shown`,
        );
      }
    });

    /** @type {Map<Media, string>} */
    const fieldOf = new Map();

    for (const { field, item } of mediaItems(entry)) {
      fieldOf.set(item, field);

      if (!MEDIA_TYPES.includes(item?.type)) {
        say(
          `${field}.type`,
          `"${item?.type}" is not a known media type (${MEDIA_TYPES.join(', ')})`,
        );
      }

      if (!filled(item?.src)) say(`${field}.src`, 'is missing');
      else {
        const image = item.type === 'image';

        checkFile(`${field}.src`, item.src, {
          picture: image,
          media: image ? item : undefined,
        });
      }

      if (sizeAsText(item)) {
        say(
          field,
          "width and height must be numbers, not text: write width: 2040, not width: '2040'",
        );
      }

      if (!filled(item?.alt)) {
        say(
          `${field}.alt`,
          item?.type === 'video'
            ? 'is empty: say in a few words what the video shows'
            : 'is empty: every picture needs alt text',
        );
      }
      if (filled(item?.poster)) checkFile(`${field}.poster`, item.poster);
    }

    //? -- the same picture twice -------------------------------------------
    //? The laptop and the moving row tell their pictures apart by address,
    //? so a repeated one breaks them. One report per picture is enough.
    const repeated = new Set();
    const repeat = (field, text) => {
      if (!repeated.has(field)) say(`${field}.src`, text);
      repeated.add(field);
    };

    entry.blocks.forEach((block, at) => {
      if (block?.type !== 'device' || !Array.isArray(block.media)) return;

      const seen = new Set();
      const device = block.device === 'phone' ? 'phone' : 'laptop';
      block.media.forEach((item, index) => {
        if (seen.has(item?.src)) {
          repeat(
            `blocks[${at}].media[${index}]`,
            `${item.src} is already in this ${device}: a picture can be in it only once`,
          );
        }
        seen.add(item?.src);
      });
    });

    //? -- a phone's pictures, all of one shape ---------------------------
    //? The phone's screen takes the shape of its first picture and fills it
    //? with every other one, so one of another shape loses its edges.
    entry.blocks.forEach((block, at) => {
      if (block?.type !== 'device' || block.device !== 'phone') return;
      if (!Array.isArray(block.media)) return;

      /** @param {Media} item */
      const sizeOf = item =>
        item?.type === 'image' && Object.hasOwn(files, item.src)
          ? files[item.src]
          : null;
      const first = sizeOf(block.media[0]);
      if (!first?.width || !first?.height) return;
      const shape = first.width / first.height;

      block.media.forEach((item, index) => {
        const size = sizeOf(item);
        if (index === 0 || !size?.width || !size?.height) return;

        if (Math.abs(size.width / size.height - shape) / shape > PHONE_SHAPE) {
          say(
            `blocks[${at}].media[${index}].src`,
            `${item.src} is ${size.width}x${size.height}, another shape than the phone's first picture (${first.width}x${first.height}): the phone fills its screen with it and crops its edges. Cut it to that shape`,
          );
        }
      });
    });

    for (const { strip } of groupScreenRuns(entry.blocks)) {
      const seen = new Set();

      for (const { media } of strip ?? []) {
        if (seen.has(media.src)) {
          repeat(
            fieldOf.get(media),
            `${media.src} is already in the moving row of screenshots it joins (a laptop slideshow's later pictures lead that row): a picture can be in a row only once`,
          );
        }
        seen.add(media.src);
      }
    }
  });

  return problems;
}
