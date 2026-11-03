'use client';

import { Fragment } from 'react';

import { ContainerMedium, Row, Stripe } from '@/components';
import { useTypewriter } from '@/hooks';
import { toCaseDescription } from '@/utils';

import {
  Description,
  DescriptionAside,
  DescriptionCol,
  Lead,
  TypedProperties,
} from './index.styled';

/**
 * What the project actually is, in the owner's own words: the lead typed in
 * the first time the block is scrolled into view, the paragraphs under it and
 * the list of what was built rising in beneath the tail of it.
 *
 * Every word is in the DOM from the first render, spaces and all, so the copy
 * is one plain string to a screen reader, to find-in-page and to anyone
 * copying it, however far the animation has got. Nothing that moves affects
 * layout, so the block is its final size before the first frame.
 *
 * A project with no description yet renders nothing at all -- no heading, no
 * stripe, no gap.
 *
 * @param {{description?: import('@/data').CaseDescription | string[] | string}} props
 */
export function CaseDescription({ description }) {
  const copy = toCaseDescription(description);
  const typedRef = useTypewriter(copy.lead.words.length);

  if (copy.isEmpty) return null;

  return (
    <>
      <TypedProperties />
      <Description ref={typedRef} data-case-description>
        <ContainerMedium>
          <Row>
            {copy.lead.text || copy.body.length ? (
              <DescriptionCol>
                <h2>{copy.label}</h2>
                <Stripe />
                {copy.lead.text ? (
                  <Lead>
                    {copy.lead.words.length
                      ? copy.lead.words.map(({ word, index }) => (
                          <Fragment key={index}>
                            {index ? ' ' : null}
                            <span style={{ '--j': index }}>
                              <span>{word}</span>
                            </span>
                          </Fragment>
                        ))
                      : copy.lead.text}
                  </Lead>
                ) : null}
                {copy.body.map(({ text, start }) => (
                  <p key={text} data-reveal style={{ '--start': start }}>
                    {text}
                  </p>
                ))}
              </DescriptionCol>
            ) : null}

            {copy.built.length ? (
              <DescriptionAside>
                <h2>{copy.builtLabel}</h2>
                <Stripe />
                <ul>
                  {copy.built.map(({ text, start }) => (
                    <li key={text} data-reveal style={{ '--start': start }}>
                      {text}
                    </li>
                  ))}
                </ul>
              </DescriptionAside>
            ) : null}
          </Row>
        </ContainerMedium>
      </Description>
    </>
  );
}
