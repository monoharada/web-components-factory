/**
 * Calendar（lite）コンポーネント定義関数
 *
 * NOTE: `a11yAnnotations` を読み込まない `calendar-lite` を登録する。
 */
import { DadsCalendar } from './calendar-lite.js';
import { defineCalendarComponent } from './calendar-define-base.js';
export function defineCalendarLite(prefix, registry) {
    defineCalendarComponent(DadsCalendar, prefix, registry);
}
export function defineDefaultCalendarLite() {
    defineCalendarLite();
}
