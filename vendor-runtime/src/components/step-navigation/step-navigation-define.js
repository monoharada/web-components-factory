/**
 * Step Navigation コンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsStepNavigation, DadsStepNavigationItem } from './step-navigation.js';
/**
 * Step Navigation コンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineStepNavigation(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const containerName = `${effectivePrefix}-step-navigation`;
    const itemName = `${effectivePrefix}-step-navigation-item`;
    if (!effectiveRegistry.get(containerName)) {
        const containerDef = {
            ...DadsStepNavigation.definition,
            name: containerName,
            registry: effectiveRegistry,
        };
        WebComponentDefinition.compose(DadsStepNavigation, containerDef).define(effectiveRegistry);
    }
    if (!effectiveRegistry.get(itemName)) {
        const itemDef = { ...DadsStepNavigationItem.definition, name: itemName, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsStepNavigationItem, itemDef).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultStepNavigation() {
    defineStepNavigation();
}
