/**
 * DatePickerコンポーネント定義 共通ロジック
 */

import { WebComponent, WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

type ComponentCtor = typeof WebComponent & { definition: Record<string, unknown> };

export function defineDatePickerComponent(
  component: ComponentCtor,
  prefix?: string,
  registry?: CustomElementRegistry
): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-date-picker`;

  if (!effectiveRegistry.get(name)) {
    const def = { ...component.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(component, def).define(effectiveRegistry);
  }
}
