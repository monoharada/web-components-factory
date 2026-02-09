/**
 * Global Menu コンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { defineMenuListBox } from '../menu-list-box/menu-list-box-define.js';
import { DadsGlobalMenu, DadsGlobalMenuItem } from './global-menu.js';

export function defineGlobalMenu(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  // dependencies
  defineMenuListBox(effectivePrefix, effectiveRegistry);

  const menuName = `${effectivePrefix}-global-menu`;
  const itemName = `${effectivePrefix}-global-menu-item`;

  if (!effectiveRegistry.get(menuName)) {
    const menuDef = { ...DadsGlobalMenu.definition, name: menuName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsGlobalMenu, menuDef).define(effectiveRegistry);
  }

  if (!effectiveRegistry.get(itemName)) {
    const itemDef = { ...DadsGlobalMenuItem.definition, name: itemName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsGlobalMenuItem, itemDef).define(effectiveRegistry);
  }
}

export function defineDefaultGlobalMenu(): void {
  defineGlobalMenu();
}
