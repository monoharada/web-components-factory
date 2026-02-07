/**
 * DadsTextareaコンポーネントの登録
 */
import { DadsTextarea } from './textarea.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * DadsTextareaコンポーネントをカスタム要素として登録
 */
export function defineTextarea(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-textarea`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsTextarea.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsTextarea, def).define(effectiveRegistry);
}
export function defineDefaultTextarea() {
    defineTextarea();
}
/**
 * 自動登録（インポート時に登録）
 */
export function autoDefineTextarea() {
    if (typeof customElements !== 'undefined') {
        defineDefaultTextarea();
    }
}
