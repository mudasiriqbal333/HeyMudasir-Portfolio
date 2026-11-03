import assert from 'node:assert/strict';
import { test } from 'node:test';

import { groupScreenRuns, wrapOffset } from './screen-strip.js';

const shot = name => ({ type: 'plain', media: { type: 'image', src: name } });
const laptop = { type: 'device', media: { type: 'image', src: 'laptop' } };
const phones = { type: 'mobiles', media: [] };

test('turns a run of screenshots into one strip, in place', () => {
  const blocks = [laptop, shot('a'), shot('b'), shot('c'), phones];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: laptop },
    { index: 1, strip: [blocks[1], blocks[2], blocks[3]] },
    { index: 4, block: phones },
  ]);
});

test('leaves a single screenshot as an ordinary block', () => {
  const blocks = [laptop, shot('a'), phones];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: laptop },
    { index: 1, block: blocks[1] },
    { index: 2, block: phones },
  ]);
});

test('keeps separate runs separate', () => {
  const blocks = [shot('a'), shot('b'), laptop, shot('c'), shot('d')];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, strip: [blocks[0], blocks[1]] },
    { index: 2, block: laptop },
    { index: 3, strip: [blocks[3], blocks[4]] },
  ]);
});

test('a silent clip drifts past in the strip like a picture', () => {
  const clip = { type: 'plain', media: { type: 'video', src: 'v' } };
  const blocks = [shot('a'), clip, shot('b')];

  assert.deepEqual(groupScreenRuns(blocks), [{ index: 0, strip: blocks }]);
});

test('a video with controls is not part of a strip and ends the run', () => {
  const video = {
    type: 'plain',
    media: { type: 'video', src: 'v', controls: true },
  };
  const blocks = [shot('a'), video, shot('b'), shot('c')];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: blocks[0] },
    { index: 1, block: video },
    { index: 2, strip: [blocks[2], blocks[3]] },
  ]);
});

const picture = name => ({ type: 'image', src: name });
const slideshow = (...names) => ({
  type: 'device',
  autoplay: 4000,
  media: names.map(picture),
});

test("a laptop slideshow's later pictures join the screenshots after it", () => {
  const show = slideshow('one', 'two', 'three');
  const blocks = [show, shot('a'), shot('b'), phones];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: show },
    {
      index: 1,
      strip: [
        { type: 'plain', media: picture('two') },
        { type: 'plain', media: picture('three') },
        blocks[1],
        blocks[2],
      ],
    },
    { index: 3, block: phones },
  ]);
});

test("a phone slideshow's later pictures join the screenshots after it, as a laptop's do", () => {
  const show = { ...slideshow('one', 'two', 'three'), device: 'phone' };
  const blocks = [show, shot('a')];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: show },
    {
      index: 1,
      strip: [
        { type: 'plain', media: picture('two') },
        { type: 'plain', media: picture('three') },
        blocks[1],
      ],
    },
  ]);
});

test('with no screenshots after the laptop, its later pictures make the strip', () => {
  const show = slideshow('one', 'two', 'three');

  assert.deepEqual(groupScreenRuns([show, phones]), [
    { index: 0, block: show },
    {
      index: 1,
      strip: [
        { type: 'plain', media: picture('two') },
        { type: 'plain', media: picture('three') },
      ],
    },
    { index: 1, block: phones },
  ]);
});

test('one later picture and one screenshot are enough for a strip', () => {
  const show = slideshow('one', 'two');
  const blocks = [show, shot('a')];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: show },
    { index: 1, strip: [{ type: 'plain', media: picture('two') }, blocks[1]] },
  ]);
});

test('a single later picture with nothing after it is one plain screenshot', () => {
  const show = slideshow('one', 'two');

  assert.deepEqual(groupScreenRuns([show]), [
    { index: 0, block: show },
    { index: 1, block: { type: 'plain', media: picture('two') } },
  ]);
});

test('a laptop that does not play by itself shares nothing', () => {
  const gallery = { type: 'device', media: [picture('one'), picture('two')] };
  const single = { type: 'device', autoplay: 4000, media: picture('one') };
  const blocks = [gallery, shot('a'), single, shot('b'), shot('c')];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: gallery },
    { index: 1, block: blocks[1] },
    { index: 2, block: single },
    { index: 3, strip: [blocks[3], blocks[4]] },
  ]);
});

test('only still pictures leave the laptop for the strip', () => {
  const show = {
    type: 'device',
    autoplay: 4000,
    media: [picture('one'), { type: 'video', src: 'clip' }, picture('three')],
  };
  const blocks = [show, shot('a')];

  assert.deepEqual(groupScreenRuns(blocks), [
    { index: 0, block: show },
    {
      index: 1,
      strip: [{ type: 'plain', media: picture('three') }, blocks[1]],
    },
  ]);
});

test('copes with nothing to group', () => {
  assert.deepEqual(groupScreenRuns([]), []);
  assert.deepEqual(groupScreenRuns(undefined), []);
});

test('wraps an offset into one length of the loop', () => {
  assert.equal(wrapOffset(0, 100), 0);
  assert.equal(wrapOffset(30, 100), 30);
  assert.equal(wrapOffset(130, 100), 30);
  assert.equal(wrapOffset(250, 100), 50);
});

test('wraps a negative offset to the far end of the loop', () => {
  assert.equal(wrapOffset(-30, 100), 70);
  assert.equal(wrapOffset(-230, 100), 70);
  assert.equal(wrapOffset(-100, 100), 0);
});

test('an unmeasured loop wraps to zero rather than NaN', () => {
  assert.equal(wrapOffset(40, 0), 0);
  assert.equal(wrapOffset(40, Number.NaN), 0);
});
