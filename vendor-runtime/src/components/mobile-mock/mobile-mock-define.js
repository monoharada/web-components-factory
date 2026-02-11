/**
 * モバイルモックコンポーネント登録ヘルパー
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsMobileMock } from './mobile-mock.js';
export function defineMobileMock(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-mobile-mock`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsMobileMock.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsMobileMock, def).define(effectiveRegistry);
}
export function defineDefaultMobileMock() {
    defineMobileMock();
}
