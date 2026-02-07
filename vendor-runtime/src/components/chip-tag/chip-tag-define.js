/**
 * チップタグコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */
import { DadsChipTag } from './chip-tag.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * チップタグコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineChipTag(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-chip-tag`;
    if (!effectiveRegistry.get(name)) {
        const chipTagDef = { ...DadsChipTag.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsChipTag, chipTagDef).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultChipTag() {
    defineChipTag();
}
