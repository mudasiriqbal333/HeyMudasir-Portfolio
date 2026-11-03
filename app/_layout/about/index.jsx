'use client';

import { useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useMediaQuery, useOnceInReveal } from '@/hooks';

import { AboutCredentials } from './credentials';
import { AboutCvLine } from './cv-line';
import { AboutExperience } from './experience';
import { AboutFeature } from './feature';
import { AboutHeader } from './header';
import { Page } from './index.styled';
import { AboutIntro } from './intro';
import { AboutServices } from './services';

export function About() {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const pageRef = useRef(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  //? The reference only runs parallax on desktop smooth scroll.
  const parallax = useMediaQuery('(min-width: 1024px)') && !reduceMotion;

  //? Scroll-linked motion, created right after the once-in reveal is
  //? scheduled so the triggers measure the shifted layout like the reference.
  useOnceInReveal(pageRef, () => {
    gsap.registerPlugin(ScrollTrigger);

    // Badge ring: 0 -> -90deg while it crosses the viewport (all sizes)
    gsap.to('[data-badge]', {
      rotate: -90,
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-badge]',
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0,
      },
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 721px)', () => {
      // Intro arrow: -45deg (CSS) -> 60deg while the portrait scrolls through
      gsap.to('[data-intro-arrow]', {
        rotate: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-intro-image]',
          start: '15% 100%',
          end: '100% 0%',
          scrub: 0,
        },
      });

      // The white sections fade to light grey as the experience scrolls in,
      // as the reference's do for its services. The fade is tied to the
      // screen's height, not the list's, which grows as its rows open.
      gsap.fromTo(
        'header, [data-once-in], [data-experience], [data-services]',
        { backgroundColor: '#ffffff' },
        {
          backgroundColor: '#e9eaeb',
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-experience]',
            start: 'top 125%',
            end: 'top 25%',
            scrub: 0,
          },
        },
      );
    });
  });

  return (
    <Page ref={pageRef}>
      <AboutHeader />
      <AboutCvLine />
      <AboutIntro parallax={parallax} />
      <AboutExperience />
      <AboutServices />
      <AboutCredentials />
      <AboutFeature />
    </Page>
  );
}
