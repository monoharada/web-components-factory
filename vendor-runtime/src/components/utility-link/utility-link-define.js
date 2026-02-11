/**
 * Utility Link コンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsUtilityLink } from './utility-link.js';
export function defineUtilityLink(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-utility-link`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsUtilityLink.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsUtilityLink, def).define(effectiveRegistry);
}
export function defineDefaultUtilityLink() {
    defineUtilityLink();
}
