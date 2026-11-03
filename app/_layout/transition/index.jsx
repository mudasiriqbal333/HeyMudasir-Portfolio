'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { PRELOADER_DURATION } from '@/config/preloader.config';
import { useLenis, useTimeOut } from '@/hooks';

import { Preloader } from './preloader';

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.word] What the preloader shows instead of the word it
 *   makes from the address. For a page whose address says nothing useful,
 *   such as the 404 page ("Error").
 */
export function Transition({ children, word }) {
  const [isLoading, setLoading] = useState(true);
  const pathname = usePathname();

  useLenis();
  useTimeOut({
    callback: () => {
      setLoading(false);
      window.scrollTo(0, 0);
    },
    duration: PRELOADER_DURATION,
    deps: [],
  });

  return (
    <div key={pathname} className='overflow-hidden'>
      <AnimatePresence mode='wait'>
        {isLoading ? <Preloader word={word} /> : null}
      </AnimatePresence>
      {children}
    </div>
  );
}
