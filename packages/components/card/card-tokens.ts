/**
 * カードコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * ## トークン構造（2層）
 *
 * 1. **セマンティックトークン**（`--card-*`）
 *    - 内部使用のみ、外部からの変更は非推奨
 *    - DADSプリミティブトークンを意味的な名前にマッピング
 *
 * 2. **ローカルコンポーネントトークン**（`--dads-card-*`）
 *    - **公開API**: 外部からのカスタマイズ用
 *    - セマンティックトークンをデフォルト値として参照
 *    - これらのトークンを上書きすることでスタイルをカスタマイズ
 *
 * ## カスタマイズ例
 *
 * ```css
 * dads-card {
 *   --dads-card-background: transparent;
 *   --dads-card-border-width: 0;
 *   --dads-card-padding-block: var(--spacing-6);
 * }
 * ```
 *
 * ## 注意事項
 *
 * - `--card-*`（セマンティック）は内部実装詳細のため、直接上書きしない
 * - `--dads-card-*`（ローカル）のみを外部カスタマイズに使用
 * - Grid template等のレイアウト詳細は非公開（card-styles.tsで管理）
 */
import { css } from '../../core/web-components.js';

/**
 * カードセマンティックトークン（意味的な値）
 *
 * @internal 内部使用のみ - 外部からは`--dads-card-*`トークンを使用してください
 */
const cardSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    /* Container */
    --card-bg: var(--color-neutral-white, #ffffff);
    --card-border-color: var(--color-neutral-solid-gray-420, #949494);
    --card-border-width: 1px;
    --card-border-radius: var(--border-radius-16, 1rem);

    /* Divider (between areas) */
    --card-divider-color: var(--color-neutral-solid-gray-420, #949494);
    --card-divider-width: 1px;

    /* Layout */
    --card-media-width: calc(352 / 16 * 1rem);
    --card-media-aspect-ratio: auto;

    /* Spacing */
    --card-padding-block: var(--spacing-4, 1rem);
    --card-padding-inline: var(--spacing-6, 1.5rem);
    --card-gap: var(--spacing-4, 1rem);

    /* Typography - Base */
    --card-text-color: var(--color-neutral-solid-gray-800);

    /* Typography - Title (h1-h6) */
    --card-title-color: var(--color-neutral-solid-gray-900);
    --card-title-font-size: var(--font-size-20);
    --card-title-font-weight: var(--font-weight-700);
    --card-title-line-height: var(--line-height-150);
    --card-title-letter-spacing: 0.02em;

    /* Typography - Content (p) */
    --card-content-color: var(--color-neutral-solid-gray-800);
    --card-content-font-size: var(--font-size-16);
    --card-content-font-weight: var(--font-weight-400);
    --card-content-line-height: var(--line-height-170);
    --card-content-letter-spacing: 0.02em;
  }
`;

/**
 * カードローカルコンポーネントトークン（外部公開API）
 *
 * @public これらのトークンは外部からのカスタマイズに使用できます
 *
 * ## カテゴリ
 * - **Container**: 背景、ボーダー、角丸
 * - **Divider**: エリア間の区切り線
 * - **Layout**: メディア幅、アスペクト比
 * - **Spacing**: パディング、ギャップ
 * - **Typography**: タイトル・コンテンツの文字スタイル
 * - **Focus**: フォーカスリング（委譲モード時）
 */
const cardLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    /* Container */
    --dads-card-background: var(--card-bg);
    --dads-card-border-color: var(--card-border-color);
    --dads-card-border-width: var(--card-border-width);
    --dads-card-border-radius: var(--card-border-radius);

    /* Divider */
    --dads-card-divider-color: var(--card-divider-color);
    --dads-card-divider-width: var(--card-divider-width);

    /* Layout */
    --dads-card-media-width: var(--card-media-width);
    --dads-card-media-aspect-ratio: var(--card-media-aspect-ratio);

    /* Spacing */
    --dads-card-padding-block: var(--card-padding-block);
    --dads-card-padding-inline: var(--card-padding-inline);
    --dads-card-gap: var(--card-gap);

    /* Typography - Base */
    --dads-card-color: var(--card-text-color);

    /* Typography - Title */
    --dads-card-title-color: var(--card-title-color);
    --dads-card-title-font-size: var(--card-title-font-size);
    --dads-card-title-font-weight: var(--card-title-font-weight);
    --dads-card-title-line-height: var(--card-title-line-height);
    --dads-card-title-letter-spacing: var(--card-title-letter-spacing);

    /* Typography - Content */
    --dads-card-content-color: var(--card-content-color);
    --dads-card-content-font-size: var(--card-content-font-size);
    --dads-card-content-font-weight: var(--card-content-font-weight);
    --dads-card-content-line-height: var(--card-content-line-height);
    --dads-card-content-letter-spacing: var(--card-content-letter-spacing);

    /* Focus (uses shared focus tokens; values provided by applyDADSFocusStyles) */
    --dads-card-focus-outline-color: var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
    --dads-card-focus-outline-width: var(--dads-focus-outline-width, .25rem);
    --dads-card-focus-outline-offset: var(--dads-focus-outline-offset, .125rem);
    --dads-card-focus-ring-color: var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
    --dads-card-focus-ring-width: var(--dads-focus-ring-width, .125rem);
  }
`;

export const cardTokens = css`
  ${cardSemanticTokensText}
  ${cardLocalTokensText}
`;

