/**
 * Progress Bar コンポーネント登録
 */
import { DadsProgressBar } from './progress-bar.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
export function defineProgressBar(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-progress-bar`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsProgressBar.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsProgressBar, def).define(effectiveRegistry);
}
export function defineDefaultProgressBar() {
    defineProgressBar();
}
export function autoDefineProgressBar() {
    if (typeof customElements !== 'undefined') {
        defineDefaultProgressBar();
    }
}
