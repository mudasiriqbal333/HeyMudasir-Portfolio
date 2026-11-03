/**
 * The pictures under public/ and the table of their pixel sizes,
 * app/_data/media-sizes.json. Used by the `npm run sizes` command
 * (media-sizes.mjs) and by the project data test, which checks the entries
 * against the real files.
 *
 * @typedef {{bytes: number, named?: string, format?: string, width?: number, height?: number}} FileInfo
 *   `named` is the picture type the file's extension promises, `format` the
 *   type its content really is; a file that is not a picture has neither.
 * @typedef {Record<string, FileInfo>} PublicFiles
 *   Keyed by site path, e.g. '/assets/jarvis/02.png', spelled as on disk.
 * @typedef {Record<string, number[]>} SizeTable site path -> [width, height]
 */
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

import { imageSize } from './image-size.mjs';

//? Where the table lives, from the project root.
const TABLE = 'app/_data/media-sizes.json';

//? The folder whose pictures the table lists: one sub-folder per project.
const ASSETS = '/assets/';

//? The picture types whose size can be read, by file extension.
const NAMED = {
  png: 'png',
  jpg: 'jpeg',
  jpeg: 'jpeg',
  webp: 'webp',
  gif: 'gif',
};

/**
 * Every file under public/, by site path. The names come from the folder
 * listing, so they carry the capitals the disk really has: a Mac opens
 * "Shot.png" when asked for "shot.png", the live (Linux) host does not.
 *
 * @param {string} publicDir
 * @returns {PublicFiles}
 */
export function readPublicFiles(publicDir) {
  /** @type {PublicFiles} */
  const files = {};

  const walk = (dir, site) => {
    let names;
    try {
      names = readdirSync(dir);
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }

    for (const name of names) {
      //? .DS_Store and the like
      if (name.startsWith('.')) continue;

      const file = path.join(dir, name);
      const stats = statSync(file);

      if (stats.isDirectory()) walk(file, `${site}/${name}`);
      else {
        const named = NAMED[path.extname(name).slice(1).toLowerCase()];
        const size = named ? imageSize(readFileSync(file)) : null;

        files[`${site}/${name}`] = {
          bytes: stats.size,
          ...(named ? { named } : {}),
          ...size,
        };
      }
    }
  };
  walk(publicDir, '');

  return files;
}

/**
 * The size table: every readable picture under public/assets/. The keys are
 * put in plain character order, which is the same on every machine (the order
 * a folder is listed in is not), so the file never changes without a picture
 * changing.
 *
 * @param {PublicFiles} files
 * @returns {SizeTable}
 */
export function sizeTable(files) {
  /** @type {SizeTable} */
  const table = {};

  for (const name of Object.keys(files).sort()) {
    const { width, height } = files[name];

    if (name.startsWith(ASSETS) && width && height) {
      table[name] = [width, height];
    }
  }

  return table;
}

/**
 * The table as the text of media-sizes.json: one picture to a line, spaced
 * the way Prettier leaves a line that fits its width. (A path so long that
 * the line passes 80 characters is still written on one line.)
 * @param {SizeTable} table
 */
export function tableText(table) {
  const lines = Object.keys(table).map(
    name => `  ${JSON.stringify(name)}: [${table[name].join(', ')}]`,
  );

  return lines.length ? `{\n${lines.join(',\n')}\n}\n` : '{}\n';
}

/**
 * What differs between the committed table and the real sizes, one sentence
 * each; empty when they agree.
 * @param {SizeTable} committed
 * @param {SizeTable} real
 * @returns {string[]}
 */
export function tableProblems(committed, real) {
  const size = (table, name) =>
    Object.hasOwn(table, name) ? [].concat(table[name]).join('x') : null;
  const names = new Set([...Object.keys(committed), ...Object.keys(real)]);

  return [...names].sort().flatMap(name => {
    const was = size(committed, name);
    const is = size(real, name);

    if (is === null) {
      return `${name} is in the table, but there is no such picture`;
    }
    if (was === null) return `${name} (${is}) is missing from the table`;

    return was === is ? [] : `${name} is ${is}, the table says ${was}`;
  });
}

const kB = bytes => `${Math.round(bytes / 1000).toLocaleString('en-US')} kB`;

//? Names with capitals or spaces are trouble on the live host: its file
//? system tells "Shot.png" and "shot.png" apart, and a space needs escaping.
const untidy = name => /[A-Z\s]/.test(name);

/**
 * The lines of the report for one folder under public/assets/.
 * @param {string} folder
 * @param {[string, FileInfo][]} entries the folder's files as [site path, info]
 * @param {Set<string> | null} used every file a project uses, when known
 */
function folderReport(folder, entries, used) {
  const prefix = folder ? `${ASSETS}${folder}/` : ASSETS;
  const total = entries.reduce((sum, [, info]) => sum + info.bytes, 0);
  const untouched = used && !entries.some(([name]) => used.has(name));

  const rows = entries.map(([name, info]) => {
    const notes = [];

    if (used && !untouched && !used.has(name)) notes.push('not used');
    if (untidy(name.slice(prefix.length))) {
      notes.push('capitals or spaces in the name');
    }
    if (info.named && !info.format) notes.push('cannot be read as a picture');
    else if (info.named !== info.format) {
      notes.push(
        `${info.format.toUpperCase()} data in a ${path.extname(name)} file`,
      );
    }

    return [
      name.slice(prefix.length),
      info.width ? `${info.width} x ${info.height}` : '',
      kB(info.bytes),
      notes.join(', '),
    ];
  });

  const widest = column => Math.max(...rows.map(row => row[column].length));
  const [nameWidth, sizeWidth, weightWidth] = [0, 1, 2].map(widest);
  const count = `${entries.length} ${entries.length === 1 ? 'file' : 'files'}`;
  const remarks = [
    untouched ? 'no project uses this folder yet' : '',
    untidy(folder) ? 'capitals or spaces in the folder name' : '',
  ].filter(Boolean);

  return [
    '',
    `${folder || '(loose in public/assets)'}  ${count}, ${kB(total)}${
      remarks.length ? `  (${remarks.join(', ')})` : ''
    }`,
    ...rows.map(([name, size, weight, notes]) =>
      [
        '',
        name.padEnd(nameWidth),
        size.padEnd(sizeWidth),
        weight.padStart(weightWidth),
        notes,
      ]
        .join('  ')
        .trimEnd(),
    ),
  ];
}

/**
 * The report: every folder under public/assets/ with each file's pixel size
 * and weight, plus what stands out about it.
 * @param {PublicFiles} files
 * @param {string[]} only folder names to keep; all of them when empty
 * @param {Set<string> | null} used
 * @returns {string[]}
 */
function report(files, only, used) {
  /** @type {Map<string, [string, FileInfo][]>} */
  const folders = new Map();

  for (const name of Object.keys(files).sort()) {
    if (!name.startsWith(ASSETS)) continue;

    const rest = name.slice(ASSETS.length);
    const folder = rest.includes('/') ? rest.slice(0, rest.indexOf('/')) : '';

    folders.set(folder, [...(folders.get(folder) ?? []), [name, files[name]]]);
  }

  const wanted = only.length ? only : [...folders.keys()];

  return wanted.flatMap(folder =>
    folders.has(folder)
      ? folderReport(folder, folders.get(folder), used)
      : ['', `There is no folder public/assets/${folder}.`],
  );
}

/** The table already on disk, or null when it is missing or is not a table. */
function committedTable(file) {
  try {
    const table = JSON.parse(readFileSync(file, 'utf8'));

    return table && typeof table === 'object' && !Array.isArray(table)
      ? table
      : null;
  } catch {
    return null;
  }
}

/**
 * Every file a project uses, for the "not used" notes of the report. The
 * project files are loaded only when this is called, so one that is half
 * written never stops the table from being made.
 * @returns {Promise<Set<string>>}
 */
export async function usedFiles() {
  const [{ projects }, { caseFiles }] = await Promise.all([
    import('../app/_data/projects/index.js'),
    import('../app/_data/validate-cases.js'),
  ]);

  return new Set(
    projects.flatMap(entry => caseFiles(entry).map(file => file.src)),
  );
}

const OPTIONS = ['--check', '--quiet'];
const FIX = `Run "npm run sizes" and commit ${TABLE}.`;

/**
 * The `npm run sizes` command.
 *
 *   (no option)  write the table and print the report
 *   <folder>...  the same, with the report kept to those folders
 *   --quiet      write the table; say something only when it changed
 *   --check      write nothing; fail when the table does not match the files
 *
 * @param {string[]} args
 * @param {object} options
 * @param {string} options.root the project folder
 * @param {(line: string) => void} options.print
 * @param {() => Promise<Set<string>>} [options.usedFiles]
 *   every file the projects use, for the "not used" notes of the report
 * @returns {Promise<number>} the exit code
 */
export async function run(args, { root, print, usedFiles }) {
  const unknown = args.filter(
    arg => arg.startsWith('-') && !OPTIONS.includes(arg),
  );
  if (unknown.length) {
    print(`Unknown option ${unknown.join(', ')}. Use --check or --quiet.`);

    return 1;
  }

  const file = path.join(root, TABLE);
  const files = readPublicFiles(path.join(root, 'public'));
  const table = sizeTable(files);
  const count = `${Object.keys(table).length} pictures`;

  if (args.includes('--check')) {
    const committed = committedTable(file);
    const problems = committed
      ? tableProblems(committed, table)
      : [`${TABLE} is missing or is not valid JSON`];

    if (!problems.length) {
      print(`${TABLE} matches the ${count} under public/assets.`);

      return 0;
    }

    print(`${TABLE} does not match the pictures under public/assets:`);
    problems.slice(0, 20).forEach(problem => print(`  ${problem}`));
    if (problems.length > 20) print(`  ... and ${problems.length - 20} more`);
    print(FIX);

    return 1;
  }

  const text = tableText(table);
  let before = null;
  try {
    before = readFileSync(file, 'utf8');
  } catch {
    //? No table yet: it is written below
  }

  if (before !== text) {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, text);
  }

  if (!args.includes('--quiet')) {
    let used = null;
    let failure = null;
    try {
      used = usedFiles ? await usedFiles() : null;
    } catch (error) {
      failure = error;
    }

    const only = args.filter(arg => !arg.startsWith('-'));
    report(files, only, used).forEach(line => print(line));
    print('');
    if (failure) {
      print(
        `The project list could not be loaded, so unused files are not marked: ${failure.message}`,
      );
    }
  }

  if (before !== text) {
    print(`Wrote ${TABLE} (${count}): commit it together with the pictures.`);
  } else if (!args.includes('--quiet')) {
    print(`${TABLE} is up to date (${count}).`);
  }

  return 0;
}
