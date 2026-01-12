/**
 * Fieldsetコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsFieldset } from './fieldset.js';

/**
 * Fieldsetコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineFieldset(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-fieldset`;
  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsFieldset.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsFieldset, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultFieldset(): void {
  defineFieldset();
}
