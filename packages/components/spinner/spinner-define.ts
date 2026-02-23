/**
 * Spinner コンポーネント登録
 */
import { DadsSpinner } from './spinner.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

export function defineSpinner(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-spinner`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsSpinner.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsSpinner, def).define(effectiveRegistry);
}

export function defineDefaultSpinner(): void {
  defineSpinner();
}

export function autoDefineSpinner(): void {
  if (typeof customElements !== 'undefined') {
    defineDefaultSpinner();
  }
}
