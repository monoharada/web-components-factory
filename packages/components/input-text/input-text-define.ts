/**
 * InputTextコンポーネント登録
 */
import { DadsInputText } from './input-text.js';

let defined = false;

/**
 * DadsInputTextコンポーネントをカスタム要素として登録する
 */
export function defineInputText(): void {
  if (defined) return;
  DadsInputText.define();
  defined = true;
}

/**
 * 環境がカスタム要素をサポートしている場合に自動登録する
 */
export function autoDefineInputText(): void {
  if (typeof customElements !== 'undefined') {
    defineInputText();
  }
}
