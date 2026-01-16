/**
 * Calendarコンポーネント定義関数
 */

import { DadsCalendar } from './calendar.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

/**
 * Calendarコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineCalendar(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-calendar`;

  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsCalendar.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsCalendar, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultCalendar(): void {
  defineCalendar();
}

