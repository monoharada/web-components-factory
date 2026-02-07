/**
 * スイッチコンポーネント登録ヘルパー
 */
import { DadsSwitch } from './switch.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * スイッチコンポーネントを登録
 */
export function defineSwitch(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-switch`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsSwitch.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsSwitch, def).define(effectiveRegistry);
}
export function defineDefaultSwitch() {
    defineSwitch();
}
/**
 * 自動登録（ブラウザ環境でのみ実行）
 */
export function autoDefineSwitch() {
    if (typeof customElements !== 'undefined') {
        defineDefaultSwitch();
    }
}
