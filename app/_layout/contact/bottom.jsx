'use client';

import { MagneticLink } from '@/components';
import { contactOptions, socialMedias } from '@/data';
import { useLocalTime } from '@/hooks';

import { Bottom, BottomStripe, Credits, Socials } from './bottom.styled';

/** Footer bottom row: version, live local time and social links. */
export function FooterBottom() {
  const { version, timeZone } = contactOptions;
  const time = useLocalTime(timeZone);

  return (
    <Bottom>
      <Credits>
        <div>
          <h3>Version</h3>
          <p>{version}</p>
        </div>
        <div>
          <h3>Local time</h3>
          <p>
            <time dateTime={time.value}>{time.label}</time>
          </p>
        </div>
      </Credits>

      <Socials>
        <h3>Socials</h3>
        <ul>
          {socialMedias.map(({ href, title }) => (
            <li key={href}>
              <MagneticLink href={href} external>
                {title}
              </MagneticLink>
            </li>
          ))}
        </ul>
        <BottomStripe aria-hidden='true' />
      </Socials>
    </Bottom>
  );
}
