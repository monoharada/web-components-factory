/**
 * コンポーネントのデモマークアップ定義
 * autoloaderと組み合わせて使用される
 */

import { demos as showcaseForm } from './demos/showcase-form.js';
import { demos as showcaseDate } from './demos/showcase-date.js';
import { demos as showcaseComponents } from './demos/showcase-components.js';
import { demos as showcaseNavigation } from './demos/showcase-navigation.js';
import { demos as extra } from './demos/extra.js';

export const demos = {
  ...showcaseForm,
  ...showcaseDate,
  ...showcaseComponents,
  ...showcaseNavigation,
  ...extra,
} as const;

export type DemoName = keyof typeof demos;
