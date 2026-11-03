/**
 * Whether a click is one that next/link would turn into a move inside the
 * running app: a plain click with the main button (or Enter) on a link to a
 * page of this site that opens in the same tab. A click that something has
 * already handled, a new-tab or new-window click, a download, and a link
 * that leaves the site or opens elsewhere are not.
 * @param {Pick<MouseEvent, 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'defaultPrevented'>} event
 * @param {Pick<HTMLAnchorElement, 'origin' | 'target' | 'hasAttribute'>} link
 * @param {string} origin The site's own origin
 */
export function isInAppClick(event, link, origin) {
  const modified =
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (event.defaultPrevented || event.button !== 0 || modified) return false;

  return (
    link.origin === origin &&
    (!link.target || link.target === '_self') &&
    !link.hasAttribute('download')
  );
}
