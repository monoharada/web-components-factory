/**
 * @module date-picker
 *
 * NOTE: `a11yAnnotations` を別ファイルに分離し、lite入口からは読み込まれないようにする。
 */

import { datePickerA11yAnnotations } from './date-picker-a11y.js';
import { DadsDatePicker } from './date-picker-impl.js';

DadsDatePicker.a11yAnnotations = datePickerA11yAnnotations;

export { DadsDatePicker };

