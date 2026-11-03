/**
 * npm run sizes
 *
 * Reads the pixel size of every picture under public/assets/<slug>/ and
 * writes them to app/_data/media-sizes.json, so no size is typed by hand in
 * a project file. Run it after adding or re-cropping pictures.
 *
 *   node scripts/media-sizes.mjs            write the table, print a report
 *   node scripts/media-sizes.mjs jarvis     the same, report on one folder
 *   node scripts/media-sizes.mjs --quiet    write the table, say little
 *   node scripts/media-sizes.mjs --check    write nothing; fail if the table
 *                                           no longer matches the pictures
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { run, usedFiles } from './media-files.mjs';

process.exitCode = await run(process.argv.slice(2), {
  root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  print: console.log,
  usedFiles,
});
