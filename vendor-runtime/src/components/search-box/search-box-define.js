/**
 * SearchBoxコンポーネント定義関数
 */
import { DadsSearchBox } from './search-box.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
/**
 * SearchBoxコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineSearchBox(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-search-box`;
    if (!effectiveRegistry.get(name)) {
        const def = { ...DadsSearchBox.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsSearchBox, def).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultSearchBox() {
    defineSearchBox();
}
