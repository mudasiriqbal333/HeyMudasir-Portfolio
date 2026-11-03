'use client';

import { Container, MagneticButton } from '@/components';
import { workFilters } from '@/data';

import { filterPill, viewButton } from './classes';
import { Count, FilterRow, Filters, GridRow, ToggleRow } from './index.styled';
import { usePillMotion } from './use-pill-motion';

const views = [
  {
    key: 'rows',
    label: 'Show as rows',
    icon: (
      <svg width='20' height='19' viewBox='0 0 20 19' aria-hidden='true'>
        <g fill='currentColor' fillRule='evenodd'>
          <path d='M0 6h20v1H0zM0 0h20v1H0zM0 12h20v1H0zM0 18h20v1H0z' />
        </g>
      </svg>
    ),
  },
  {
    key: 'columns',
    label: 'Show as columns',
    icon: (
      <svg width='20' height='20' viewBox='0 0 20 20' aria-hidden='true'>
        <g fill='currentColor' fillRule='nonzero'>
          <path d='M8 0H0v8h8V0zM7 1v6H1V1h6zM8 12H0v8h8v-8zm-1 1v6H1v-6h6zM20 0h-8v8h8V0zm-1 1v6h-6V1h6zM20 12h-8v8h8v-8zm-1 1v6h-6v-6h6z' />
        </g>
      </svg>
    ),
  },
];

/**
 * Reference section.work-filters: the All / Development / Consultancy pills
 * (the reference's Design pill is Consultancy here) with
 * their counts and, on desktop, the rows / columns view buttons. Every one
 * is a real button that reports its pressed state.
 * @param {Object} props
 * @param {string} props.filter key of the pressed filter
 * @param {Record<string, number>} props.counts entries per filter key
 * @param {(key: string) => void} props.onFilter
 * @param {'rows' | 'columns'} props.view
 * @param {(view: 'rows' | 'columns') => void} props.onView
 */
export function WorkFilters({ filter, counts, onFilter, view, onView }) {
  const bindFilter = usePillMotion(filter);
  const bindView = usePillMotion(view);

  return (
    <Filters data-work-filters>
      <Container data-once-in>
        <FilterRow>
          <ToggleRow>
            {workFilters.map(({ key, label }) => (
              <MagneticButton
                key={key}
                type='button'
                data-filter={key}
                aria-pressed={filter === key}
                strength={25}
                textStrength={15}
                nowrap
                whileHover={{ scale: 1 }}
                className={filterPill}
                onClick={() => onFilter(key)}
                {...bindFilter(key)}
              >
                {label}
                {key !== 'all' && counts[key] ? (
                  <Count data-count>{counts[key]}</Count>
                ) : null}
              </MagneticButton>
            ))}
          </ToggleRow>

          <GridRow>
            {views.map(({ key, label, icon }) => (
              <MagneticButton
                key={key}
                type='button'
                data-view={key}
                aria-pressed={view === key}
                aria-label={label}
                strength={25}
                textStrength={15}
                whileHover={{ scale: 1 }}
                className={viewButton}
                onClick={() => onView(key)}
                {...bindView(key)}
              >
                {icon}
              </MagneticButton>
            ))}
          </GridRow>
        </FilterRow>
      </Container>
    </Filters>
  );
}
