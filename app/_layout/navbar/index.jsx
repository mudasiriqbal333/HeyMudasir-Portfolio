'use client';

import { useRef } from 'react';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { brand, cvFile, navItems } from '@/data';
import { useMagnetic } from '@/hooks';
import { useOffcanvas } from '@/providers';

import { Bar, Brand, Links, MenuButton, NavLink } from './index.styled';

/**
 * A page link, or with `file` the CV, which opens in a new tab and is never
 * the current page.
 * @param {{href: string, title: string, active?: boolean, file?: boolean}} props
 */
function MagneticNavLink({ href, title, active = false, file = false }) {
  /** @type {import('react').MutableRefObject<HTMLAnchorElement>} */
  const ref = useRef(null);
  const {
    position: { x, y },
    textPosition,
    transition,
    handleMagneticMove,
    handleMagneticOut,
  } = useMagnetic(ref, 20);

  return (
    <NavLink
      ref={ref}
      href={href}
      data-active={active}
      aria-current={active ? 'page' : undefined}
      {...(file ? { target: '_blank', rel: 'noopener', prefetch: false } : {})}
      animate={{ x, y }}
      transition={transition}
      onPointerMove={handleMagneticMove}
      onPointerOut={handleMagneticOut}
    >
      <motion.span
        className='capitalize'
        animate={textPosition}
        transition={transition}
      >
        {title}
      </motion.span>
      {file ? (
        <span className='sr-only'> (PDF, opens in a new tab)</span>
      ) : null}
    </NavLink>
  );
}

function MagneticBrand() {
  /** @type {import('react').MutableRefObject<HTMLAnchorElement>} */
  const ref = useRef(null);
  const {
    position: { x, y },
    transition,
    handleMagneticMove,
    handleMagneticOut,
  } = useMagnetic(ref, 20);

  return (
    <Brand
      ref={ref}
      href={brand.href}
      animate={{ x, y }}
      transition={transition}
      onPointerMove={handleMagneticMove}
      onPointerOut={handleMagneticOut}
    >
      <span className='credit'>
        <span>©</span>
      </span>
      <span className='cbd'>
        <span className='code-by'>Code by</span>
        <span className='name'>
          {brand.firstName}
          <span className='last-name'>{brand.lastName}</span>
        </span>
      </span>
    </Brand>
  );
}

/**
 * Top bar. `theme` picks the text colour: 'light' (white, for dark heroes)
 * or 'dark'.
 * @param {{theme?: 'light' | 'dark'}} props
 */
export function Navbar({ theme = 'light' }) {
  const pathname = usePathname();
  const { isOpen, toggle } = useOffcanvas();

  const links = navItems.slice(1).map(({ href, title }) => (
    <li key={href}>
      <MagneticNavLink
        href={href}
        title={title}
        active={pathname === href || pathname.startsWith(`${href}/`)}
      />
    </li>
  ));

  return (
    <Bar $theme={theme} aria-label='Primary'>
      <MagneticBrand />

      <Links>
        {links}
        <li>
          <MagneticNavLink href={cvFile.href} title={cvFile.short} file />
        </li>
        <li>
          <MenuButton
            type='button'
            aria-expanded={isOpen}
            aria-controls='offcanvas-menu'
            onClick={toggle}
          >
            Menu
          </MenuButton>
        </li>
      </Links>
    </Bar>
  );
}
