/**
 * 引用ブロックコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */
import { DadsBlockquote } from './blockquote.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * 引用ブロックコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineBlockquote(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-blockquote`;
    if (!effectiveRegistry.get(name)) {
        const blockquoteDef = { ...DadsBlockquote.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsBlockquote, blockquoteDef).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultBlockquote() {
    defineBlockquote();
}
