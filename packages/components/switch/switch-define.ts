/**
 * スイッチコンポーネント登録ヘルパー
 */
import { DadsSwitch } from './switch.js';

let defined = false;

/**
 * スイッチコンポーネントを登録
 */
export function defineSwitch(): void {
  if (defined) return;
  DadsSwitch.define();
  defined = true;
}

/**
 * 自動登録（ブラウザ環境でのみ実行）
 */
export function autoDefineSwitch(): void {
  if (typeof customElements !== 'undefined') {
    defineSwitch();
  }
}
