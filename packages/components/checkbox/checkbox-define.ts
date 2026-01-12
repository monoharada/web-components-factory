/**
 * Checkboxコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsCheckbox } from './checkbox.js';

/**
 * Checkboxコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineCheckbox(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-checkbox`;
  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsCheckbox.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsCheckbox, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultCheckbox(): void {
  defineCheckbox();
}

