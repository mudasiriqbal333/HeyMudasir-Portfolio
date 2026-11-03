'use client';

import { useCallback, useId, useState } from 'react';

import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

import { Container, Stripe } from '@/components';
import { aboutOptions } from '@/data';

import {
  Details,
  DetailsText,
  List,
  ListLabels,
  ListSection,
  LogoTile,
  Projects,
  RowButton,
  RowHeading,
  ServicesHeading,
  ServicesHeadingRow,
  Toggle,
} from './index.styled';
import { useRowPreview } from './preview';

const { experience } = aboutOptions;

//? One preview picture per row, in row order: the company's logo
const slides = experience.items.map(({ company, logo, background }) => ({
  key: company,
  image: logo,
  background,
  kind: 'logo',
}));

//? A row opens to its full height and closes to nothing; once closed its
//? links leave the tab order and the accessibility tree.
const panel = {
  open: { height: 'auto', visibility: 'visible' },
  closed: { height: 0, transitionEnd: { visibility: 'hidden' } },
};
const panelTransition = { duration: 0.7, ease: [0.7, 0, 0.3, 1] };

/**
 * One company: a row in the Work list's style that opens on a click to show
 * the logo, what was done there and the case pages of what was built.
 * @param {{ item: (typeof experience.items)[number]; open: boolean; onToggle: () => void; rowProps: object }} props
 */
function ExperienceRow({ item, open, onToggle, rowProps }) {
  const panelId = useId();
  const { company, role, location, years, logo, background } = item;

  return (
    <li>
      <Stripe />
      <RowHeading>
        <RowButton
          type='button'
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          {...rowProps}
        >
          <span data-col='1'>
            <span data-title>{company}</span>
          </span>
          <span data-col='2'>{role}</span>
          <span data-col='3' data-wide-only>
            {location}
          </span>
          <span data-col='4'>{years}</span>
          <Toggle aria-hidden='true' />
        </RowButton>
      </RowHeading>

      {/* The page's scroll effects measured the page at its old height, so
          they measure again once a row has opened or closed */}
      <motion.div
        id={panelId}
        initial={false}
        animate={open ? 'open' : 'closed'}
        variants={panel}
        transition={panelTransition}
        style={{ overflow: 'hidden' }}
        onAnimationComplete={() => ScrollTrigger.refresh()}
      >
        <Details>
          {/* The logo's column, inset as the company name above it */}
          <div>
            {logo ? (
              <LogoTile style={{ '--logo-background': background }}>
                <Image
                  src={logo}
                  alt={`${company} logo`}
                  fill
                  sizes='14em'
                  unoptimized={logo.endsWith('.svg')}
                />
              </LogoTile>
            ) : null}
          </div>
          <DetailsText>
            <ul>
              {item.points.map(point => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {item.projects.length ? (
              <Projects>
                <span>Projects</span>
                {item.projects.map(project => (
                  <Link key={project.href} href={project.href}>
                    {project.title}
                  </Link>
                ))}
              </Projects>
            ) : null}
          </DetailsText>
        </Details>
      </motion.div>
    </li>
  );
}

/** Where the owner has worked, newest first, one row per company. */
export function AboutExperience() {
  const [open, setOpen] = useState(() => new Set());
  const { index, rowProps, followers } = useRowPreview(slides, 'square');

  const toggle = useCallback(
    row =>
      setOpen(current => {
        const next = new Set(current);
        if (next.has(row)) next.delete(row);
        else next.add(row);

        return next;
      }),
    [],
  );

  return (
    <ListSection data-experience data-list='experience'>
      <Container>
        <ServicesHeadingRow>
          <div className='w-full'>
            <ServicesHeading>{experience.heading}</ServicesHeading>
          </div>
        </ServicesHeadingRow>

        <ListLabels aria-hidden='true'>
          {experience.labels.map((label, column) => (
            <span
              key={label}
              data-col={column + 1}
              data-wide-only={column === 2 || undefined}
            >
              {label}
            </span>
          ))}
        </ListLabels>

        <List>
          {experience.items.map((item, row) => (
            <ExperienceRow
              key={item.company}
              item={item}
              open={open.has(row)}
              onToggle={() => toggle(row)}
              rowProps={rowProps(row)}
            />
          ))}
          <li aria-hidden='true'>
            <Stripe />
          </li>
        </List>
      </Container>

      {followers(open.has(index) ? 'Close' : 'Open')}
    </ListSection>
  );
}
