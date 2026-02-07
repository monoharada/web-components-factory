/**
 * Breadcrumb コンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsBreadcrumb, DadsBreadcrumbItem } from './breadcrumb.js';
export function defineBreadcrumb(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const breadcrumbName = `${effectivePrefix}-breadcrumb`;
    const breadcrumbItemName = `${effectivePrefix}-breadcrumb-item`;
    if (!effectiveRegistry.get(breadcrumbName)) {
        const breadcrumbDef = {
            ...DadsBreadcrumb.definition,
            name: breadcrumbName,
            registry: effectiveRegistry,
        };
        WebComponentDefinition.compose(DadsBreadcrumb, breadcrumbDef).define(effectiveRegistry);
    }
    if (!effectiveRegistry.get(breadcrumbItemName)) {
        const itemDef = {
            ...DadsBreadcrumbItem.definition,
            name: breadcrumbItemName,
            registry: effectiveRegistry,
        };
        WebComponentDefinition.compose(DadsBreadcrumbItem, itemDef).define(effectiveRegistry);
    }
}
export function defineDefaultBreadcrumb() {
    defineBreadcrumb();
}
