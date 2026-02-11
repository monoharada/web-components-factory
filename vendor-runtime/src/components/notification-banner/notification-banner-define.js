/**
 * Notification Bannerコンポーネント定義関数
 */
import { DadsNotificationBanner } from './notification-banner.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
export function defineNotificationBanner(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-notification-banner`;
    if (!effectiveRegistry.get(name)) {
        const def = { ...DadsNotificationBanner.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsNotificationBanner, def).define(effectiveRegistry);
    }
}
export function defineDefaultNotificationBanner() {
    defineNotificationBanner();
}
