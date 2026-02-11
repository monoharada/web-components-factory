/**
 * レイアウトシェルコンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsLayoutShell } from './layout-shell.js';

export function defineLayoutShell(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-layout-shell`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsLayoutShell.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsLayoutShell, def).define(effectiveRegistry);
}

export function defineDefaultLayoutShell(): void {
  defineLayoutShell();
}
