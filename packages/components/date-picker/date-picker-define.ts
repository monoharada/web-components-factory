/**
 * DatePickerコンポーネント定義関数
 */

import { DadsDatePicker } from './date-picker.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

/**
 * DatePickerコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineDatePicker(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-date-picker`;

  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsDatePicker.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsDatePicker, def).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultDatePicker(): void {
  defineDatePicker();
}

