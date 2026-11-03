// @ts-check
import airSeaCargo from './121-air-sea-cargo.js';
import alvanda from './alvanda.js';
import careerBuddy from './career-buddy.js';
import fitmasterAi from './fitmaster-ai.js';
import guideMoi from './guide-moi.js';
import jarvis from './jarvis.js';
import javat365 from './javat365.js';
import landscapeAi from './landscape-ai.js';
//? Switched off: not the owner's projects (their files and pictures are kept)
// import myFriend from './my-friend.js';
import rehq from './rehq.js';
// import simuspace from './simuspace.js';
import startir from './startir.js';
import tow123 from './tow123.js';
import tskr from './tskr.js';

/**
 * Every project, one file each. The order of this list is the order on the
 * site, and it decides more than it looks:
 *
 *   - the first 4 are the "Recent projects" rows on Home;
 *   - the first 2 are the Home tiles on tablet and phone;
 *   - "Next case" at the foot of a project page leads to the entry after it,
 *     and the last one leads back to the first;
 *   - it is also the order of the Work page and of sitemap.xml.
 *
 * A project added at the end therefore never shows on Home. To add one,
 * import its file above and put its name where it should appear. A draft
 * (`draft: true`) is skipped on the live site, so the projects after it move
 * up there.
 *
 * @type {import('../case-options.js').CaseEntry[]}
 */
export const projects = [
  //? One project to a line: move a line to move the project
  rehq,
  javat365,
  fitmasterAi,
  tow123,
  // simuspace,
  jarvis,
  careerBuddy,
  airSeaCargo,
  // myFriend,
  alvanda,
  tskr,
  startir,
  guideMoi,
  landscapeAi,
];
