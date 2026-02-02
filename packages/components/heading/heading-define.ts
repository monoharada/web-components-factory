/**
 * Headingコンポーネント定義関数
 */

import { DadsHeading } from './heading.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

/**
 * Headingコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineHeading(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-heading`;

  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsHeading.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsHeading, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultHeading(): void {
  defineHeading();
}
