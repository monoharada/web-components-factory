/**
 * Carousel コンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsCarousel } from './carousel.js';
export function defineCarousel(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-carousel`;
    if (effectiveRegistry.get(name))
        return;
    const def = { ...DadsCarousel.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsCarousel, def).define(effectiveRegistry);
}
export function defineDefaultCarousel() {
    defineCarousel();
}
