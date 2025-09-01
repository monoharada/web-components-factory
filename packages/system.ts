/**
 * システム全体のコンポーネント登録
 */

import { defineAccordion } from './components/accordion-define';
import { defineButton } from './components/button/button-define';

/**
 * すべてのコンポーネントを一括登録
 * @param prefix - コンポーネント名のプレフィックス
 * @param registry - カスタムエレメントレジストリ
 */
export function defineAllComponents(
  prefix: string = 'dads',
  registry: CustomElementRegistry = customElements
): void {
  // アコーディオン
  defineAccordion(prefix, registry);
  
  // ボタン
  defineButton(prefix, registry);
  
  // 今後他のコンポーネントもここに追加
}

/**
 * デフォルト設定での一括登録
 */
export function defineDefaultComponents(): void {
  defineAllComponents();
}