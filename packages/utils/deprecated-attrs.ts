/**
 * 非推奨属性の定義と警告ユーティリティ
 * DADS公式アクセシビリティガイドラインに基づく
 */

// Node.js process グローバル変数の型定義（ブラウザでは未定義）
declare const process: { env?: { NODE_ENV?: string } } | undefined;

/**
 * 非推奨属性の設定インターフェース
 */
export interface DeprecatedAttrConfig {
  /** 属性名 */
  name: string;
  /** 非推奨の理由 */
  reason: string;
  /** 推奨される代替手段 */
  alternative: string;
  /** 詳細ドキュメントURL */
  docsUrl?: string;
}

/**
 * フォーム要素で非推奨の属性一覧
 */
export const DEPRECATED_FORM_ATTRS: DeprecatedAttrConfig[] = [
  {
    name: 'placeholder',
    reason:
      'プレースホルダーはコントラスト比が低く、入力中に消えるためアクセシビリティ上の問題があります',
    alternative: 'support-text属性を使用してください',
    docsUrl:
      'https://design.digital.go.jp/dads/components/input-text/accessibility/',
  },
];

/**
 * 非推奨属性の設定を名前で検索
 */
export function findDeprecatedAttr(
  name: string
): DeprecatedAttrConfig | undefined {
  return DEPRECATED_FORM_ATTRS.find((config) => config.name === name);
}

/**
 * 非推奨属性をチェックし警告を出力
 * 開発モードでのみ有効
 *
 * @param element - 対象要素
 * @param attrName - 属性名
 * @param config - 非推奨属性の設定
 */
export function warnDeprecatedAttr(
  element: HTMLElement,
  attrName: string,
  config: DeprecatedAttrConfig
): void {
  // 本番環境では警告を出さない
  if (
    typeof process !== 'undefined' &&
    process.env?.NODE_ENV === 'production'
  ) {
    return;
  }

  const tagName = element.tagName.toLowerCase();
  const docsLine = config.docsUrl ? `\n詳細: ${config.docsUrl}` : '';

  console.warn(
    `[DADS Warning] <${tagName}>: "${attrName}" 属性は非推奨です。\n` +
      `理由: ${config.reason}\n` +
      `代替: ${config.alternative}${docsLine}`
  );
}

/**
 * 要素の非推奨属性をチェックし、見つかった場合は警告を出力
 *
 * @param element - チェック対象の要素
 * @param deprecatedAttrs - チェックする非推奨属性の設定配列
 * @returns 見つかった非推奨属性名の配列
 */
export function checkDeprecatedAttrs(
  element: HTMLElement,
  deprecatedAttrs: DeprecatedAttrConfig[] = DEPRECATED_FORM_ATTRS
): string[] {
  const foundDeprecated: string[] = [];

  for (const config of deprecatedAttrs) {
    if (element.hasAttribute(config.name)) {
      warnDeprecatedAttr(element, config.name, config);
      foundDeprecated.push(config.name);
    }
  }

  return foundDeprecated;
}
