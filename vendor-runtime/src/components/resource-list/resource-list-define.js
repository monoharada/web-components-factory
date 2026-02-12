/**
 * Resource List コンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsResourceList } from './resource-list.js';
export function defineResourceList(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-resource-list`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsResourceList.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsResourceList, def).define(effectiveRegistry);
}
export function defineDefaultResourceList() {
    defineResourceList();
}
