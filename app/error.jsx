'use client';

import { startTransition } from 'react';

import { useRouter } from 'next/navigation';

import { FullLoadLinks, MessagePage } from '@/layout/message';
import { Navbar } from '@/layout/navbar';

import { errorCopy } from './_layout/message/copy';

/**
 * Shown in place of a page that failed while it was being displayed, on the
 * same template as the 404 page. No preloader here: the message shows at
 * once. A failure in the frame around every page (the menu, the providers)
 * is not caught here; it goes to global-error.jsx.
 * @param {Object} props
 * @param {Error & {digest?: string}} props.error What was thrown; React has already logged it
 * @param {() => void} props.reset Displays the page again
 */
export default function ErrorPage({ error, reset }) {
  const { title, paragraph, retry, home } = errorCopy;
  const router = useRouter();

  //? reset() alone displays again what the server sent the first time, so a
  //? page that failed on the server would fail again without the server
  //? being asked. Next marks such a failure with a `digest`: only then is
  //? the server asked for the page again first. A failure in the browser
  //? needs no request, so there "Try again" also works without a connection.
  const tryAgain = () =>
    startTransition(() => {
      if (error?.digest) router.refresh();
      reset();
    });

  return (
    <>
      {/* "Back to home" and the top bar load their pages afresh instead of
          moving inside the running app: after an error the app itself may be
          what is broken (a tab left open across a new release, for example),
          and a link to the page that failed would otherwise change nothing */}
      <FullLoadLinks />
      <Navbar theme='light' />
      <MessagePage
        title={title}
        paragraph={paragraph}
        action={{ label: retry, onClick: tryAgain }}
        secondaryAction={{ href: '/', label: home }}
      />
    </>
  );
}
