'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/data';
import { cn } from '@/utils';

import { scale, slideOut } from './variants';
import classes from '../index.module.css';

/**
 * @param {Object} props
 * @param {() => void} props.onNavigate Called when a page link is chosen.
 */
export function OffcanvasLinks({ onNavigate }) {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname);

  //? Any link closes the menu, the current page's too (its path does not
  //? change, so nothing else would). A modified click opens the page in
  //? another tab or window and leaves this one, and its menu, alone.
  /** @type {import('react').MouseEventHandler<HTMLAnchorElement>} */
  const handleClick = event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    onNavigate();
  };

  const items = navItems.map(({ href, title }, index) => {
    const id = index;
    return (
      <motion.li
        key={id}
        className={cn('relative my-4 flex items-center', classes.item)}
        variants={slideOut}
        custom={id}
        initial='initial'
        animate='enter'
        exit='exit'
        onPointerEnter={() => setActiveLink(href)}
      >
        <motion.div
          className={cn('absolute -left-11', classes.dot)}
          variants={scale}
          animate={activeLink === href ? 'open' : 'closed'}
        >
          <Dot size={36} />
        </motion.div>
        <Link
          href={href}
          className={cn('text-6xl capitalize', classes.link)}
          onClick={handleClick}
        >
          {title}
        </Link>
      </motion.li>
    );
  });

  return (
    <div className={cn('mt-20 flex flex-col gap-3', classes.nav)}>
      <div className={cn('mb-10 border-b border-solid', classes.heading)}>
        <h5
          className={cn(
            'text-xs uppercase text-secondary-foreground',
            classes.label,
          )}
        >
          Navigation
        </h5>
      </div>
      <ul
        className={classes.list}
        onPointerLeave={() => setActiveLink(pathname)}
      >
        {items}
      </ul>
    </div>
  );
}
