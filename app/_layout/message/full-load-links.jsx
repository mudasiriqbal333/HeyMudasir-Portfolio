'use client';

import { useEffect } from 'react';

import { isInAppClick } from './in-app-click';

/**
 * While this is on a page, a click on any link to a page of this site loads
 * that page in full instead of moving inside the running app. It listens on
 * the whole document, so the top bar and the slide-in menu are covered too.
 *
 * The 404 page needs it. Next 14.0.4 files the 404 page under the same key as
 * the home page in its router, so once Home had been opened inside the app,
 * the browser's Back button showed Home at the dead address (measured). With
 * a full load the 404 page never enters the app's history, and Back asks the
 * server for the dead address again. Test again after a Next upgrade: this
 * may then no longer be needed there.
 *
 * The error page uses it because the running app may be what failed: a full
 * load starts it again.
 */
export function FullLoadLinks() {
  useEffect(() => {
    /** @param {MouseEvent} event */
    const onClick = event => {
      const link =
        event.target instanceof Element
          ? event.target.closest('a[href]')
          : null;
      if (
        !(link instanceof HTMLAnchorElement) ||
        !isInAppClick(event, link, window.location.origin)
      ) {
        return;
      }

      //? next/link leaves a click alone once its default action is prevented
      event.preventDefault();
      window.location.assign(link.href);
    };

    //? Capture phase, so this runs before React hands the click to next/link
    document.addEventListener('click', onClick, true);

    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
