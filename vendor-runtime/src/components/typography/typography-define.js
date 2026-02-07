/**
 * Typography（dads-text）コンポーネント定義関数
 *
 * NOTE:
 * `dads-text` は現状 import 時に `DadsText.define()` されるが、
 * vendor install / AI recipe 用に “明示的な define API” を提供する。
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsText } from './dads-text.js';
/**
 * dads-text を定義（prefix対応）
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineText(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-text`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsText.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsText, def).define(effectiveRegistry);
}
export function defineDefaultText() {
    defineText();
}
