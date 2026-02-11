/**
 * レイアウトシェルコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const layoutShellStyles = css `
  :host {
    display: block;
    color: var(--color-neutral-solid-gray-800, #333333);
    font-family: var(--font-family-sans);
  }

  [part='base'] {
    display: grid;
    grid-template-areas:
      'header'
      'body'
      'footer';
    row-gap: var(--dads-layout-shell-block-gap);
    padding-inline: var(--dads-layout-shell-inline-padding);
    box-sizing: border-box;
  }

  [part='header'] {
    grid-area: header;
    min-inline-size: 0;
  }

  [part='body'] {
    grid-area: body;
    min-inline-size: 0;
    display: grid;
    align-items: start;
    gap: var(--dads-layout-shell-block-gap);
  }

  [part='main'] {
    grid-area: main;
    min-inline-size: 0;
  }

  [part='sidebar'] {
    grid-area: sidebar;
    min-inline-size: 0;
  }

  [part='aside'] {
    grid-area: aside;
    min-inline-size: 0;
  }

  [part='footer'] {
    grid-area: footer;
    min-inline-size: 0;
  }

  :host([data-effective-pattern='website']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main';
  }

  :host([data-effective-pattern='website']) [part='main'] {
    inline-size: min(100%, var(--dads-layout-shell-main-max-width));
    justify-self: center;
  }

  :host([data-effective-pattern='app-shell'][data-effective-mode='desktop']) [part='body'] {
    grid-template-columns:
      minmax(0, var(--dads-layout-shell-sidebar-width))
      minmax(0, 1fr);
    grid-template-areas: 'sidebar main';
  }

  :host([data-effective-pattern='app-shell'][data-effective-mode='tablet']) [part='body'] {
    grid-template-columns:
      minmax(0, var(--dads-layout-shell-sidebar-rail-width))
      minmax(0, 1fr);
    grid-template-areas: 'sidebar main';
  }

  :host([data-effective-pattern='app-shell'][data-effective-mode='mobile']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main';
  }

  :host([data-effective-pattern='master-detail'][data-effective-mode='desktop']) [part='body'] {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, var(--dads-layout-shell-aside-width));
    grid-template-areas: 'main aside';
  }

  :host([data-effective-pattern='master-detail'][data-effective-mode='tablet']) [part='body'],
  :host([data-effective-pattern='master-detail'][data-effective-mode='mobile']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'main'
      'aside';
  }

  [part='header'][hidden],
  [part='sidebar'][hidden],
  [part='aside'][hidden],
  [part='footer'][hidden] {
    display: none;
  }

  #header-slot::slotted(*),
  #sidebar-slot::slotted(*),
  #main-slot::slotted(*),
  #aside-slot::slotted(*),
  #footer-slot::slotted(*) {
    display: block;
  }
`;
