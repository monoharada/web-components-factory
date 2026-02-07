/**
 * チップラベルコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */
import { DadsChipLabel } from './chip-label.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * チップラベルコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineChipLabel(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-chip-label`;
    if (!effectiveRegistry.get(name)) {
        const chipLabelDef = { ...DadsChipLabel.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsChipLabel, chipLabelDef).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultChipLabel() {
    defineChipLabel();
}
