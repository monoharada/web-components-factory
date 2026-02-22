/**
 * Icon コンポーネント登録
 */
import { DadsIcon } from './icon.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
export function defineIcon(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-icon`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsIcon.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsIcon, def).define(effectiveRegistry);
}
export function defineDefaultIcon() {
    defineIcon();
}
export function autoDefineIcon() {
    if (typeof customElements !== 'undefined') {
        defineDefaultIcon();
    }
}
