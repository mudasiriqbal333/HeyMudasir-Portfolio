'use client';

import { MagneticButton } from '@/components';
import { cvFile, socialMedias } from '@/data';
import { cn } from '@/utils';

import classes from '../index.module.css';

export function OffcanvasFooter() {
  //? One link per social: MagneticButton renders the anchor itself when it is
  //? given an address. It used to be a button inside a link, and a button
  //? centres its text, so the anchor is told to as well. The hover growth is
  //? spelled out because this is the one place that wants it.
  const medias = socialMedias.map(({ href, title }) => (
    <li key={href}>
      <MagneticButton
        href={href}
        target='_blank'
        rel='noopener'
        className='text-center'
        whileHover={{ scale: 1.1 }}
      >
        {title}
      </MagneticButton>
    </li>
  ));

  //? The CV sits with the profiles: on a phone the top bar is only the
  //? menu button, so this is where the CV is reached from
  return (
    <ul className={cn('flex w-full justify-between gap-10', classes.socials)}>
      {medias}
      <li>
        <MagneticButton
          href={cvFile.href}
          target='_blank'
          rel='noopener'
          prefetch={false}
          className='text-center'
          whileHover={{ scale: 1.1 }}
        >
          {cvFile.short}
          <span className='sr-only'> (PDF, opens in a new tab)</span>
        </MagneticButton>
      </li>
    </ul>
  );
}
