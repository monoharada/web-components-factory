// reset-css.ts
// Web Components用のリセットCSS管理モジュール
// kiso.css (https://tak-dcxi.github.io/kiso.css/) のWeb Components向け実装

import { css, AdoptableStyles } from '../core/web-components.js';

/**
 * kiso.cssのWeb Components向けサブセット
 * Shadow DOM内でのみ適用され、既存サイトのスタイルには影響しない
 */
export const kisoResetStyles = css`*,
::before,
::after {

  box-sizing: border-box;
}
:where(:root,:host) {

  font-family: sans-serif;
  line-height: 1.5;
  text-spacing-trim: trim-start;
  text-autospace: normal;
  line-break: strict;
  overflow-wrap: anywhere;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scrollbar-gutter: stable;
  -webkit-tap-highlight-color: transparent;
}

:where(body) {

  min-block-size: 100dvb;
  margin: unset;
}
:where(h1, h2, h3, h4, h5, h6) {

  text-wrap: pretty;
}

:where(h1) {

  margin-block: 0.67em;
  font-size: 2em;
}

:where(h2, h3, h4, h5, h6) {

  margin-block: unset;
}

:where(search) {

  display: block flow;
}
:where(p, blockquote, figure, pre, address, ul, ol, dl, menu) {

  margin-block: unset;
}

:where(blockquote, figure) {

  margin-inline: unset;
}

:where(p:lang(en)) {

  text-wrap: pretty;
}

:where(address:lang(ja)) {

  font-style: unset;
}

:where(ul, ol, menu) {

  padding-inline-start: unset;
  list-style-type: "";
}

:where(dt) {

  font-weight: bolder;
}

:where(dd) {

  margin-inline-start: unset;
}

:where(pre) {

  text-spacing-trim: space-all;
  text-autospace: no-autospace;
}
:where(em:lang(ja)) {

  font-weight: bolder;
}

:where(:is(i, cite, em, dfn, var):lang(ja)) {

  font-style: unset;
}

:where(code, kbd, samp) {

  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-feature-settings: initial;
  font-variation-settings: initial;
  font-size: unset;
  font-variant-ligatures: none;
}

:where(abbr[title]) {

  text-decoration-line: underline;
  text-decoration-style: dotted;
  cursor: help;
}

:where(time) {

  text-autospace: no-autospace;
}

@media (forced-colors: active) {
  :where(mark) {

    background-color: Highlight;
    color: HighlightText;
  }
}

@media print {
  :where(mark) {

    border-width: 1px;
    border-style: dotted;
  }
}
:where(a:any-link) {

  color: unset;
  text-decoration-line: unset;
  text-decoration-thickness: from-font;
}
:where(img, svg, picture, video, canvas, model, audio, iframe, embed, object) {

  block-size: auto;
  max-inline-size: 100%;
  vertical-align: bottom;
}

:where(iframe) {

  border: unset;
}
:where(table) {

  border-collapse: collapse;
}

:where(caption, th) {

  text-align: unset;
}

:where(caption) {

  text-wrap: pretty;
}
:where(button, input, select, textarea),
::file-selector-button {

  border-width: 1px;
  border-style: solid;
  border-color: unset;
  border-radius: unset;
  color: unset;
  font: unset;
  letter-spacing: unset;
  text-align: unset;
}

:where(input:is([type="radio" i], [type="checkbox" i])) {

  margin: unset;
}

:where(input[type="file" i]) {

  border: unset;
}

:where(input[type="search" i]) {

  -webkit-appearance: textfield;
}

@supports (-webkit-touch-callout: none) {
  :where(input[type="search" i]) {

    background-color: Canvas;
  }
}

:where(
    input:is(
        [type="tel" i],
        [type="url" i],
        [type="email" i],
        [type="number" i]
      ):not(:placeholder-shown)
  ) {

  direction: ltr;
}

:where(textarea) {

  margin-block: unset;
  resize: block;
}

:where(
    input:not([type="button" i], [type="submit" i], [type="reset" i]),
    textarea,
    [contenteditable]
  ) {

  text-autospace: no-autospace;
}

:where(
    button,
    input:is([type="button" i], [type="submit" i], [type="reset" i])
  ),
::file-selector-button {

  background-color: unset;
}

:where(
    button,
    input:is([type="button" i], [type="submit" i], [type="reset" i]),
    [role="tab" i],
    [role="button" i],
    [role="option" i]
  ),
::file-selector-button {

  touch-action: manipulation;
}

:where(
    button:enabled,
    label[for],
    select:enabled,
    input:is(
        [type="button" i],
        [type="submit" i],
        [type="reset" i],
        [type="radio" i],
        [type="checkbox" i]
      ):enabled,
    [role="tab" i],
    [role="button" i],
    [role="option" i]
  ),
:where(:enabled)::file-selector-button {

  cursor: pointer;
}

:where(fieldset) {

  min-inline-size: 0;
  margin-inline: unset;
  padding: unset;
  border: unset;
}

:where(legend) {

  padding-inline: unset;
}

:where(progress) {

  vertical-align: unset;
}

::placeholder {

  opacity: unset;
}
:where(summary) {

  list-style-type: "";
  cursor: pointer;
}

:where(summary)::-webkit-details-marker {

  display: none;
}

:where(dialog, [popover]) {

  overscroll-behavior-block: contain;
  padding: unset;
  border: unset;
}

:where(dialog:not([open], [popover]), [popover]:not(:popover-open)) {

  display: none !important;
}

:where(dialog) {

  max-inline-size: unset;
  max-block-size: unset;
}

:where(dialog)::backdrop {

  background-color: oklch(0% 0 0deg / 30%);
}

:where([popover]) {

  margin: unset;
}
:where(:focus-visible) {

  outline-offset: 3px;
}

[tabindex="-1"]:focus {

  outline: none !important;
}
:where(:disabled, [aria-disabled="true" i]) {

  cursor: default;
}

[hidden]:not([hidden="until-found" i]) {

  display: none !important;
}`

/**
 * 最小限のリセット（より軽量なオプション）
 */
export const minimalResetStyles = css`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  :host {
    display: block;
    font-family: sans-serif;
    line-height: 1.5;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    margin: 0;
  }

  img,
  svg {
    display: block;
    max-inline-size: 100%;
  }
`;

/**
 * リセットスタイルとコンポーネントスタイルを結合するヘルパー
 */
export function withReset(
  componentStyles: CSSStyleSheet | string | (CSSStyleSheet | (() => CSSStyleSheet))[] | (() => CSSStyleSheet),
  resetType: 'full' | 'minimal' = 'full'
): CSSStyleSheet[] {
  const reset = resetType === 'full' ? kisoResetStyles : minimalResetStyles;
  
  // 配列の場合、各要素を処理
  if (Array.isArray(componentStyles)) {
    const processedStyles = componentStyles.map(style => {
      if (typeof style === 'function') {
        return style();
      } else if (typeof style === 'string') {
        return AdoptableStyles.for(style);
      } else {
        return style;
      }
    });
    return [reset, ...processedStyles];
  }
  
  // 単一の場合
  let resolvedStyle: CSSStyleSheet;
  if (typeof componentStyles === 'function') {
    resolvedStyle = componentStyles();
  } else if (typeof componentStyles === 'string') {
    resolvedStyle = AdoptableStyles.for(componentStyles);
  } else {
    resolvedStyle = componentStyles;
  }
  
  return [reset, resolvedStyle];
}

/**
 * 使用例：
 * 
 * ```typescript
 * import { WebComponent, css, html } from './web-components';
 * import { withReset } from './reset-css';
 * 
 * class MyCard extends WebComponent {
 *   static definition = {
 *     name: 'my-card',
 *     template: html`
 *       <h2 part="title"><slot name="title"></slot></h2>
 *       <p part="content"><slot></slot></p>
 *     `,
 *     // リセットCSSを適用
 *     styles: withReset(css`
 *       :host {
 *         padding: 1rem;
 *         border: 1px solid #ccc;
 *         border-radius: 8px;
 *       }
 *       
 *       h2 {
 *         color: #333;
 *         margin-bottom: 0.5rem;
 *       }
 *     `)
 *   };
 * }
 * MyCard.define();
 * ```
 */

// リセットスタイルの種類を示すenum
export const ResetType = {
  Full: 'full',
  Minimal: 'minimal',
  None: 'none'
} as const;

export type ResetTypeValue = typeof ResetType[keyof typeof ResetType];
