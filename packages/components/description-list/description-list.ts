/**
 * @module description-list
 * デジタル庁デザインシステム Description List コンポーネント
 * @version 1.0.0
 */

import { PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { createDescriptionListTokens } from './description-list-tokens.js';
import { createDescriptionListStyles } from './description-list-styles.js';

type DescriptionListMarker = 'none' | 'bullet' | 'custom';

const VALID_MARKERS: readonly DescriptionListMarker[] = ['none', 'bullet', 'custom'] as const;
const DEFAULT_MARKER: DescriptionListMarker = 'none';
const MARKER_ATTR = 'marker';
const DATA_MARKER_ATTR = 'data-marker';
const BASE_ATTR = 'data-dads-description-list-base';

function normalizeMarker(value: string | null): DescriptionListMarker {
  if (!value) return DEFAULT_MARKER;
  const trimmed = value.trim().toLowerCase();
  return (VALID_MARKERS as readonly string[]).includes(trimmed)
    ? (trimmed as DescriptionListMarker)
    : DEFAULT_MARKER;
}

/**
 * 説明リストコンポーネント
 *
 * DADS HTML 実装と互換の `dt` / `dd` 構造を受け入れる light DOM コンポーネント。
 *
 * @customElement dads-description-list
 * @tagname dads-description-list
 *
 * @slot default - 説明リスト項目（例: div > dt + dd）
 *
 * @attr {'none' | 'bullet' | 'custom'} marker - マーカー表示種別
 * @attr {'none' | 'bullet' | 'custom'} data-marker - DADS HTML 互換属性（marker と同期）
 *
 * @cssprop --dads-description-list-margin-block - ブロック方向マージン
 * @cssprop --dads-description-list-item-gap - 項目間の行間
 * @cssprop --dads-description-list-indent - dt/dd のインデント
 * @cssprop --dads-description-list-term-font-weight - 用語（dt）の文字ウェイト
 * @cssprop --dads-description-list-overflow-wrap - 折り返し規則
 *
 * @example
 * ```html
 * <dads-description-list marker="none">
 *   <div>
 *     <dt>項目名1</dt>
 *     <dd>これは項目1の説明文です。</dd>
 *   </div>
 *   <div>
 *     <dt>項目名2</dt>
 *     <dd>これは項目2の説明文です。</dd>
 *   </div>
 * </dads-description-list>
 * ```
 */
export class DadsDescriptionList extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-description-list',
    shadowOptions: null,
    styles: [
      createDescriptionListTokens('dads-description-list'),
      createDescriptionListStyles('dads-description-list'),
    ],
    attributes: [
      PropertyAttr('marker'),
      PropertyAttr('dataMarker', 'data-marker'),
    ],
  };

  declare marker: string | null;
  declare dataMarker: string | null;

  #isSyncing = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.#ensureDefinitionListStructure();
    this.#syncInitialMarker();
  }

  markerChanged(_oldValue: string | null, newValue: string | null): void {
    this.#syncMarker(MARKER_ATTR, newValue);
  }

  dataMarkerChanged(_oldValue: string | null, newValue: string | null): void {
    this.#syncMarker(DATA_MARKER_ATTR, newValue);
  }

  #syncInitialMarker(): void {
    if (this.hasAttribute(MARKER_ATTR)) {
      this.#syncMarker(MARKER_ATTR, this.getAttribute(MARKER_ATTR));
      return;
    }
    if (this.hasAttribute(DATA_MARKER_ATTR)) {
      this.#syncMarker(DATA_MARKER_ATTR, this.getAttribute(DATA_MARKER_ATTR));
      return;
    }
    this.#syncMarker(MARKER_ATTR, DEFAULT_MARKER);
  }

  #ensureDefinitionListStructure(): void {
    const base = this.#findOrCreateBaseList();
    for (const node of Array.from(this.childNodes)) {
      if (node === base) continue;
      base.append(node);
    }
    this.#syncBasePart(base);
  }

  #findOrCreateBaseList(): HTMLDListElement {
    const existing = Array.from(this.children).find(
      (el): el is HTMLDListElement => el.tagName.toLowerCase() === 'dl'
    );
    if (existing) return existing;
    const created = document.createElement('dl');
    this.append(created);
    return created;
  }

  #syncBasePart(base: HTMLDListElement): void {
    base.setAttribute(BASE_ATTR, '');
    const part = new Set((base.getAttribute('part') ?? '').split(/\s+/).filter(Boolean));
    part.add('base');
    base.setAttribute('part', Array.from(part).join(' '));
  }

  #syncMarker(source: typeof MARKER_ATTR | typeof DATA_MARKER_ATTR, value: string | null): void {
    if (this.#isSyncing) return;

    const normalized = normalizeMarker(value);
    const attrs =
      source === MARKER_ATTR
        ? [MARKER_ATTR, DATA_MARKER_ATTR]
        : [DATA_MARKER_ATTR, MARKER_ATTR];

    this.#isSyncing = true;
    try {
      for (const attr of attrs) this.#setAttributeIfChanged(attr, normalized);
    } finally {
      this.#isSyncing = false;
    }
  }

  #setAttributeIfChanged(name: string, value: string): void {
    if (this.getAttribute(name) !== value) this.setAttribute(name, value);
  }
}
