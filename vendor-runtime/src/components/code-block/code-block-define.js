/**
 * CodeBlockコンポーネント定義関数
 * ドキュメンテーション用途（HTMLスニペット表示/コピー）
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig } from '../../config.js';
import { DadsCodeBlock } from './code-block.js';
/**
 * dads-code-block を定義
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineCodeBlock(registry) {
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = 'dads-code-block';
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsCodeBlock.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsCodeBlock, def).define(effectiveRegistry);
}
/**
 * デフォルト名での登録
 */
export function defineDefaultCodeBlock() {
    defineCodeBlock();
}
