/**
 * Pure parts of the case description: the shape the copy is turned into for
 * the page, and the timing maths around the animation that brings it in.
 *
 * Only the lead sentence is typed, word by word. Everything under it -- the
 * body paragraphs and the "What I built" list -- rises in on a stagger that
 * starts under the tail of the lead, so the block keeps filling instead of
 * sitting half empty while one long run of characters crawls down it.
 *
 * @typedef {{word: string, index: number}} TypedWord
 * @typedef {{text: string, words: TypedWord[]}} TypedLead
 *   `words` empty means "show this as plain text": no lead, or one too long
 *   to be worth typing.
 * @typedef {{text: string, start: number}} RevealedLine
 *   `start` is where this line comes in, as a fraction of the whole run.
 * @typedef {{label: string, lead: TypedLead, body: RevealedLine[],
 *   builtLabel: string, built: RevealedLine[], isEmpty: boolean}} CaseDescriptionView
 */

/** Heading over the prose when the entry does not name one. */
export const DESCRIPTION_LABEL = 'The project';
/** Heading over the list in the right-hand column, likewise. */
export const BUILT_LABEL = 'What I built';

//? The rest of the block starts while the lead is still being typed and the
//? last of it starts near the end of the run; each line takes REVEAL_FADE to
//? arrive, so everything has landed exactly as the lead finishes. Measured
//? at 1440: the lead is two lines of a 527px block, so holding the fill back
//? to the tail of the run leaves the block empty for 1.3s of 2.1s; starting
//? it just before halfway fills the block continuously instead. The prose and
//? the list each get the whole window, so both columns fill at once.
const REVEAL_FROM = 0.45;
const REVEAL_UNTIL = 0.82;
/** How long one line takes to arrive, as a fraction of the run. */
export const REVEAL_FADE = 0.18;

//? A lead past this many words is shown whole rather than typed: the run
//? would outstay its welcome, and the per-frame cost grows with every word.
const MAX_TYPED_WORDS = 60;

/**
 * Where each of `count` lines comes in, as a fraction of the whole run.
 * Evenly spread between REVEAL_FROM and REVEAL_UNTIL, so a block with two
 * lines and a block with eight both finish with the lead.
 *
 * @param {number} count
 * @param {number} [from]
 * @param {number} [until]
 * @returns {number[]}
 */
export function staggerStarts(count, from = REVEAL_FROM, until = REVEAL_UNTIL) {
  if (!(count > 0)) return [];
  if (count === 1) return [from];

  const step = (until - from) / (count - 1);

  return Array.from(
    { length: count },
    (_, position) => Math.round((from + position * step) * 1000) / 1000,
  );
}

/** @param {unknown} value */
const text = value => (typeof value === 'string' ? value.trim() : '');

/**
 * Split the lead into the words the typewriter wipes in. Whitespace between
 * words is left out of the spans and rendered as plain text, so the sentence
 * still reads as one string to find-in-page, to a screen reader and to
 * anyone copying it.
 *
 * @param {string} value
 * @returns {TypedLead}
 */
function toTypedWords(value) {
  const words = value.split(/\s+/).filter(Boolean);

  if (!words.length || words.length > MAX_TYPED_WORDS) {
    return { text: value, words: [] };
  }

  return { text: value, words: words.map((word, index) => ({ word, index })) };
}

/**
 * @param {unknown} lines
 * @param {number[]} starts
 * @param {number} offset index of the first of these lines within `starts`
 * @returns {RevealedLine[]}
 */
function toRevealedLines(lines, starts, offset) {
  return lines.map((line, position) => ({
    text: line,
    start: starts[offset + position] ?? REVEAL_FROM,
  }));
}

/** @param {unknown} value @returns {string[]} */
const toLines = value =>
  (Array.isArray(value) ? value : [value]).map(text).filter(Boolean);

/**
 * Turn a case entry's `description` into what the page renders.
 *
 * A plain string or list of strings is taken as body paragraphs, so old data
 * keeps working; the big opening line is only ever the `lead` field, never a
 * paragraph promoted behind the owner's back.
 *
 * @param {import('@/data').CaseDescription | string[] | string | null | undefined} description
 * @returns {CaseDescriptionView}
 */
export function toCaseDescription(description) {
  const source =
    description &&
    !Array.isArray(description) &&
    typeof description === 'object'
      ? description
      : { body: description };

  const lead = toTypedWords(text(source.lead));
  const body = toLines(source.body);
  const built = toLines(source.built);
  //? The prose and the list are staggered separately, across the same window,
  //? so the two columns fill side by side. Running one stagger through both
  //? would hold the right-hand column back until the prose was finished,
  //? which at 1440 leaves it empty for most of the run.
  return {
    label: text(source.label) || DESCRIPTION_LABEL,
    lead,
    body: toRevealedLines(body, staggerStarts(body.length), 0),
    builtLabel: text(source.builtLabel) || BUILT_LABEL,
    built: toRevealedLines(built, staggerStarts(built.length), 0),
    isEmpty: !lead.text && !body.length && !built.length,
  };
}

/**
 * How long the whole run takes, in seconds. Short copy still gets a run worth
 * seeing; long copy is capped so nobody waits on it, and a block with no lead
 * to type gets the floor, which is all its lines need to rise in.
 *
 * @param {number} count number of words being typed
 * @param {{perWord?: number, min?: number, max?: number}} [options] seconds
 */
export function typewriterDuration(count, options = {}) {
  const { perWord = 0.13, min = 0.9, max = 3.2 } = options;

  return Math.min(Math.max((count > 0 ? count : 0) * perWord, min), max);
}

/**
 * Seconds to wait before the first word. The page reveal lifts every row into
 * place after the preloader; starting before that has finished would have the
 * two animations fighting over the same text, so whatever is left of `gate` is
 * spent waiting.
 *
 * @param {number} elapsed seconds since the block mounted
 * @param {number} gate seconds the page reveal needs from the same moment
 */
export function typewriterDelay(elapsed, gate) {
  const remaining = gate - elapsed;

  return remaining > 0 ? remaining : 0;
}
