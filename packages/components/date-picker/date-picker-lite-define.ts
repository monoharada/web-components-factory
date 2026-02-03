/**
 * DatePicker（lite）コンポーネント定義関数
 *
 * NOTE: `a11yAnnotations` を読み込まない `date-picker-lite` を登録する。
 */

import { DadsDatePicker } from './date-picker-lite.js';
import { defineDatePickerComponent } from './date-picker-define-base.js';

export function defineDatePickerLite(prefix?: string, registry?: CustomElementRegistry): void {
  defineDatePickerComponent(DadsDatePicker, prefix, registry);
}

export function defineDefaultDatePickerLite(): void {
  defineDatePickerLite();
}
