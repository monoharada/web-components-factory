/**
 * Calendarコンポーネント定義関数
 */
import { DadsCalendar } from './calendar.js';
import { defineCalendarComponent } from './calendar-define-base.js';
/**
 * Calendarコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineCalendar(prefix, registry) {
    defineCalendarComponent(DadsCalendar, prefix, registry);
}
/**
 * デフォルト名での登録
 */
export function defineDefaultCalendar() {
    defineCalendar();
}
