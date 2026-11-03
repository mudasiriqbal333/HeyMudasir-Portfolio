//? Tailwind class sets that turn MagneticButton into the reference work page
//? controls: .btn-normal (a 4.25em pill with a hairline ring), .btn-icon (a
//? 4.25em disc) and .btn-dark (the filled archive pill). The ::before is the
//? reference's .btn-fill, a blue ellipse (border-radius 50%, not the base
//? stadium) 150% wide and 200% tall parked 76% of its height above the pill;
//? usePillMotion animates it in from below and out through the top, and this
//? transition covers the fill of a pill that loses its pressed state without
//? the mouse (keyboard). With reduced motion the fill jumps into place.
const fill =
  'before:left-[-25%] before:top-[-50%] before:h-[200%] before:w-[150%] before:rounded-[50%] before:pb-0 before:scale-100 before:-translate-y-[76%] before:bg-[var(--color-blue)] before:transition-[transform,background-color] before:duration-[600ms,250ms] before:ease-in-out hover:before:translate-y-0 hover:before:scale-100 hover:before:transition-[transform,background-color] hover:before:duration-[600ms,250ms] hover:before:ease-in-out motion-reduce:before:transition-none motion-reduce:hover:before:transition-none after:hidden';

//? The label turns white over 300ms (ease-in) as the fill arrives and back
//? over 300ms (ease-out) after a 300ms wait once it has gone, as on the
//? reference.
const label =
  'text-[color:var(--color-dark)] transition-[color] duration-300 delay-300 ease-out hover:text-white hover:delay-0 hover:ease-in';

//? aria-pressed: the chosen filter or view keeps a dark fill and a white
//? label.
const pressed =
  'aria-pressed:text-white aria-pressed:before:translate-y-0 aria-pressed:before:bg-[var(--color-dark)]';

//? data-released: the one that has just lost it keeps the dark fill while
//? that slides away and its label darkens with it, both over the reference's
//? --animation-smooth (.7s cubic-bezier(.7, 0, .3, 1), from .btn-normal
//? .not-active) with no wait, until the mouse next comes to it.
const released =
  'data-[released=true]:before:bg-[var(--color-dark)] data-[released=true]:before:duration-[700ms,250ms] data-[released=true]:before:ease-[cubic-bezier(0.7,0,0.3,1)] data-[released=true]:delay-0 data-[released=true]:duration-700 data-[released=true]:ease-[cubic-bezier(0.7,0,0.3,1)]';

const ring = 'shadow-[inset_0_0_0_1px_var(--color-border)]';

const shape = 'h-[4.25em] border-0 py-0 text-[1em] font-[450]';

/* Filter pill: the label plus 2.5em each side, at least 1em wide; a touch
   wider on phones, where the reference adds .15em after the label. */
export const filterPill = `${shape} min-w-[1em] rounded-[2.125em] px-[2.5em] max-[540px]:pr-[2.65em] ${ring} ${fill} ${label} ${pressed} ${released}`;

/* Rows / columns button: a 4.25em disc around a 20px icon. */
export const viewButton = `${shape} w-[4.25em] rounded-full p-0 ${ring} ${fill} ${label} ${pressed} ${released}`;

/* Archive pill: dark, white label, at least 10em wide, no ring. */
export const archivePill = `${shape} min-w-[10em] rounded-[2.125em] bg-[var(--color-dark)] px-[2.5em] text-white ${fill}`;
