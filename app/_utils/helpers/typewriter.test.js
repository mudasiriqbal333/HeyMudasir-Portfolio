import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  BUILT_LABEL,
  DESCRIPTION_LABEL,
  staggerStarts,
  toCaseDescription,
  typewriterDelay,
  typewriterDuration,
} from './typewriter.js';

test('splits the lead into one entry per word', () => {
  const { lead } = toCaseDescription({ lead: 'hi there you' });

  assert.equal(lead.text, 'hi there you');
  assert.deepEqual(
    lead.words.map(({ word }) => word),
    ['hi', 'there', 'you'],
  );
  assert.deepEqual(
    lead.words.map(({ index }) => index),
    [0, 1, 2],
  );
});

test('leaves a lead too long to type as plain text', () => {
  const words = Array.from({ length: 61 }, () => 'word').join(' ');
  const { lead } = toCaseDescription({ lead: words });

  assert.equal(lead.text, words);
  assert.deepEqual(lead.words, []);
});

test('keeps the whole lead as one string for reading and searching', () => {
  const { lead } = toCaseDescription({ lead: '  a b  c ' });

  assert.equal(lead.text, 'a b  c');
  assert.equal(lead.words.map(({ word }) => word).join(' '), 'a b c');
});

test('starts the body while the lead is still typing, not after it', () => {
  const { body } = toCaseDescription({ lead: 'x', body: ['one', 'two'] });

  assert.equal(body[0].start, 0.45);
  assert.equal(body[1].start, 0.82);
  assert.ok(body.every(({ start }) => start + 0.18 <= 1));
});

test('fills the two columns in parallel, each on its own stagger', () => {
  const { body, built } = toCaseDescription({
    lead: 'x',
    body: ['one', 'two'],
    built: ['a', 'b', 'c'],
  });

  assert.deepEqual(
    body.map(({ start }) => start),
    staggerStarts(2),
  );
  assert.deepEqual(
    built.map(({ start }) => start),
    staggerStarts(3),
  );
  //? Both columns start together, so the right one is never left empty while
  //? the left one fills, and both land as the lead finishes.
  assert.equal(built[0].start, body[0].start);
  assert.equal(built.at(-1).start, body.at(-1).start);
});

test('spreads the stagger evenly however many lines there are', () => {
  assert.deepEqual(staggerStarts(0), []);
  assert.deepEqual(staggerStarts(1), [0.45]);
  assert.deepEqual(staggerStarts(2), [0.45, 0.82]);
  assert.deepEqual(staggerStarts(3), [0.45, 0.635, 0.82]);
});

test('drops blank lines and trims the rest', () => {
  const { body, built } = toCaseDescription({
    body: ['  ', '', '  ab  '],
    built: [null, ' cd '],
  });

  assert.deepEqual(
    body.map(({ text }) => text),
    ['ab'],
  );
  assert.deepEqual(
    built.map(({ text }) => text),
    ['cd'],
  );
});

test('labels the two columns, and lets an entry rename them', () => {
  const fallback = toCaseDescription({ lead: 'x' });

  assert.equal(fallback.label, DESCRIPTION_LABEL);
  assert.equal(fallback.builtLabel, BUILT_LABEL);

  const named = toCaseDescription({
    lead: 'x',
    label: 'The brief',
    builtLabel: 'Stack',
  });

  assert.equal(named.label, 'The brief');
  assert.equal(named.builtLabel, 'Stack');
});

test('reports nothing to show for a project without a description', () => {
  for (const input of [undefined, null, [], '', [''], {}, { body: [] }]) {
    const view = toCaseDescription(input);

    assert.equal(view.isEmpty, true);
    assert.equal(view.lead.text, '');
    assert.deepEqual(view.body, []);
    assert.deepEqual(view.built, []);
  }
});

test('takes a plain string or list as body paragraphs, never as a lead', () => {
  const single = toCaseDescription('ab');
  const list = toCaseDescription(['ab', 'cd']);

  assert.equal(single.isEmpty, false);
  assert.equal(single.lead.text, '');
  assert.deepEqual(
    single.body.map(({ text }) => text),
    ['ab'],
  );
  assert.deepEqual(
    list.body.map(({ text }) => text),
    ['ab', 'cd'],
  );
});

test('keeps a word with an astral character whole', () => {
  const { lead } = toCaseDescription({ lead: 'a\u{1f600} b' });

  assert.equal(lead.words[0].word, 'a\u{1f600}');
  assert.equal(lead.words.length, 2);
});

test('times the run from the number of words', () => {
  assert.equal(typewriterDuration(20, { perWord: 0.1, min: 0.9, max: 3.2 }), 2);
});

test('gives a short lead a run long enough to see', () => {
  assert.equal(
    typewriterDuration(2, { perWord: 0.1, min: 0.9, max: 3.2 }),
    0.9,
  );
});

test('caps a long lead so nobody waits on it', () => {
  assert.equal(
    typewriterDuration(1000, { perWord: 0.1, min: 0.9, max: 3.2 }),
    3.2,
  );
});

test('still runs long enough to bring the lines in with nothing to type', () => {
  assert.equal(
    typewriterDuration(0, { perWord: 0.1, min: 0.9, max: 3.2 }),
    0.9,
  );
  assert.equal(
    typewriterDuration(-5, { perWord: 0.1, min: 0.9, max: 3.2 }),
    0.9,
  );
});

test('waits out whatever is left of the page reveal', () => {
  assert.equal(typewriterDelay(1, 3.75), 2.75);
});

test('starts at once once the page reveal is done', () => {
  assert.equal(typewriterDelay(3.75, 3.75), 0);
  assert.equal(typewriterDelay(60, 3.75), 0);
});
