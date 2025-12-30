/**
 * アコーディオンコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { DadsAccordionDetails, DadsAccordionItemDetails } from './accordion';
import { WebComponentDefinition } from '../../core/web-components';
import { getConfig } from '../../config';

/**
 * アコーディオンコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetConfig()のprefixを使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineAccordion(
  prefix?: string,
  registry?: CustomElementRegistry
): void {
  const config = getConfig();
  const effectivePrefix = prefix ?? config.prefix;
  const effectiveRegistry = registry ?? config.registry;

  const containerName = `${effectivePrefix}-accordion-details`;
  const itemName = `${effectivePrefix}-accordion-item-details`;

  // コンテナコンポーネントの登録
  if (!effectiveRegistry.get(containerName)) {
    const containerDef = { ...DadsAccordionDetails.definition, name: containerName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsAccordionDetails, containerDef).define(effectiveRegistry);
  }

  // アイテムコンポーネントの登録
  if (!effectiveRegistry.get(itemName)) {
    const itemDef = { ...DadsAccordionItemDetails.definition, name: itemName, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsAccordionItemDetails, itemDef).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultAccordion(): void {
  defineAccordion();
}