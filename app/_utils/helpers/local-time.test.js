import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as timeModule from './local-time.js';

const { formatLocalTime } = timeModule;

test('formats a time in the given zone as 12-hour uppercase with zone', () => {
  const date = new Date('2026-09-15T03:46:00Z');
  assert.equal(formatLocalTime(date, 'Europe/Amsterdam'), '05:46 AM CEST');
});

test('pads single-digit hours', () => {
  const date = new Date('2026-01-15T20:05:00Z');
  assert.equal(formatLocalTime(date, 'Europe/Amsterdam'), '09:05 PM CET');
});

test('falls back to a GMT offset for zones without an abbreviation', () => {
  const date = new Date('2026-09-15T03:46:00Z');
  assert.equal(formatLocalTime(date, 'Asia/Karachi'), '08:46 AM GMT+5');
});

test('uses plain spaces, never narrow no-break spaces', () => {
  const out = formatLocalTime(new Date('2026-09-15T03:46:00Z'), 'Asia/Karachi');
  assert.equal(out.includes(' '), false);
});

test('exposes a 24-hour HH:MM value for the time element', () => {
  const { formatLocalTimeValue } = timeModule;
  const date = new Date('2026-01-15T20:05:00Z');
  assert.equal(formatLocalTimeValue(date, 'Europe/Amsterdam'), '21:05');
});

//? The formatters are kept and reused. These two build a new one for every
//? call, as the helpers did before, to prove the text has not changed by a
//? single character.
const freshLabel = (date, timeZone) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    timeZoneName: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(/\s/g, ' ')
    .toUpperCase();

const freshValue = (date, timeZone) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);

test('a reused formatter gives the same text as a new one, in every zone', () => {
  const { formatLocalTimeValue } = timeModule;
  const zones = ['Europe/London', 'Europe/Amsterdam', 'Asia/Karachi', 'UTC'];
  //? Every 19 h 37 min across a year: all hours, both clock changes, and the
  //? zones taking turns so one zone's formatter is never used for another
  const start = Date.UTC(2026, 0, 1, 0, 0, 30);
  const step = (19 * 60 + 37) * 60 * 1000;

  for (let at = 0; at < 450; at += 1) {
    const date = new Date(start + at * step);
    for (const zone of zones) {
      assert.equal(formatLocalTime(date, zone), freshLabel(date, zone));
      assert.equal(formatLocalTimeValue(date, zone), freshValue(date, zone));
    }
  }
});

test('reads the same around the hour the clocks go back', () => {
  //? 25 October 2026 in London: 01:59 happens twice, an hour apart. The
  //? winter abbreviation is not spelled out here: it reads "GMT" or "GMT+0",
  //? depending on the time zone names the runtime was built with.
  const before = new Date('2026-10-25T00:59:30Z');
  const after = new Date('2026-10-25T01:59:30Z');
  const summer = formatLocalTime(before, 'Europe/London');
  const winter = formatLocalTime(after, 'Europe/London');
  assert.equal(summer, '01:59 AM BST');
  assert.equal(winter, freshLabel(after, 'Europe/London'));
  assert.match(winter, /^01:59 AM \S+$/);
  assert.notEqual(winter, summer);
});

test('builds each formatter once per zone, however often it is asked', () => {
  const { formatLocalTimeValue } = timeModule;
  const Real = Intl.DateTimeFormat;
  let built = 0;
  Intl.DateTimeFormat = function Counting(...args) {
    built += 1;

    return new Real(...args);
  };

  try {
    //? A zone no other test has used, so nothing is built yet
    const zone = 'Pacific/Auckland';
    for (let second = 0; second < 120; second += 1) {
      const date = new Date(Date.UTC(2026, 9, 4, 9, 15, second));
      formatLocalTime(date, zone);
      formatLocalTimeValue(date, zone);
    }
    assert.equal(built, 2);
  } finally {
    Intl.DateTimeFormat = Real;
  }
});

test('the clock keeps the very same state until its label changes', () => {
  const { nextLocalTime } = timeModule;
  const zone = 'Europe/London';
  const empty = { label: '', value: '' };

  const first = nextLocalTime(empty, new Date('2026-10-04T09:15:00Z'), zone);
  assert.deepEqual(first, { label: '10:15 AM BST', value: '10:15' });

  //? The other 59 seconds of that minute: the same object, not a copy
  for (let second = 1; second < 60; second += 1) {
    const date = new Date(Date.UTC(2026, 9, 4, 9, 15, second));
    assert.equal(nextLocalTime(first, date, zone), first);
  }

  const next = nextLocalTime(first, new Date('2026-10-04T09:16:00Z'), zone);
  assert.notEqual(next, first);
  assert.deepEqual(next, { label: '10:16 AM BST', value: '10:16' });
});

test('the clock follows the zone abbreviation when the time reads the same', () => {
  const { nextLocalTime } = timeModule;
  const zone = 'Europe/London';
  const before = new Date('2026-10-25T00:59:30Z');
  const after = new Date('2026-10-25T01:59:30Z');
  const summer = nextLocalTime({ label: '', value: '' }, before, zone);
  const winter = nextLocalTime(summer, after, zone);
  assert.deepEqual(summer, { label: '01:59 AM BST', value: '01:59' });
  //? The winter label comes from a new formatter instead of being spelled
  //? out, for the same reason as above. What matters is that the time reads
  //? the same, the label does not, and the clock hands out a new state.
  assert.deepEqual(winter, {
    label: freshLabel(after, zone),
    value: freshValue(after, zone),
  });
  assert.equal(winter.value, summer.value);
  assert.notEqual(winter.label, summer.label);
  assert.notEqual(winter, summer);
});
