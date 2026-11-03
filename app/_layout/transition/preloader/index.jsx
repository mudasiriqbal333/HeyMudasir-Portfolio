'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Center } from '@/components';
import { caseOptions, navItems, preloaderWords } from '@/data';
import { useDimensions, useTimeOut } from '@/hooks';

import { fade, slideUp } from './variants';

const MotionComponent = motion(Center);

/** @param {{word?: string}} props `word` replaces the word made from the address */
export function Preloader({ word }) {
  const [index, setIndex] = useState(0);
  const { width, height } = useDimensions();
  const pathname = usePathname();
  const [displayWord, setDisplayWord] = useState(preloaderWords[0]);

  useEffect(() => {
    if (word) {
      setDisplayWord(word);
    } else if (pathname === '/') {
      setDisplayWord(preloaderWords[index % preloaderWords.length]);
    } else {
      const pathParts = pathname.split('/');
      const slug = pathParts[pathParts.length - 1];
      //? A case page shows its project title as written ("REHQ"), a page in
      //? the menu its menu title ("/work" -> "Projects"), any other page its
      //? title-cased path ("success" -> "Success").
      const caseTitle = pathname.startsWith('/work/')
        ? caseOptions.find(entry => entry.slug === slug)?.title
        : undefined;
      const menuTitle = navItems.find(({ href }) => href === pathname)?.title;
      setDisplayWord(
        caseTitle ??
          (menuTitle ?? slug)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, letter => letter.toUpperCase()),
      );
    }
  }, [pathname, index, word]);

  useTimeOut({
    callback: () => {
      setIndex(prevIndex => prevIndex + 1);
    },
    duration: pathname === '/' ? (index === 0 ? 600 : 250) : 2000,
    deps: [index, pathname],
  });

  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${
    height + 300
  } 0 ${height}  L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${
    width / 2
  } ${height} 0 ${height}  L0 0`;

  /** @type {import('framer-motion').Variants} */
  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <MotionComponent
      className='fixed z-50 h-screen w-screen cursor-wait bg-foreground'
      variants={slideUp}
      initial='initial'
      exit='exit'
    >
      {width > 0 ? (
        <>
          <MotionComponent
            className='text-3xl text-background md:text-4xl'
            variants={fade}
            initial='initial'
            animate='enter'
          >
            {pathname === '/' && <Dot size={48} className='me-3' />}
            <p>{displayWord}</p>
          </MotionComponent>
          <motion.svg className='absolute top-0 -z-10 h-[calc(100%+300px)] w-full'>
            <motion.path
              className='fill-foreground'
              variants={curve}
              initial='initial'
              exit='exit'
            />
          </motion.svg>
        </>
      ) : null}
    </MotionComponent>
  );
}
