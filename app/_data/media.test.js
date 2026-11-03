import assert from 'node:assert/strict';
import { test } from 'node:test';

const VARIABLE = 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME';

/**
 * media.js reads the variable once, when it is loaded. A different query
 * string makes Node load it afresh, with the variable as it is right now.
 * @param {string | undefined} account
 */
async function loadWith(account) {
  if (account === undefined) delete process.env[VARIABLE];
  else process.env[VARIABLE] = account;

  return import(`./media.js?account=${account}`);
}

test("Cloudinary addresses use the site's own account when none is named", async () => {
  const { cloudinary, cloudinaryVideo } = await loadWith(undefined);

  assert.equal(
    cloudinary('v1720891348/MyFriendAnimation.png'),
    'https://res.cloudinary.com/dqbj2ip7c/image/upload/v1720891348/MyFriendAnimation.png',
  );
  assert.deepStrictEqual(
    cloudinaryVideo('v1723721922/first_convo_jjt8wj', 'First conversation'),
    {
      type: 'video',
      src: 'https://res.cloudinary.com/dqbj2ip7c/video/upload/q_auto/v1723721922/first_convo_jjt8wj.mp4',
      poster:
        'https://res.cloudinary.com/dqbj2ip7c/video/upload/so_0,q_auto/v1723721922/first_convo_jjt8wj.jpg',
      alt: 'First conversation',
      controls: true,
    },
  );
});

test('an empty variable counts as none', async () => {
  const { cloudinary } = await loadWith('');

  assert.equal(
    cloudinary('v1/a.png'),
    'https://res.cloudinary.com/dqbj2ip7c/image/upload/v1/a.png',
  );
});

test('the variable still points the addresses at another account', async () => {
  const { cloudinary, cloudinaryVideo } = await loadWith('another');

  assert.equal(
    cloudinary('v1/a.png'),
    'https://res.cloudinary.com/another/image/upload/v1/a.png',
  );
  assert.equal(
    cloudinaryVideo('v1/clip', 'Clip').src,
    'https://res.cloudinary.com/another/video/upload/q_auto/v1/clip.mp4',
  );
});

test('a placeholder is an inline SVG of the asked size, with its label made safe', async () => {
  const { placeholder } = await loadWith(undefined);
  const address = placeholder('A & <B>', 260, 100);
  const start = 'data:image/svg+xml;utf8,';

  assert.equal(address.slice(0, start.length), start);
  assert.equal(
    decodeURIComponent(address.slice(start.length)),
    "<svg xmlns='http://www.w3.org/2000/svg' width='260' height='100' viewBox='0 0 260 100'><rect width='100%' height='100%' fill='#d4d9d9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Helvetica, Arial, sans-serif' font-size='10' fill='#1c1d20' fill-opacity='0.35'>A &amp; &lt;B&gt;</text></svg>",
  );
  assert.match(
    decodeURIComponent(placeholder('Dark', 260, 100, '#1c1d20')),
    /fill='#1c1d20'\/>/,
  );
});

test('the stand-in blocks are a laptop, a screenshot, a full-width picture, a laptop and three phones', async () => {
  const { defaultBlocks } = await loadWith(undefined);
  const blocks = defaultBlocks('Demo');
  const alts = media =>
    Array.isArray(media) ? media.map(item => item.alt) : media.alt;

  assert.deepEqual(
    blocks.map(({ media, ...rest }) => ({ ...rest, shows: alts(media) })),
    [
      { type: 'device', shows: 'Demo · desktop screen' },
      { type: 'plain', paddingBottom: true, shows: 'Demo · detail' },
      { type: 'fullwidth', tint: 0.2, shows: 'Demo · full width' },
      { type: 'device', shows: 'Demo · desktop screen 2' },
      {
        type: 'mobiles',
        shows: ['Demo · phone 1', 'Demo · phone 2', 'Demo · phone 3'],
      },
    ],
  );
  //? Every stand-in is a picture with nothing to download
  for (const { media } of blocks) {
    for (const item of [].concat(media)) {
      assert.equal(item.type, 'image');
      assert.match(item.src, /^data:image\/svg\+xml;utf8,/);
    }
  }
});
