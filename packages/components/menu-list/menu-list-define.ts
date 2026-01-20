/**
 * Menu List コンポーネント定義関数
 */

import { DadsMenuList, DadsMenuListItem } from './menu-list.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

export function defineMenuList(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const listName = `${effectivePrefix}-menu-list`;
  const itemName = `${effectivePrefix}-menu-list-item`;

  if (!effectiveRegistry.get(listName)) {
    const def = { ...DadsMenuList.definition, name: listName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsMenuList, def).define(effectiveRegistry);
  }

  if (!effectiveRegistry.get(itemName)) {
    const def = { ...DadsMenuListItem.definition, name: itemName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsMenuListItem, def).define(effectiveRegistry);
  }
}

export function defineDefaultMenuList(): void {
  defineMenuList();
}

