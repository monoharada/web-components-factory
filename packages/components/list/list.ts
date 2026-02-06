/**
 * @module list
 * デジタル庁デザインシステム 箇条書きリスト（List / List Item）コンポーネント
 * @version 1.0.0
 */

import {
  html,
  PropertyAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { listTokens, listItemTokens } from './list-tokens.js';
import { listStyles, listItemStyles } from './list-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';

type ListVariant = 'marker' | 'number';
type ListSpacing = 'lg' | 'md' | 'sm';

const VALID_VARIANTS: readonly ListVariant[] = ['marker', 'number'] as const;
const VALID_SPACINGS: readonly ListSpacing[] = ['lg', 'md', 'sm'] as const;

function normalizeVariant(value: string | null): ListVariant {
  if (!value) return 'marker';
  const trimmed = value.trim().toLowerCase();
  return (VALID_VARIANTS as readonly string[]).includes(trimmed) ? (trimmed as ListVariant) : 'marker';
}

function normalizeSpacing(value: string | null): ListSpacing {
  if (!value) return 'md';
  const trimmed = value.trim().toLowerCase();
  return (VALID_SPACINGS as readonly string[]).includes(trimmed) ? (trimmed as ListSpacing) : 'md';
}

function parseMarkerWidth(value: string | null): number | null {
  if (!value) return null;
  const n = Number(String(value).trim());
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
}

function findNearestAncestorList(element: Element): HTMLElement | null {
  let node: Element | null = element.parentElement;
  while (node) {
    if (node.tagName.toLowerCase() === 'dads-list') return node as HTMLElement;
    node = node.parentElement;
  }
  return null;
}

/**
 * 箇条書きリスト（コンテナ）コンポーネント
 *
 * @customElement
 * @tagname dads-list
 *
 * @slot default - リスト項目（dads-list-item）
 *
 * @csspart base - role="list" のルート
 *
 * @attr {'marker' | 'number'} variant - 表示タイプ（リストマーク / 項番）
 * @attr {'lg' | 'md' | 'sm'} spacing - 項目間隔（12/8/4）
 * @attr {number} marker-width - 項番タイプのマーカー幅（全角n文字相当、CSSでは n em）
 *
 * @cssprop --dads-list-indent - インデント（depthに応じて設定）
 * @cssprop --dads-list-item-gap - アイテム間隔（spacingに応じて設定）
 * @cssprop --dads-list-marker-width - マーカー列の幅（marker-widthで上書き可能）
 * @cssprop --dads-list-marker-gap - マーカー列と本文列の間隔
 * @cssprop --dads-list-marker-color - マーカー色
 * @cssprop --dads-list-marker-size - マーカー記号のサイズ（markerタイプ向け）
 * @cssprop --dads-list-marker-content - リストマーク（markerタイプ用、装飾用途）
 * @cssprop --dads-list-marker-content-1 - マーカー種別1（depth1）
 * @cssprop --dads-list-marker-content-2 - マーカー種別2（depth2-4）
 * @cssprop --dads-list-marker-content-3 - マーカー種別3（depth5+）
 *
 * @example
 * ```html
 * <!-- リストマークタイプ -->
 * <dads-list variant="marker" spacing="md">
 *   <dads-list-item>項目</dads-list-item>
 *   <dads-list-item>項目</dads-list-item>
 * </dads-list>
 *
 * <!-- 項番タイプ（<ol>は使わず、項番は地のテキストとして記載） -->
 * <dads-list variant="number" marker-width="2">
 *   <dads-list-item>
 *     <span slot="marker">1.</span>
 *     本文
 *   </dads-list-item>
 * </dads-list>
 * ```
 */
export class DadsList extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-list',
    template: html`
      <div part="base" role="list">
        <slot></slot>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      listTokens,
      listStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('spacing'),
      PropertyAttr('markerWidth', 'marker-width'),
    ],
  };

  declare variant: string | null;
  declare spacing: string | null;
  declare markerWidth: string | null;

  #rawDepth = 1;

  connectedCallback(): void {
    super.connectedCallback();
    this.#applyDefaultAttributes();

    this.#syncVariant();
    this.#syncSpacing();
    this.#syncVariantRenderingVars();
    this.#syncRawDepth();
    this.#syncClampedDepth();
    this.#syncMarkerWidth();
  }

  variantChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeVariant(newValue);
    if (newValue !== normalized) {
      this.setAttribute('variant', normalized);
      return;
    }
    this.#syncVariantRenderingVars();
    this.#syncClampedDepth();
  }

  spacingChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeSpacing(newValue);
    if (newValue !== normalized) {
      this.setAttribute('spacing', normalized);
    }
  }

  markerWidthChanged(): void {
    this.#syncMarkerWidth();
  }

  #syncVariant(): void {
    const normalized = normalizeVariant(this.getAttribute('variant'));
    if (this.getAttribute('variant') !== normalized) this.setAttribute('variant', normalized);
  }

  #applyDefaultAttributes(): void {
    setDefaultAttributes(this, {
      variant: 'marker',
    });

    if (this.hasAttribute('spacing')) return;

    const ancestor = findNearestAncestorList(this);
    if (!ancestor) {
      this.setAttribute('spacing', 'md');
      return;
    }

    const inherited = normalizeSpacing(ancestor.getAttribute('spacing'));
    this.setAttribute('spacing', inherited);
  }

  #syncSpacing(): void {
    const normalized = normalizeSpacing(this.getAttribute('spacing'));
    if (this.getAttribute('spacing') !== normalized) this.setAttribute('spacing', normalized);
  }

  #syncRawDepth(): void {
    // Count ancestor dads-list elements in the light DOM tree (excluding self).
    let depth = 1;
    let el: Element | null = this.parentElement;
    while (el) {
      if (el.tagName.toLowerCase() === 'dads-list') depth += 1;
      el = el.parentElement;
    }
    this.#rawDepth = depth;
  }

  #syncClampedDepth(): void {
    const variant = normalizeVariant(this.getAttribute('variant'));
    const max = variant === 'marker' ? 6 : 5;
    const clamped = Math.max(1, Math.min(max, this.#rawDepth));
    this.setAttribute('data-depth', String(clamped));
  }

  #syncVariantRenderingVars(): void {
    const isNumber = normalizeVariant(this.getAttribute('variant')) === 'number';
    this.style.setProperty('--dads-list-marker-slot-display', isNumber ? 'inline' : 'none');
  }

  #syncMarkerWidth(): void {
    const n = parseMarkerWidth(this.getAttribute('marker-width'));
    if (n === null) {
      this.style.removeProperty('--dads-list-marker-width');
      return;
    }
    this.style.setProperty('--dads-list-marker-width', `${n}em`);
  }
}

/**
 * 箇条書きリスト（アイテム）コンポーネント
 *
 * @customElement
 * @tagname dads-list-item
 *
 * @slot marker - 項番（numberタイプ向け、コピー可能な“地のテキスト”）
 * @slot default - 本文（ネストした dads-list を含められます）
 *
 * @csspart item - role="listitem" のルート
 * @csspart marker - マーカー列
 * @csspart marker-glyph - 予備のマーカー記号領域（通常は非表示）
 * @csspart content - 本文列
 *
 * @cssprop --dads-list-marker-width - マーカー列の幅
 * @cssprop --dads-list-marker-gap - マーカー列と本文列の間隔
 * @cssprop --dads-list-marker-color - マーカー色
 * @cssprop --dads-list-marker-size - マーカー記号のサイズ（markerタイプ向け）
 * @cssprop --dads-list-marker-content - リストマーク（markerタイプ用、装飾用途）
 */
export class DadsListItem extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-list-item',
    template: html`
      <div part="item" role="listitem">
        <span part="marker">
          <span part="marker-glyph" aria-hidden="true"></span>
          <slot name="marker"></slot>
        </span>
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      listItemTokens,
      listItemStyles,
    ], 'minimal'),
    attributes: [],
  };
}
