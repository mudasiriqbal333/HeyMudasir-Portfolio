'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { preload } from 'react-dom';

import {
  ArrowIcon,
  ContainerMedium,
  Lockup,
  MagneticButton,
  Row,
  Stripe,
} from '@/components';
import { useMediaQuery, useOnceInReveal, useSpeedParallax } from '@/hooks';
import { toCaseDescription } from '@/utils';

import { CaseBlocks } from './blocks';
import { CaseDescription } from './description';
import { CaseFooter } from './footer';
import {
  Header,
  Hero,
  HeroContainer,
  HeroFigure,
  HeroImage,
  HeroLogo,
  Intro,
  IntroCol,
  LiveButton,
  Page,
  Title,
  TitleTagline,
} from './index.styled';
import { roundButton } from '../contact/classes';

/**
 * Project (case) page: title, intro row, hero with the live-site button,
 * the media blocks and the case footer.
 * @param {{data: object, next: object}} props
 */
export function Case({ data, next }) {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const pageRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const heroRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLImageElement | null>} */
  const heroImageRef = useRef(null);
  //? The hero box follows the picture's own shape once it is known, so a
  //? screenshot is shown whole instead of being cropped to a fixed banner.
  const [heroRatio, setHeroRatio] = useState(null);
  const readHeroRatio = useCallback(element => {
    if (!element?.naturalWidth || !element.naturalHeight) return;
    setHeroRatio(
      Math.round((element.naturalWidth / element.naturalHeight) * 1000) / 1000,
    );
  }, []);
  //? A picture's size is in the first bytes of its file, long before the
  //? whole picture has arrived. So the shape is read as soon as the browser
  //? knows it, looking on every frame until then, not only once the picture
  //? has loaded: the box has its final shape while the preloader still covers
  //? the page, also on a slow line where the picture is still on its way when
  //? the page is shown. Otherwise the box would change shape in full view.
  //? The looking ends when the shape is known, or when the picture has
  //? finished or failed.
  useEffect(() => {
    if (heroRatio) return undefined;
    let frame = requestAnimationFrame(function look() {
      const element = heroImageRef.current;
      if (!element) return;
      if (element.naturalWidth) readHeroRatio(element);
      else if (!element.complete) frame = requestAnimationFrame(look);
    });

    return () => cancelAnimationFrame(frame);
  }, [heroRatio, readHeroRatio]);
  //? The hero is the largest picture on the first screen, so it is asked for
  //? ahead of everything else. The hint cannot go on the image itself:
  //? HeroImage is a motion.img, and framer-motion leaves `fetchPriority` out
  //? of the HTML the server sends. React turns this call into one
  //? <link rel="preload" fetchpriority="high"> at the top of <head>, and the
  //? image below then adds no second preload for the same file. A placeholder
  //? hero is drawn inline (data:), so there is nothing to fetch.
  if (!data.hero.image.startsWith('data:')) {
    preload(data.hero.image, { as: 'image', fetchPriority: 'high' });
  }

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  //? The reference only runs parallax on desktop smooth scroll.
  const parallax = useMediaQuery('(min-width: 1024px)') && !reduceMotion;

  useOnceInReveal(pageRef);

  //? Hero image at speed -1 within its 120% box; the button at speed 2 from
  //? the page top, i.e. it rises by 20% of the scrolled distance.
  const { scrollY } = useScroll();
  const heroY = useSpeedParallax(heroRef, 0.1);
  const buttonY = useTransform(scrollY, value => value * -0.2);

  //? With a description under it the hero keeps half the usual space below,
  //? so the picture and its explanation read as one unit.
  const hasDescription = !toCaseDescription(data.description).isEmpty;

  const lastBlock = data.blocks[data.blocks.length - 1];
  const lipColor = lastBlock?.background ?? data.background;

  return (
    <div style={{ '--footer-lip': lipColor }}>
      <Page ref={pageRef}>
        <Header>
          <ContainerMedium data-once-in>
            {data.tagline ? (
              <Lockup>
                <Title>{data.title}</Title>
                <TitleTagline data-case-tagline>{data.tagline}</TitleTagline>
              </Lockup>
            ) : (
              <Title>{data.title}</Title>
            )}
          </ContainerMedium>
        </Header>

        <Intro data-once-in>
          <ContainerMedium>
            <Row>
              <IntroCol>
                <h2>Role / Services</h2>
                <Stripe />
                <p>{data.services}</p>
              </IntroCol>
              <IntroCol>
                <h2>Credits</h2>
                <Stripe />
                <p>{data.credits}</p>
              </IntroCol>
              <IntroCol data-inline='true'>
                <h2>Location &amp; year</h2>
                <Stripe />
                <p>{data.location} ©</p>
                <p>{data.year}</p>
              </IntroCol>
            </Row>
          </ContainerMedium>
        </Intro>

        <Hero data-once-in $tight={hasDescription}>
          <HeroContainer>
            <Row>
              <div className='relative w-full'>
                {/* Only projects with a public URL get the button */}
                {data.liveUrl ? (
                  <LiveButton>
                    <motion.div style={parallax ? { y: buttonY } : undefined}>
                      <MagneticButton
                        href={data.liveUrl}
                        target='_blank'
                        rel='noopener'
                        variant='primary'
                        strength={100}
                        whileHover={{ scale: 1 }}
                        className={roundButton}
                      >
                        Live site
                        <span className='sr-only'> (opens in a new tab)</span>
                        <ArrowIcon
                          direction='down-right'
                          className='ml-[0.33em] inline-block w-[0.66em] -rotate-90'
                        />
                      </MagneticButton>
                    </motion.div>
                  </LiveButton>
                ) : null}
                <HeroFigure ref={heroRef} $ratio={heroRatio}>
                  <HeroImage
                    ref={element => {
                      heroImageRef.current = element;
                      readHeroRatio(element);
                    }}
                    src={data.hero.image}
                    alt={data.hero.alt}
                    onLoad={event => readHeroRatio(event.currentTarget)}
                    $fitted={Boolean(heroRatio)}
                    style={parallax && !heroRatio ? { y: heroY } : undefined}
                  />
                  {data.hero.logo ? (
                    <HeroLogo src={data.hero.logo} alt='' />
                  ) : null}
                </HeroFigure>
              </div>
            </Row>
          </HeroContainer>
        </Hero>

        <CaseDescription description={data.description} />

        <CaseBlocks
          blocks={data.blocks}
          background={data.background}
          frame={data.deviceFrame}
          parallax={parallax}
        />
      </Page>

      <CaseFooter next={next} />
    </div>
  );
}
