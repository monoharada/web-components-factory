/**
 * DatePickerコンポーネント定義関数
 */

import { DadsDatePicker } from './date-picker.js';
import { defineDatePickerComponent } from './date-picker-define-base.js';

/**
 * DatePickerコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineDatePicker(prefix?: string, registry?: CustomElementRegistry): void {
  defineDatePickerComponent(DadsDatePicker, prefix, registry);
}

/**
 * デフォルト名での登録
 */
export function defineDefaultDatePicker(): void {
  defineDatePicker();
}
