/**
 * 引用ブロックコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';
export const blockquoteStyles = css `
  /* ========== ホストレベル共通設定 ========== */
  :host {
    display: block;
  }

  /* ========== セマンティック要素 & グリッドレイアウト ========== */
  [part="blockquote"] {
    /* CSS Grid でスロットコンテンツのレイアウトを制御 */
    display: grid;
    gap: var(--dads-blockquote-gap);

    /* DADSスタイル準拠 */
    margin-inline: var(--dads-blockquote-margin-inline);
    padding-block: var(--dads-blockquote-padding-block);
    padding-inline-start: var(--dads-blockquote-padding-inline-start);
    padding-inline-end: var(--dads-blockquote-padding-inline-end);

    /* 左ボーダー */
    border-left-width: var(--dads-blockquote-border-width);
    border-left-style: solid;
    border-left-color: var(--dads-blockquote-border-color);

    /* タイポグラフィ - DADS公式準拠 */
    font-family: var(--font-family-sans);
    font-size: var(--dads-blockquote-font-size);
    line-height: var(--dads-blockquote-line-height);
    color: var(--dads-blockquote-color);
  }

  /* ========== スロット要素のレイアウト制御 ========== */
  /*
   * 各スロットはグリッドアイテムとして配置。
   * gapはスロット間（lead ↔ body ↔ close）に適用。
   * スロット内の要素間には余白なし。
   */
  [part="lead"],
  [part="body"],
  [part="close"] {
    display: var(--dads-blockquote-slot-display, block);
  }

  /* 空スロットは非表示 */
  [part="lead"][hidden],
  [part="body"][hidden],
  [part="close"][hidden] {
    display: none;
  }

  /* ========== スロットコンテンツのmarginリセット ========== */
  /*
   * Light DOMのコンテンツはShadow DOM内のリセットCSSが適用されない
   * ::slotted() でデフォルトmarginを消し、gapのみで余白を制御
   */
  ::slotted(p),
  ::slotted(ul),
  ::slotted(ol),
  ::slotted(dl),
  ::slotted(blockquote),
  ::slotted(figure) {
    margin: 0;
  }

  /* ========== 印刷対応 ========== */
  @media print {
    [part="blockquote"] {
      border-left-color: currentColor;
    }
  }
`;
