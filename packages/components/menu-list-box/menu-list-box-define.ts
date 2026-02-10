/**
 * Menu List Box コンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { defineDivider } from '../divider/divider-define.js';
import { defineMenuList } from '../menu-list/menu-list-define.js';
import { DadsMenuListBox } from './menu-list-box.js';

export function defineMenuListBox(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  // dependencies
  defineDivider(effectivePrefix, effectiveRegistry);
  defineMenuList(effectivePrefix, effectiveRegistry);

  const name = `${effectivePrefix}-menu-list-box`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsMenuListBox.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsMenuListBox, def).define(effectiveRegistry);
}

export function defineDefaultMenuListBox(): void {
  defineMenuListBox();
}
