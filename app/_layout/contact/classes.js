//? Tailwind class sets that turn MagneticButton into the reference footer
//? controls: the round blue CTA and the outlined pill. The fill is a shape
//? 150% x 200% of the button rising from the bottom over 600ms. Its ends are
//? fully rounded (MagneticButton's own before:rounded-full); the Work pills
//? and the home "About me" button add before:rounded-[50%] for a true
//? ellipse.
const fill =
  'before:left-[-25%] before:top-[-50%] before:h-[200%] before:w-[150%] before:pb-0 before:scale-100 before:translate-y-[76%] before:transition-transform before:duration-[600ms] before:ease-in-out hover:before:translate-y-0 hover:before:scale-100 hover:before:duration-[600ms] hover:before:ease-in-out after:duration-[600ms] after:ease-in-out hover:after:delay-[600ms]';

export const roundButton = `h-[clamp(9em,12vw,11em)] w-[clamp(9em,12vw,11em)] p-0 text-[1em] font-normal bg-[var(--color-blue)] text-white before:bg-[var(--color-blue-dark)] after:bg-[var(--color-blue-dark)] ${fill}`;

export const pill = `h-[4.25em] rounded-[2.125em] border-0 px-[2.5em] text-[1em] font-normal text-white shadow-[inset_0_0_0_1px_var(--color-border-light)] after:-translate-y-[102%] ${fill}`;
