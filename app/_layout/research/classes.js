//? Tailwind class set that turns MagneticButton into the claims panel's view
//? switch: the footer's outlined pill (a hairline ring on the dark panel),
//? smaller, whose blue fill rises from below on hover as on the footer
//? pills and stays up on the chosen view (aria-pressed).
const fill =
  'before:left-[-25%] before:top-[-50%] before:h-[200%] before:w-[150%] before:rounded-[50%] before:pb-0 before:scale-100 before:translate-y-[76%] before:bg-[var(--color-blue)] before:transition-transform before:duration-[600ms] before:ease-in-out hover:before:translate-y-0 hover:before:scale-100 hover:before:duration-[600ms] hover:before:ease-in-out motion-reduce:before:transition-none after:hidden';

const pressed = 'aria-pressed:before:translate-y-0';

export const panelPill = `h-[3em] min-w-[1em] rounded-[1.5em] border-0 px-[1.35em] py-0 text-[0.85em] font-[450] text-white shadow-[inset_0_0_0_1px_var(--color-border-light)] ${fill} ${pressed}`;
