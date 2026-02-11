/**
 * Drawerコンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsDrawer } from './drawer.js';
export function defineDrawer(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-drawer`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsDrawer.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsDrawer, def).define(effectiveRegistry);
}
export function defineDefaultDrawer() {
    defineDrawer();
}
