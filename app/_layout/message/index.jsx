'use client';

import { Fragment, useRef } from 'react';

import { ContainerMedium, MagneticButton } from '@/components';
import { useOnceInReveal } from '@/hooks';

import {
  ButtonFixed,
  ButtonRow,
  Col,
  Footer,
  Main,
  Page,
  PillRow,
  Rule,
  Text,
  Title,
} from './index.styled';
import { FooterBottom } from '../contact/bottom';
import { pill, roundButton } from '../contact/classes';

export { FullLoadLinks } from './full-load-links';

/**
 * One button of a message page: a link when `href` is given, otherwise a
 * button that calls `onClick`.
 * @typedef {Object} MessageAction
 * @property {string} label
 * @property {string} [href]
 * @property {import('react').MouseEventHandler<HTMLElement>} [onClick]
 */

//? The reference "once-in" rise is timed to start as the preloader leaves, so
//? it runs only on a page shown behind the preloader. A component of its own,
//? because a hook cannot be switched off.
/** @param {{scope: import('react').MutableRefObject<HTMLElement>}} props */
function Reveal({ scope }) {
  useOnceInReveal(scope);

  return null;
}

/**
 * @param {Object} props
 * @param {MessageAction} props.action
 * @param {boolean} [props.round] The round blue button instead of the pill
 */
function ActionButton({ action, round = false }) {
  const { label, href, onClick } = action;

  return (
    <MagneticButton
      href={href}
      type={href ? undefined : 'button'}
      variant={round ? 'primary' : 'outline'}
      strength={round ? 100 : 25}
      nowrap={!round}
      whileHover={{ scale: 1 }}
      className={round ? roundButton : pill}
      onClick={onClick}
    >
      {label}
    </MagneticButton>
  );
}

/**
 * Shared template of the message pages (404, error), laid out like the
 * reference's error page: a dark screen with the heading, one short line, a
 * rule carrying the round button, and the slim footer at the foot of the
 * screen. The page that uses it puts the top bar above it.
 * @param {Object} props
 * @param {string[]} props.title Heading, one entry per line
 * @param {string} [props.paragraph]
 * @param {MessageAction} props.action The round button on the rule
 * @param {MessageAction} [props.secondaryAction] An outlined pill under the rule
 * @param {boolean} [props.reveal] Set on a page wrapped in `Transition`: its parts rise into place as the preloader leaves
 */
export function MessagePage({
  title = [],
  paragraph,
  action,
  secondaryAction,
  reveal = false,
}) {
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const pageRef = useRef(null);

  return (
    <Page ref={pageRef}>
      {reveal ? <Reveal scope={pageRef} /> : null}

      <Main>
        <ContainerMedium>
          <Col>
            <Title data-once-in>
              {/* The space matters from 720px down, where two short lines
                  share one */}
              {title.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 ? ' ' : null}
                  <span>{line}</span>
                </Fragment>
              ))}
            </Title>
            {paragraph ? <Text data-once-in>{paragraph}</Text> : null}
            <Rule data-once-in />
            <ButtonRow data-once-in>
              <ButtonFixed>
                <ActionButton action={action} round />
              </ButtonFixed>
            </ButtonRow>
            {secondaryAction ? (
              <PillRow data-once-in>
                <ActionButton action={secondaryAction} />
              </PillRow>
            ) : null}
          </Col>
        </ContainerMedium>
      </Main>

      <Footer>
        <FooterBottom />
      </Footer>
    </Page>
  );
}
