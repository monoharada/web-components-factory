/**
 * DadsTextareaコンポーネントの登録
 */
import { DadsTextarea } from './textarea.js';

let defined = false;

/**
 * DadsTextareaコンポーネントをカスタム要素として登録
 */
export function defineTextarea(): void {
  if (defined) return;
  DadsTextarea.define();
  defined = true;
}

/**
 * 自動登録（インポート時に登録）
 */
export function autoDefineTextarea(): void {
  if (typeof customElements !== 'undefined') {
    defineTextarea();
  }
}
