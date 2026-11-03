//? Placeholder copy for the message pages. Replace with your own wording.
//? `title` is the heading, one entry per line. A line of up to about 14
//? characters stays on one line on a phone; a longer one wraps.

//? The name after the "|" in the browser tab. Only app/global-error.jsx
//? reads it: that screen replaces the root layout, which gives every other
//? page its tab title, so it has to build its own. Keep it the same as
//? `siteName` in app/_config/metadata.config.js.
export const siteName = 'Mudasir Iqbal';

//? The 404 page (app/not-found.jsx). `loader` is the word on the loading
//? screen: a fixed word, because the address of a page that does not exist
//? can say anything.
export const notFoundCopy = {
  loader: 'Error',
  title: ['Error 404', 'Page not found'],
  paragraph: 'This page does not exist.',
  home: 'Back to home',
};

//? Shown when a page fails while it is being displayed (app/error.jsx, and
//? app/global-error.jsx when the failure is in the frame around every page).
export const errorCopy = {
  title: ['Something', 'went wrong'],
  paragraph: 'This page could not be shown.',
  retry: 'Try again',
  home: 'Back to home',
};
