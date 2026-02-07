// demo-reset-card.ts
// リセットCSS適用のデモコンポーネント
import { WebComponent, css, html } from '../core/web-components.js';
import { withReset } from '../styles/reset-css.js';
import { applySpacingTokens } from '../styles/spacing-tokens.js';
/**
 * リセットCSSありのカードコンポーネント
 * Shadow DOM内でkiso.cssのフルリセットを適用
 */
class ResetCard extends WebComponent {
}
ResetCard.definition = {
    name: 'reset-card',
    template: html `
      <article part="card">
        <h2 part="title">
          <slot name="title">カードタイトル</slot>
        </h2>
        <p part="description">
          <slot name="description">説明文がここに入ります。</slot>
        </p>
        <ul part="list">
          <li>リスト項目1</li>
          <li>リスト項目2</li>
          <li>リスト項目3</li>
        </ul>
        <button part="button">
          <slot name="action">アクション</slot>
        </button>
      </article>
    `,
    styles: withReset([
        applySpacingTokens(),
        css `
      :host {
        --card-padding: var(--spacing-6, 1.5rem);
        --card-border-radius: 12px;
        --card-border-color: #e0e0e0;
        --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      article {
        padding: var(--card-padding);
        border: 1px solid var(--card-border-color);
        border-radius: var(--card-border-radius);
        box-shadow: var(--card-shadow);
        background: white;
      }

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
        margin-bottom: var(--spacing-3, 0.75rem);
      }

      p {
        color: #666;
        margin-bottom: var(--spacing-4, 1rem);
      }

      ul {
        margin-bottom: var(--spacing-6, 1.5rem);
      }

      li {
        padding: var(--spacing-1, 0.25rem) 0;
        color: #555;
      }

      li::before {
        content: "▸ ";
        color: #0066cc;
      }

      button {
        background: #0066cc;
        color: white;
        padding: var(--spacing-2, 0.5rem) var(--spacing-6, 1.5rem);
        border: none;
        border-radius: 6px;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      button:hover {
        background: #0052a3;
      }

      button:active {
        transform: translateY(1px);
      }
    `
    ], 'full')
};
/**
 * リセットCSSなしのカードコンポーネント（比較用）
 */
class NoResetCard extends WebComponent {
}
NoResetCard.definition = {
    name: 'no-reset-card',
    template: html `
      <article part="card">
        <h2 part="title">
          <slot name="title">カードタイトル</slot>
        </h2>
        <p part="description">
          <slot name="description">説明文がここに入ります。</slot>
        </p>
        <ul part="list">
          <li>リスト項目1</li>
          <li>リスト項目2</li>
          <li>リスト項目3</li>
        </ul>
        <button part="button">
          <slot name="action">アクション</slot>
        </button>
      </article>
    `,
    // リセットCSSを使わず、ブラウザのデフォルトスタイルが残る
    styles: [
        applySpacingTokens(),
        css `
      :host {
        display: block;
        --card-padding: var(--spacing-6, 1.5rem);
        --card-border-radius: 12px;
        --card-border-color: #e0e0e0;
        --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      article {
        padding: var(--card-padding);
        border: 1px solid var(--card-border-color);
        border-radius: var(--card-border-radius);
        box-shadow: var(--card-shadow);
        background: white;
      }

      /* h2, p, ul, li にはブラウザデフォルトのmargin/paddingが残る */
      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
        /* ブラウザデフォルトのmarginが適用される */
      }

      p {
        color: #666;
        /* ブラウザデフォルトのmarginが適用される */
      }

      ul {
        /* ブラウザデフォルトのpadding-leftとmarginが適用される */
        color: #555;
      }

      li {
        color: #555;
        /* ブラウザデフォルトのlist-styleが適用される */
        padding: var(--spacing-1, 0.25rem) 0;
      }

      button {
        background: #0066cc;
        color: white;
        padding: var(--spacing-2, 0.5rem) var(--spacing-6, 1.5rem);
        border-radius: 6px;
        font-weight: 500;
        transition: background-color 0.2s;
        /* ブラウザデフォルトのborderが残る可能性 */
      }

      button:hover {
        background: #0052a3;
      }

      button:active {
        transform: translateY(1px);
      }
    `
    ]
};
/**
 * 最小限リセットのカードコンポーネント
 */
class MinimalResetCard extends WebComponent {
}
MinimalResetCard.definition = {
    name: 'minimal-reset-card',
    template: html `
      <article part="card">
        <h2 part="title">
          <slot name="title">カードタイトル</slot>
        </h2>
        <p part="description">
          <slot name="description">説明文がここに入ります。</slot>
        </p>
        <button part="button">
          <slot name="action">アクション</slot>
        </button>
      </article>
    `,
    styles: withReset([
        applySpacingTokens(),
        css `
      article {
        padding: var(--spacing-6, 1.5rem);
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: white;
      }

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: var(--spacing-2, 0.5rem);
      }

      p {
        color: #666;
        margin-bottom: var(--spacing-4, 1rem);
      }

      button {
        background: linear-gradient(to bottom, #4a90e2, #357abd);
        color: white;
        padding: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        filter: brightness(1.1);
      }
    `
    ], 'minimal')
};
// コンポーネントを登録
ResetCard.define();
NoResetCard.define();
MinimalResetCard.define();
export { ResetCard, NoResetCard, MinimalResetCard };
