'use client';

import { useEffect, useRef } from 'react';

import { useMotionValue, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';

import { ArrowIcon } from '@/components';
import { brand, homeOptions } from '@/data';
import { useMediaQuery, useOnceInReveal } from '@/hooks';

import {
  BigName,
  FirstScreen,
  GlobeSpin,
  Hanger,
  HangerBall,
  HangerShape,
  HangerText,
  Hero,
  HeroGlobe,
  NameRoll,
  NameText,
  NameTrack,
  Portrait,
  PortraitWrap,
  RoleArrow,
  RoleCol,
  RoleContainer,
  RoleHeading,
  RoleRow,
} from './index.styled';

//? One full roll of the name takes this long, in seconds.
const ROLL_DURATION = 18;

/** Natural (untransformed) vertical centre of an element in the document. */
function documentMiddle(element) {
  let top = 0;
  for (let node = element; node; node = node.offsetParent) {
    top += node.offsetTop;
  }
  return top + element.offsetHeight / 2;
}

/**
 * The name rolls left without end and turns round whenever the visitor
 * changes scroll direction, as on the reference. Two copies sit side by side
 * and each slides by its own width, so the loop has no seam.
 */
function useNameRoll(rollRef) {
  useEffect(() => {
    const roll = rollRef.current;
    if (!roll) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const copies = roll.querySelectorAll('[data-name-copy]');
    const timeline = gsap.timeline({
      repeat: -1,
      onReverseComplete() {
        //? Played backwards past the start: jump ahead so it never stops.
        this.totalTime(this.rawTime() + this.duration() * 10);
      },
    });
    timeline.to(copies, {
      xPercent: -100,
      duration: ROLL_DURATION,
      ease: 'none',
    });

    let direction = 1;
    let last = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      const next = current > last ? 1 : current < last ? -1 : direction;
      last = current;
      if (next !== direction) {
        direction = next;
        gsap.to(timeline, { timeScale: direction, overwrite: true });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      timeline.kill();
      gsap.set(copies, { clearProps: 'transform' });
    };
  }, [rollRef]);
}

export function Header() {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const heroRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const rollRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const arrowRef = useRef(null);
  const arrowMiddle = useRef(0);

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  //? The reference only moves these with its smooth scroll: desktop, mouse.
  const parallax =
    useMediaQuery('(min-width: 1024px) and (hover: hover)') && !reduceMotion;
  const turnGlobe = useMediaQuery('(min-width: 721px)') && !reduceMotion;

  useOnceInReveal(heroRef);
  useNameRoll(rollRef);

  const { scrollY } = useScroll();
  //? Window height, filled in on the client (there is no window on the server).
  const viewport = useRef(1);
  const arrowY = useMotionValue(0);

  //? Arrow lags gently around the middle of the screen (reference speed 1).
  //? Its offset depends on where it sits, so it is measured, then kept in
  //? step with the scroll.
  useEffect(() => {
    const update = () => {
      arrowY.set(
        parallax
          ? (window.scrollY + viewport.current / 2 - arrowMiddle.current) * 0.2
          : 0,
      );
    };
    const measure = () => {
      viewport.current = window.innerHeight;
      if (arrowRef.current) {
        arrowMiddle.current = documentMiddle(arrowRef.current);
      }
      update();
    };
    measure();
    const stop = scrollY.on('change', update);
    window.addEventListener('resize', measure);
    return () => {
      stop();
      window.removeEventListener('resize', measure);
    };
  }, [arrowY, parallax, scrollY]);

  //? Portrait trails the page (reference speed -3, from the top).
  const portraitY = useTransform(scrollY, value => value * 0.3);
  //? Name drifts left as the page scrolls (reference horizontal speed 4).
  const nameX = useTransform(scrollY, value => value * -0.4);
  //? Globe turns a quarter over the first screen of scrolling.
  const globeRotate = useTransform(
    scrollY,
    value => Math.min(Math.max(value / viewport.current, 0), 1) * 90,
  );

  const name = `${brand.firstName} ${brand.lastName}`;
  const { portrait, location, roles } = homeOptions;

  return (
    <Hero ref={heroRef}>
      <PortraitWrap data-once-in>
        <Portrait style={parallax ? { y: portraitY } : undefined}>
          {/* The largest picture on the first screen, so it is fetched
              ahead of everything else on the page */}
          <img src={portrait.src} alt={portrait.alt} fetchPriority='high' />
        </Portrait>
      </PortraitWrap>

      <FirstScreen data-once-in>
        <Hanger>
          <HangerShape viewBox='0 0 300 121' aria-hidden='true'>
            {/* A tab running in from the left edge, rounded at its end, with
                a round window cut out for the globe */}
            <path
              fillRule='evenodd'
              d='M0 0.5H240a60 60 0 0 1 0 120H0Z M240 19.5a41 41 0 1 0 0 82a41 41 0 1 0 0-82Z'
            />
          </HangerShape>
          <HangerText>
            {location.map(line => (
              <span key={line}>{line} </span>
            ))}
          </HangerText>
          <HangerBall>
            <GlobeSpin style={turnGlobe ? { rotate: globeRotate } : undefined}>
              <HeroGlobe />
            </GlobeSpin>
          </HangerBall>
        </Hanger>
      </FirstScreen>

      <RoleContainer data-once-in>
        <RoleRow>
          <RoleCol>
            <RoleArrow
              ref={arrowRef}
              style={parallax ? { y: arrowY } : undefined}
            >
              <ArrowIcon direction='down-right' />
            </RoleArrow>
            <RoleHeading>
              {roles.map(line => (
                <span key={line}>{line}</span>
              ))}
            </RoleHeading>
          </RoleCol>
        </RoleRow>
      </RoleContainer>

      <BigName data-once-in>
        <NameTrack style={parallax ? { x: nameX } : undefined}>
          <NameRoll ref={rollRef}>
            <NameText data-name-copy>
              {name}
              <span className='spacer'>—</span>
            </NameText>
            <NameText as='div' data-name-copy aria-hidden='true'>
              {name}
              <span className='spacer'>—</span>
            </NameText>
          </NameRoll>
        </NameTrack>
      </BigName>
    </Hero>
  );
}
