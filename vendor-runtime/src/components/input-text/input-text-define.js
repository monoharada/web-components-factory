/**
 * InputTextコンポーネント登録
 */
import { DadsInputText } from './input-text.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * DadsInputTextコンポーネントをカスタム要素として登録する
 */
export function defineInputText(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-input-text`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsInputText.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsInputText, def).define(effectiveRegistry);
}
export function defineDefaultInputText() {
    defineInputText();
}
/**
 * 環境がカスタム要素をサポートしている場合に自動登録する
 */
export function autoDefineInputText() {
    if (typeof customElements !== 'undefined') {
        defineDefaultInputText();
    }
}
