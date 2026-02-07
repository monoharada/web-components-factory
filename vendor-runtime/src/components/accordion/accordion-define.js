/**
 * アコーディオンコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */
import { DadsAccordionDetails, DadsAccordionItemDetails } from './accordion.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * アコーディオンコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineAccordion(prefix, registry) {
    // prefixはgetPrefix()で取得（registry非依存、SSR安全）
    // registryが未指定の場合のみgetConfig()を呼ぶ
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const containerName = `${effectivePrefix}-accordion-details`;
    const itemName = `${effectivePrefix}-accordion-item-details`;
    // コンテナコンポーネントの登録
    if (!effectiveRegistry.get(containerName)) {
        const containerDef = { ...DadsAccordionDetails.definition, name: containerName, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsAccordionDetails, containerDef).define(effectiveRegistry);
    }
    // アイテムコンポーネントの登録
    if (!effectiveRegistry.get(itemName)) {
        const itemDef = { ...DadsAccordionItemDetails.definition, name: itemName, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsAccordionItemDetails, itemDef).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultAccordion() {
    defineAccordion();
}
