import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  countWork,
  filterWork,
  parseViewCookie,
  VIEW_COOKIE_DAYS,
  viewCookie,
  WORK_VIEWS,
} from './work-view.js';

const items = [
  { href: '/work/a', categories: ['development'] },
  { href: '/work/b', categories: ['design', 'development'] },
  { href: '/work/c' },
  { href: '/work/d', categories: [] },
];

test('"all" keeps every entry, categories or not', () => {
  assert.equal(filterWork(items, 'all'), items);
  assert.equal(filterWork(items), items);
});

test('a category keeps the entries that list it', () => {
  assert.deepEqual(
    filterWork(items, 'design').map(({ href }) => href),
    ['/work/b'],
  );
  assert.deepEqual(
    filterWork(items, 'development').map(({ href }) => href),
    ['/work/a', '/work/b'],
  );
});

test('an unknown category keeps nothing', () => {
  assert.deepEqual(filterWork(items, 'interaction'), []);
});

test('counts every filter from the same data', () => {
  assert.deepEqual(countWork(items, ['all', 'design', 'development']), {
    all: 4,
    design: 1,
    development: 2,
  });
});

test('reads the view out of a cookie string', () => {
  assert.equal(parseViewCookie('view=columns'), 'columns');
  assert.equal(parseViewCookie('theme=dark; view=rows; other=1'), 'rows');
  assert.equal(parseViewCookie(' view=columns '), 'columns');
});

test('ignores cookies that only end in the name', () => {
  assert.equal(parseViewCookie('preview=columns'), null);
});

test('ignores values that are not a view', () => {
  assert.equal(parseViewCookie('view=grid'), null);
  assert.equal(parseViewCookie('view='), null);
});

test('decodes an encoded value', () => {
  assert.equal(parseViewCookie('view=col%75mns'), 'columns');
});

test('treats a value that cannot be decoded as no choice', () => {
  assert.equal(parseViewCookie('view=%'), null);
  assert.equal(parseViewCookie('view=%E0'), null);
  assert.equal(parseViewCookie('view=%E0; theme=dark'), null);
});

test('only decodes the view entry', () => {
  assert.equal(parseViewCookie('other=%; view=rows'), 'rows');
});

test('treats a missing cookie as no choice', () => {
  assert.equal(parseViewCookie(''), null);
  assert.equal(parseViewCookie(null), null);
  assert.equal(parseViewCookie(undefined), null);
});

test('writes a cookie that lasts 14 days by default', () => {
  assert.equal(VIEW_COOKIE_DAYS, 14);
  assert.equal(
    viewCookie('columns'),
    'view=columns; max-age=1209600; path=/; samesite=lax',
  );
});

test('scales the lifetime with the days given', () => {
  assert.equal(
    viewCookie('rows', 1),
    'view=rows; max-age=86400; path=/; samesite=lax',
  );
  assert.equal(
    viewCookie('rows', 0),
    'view=rows; max-age=0; path=/; samesite=lax',
  );
});

test('refuses to remember a view it does not know', () => {
  assert.equal(viewCookie('grid'), '');
  assert.equal(viewCookie(''), '');
});

test('round-trips every known view', () => {
  for (const view of WORK_VIEWS) {
    assert.equal(parseViewCookie(viewCookie(view).split(';')[0]), view);
  }
});
