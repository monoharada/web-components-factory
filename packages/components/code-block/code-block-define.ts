/**
 * CodeBlockコンポーネント定義関数
 * ドキュメンテーション用途（HTMLスニペット表示/コピー）
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsCodeBlock } from './code-block.js';

/**
 * dads-code-block を定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineCodeBlock(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;
  const name = `${effectivePrefix}-code-block`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsCodeBlock.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsCodeBlock, def).define(effectiveRegistry);
}

/**
 * デフォルト名での登録
 */
export function defineDefaultCodeBlock(): void {
  defineCodeBlock();
}
