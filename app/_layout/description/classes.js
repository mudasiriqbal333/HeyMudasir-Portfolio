//? Tailwind classes that turn MagneticButton into the reference's dark round
//? button (.btn-round on a light section): a clamp(9em, 12vw, 11em) circle in
//? --color-dark with white 1em text, whose blue fill, a 150% x 200% ellipse,
//? rises from below over 600ms on hover. `flex` keeps the link block-level so
//? its wrapper has no inline gap underneath.
const fill =
  'before:left-[-25%] before:top-[-50%] before:h-[200%] before:w-[150%] before:pb-0 before:rounded-[50%] before:scale-100 before:translate-y-[76%] before:transition-transform before:duration-[600ms] before:ease-in-out hover:before:translate-y-0 hover:before:scale-100 hover:before:duration-[600ms] hover:before:ease-in-out after:duration-[600ms] after:ease-in-out hover:after:delay-[600ms]';

export const roundButton = `flex h-[clamp(9em,12vw,11em)] w-[clamp(9em,12vw,11em)] p-0 text-[1em] font-normal bg-[var(--color-dark)] text-white before:bg-[var(--color-blue)] after:bg-[var(--color-blue)] ${fill}`;
