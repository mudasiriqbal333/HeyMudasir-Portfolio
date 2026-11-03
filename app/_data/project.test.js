import assert from 'node:assert/strict';
import { test } from 'node:test';

import { project, video, withoutDrafts, withSizes } from './project.js';

//? The facts every example below shares; each test adds what it is about.
const facts = {
  slug: 'demo',
  title: 'Demo',
  services: 'Design & Development',
  location: 'United Kingdom',
  year: '2026',
  background: '#e0d9d1',
  thumbnail: 'thumbnail.jpg',
  hero: { 'home.png': 'Demo home page' },
};

test('turns the short form into the entry the pages read', () => {
  const entry = project({
    slug: 'demo',
    title: 'Demo',
    services: 'Design & Development',
    categories: ['design', 'development'],
    location: 'United Kingdom',
    year: '2026',
    background: '#e0d9d1',
    thumbnail: 'thumbnail.jpg',
    description: { lead: 'A demo.', built: ['One thing'] },
    hero: { 'home.png': 'Demo home page' },
    laptop: {
      'dashboard.png': 'Demo dashboard',
      'table.webp': 'Demo table',
    },
    screens: {
      'map.png': 'Demo map',
      'chat.png': 'Demo chat',
    },
    phones: {
      'mobile-home.png': 'Demo on a phone',
      'mobile-map.png': 'Demo map on a phone',
    },
  });

  assert.deepStrictEqual(entry, {
    slug: 'demo',
    title: 'Demo',
    services: 'Design & Development',
    categories: ['design', 'development'],
    credits: 'Mudasir Iqbal',
    location: 'United Kingdom',
    year: '2026',
    liveUrl: '',
    background: '#e0d9d1',
    thumbnail: '/assets/demo/thumbnail.jpg',
    description: { lead: 'A demo.', built: ['One thing'] },
    hero: {
      image: '/assets/demo/home.png',
      alt: 'Demo home page',
      logo: null,
    },
    blocks: [
      {
        type: 'device',
        autoplay: 4000,
        effect: 'fade',
        media: [
          {
            type: 'image',
            src: '/assets/demo/dashboard.png',
            alt: 'Demo dashboard',
          },
          { type: 'image', src: '/assets/demo/table.webp', alt: 'Demo table' },
        ],
      },
      {
        type: 'plain',
        media: { type: 'image', src: '/assets/demo/map.png', alt: 'Demo map' },
      },
      {
        type: 'plain',
        media: {
          type: 'image',
          src: '/assets/demo/chat.png',
          alt: 'Demo chat',
        },
      },
      {
        type: 'mobiles',
        media: [
          {
            type: 'image',
            src: '/assets/demo/mobile-home.png',
            alt: 'Demo on a phone',
          },
          {
            type: 'image',
            src: '/assets/demo/mobile-map.png',
            alt: 'Demo map on a phone',
          },
        ],
      },
    ],
  });
});

test('a project with only a hero has no blocks and no stray fields', () => {
  assert.deepStrictEqual(project(facts), {
    slug: 'demo',
    title: 'Demo',
    services: 'Design & Development',
    credits: 'Mudasir Iqbal',
    location: 'United Kingdom',
    year: '2026',
    liveUrl: '',
    background: '#e0d9d1',
    thumbnail: '/assets/demo/thumbnail.jpg',
    hero: {
      image: '/assets/demo/home.png',
      alt: 'Demo home page',
      logo: null,
    },
    blocks: [],
  });
});

test('credits, the live address and the draft mark can be given', () => {
  const entry = project({
    ...facts,
    credits: 'Design: Someone Else',
    liveUrl: 'https://example.com/',
    draft: true,
  });

  assert.equal(entry.credits, 'Design: Someone Else');
  assert.equal(entry.liveUrl, 'https://example.com/');
  assert.equal(entry.draft, true);
});

test('pictures stay in the order they are written', () => {
  const { blocks } = project({
    ...facts,
    screens: {
      'b.png': 'second letter first',
      'a.png': 'first letter second',
      '10.png': 'ten',
      '9.png': 'nine',
    },
  });

  assert.deepEqual(
    blocks.map(block => block.media.src),
    [
      '/assets/demo/b.png',
      '/assets/demo/a.png',
      '/assets/demo/10.png',
      '/assets/demo/9.png',
    ],
  );
});

test('one picture in the laptop is shown on its own, with no slideshow', () => {
  const { blocks } = project({
    ...facts,
    laptop: { 'dashboard.png': 'Demo dashboard' },
  });

  assert.deepStrictEqual(blocks, [
    {
      type: 'device',
      media: {
        type: 'image',
        src: '/assets/demo/dashboard.png',
        alt: 'Demo dashboard',
      },
    },
  ]);
});

test('a phone plays its pictures like the laptop, marked as a phone', () => {
  const { blocks } = project({
    ...facts,
    phone: { 'home.png': 'Demo home', 'trips.png': 'Demo trips' },
  });

  assert.deepStrictEqual(blocks, [
    {
      type: 'device',
      device: 'phone',
      autoplay: 4000,
      effect: 'fade',
      media: [
        { type: 'image', src: '/assets/demo/home.png', alt: 'Demo home' },
        { type: 'image', src: '/assets/demo/trips.png', alt: 'Demo trips' },
      ],
    },
  ]);
});

test('one picture in the phone is shown on its own, with no slideshow', () => {
  const { blocks } = project({
    ...facts,
    phone: { 'home.png': 'Demo home' },
  });

  assert.deepStrictEqual(blocks, [
    {
      type: 'device',
      device: 'phone',
      media: { type: 'image', src: '/assets/demo/home.png', alt: 'Demo home' },
    },
  ]);
});

test('the lists keep their order on the page: laptop, phone, screens, phones', () => {
  const { blocks } = project({
    ...facts,
    phones: { 'mobile.png': 'Demo on a phone' },
    screens: { 'map.png': 'Demo map' },
    phone: { 'app.png': 'Demo app' },
    laptop: { 'dashboard.png': 'Demo dashboard' },
  });

  assert.deepEqual(
    blocks.map(block => [block.type, block.device ?? '']),
    [
      ['device', ''],
      ['device', 'phone'],
      ['plain', ''],
      ['mobiles', ''],
    ],
  );
});

test('video() puts a recording in the laptop, with its poster', () => {
  const { blocks } = project({
    ...facts,
    laptop: video('intro.mp4', 'intro-poster.jpg', 'Demo intro'),
  });

  assert.deepStrictEqual(blocks, [
    {
      type: 'device',
      media: {
        type: 'video',
        src: '/assets/demo/intro.mp4',
        poster: '/assets/demo/intro-poster.jpg',
        alt: 'Demo intro',
      },
    },
  ]);
});

test('several videos in the laptop get arrows, not a slideshow', () => {
  const first = {
    type: 'video',
    src: 'https://example.com/one.mp4',
    poster: 'https://example.com/one.jpg',
    alt: 'First demo',
    controls: true,
  };
  const second = { ...first, src: 'https://example.com/two.mp4' };

  const { blocks } = project({ ...facts, laptop: [first, second] });

  //? No autoplay: a slideshow would move on while a video is playing
  assert.deepStrictEqual(blocks, [{ type: 'device', media: [first, second] }]);
});

test('a laptop list that mixes a video with pictures is not a slideshow either', () => {
  const clip = video('intro.mp4', 'intro-poster.jpg', 'Demo intro');
  const still = { type: 'image', src: 'dashboard.png', alt: 'Demo dashboard' };

  const { blocks } = project({ ...facts, laptop: [clip, still] });

  assert.deepStrictEqual(blocks, [
    {
      type: 'device',
      media: [
        {
          type: 'video',
          src: '/assets/demo/intro.mp4',
          poster: '/assets/demo/intro-poster.jpg',
          alt: 'Demo intro',
        },
        {
          type: 'image',
          src: '/assets/demo/dashboard.png',
          alt: 'Demo dashboard',
        },
      ],
    },
  ]);
});

test('full addresses and site paths are left as they are', () => {
  const inline = 'data:image/svg+xml;utf8,%3Csvg%3E%3C%2Fsvg%3E';
  const entry = project({
    ...facts,
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/thumb.png',
    hero: { '/shared/hero.png': 'A hero kept outside the project folder' },
    deviceFrame: 'http://example.com/frame.png',
    screens: { [inline]: 'An inline placeholder' },
  });

  assert.equal(
    entry.thumbnail,
    'https://res.cloudinary.com/demo/image/upload/thumb.png',
  );
  assert.equal(entry.hero.image, '/shared/hero.png');
  assert.equal(entry.deviceFrame, 'http://example.com/frame.png');
  assert.equal(entry.blocks[0].media.src, inline);
});

test('a hero written out in full can carry a logo; file names are resolved', () => {
  const entry = project({
    ...facts,
    deviceFrame: 'frame.png',
    hero: { image: 'home.png', alt: 'Demo home page', logo: 'logo.svg' },
  });

  assert.deepStrictEqual(entry.hero, {
    image: '/assets/demo/home.png',
    alt: 'Demo home page',
    logo: '/assets/demo/logo.svg',
  });
  assert.equal(entry.deviceFrame, '/assets/demo/frame.png');
});

test('"blocks" is used exactly as written, for layouts the lists cannot say', () => {
  const blocks = [
    {
      type: 'fullwidth',
      tint: 0.2,
      media: { type: 'image', src: 'left-alone.png', alt: 'Full width' },
    },
    { type: 'mobiles', media: [] },
  ];
  const hero = { image: 'https://example.com/h.png', alt: 'Hero', logo: null };

  const entry = project({ ...facts, hero, blocks });

  assert.deepStrictEqual(entry.blocks, [
    {
      type: 'fullwidth',
      tint: 0.2,
      media: { type: 'image', src: 'left-alone.png', alt: 'Full width' },
    },
    { type: 'mobiles', media: [] },
  ]);
  assert.deepStrictEqual(entry.hero, {
    image: 'https://example.com/h.png',
    alt: 'Hero',
    logo: null,
  });
});

test('"blocks" together with a list is refused, naming the project', () => {
  //? Any of the four: the list would otherwise be dropped without a word
  for (const list of ['laptop', 'phone', 'screens', 'phones']) {
    assert.throws(
      () =>
        project({
          ...facts,
          blocks: [],
          [list]: { 'map.png': 'This would silently be dropped' },
        }),
      /demo: .*blocks/,
      list,
    );
  }
});

test('a hero given two pictures is refused, naming the project', () => {
  assert.throws(
    () =>
      project({
        ...facts,
        hero: { 'home.png': 'One', 'about.png': 'Two' },
      }),
    /demo: .*hero/,
  );
});

/** The message project() refuses an input with. */
function refusal(input) {
  try {
    project(input);
  } catch (error) {
    return error.message;
  }

  return 'not refused';
}

test('a hero written as a bare file name is refused, naming the project and the field', () => {
  //? It looks right next to `thumbnail: 'thumbnail.jpg'`, but a picture
  //? needs its alt text. The message shows how to write it.
  const message = `demo: "hero" names 'home.png' without alt text: write it as { 'home.png': 'alt text' }`;

  assert.equal(refusal({ ...facts, hero: 'home.png' }), message);
  //? ...the same file name in [ ]
  assert.equal(refusal({ ...facts, hero: ['home.png'] }), message);
  //? Anything else that is not { }
  assert.match(refusal({ ...facts, hero: 5 }), /^demo: "hero" /);
});

test('a list written as bare file names is refused, naming the project and the list', () => {
  for (const list of ['laptop', 'phone', 'screens', 'phones']) {
    //? One file name: read letter by letter it would become 13 pictures
    assert.equal(
      refusal({ ...facts, [list]: 'dashboard.png' }),
      `demo: "${list}" names 'dashboard.png' without alt text: write it as { 'dashboard.png': 'alt text' }`,
      list,
    );
    //? File names in [ ]: the first one without alt text is named
    assert.equal(
      refusal({ ...facts, [list]: ['a.png', 'b.png'] }),
      `demo: "${list}" names 'a.png' without alt text: write it as { 'a.png': 'alt text' }`,
      list,
    );
    //? ...also when it comes after media written out in full
    assert.match(
      refusal({
        ...facts,
        [list]: [video('intro.mp4', 'intro-poster.jpg', 'Intro'), 'b.png'],
      }),
      new RegExp(`^demo: "${list}" names 'b\\.png' `),
      list,
    );
    //? Anything else that is neither { } nor [ ]
    assert.match(
      refusal({ ...facts, [list]: 5 }),
      new RegExp(`^demo: "${list}" `),
      list,
    );
    assert.match(
      refusal({ ...facts, [list]: [null] }),
      new RegExp(`^demo: "${list}" `),
      list,
    );
  }
});

test('a list left empty, or left out, simply gives no block', () => {
  for (const nothing of [undefined, null, {}, []]) {
    const { blocks } = project({
      ...facts,
      laptop: nothing,
      phone: nothing,
      screens: nothing,
      phones: nothing,
    });

    assert.deepStrictEqual(blocks, [], String(nothing));
  }
});

const picture = (src, more = {}) => ({ type: 'image', src, alt: src, ...more });

test('withSizes gives each picture without a size the one in the table', () => {
  const entry = {
    ...project(facts),
    blocks: [
      {
        type: 'device',
        autoplay: 4000,
        effect: 'fade',
        media: [picture('/assets/demo/a.png'), picture('/assets/demo/b.png')],
      },
      {
        type: 'plain',
        paddingBottom: true,
        media: picture('/assets/demo/c.png'),
      },
      { type: 'mobiles', media: [picture('/assets/demo/d.png')] },
    ],
  };
  const sizes = {
    '/assets/demo/a.png': [2048, 1282],
    '/assets/demo/b.png': [1554, 954],
    '/assets/demo/c.png': [2160, 1050],
    '/assets/demo/d.png': [390, 844],
    '/assets/demo/unused.png': [1, 1],
  };

  assert.deepStrictEqual(withSizes(entry, sizes), {
    ...project(facts),
    blocks: [
      {
        type: 'device',
        autoplay: 4000,
        effect: 'fade',
        media: [
          picture('/assets/demo/a.png', { width: 2048, height: 1282 }),
          picture('/assets/demo/b.png', { width: 1554, height: 954 }),
        ],
      },
      {
        type: 'plain',
        paddingBottom: true,
        media: picture('/assets/demo/c.png', { width: 2160, height: 1050 }),
      },
      {
        type: 'mobiles',
        media: [picture('/assets/demo/d.png', { width: 390, height: 844 })],
      },
    ],
  });
});

test('withSizes leaves alone what is typed, unknown or not a picture', () => {
  const typed = picture('/assets/demo/a.png', { width: 10, height: 20 });
  //? Half a size is typed: the other half is not taken from the table, so
  //? the data test can say that one is missing
  const widthOnly = picture('/assets/demo/a.png', { width: 10 });
  const heightOnly = picture('/assets/demo/a.png', { height: 20 });
  const unknown = picture('data:image/svg+xml;utf8,placeholder');
  const clip = {
    type: 'video',
    src: '/assets/demo/intro.mp4',
    poster: '/assets/demo/a.png',
    alt: 'Intro',
  };
  const entry = {
    ...project(facts),
    blocks: [
      { type: 'device', media: clip },
      { type: 'plain', media: typed },
      { type: 'mobiles', media: [widthOnly, heightOnly] },
      { type: 'plain', media: unknown },
      //? An object's built-in names must not be taken for table rows
      { type: 'plain', media: picture('constructor') },
    ],
  };
  const sizes = {
    '/assets/demo/a.png': [999, 999],
    '/assets/demo/intro.mp4': [1600, 1000],
  };

  assert.deepStrictEqual(withSizes(entry, sizes).blocks, [
    { type: 'device', media: clip },
    { type: 'plain', media: typed },
    { type: 'mobiles', media: [widthOnly, heightOnly] },
    { type: 'plain', media: unknown },
    { type: 'plain', media: picture('constructor') },
  ]);
});

test('withSizes does not change the entry it is given', () => {
  const entry = {
    ...project(facts),
    blocks: [{ type: 'plain', media: picture('/assets/demo/a.png') }],
  };
  const before = structuredClone(entry);

  withSizes(entry, { '/assets/demo/a.png': [10, 20] });

  assert.deepStrictEqual(entry, before);
});

test('drafts are left out of the live site and kept everywhere else', () => {
  const entries = [
    { slug: 'one' },
    { slug: 'two', draft: true },
    { slug: 'three', draft: false },
    { slug: 'four', draft: true },
    { slug: 'five' },
  ];
  const slugs = list => list.map(entry => entry.slug);

  assert.deepEqual(slugs(withoutDrafts(entries, 'production')), [
    'one',
    'three',
    'five',
  ]);
  for (const mode of ['development', 'test', undefined]) {
    assert.deepEqual(
      slugs(withoutDrafts(entries, mode)),
      ['one', 'two', 'three', 'four', 'five'],
      `NODE_ENV ${mode}`,
    );
  }
});
