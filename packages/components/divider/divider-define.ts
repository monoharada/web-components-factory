/**
 * Dividerコンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsDivider } from './divider.js';

export function defineDivider(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-divider`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsDivider.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsDivider, def).define(effectiveRegistry);
}

export function defineDefaultDivider(): void {
  defineDivider();
}
