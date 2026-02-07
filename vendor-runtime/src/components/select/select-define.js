/**
 * Selectコンポーネント登録
 */
import { DadsSelect } from './select.js';
let defined = false;
/**
 * DadsSelectコンポーネントをカスタム要素として登録する
 */
export function defineSelect() {
    if (defined)
        return;
    DadsSelect.define();
    defined = true;
}
/**
 * 環境がカスタム要素をサポートしている場合に自動登録する
 */
export function autoDefineSelect() {
    if (typeof customElements !== 'undefined') {
        defineSelect();
    }
}
