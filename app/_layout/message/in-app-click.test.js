import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isInAppClick } from './in-app-click.js';

const origin = 'https://example.com';

/** A plain left click; `over` changes single fields. */
const click = (over = {}) => ({
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: false,
  ...over,
});

/** A link to a page of the site; `over` changes single fields. */
const link = (over = {}) => {
  const { download = false, ...rest } = over;

  return {
    origin,
    target: '',
    hasAttribute: name => name === 'download' && download,
    ...rest,
  };
};

test('a plain click on a link to this site is an in-app click', () => {
  assert.equal(isInAppClick(click(), link(), origin), true);
});

test('a link that names its own tab as the target still counts', () => {
  assert.equal(isInAppClick(click(), link({ target: '_self' }), origin), true);
});

test('a new-tab or new-window click is left to the browser', () => {
  for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey']) {
    assert.equal(isInAppClick(click({ [key]: true }), link(), origin), false);
  }
});

test('only the main mouse button counts', () => {
  assert.equal(isInAppClick(click({ button: 1 }), link(), origin), false);
  assert.equal(isInAppClick(click({ button: 2 }), link(), origin), false);
});

test('a click that something has already handled is left alone', () => {
  const handled = click({ defaultPrevented: true });

  assert.equal(isInAppClick(handled, link(), origin), false);
});

test('a link that leaves the site is left alone', () => {
  const social = link({ origin: 'https://www.linkedin.com' });
  //? The browser gives a mailto: or tel: link the origin "null"
  const mail = link({ origin: 'null' });

  assert.equal(isInAppClick(click(), social, origin), false);
  assert.equal(isInAppClick(click(), mail, origin), false);
});

test('a link that opens in another tab or frame is left alone', () => {
  assert.equal(
    isInAppClick(click(), link({ target: '_blank' }), origin),
    false,
  );
  assert.equal(isInAppClick(click(), link({ target: 'side' }), origin), false);
});

test('a download link is left alone', () => {
  assert.equal(isInAppClick(click(), link({ download: true }), origin), false);
});
