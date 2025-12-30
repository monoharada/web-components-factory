/**
 * システム全体のコンポーネント登録と設定管理
 */

import { defineAccordion } from './components/accordion/accordion-define';
import { defineButton } from './components/button/button-define';
import { getConfig, getPrefix } from './config';

// 設定関数のre-export
export { getConfig, setConfig, resetConfig, getComponentName, getPrefix } from './config';
export type { DADSConfig } from './config';

/**
 * すべてのコンポーネントを一括登録
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineAllComponents(
  prefix?: string,
  registry?: CustomElementRegistry
): void {
  // prefixはgetPrefix()で取得（registry非依存、SSR安全）
  // registryが未指定の場合のみgetConfig()を呼ぶ
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  // アコーディオン
  defineAccordion(effectivePrefix, effectiveRegistry);

  // ボタン
  defineButton(effectivePrefix, effectiveRegistry);

  // 今後他のコンポーネントもここに追加
}

/**
 * デフォルト設定での一括登録
 */
export function defineDefaultComponents(): void {
  defineAllComponents();
}