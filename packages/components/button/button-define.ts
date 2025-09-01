/**
 * Buttonコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { DadsButton } from './button';
import { WebComponentDefinition } from '../../core/web-components';

/**
 * Buttonコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（デフォルト: 'dads'）
 * @param registry - カスタムエレメントレジストリ（デフォルト: customElements）
 */
export function defineButton(
  prefix: string = 'dads',
  registry: CustomElementRegistry = customElements
): void {
  const name = `${prefix}-button`;

  if (!registry.get(name)) {
    // definitionを上書きして正しい名前で登録
    const buttonDef = { ...DadsButton.definition, name, registry };
    WebComponentDefinition.compose(DadsButton, buttonDef).define(registry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultButton(): void {
  defineButton();
}