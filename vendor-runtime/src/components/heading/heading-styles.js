/**
 * 見出しコンポーネント用スタイル定義
 */
import { css } from '../../core/web-components.js';
export const headingStyles = css `
  :host {
    display: block;
    color: var(--dads-heading-color);
    font-family: var(--dads-heading-font-family);
    font-weight: var(--dads-heading-font-weight);
    font-size: var(--dads-heading-font-size);
    line-height: var(--dads-heading-line-height);
    letter-spacing: var(--dads-heading-letter-spacing);
    margin: 0;
  }

  [part='group'] {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
  }

  /*
   * margin="top" は「見出しの前の余白」。
   * ホスト要素の margin は外部CSS（例: *{margin:0}）で潰れる可能性があるため、
   * Shadow DOM 内の group に margin を付けて、外部の影響を受けにくくする。
   */
  :host([margin='top']) [part='group'] {
    margin-block-start: var(--dads-heading-margin-block-start);
  }

  [part='shoulder'] {
    margin: 0;
    font-weight: var(--dads-heading-font-weight);
    font-size: var(--dads-heading-shoulder-font-size);
    line-height: var(--dads-heading-shoulder-line-height);
    letter-spacing: var(--dads-heading-shoulder-letter-spacing);
  }

  [part='heading'] {
    margin: 0;
    font: inherit;
    display: inline;
  }

  [part='icon'] {
    /*
     * The icon wrapper participates in inline layout next to the heading text.
     * Apply vertical-align to the wrapper (not the slotted SVG) so baseline alignment
     * actually affects the icon's position.
     */
    display: inline-flex;
    align-items: center;
    line-height: 0;
    margin-inline-end: var(--dads-heading-icon-gap);
    vertical-align: var(--dads-heading-icon-vertical-align);
  }

  :host(:not([data-has-icon])) [part='icon'] {
    display: none;
  }

  :host(:not([data-has-shoulder])) [part='shoulder'] {
    display: none;
  }

  :host([data-has-chip]) [part='group'] {
    position: relative;
    padding-inline-start: var(--dads-heading-chip-padding-inline);
  }

  :host(:not([data-has-chip])) [part='chip'] {
    display: none;
  }

  /* a11y-annotate のアンカー用（擬似要素は対象にできないため） */
  :host([data-has-chip]) [part='chip'] {
    position: absolute;
    top: var(--dads-heading-chip-top);
    bottom: var(--dads-heading-chip-bottom);
    left: 0;
    width: var(--dads-heading-chip-width);
    pointer-events: none;
    background: transparent;
  }

  :host([data-has-chip]) [part='group']::before {
    position: absolute;
    top: var(--dads-heading-chip-top);
    bottom: var(--dads-heading-chip-bottom);
    left: 0;
    width: var(--dads-heading-chip-width);
    background-color: var(--dads-heading-chip-color);
    content: '';
  }

  /*
   * Shoulderがある場合、chipの上インセットは DADS の式に合わせて補正する。
   * - top = (shoulder-size * (line-height - 1)) / 2
   */
  :host([data-has-chip][data-has-shoulder]) [part='chip'],
  :host([data-has-chip][data-has-shoulder]) [part='group']::before {
    top: calc(
      (var(--dads-heading-shoulder-font-size) * (var(--dads-heading-shoulder-line-height) - 1)) /
        2
    );
  }

  @media (forced-colors: active) {
    :host([data-has-chip]) [part='group']::before {
      background-color: CanvasText;
    }
  }

  :host([rule]) {
    border-bottom: solid var(--dads-heading-rule-color);
    border-bottom-width: var(--dads-heading-rule-width);
    padding-block-end: var(--dads-heading-rule-padding);
  }

  ::slotted([slot='icon']),
  ::slotted(svg) {
    display: block;
    width: var(--dads-heading-icon-size);
    height: var(--dads-heading-icon-size);
  }
`;
