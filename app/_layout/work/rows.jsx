'use client';

import { Container, Stripe, TitleWithTagline } from '@/components';

import {
  Cell,
  Labels,
  RowLink,
  Rows,
  RowsSection,
  WorkRow,
} from './index.styled';

const labels = ['Client', 'Location', 'Services', 'Year'];

/**
 * Reference section.work-grid.small-work-grid: the desktop rows, one per
 * case, under CLIENT / LOCATION / SERVICES / YEAR. Every case is rendered;
 * the ones the filter drops fold away rather than leave, so filtering can
 * animate, while the ones that stay never fade (only the tiles do). A mouse
 * over a row shows the preview image and the "View" disc, and slides the
 * preview to that row's thumbnail from the row's own handler.
 * @param {Object} props
 * @param {typeof import('@/data').workOptions} props.items
 * @param {Set<string>} props.visible hrefs the current filter keeps
 * @param {boolean} props.open whether this is the chosen view
 * @param {'out' | 'in' | null} props.viewFade view-swap fade of the section
 * @param {ReturnType<typeof import('@/hooks').useFollowPointer>['bind']} props.bind
 * @param {(index: number) => void} props.onEnter a mouse has entered the row
 */
export function WorkRows({ items, visible, open, viewFade, bind, onEnter }) {
  return (
    <RowsSection
      data-work-list
      data-visible={open}
      data-fade={viewFade ?? undefined}
    >
      <Container>
        <Labels data-column-labels>
          {labels.map((label, index) => (
            <Cell key={label} data-col={index + 1}>
              <h5>{label}</h5>
            </Cell>
          ))}
        </Labels>

        <Rows>
          {items.map(
            ({ href, title, tagline, location, services, year }, index) => {
              const shown = visible.has(href);
              const pointer = bind(index);

              return (
                <WorkRow
                  key={href}
                  data-visible={shown}
                  aria-hidden={shown ? undefined : true}
                >
                  <Stripe />
                  <RowLink
                    href={href}
                    data-row
                    tabIndex={shown ? undefined : -1}
                    {...pointer}
                    onPointerEnter={event => {
                      pointer.onPointerEnter(event);
                      if (event.pointerType === 'mouse') onEnter(index);
                    }}
                  >
                    <Cell data-col='1'>
                      <TitleWithTagline tagline={tagline} data-row-tagline>
                        <h4 data-row-title>
                          <span>{title}</span>
                        </h4>
                      </TitleWithTagline>
                    </Cell>
                    <Cell data-col='2'>
                      <p data-row-location>{location}</p>
                    </Cell>
                    <Cell data-col='3'>
                      <p data-row-services>{services}</p>
                    </Cell>
                    <Cell data-col='4'>
                      <p data-row-year>{year}</p>
                    </Cell>
                  </RowLink>
                </WorkRow>
              );
            },
          )}
        </Rows>
      </Container>
    </RowsSection>
  );
}
