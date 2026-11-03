import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { projects } from './projects/index.js';
import { validateCases, wideThumbnails } from './validate-cases.js';
import { workFilters } from './work-options.js';
import {
  readPublicFiles,
  sizeTable,
  tableProblems,
} from '../../scripts/media-files.mjs';

//? The real projects, checked against the real files. A red test here means
//? that a project file, a picture under public/assets/ or the size table
//? needs attention, and the message says which and why. Nothing here knows
//? what any one project holds, so adding, changing, moving or removing a
//? project in a way that is right never fails. (The rules themselves are
//? tried on a made-up project in validate-cases.test.js.)

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

//? What is really on disk, spelled as the disk spells it.
const files = readPublicFiles(path.join(root, 'public'));

//? Read with fs rather than imported: plain Node and Next do not agree on
//? how a JSON import is written.
const sizes = JSON.parse(
  readFileSync(path.join(root, 'app/_data/media-sizes.json'), 'utf8'),
);

const context = {
  //? The one list of categories: the Work page's own filter pills
  categories: workFilters.map(({ key }) => key).filter(key => key !== 'all'),
  files,
  sizes,
  wideThumbnails,
};

/** One problem to a line, so a failure reads as a list of sentences. */
const listed = problems => `\n${problems.join('\n')}\n`;

test('every project is filled in and every file it names is really there', () => {
  //? `projects`, not `caseOptions`: a draft is checked too, so it cannot go
  //? live broken on the day its draft mark is removed
  const problems = validateCases(projects, context);

  assert.equal(problems.length, 0, listed(problems));
});

test('media-sizes.json holds the real size of every picture under public/assets', () => {
  const problems = tableProblems(sizes, sizeTable(files));

  assert.equal(
    problems.length,
    0,
    `${listed(problems)}Run "npm run sizes" and commit app/_data/media-sizes.json.`,
  );
});

test('a wide thumbnail passes only because it is on the accepted list', () => {
  //? The projects whose thumbnail is on the list and really is wide or tall
  //? (TOW123 today; none at all is fine too)
  const accepted = projects.filter(({ thumbnail }) => {
    const { width, height } = files[thumbnail] ?? {};

    return (
      wideThumbnails.includes(thumbnail) && Math.abs(width / height - 1) > 0.01
    );
  });

  //? With the list taken away, each of them is reported for the shape of
  //? its thumbnail. (Whatever else may be wrong with a project is the first
  //? test's business.)
  const strict = validateCases(accepted, { ...context, wideThumbnails: [] });

  for (const { slug, thumbnail } of accepted) {
    assert.ok(
      strict.some(
        problem =>
          problem.startsWith(`${slug}: thumbnail: ${thumbnail} is `) &&
          problem.includes('not square'),
      ),
      `${thumbnail} is not square, yet nothing says so once the accepted list is empty:${listed(strict)}`,
    );
  }
});

/**
 * What the pages are given in a build of one kind: the projects, the Work
 * rows and the Home rows. It is asked of a fresh Node, because
 * case-options.js reads NODE_ENV once, when it is loaded. Two made-up
 * projects are put on the real list first, one of them a draft, so the
 * answer never depends on what the real projects are.
 * @param {string} [mode] the build's NODE_ENV; not set at all when left out
 * @returns {{all: {slug: string, draft: boolean}[], shown: string[], work: string[], home: string[]}}
 */
function listsIn(mode) {
  const file = name => JSON.stringify(new URL(name, import.meta.url).href);
  const script = `
    const { projects } = await import(${file('./projects/index.js')});
    projects.push(
      { slug: 'a-draft', title: 'A draft', draft: true },
      { slug: 'not-a-draft', title: 'Not a draft' },
    );
    const { caseOptions } = await import(${file('./case-options.js')});
    const { workOptions } = await import(${file('./work-options.js')});
    const { thumbnailOptions } = await import(${file('./thumbnail-options.js')});
    console.log(JSON.stringify({
      all: projects.map(({ slug, draft }) => ({ slug, draft: Boolean(draft) })),
      shown: caseOptions.map(({ slug }) => slug),
      work: workOptions.map(({ href }) => href),
      home: thumbnailOptions.map(({ href }) => href),
    }));
  `;

  const env = { ...process.env, NODE_ENV: mode };
  if (mode === undefined) delete env.NODE_ENV;

  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [
      '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
      '--input-type=module',
      '--eval',
      script,
    ],
    { env, encoding: 'utf8' },
  );
  assert.equal(status, 0, stderr);

  return JSON.parse(stdout);
}

test('a draft is left out of everything a production build shows', () => {
  const { all, shown, work, home } = listsIn('production');
  const published = all.filter(({ draft }) => !draft).map(({ slug }) => slug);

  assert.equal(shown.includes('a-draft'), false);
  assert.equal(shown.includes('not-a-draft'), true);
  //? Nothing else is left out, and the order is kept
  assert.deepEqual(shown, published);
  //? The Work rows and the Home rows are made from the same list
  const pages = published.map(slug => `/work/${slug}`);
  assert.deepEqual(work, pages);
  assert.deepEqual(home, pages);
});

test('a draft is shown everywhere else, so it can be worked on in npm run dev', () => {
  for (const mode of ['development', undefined]) {
    const { all, shown, work, home } = listsIn(mode);
    const pages = all.map(({ slug }) => `/work/${slug}`);

    assert.equal(shown.includes('a-draft'), true, `NODE_ENV ${mode}`);
    assert.deepEqual(
      shown,
      all.map(({ slug }) => slug),
      `NODE_ENV ${mode}`,
    );
    assert.deepEqual(work, pages, `NODE_ENV ${mode}`);
    assert.deepEqual(home, pages, `NODE_ENV ${mode}`);
  }
});
