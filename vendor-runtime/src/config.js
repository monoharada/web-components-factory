/**
 * Web Components設定管理モジュール
 * コンポーネント名のプレフィックスを一括管理
 *
 * SSR/Node環境対応: registryは遅延解決されるため、
 * import時点ではcustomElementsを参照しません。
 */
const DEFAULT_PREFIX = 'dads';
/**
 * 内部設定状態（registryは遅延解決のためnullで初期化）
 */
let currentConfig = {
    prefix: DEFAULT_PREFIX,
    registry: null,
};
/**
 * デフォルトのregistryを取得（DOM環境でのみ利用可能）
 * @throws SSR環境でregistryが未設定の場合
 */
function getDefaultRegistry() {
    if (typeof customElements !== 'undefined') {
        return customElements;
    }
    throw new Error('CustomElementRegistryが利用できない環境です。setConfig({ registry: ... })で明示的に指定してください。');
}
/**
 * 現在の設定を取得
 * registryが未設定の場合、DOM環境ならcustomElementsを使用
 * @returns 読み取り専用の設定オブジェクト
 */
export function getConfig() {
    const registry = currentConfig.registry ?? getDefaultRegistry();
    return Object.freeze({
        prefix: currentConfig.prefix,
        registry,
    });
}
/**
 * 設定を更新（部分更新可能）
 * undefinedの値は無視されます
 * 全コンポーネント定義前に呼び出す必要あり
 * @param config - 更新する設定（部分指定可能）
 */
export function setConfig(config) {
    // undefinedの値をフィルタリングして既存値を保護
    if (config.prefix !== undefined) {
        currentConfig.prefix = config.prefix;
    }
    if (config.registry !== undefined) {
        currentConfig.registry = config.registry;
    }
}
/**
 * 設定をデフォルトにリセット
 * registryはnullにリセットされ、次回getConfig時に再解決されます
 */
export function resetConfig() {
    currentConfig = {
        prefix: DEFAULT_PREFIX,
        registry: null,
    };
}
/**
 * 現在のprefixを取得（registryに依存しない）
 * SSR環境でも安全に呼び出し可能
 * @returns 現在設定されているprefix
 */
export function getPrefix() {
    return currentConfig.prefix;
}
/**
 * コンポーネント名を生成
 * @param baseName - 基本名（例: 'button', 'accordion-details'）
 * @param overridePrefix - 個別オーバーライド用プレフィックス
 * @returns 完全なコンポーネント名（例: 'dads-button'）
 */
export function getComponentName(baseName, overridePrefix) {
    const prefix = overridePrefix ?? currentConfig.prefix;
    return `${prefix}-${baseName}`;
}
