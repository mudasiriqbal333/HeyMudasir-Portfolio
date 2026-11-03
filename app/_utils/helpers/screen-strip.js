/**
 * Pure parts of the moving row of screenshots on a case page.
 *
 * @typedef {{type: string, media?: any}} Block
 * @typedef {{index: number, block: Block} | {index: number, strip: Block[]}} BlockGroup
 *   `index` is where the block, or the strip, sits in the case's own list. A
 *   strip made only of a laptop's later pictures takes the place right after
 *   that laptop.
 */

/**
 * A clip that plays by itself, muted and looping, like a moving picture. A
 * video with controls keeps its sound and waits for the visitor, so it never
 * drifts past in the strip.
 */
const isSilentClip = media => media?.type === 'video' && !media.controls;

/** A screenshot block holding one still picture or one silent clip. */
const isScreenshot = block =>
  block?.type === 'plain' &&
  !Array.isArray(block.media) &&
  (block.media?.type === 'image' || isSilentClip(block.media));

/**
 * The pictures a laptop slideshow hands on to the strip below it: every still
 * after its first, as screenshot blocks. Only a laptop that plays through
 * several pictures by itself (`autoplay`) shares them.
 * @param {Block} block
 * @returns {Block[]}
 */
const laterPictures = block => {
  if (block?.type !== 'device' || !block.autoplay) return [];
  if (!Array.isArray(block.media)) return [];

  return block.media
    .slice(1)
    .filter(item => item?.type === 'image')
    .map(media => ({ type: 'plain', media }));
};

/**
 * Splits a case's blocks into what the page draws.
 *
 * Screenshots that follow one another become one strip. A laptop slideshow
 * shows its first picture longest, and its later pictures are also put at the
 * head of the screenshots after it, so they can be seen at full size in the
 * strip. Two or more pictures make a strip; a lone one stays an ordinary
 * screenshot, since a strip of one would have nothing to move past.
 * Everything else stays a block of its own.
 *
 * @param {Block[] | undefined} blocks
 * @returns {BlockGroup[]}
 */
export function groupScreenRuns(blocks) {
  /** @type {BlockGroup[]} */
  const groups = [];
  if (!Array.isArray(blocks)) return groups;

  let index = 0;
  /** @type {Block[]} pictures handed on by the laptop just before */
  let carried = [];

  while (index < blocks.length || carried.length) {
    let end = index;
    while (end < blocks.length && isScreenshot(blocks[end])) end += 1;

    const run = [...carried, ...blocks.slice(index, end)];
    carried = [];

    if (run.length >= 2) {
      groups.push({ index, strip: run });
      index = end;
    } else if (run.length === 1) {
      groups.push({ index, block: run[0] });
      index = end;
    } else {
      groups.push({ index, block: blocks[index] });
      carried = laterPictures(blocks[index]);
      index += 1;
    }
  }

  return groups;
}

/**
 * Brings an ever-growing offset back into one length of the loop, so a row
 * that repeats every `length` px can be drawn at `-wrapOffset(x, length)`.
 * Negative offsets wrap to the far end; an unmeasured loop gives 0.
 *
 * @param {number} offset
 * @param {number} length
 * @returns {number}
 */
export function wrapOffset(offset, length) {
  if (!(length > 0)) return 0;

  return ((offset % length) + length) % length;
}
