//? Styles of the last-resort error screen (app/global-error.jsx), as CSS text
//? that the screen prints in a <style> tag of its own. Next 14.0.4 does not
//? load a stylesheet or CSS module imported by global-error (measured: the
//? file is built but never linked), and this screen must not lean on
//? anything that could itself be what failed. The rules repeat the message
//? page layout of index.styled.js, without the top bar and the footer: the
//? menu they belong to is part of the frame that is gone. The fluid tokens
//? (--section-padding and the others) come from globals.css.

//? `css` only marks the text as CSS, for the editor, Prettier and stylelint.
const css = String.raw;

export const globalErrorStyles = css`
  .global-error {
    min-height: 100vh;
    padding-top: calc(var(--section-padding) * 1.33);
    padding-bottom: 1em;
    overflow: hidden;
    color: var(--color-white);
    background: var(--color-dark);
  }

  .global-error-container {
    max-width: 100em;
    margin: 0 auto;
    padding-inline: calc(var(--container-padding) * 2);
  }

  .global-error-col {
    position: relative;
  }

  .global-error-title {
    font-size: calc(clamp(3.25em, 7vw, 8em) * 0.875);
    line-height: 1.065;
  }

  .global-error-line {
    display: block;
  }

  .global-error-text {
    max-width: 40%;
    position: absolute;
    top: 1em;
    right: 0;
    line-height: 1.66;
  }

  .global-error-rule {
    height: 1px;
    margin-top: calc(var(--section-padding) * 0.66);
    background: var(--color-border-light);
  }

  .global-error-button-row {
    position: relative;
  }

  /* The round button on the rule: "Try again" */
  .global-error-round {
    width: clamp(9em, 12vw, 11em);
    height: clamp(9em, 12vw, 11em);
    position: absolute;
    top: 0;
    right: 0;
    color: var(--color-white);
    background: var(--color-blue);
    border-radius: 50%;
    transition: background-color 0.3s ease-in-out;
    transform: translate(-50%, -50%);
  }

  .global-error-pill-row {
    display: flex;
    padding-top: calc(var(--section-padding) * 0.475);
  }

  /* The outlined pill under the rule: "Back to home" */
  .global-error-pill {
    height: 4.25em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 2.5em;
    border-radius: 2.125em;
    box-shadow: inset 0 0 0 1px var(--color-border-light);
    transition:
      background-color 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
  }

  .global-error-round:focus-visible,
  .global-error-pill:focus-visible {
    outline: 2px solid var(--color-white);
    outline-offset: 2px;
  }

  /* Only where a mouse can hover, so a tap leaves no colour behind */
  @media (hover: hover) {
    .global-error-round:hover {
      background: var(--color-blue-dark);
    }

    .global-error-pill:hover {
      background: var(--color-blue);
      box-shadow: inset 0 0 0 1px var(--color-blue);
    }
  }

  @media (max-width: 900px) {
    .global-error-pill-row {
      padding-top: calc(var(--section-padding) * 0.75);
    }
  }

  @media (max-width: 720px) {
    .global-error {
      padding-top: calc(var(--section-padding) * 1.95);
    }

    .global-error-line {
      display: inline-flex;
    }

    .global-error-text {
      max-width: none;
      position: relative;
      top: auto;
      right: auto;
      margin-top: calc(var(--gap-padding) * 1.5);
      margin-bottom: max(var(--section-padding), 5em);
    }

    .global-error-round {
      transform: translate(-20%, -50%);
    }

    .global-error-pill-row {
      padding-top: max(calc(var(--section-padding) * 1.25), 5.5em);
    }

    .global-error-pill {
      width: 100%;
    }
  }

  @media (max-width: 540px) {
    .global-error {
      min-height: 100svh;
    }

    .global-error-container {
      padding-inline: var(--container-padding);
    }
  }
`;
