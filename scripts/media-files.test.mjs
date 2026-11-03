import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  readPublicFiles,
  run,
  sizeTable,
  tableProblems,
  tableText,
  usedFiles,
} from './media-files.mjs';

//? Real 5x3 pictures written by an image library; see image-size.test.mjs
const PNG_5X3 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAUAAAADCAIAAADUVFKvAAAAE0lEQVR4nGM8ISfHgASYkDlY+AAwIgEKYR06jAAAAABJRU5ErkJggg==',
  'base64',
);
const GIF_5X3 = Buffer.from(
  'R0lGODdhBQADAIEAAMwAAMwzMwAAAAAAACwAAAAABQADAAAIDAADABAYgCDBgQMDAgA7',
  'base64',
);
const WEBP_7X4 = Buffer.from(
  'UklGRh4AAABXRUJQVlA4TBEAAAAvBsAAEAdQ5CrUo4CBiOh/AAA=',
  'base64',
);

/** The same picture made `size` bytes long: only its header is ever read. */
const padded = (picture, size) =>
  Buffer.concat([picture, Buffer.alloc(size - picture.length)]);

const folders = [];
after(() => folders.forEach(dir => rmSync(dir, { recursive: true })));

/**
 * A throwaway site folder holding the given files.
 * @param {Record<string, Buffer | string>} files path under the folder -> content
 */
function site(files) {
  const root = mkdtempSync(path.join(tmpdir(), 'media-sizes-'));
  folders.push(root);

  for (const [name, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), content);
  }

  return root;
}

const TABLE = 'app/_data/media-sizes.json';

/** Runs the command in `root` and collects what it prints. */
async function command(root, args, options = {}) {
  const lines = [];
  const code = await run(args, {
    root,
    print: line => lines.push(line),
    ...options,
  });

  return { code, lines, text: lines.join('\n') };
}

test('lists every file under public/ by its site path, with exact capitals', () => {
  const root = site({
    'public/assets/demo/a.png': PNG_5X3,
    'public/assets/demo/Clip.MP4': 'not a picture',
    'public/assets/demo/fake.png': 'text in a file named like a picture',
    'public/assets/demo/sub/deep.webp': WEBP_7X4,
    'public/Photo Of Me.GIF': GIF_5X3,
    'public/.DS_Store': 'finder droppings',
  });

  assert.deepEqual(readPublicFiles(path.join(root, 'public')), {
    '/Photo Of Me.GIF': {
      bytes: 51,
      named: 'gif',
      format: 'gif',
      width: 5,
      height: 3,
    },
    '/assets/demo/Clip.MP4': { bytes: 13 },
    '/assets/demo/a.png': {
      bytes: 76,
      named: 'png',
      format: 'png',
      width: 5,
      height: 3,
    },
    '/assets/demo/fake.png': { bytes: 35, named: 'png' },
    '/assets/demo/sub/deep.webp': {
      bytes: 38,
      named: 'webp',
      format: 'webp',
      width: 7,
      height: 4,
    },
  });
});

test('a picture saved under the wrong extension keeps its real format', () => {
  const root = site({ 'public/assets/demo/thumbnail.jpg': PNG_5X3 });

  assert.deepEqual(readPublicFiles(path.join(root, 'public')), {
    '/assets/demo/thumbnail.jpg': {
      bytes: 76,
      named: 'jpeg',
      format: 'png',
      width: 5,
      height: 3,
    },
  });
});

test('the table holds the readable pictures under /assets/, in one fixed order', () => {
  const picture = (width, height) => ({
    bytes: 1,
    named: 'png',
    format: 'png',
    width,
    height,
  });
  const table = sizeTable({
    '/assets/b/x.png': picture(1, 2),
    '/assets/a/a.png': picture(10, 20),
    '/moiz.webp': picture(7, 7),
    '/assets/a/clip.mp4': { bytes: 1 },
    '/assets/a/Z.png': picture(3, 4),
    '/assets/a/broken.png': { bytes: 1, named: 'png' },
    '/assets/a/10.png': picture(5, 6),
    '/assets/a/9.png': picture(7, 8),
  });

  //? Plain character order, so a capital sorts before every small letter and
  //? "10" before "9", on any machine and in any language setting
  assert.deepEqual(Object.entries(table), [
    ['/assets/a/10.png', [5, 6]],
    ['/assets/a/9.png', [7, 8]],
    ['/assets/a/Z.png', [3, 4]],
    ['/assets/a/a.png', [10, 20]],
    ['/assets/b/x.png', [1, 2]],
  ]);
});

test('writes the table one picture to a line, the way Prettier leaves it', () => {
  assert.equal(
    tableText({ '/assets/a/a.png': [10, 20], '/assets/b/x.png': [1, 2] }),
    '{\n  "/assets/a/a.png": [10, 20],\n  "/assets/b/x.png": [1, 2]\n}\n',
  );
  assert.equal(tableText({}), '{}\n');
});

test('says what differs between the committed table and the files', () => {
  const committed = {
    '/assets/a/gone.png': [1, 1],
    '/assets/a/recropped.png': [100, 50],
    '/assets/a/same.png': [8, 8],
  };
  const real = {
    '/assets/a/new.png': [30, 40],
    '/assets/a/recropped.png': [90, 50],
    '/assets/a/same.png': [8, 8],
  };

  assert.deepEqual(tableProblems(committed, real), [
    '/assets/a/gone.png is in the table, but there is no such picture',
    '/assets/a/new.png (30x40) is missing from the table',
    '/assets/a/recropped.png is 90x50, the table says 100x50',
  ]);
  assert.deepEqual(tableProblems(real, real), []);
});

test('writes the table, and leaves an up-to-date one alone', async () => {
  const root = site({
    'public/assets/demo/b.png': PNG_5X3,
    'public/assets/demo/a.webp': WEBP_7X4,
    'public/outside.gif': GIF_5X3,
    'app/_data/keep.txt': '',
  });

  const first = await command(root, ['--quiet']);

  assert.equal(first.code, 0);
  assert.equal(
    readFileSync(path.join(root, TABLE), 'utf8'),
    '{\n  "/assets/demo/a.webp": [7, 4],\n  "/assets/demo/b.png": [5, 3]\n}\n',
  );
  assert.match(first.text, /media-sizes\.json/);

  //? A second run has nothing to say and nothing to write: the file is made
  //? read-only, so writing it again would fail
  chmodSync(path.join(root, TABLE), 0o444);
  const second = await command(root, ['--quiet']);

  assert.equal(second.code, 0);
  assert.deepEqual(second.lines, []);
});

test('--check passes on a table that matches and writes nothing', async () => {
  const root = site({ 'public/assets/demo/a.png': PNG_5X3 });
  mkdirSync(path.join(root, 'app/_data'), { recursive: true });
  //? Not the script's own spacing: the content is compared, not the text
  writeFileSync(path.join(root, TABLE), '{"/assets/demo/a.png":[5,3]}');

  const { code } = await command(root, ['--check']);

  assert.equal(code, 0);
  assert.equal(
    readFileSync(path.join(root, TABLE), 'utf8'),
    '{"/assets/demo/a.png":[5,3]}',
  );
});

test('--check fails with the reason when a picture changed, and writes nothing', async () => {
  const root = site({
    'public/assets/demo/a.png': PNG_5X3,
    'public/assets/demo/added.webp': WEBP_7X4,
  });
  mkdirSync(path.join(root, 'app/_data'), { recursive: true });
  writeFileSync(path.join(root, TABLE), '{"/assets/demo/a.png":[50,30]}');

  const { code, text } = await command(root, ['--check']);

  assert.equal(code, 1);
  assert.match(text, /\/assets\/demo\/a\.png is 5x3, the table says 50x30/);
  assert.match(text, /\/assets\/demo\/added\.webp \(7x4\) is missing/);
  assert.match(text, /npm run sizes/);
  assert.equal(
    readFileSync(path.join(root, TABLE), 'utf8'),
    '{"/assets/demo/a.png":[50,30]}',
  );
});

test('--check fails when the table is missing or cannot be read', async () => {
  const root = site({ 'public/assets/demo/a.png': PNG_5X3 });

  const missing = await command(root, ['--check']);
  assert.equal(missing.code, 1);
  assert.match(missing.text, /npm run sizes/);
  assert.equal(existsSync(path.join(root, TABLE)), false);

  mkdirSync(path.join(root, 'app/_data'), { recursive: true });
  writeFileSync(path.join(root, TABLE), '{ not json');
  const broken = await command(root, ['--check']);
  assert.equal(broken.code, 1);
  assert.match(broken.text, /npm run sizes/);
});

test('the report lists each folder with sizes, odd names and unused files', async () => {
  const root = site({
    'public/assets/demo/hero.png': padded(PNG_5X3, 12_000),
    'public/assets/demo/Leads-table.png': padded(PNG_5X3, 2_400),
    'public/assets/demo/old shot.png': padded(PNG_5X3, 1_600),
    'public/assets/demo/thumbnail.png': padded(GIF_5X3, 1_000),
    'public/assets/demo/intro.mp4': Buffer.alloc(480_600),
    'public/assets/waiting/01.webp': padded(WEBP_7X4, 1_000),
  });

  const { code, lines } = await command(root, [], {
    usedFiles: async () =>
      new Set([
        '/assets/demo/hero.png',
        '/assets/demo/thumbnail.png',
        '/assets/demo/intro.mp4',
      ]),
  });
  const line = name => lines.find(text => text.includes(name)) ?? '';
  //? Folder headings start at the margin; the files under them are indented
  const heading = name => lines.find(text => text.startsWith(name)) ?? '';

  assert.equal(code, 0);
  //? Pixel size and weight of a picture a project uses: nothing else to say
  assert.match(line('hero.png'), /^\s+hero\.png\s+5 x 3\s+12 kB\s*$/);
  //? Files no project uses, one with a capital and one with a space
  assert.match(line('Leads-table.png'), /5 x 3\s+2 kB/);
  assert.match(line('Leads-table.png'), /not used/);
  assert.match(line('Leads-table.png'), /capitals or spaces/);
  assert.match(line('old shot.png'), /capitals or spaces/);
  //? A GIF saved as .png
  assert.match(line('thumbnail.png'), /GIF data in a \.png file/);
  assert.doesNotMatch(line('thumbnail.png'), /not used/);
  //? A video has a weight but no pixel size
  assert.match(line('intro.mp4'), /^\s+intro\.mp4\s+481 kB\s*$/);
  //? One heading per folder with its total; a folder no project touches
  //? says so once instead of on every line
  assert.match(heading('demo'), /5 files, 498 kB/);
  assert.doesNotMatch(heading('demo'), /capitals or spaces/);
  assert.match(heading('waiting'), /1 file, 1 kB/);
  assert.match(heading('waiting'), /no project uses this folder/);
  assert.doesNotMatch(line('01.webp'), /not used/);
  //? ...and the table is still written
  assert.equal(
    readFileSync(path.join(root, TABLE), 'utf8'),
    '{\n  "/assets/demo/Leads-table.png": [5, 3],\n  "/assets/demo/hero.png": [5, 3],\n  "/assets/demo/old shot.png": [5, 3],\n  "/assets/demo/thumbnail.png": [5, 3],\n  "/assets/waiting/01.webp": [7, 4]\n}\n',
  );
});

test('a folder with capitals or spaces is flagged once, on its heading', async () => {
  const root = site({ 'public/assets/New Project/hero.png': PNG_5X3 });

  const { lines } = await command(root, []);

  assert.match(
    lines.find(text => text.startsWith('New Project')),
    /capitals or spaces/,
  );
  assert.doesNotMatch(
    lines.find(text => text.includes('hero.png')),
    /capitals or spaces/,
  );
});

test('the report keeps a nested file under its project folder', async () => {
  const root = site({
    'public/assets/demo/hero.png': PNG_5X3,
    'public/assets/demo/phones/home.webp': WEBP_7X4,
    'public/assets/demo/broken.png': 'not really a picture',
  });

  const { lines } = await command(root, []);
  const line = name => lines.find(text => text.includes(name)) ?? '';

  assert.match(
    lines.find(text => text.startsWith('demo')),
    /3 files/,
  );
  assert.match(line('home.webp'), /^\s+phones\/home\.webp\s+7 x 4/);
  //? A file named like a picture that is not one
  assert.match(line('broken.png'), /cannot be read as a picture/);
});

test('the report can be limited to the folders named', async () => {
  const root = site({
    'public/assets/demo/hero.png': PNG_5X3,
    'public/assets/waiting/01.webp': WEBP_7X4,
  });

  const { text } = await command(root, ['waiting', 'nowhere']);

  assert.match(text, /01\.webp/);
  assert.doesNotMatch(text, /hero\.png/);
  assert.match(text, /public\/assets\/nowhere/);
});

test('the report still comes out when the project list cannot be loaded', async () => {
  const root = site({ 'public/assets/demo/hero.png': PNG_5X3 });

  const { code, text } = await command(root, [], {
    usedFiles: async () => {
      throw new Error('Unexpected token in projects/demo.js');
    },
  });

  assert.equal(code, 0);
  assert.match(text, /hero\.png\s+5 x 3/);
  assert.match(text, /Unexpected token in projects\/demo\.js/);
  assert.doesNotMatch(text, /not used/);
  assert.equal(existsSync(path.join(root, TABLE)), true);
});

test('a misspelled option stops the command instead of writing the table', async () => {
  const root = site({ 'public/assets/demo/a.png': PNG_5X3 });

  //? "--chekc" must not quietly turn a check into a write
  const { code, text } = await command(root, ['--chekc']);

  assert.equal(code, 1);
  assert.match(text, /--chekc/);
  assert.equal(existsSync(path.join(root, TABLE)), false);
});

test('a site without a public folder gives an empty table, not a crash', async () => {
  const root = site({ 'app/_data/keep.txt': '' });

  const { code } = await command(root, ['--quiet']);

  assert.equal(code, 0);
  assert.equal(readFileSync(path.join(root, TABLE), 'utf8'), '{}\n');
});

test('knows the files the real projects use', async () => {
  const { projects } = await import('../app/_data/projects/index.js');
  const used = await usedFiles();

  //? Whatever the projects are today: each one's thumbnail and hero count as
  //? used, and so does every picture and video of its blocks
  for (const entry of projects) {
    assert.ok(used.has(entry.thumbnail), `${entry.slug}: thumbnail`);
    assert.ok(used.has(entry.hero.image), `${entry.slug}: hero`);
    for (const block of entry.blocks) {
      for (const media of [].concat(block.media)) {
        assert.ok(used.has(media.src), `${entry.slug}: ${media.src}`);
        if (media.poster) assert.ok(used.has(media.poster), media.poster);
      }
    }
  }
  assert.equal(used.has('/assets/no-such-project/hero.png'), false);
});

test('the command, run the way npm runs it, passes --check on the committed table', () => {
  const command = fileURLToPath(new URL('./media-sizes.mjs', import.meta.url));
  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [command, '--check'],
    { encoding: 'utf8' },
  );

  assert.equal(status, 0, stdout + stderr);
  assert.match(stdout, /matches the \d+ pictures/);
});
