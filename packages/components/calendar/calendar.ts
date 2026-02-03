/**
 * @module calendar
 *
 * NOTE: `a11yAnnotations` を別ファイルに分離し、lite入口からは読み込まれないようにする。
 */

import { calendarA11yAnnotations } from './calendar-a11y.js';
import { DadsCalendar } from './calendar-impl.js';

DadsCalendar.a11yAnnotations = calendarA11yAnnotations;

export { DadsCalendar };
export type { DadsCalendarPublicAPI } from './calendar-impl.js';

