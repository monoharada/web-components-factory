/**
 * コンポーネントのデモマークアップ定義
 * autoloaderと組み合わせて使用される
 */

import { demos as showcaseForm } from './demos/showcase-form.js';
import { demos as showcaseDate } from './demos/showcase-date.js';
import { demos as showcaseComponents } from './demos/showcase-components.js';
import { demos as showcaseNavigation } from './demos/showcase-navigation.js';
import { demos as showcaseTableControl } from './demos/showcase-table-control.js';
import { demos as extra } from './demos/extra.js';
import { demos as dialog } from './demos/dialog.js';
import { demos as drawer } from './demos/drawer.js';
import { demos as headerContainer } from './demos/header-container.js';
import { demos as hamburgerMenuButton } from './demos/hamburger-menu-button.js';
import { demos as mobileMenu } from './demos/mobile-menu.js';

const {
  descriptionListFidelity: _descriptionListFidelity,
  listFidelity: _listFidelity,
  menuListBoxFidelity: _menuListBoxFidelity,
  resourceListFidelity: _resourceListFidelity,
  ...extraWithoutFidelity
} = extra;

export const demos = {
  ...showcaseForm,
  ...showcaseDate,
  ...showcaseComponents,
  ...showcaseNavigation,
  ...showcaseTableControl,
  ...extraWithoutFidelity,
  ...dialog,
  ...drawer,
  ...headerContainer,
  ...hamburgerMenuButton,
  ...mobileMenu,
} as const;

export type DemoName = keyof typeof demos;
