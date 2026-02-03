/**
 * Cardコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsCard } from './card.js';

/**
 * Cardコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetPrefix()を使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineCard(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  const name = `${effectivePrefix}-card`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsCard.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsCard, def).define(effectiveRegistry);
}

/**
 * デフォルト名での登録
 */
export function defineDefaultCard(): void {
  defineCard();
}

