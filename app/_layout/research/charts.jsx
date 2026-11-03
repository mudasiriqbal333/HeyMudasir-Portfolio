'use client';

import { useRef } from 'react';

import { motion, useInView } from 'framer-motion';

import {
  researchCascade,
  researchCombinations,
  researchFlagTable,
  researchJudges,
  researchMetaClaims,
  researchOverlap,
  researchSweep,
  researchTaxonomy,
} from '@/data';

import {
  Axis,
  Bar,
  BarRow,
  BarRows,
  CascadeTable,
  Caught,
  Chart,
  ChartLegend,
  Dumbbell,
  Kind,
  Kinds,
  RowLabel,
  Stack,
  Stat,
  Stats,
  Sweep,
  SweepAxis,
  Track,
  Venn,
  Venns,
} from './charts.styled';
import { revealProps } from './reveal';

const MotionStats = motion(Stats);

//? One colour per judge family, as in the dissertation's figures
const JUDGE_COLORS = {
  llama: 'var(--judge-llama)',
  qwen: 'var(--judge-qwen)',
  gemma: 'var(--judge-gemma)',
};
const judgeName = key => researchJudges.find(judge => judge.key === key).short;

//? The F1 charts share one scale, so their bars compare
const F1_SCALE = 40;
const PRECISION_SCALE = 80;

/** A percentage as the paper prints it: one decimal, and a plain 0. */
const percent = value => (value ? `${value.toFixed(1)}%` : '0%');

/**
 * A chart that draws itself the first time most of it is in view: the
 * figure gets data-in, which every part of it transitions from.
 * @param {{caption?: string, style?: object, children: import('react').ReactNode}} props
 */
function ChartFrame({ caption, style, children }) {
  /** @type {import('react').MutableRefObject<HTMLElement | null>} */
  const ref = useRef(null);
  const drawn = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });

  return (
    <Chart ref={ref} data-in={drawn || undefined} style={style}>
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </Chart>
  );
}

/** The scale under rows of bars: 0 to `max` in four steps. */
function Scale({ max }) {
  return (
    <Axis aria-hidden='true'>
      <div />
      <div>
        {[0, 1, 2, 3, 4].map(step => (
          <span key={step}>{(max / 4) * step}%</span>
        ))}
      </div>
    </Axis>
  );
}

/** Table IV: the 42 errors by kind, and how many of each any system caught. */
export function TaxonomyChart() {
  const sizes = researchTaxonomy.map(kind => kind.red + kind.yellow);
  const most = Math.max(...sizes);

  return (
    <ChartFrame caption='The 42 claims labelled yellow or red, coded by hand into six kinds. Caught: flagged by at least one of the five systems under any of the three judges.'>
      <ChartLegend aria-hidden='true'>
        <li style={{ '--c': 'var(--label-red)' }}>
          <i />
          Unsupported
        </li>
        <li style={{ '--c': 'var(--label-yellow)' }}>
          <i />
          Partly supported
        </li>
        <li style={{ '--c': 'var(--color-blue)' }}>
          <i />
          Caught
        </li>
      </ChartLegend>
      <Kinds>
        {researchTaxonomy.map((kind, index) => (
          <Kind key={kind.key}>
            <div>
              <h4>{kind.name}</h4>
              <p>{kind.text}</p>
            </div>
            <div aria-hidden='true'>
              <Stack
                style={{
                  '--total': sizes[index],
                  '--most': most,
                  '--i': index,
                }}
              >
                {kind.red ? (
                  <span style={{ '--n': kind.red }}>{kind.red}</span>
                ) : null}
                {kind.yellow ? (
                  <span data-label='y' style={{ '--n': kind.yellow }}>
                    {kind.yellow}
                  </span>
                ) : null}
              </Stack>
            </div>
            <Caught
              style={{ '--share': kind.caught / sizes[index], '--i': index }}
            >
              <span className='sr-only'>
                {kind.red} unsupported and {kind.yellow} partly supported,{' '}
              </span>
              {kind.caught} of {sizes[index]} caught
              <i aria-hidden='true' />
            </Caught>
          </Kind>
        ))}
      </Kinds>
    </ChartFrame>
  );
}

/** Section IV-B: what the span detector flags at every threshold. */
export function SweepChart() {
  const { errors, auroc, rows } = researchSweep;
  const [, caught, , precision, recall] = researchFlagTable[0].all;

  return (
    <div>
      <ChartFrame caption='Claims the span detector flags as its confidence threshold rises, against the 42 it should find. The systems use 0.3. From the sweep in the dissertation’s appendix B.'>
        <Sweep aria-hidden='true'>
          <span data-target>{errors} hallucinated claims</span>
          {rows.map((row, index) => (
            <div
              key={row.t}
              data-col
              data-used={row.used || undefined}
              style={{ '--v': row.flagged / errors, '--i': index }}
            >
              <span>{row.flagged}</span>
              <i />
            </div>
          ))}
        </Sweep>
        <SweepAxis aria-hidden='true'>
          {rows.map(row => (
            <span key={row.t} data-used={row.used || undefined}>
              {row.t}
              {row.used ? <small>used</small> : null}
            </span>
          ))}
        </SweepAxis>
        <table className='sr-only'>
          <caption>
            Claims the span detector flags at each threshold, of {errors}{' '}
            hallucinated claims
          </caption>
          <thead>
            <tr>
              <th scope='col'>Threshold</th>
              <th scope='col'>Claims flagged</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.t}>
                <th scope='row'>
                  {row.t}
                  {row.used ? ' (used)' : null}
                </th>
                <td>{row.flagged}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartFrame>
      <MotionStats {...revealProps()}>
        <Stat>
          <h4>AUROC</h4>
          <p data-figure>{auroc}</p>
          <p>Near chance: a coin toss scores 0.5</p>
        </Stat>
        <Stat>
          <h4>Precision</h4>
          <p data-figure>{precision}%</p>
          <p>Both of its flags are real errors</p>
        </Stat>
        <Stat>
          <h4>Recall</h4>
          <p data-figure>{recall}%</p>
          <p>
            {caught} of the {errors} errors, from one question
          </p>
        </Stat>
      </MotionStats>
    </div>
  );
}

/** Table I: F1 of the five systems under each judge. */
export function SystemsChart() {
  return (
    <ChartFrame
      style={{ '--label': '8em' }}
      caption='F1 on the flag task: a claim counts as flagged when it comes back yellow or red, and the 42 claims labelled yellow or red are the ones to find. The span detector works without a judge.'
    >
      <ChartLegend aria-hidden='true'>
        {researchJudges.map(judge => (
          <li key={judge.key} style={{ '--c': JUDGE_COLORS[judge.key] }}>
            <i />
            {judge.name}
          </li>
        ))}
        <li style={{ '--c': 'var(--color-dark)' }}>
          <i />
          No judge
        </li>
      </ChartLegend>
      <BarRows aria-hidden='true'>
        {researchFlagTable.map((row, rowIndex) => {
          const bars = row.all
            ? [{ key: 'all', color: 'var(--color-dark)', f1: row.all[5] }]
            : researchJudges.map(judge => ({
                key: judge.key,
                color: JUDGE_COLORS[judge.key],
                f1: row[judge.key][5],
              }));

          return (
            <BarRow key={row.key}>
              <RowLabel>
                <span data-key>{row.key}</span>
                {row.name}
              </RowLabel>
              <Track>
                {bars.map((bar, index) => (
                  <Bar
                    key={bar.key}
                    style={{
                      '--v': bar.f1 / F1_SCALE,
                      '--c': bar.color,
                      '--i': rowIndex * 3 + index,
                    }}
                  >
                    <span>{percent(bar.f1)}</span>
                  </Bar>
                ))}
              </Track>
            </BarRow>
          );
        })}
      </BarRows>
      <Scale max={F1_SCALE} />
      <table className='sr-only'>
        <caption>Flag-task F1 of each system under each judge</caption>
        <thead>
          <tr>
            <th scope='col'>System</th>
            {researchJudges.map(judge => (
              <th key={judge.key} scope='col'>
                {judge.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {researchFlagTable.map(row => (
            <tr key={row.key}>
              <th scope='row'>
                {row.key} {row.name}
              </th>
              {researchJudges.map(judge => (
                <td key={judge.key}>
                  {percent((row.all ?? row[judge.key])[5])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ChartFrame>
  );
}

//? The Venn layout, in the SVG's own units: three circles of radius 70, the
//? judges' names outside them and a point inside each of the seven regions.
const VENN_CIRCLES = [
  { key: 'llama', cx: 115, cy: 95 },
  { key: 'qwen', cx: 185, cy: 95 },
  { key: 'gemma', cx: 150, cy: 155 },
];
const VENN_NAMES = { llama: [100, 10], qwen: [200, 10], gemma: [150, 242] };
const VENN_REGIONS = {
  llama: [84, 84],
  qwen: [216, 84],
  gemma: [150, 196],
  'llama+qwen': [150, 62],
  'llama+gemma': [110, 142],
  'qwen+gemma': [190, 142],
  all: [150, 116],
};

/**
 * One set of claims as a three-judge Venn diagram.
 * @param {{set: {label: string, of: number, regions: Record<string, number>}, rest: string}} props
 */
function VennDiagram({ set, rest }) {
  const regions = Object.entries(set.regions);
  const flagged = regions.reduce((sum, [, count]) => sum + count, 0);
  const total = key =>
    regions
      .filter(([region]) => region === 'all' || region.split('+').includes(key))
      .reduce((sum, [, count]) => sum + count, 0);
  const regionName = region => {
    if (region === 'all') return 'all three';
    const names = region.split('+').map(judgeName);

    return names.length > 1 ? names.join(' and ') : `${names[0]} alone`;
  };
  const label = `${set.label}, of ${set.of}: ${regions
    .map(([region, count]) => `${regionName(region)} ${count}`)
    .join(', ')}.`;

  return (
    <Venn>
      <h4>{set.label}</h4>
      <svg viewBox='35 0 230 250' role='img' aria-label={label}>
        {VENN_CIRCLES.map((circle, index) => (
          <circle
            key={circle.key}
            cx={circle.cx}
            cy={circle.cy}
            r='70'
            style={{ '--c': JUDGE_COLORS[circle.key], '--i': index }}
          />
        ))}
        {VENN_CIRCLES.map(({ key }) => (
          <text
            key={key}
            data-name
            x={VENN_NAMES[key][0]}
            y={VENN_NAMES[key][1]}
            style={{ '--c': JUDGE_COLORS[key] }}
          >
            {judgeName(key)} · {total(key)}
          </text>
        ))}
        {regions.map(([region, count]) => (
          <text
            key={region}
            x={VENN_REGIONS[region][0]}
            y={VENN_REGIONS[region][1]}
            data-zero={count === 0 || undefined}
          >
            {count}
          </text>
        ))}
      </svg>
      <p>
        {set.of - flagged} of the {set.of} {rest}
      </p>
    </Venn>
  );
}

/** Figure 2: which errors, and which supported claims, each judge flags. */
export function OverlapChart() {
  const { catches, falseAlarms } = researchOverlap;

  return (
    <ChartFrame caption='Each circle is one judge family and each number counts the claims in its region; a judge’s total is beside its name. From the dissertation’s figure 2.'>
      <Venns>
        <VennDiagram set={catches} rest='errors flagged by no judge' />
        <VennDiagram
          set={falseAlarms}
          rest='supported claims flagged by no judge'
        />
      </Venns>
    </ChartFrame>
  );
}

const COMBINATION_KINDS = [
  { key: 'union', label: 'Any one flags', color: 'var(--color-blue)' },
  { key: 'single', label: 'One judge', color: 'var(--color-gray)' },
  { key: 'agreement', label: 'Agreement needed', color: 'var(--color-dark)' },
];

/** Table II: every way of combining the judges, best first. */
export function CombinationsChart() {
  const colorOf = Object.fromEntries(
    COMBINATION_KINDS.map(kind => [kind.key, kind.color]),
  );

  return (
    <ChartFrame
      style={{ '--label': '11.5em' }}
      caption='F1 of each way of combining the judges, best first. Exploratory: the combinations were analysed after the results were in.'
    >
      <ChartLegend aria-hidden='true'>
        {COMBINATION_KINDS.map(kind => (
          <li key={kind.key} style={{ '--c': kind.color }}>
            <i />
            {kind.label}
          </li>
        ))}
      </ChartLegend>
      <BarRows aria-hidden='true'>
        {researchCombinations.map((row, index) => {
          const [, caught, falseAlarms, , , f1] = row.cells;

          return (
            <BarRow key={row.name}>
              <RowLabel>
                {row.name}
                <span data-sub>
                  {caught} caught · {falseAlarms} false alarms
                </span>
              </RowLabel>
              <Track>
                <Bar
                  style={{
                    '--v': f1 / F1_SCALE,
                    '--c': colorOf[row.kind],
                    '--i': index,
                  }}
                >
                  <span>{percent(f1)}</span>
                </Bar>
              </Track>
            </BarRow>
          );
        })}
      </BarRows>
      <Scale max={F1_SCALE} />
      <table className='sr-only'>
        <caption>F1 of each way of combining the judges</caption>
        <thead>
          <tr>
            <th scope='col'>Combination</th>
            <th scope='col'>Errors caught</th>
            <th scope='col'>False alarms</th>
            <th scope='col'>F1</th>
          </tr>
        </thead>
        <tbody>
          {researchCombinations.map(row => (
            <tr key={row.name}>
              <th scope='row'>{row.name}</th>
              <td>{row.cells[1]}</td>
              <td>{row.cells[2]}</td>
              <td>{percent(row.cells[5])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChartFrame>
  );
}

/** Tables I and III: precision with and without the meta-claims. */
export function MetaChart() {
  const { count, rows, share } = researchMetaClaims;

  return (
    <div>
      <ChartFrame
        style={{ '--label': '7.5em', '--room': '4em' }}
        caption={`Precision with every claim, and with the ${count} meta-claims set aside. A post-hoc analysis.`}
      >
        <ChartLegend aria-hidden='true'>
          <li style={{ '--c': 'var(--color-gray)' }}>
            <i data-dot />
            Every claim
          </li>
          <li style={{ '--c': 'var(--color-blue)' }}>
            <i data-dot />
            Without meta-claims
          </li>
        </ChartLegend>
        <BarRows aria-hidden='true'>
          {rows.map((row, index) => (
            <BarRow key={row.name}>
              <RowLabel>{row.name}</RowLabel>
              <Dumbbell
                style={{
                  '--from': row.all / PRECISION_SCALE,
                  '--to': row.without / PRECISION_SCALE,
                  '--i': index,
                }}
              >
                <span data-value='from'>{percent(row.all)}</span>
                <i data-line />
                <i data-dot='from' />
                <i data-dot='to' />
                <span data-value='to'>{percent(row.without)}</span>
              </Dumbbell>
            </BarRow>
          ))}
        </BarRows>
        <Scale max={PRECISION_SCALE} />
        <table className='sr-only'>
          <caption>Precision with and without the meta-claims</caption>
          <thead>
            <tr>
              <th scope='col'>Judge</th>
              <th scope='col'>Every claim</th>
              <th scope='col'>Without meta-claims</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.name}>
                <th scope='row'>{row.name}</th>
                <td>{percent(row.all)}</td>
                <td>{percent(row.without)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartFrame>
      <MotionStats {...revealProps()}>
        {share.map(item => (
          <Stat key={item.name}>
            <h4>{item.label}</h4>
            <p data-figure>
              {item.meta}
              <small>/{item.of}</small>
            </p>
            <p>were meta-claims</p>
          </Stat>
        ))}
      </MotionStats>
    </div>
  );
}

/** Section IV-D: what the screening cascade saves, and what it loses. */
export function CascadeChart() {
  return (
    <ChartFrame caption='Errors caught are out of 42: up to 11 for AND and vote, which run the judge on every claim, and 1 for the cascade under Llama or Gemma, 0 under Qwen.'>
      <CascadeTable>
        <thead>
          <tr>
            <td />
            <th scope='col'>Judge on every claim</th>
            <th scope='col'>Cascade</th>
          </tr>
        </thead>
        <tbody>
          {researchCascade.map((row, index) => (
            <tr key={row.label} style={{ '--i': index }}>
              <th scope='row'>
                {row.label}
                <span>{row.note}</span>
              </th>
              <td data-from>
                <span>{row.from}</span>
              </td>
              <td data-to data-tone={row.tone}>
                <span>{row.to}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </CascadeTable>
    </ChartFrame>
  );
}
