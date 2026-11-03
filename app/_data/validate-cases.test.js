import assert from 'node:assert/strict';
import { test } from 'node:test';

import { project, video } from './project.js';
import { caseFiles, validateCases } from './validate-cases.js';

//? Nothing in this file reads the real projects or the real public/ folder.
//? The checks are tried on a made-up project and a made-up list of files, so
//? no edit to a real project, however large, can turn one of these tests
//? red. The real data is checked in case-options.test.js.

/**
 * What the disk would hold for a picture of this size.
 * @param {number} width
 * @param {number} height
 * @param {string} [format] what the file is, and what its name says it is
 */
const picture = (width, height, format = 'png') => ({
  bytes: 1,
  named: format,
  format,
  width,
  height,
});

//? The made-up public/ folder, by site path.
const files = {
  '/assets/demo/thumbnail.jpg': picture(1000, 1000, 'jpeg'),
  '/assets/demo/home.webp': picture(2586, 1632, 'webp'),
  '/assets/demo/dashboard.png': picture(2048, 1280),
  '/assets/demo/leads.png': picture(2048, 1280),
  '/assets/demo/campaigns.png': picture(2048, 1280),
  '/assets/demo/sms.png': picture(2048, 1280),
  '/assets/demo/chat.png': picture(2940, 1662),
  '/assets/demo/setup.png': picture(2040, 1284),
  '/assets/demo/roles.png': picture(2046, 1282),
  '/assets/demo/mobile-home.png': picture(780, 1688),
  '/assets/demo/mobile-leads.png': picture(780, 1688),
  '/assets/demo/mobile-email.png': picture(780, 1688),
  '/assets/demo/app-home.png': picture(750, 1624),
  '/assets/demo/app-trips.png': picture(750, 1624),
  '/assets/demo/app-chat.png': picture(750, 1624),
  '/assets/demo/intro.mp4': { bytes: 480_600 },
  '/assets/demo/intro-poster.jpg': picture(1600, 1000, 'jpeg'),
  //? In the folder, but in none of the lists below: some rows point at them
  '/assets/demo/mobile-menu.png': picture(780, 1688),
  '/assets/demo/Leads-table.png': picture(2048, 1280),
  '/assets/demo/logo.svg': { bytes: 900 },
};

//? The size table `npm run sizes` would write for that folder.
const sizes = Object.fromEntries(
  Object.entries(files)
    .filter(([, info]) => info.width)
    .map(([name, info]) => [name, [info.width, info.height]]),
);

const context = {
  //? Made up as well: the real names are read from the Work page's filters,
  //? in case-options.test.js
  categories: ['development', 'consultancy'],
  files,
  sizes,
  wideThumbnails: [],
};

/**
 * The made-up project as its file would be written. Every call gives a fresh
 * one, so a test can break its copy without spoiling the next test's.
 * @param {object} [more] fields to add or replace
 */
const written = more => ({
  slug: 'demo',
  title: 'Demo',
  services: 'Design & Development',
  categories: ['development'],
  location: 'United Kingdom',
  year: '2026',
  liveUrl: 'https://example.com/',
  background: '#e0d9d1',
  thumbnail: 'thumbnail.jpg',
  hero: { 'home.webp': 'Demo welcome page' },
  laptop: {
    'dashboard.png': 'Demo dashboard',
    'leads.png': 'Demo leads table',
    'campaigns.png': 'Demo campaigns table',
    'sms.png': 'Demo writing an SMS',
  },
  screens: {
    'chat.png': 'Demo conversation with a lead',
    'setup.png': 'Demo campaign setup',
    'roles.png': 'Demo roles table',
  },
  phones: {
    'mobile-home.png': 'Demo on a phone',
    'mobile-leads.png': 'Demo leads on a phone',
    'mobile-email.png': 'Demo writing an email on a phone',
  },
  ...more,
});

/**
 * The project the mistakes are planted in. Its blocks, in page order:
 *   blocks[0]     the laptop, a slideshow of four pictures
 *   blocks[1..3]  three screenshots (chat, setup, roles)
 *   blocks[4]     three phones
 */
const demo = () => project(written());

/** The same project with a recording in the laptop instead of pictures. */
const recorded = () =>
  project(
    written({ laptop: video('intro.mp4', 'intro-poster.jpg', 'Demo intro') }),
  );

/** The same project with a phone in place of the laptop, for a phone app. */
const phoneApp = () =>
  project(
    written({
      laptop: undefined,
      phone: {
        'app-home.png': 'Demo app home',
        'app-trips.png': 'Demo app trips',
        'app-chat.png': 'Demo app chat',
      },
    }),
  );

/** One problem to a line, so a failure reads as a list of sentences. */
const listed = problems => `\n${problems.join('\n')}\n`;

/** The same files, with what is known about one of them replaced. */
const withFile = (name, info) => ({
  ...context,
  files: { ...files, [name]: info },
});

test('the made-up project is clean before a mistake is planted in it', () => {
  for (const make of [demo, recorded, phoneApp]) {
    const problems = validateCases([make()], context);

    assert.equal(problems.length, 0, listed(problems));
  }
});

//? Each row breaks one thing in a fresh copy of the made-up project and says
//? how the report must start: the project, then the field, then the reason.
//?   [what is broken, the project to break, how it is broken, the report(s)]
//? `plant` may return the context to check against, when the mistake is on
//? disk or in the size table rather than in the entry.
const mistakes = [
  [
    'a slug with a capital and a space',
    demo,
    entry => {
      entry.slug = 'Demo Project';
    },
    [/^Demo Project: slug: .*lower-case/],
  ],
  [
    'no slug at all',
    demo,
    entry => {
      delete entry.slug;
    },
    [/^entry 1: slug: /],
  ],
  ...['title', 'services', 'credits', 'location', 'year'].map(field => [
    `an empty ${field}`,
    demo,
    entry => {
      entry[field] = '  ';
    },
    [new RegExp(`^demo: ${field}: `)],
  ]),
  [
    'an empty tagline',
    demo,
    entry => {
      entry.tagline = '  ';
    },
    [/^demo: tagline: .*empty/],
  ],
  [
    'a tagline that is not text',
    demo,
    entry => {
      entry.tagline = 42;
    },
    [/^demo: tagline: /],
  ],
  [
    'a tagline too long for one line under the title',
    demo,
    entry => {
      entry.tagline = 'Powered by the engineering teams of a large carmaker';
    },
    [/^demo: tagline: .*52 characters.*40/],
  ],
  [
    'a colour one digit short',
    demo,
    entry => {
      entry.background = '#e0d9d';
    },
    [/^demo: background: "#e0d9d" /],
  ],
  [
    'a misspelled category',
    demo,
    entry => {
      entry.categories = ['developement'];
    },
    [/^demo: categories: .*developement.*development, consultancy/],
  ],
  [
    'no category',
    demo,
    entry => {
      entry.categories = [];
    },
    [/^demo: categories: /],
  ],
  [
    'the categories left out',
    demo,
    entry => {
      delete entry.categories;
    },
    [/^demo: categories: /],
  ],
  [
    'a live address without https://',
    demo,
    entry => {
      entry.liveUrl = 'www.example.com';
    },
    [/^demo: liveUrl: .*www\.example\.com.*https:\/\//],
  ],
  [
    'a live address on http',
    demo,
    entry => {
      entry.liveUrl = 'http://www.example.com/';
    },
    [/^demo: liveUrl: /],
  ],
  [
    'no thumbnail',
    demo,
    entry => {
      delete entry.thumbnail;
    },
    [/^demo: thumbnail: /],
  ],
  [
    'no hero',
    demo,
    entry => {
      delete entry.hero;
    },
    [/^demo: hero: /],
  ],
  [
    'a hero without alt text',
    demo,
    entry => {
      entry.hero.alt = '';
    },
    [/^demo: hero\.alt: /],
  ],
  [
    'no blocks',
    demo,
    entry => {
      delete entry.blocks;
    },
    [/^demo: blocks: /],
  ],
  [
    'a misspelled block type',
    demo,
    entry => {
      entry.blocks[1].type = 'plian';
    },
    [/^demo: blocks\[1\]\.type: .*plian.*device, plain, fullwidth, mobiles/],
  ],
  [
    'a misspelled media type',
    demo,
    entry => {
      entry.blocks[1].media.type = 'img';
    },
    [/^demo: blocks\[1\]\.media\.type: .*img.*image, video/],
  ],
  [
    'a block with nothing in it',
    demo,
    entry => {
      delete entry.blocks[1].media;
    },
    [/^demo: blocks\[1\]\.media: /],
  ],
  [
    'a laptop with an empty list',
    demo,
    entry => {
      entry.blocks[0].media = [];
    },
    [/^demo: blocks\[0\]\.media: /],
  ],
  [
    'a screenshot block given a list',
    demo,
    entry => {
      entry.blocks[1].media = [entry.blocks[1].media];
    },
    [/^demo: blocks\[1\]\.media: .*one/],
  ],
  [
    'a phones block given one picture instead of a list',
    demo,
    entry => {
      [entry.blocks[4].media] = entry.blocks[4].media;
    },
    [/^demo: blocks\[4\]\.media: .*list/],
  ],
  [
    'the same picture twice in the laptop',
    demo,
    entry => {
      entry.blocks[0].media[3] = { ...entry.blocks[0].media[1] };
    },
    [/^demo: blocks\[0\]\.media\[3\]\.src: .*leads\.png.*in this laptop/],
  ],
  [
    "the laptop's first picture again later in it",
    demo,
    entry => {
      //? The first picture never joins the moving row, so only the laptop
      //? itself holds it twice
      entry.blocks[0].media[2] = { ...entry.blocks[0].media[0] };
    },
    [/^demo: blocks\[0\]\.media\[2\]\.src: .*dashboard\.png.*in this laptop/],
  ],
  [
    'a screenshot that the laptop already hands to the moving row',
    demo,
    entry => {
      entry.blocks[2].media = { ...entry.blocks[0].media[2] };
    },
    [/^demo: blocks\[2\]\.media\.src: .*campaigns\.png.*moving row/],
  ],
  [
    'the same screenshot twice in a row',
    demo,
    entry => {
      entry.blocks[3].media = { ...entry.blocks[2].media };
    },
    [/^demo: blocks\[3\]\.media\.src: .*setup\.png.*moving row/],
  ],
  [
    'a fourth phone',
    demo,
    entry => {
      entry.blocks[4].media.push({
        type: 'image',
        src: '/assets/demo/mobile-menu.png',
        alt: 'Demo menu on a phone',
      });
    },
    [/^demo: blocks\[4\]\.media: .*4 .*3/],
  ],
  [
    'a picture without alt text',
    demo,
    entry => {
      entry.blocks[0].media[2].alt = ' ';
    },
    [/^demo: blocks\[0\]\.media\[2\]\.alt: .*picture/],
  ],
  [
    'a video without alt text',
    recorded,
    entry => {
      delete entry.blocks[0].media.alt;
    },
    [/^demo: blocks\[0\]\.media\.alt: .*video/],
  ],
  [
    'a file name with a typo',
    demo,
    entry => {
      entry.blocks[2].media.src = '/assets/demo/setpu.png';
    },
    [/^demo: blocks\[2\]\.media\.src: \/assets\/demo\/setpu\.png .*not exist/],
  ],
  [
    'a file name that differs only in capitals',
    demo,
    entry => {
      entry.blocks[0].media[1].src = '/assets/demo/leads.PNG';
    },
    [
      /^demo: blocks\[0\]\.media\[1\]\.src: \/assets\/demo\/leads\.PNG .*\/assets\/demo\/leads\.png.*capitals/,
    ],
  ],
  [
    'a hero file that does not exist',
    demo,
    entry => {
      entry.hero.image = '/assets/demo/welcome.webp';
    },
    [/^demo: hero\.image: .*not exist/],
  ],
  [
    'a hero logo that does not exist',
    demo,
    entry => {
      entry.hero.logo = '/assets/demo/logo.png';
    },
    [/^demo: hero\.logo: \/assets\/demo\/logo\.png .*not exist/],
  ],
  [
    'a video poster that does not exist',
    recorded,
    entry => {
      entry.blocks[0].media.poster = '/assets/demo/poster.jpg';
    },
    [/^demo: blocks\[0\]\.media\.poster: .*not exist/],
  ],
  [
    'a bare file name in a block written out in full',
    demo,
    entry => {
      entry.blocks[2].media.src = 'setup.png';
    },
    [/^demo: blocks\[2\]\.media\.src: "setup\.png" .*\/assets\//],
  ],
  [
    'a picture on plain http',
    demo,
    entry => {
      entry.blocks[2].media.src = 'http://example.com/setup.png';
    },
    [/^demo: blocks\[2\]\.media\.src: .*must start with https:\/\//],
  ],
  [
    'a width and height swapped',
    demo,
    entry => {
      entry.blocks[2].media.width = 1284;
      entry.blocks[2].media.height = 2040;
    },
    [/^demo: blocks\[2\]\.media: .*1284x2040.*2040x1284/],
  ],
  [
    'a width typed without a height',
    demo,
    entry => {
      entry.blocks[2].media.width = 2040;
    },
    [/^demo: blocks\[2\]\.media: says 2040x\?, .*2040x1284/],
  ],
  [
    'a width and height typed as text',
    demo,
    entry => {
      //? The right numbers, in quotes: "says 2040x1284, but the file is
      //? 2040x1284" would explain nothing
      entry.blocks[2].media.width = '2040';
      entry.blocks[2].media.height = '1284';
    },
    [/^demo: blocks\[2\]\.media: width and height must be numbers, not text/],
  ],
  [
    'a height typed as text beside a width that is a number',
    demo,
    entry => {
      entry.blocks[4].media[1].width = 780;
      entry.blocks[4].media[1].height = '1688';
    },
    [
      /^demo: blocks\[4\]\.media\[1\]: width and height must be numbers, not text/,
    ],
  ],
  [
    'a width typed as text on a picture that is not on this site',
    demo,
    entry => {
      entry.blocks[1].media = {
        type: 'image',
        src: 'https://res.cloudinary.com/demo/a.png',
        alt: 'A picture kept elsewhere',
        width: '1600',
        height: 1000,
      };
    },
    [/^demo: blocks\[1\]\.media: width and height must be numbers, not text/],
  ],
  [
    'a picture the size table does not list',
    demo,
    () => ({
      ...context,
      sizes: Object.fromEntries(
        Object.entries(sizes).filter(
          ([name]) => name !== '/assets/demo/setup.png',
        ),
      ),
    }),
    [/^demo: blocks\[2\]\.media\.src: .*setup\.png.*npm run sizes/],
  ],
  [
    'a picture re-cropped since the size table was written',
    demo,
    () => ({
      ...context,
      sizes: { ...sizes, '/assets/demo/setup.png': [2040, 1300] },
    }),
    [/^demo: blocks\[2\]\.media\.src: .*2040x1300.*2040x1284.*npm run sizes/],
  ],
  [
    'a thumbnail that is not square',
    demo,
    () => withFile('/assets/demo/thumbnail.jpg', picture(1000, 750, 'jpeg')),
    [/^demo: thumbnail: .*1000x750.*square/],
  ],
  [
    'a thumbnail just over 1% wider than square',
    demo,
    () => withFile('/assets/demo/thumbnail.jpg', picture(1000, 989, 'jpeg')),
    [/^demo: thumbnail: .*1000x989.*square/],
  ],
  [
    'a thumbnail just over 1% taller than square',
    demo,
    () => withFile('/assets/demo/thumbnail.jpg', picture(989, 1000, 'jpeg')),
    [/^demo: thumbnail: .*989x1000.*square/],
  ],
  [
    'a JPEG saved under a .png name',
    demo,
    () =>
      withFile('/assets/demo/setup.png', {
        ...files['/assets/demo/setup.png'],
        format: 'jpeg',
      }),
    [/^demo: blocks\[2\]\.media\.src: .*setup\.png.*JPEG.*\.jpg/],
  ],
  [
    'a picture file that cannot be read as one',
    demo,
    () => withFile('/assets/demo/setup.png', { bytes: 12, named: 'png' }),
    [/^demo: blocks\[2\]\.media\.src: .*setup\.png.*not a picture/],
  ],
  [
    'a video file listed as a picture',
    demo,
    entry => {
      entry.blocks[1].media.src = '/assets/demo/intro.mp4';
    },
    [/^demo: blocks\[1\]\.media\.src: .*intro\.mp4.*not a picture/],
  ],
  [
    'a file name with a capital',
    demo,
    entry => {
      //? The file is there, at that size: only its name is wrong
      entry.blocks[2].media.src = '/assets/demo/Leads-table.png';
    },
    [/^demo: blocks\[2\]\.media\.src: .*Leads-table\.png.*lower-case/],
  ],
  [
    'a file name with a space',
    demo,
    entry => {
      entry.hero.image = '/assets/demo/welcome page.png';

      return withFile('/assets/demo/welcome page.png', picture(2586, 1632));
    },
    [/^demo: hero\.image: .*welcome page\.png.*lower-case/],
  ],
  [
    'a device frame that does not exist',
    demo,
    entry => {
      entry.deviceFrame = '/assets/demo/frame.png';
    },
    [/^demo: deviceFrame: .*not exist/],
  ],
  [
    'a device that is neither a laptop nor a phone',
    demo,
    entry => {
      entry.blocks[0].device = 'tablet';
    },
    [
      /^demo: blocks\[0\]\.device: "tablet" is not a known device \(laptop, phone\)/,
    ],
  ],
  [
    'a picture in the phone of another shape than its first',
    phoneApp,
    entry => {
      entry.blocks[0].media[2].src = '/assets/demo/dashboard.png';
    },
    [
      /^demo: blocks\[0\]\.media\[2\]\.src: .*2048x1280, another shape .*750x1624/,
    ],
  ],
  [
    'the same picture twice in the phone',
    phoneApp,
    entry => {
      entry.blocks[0].media[2] = { ...entry.blocks[0].media[0] };
    },
    [/^demo: blocks\[0\]\.media\[2\]\.src: .*already in this phone/],
  ],
];

for (const [what, make, plant, reports] of mistakes) {
  test(`reports ${what}`, () => {
    const entry = make();
    const problems = validateCases([entry], plant(entry) ?? context);

    assert.equal(problems.length, reports.length, listed(problems));
    reports.forEach((report, index) => assert.match(problems[index], report));
  });
}

test('reports a slug used by two projects, on the second of them', () => {
  const problems = validateCases([demo(), demo()], context);

  assert.equal(problems.length, 1, listed(problems));
  assert.match(problems[0], /^demo: slug: .*more than one/);
});

test('accepts what is allowed', () => {
  const entry = demo();

  //? A screenshot may repeat the laptop's first picture: only the later
  //? ones join the moving row
  entry.blocks[2].media = { ...entry.blocks[0].media[0] };
  //? A size typed by hand that matches the file
  entry.blocks[3].media.width = 2046;
  entry.blocks[3].media.height = 1282;
  //? Remote and inline pictures cannot be measured and are not looked up;
  //? a size typed for one is taken as it is
  entry.blocks[1].media.src = 'https://res.cloudinary.com/demo/a.png';
  entry.blocks[1].media.width = 1600;
  entry.blocks[1].media.height = 1000;
  entry.hero.image = 'data:image/svg+xml;utf8,%3Csvg%3E%3C%2Fsvg%3E';
  //? A logo over the hero, in a format that has no pixel size
  entry.hero.logo = '/assets/demo/logo.svg';
  //? A thumbnail within 1% of square
  const near = withFile(
    '/assets/demo/thumbnail.jpg',
    picture(1000, 991, 'jpeg'),
  );
  //? No live address, written either way
  delete entry.liveUrl;
  //? A short line under the title
  entry.tagline = 'Powered by BMW';

  const problems = validateCases([entry], near);

  assert.equal(problems.length, 0, listed(problems));
});

test('accepts a thumbnail that is not square once it is on the accepted list', () => {
  const wide = withFile(
    '/assets/demo/thumbnail.jpg',
    picture(1000, 750, 'jpeg'),
  );
  const problems = validateCases([demo()], {
    ...wide,
    wideThumbnails: ['/assets/demo/thumbnail.jpg'],
  });

  assert.equal(problems.length, 0, listed(problems));
});

test('reports every problem of a project, not only the first', () => {
  const clean = recorded();
  clean.slug = 'clean';

  const entry = demo();
  entry.background = 'beige';
  entry.blocks[1].type = 'plian';
  entry.blocks[4].media[0].alt = '';

  const problems = validateCases([clean, entry], context);

  assert.equal(problems.length, 3, listed(problems));
  assert.match(problems[0], /^demo: background: /);
  assert.match(problems[1], /^demo: blocks\[1\]\.type: /);
  assert.match(problems[2], /^demo: blocks\[4\]\.media\[0\]\.alt: /);
});

test('caseFiles names every file of a project, with the field it is in', () => {
  const named = caseFiles({
    thumbnail: '/assets/demo/thumbnail.jpg',
    hero: {
      image: '/assets/demo/home.png',
      alt: 'Home',
      logo: '/assets/demo/logo.svg',
    },
    deviceFrame: '/assets/demo/frame.png',
    blocks: [
      {
        type: 'device',
        media: {
          type: 'video',
          src: '/assets/demo/intro.mp4',
          poster: '/assets/demo/poster.jpg',
          alt: 'Intro',
        },
      },
      {
        type: 'mobiles',
        media: [
          { type: 'image', src: 'https://example.com/a.png', alt: 'A' },
          { type: 'image', src: '/assets/demo/b.png', alt: 'B' },
        ],
      },
    ],
  });

  assert.deepEqual(named, [
    { field: 'thumbnail', src: '/assets/demo/thumbnail.jpg' },
    { field: 'hero.image', src: '/assets/demo/home.png' },
    { field: 'hero.logo', src: '/assets/demo/logo.svg' },
    { field: 'deviceFrame', src: '/assets/demo/frame.png' },
    { field: 'blocks[0].media.src', src: '/assets/demo/intro.mp4' },
    { field: 'blocks[0].media.poster', src: '/assets/demo/poster.jpg' },
    { field: 'blocks[1].media[0].src', src: 'https://example.com/a.png' },
    { field: 'blocks[1].media[1].src', src: '/assets/demo/b.png' },
  ]);
  //? A project that names nothing yet: no file, and no crash
  assert.deepEqual(caseFiles({}), []);
  assert.deepEqual(caseFiles({ hero: { logo: null }, blocks: [{}] }), []);
});
