/**
 * Design Tokens - 統一エントリーポイント
 * プリロード用: /styles/tokens.js
 *
 * 全デザイントークンをこのファイルから一括エクスポート
 */

// グローバルトークン（デジタル庁デザインシステム）
export { applyDADSTokens, componentTokens } from './design-tokens/index.js';

// Spacing tokens (scale + derived)
export { applySpacingTokens } from './spacing-tokens.js';

// ボタンコンポーネント用トークン
export {
  buttonTokens,
  buttonSemanticTokens,
  buttonLocalTokens,
  type ButtonTokens,
} from './design-tokens/button-tokens.js';

// タイポグラフィトークン
export {
  typographyTokens,
  typographyPrimitiveTokens,
  typographySemanticTokens,
  typographyLocalTokens,
  fontImport,
  type TypographyTokens,
  type TypographyVariant,
  type TypographySize,
  type TypographyWeight,
} from './design-tokens/typography-tokens.js';

// アコーディオンコンポーネント用トークン
export {
  accordionTokens,
  generateCSSVariables,
  createIconSVG,
} from './design-tokens/accordion-tokens.js';
