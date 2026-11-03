'use client';

import { useEffect, useRef } from 'react';

/**
 * The window size, measured once after the first render. It is kept in a ref,
 * so measuring does not re-render: the first render sees 0 x 0 and the caller
 * only picks the size up when something else makes it render again. The
 * preloader relies on this as it is today (on Home its first word, "Hello",
 * is skipped for that reason); switching to state would change what the
 * loader shows, so do that together with the loader, not on its own. It does
 * not follow window resizes.
 */
export function useDimensions() {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = window.innerWidth;
    dimensions.current.height = window.innerHeight;
  }, []);

  return dimensions.current;
}
