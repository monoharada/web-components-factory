/**
 * Table Control コンポーネント定義関数
 */
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { defineButton } from '../button/button-define.js';
import { defineChipTag } from '../chip-tag/chip-tag-define.js';
import { definePageNavigation } from '../page-navigation/page-navigation-define.js';
import { defineSearchBox } from '../search-box/search-box-define.js';
import { DadsTableControl } from './table-control.js';
/**
 * Table Control コンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineTableControl(prefix, registry) {
    const effectivePrefix = prefix ?? getPrefix();
    const effectiveRegistry = registry ?? getConfig().registry;
    defineSearchBox(effectivePrefix, effectiveRegistry);
    defineChipTag(effectivePrefix, effectiveRegistry);
    definePageNavigation(effectivePrefix, effectiveRegistry);
    defineButton(effectivePrefix, effectiveRegistry);
    const name = `${effectivePrefix}-table-control`;
    if (!effectiveRegistry.get(name)) {
        const tableControlDef = {
            ...DadsTableControl.definition,
            name,
            registry: effectiveRegistry,
        };
        WebComponentDefinition.compose(DadsTableControl, tableControlDef).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultTableControl() {
    defineTableControl();
}
