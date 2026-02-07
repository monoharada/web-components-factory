/**
 * Tableコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsTable } from './table.js';
import { createTableTokens } from './table-tokens.js';
import { createTableStyles } from './table-styles.js';
export function defineTable(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = `${effectivePrefix}-table`;
    if (effectiveRegistry.get(name))
        return;
    const tableDef = {
        ...DadsTable.definition,
        name,
        registry: effectiveRegistry,
        styles: [createTableTokens(name), createTableStyles(name)],
    };
    WebComponentDefinition.compose(DadsTable, tableDef).define(effectiveRegistry);
}
export function defineDefaultTable() {
    defineTable();
}
