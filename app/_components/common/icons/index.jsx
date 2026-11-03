/**
 * Thin diagonal arrow (reference 14x14 SVG, 1.5px stroke, currentColor).
 * @param {{direction?: 'down-right' | 'down-left'} & import('react').SVGProps<SVGSVGElement>} props
 */
export function ArrowIcon({ direction = 'down-right', ...props }) {
  const left = direction === 'down-left';

  return (
    <svg
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      aria-hidden='true'
      {...props}
    >
      {left ? (
        <>
          <polyline points='1 3.77 1 13 10.23 13' />
          <line x1='1' y1='13' x2='13' y2='1' />
        </>
      ) : (
        <>
          <polyline points='13 3.77 13 13 3.77 13' />
          <line x1='13' y1='13' x2='1' y2='1' />
        </>
      )}
    </svg>
  );
}
