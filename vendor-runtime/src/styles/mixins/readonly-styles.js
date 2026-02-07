/**
 * 読み取り専用スタイル Mixin
 *
 * フォーム要素の読み取り専用状態に共通スタイルを適用
 * 複数のフォームコンポーネント間で一貫した readonly 表現を実現
 *
 * DADS公式準拠:
 * - 点線ボーダー（dashed）
 * - 背景色は変更しない（白のまま）
 * - cursorをdefaultに
 *
 * 参考: https://github.com/digital-go-jp/design-system-example-components-html
 */
import { css } from '../../core/web-components.js';
/**
 * 読み取り専用要素の共通スタイル
 * textarea, input などのフォーム要素に適用
 *
 * DADS公式: readonly は白背景 + 点線ボーダー
 */
export function applyReadonlyStyles() {
    return css `
    /* ========== フォーム要素への読み取り専用スタイル（DADS公式準拠） ========== */
    :host([readonly]) [part="textarea"]:not(:disabled),
    :host([readonly]) [part="input"]:not(:disabled) {
      border-style: dashed;
      cursor: default;
    }
  `;
}
