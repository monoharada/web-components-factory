/**
 * ハンバーガーメニューボタンコンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsHamburgerMenuButton } from './hamburger-menu-button.js';

export function defineHamburgerMenuButton(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-hamburger-menu-button`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsHamburgerMenuButton.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsHamburgerMenuButton, def).define(effectiveRegistry);
}

export function defineDefaultHamburgerMenuButton(): void {
  defineHamburgerMenuButton();
}
