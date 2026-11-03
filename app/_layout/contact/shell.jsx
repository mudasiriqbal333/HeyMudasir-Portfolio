'use client';

import { useRef } from 'react';

import { useScroll, useTransform } from 'framer-motion';

import { useMediaQuery } from '@/hooks';

import { Inner, Lip, LipShape, LipWrap, Shade, Wrap } from './index.styled';

/**
 * Dark footer shell with the reference motion: the content starts 40% of its
 * own height higher and settles as the page reaches its end, while the curved
 * lip above flattens from 10vh (7.5vh on phones) to 0. Children receive the
 * shared scroll values for the arrow and the round button.
 * @param {{children: (motion: {animate: boolean, isDesktop: boolean, isTabletUp: boolean, arrowRotate: import('framer-motion').MotionValue<number>, buttonX: import('framer-motion').MotionValue<string>, scrollYProgress: import('framer-motion').MotionValue<number>, wrapRef: import('react').MutableRefObject<HTMLDivElement>}) => import('react').ReactNode}} props
 */
export function FooterShell({ children }) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTabletUp = useMediaQuery('(min-width: 721px)');
  const isSmall = useMediaQuery('(max-width: 720px)');

  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end end'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ['-40%', '0%']);
  const lipHeight = useTransform(
    scrollYProgress,
    [0, 1],
    [isSmall ? '7.5vh' : '10vh', '0vh'],
  );
  const arrowRotate = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const buttonX = useTransform(scrollYProgress, [0, 1], ['-50%', '0%']);
  const animate = !reduceMotion;

  return (
    <>
      <Lip aria-hidden='true'>
        <LipWrap style={animate ? { height: lipHeight } : undefined}>
          <LipShape />
        </LipWrap>
      </Lip>

      <Wrap ref={wrapRef} data-footer-wrap>
        <Inner style={animate && isDesktop ? { y: contentY } : undefined}>
          {children({
            animate,
            isDesktop,
            isTabletUp,
            arrowRotate,
            buttonX,
            scrollYProgress,
            wrapRef,
          })}
        </Inner>
        <Shade aria-hidden='true' />
      </Wrap>
    </>
  );
}
