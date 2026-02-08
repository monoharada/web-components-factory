import { css } from '../../core/web-components.js';

export const notificationBannerStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }

  :host([hidden]) {
    display: none;
  }

  [part='base'] {
    --_border-width: var(--dads-notification-banner-border-width);
    display: grid;
    grid-template-columns: var(--dads-notification-banner-icon-size) minmax(0, 1fr) auto;
    grid-template-rows: minmax(calc(36 / 16 * 1rem), auto);
    gap: var(--dads-notification-banner-gap);
    padding-top: var(--dads-notification-banner-padding-block-start);
    padding-right: var(--dads-notification-banner-padding-inline-end);
    padding-bottom: var(--dads-notification-banner-padding-block-end);
    padding-left: var(--dads-notification-banner-padding-inline-start);
    border: var(--_border-width) solid var(--dads-notification-banner-border-color);
    border-radius: var(--dads-notification-banner-border-radius);
    background-color: var(--dads-notification-banner-background);
    color: var(--dads-notification-banner-color);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-16, 1rem);
    font-weight: var(--font-weight-400, 400);
    line-height: var(--line-height-170, 1.7);
    letter-spacing: 0.02em;
    position: relative;
    min-width: 0;
  }

  :host([variant='color-chip']) [part='base'] {
    --_border-width: var(--dads-notification-banner-color-chip-border-width);
    border-radius: var(--dads-notification-banner-color-chip-radius);
    padding-left: var(--dads-notification-banner-color-chip-padding-inline-start);
    box-shadow: inset var(--dads-notification-banner-color-chip-inset-width) 0 0 0
      var(--dads-notification-banner-chip-color);
  }

  [part='header'] {
    grid-column: 1 / 4;
    display: grid;
    grid-template-columns: inherit;
    gap: inherit;
    min-width: 0;
  }

  [part='icon'] {
    grid-column: 1;
    justify-self: center;
    padding-top: var(--dads-notification-banner-icon-padding-top);
    color: var(--dads-notification-banner-icon-color);
    width: var(--dads-notification-banner-icon-size);
    height: var(--dads-notification-banner-icon-size);
    pointer-events: none;
  }

  [part='icon'] slot[name='icon'] {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part='icon'] [data-default-icon] {
    display: none;
    width: 100%;
    height: 100%;
  }

  :host([type='success']) [part='icon'] [data-default-icon='success'] {
    display: block;
  }

  :host([type='error']) [part='icon'] [data-default-icon='error'] {
    display: block;
  }

  :host([type='warning']) [part='icon'] [data-default-icon='warning'] {
    display: block;
  }

  :host([type='info-2']) [part='icon'] [data-default-icon='info-2'] {
    display: block;
  }

  :host([type='info-1']) [part='icon'] [data-default-icon='info-1'] {
    display: block;
  }

  [part='title'] {
    grid-column: 2;
    min-width: 0;
    color: var(--dads-notification-banner-title-color);
    font-size: var(--dads-notification-banner-title-font-size);
    font-weight: var(--dads-notification-banner-title-font-weight);
    line-height: var(--dads-notification-banner-title-line-height);
    letter-spacing: var(--dads-notification-banner-title-letter-spacing);
  }

  [part='title']::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  [part='title'] ::slotted(*) {
    display: block;
    margin: 0;
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
  }

  [part='close'] {
    grid-column: 3;
    align-self: start;
    position: relative;
    z-index: 1;
    margin-left: calc(4 / 16 * 1rem);
    display: inline-flex;
    align-items: center;
    column-gap: calc(4 / 16 * 1rem);
    border: 0;
    border-radius: calc(6 / 16 * 1rem);
    background: transparent;
    min-height: calc(36 / 16 * 1rem);
    padding: 0 calc(12 / 16 * 1rem);
    color: var(--dads-notification-banner-close-color);
    font: inherit;
    line-height: 1;
    letter-spacing: inherit;
    cursor: pointer;
  }

  [part='close'][hidden] {
    display: none;
  }

  [part='close-icon'] {
    margin-top: calc(2 / 16 * 1rem);
    width: var(--dads-notification-banner-close-icon-size);
    height: var(--dads-notification-banner-close-icon-size);
    flex-shrink: 0;
  }

  @media (any-hover: hover) {
    [part='close']:hover {
      background-color: var(--dads-notification-banner-close-hover-bg);
      text-decoration: underline;
      text-decoration-thickness: calc(1 / 16 * 1rem);
      text-underline-offset: calc(3 / 16 * 1rem);
    }
  }

  [part='close']:focus-visible,
  [part='base']:focus-visible,
  [part='title']:focus-visible {
    outline: var(--dads-focus-outline-width, 0.25rem) solid
      var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
    outline-offset: var(--dads-focus-outline-offset, 0.125rem);
    background-color: var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
    box-shadow: 0 0 0 var(--dads-focus-ring-width, 0.125rem)
      var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
  }

  :host([close-style='compact']) [part='close'] {
    margin-right: 0;
    min-width: var(--dads-notification-banner-close-compact-size);
    min-height: var(--dads-notification-banner-close-compact-size);
    width: var(--dads-notification-banner-close-compact-size);
    height: var(--dads-notification-banner-close-compact-size);
    padding: 0;
    justify-content: center;
    border-radius: calc(4 / 16 * 1rem);
  }

  :host([close-style='compact']) [part='close-label'] {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  :host([dense]) [part='base'] {
    grid-template-columns: var(--dads-notification-banner-dense-icon-size) minmax(0, 1fr) auto;
    gap: var(--dads-notification-banner-dense-gap);
    padding-top: var(--dads-notification-banner-dense-padding-block-start);
    padding-right: var(--dads-notification-banner-dense-padding-inline-end);
    padding-bottom: var(--dads-notification-banner-dense-padding-block-end);
    padding-left: var(--dads-notification-banner-dense-padding-inline-start);
  }

  :host([dense][variant='color-chip']) [part='base'] {
    padding-left: var(--dads-notification-banner-dense-color-chip-padding-inline-start);
    box-shadow: inset var(--dads-notification-banner-dense-color-chip-inset-width) 0 0 0
      var(--dads-notification-banner-chip-color);
  }

  :host([dense]) [part='icon'] {
    width: var(--dads-notification-banner-dense-icon-size);
    height: var(--dads-notification-banner-dense-icon-size);
    padding-top: var(--dads-notification-banner-dense-icon-padding-top);
  }

  /* Warning（三角）アイコンは視覚的に上寄りに見えるため、dense時のみ補正 */
  :host([dense][type='warning']) [part='icon'] {
    padding-top: calc(6 / 16 * 1rem);
  }

  :host([dense]) [part='body'] {
    margin-top: var(--dads-notification-banner-dense-body-margin-top);
    row-gap: var(--dads-notification-banner-dense-body-gap);
  }

  [part='body'] {
    grid-column: 1 / 4;
    margin-top: var(--dads-notification-banner-body-margin-top);
    padding-right: var(--dads-notification-banner-body-padding-inline-end);
    padding-bottom: var(--dads-notification-banner-body-padding-block-end);
    display: grid;
    row-gap: var(--dads-notification-banner-body-gap);
    min-width: 0;
  }

  [part='body'][hidden],
  [part='meta'][hidden],
  [part='description'][hidden],
  [part='actions'][hidden] {
    display: none;
  }

  [part='meta'],
  [part='description'] {
    min-width: 0;
  }

  [part='meta'] ::slotted(*),
  [part='description'] ::slotted(*) {
    margin: 0;
    color: inherit;
  }

  [part='actions'] {
    grid-column: 1 / 4;
    padding-right: var(--dads-notification-banner-actions-padding-inline-end);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--dads-notification-banner-dense-action-gap);
    min-width: 0;
  }

  [part='restore'] {
    grid-column: 1 / 4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--dads-notification-banner-restore-gap);
    min-width: 0;
  }

  [part='restore'][hidden] {
    display: none;
  }

  [part='restore-text'] {
    min-width: 0;
    color: var(--dads-notification-banner-restore-text-color);
    font-size: var(--dads-notification-banner-restore-text-size);
  }

  [part='restore-button'] {
    flex-shrink: 0;
    border: calc(1 / 16 * 1rem) solid var(--dads-notification-banner-restore-button-color);
    border-radius: var(--dads-notification-banner-restore-button-radius);
    background: var(--dads-notification-banner-restore-button-background);
    color: var(--dads-notification-banner-restore-button-color);
    padding: var(--dads-notification-banner-restore-button-padding-block)
      var(--dads-notification-banner-restore-button-padding-inline);
    font: inherit;
    font-weight: var(--font-weight-700, 700);
    line-height: 1;
    cursor: pointer;
  }

  @media (any-hover: hover) {
    [part='restore-button']:hover {
      color: var(--dads-notification-banner-restore-button-color-hover);
      border-color: var(--dads-notification-banner-restore-button-color-hover);
      background: var(--dads-notification-banner-restore-button-hover-bg);
    }
  }

  [part='restore-button']:active {
    color: var(--dads-notification-banner-restore-button-color-active);
    border-color: var(--dads-notification-banner-restore-button-color-active);
    background: var(--dads-notification-banner-restore-button-active-bg);
  }

  [part='restore-button']:focus-visible {
    outline: var(--dads-focus-outline-width, 0.25rem) solid
      var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
    outline-offset: var(--dads-focus-outline-offset, 0.125rem);
    box-shadow: 0 0 0 var(--dads-focus-ring-width, 0.125rem)
      var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
  }

  :host([dense]) [part='actions'] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--dads-notification-banner-dense-action-gap);
  }

  #actions-slot::slotted(dads-button) {
    width: auto;
    inline-size: auto;
    max-inline-size: 100%;
    --button-primary-bg: var(--dads-notification-banner-action-color);
    --button-primary-bg-hover: var(--dads-notification-banner-action-color-hover);
    --button-primary-bg-active: var(--dads-notification-banner-action-color-active);
    --button-primary-border: var(--dads-notification-banner-action-color);

    --button-secondary-text: var(--dads-notification-banner-action-color);
    --button-secondary-text-hover: var(--dads-notification-banner-action-color-hover);
    --button-secondary-text-active: var(--dads-notification-banner-action-color-active);
    --button-secondary-border: var(--dads-notification-banner-action-color);
    --button-secondary-border-hover: var(--dads-notification-banner-action-color-hover);
    --button-secondary-border-active: var(--dads-notification-banner-action-color-active);
    --button-secondary-bg-hover: var(--dads-notification-banner-action-outline-hover-bg);
    --button-secondary-bg-active: var(--dads-notification-banner-action-outline-active-bg);

    --button-tertiary-text: var(--dads-notification-banner-action-color);
    --button-tertiary-text-hover: var(--dads-notification-banner-action-color-hover);
    --button-tertiary-text-active: var(--dads-notification-banner-action-color-active);
  }

  :host([dense]) #actions-slot::slotted(dads-button) {
    width: auto;
  }

  :host([actions-layout='vertical']) [part='actions'] {
    display: grid;
    gap: var(--dads-notification-banner-action-gap);
  }

  :host([actions-layout='vertical']) #actions-slot::slotted(dads-button) {
    width: 100%;
    inline-size: 100%;
    max-inline-size: 100%;
    display: block;
    --dads-button-width: 100%;
    --dads-button-max-width: 100%;
  }

  :host([actions-layout='horizontal']) [part='actions'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: var(--dads-notification-banner-action-gap);
  }

  :host([actions-layout='horizontal']) #actions-slot::slotted(dads-button) {
    width: auto;
    inline-size: auto;
    max-inline-size: 100%;
    display: inline-block;
    flex: 0 0 auto;
    --dads-button-width: auto;
    --dads-button-max-width: none;
  }

  :host([actions-layout='horizontal'][data-multiple-actions]) #actions-slot::slotted(dads-button) {
    display: block;
    flex: 1 1 0;
    min-inline-size: calc(96 / 16 * 1rem);
    width: auto;
    inline-size: auto;
    max-inline-size: none;
    --dads-button-width: 100%;
    --dads-button-max-width: 100%;
  }

  :host([dense]) [part='restore'] {
    align-items: stretch;
    flex-direction: column;
  }

  :host([dense]) [part='restore-button'] {
    width: 100%;
  }

  :host([data-link-target='whole']) [part='base'] {
    cursor: pointer;
  }

  :host([data-link-target='title']) [part='title'] {
    cursor: pointer;
  }

  @media (any-hover: hover) {
    :host([data-link-target='whole']) [part='base']:hover [part='title'],
    :host([data-link-target='title']) [part='title']:hover {
      text-decoration: underline;
      text-decoration-thickness: calc(2 / 16 * 1rem);
      text-underline-offset: calc(3 / 16 * 1rem);
    }
  }

  @container (min-width: 48rem) {
    :host(:not([data-mobile-demo])) [part='body'] {
      grid-column: 2 / 4;
      margin-top: 0;
      padding-right: 0;
      padding-bottom: 0;
    }

    :host(:not([data-mobile-demo])) [part='actions'] {
      grid-column: 2 / 4;
      padding-right: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: end;
      gap: var(--dads-notification-banner-action-gap);
    }

    :host(:not([data-mobile-demo])) #actions-slot::slotted(dads-button) {
      width: auto;
    }

    :host(:not([data-mobile-demo])[variant='color-chip']) [part='base'] {
      padding-left: var(--dads-notification-banner-color-chip-padding-inline-start);
      box-shadow: inset var(--dads-notification-banner-color-chip-inset-width) 0 0 0
        var(--dads-notification-banner-chip-color);
    }

    :host(:not([data-mobile-demo])[actions-layout='vertical']) [part='actions'] {
      display: grid;
      grid-auto-flow: row;
      justify-content: stretch;
      gap: var(--dads-notification-banner-action-gap);
    }

    :host(:not([data-mobile-demo])[actions-layout='vertical']) #actions-slot::slotted(dads-button) {
      width: 100%;
      inline-size: 100%;
      max-inline-size: 100%;
      display: block;
      --dads-button-width: 100%;
      --dads-button-max-width: 100%;
    }

    :host(:not([data-mobile-demo])[actions-layout='horizontal']) [part='actions'] {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: end;
      gap: var(--dads-notification-banner-action-gap);
    }

    :host(:not([data-mobile-demo])[actions-layout='horizontal']) #actions-slot::slotted(dads-button) {
      flex: 0 0 auto;
      width: auto;
      inline-size: auto;
      max-inline-size: 100%;
      display: inline-block;
      --dads-button-width: auto;
      --dads-button-max-width: none;
    }
  }

  @media (forced-colors: active) {
    [part='icon'] {
      color: currentColor;
    }
  }
`;
