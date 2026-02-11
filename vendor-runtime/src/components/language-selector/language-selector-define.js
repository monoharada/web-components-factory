/**
 * Language Selector コンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { defineMenuListBox } from '../menu-list-box/menu-list-box-define.js';
import { DadsLanguageSelector } from './language-selector.js';
export function defineLanguageSelector(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    // dependencies
    defineMenuListBox(effectivePrefix, effectiveRegistry);
    const name = `${effectivePrefix}-language-selector`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsLanguageSelector.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsLanguageSelector, def).define(effectiveRegistry);
}
export function defineDefaultLanguageSelector() {
    defineLanguageSelector();
}
