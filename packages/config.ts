/**
 * Web Components設定管理モジュール
 * コンポーネント名のプレフィックスを一括管理
 */

/**
 * DADS設定インターフェース
 */
export interface DADSConfig {
  /** コンポーネント名のプレフィックス（例: 'dads' → 'dads-button'） */
  prefix: string;
  /** デフォルトのCustomElementRegistry */
  registry: CustomElementRegistry;
}

const DEFAULT_CONFIG: DADSConfig = {
  prefix: 'dads',
  registry: customElements,
};

let currentConfig: DADSConfig = { ...DEFAULT_CONFIG };

/**
 * 現在の設定を取得
 * @returns 読み取り専用の設定オブジェクト
 */
export function getConfig(): Readonly<DADSConfig> {
  return Object.freeze({ ...currentConfig });
}

/**
 * 設定を更新（部分更新可能）
 * 全コンポーネント定義前に呼び出す必要あり
 * @param config - 更新する設定（部分指定可能）
 */
export function setConfig(config: Partial<DADSConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * 設定をデフォルトにリセット
 */
export function resetConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

/**
 * コンポーネント名を生成
 * @param baseName - 基本名（例: 'button', 'accordion-details'）
 * @param overridePrefix - 個別オーバーライド用プレフィックス
 * @returns 完全なコンポーネント名（例: 'dads-button'）
 */
export function getComponentName(baseName: string, overridePrefix?: string): string {
  const prefix = overridePrefix ?? currentConfig.prefix;
  return `${prefix}-${baseName}`;
}
