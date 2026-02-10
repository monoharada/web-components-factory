/**
 * モバイルメニューコンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsMobileMenu } from './mobile-menu.js';

export function defineMobileMenu(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-mobile-menu`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsMobileMenu.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsMobileMenu, def).define(effectiveRegistry);
}

export function defineDefaultMobileMenu(): void {
  defineMobileMenu();
}
