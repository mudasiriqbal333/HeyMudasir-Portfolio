'use client';

import { ArrowIcon, MagneticButton, MagneticLink } from '@/components';
import { contactOptions, socialMedias } from '@/data';

import { BookCall, Eyebrow, LinkList, SocialsBlock } from './index.styled';
import { pill } from '../contact/classes';

export function ContactDetails() {
  const { booking, contactDetails, businessDetails } = contactOptions;

  return (
    <>
      {/* First in the column, as the footer's outlined pills, so a call is
          as easy to book as a message is to send. Hidden when contactOptions
          has no booking link. */}
      {booking ? (
        <BookCall>
          <MagneticButton
            href={booking.href}
            target='_blank'
            rel='noopener'
            variant='outline'
            strength={25}
            nowrap
            whileHover={{ scale: 1 }}
            className={pill}
          >
            {booking.label}
            <span className='sr-only'>
              {' '}
              (opens Google Calendar in a new tab)
            </span>
            <ArrowIcon
              direction='down-right'
              className='ml-[0.5em] inline-block w-[0.66em] -rotate-90'
            />
          </MagneticButton>
        </BookCall>
      ) : null}

      <Eyebrow>Contact Details</Eyebrow>
      <LinkList>
        {contactDetails.map(({ href, title }) => (
          <li key={href}>
            <MagneticLink href={href}>{title}</MagneticLink>
          </li>
        ))}
      </LinkList>

      <Eyebrow>Business Details</Eyebrow>
      <LinkList>
        {businessDetails.map(line => (
          <li key={line}>
            <p>{line}</p>
          </li>
        ))}
      </LinkList>

      {/* Socials sit in the footer on small screens */}
      <SocialsBlock>
        <Eyebrow>Socials</Eyebrow>
        <LinkList>
          {socialMedias.map(({ href, title }) => (
            <li key={href}>
              <MagneticLink href={href} external>
                {title}
              </MagneticLink>
            </li>
          ))}
        </LinkList>
      </SocialsBlock>
    </>
  );
}
