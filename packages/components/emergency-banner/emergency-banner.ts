/**
 * @module emergency-banner
 * デジタル庁デザインシステム 緊急時バナーコンポーネント
 * @version 1.0.0
 */

import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { isSafeHref } from '../../utils/safe-href.js';
import { emergencyBannerTokens } from './emergency-banner-tokens.js';
import { emergencyBannerStyles } from './emergency-banner-styles.js';

type HeadingLevel = '2' | '3' | '4' | '5' | '6';
type PrefixMode = 'auto' | 'manual';
type LinkTarget = '_self' | '_blank';
const NEW_TAB_ANNOUNCEMENT = '新規タブで開きます';

const VALID_HEADING_LEVELS = new Set<HeadingLevel>(['2', '3', '4', '5', '6']);
const VALID_PREFIX_MODES = new Set<PrefixMode>(['auto', 'manual']);
const VALID_TARGETS = new Set<LinkTarget>(['_self', '_blank']);

const DEFAULT_ATTRIBUTE_VALUES = [
  ['heading-level', '2'],
  ['prefix-mode', 'auto'],
  ['prefix-label', '【緊急】'],
  ['target', '_self'],
] as const;

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function parseIdRefs(value: string | null): string[] {
  const normalized = normalizeText(value);
  if (!normalized) return [];
  return normalized.split(' ').filter((id) => id.length > 0);
}

function escapeAttributeValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function findElementById(source: Element, id: string): Element | null {
  if (!id) return null;

  const selector = `[id="${escapeAttributeValue(id)}"]`;
  const root = source.getRootNode();
  if (root instanceof Document || root instanceof ShadowRoot) {
    const inRoot = root.querySelector(selector);
    if (inRoot) return inRoot;
  }

  const ownerDocument = source.ownerDocument;
  if (!ownerDocument) return null;

  const byId = ownerDocument.getElementById(id);
  if (byId) return byId;

  return ownerDocument.querySelector(selector);
}

function getAriaLabelledbyText(element: Element, visited: Set<Element>): string {
  const ids = parseIdRefs(element.getAttribute('aria-labelledby'));
  if (ids.length === 0) return '';

  const label = ids
    .map((id) => {
      const labelledElement = findElementById(element, id);
      if (!labelledElement || labelledElement === element) return '';
      return getNodeAccessibleText(labelledElement, visited, true);
    })
    .filter((segment) => segment.length > 0)
    .join(' ');

  return normalizeText(label);
}

function isMeaningfulNode(node: Node): boolean {
  return getNodeAccessibleText(node).length > 0;
}

function getNodeAccessibleText(node: Node, visited = new Set<Element>(), includeHidden = false): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return normalizeText(node.textContent);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const element = node as Element;
  if (!includeHidden && element.hasAttribute('hidden')) return '';
  if (visited.has(element)) return '';
  visited.add(element);

  const ariaLabel = normalizeText(element.getAttribute('aria-label'));
  if (ariaLabel) return ariaLabel;

  const ariaLabelledbyText = getAriaLabelledbyText(element, visited);
  if (ariaLabelledbyText) return ariaLabelledbyText;

  return normalizeText(element.textContent);
}

/**
 * 緊急時バナーコンポーネント
 *
 * @customElement
 * @tagname dads-emergency-banner
 *
 * @slot heading - 見出し本文
 * @slot timestamp - 更新日時
 * @slot default - 本文
 * @slot action - CTAラベル
 *
 * @csspart base - ルート要素
 * @csspart header - ヘッダー領域
 * @csspart heading - 見出し領域
 * @csspart prefix - 見出し接頭辞
 * @csspart timestamp - 更新日時領域
 * @csspart body - 本文領域
 * @csspart action - CTAコンテナ
 * @csspart action-link - CTAリンク
 * @csspart action-label - CTAラベル
 * @csspart action-icon - 新規タブアイコン
 *
 * @attr {'2' | '3' | '4' | '5' | '6'} heading-level - 見出しレベル
 * @attr {'auto' | 'manual'} prefix-mode - 接頭辞表示モード
 * @attr {string} prefix-label - 接頭辞テキスト
 * @attr {string} href - CTAリンク先
 * @attr {'_self' | '_blank'} target - CTAリンクターゲット
 * @attr {string} rel - CTAリンクrel
 *
 * @cssprop --dads-emergency-banner-border-color - 外枠色
 * @cssprop --dads-emergency-banner-background - 背景色
 * @cssprop --dads-emergency-banner-color - 本文文字色
 * @cssprop --dads-emergency-banner-heading-color - 見出し色
 * @cssprop --dads-emergency-banner-action-background - CTA背景色
 * @cssprop --dads-emergency-banner-action-background-hover - CTAホバー背景色
 * @cssprop --dads-emergency-banner-action-color - CTA文字色
 * @cssprop --dads-emergency-banner-action-border-radius - CTA角丸
 *
 * @example
 * ```html
 * <dads-emergency-banner href="https://example.com/evacuation" target="_blank">
 *   <span slot="heading">〇〇地区に避難準備情報が発令されました</span>
 *   <time slot="timestamp" datetime="2024-01-01T06:00:00+09:00">2024年1月1日 06:00更新</time>
 *   <p>お年寄りの方等避難に時間がかかる方は、直ちに指定避難所へ避難してください。</p>
 *   <span slot="action">指定避難所を確認する</span>
 * </dads-emergency-banner>
 * ```
 */
export class DadsEmergencyBanner extends TypographyWebComponent {
  static definition = {
    name: 'dads-emergency-banner',
    template: html`
      <div part="base" id="base" role="region" aria-labelledby="heading">
        <div part="header" id="header">
          <div part="heading" id="heading" role="heading" aria-level="2">
            <span part="prefix" id="prefix">【緊急】</span>
            <slot name="heading" id="heading-slot">緊急情報</slot>
          </div>
          <div part="timestamp" id="timestamp" hidden>
            <slot name="timestamp" id="timestamp-slot"></slot>
          </div>
        </div>

        <div part="body" id="body" hidden>
          <slot id="body-slot"></slot>
        </div>

        <div part="action" id="action" hidden>
          <a part="action-link" id="action-link">
            <span part="action-label" id="action-label">
              <slot name="action" id="action-slot"></slot>
            </span>
            <span part="action-icon" id="action-icon" hidden>
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                <path d="M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z" fill="currentcolor"></path>
              </svg>
            </span>
          </a>
        </div>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), emergencyBannerTokens, emergencyBannerStyles], 'minimal'),
    attributes: [
      PropertyAttr('headingLevel', 'heading-level'),
      PropertyAttr('prefixMode', 'prefix-mode'),
      PropertyAttr('prefixLabel', 'prefix-label'),
      PropertyAttr('href'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
    ],
  };

  declare headingLevel: string | null;
  declare prefixMode: string | null;
  declare prefixLabel: string | null;
  declare href: string | null;
  declare target: string | null;
  declare rel: string | null;

  #heading: HTMLElement | null = null;
  #prefix: HTMLElement | null = null;
  #timestamp: HTMLElement | null = null;
  #body: HTMLElement | null = null;
  #action: HTMLElement | null = null;
  #actionLink: HTMLAnchorElement | null = null;
  #actionIcon: HTMLElement | null = null;

  #timestampSlot: HTMLSlotElement | null = null;
  #bodySlot: HTMLSlotElement | null = null;
  #actionSlot: HTMLSlotElement | null = null;

  #observer: MutationObserver | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    this.#heading = this.shadowRoot?.querySelector('#heading') ?? null;
    this.#prefix = this.shadowRoot?.querySelector('#prefix') ?? null;
    this.#timestamp = this.shadowRoot?.querySelector('#timestamp') ?? null;
    this.#body = this.shadowRoot?.querySelector('#body') ?? null;
    this.#action = this.shadowRoot?.querySelector('#action') ?? null;
    this.#actionLink = this.shadowRoot?.querySelector('#action-link') as HTMLAnchorElement | null;
    this.#actionIcon = this.shadowRoot?.querySelector('#action-icon') ?? null;

    this.#timestampSlot = this.shadowRoot?.querySelector('#timestamp-slot') as HTMLSlotElement | null;
    this.#bodySlot = this.shadowRoot?.querySelector('#body-slot') as HTMLSlotElement | null;
    this.#actionSlot = this.shadowRoot?.querySelector('#action-slot') as HTMLSlotElement | null;

    this.#ensureDefaultAttributes();
    this.#bindEvents();
    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#timestampSlot?.removeEventListener('slotchange', this.#onSlotChange);
    this.#bodySlot?.removeEventListener('slotchange', this.#onSlotChange);
    this.#actionSlot?.removeEventListener('slotchange', this.#onSlotChange);
    this.#observer?.disconnect();
    this.#observer = null;
    super.disconnectedCallback();
  }

  headingLevelChanged(): void {
    this.#syncHeading();
  }

  prefixModeChanged(): void {
    this.#syncPrefix();
  }

  prefixLabelChanged(): void {
    this.#syncPrefix();
  }

  hrefChanged(): void {
    this.#syncAction();
  }

  targetChanged(): void {
    this.#syncTargetAttribute();
    this.#syncAction();
  }

  relChanged(): void {
    this.#syncAction();
  }

  #onSlotChange = (): void => {
    this.#syncTimestamp();
    this.#syncBody();
    this.#syncAction();
  };

  #ensureDefaultAttributes(): void {
    for (const [name, value] of DEFAULT_ATTRIBUTE_VALUES) {
      if (!this.hasAttribute(name)) this.setAttribute(name, value);
    }
  }

  #bindEvents(): void {
    this.#timestampSlot?.removeEventListener('slotchange', this.#onSlotChange);
    this.#bodySlot?.removeEventListener('slotchange', this.#onSlotChange);
    this.#actionSlot?.removeEventListener('slotchange', this.#onSlotChange);

    this.#timestampSlot?.addEventListener('slotchange', this.#onSlotChange);
    this.#bodySlot?.addEventListener('slotchange', this.#onSlotChange);
    this.#actionSlot?.addEventListener('slotchange', this.#onSlotChange);

    this.#observer?.disconnect();
    this.#observer = new MutationObserver(() => {
      this.#syncTimestamp();
      this.#syncBody();
      this.#syncAction();
    });
    this.#observer.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['slot', 'hidden', 'aria-label', 'aria-labelledby', 'id'],
    });
  }

  #syncAll(): void {
    this.#syncHeading();
    this.#syncPrefix();
    this.#syncTargetAttribute();
    this.#syncTimestamp();
    this.#syncBody();
    this.#syncAction();
  }

  #normalizeHeadingLevel(): HeadingLevel {
    const raw = this.getAttribute('heading-level');
    if (!raw) {
      this.setAttribute('heading-level', '2');
      return '2';
    }

    const normalized = raw.trim().toLowerCase();
    const valid = VALID_HEADING_LEVELS.has(normalized as HeadingLevel) ? normalized : '2';
    if (raw !== valid) this.setAttribute('heading-level', valid);
    return valid as HeadingLevel;
  }

  #normalizePrefixMode(): PrefixMode {
    const raw = this.getAttribute('prefix-mode');
    if (!raw) {
      this.setAttribute('prefix-mode', 'auto');
      return 'auto';
    }

    const normalized = raw.trim().toLowerCase();
    const valid = VALID_PREFIX_MODES.has(normalized as PrefixMode) ? normalized : 'auto';
    if (raw !== valid) this.setAttribute('prefix-mode', valid);
    return valid as PrefixMode;
  }

  #normalizePrefixLabel(): string {
    const raw = this.getAttribute('prefix-label');
    const normalized = raw?.trim() ?? '';
    if (!normalized) {
      if (raw !== '【緊急】') this.setAttribute('prefix-label', '【緊急】');
      return '【緊急】';
    }
    if (raw !== normalized) this.setAttribute('prefix-label', normalized);
    return normalized;
  }

  #normalizeTarget(): LinkTarget {
    const raw = this.getAttribute('target');
    if (!raw) {
      this.setAttribute('target', '_self');
      return '_self';
    }

    const normalized = raw.trim().toLowerCase();
    const valid = VALID_TARGETS.has(normalized as LinkTarget) ? normalized : '_self';
    if (raw !== valid) this.setAttribute('target', valid);
    return valid as LinkTarget;
  }

  #syncHeading(): void {
    const level = this.#normalizeHeadingLevel();
    this.#heading?.setAttribute('aria-level', level);
  }

  #syncTargetAttribute(): void {
    this.#normalizeTarget();
  }

  #syncPrefix(): void {
    if (!this.#prefix) return;

    const mode = this.#normalizePrefixMode();
    this.#prefix.hidden = mode === 'manual';
    this.#prefix.textContent = this.#normalizePrefixLabel();
  }

  #syncTimestamp(): void {
    if (!this.#timestamp) return;
    this.#timestamp.hidden = !this.#hasMeaningfulSlotContent(this.#timestampSlot);
  }

  #syncBody(): void {
    if (!this.#body) return;
    this.#body.hidden = !this.#hasMeaningfulSlotContent(this.#bodySlot);
  }

  #syncAction(): void {
    if (!this.#action || !this.#actionLink || !this.#actionIcon) return;

    const href = (this.getAttribute('href') ?? '').trim();
    const hasHref = href.length > 0;
    const hasActionLabel = this.#hasMeaningfulSlotContent(this.#actionSlot);
    const shouldShowAction = hasHref && hasActionLabel;

    this.#action.hidden = !shouldShowAction;
    if (!shouldShowAction) {
      this.#actionLink.removeAttribute('href');
      this.#actionLink.removeAttribute('target');
      this.#actionLink.removeAttribute('rel');
      this.#actionLink.removeAttribute('aria-label');
      this.#actionIcon.hidden = true;
      return;
    }

    this.#actionLink.setAttribute('href', isSafeHref(href) ? href : '#');

    const target = this.#normalizeTarget();
    if (target === '_blank') {
      this.#actionLink.setAttribute('target', '_blank');
    } else {
      this.#actionLink.removeAttribute('target');
    }

    const rawRel = (this.getAttribute('rel') ?? '').trim();
    const effectiveRel = target === '_blank' ? rawRel || 'noopener noreferrer' : rawRel;
    if (effectiveRel) {
      this.#actionLink.setAttribute('rel', effectiveRel);
    } else {
      this.#actionLink.removeAttribute('rel');
    }

    const actionLabelText = this.#readActionLabelText();
    if (target === '_blank' && actionLabelText) {
      this.#actionLink.setAttribute('aria-label', `${actionLabelText}（${NEW_TAB_ANNOUNCEMENT}）`);
    } else {
      this.#actionLink.removeAttribute('aria-label');
    }

    this.#actionIcon.hidden = target !== '_blank';
  }

  #hasMeaningfulSlotContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    const nodes = slot.assignedNodes({ flatten: true });
    return nodes.some((node) => isMeaningfulNode(node));
  }

  #readActionLabelText(): string {
    if (!this.#actionSlot) return '';
    const text = this.#actionSlot
      .assignedNodes({ flatten: true })
      .map((node) => getNodeAccessibleText(node))
      .filter((segment) => segment.length > 0)
      .join(' ')
      .trim();
    return text.replace(/\s+/g, ' ');
  }
}
