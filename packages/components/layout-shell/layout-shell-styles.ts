/**
 * レイアウトシェルコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';

export const layoutShellStyles = css`
  :host {
    display: block;
    color: var(--color-neutral-solid-gray-800, #333333);
    font-family: var(--font-family-sans);
  }

  :host([data-effective-mode='mobile']) {
    --_dads-layout-shell-inline-padding-derived:
      calc(var(--dads-layout-shell-space) * var(--dads-layout-shell-mobile-space-scale));
    --_dads-layout-shell-block-gap-derived:
      calc(var(--dads-layout-shell-space) * var(--dads-layout-shell-mobile-space-scale));
  }

  [part='base'] {
    display: grid;
    grid-template-areas:
      'header'
      'body'
      'footer';
    row-gap: var(--dads-layout-shell-block-gap, var(--_dads-layout-shell-block-gap-derived));
    padding-inline: var(--dads-layout-shell-inline-padding, var(--_dads-layout-shell-inline-padding-derived));
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
    align-items: stretch;
    gap: var(--dads-layout-shell-block-gap, var(--_dads-layout-shell-block-gap-derived));
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
    inline-size: min(100%, var(--dads-layout-shell-main-max-width, var(--layout-shell-main-max-width)));
    justify-self: center;
  }

  :host([data-body-layout='single']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main';
  }

  :host([data-body-layout='app-shell']) [part='body'] {
    grid-template-columns:
      minmax(0, var(--dads-layout-shell-sidebar-width, var(--_dads-layout-shell-sidebar-width-derived)))
      minmax(0, 1fr);
    grid-template-areas: 'sidebar main';
  }

  :host([data-body-layout='app-shell-rail']) [part='body'] {
    grid-template-columns:
      minmax(0, var(--dads-layout-shell-sidebar-rail-width, var(--_dads-layout-shell-sidebar-rail-width-derived)))
      minmax(0, 1fr);
    grid-template-areas: 'sidebar main';
  }

  :host([data-body-layout='app-shell-mobile-stacked-top']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'sidebar'
      'main';
  }

  :host([data-body-layout='app-shell-mobile-stacked-bottom']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'main'
      'sidebar';
  }

  :host([data-body-layout='master-detail']) [part='body'] {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, var(--dads-layout-shell-aside-width, var(--_dads-layout-shell-aside-width-derived)));
    grid-template-areas: 'main aside';
  }

  :host([data-body-layout='master-detail-stacked']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'main'
      'aside';
  }

  :host([data-body-layout='left-header-pane']) [part='base'] {
    min-block-size: 100%;
    grid-template-columns:
      minmax(0, var(--dads-layout-shell-sidebar-width, var(--_dads-layout-shell-sidebar-width-derived)))
      minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto;
    grid-template-areas:
      'header body'
      'footer footer';
    column-gap: var(--dads-layout-shell-block-gap, var(--_dads-layout-shell-block-gap-derived));
  }

  :host([data-body-layout='left-header-pane']) [part='header'],
  :host([data-body-layout='left-header-pane']) [part='body'] {
    block-size: 100%;
    min-block-size: 0;
  }

  :host([data-body-layout='left-header-pane']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main';
  }

  :host([data-body-layout='three-pane']) [part='body'] {
    grid-template-columns:
      minmax(0, var(--dads-layout-shell-sidebar-width, var(--_dads-layout-shell-sidebar-width-derived)))
      minmax(0, 1fr)
      minmax(0, var(--dads-layout-shell-aside-width, var(--_dads-layout-shell-aside-width-derived)));
    grid-template-areas: 'sidebar main aside';
  }

  :host([data-body-layout='three-pane-tablet']) [part='body'] {
    grid-template-columns:
      minmax(0, var(--dads-layout-shell-sidebar-rail-width, var(--_dads-layout-shell-sidebar-rail-width-derived)))
      minmax(0, 1fr);
    grid-template-areas:
      'sidebar main'
      'sidebar aside';
  }

  :host([data-body-layout='three-pane-mobile-top']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'sidebar'
      'main'
      'aside';
  }

  :host([data-body-layout='three-pane-mobile-bottom']) [part='body'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'main'
      'aside'
      'sidebar';
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
