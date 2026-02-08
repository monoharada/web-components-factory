/**
 * Description List コンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsDescriptionList } from './description-list.js';
import { createDescriptionListTokens } from './description-list-tokens.js';
import { createDescriptionListStyles } from './description-list-styles.js';

export function defineDescriptionList(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-description-list`;
  if (effectiveRegistry.get(name)) return;

  const def = {
    ...DadsDescriptionList.definition,
    name,
    registry: effectiveRegistry,
    styles: [
      createDescriptionListTokens(name),
      createDescriptionListStyles(name),
    ],
  };

  WebComponentDefinition.compose(DadsDescriptionList, def).define(effectiveRegistry);
}

export function defineDefaultDescriptionList(): void {
  defineDescriptionList();
}
