/**
 * 箇条書きリスト（List / List Item）コンポーネント定義関数
 */

import { DadsList, DadsListItem } from './list.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

export function defineList(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const listName = `${effectivePrefix}-list`;
  const itemName = `${effectivePrefix}-list-item`;

  if (!effectiveRegistry.get(listName)) {
    const def = { ...DadsList.definition, name: listName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsList, def).define(effectiveRegistry);
  }

  if (!effectiveRegistry.get(itemName)) {
    const def = { ...DadsListItem.definition, name: itemName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsListItem, def).define(effectiveRegistry);
  }
}

export function defineDefaultList(): void {
  defineList();
}

