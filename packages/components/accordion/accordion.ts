/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
 * details/summary要素 + ::part()ベースの実装
 * @version 3.0.0
 */

import { 
  html, 
  css, 
  BooleanAttr, 
  PropertyAttr 
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { 
  accordionTokens,
  createIconSVG
} from '../../styles/design-tokens/accordion-tokens.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { accordionItemStyles } from '../../styles/accordion-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

/**
 * アコーディオンコンテナコンポーネント
 */
export class DadsAccordionDetails extends TypographyWebComponent {
  #allowMultiple = false;

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'コンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        'アコーディオンは、子要素（dads-accordion-item-details）をグルーピングして表示します。',
        '各アイテムは内部で <details>/<summary> を使い、ネイティブの展開/折りたたみセマンティクスを活用します。',
        'コンテナ内部は role="group" として関連コンテンツのまとまりを示します。',
      ],
      keyboard: [
        '各アイテムの見出し（summary）はTabでフォーカスでき、Enter/Spaceで展開/折りたたみできます（ネイティブ挙動）。',
        '本文内の「先頭に戻る」リンクはTabでフォーカスでき、クリックで見出しへスクロール+フォーカスします。',
      ],
      zoom: [
        'テキストの折り返し・行間を前提に、ズーム/文字サイズ変更でも情報が欠けないようにします。',
        '横幅が狭い場合も、パネル/本文が縦に積まれて操作できることを想定します（ドキュメント側のレイアウトも含む）。',
      ],
      states: [
        '単一展開モードでは、あるアイテムが開くと他の開いているアイテムが閉じます（allow-multiple未指定時）。',
        'アイテムは expanded/disabled 属性で状態を制御できます（内部の <details> に反映）。',
        '見出し左のアイコン（矢印）は、ロービジョン等で画面拡大して閲覧するユーザーに対して、開閉状況を視覚的に示す補助情報です。',
      ],
      labels: [
        '見出しスロット（slot="header"）のテキストが、アイテムの主要ラベルとして機能します。',
        '「先頭に戻る」リンクは見出しテキストを含む説明的なリンクテキストを持ちます。',
      ],
      motion: [
        'animation 属性でアニメーション方針を切り替えできます。',
        'respect-motion-preference を指定した場合、prefers-reduced-motion: reduce では animation="none" を優先します。',
      ],
    },
    callouts: [
      {
        id: 'item-header',
        title: '見出し（header）',
        label: 'slot="header"',
        description: '展開/折りたたみの操作起点（内部は <summary>）。',
        category: 'keyboard',
        placement: 'top-right',
        target: { hostSelector: 'dads-accordion-item-details', selector: '[slot="header"]' },
      },
      {
        id: 'state-icon',
        title: '開閉状態アイコン',
        label: 'aria-hidden="true"',
        description:
          '見出しの文頭に配置し、開閉状態を視覚的に示します（スクリーンリーダー向けには aria-hidden）。',
        category: 'states',
        placement: 'top-left',
        target: { hostSelector: 'dads-accordion-item-details', scope: 'shadow', selector: '[part="icon"]' },
      },
      {
        id: 'item-content',
        title: '本文（content）',
        label: 'slot="content"',
        description: '展開時に表示されるコンテンツ領域。',
        category: 'semantics',
        placement: 'bottom-right',
        target: { hostSelector: 'dads-accordion-item-details', selector: '[slot="content"]' },
      },
      {
        id: 'return-link',
        title: '先頭に戻るリンク',
        label: '「[見出し]」の先頭に戻る',
        description: '本文内から見出しへ戻る補助リンク。見出しテキストを含む説明的なリンクテキスト。',
        category: 'labels',
        placement: 'bottom-right',
        target: { hostSelector: 'dads-accordion-item-details', scope: 'shadow', selector: '[part="return-button"]' },
      },
    ],
  };

  static definition = {
    name: 'dads-accordion-details',
    template: html`
      <div part="container" role="group">
        <slot></slot>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      accordionTokens,
      css`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+Mono&display=swap');
        :host {
          display: block;
          width: 100%;
        }
      `
    ], 'minimal'),
    attributes: [
      BooleanAttr('allow-multiple'),
      PropertyAttr('animation'),
      BooleanAttr('respect-motion-preference')
    ]
  };

  connectedCallback() {
    super.connectedCallback();

    this.#allowMultiple = this.hasAttribute('allow-multiple');
    
    // デフォルト設定
    if (!this.hasAttribute('animation')) {
      this.setAttribute('animation', 'none');
    }
    
    // モーション設定の尊重
    if (this.hasAttribute('respect-motion-preference')) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        this.setAttribute('animation', 'none');
      }
    }
    
    // 単一展開モードの処理
    this.addEventListener('toggle', (e: Event) => {
      if (this.#allowMultiple) return;

      const target = e.target as HTMLElement | null;
      const openedDetails =
        target?.tagName === 'DETAILS'
          ? (target as HTMLDetailsElement)
          : (target?.tagName === 'DADS-ACCORDION-ITEM-DETAILS'
              ? ((target as DadsAccordionItemDetails).shadowRoot?.querySelector(
                  '[part="details"]',
                ) as HTMLDetailsElement | null)
              : null);

      if (!openedDetails?.open) return;

      const items = this.querySelectorAll('dads-accordion-item-details');
      for (const item of items) {
        const details = item.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement | null;
        if (details && details !== openedDetails && details.open) {
          details.open = false;
        }
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'allow-multiple') {
      this.#allowMultiple = newValue !== null;
    }
  }
}

/**
 * アコーディオンアイテムコンポーネント
 */
export class DadsAccordionItemDetails extends TypographyWebComponent {
  #details?: HTMLDetailsElement;

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'コンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        '内部は <details>/<summary> で実装し、ネイティブの状態（open）とセマンティクスを利用します。',
        '見出し左（文頭）にアイコンを置き、開閉状態を視覚的に補助します（スクリーンリーダー向けには aria-hidden）。',
        '見出しスロット（slot="header"）が、summary内に配置されます。',
        '本文スロット（slot="content"）が、detailsのコンテンツ領域に配置されます。',
      ],
      keyboard: [
        'summary はTabでフォーカス可能です。',
        'Enter/Spaceで展開/折りたたみができます（ネイティブ挙動）。',
        '本文内の「先頭に戻る」リンクで、見出しへスクロール+フォーカスできます。',
      ],
      zoom: [
        'ヘッダー/本文はテキストの折り返しを前提に設計します。',
        'ズーム時にボタンやフォーカスリングが欠けない余白を確保します。',
      ],
      states: [
        'expanded 属性で初期展開状態を制御できます（内部 <details>.open に反映）。',
        'disabled 属性で無効状態を制御できます（内部 <details> の disabled に反映）。',
        '開閉状態は、矢印アイコンの向き/回転でも視覚的に示します（ロービジョン等での認知補助）。',
      ],
      labels: [
        '見出しのラベルは slot="header" のテキストで決まります。',
        '戻るリンクは「[見出し]」の先頭に戻る形式で、説明的なリンクテキストを持ちます。',
      ],
      motion: [
        '戻る操作は smooth scroll を行います（必要に応じて reduced motion を考慮します）。',
        'コンテナ側の animation 設定により、展開/折りたたみの見え方が変わります。',
      ],
    },
    callouts: [
      {
        id: 'icon',
        title: '開閉状態アイコン',
        label: 'aria-hidden="true"',
        description: '開閉状態を視覚的に示すアイコン（aria-hidden）。',
        category: 'states',
        placement: 'top-left',
        target: { scope: 'shadow', selector: '[part="icon"]' },
      },
      {
        id: 'summary',
        title: 'summary（見出し）',
        label: '<summary>',
        description: '展開/折りたたみの操作起点。',
        category: 'keyboard',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="summary"]' },
      },
      {
        id: 'content',
        title: 'content（本文領域）',
        label: '<div part="content">',
        description: '展開時に表示されるコンテンツ領域。',
        category: 'semantics',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="content"]' },
      },
      {
        id: 'return-link',
        title: '先頭に戻るリンク',
        label: '「[見出し]」の先頭に戻る',
        description: '本文内から見出しへ戻る補助リンク。見出しテキストを含む説明的なリンクテキスト。',
        category: 'labels',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="return-button"]' },
      },
    ],
  };

  static definition = {
    name: 'dads-accordion-item-details',
    template: html`
      <details part="details">
        <summary part="summary">
          <span part="icon" aria-hidden="true">
            ${createIconSVG('arrowDown', 'icon-svg', 20)}
          </span>
          <span part="header">
            <slot name="header"></slot>
          </span>
        </summary>
        <div part="content">
          <div part="content-inner">
            <slot name="content"></slot>
            <a
              part="return-button"
              href="#"
            >
              ${createIconSVG('returnArrow', 'return-icon', 24)}
              <span part="return-text">先頭に戻る</span>
            </a>
          </div>
        </div>
      </details>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      accordionTokens,
      accordionItemStyles,
      applyDADSFocusStyles(),
      css`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+Mono&display=swap');`
    ], 'full'),
    attributes: [
      BooleanAttr('expanded'),
      BooleanAttr('disabled'),
      PropertyAttr('icon-position')
    ]
  };

  connectedCallback() {
    super.connectedCallback();
    
    this.#details = this.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement;
    
    // 初期状態の設定
    if (this.hasAttribute('expanded')) {
      this.#details.open = true;
    }
    
    // イベント設定
    this.#details?.addEventListener('toggle', () => {
      this.dispatchEvent(new Event('toggle', { bubbles: true }));
    });
    
    // 戻るリンク
    const returnLink = this.shadowRoot?.querySelector('[part="return-button"]');
    const returnText = this.shadowRoot?.querySelector('[part="return-text"]');

    // 見出しテキストを取得してリンクテキストに反映
    this.#updateReturnLinkText(returnText);

    // headerスロットの変更を監視
    const headerSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="header"]');
    headerSlot?.addEventListener('slotchange', () => {
      this.#updateReturnLinkText(returnText);
    });

    returnLink?.addEventListener('click', (e) => {
      e.preventDefault();  // リンクのデフォルト動作を防止
      e.stopPropagation();
      const summary = this.shadowRoot?.querySelector('[part="summary"]') as HTMLElement;
      summary?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      summary?.focus();
    });
  }

  #updateReturnLinkText(returnText: Element | null | undefined): void {
    if (!returnText) return;

    const headerSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="header"]');
    const assignedNodes = headerSlot?.assignedNodes({ flatten: true }) ?? [];

    let headerText = '';
    for (const node of assignedNodes) {
      headerText += node.textContent ?? '';
    }
    headerText = headerText.trim();

    if (headerText) {
      returnText.textContent = `「${headerText}」の先頭に戻る`;
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (!this.#details) return;
    
    if (name === 'expanded') {
      this.#details.open = newValue !== null;
    } else if (name === 'disabled') {
      this.#details.toggleAttribute('disabled', newValue !== null);
    }
  }
  
  // Public API
  toggle() { this.#details && (this.#details.open = !this.#details.open); }
  expand() { this.#details && (this.#details.open = true); }
  collapse() { this.#details && (this.#details.open = false); }
}

// コンポーネントの登録は定義ファイルで行う
