/**
 * ヘッダーコンテナコンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsHeaderContainer } from './header-container.js';
export function defineHeaderContainer(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-header-container`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsHeaderContainer.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsHeaderContainer, def).define(effectiveRegistry);
}
export function defineDefaultHeaderContainer() {
    defineHeaderContainer();
}
