/**
 * Buttonコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */
import { DadsButton } from './button.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * Buttonコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineButton(prefix, registry) {
    // prefixはgetPrefix()で取得（registry非依存、SSR安全）
    // registryが未指定の場合のみgetConfig()を呼ぶ
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-button`;
    if (!effectiveRegistry.get(name)) {
        // definitionを上書きして正しい名前で登録
        const buttonDef = { ...DadsButton.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsButton, buttonDef).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultButton() {
    defineButton();
}
