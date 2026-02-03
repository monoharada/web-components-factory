/**
 * Calendar（lite）コンポーネント定義関数
 *
 * NOTE: `a11yAnnotations` を読み込まない `calendar-lite` を登録する。
 */

import { DadsCalendar } from './calendar-lite.js';
import { defineCalendarComponent } from './calendar-define-base.js';

export function defineCalendarLite(prefix?: string, registry?: CustomElementRegistry): void {
  defineCalendarComponent(DadsCalendar, prefix, registry);
}

export function defineDefaultCalendarLite(): void {
  defineCalendarLite();
}
