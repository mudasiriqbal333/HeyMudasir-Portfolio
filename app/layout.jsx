import { rootMetadata, rootViewport } from '@/config';
import { neue_montreal } from '@/fonts';
//? Each section is imported from its own folder ('@/layout/offcanvas'). There
//? is no index file for the sections on purpose: importing one from a server
//? file makes the browser download every section's code on every page.
import { Offcanvas } from '@/layout/offcanvas';
import { Providers } from '@/providers';
import './globals.css';

/** @type {import('next').Metadata} */
export const metadata = rootMetadata;

/** @type {import('next').Viewport} */
export const viewport = rootViewport;

/** @param {import('react').PropsWithChildren<unknown>} */
export default function RootLayout({ children }) {
  return (
    <html lang='en' dir='ltr' className={neue_montreal.variable}>
      <body className={neue_montreal.className}>
        <Providers>
          <Offcanvas />
          {children}
        </Providers>
      </body>
    </html>
  );
}
