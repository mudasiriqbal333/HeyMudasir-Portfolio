//? The reference's GSAP eases: power3.out (quartic) and expo.out
const power3Out = t => 1 - (1 - t) ** 4;
const expoOut = t => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Reference .span-lines: each word rises from a line height below over 1s,
 * 0.01s after the one before it, and snaps back on reset.
 * @type {import('framer-motion').Variants}
 */
export const wordReveal = {
  hidden: { y: '100%', transition: { duration: 0 } },
  shown: index => ({
    y: '0%',
    transition: { duration: 1, ease: power3Out, delay: index * 0.01 },
  }),
};

/**
 * Reference .fade-in: rises 2em while fading in over 1.75s, and snaps back
 * on reset.
 * @type {import('framer-motion').Variants}
 */
export const fadeIn = {
  hidden: { y: '2em', opacity: 0, transition: { duration: 0 } },
  shown: {
    y: '0em',
    opacity: 1,
    transition: { duration: 1.75, ease: expoOut },
  },
};
