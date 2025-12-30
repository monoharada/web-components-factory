/**
 * Buttonコンポーネント定義関数
 * デジタル庁デザインシステム準拠
 */

import { DadsButton } from './button';
import { WebComponentDefinition } from '../../core/web-components';
import { getConfig } from '../../config';

/**
 * Buttonコンポーネントを定義
 * @param prefix - コンポーネント名のプレフィックス（省略時はgetConfig()のprefixを使用）
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineButton(
  prefix?: string,
  registry?: CustomElementRegistry
): void {
  // 両方渡されている場合はgetConfig()を呼ばない（SSR対応）
  const needsConfig = prefix === undefined || registry === undefined;
  const config = needsConfig ? getConfig() : null;
  const effectivePrefix = prefix ?? config!.prefix;
  const effectiveRegistry = registry ?? config!.registry;

  const name = `${effectivePrefix}-button`;

  if (!effectiveRegistry.get(name)) {
    // definitionを上書きして正しい名前で登録
    const buttonDef = { ...DadsButton.definition, name, registry: effectiveRegistry };
    WebComponentDefinition.compose(DadsButton, buttonDef).define(effectiveRegistry);
  }
}

/**
 * デフォルト名での登録
 */
export function defineDefaultButton(): void {
  defineButton();
}