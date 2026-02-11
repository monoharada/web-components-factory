/**
 * レイアウト補助領域コンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsLayoutAside } from './layout-aside.js';

export function defineLayoutAside(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-layout-aside`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsLayoutAside.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsLayoutAside, def).define(effectiveRegistry);
}

export function defineDefaultLayoutAside(): void {
  defineLayoutAside();
}
