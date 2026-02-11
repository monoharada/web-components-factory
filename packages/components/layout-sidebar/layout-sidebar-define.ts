/**
 * レイアウトサイドバーコンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsLayoutSidebar } from './layout-sidebar.js';

export function defineLayoutSidebar(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-layout-sidebar`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsLayoutSidebar.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsLayoutSidebar, def).define(effectiveRegistry);
}

export function defineDefaultLayoutSidebar(): void {
  defineLayoutSidebar();
}
