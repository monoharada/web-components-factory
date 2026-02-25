/**
 * Tab コンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsTab } from './tab.js';

/**
 * Tab コンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineTab(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-tab`;

  if (!effectiveRegistry.get(name)) {
    const def = {
      ...DadsTab.definition,
      name,
      registry: effectiveRegistry,
    };
    WebComponentDefinition.compose(DadsTab, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultTab(): void {
  defineTab();
}
