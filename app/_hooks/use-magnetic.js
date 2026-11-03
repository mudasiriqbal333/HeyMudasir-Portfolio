'use client';

import { useCallback, useState } from 'react';

/** Follows the cursor smoothly (reference: Power4.easeOut). */
export const MAGNETIC_SPRING = {
  type: 'spring',
  damping: 15,
  stiffness: 150,
  mass: 0.1,
};

/** Springs back with an elastic wobble (reference: Elastic.easeOut 1.5s). */
export const MAGNETIC_RELEASE = {
  type: 'spring',
  damping: 6,
  stiffness: 120,
  mass: 1,
};

const rest = { x: 0, y: 0 };

/**
 * Magnetic pull, modelled on the reference: the element moves by
 * `(cursor offset within the element - 0.5) * strength` on both axes, and an
 * inner label moves by the same fraction of `textStrength` for a parallax
 * feel. Strengths are in px (reference: 100 for round buttons, 25 for pills,
 * 20 for text links, 50 for the menu toggle).
 * @param {import('react').MutableRefObject<HTMLElement>} element
 * @param {number} [strength]
 * @param {number} [textStrength]
 */
export function useMagnetic(
  element,
  strength = 25,
  textStrength = strength / 2,
) {
  const [position, setPosition] = useState(rest);
  const [textPosition, setTextPosition] = useState(rest);
  const [transition, setTransition] = useState(MAGNETIC_SPRING);

  /** @type {import('react').PointerEventHandler<HTMLElement>} */
  const handleMagneticMove = useCallback(
    event => {
      //? Only the mouse pulls; touch drags must scroll, not nudge the element
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const { clientX, clientY } = event;
      const { width, height, left, top } =
        element.current.getBoundingClientRect();

      const dx = (clientX - left) / width - 0.5;
      const dy = (clientY - top) / height - 0.5;
      setTransition(MAGNETIC_SPRING);
      setPosition({ x: dx * strength, y: dy * strength });
      setTextPosition({ x: dx * textStrength, y: dy * textStrength });
    },
    [element, strength, textStrength],
  );

  const handleMagneticOut = useCallback(() => {
    setTransition(MAGNETIC_RELEASE);
    setPosition(rest);
    setTextPosition(rest);
  }, []);

  return {
    position,
    textPosition,
    transition,
    handleMagneticMove,
    handleMagneticOut,
  };
}
