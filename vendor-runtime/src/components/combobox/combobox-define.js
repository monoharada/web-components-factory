/**
 * Combobox コンポーネント登録
 */
import { DadsCombobox } from './combobox.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { defineChipTag } from '../chip-tag/chip-tag-define.js';
import { defineIcon } from '../icon/icon-define.js';
import { defineAvatar } from '../avatar/avatar-define.js';
export function defineCombobox(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    // dependencies
    defineChipTag(effectivePrefix, effectiveRegistry);
    defineIcon(effectivePrefix, effectiveRegistry);
    defineAvatar(effectivePrefix, effectiveRegistry);
    const name = `${effectivePrefix}-combobox`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsCombobox.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsCombobox, def).define(effectiveRegistry);
}
export function defineDefaultCombobox() {
    defineCombobox();
}
export function autoDefineCombobox() {
    if (typeof customElements !== 'undefined') {
        defineDefaultCombobox();
    }
}
