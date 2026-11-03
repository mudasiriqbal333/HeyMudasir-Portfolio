'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useInView } from 'framer-motion';

import { MagneticButton } from '@/components';
import { researchPanelViews, researchPaper } from '@/data';
import claims from '@/data/research/claims.json';
import { REVEAL_DELAY } from '@/hooks';

import { panelPill } from './classes';
import {
  Caption,
  Chip,
  Controls,
  Dot,
  Dots,
  Field,
  FieldHead,
  Fields,
  Legend,
  Panel,
  PanelHead,
  PanelSection,
  PaperButton,
  Tip,
  Views,
} from './panel.styled';
import { HeroContainer } from '../case/index.styled';
import { roundButton } from '../contact/classes';

//? The order of the letters in a claim's `says`
const DETECTORS = ['lettuce', 'llama', 'qwen', 'gemma'];
const DETECTOR_NAMES = {
  lettuce: 'Span detector',
  llama: 'Llama judge',
  qwen: 'Qwen judge',
  gemma: 'Gemma judge',
};
const GOLD_NAMES = { g: 'Supported', y: 'Partly supported', r: 'Unsupported' };
const VERDICTS = { g: 'Passes', y: 'Flags yellow', r: 'Flags red' };
const QUESTION_TYPES = {
  answerable: 'Answerable question',
  partial: 'Partial-support question',
  'false-premise': 'False-premise question',
  fabrication: 'Fabrication question',
  abstain: 'Unanswerable question',
};

//? The supported claims with the meta-claims last, where most false alarms
//? land; the hallucinated ones red first, then yellow.
const supported = claims
  .filter(claim => claim.gold === 'g')
  .sort((a, b) => Number(a.meta) - Number(b.meta));
const errors = [
  ...claims.filter(claim => claim.gold === 'r'),
  ...claims.filter(claim => claim.gold === 'y'),
];
const byId = new Map(claims.map(claim => [claim.id, claim]));

/** @param {{says: string}} claim @param {string} detector */
const verdict = (claim, detector) => claim.says[DETECTORS.indexOf(detector)];

/** Whether a view flags a claim: any or all of its detectors say yellow or red. */
function flagsOf(view) {
  if (!view.detectors) return () => false;
  const method = view.rule === 'all' ? 'every' : 'some';

  return claim =>
    view.detectors[method](detector => verdict(claim, detector) !== 'g');
}

const percent = (part, whole) =>
  whole ? `${Math.round((1000 * part) / whole) / 10}%` : '–';

//? Delay of a dot in the reveal: its column plus its row on the desktop
//? grid, so the dots sweep in from the top left.
const sweep = (index, cols) => (index % cols) + Math.floor(index / cols);

/**
 * The page's hero: all 345 scored claims, coloured by their gold label, and
 * a switch that shows what each detector, or a combination of them, flags.
 * The counts are worked out here from the claims themselves.
 */
export function ClaimsPanel() {
  const [viewKey, setViewKey] = useState('gold');
  const view = researchPanelViews.find(entry => entry.key === viewKey);
  const flags = useMemo(() => flagsOf(view), [view]);
  const stats = useMemo(() => {
    const caught = errors.filter(flags).length;
    const falseAlarms = supported.filter(flags).length;

    return {
      caught,
      falseAlarms,
      precision: percent(caught, caught + falseAlarms),
      recall: percent(caught, errors.length),
    };
  }, [flags]);
  const isGold = viewKey === 'gold';

  /** @type {import('react').MutableRefObject<HTMLElement | null>} */
  const panelRef = useRef(null);
  const inView = useInView(panelRef, {
    once: true,
    margin: '0px 0px -15% 0px',
  });
  //? The panel sits on the first screen: its dots wait for the preloader
  const [afterLoader, setAfterLoader] = useState(false);
  const [settled, setSettled] = useState(false);
  const ready = inView && afterLoader;

  useEffect(() => {
    const timer = setTimeout(
      () => setAfterLoader(true),
      REVEAL_DELAY * 1000 + 250,
    );

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setSettled(true), 1600);

    return () => clearTimeout(timer);
  }, [ready]);

  const [tip, setTip] = useState(null);
  const showTip = useCallback(event => {
    const dot = event.target.closest?.('[data-id]');
    const panel = panelRef.current;
    if (!dot || !panel) return;

    const box = panel.getBoundingClientRect();
    const rect = dot.getBoundingClientRect();
    const half = Math.min(170, (box.width - 32) / 2);
    const x = rect.left + rect.width / 2 - box.left;
    const y = rect.top - box.top;

    setTip({
      id: dot.dataset.id,
      x: Math.min(Math.max(x, half + 16), box.width - half - 16),
      y,
      height: rect.height,
      below: y < box.height * 0.4,
    });
  }, []);
  const hideTip = useCallback(() => setTip(null), []);
  const tipClaim = tip ? byId.get(tip.id) : null;
  //? A mouse shows a claim on hover; a finger taps a dot to show it and
  //? anywhere else in the panel to hide it, since its pointer leaves the
  //? panel the moment it lifts.
  const onFieldsOver = event => {
    if (event.pointerType !== 'touch') showTip(event);
  };
  const onPanelClick = event => {
    if (event.target.closest?.('[data-id]')) showTip(event);
    else if (!event.target.closest?.('button')) hideTip();
  };
  const onPanelLeave = event => {
    if (event.pointerType !== 'touch') hideTip();
  };

  const dot = (claim, index, cols) => (
    <Dot
      key={claim.id}
      data-id={claim.id}
      data-gold={claim.gold}
      data-flag={flags(claim) || undefined}
      data-hovered={tip?.id === claim.id || undefined}
      style={{ '--d': sweep(index, cols) }}
    />
  );

  return (
    <PanelSection data-once-in>
      <HeroContainer>
        <div className='relative w-full'>
          <PaperButton>
            <MagneticButton
              href={researchPaper.pdf}
              target='_blank'
              rel='noopener'
              prefetch={false}
              variant='primary'
              strength={100}
              whileHover={{ scale: 1 }}
              className={roundButton}
            >
              Read the paper
              <span className='sr-only'> (PDF, opens in a new tab)</span>
            </MagneticButton>
          </PaperButton>

          <Panel
            ref={panelRef}
            data-ready={ready || undefined}
            data-settled={settled || undefined}
            data-mode={isGold ? 'gold' : 'detector'}
            onPointerLeave={onPanelLeave}
            onClick={onPanelClick}
          >
            <PanelHead>
              <p>The evaluation set</p>
              <h2>345 claims, every one checked by hand</h2>
            </PanelHead>

            <Fields onPointerOver={onFieldsOver}>
              <Field data-field='supported'>
                <FieldHead>
                  <span>Supported claims</span>
                  <span>
                    {isGold ? supported.length : `${stats.falseAlarms} flagged`}
                  </span>
                </FieldHead>
                <Dots data-field='supported' aria-hidden='true'>
                  {supported.map((claim, index) => dot(claim, index, 30))}
                </Dots>
              </Field>
              <Field data-field='errors'>
                <FieldHead>
                  <span>Hallucinated</span>
                  <span>
                    {isGold
                      ? errors.length
                      : `${stats.caught} of ${errors.length} caught`}
                  </span>
                </FieldHead>
                <Dots data-field='errors' aria-hidden='true'>
                  {errors.map((claim, index) => dot(claim, index + 30, 6))}
                </Dots>
              </Field>
            </Fields>

            <Controls>
              <Views role='group' aria-label='Show the flags of'>
                {researchPanelViews.map(entry => (
                  <MagneticButton
                    key={entry.key}
                    type='button'
                    aria-pressed={entry.key === viewKey}
                    strength={20}
                    textStrength={10}
                    nowrap
                    whileHover={{ scale: 1 }}
                    className={panelPill}
                    onClick={() => setViewKey(entry.key)}
                  >
                    {entry.label}
                  </MagneticButton>
                ))}
              </Views>
              <Caption aria-live='polite'>
                <p>{view.text}</p>
                <p>
                  {isGold
                    ? `${errors.filter(claim => claim.gold === 'y').length} partly supported · ${errors.filter(claim => claim.gold === 'r').length} unsupported`
                    : `${stats.falseAlarms} false alarms · precision ${stats.precision} · recall ${stats.recall}`}
                </p>
              </Caption>
              <Legend aria-hidden='true'>
                <li>
                  <i data-gold='g' />
                  Supported
                </li>
                <li>
                  <i data-gold='y' />
                  Partly supported
                </li>
                <li>
                  <i data-gold='r' />
                  Unsupported
                </li>
                <li>
                  <i data-ring />
                  Flagged by the chosen view
                </li>
              </Legend>
            </Controls>

            {tipClaim ? (
              <Tip
                aria-hidden='true'
                data-below={tip.below || undefined}
                style={{
                  left: tip.x,
                  top: tip.below ? tip.y + tip.height : tip.y,
                }}
              >
                <p data-meta>
                  {QUESTION_TYPES[tipClaim.type]}
                  {tipClaim.meta ? ' · meta-claim' : null}
                </p>
                <p data-claim>{tipClaim.text}</p>
                <dl>
                  <dt>Gold label</dt>
                  <dd>
                    <Chip data-label={tipClaim.gold} />
                    {GOLD_NAMES[tipClaim.gold]}
                  </dd>
                  {DETECTORS.map(detector => (
                    <div key={detector} className='contents'>
                      <dt>{DETECTOR_NAMES[detector]}</dt>
                      <dd>
                        <Chip data-label={verdict(tipClaim, detector)} />
                        {VERDICTS[verdict(tipClaim, detector)]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Tip>
            ) : null}
          </Panel>
        </div>
      </HeroContainer>
    </PanelSection>
  );
}
