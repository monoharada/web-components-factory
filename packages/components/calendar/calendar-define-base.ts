/**
 * Calendarコンポーネント定義 共通ロジック
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';

type ComponentCtor = (new (...args: never[]) => HTMLElement) & { definition: Record<string, unknown> };

export function defineCalendarComponent(
  component: ComponentCtor,
  prefix?: string,
  registry?: CustomElementRegistry
): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-calendar`;

  if (!effectiveRegistry.get(name)) {
    const def = { ...component.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(component, def).define(effectiveRegistry);
  }
}
