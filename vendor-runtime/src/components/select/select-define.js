/**
 * Selectコンポーネント登録
 */
import { DadsSelect } from './select.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * DadsSelectコンポーネントをカスタム要素として登録する
 */
export function defineSelect(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-select`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsSelect.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsSelect, def).define(effectiveRegistry);
}
export function defineDefaultSelect() {
    defineSelect();
}
/**
 * 環境がカスタム要素をサポートしている場合に自動登録する
 */
export function autoDefineSelect() {
    if (typeof customElements !== 'undefined') {
        defineDefaultSelect();
    }
}
