/**
 * LoadingIcon コンポーネント登録
 */
import { DadsLoadingIcon } from './loading-icon.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

export function defineLoadingIcon(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-loading-icon`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsLoadingIcon.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsLoadingIcon, def).define(effectiveRegistry);
}

export function defineDefaultLoadingIcon(): void {
  defineLoadingIcon();
}

export function autoDefineLoadingIcon(): void {
  if (typeof customElements !== 'undefined') {
    defineDefaultLoadingIcon();
  }
}
