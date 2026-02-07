/**
 * File Upload コンポーネント定義関数
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { defineButton } from '../button/button-define.js';
import { defineCheckbox } from '../checkbox/checkbox-define.js';
import { DadsFileUpload } from './file-upload.js';

export function defineFileUpload(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  // dependencies
  defineButton(effectivePrefix, effectiveRegistry);
  defineCheckbox(effectivePrefix, effectiveRegistry);

  const name = `${effectivePrefix}-file-upload`;

  if (!effectiveRegistry.get(name)) {
    const def = { ...DadsFileUpload.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsFileUpload, def).define(effectiveRegistry);
  }
}

export function defineDefaultFileUpload(): void {
  defineFileUpload();
}
