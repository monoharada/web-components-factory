/**
 * アコーディオンコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { DadsAccordionDetails, DadsAccordionItemDetails } from './accordion';
import { WebComponentDefinition } from '../../core/web-components';

/**
 * アコーディオンコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（デフォルト: 'dads'）
 * @param registry - カスタムエレメントレジストリ（デフォルト: customElements）
 */
export function defineAccordion(
  prefix: string = 'dads',
  registry: CustomElementRegistry = customElements
): void {
  const containerName = `${prefix}-accordion-details`;
  const itemName = `${prefix}-accordion-item-details`;

  // コンテナコンポーネントの登録
  if (!registry.get(containerName)) {
    const containerDef = { ...DadsAccordionDetails.definition, name: containerName, registry };
    WebComponentDefinition.compose(DadsAccordionDetails, containerDef).define(registry);
  }

  // アイテムコンポーネントの登録
  if (!registry.get(itemName)) {
    const itemDef = { ...DadsAccordionItemDetails.definition, name: itemName, registry };
    WebComponentDefinition.compose(DadsAccordionItemDetails, itemDef).define(registry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultAccordion(): void {
  defineAccordion();
}