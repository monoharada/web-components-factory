/**
 * DatePickerコンポーネント定義 共通ロジック
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
export function defineDatePickerComponent(component, prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-date-picker`;
    if (!effectiveRegistry.get(name)) {
        const def = { ...component.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(component, def).define(effectiveRegistry);
    }
}
