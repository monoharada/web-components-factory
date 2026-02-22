/**
 * Avatar コンポーネント登録
 */
import { DadsAvatar } from './avatar.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

export function defineAvatar(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-avatar`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsAvatar.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsAvatar, def).define(effectiveRegistry);
}

export function defineDefaultAvatar(): void {
  defineAvatar();
}

export function autoDefineAvatar(): void {
  if (typeof customElements !== 'undefined') {
    defineDefaultAvatar();
  }
}
