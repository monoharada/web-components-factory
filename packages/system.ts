/**
 * システム全体のコンポーネント登録と設定管理
 */

import { defineAccordion } from './components/accordion/accordion-define';
import { defineButton } from './components/button/button-define';
import { getConfig } from './config';

// 設定関数のre-export
export { getConfig, setConfig, resetConfig, getComponentName } from './config';
export type { DADSConfig } from './config';

/**
 * すべてのコンポーネントを一括登録
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetConfig()のprefixを使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineAllComponents(
  prefix?: string,
  registry?: CustomElementRegistry
): void {
  // 両方渡されている場合はgetConfig()を呼ばない（SSR対応）
  const needsConfig = prefix === undefined || registry === undefined;
  const config = needsConfig ? getConfig() : null;
  const effectivePrefix = prefix ?? config!.prefix;
  const effectiveRegistry = registry ?? config!.registry;

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