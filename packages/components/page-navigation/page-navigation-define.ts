/**
 * Page Navigation コンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsPageNavigation } from './page-navigation.js';

/**
 * Page Navigation コンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function definePageNavigation(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-page-navigation`;
  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsPageNavigation.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsPageNavigation, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultPageNavigation(): void {
  definePageNavigation();
}

