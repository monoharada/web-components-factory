/**
 * Disclosureコンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsDisclosure } from './disclosure.js';

/**
 * Disclosureコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineDisclosure(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-disclosure`;

  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsDisclosure.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsDisclosure, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultDisclosure(): void {
  defineDisclosure();
}

