/**
 * Dialogコンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsDialog } from './dialog.js';

export function defineDialog(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-dialog`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsDialog.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsDialog, def).define(effectiveRegistry);
}

export function defineDefaultDialog(): void {
  defineDialog();
}

