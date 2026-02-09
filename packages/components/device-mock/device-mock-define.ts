/**
 * デバイスモックコンポーネント登録ヘルパー
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsDeviceMock } from './device-mock.js';

export function defineDeviceMock(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-device-mock`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsDeviceMock.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsDeviceMock, def).define(effectiveRegistry);
}

export function defineDefaultDeviceMock(): void {
  defineDeviceMock();
}
