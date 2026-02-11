/**
 * Progress コンポーネント登録ヘルパー
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsProgress } from './progress.js';

/**
 * Progress コンポーネントを登録
 */
export function defineProgress(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-progress`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsProgress.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsProgress, def).define(effectiveRegistry);
}

export function defineDefaultProgress(): void {
  defineProgress();
}

export function autoDefineProgress(): void {
  if (typeof customElements !== 'undefined') defineDefaultProgress();
}
