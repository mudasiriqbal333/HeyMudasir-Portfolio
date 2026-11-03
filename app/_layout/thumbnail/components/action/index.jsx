import { Container, MagneticButton } from '@/components';

import { ButtonRow, Section } from './index.styled';

//? Reference .btn-normal pill on a light page: 4.25em tall, at least 10em
//? wide, a hairline ring, and the 150% x 200% blue ellipse rising from below
//? over 600ms on hover while the label turns white.
const fill =
  'before:left-[-25%] before:top-[-50%] before:h-[200%] before:w-[150%] before:pb-0 before:scale-100 before:translate-y-[76%] before:transition-transform before:duration-[600ms] before:ease-in-out hover:before:translate-y-0 hover:before:scale-100 hover:before:duration-[600ms] hover:before:ease-in-out after:duration-[600ms] after:ease-in-out hover:after:delay-[600ms]';

const pill = `h-[4.25em] min-w-[10em] rounded-[2.125em] border-0 px-[2.5em] text-[1em] font-normal text-[color:var(--color-dark)] shadow-[inset_0_0_0_1px_var(--color-border)] duration-300 hover:text-white after:-translate-y-[102%] ${fill}`;

/**
 * "More projects" pill under the list, with the number of cases beside it.
 * @param {{ count: number }} props
 */
export function ThumbnailAction({ count }) {
  return (
    <Section>
      <Container>
        <ButtonRow>
          <MagneticButton
            href='/work'
            variant='outline'
            strength={25}
            textStrength={15}
            nowrap
            whileHover={{ scale: 1 }}
            className={pill}
          >
            More projects
            <sup aria-hidden='true'>{count}</sup>
          </MagneticButton>
        </ButtonRow>
      </Container>
    </Section>
  );
}
