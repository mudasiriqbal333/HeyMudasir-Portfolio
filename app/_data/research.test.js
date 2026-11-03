import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
  researchCombinations,
  researchFlagTable,
  researchLabels,
  researchMetaClaims,
  researchNumbers,
  researchOverlap,
  researchPanelViews,
  researchSweep,
  researchTaxonomy,
} from './research/index.js';

//? The Research page states the dissertation's numbers in research/index.js
//? and draws its claims panel from research/claims.json, the per-claim
//? results of the frozen runs. Every number the claims can reproduce is
//? recomputed here, so the page can never contradict itself.
const claims = JSON.parse(
  readFileSync(new URL('./research/claims.json', import.meta.url), 'utf8'),
);

const DETECTORS = ['lettuce', 'llama', 'qwen', 'gemma'];
const JUDGES = ['llama', 'qwen', 'gemma'];

/** Whether `detector` flags `claim`: its verdict is yellow or red. */
const flags = (claim, detector) =>
  claim.says[DETECTORS.indexOf(detector)] !== 'g';

const isError = claim => claim.gold !== 'g';

const round1 = value => Math.round(value * 10) / 10;

/**
 * [flagged, true positives, false positives, P%, R%, F1%] of a rule over a
 * set of claims, as the paper's tables give them.
 * @param {(claim: object) => boolean} rule
 */
function cells(rule, subset = claims) {
  const positives = subset.filter(isError).length;
  const flagged = subset.filter(rule);
  const tp = flagged.filter(isError).length;
  const fp = flagged.length - tp;
  const p = flagged.length ? (100 * tp) / flagged.length : null;
  const r = (100 * tp) / positives;
  const f1 = p && r ? (2 * p * r) / (p + r) : 0;

  return [
    flagged.length,
    tp,
    fp,
    p === null ? null : round1(p),
    round1(r),
    round1(f1),
  ];
}

const any =
  (...detectors) =>
  claim =>
    detectors.some(detector => flags(claim, detector));
const all =
  (...detectors) =>
  claim =>
    detectors.every(detector => flags(claim, detector));

test('the claims are the 345 scored ones, labelled as in the paper', () => {
  assert.equal(claims.length, 345);
  for (const { key, count } of researchLabels) {
    assert.equal(claims.filter(claim => claim.gold === key).length, count, key);
  }
  assert.equal(claims.filter(claim => claim.meta).length, 23);
  assert.ok(claims.every(claim => /^[gyr]{4}$/.test(claim.says)));
  assert.equal(new Set(claims.map(claim => claim.id)).size, 345);
});

test('table I: all five systems under the three judges, from the claims', () => {
  const row = key => researchFlagTable.find(entry => entry.key === key);

  assert.deepEqual(row('S1').all, cells(any('lettuce')));
  for (const name of JUDGES) {
    assert.deepEqual(row('S2')[name], cells(any(name)), `S2 ${name}`);
    //? AND keeps the worse label and vote turns a disagreement yellow, so on
    //? the flag task both flag what either the detector or the judge flags
    assert.deepEqual(row('S3')[name], cells(any('lettuce', name)), name);
    assert.deepEqual(row('S4')[name], cells(any('lettuce', name)), name);
    //? The cascade's judge only sees what the detector flagged
    assert.deepEqual(row('S5')[name], cells(all('lettuce', name)), name);
  }
});

test('table II: every way of combining the judges, from the claims', () => {
  const rules = {
    'Llama or Qwen or span detector': any('llama', 'qwen', 'lettuce'),
    'Llama or Qwen': any('llama', 'qwen'),
    'Any of the three judges': any(...JUDGES),
    'Qwen alone': any('qwen'),
    'Llama alone': any('llama'),
    'Gemma alone': any('gemma'),
    'Two of the three agree': claim =>
      JUDGES.filter(name => flags(claim, name)).length >= 2,
    'Llama and Qwen agree': all('llama', 'qwen'),
    'All three agree': all(...JUDGES),
  };

  assert.deepEqual(
    researchCombinations.map(row => row.name),
    Object.keys(rules),
  );
  for (const row of researchCombinations) {
    const expected = cells(rules[row.name]);
    expected[3] ??= 0;
    assert.deepEqual(row.cells, expected, row.name);
  }
});

test('figure 2: the Venn regions of the three judges, from the claims', () => {
  const region = (subset, names) =>
    subset.filter(
      claim =>
        JUDGES.filter(name => flags(claim, name)).join('+') === names.join('+'),
    ).length;

  for (const [set, subset] of [
    [researchOverlap.catches, claims.filter(isError)],
    [researchOverlap.falseAlarms, claims.filter(claim => !isError(claim))],
  ]) {
    assert.equal(subset.length, set.of);
    for (const [key, count] of Object.entries(set.regions)) {
      const names = key === 'all' ? JUDGES : key.split('+');
      assert.equal(region(subset, names), count, `${set.label} ${key}`);
    }
  }
});

test('table III: precision without the meta-claims, from the claims', () => {
  const plain = claims.filter(claim => !claim.meta);
  const rules = {
    Llama: any('llama'),
    Qwen: any('qwen'),
    Gemma: any('gemma'),
    'Llama or Qwen': any('llama', 'qwen'),
  };

  assert.equal(researchMetaClaims.count, claims.length - plain.length);
  for (const row of researchMetaClaims.rows) {
    assert.equal(row.all, cells(rules[row.name])[3], `${row.name} all`);
    assert.equal(
      row.without,
      cells(rules[row.name], plain)[3],
      `${row.name} without`,
    );
  }

  const falseAlarms = rule =>
    claims.filter(claim => !isError(claim) && rule(claim));
  const shares = {
    Llama: falseAlarms(any('llama')),
    Qwen: falseAlarms(any('qwen')),
    'shared by both': falseAlarms(all('llama', 'qwen')),
  };
  for (const { name, meta, of } of researchMetaClaims.share) {
    assert.equal(shares[name].length, of, name);
    assert.equal(shares[name].filter(claim => claim.meta).length, meta, name);
  }
});

test('table IV: the 42 errors by kind, and which any system caught', () => {
  const errors = claims.filter(isError);
  //? AND and vote flag exactly what the span detector or the judge flags,
  //? and the cascade a subset of that, so "caught by any of the five systems
  //? under any judge" is "flagged by the span detector or any judge".
  const caught = any(...DETECTORS);

  assert.ok(errors.every(claim => claim.category));
  for (const row of researchTaxonomy) {
    const kind = errors.filter(claim => claim.category === row.key);
    assert.equal(kind.filter(claim => claim.gold === 'r').length, row.red);
    assert.equal(kind.filter(claim => claim.gold === 'y').length, row.yellow);
    assert.equal(kind.filter(caught).length, row.caught, row.key);
  }
  assert.equal(
    researchTaxonomy.reduce((sum, row) => sum + row.red + row.yellow, 0),
    errors.length,
  );
});

test('the headline numbers agree with the claims', () => {
  const [rate, silent, union, agree] = researchNumbers;
  const errors = claims.filter(isError);

  assert.equal(rate.value, round1((100 * errors.length) / claims.length));
  //? The span detector marks 2 of the 42; the other 40 get no span at all
  assert.equal(silent.value, errors.length - cells(any('lettuce'))[1]);
  assert.equal(silent.after, `/${errors.length}`);
  assert.equal(union.value, cells(any('llama', 'qwen', 'lettuce'))[5]);
  const [flagged, caught] = cells(all(...JUDGES));
  assert.equal(agree.value, caught);
  assert.equal(agree.after, `/${flagged}`);
});

test('the span detector sweep agrees with the claims at the threshold used', () => {
  const used = researchSweep.rows.filter(row => row.used);
  const [flagged, caught] = cells(any('lettuce'));

  assert.equal(used.length, 1);
  assert.equal(used[0].flagged, flagged);
  //? Both of its flags are real errors
  assert.equal(caught, flagged);
  assert.equal(researchSweep.errors, claims.filter(isError).length);
  //? A higher threshold can only flag fewer claims
  researchSweep.rows.slice(1).forEach((row, index) => {
    assert.ok(row.flagged <= researchSweep.rows[index].flagged, row.t);
  });
});

test('every view of the claims panel names detectors the claims carry', () => {
  for (const view of researchPanelViews) {
    if (view.key === 'gold') continue;
    assert.ok(['any', 'all'].includes(view.rule), view.key);
    assert.ok(
      view.detectors.every(detector => DETECTORS.includes(detector)),
      view.key,
    );
  }
});
