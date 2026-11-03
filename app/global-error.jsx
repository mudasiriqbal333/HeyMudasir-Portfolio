'use client';

import { Fragment } from 'react';

import { neue_montreal } from '@/fonts';

import { errorCopy, siteName } from './_layout/message/copy';
import { globalErrorStyles } from './_layout/message/global-error.styled';
import './globals.css';

//? "Try again" loads the page again instead of calling the `reset` Next hands
//? to this component. On Next 14.0.4 reset() cannot bring the frame back once
//? the page has been running (measured: it fails inside Next with "Cannot
//? read properties of null (reading 'get')" and this screen shows again), and
//? a fresh load is the surest restart in any case.
function reload() {
  window.location.reload();
}

/**
 * The last resort: shown when the frame around every page fails (the root
 * layout, with the menu and the providers), where error.jsx cannot help.
 * Next puts it in place of the root layout, so it brings its own <html> and
 * <body>, the tab title, the global stylesheet, the font and its own styles,
 * and it is built from plain elements only: nothing here may depend on what
 * has just failed. React has already logged the error by the time this shows.
 */
export default function GlobalError() {
  const { title, paragraph, retry, home } = errorCopy;

  return (
    <html lang='en' dir='ltr' className={neue_montreal.variable}>
      {/* The tab title and the viewport setting go when the root layout
          goes (measured: the tab showed the bare address), so they are
          set again here */}
      <head>
        <title>{`${title.join(' ')} | ${siteName}`}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className={neue_montreal.className}>
        <style>{globalErrorStyles}</style>
        <main className='global-error'>
          <div className='global-error-container'>
            <div className='global-error-col'>
              <h1 className='global-error-title'>
                {title.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 ? ' ' : null}
                    <span className='global-error-line'>{line}</span>
                  </Fragment>
                ))}
              </h1>
              <p className='global-error-text'>{paragraph}</p>
              <div className='global-error-rule' />
              <div className='global-error-button-row'>
                <button
                  type='button'
                  className='global-error-round'
                  onClick={reload}
                >
                  {retry}
                </button>
              </div>
              <div className='global-error-pill-row'>
                {/* A plain link, not next/link, on purpose: it loads the home
                    page afresh, which also starts the app again */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a className='global-error-pill' href='/'>
                  {home}
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
