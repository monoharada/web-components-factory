/**
 * Emergency Bannerコンポーネント定義関数
 */
import { DadsEmergencyBanner } from './emergency-banner.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
export function defineEmergencyBanner(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-emergency-banner`;
    if (!effectiveRegistry.get(name)) {
        const def = { ...DadsEmergencyBanner.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsEmergencyBanner, def).define(effectiveRegistry);
    }
}
export function defineDefaultEmergencyBanner() {
    defineEmergencyBanner();
}
