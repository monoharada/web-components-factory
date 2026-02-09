/**
 * @module utility-link
 * デジタル庁デザインシステム Utility Link コンポーネント
 * @version 0.1.0
 */

import { html, PropertyAttr, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { iconPaths } from '../../utils/icons.js';
import { utilityLinkTokens } from './utility-link-tokens.js';
import { utilityLinkStyles } from './utility-link-styles.js';

type RefsHost = { refs?: Record<string, unknown> };
type TailIconKind = 'none' | 'new-window' | 'download';

const NEW_WINDOW_ICON_PATH =
  'M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z';
const NEW_WINDOW_ICON_LABEL = '新規タブで開きます';
const NEW_WINDOW_ICON_VIEWBOX = '0 0 48 48';
const DOWNLOAD_ICON_PATH = iconPaths.download;
const DOWNLOAD_ICON_LABEL = 'ダウンロードします';
const DOWNLOAD_ICON_VIEWBOX = '0 0 24 24';

function getRef<T extends Element>(host: RefsHost, id: string): T | null {
  const el = host.refs?.[id];
  return el instanceof Element ? (el as T) : null;
}

function isMeaningfulNode(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    if (element.hasAttribute('hidden')) return false;
    return true;
  }
  if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '') return true;
  return false;
}

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (value === '') return false;

  if (
    value === '#' ||
    value.startsWith('/') ||
    value.startsWith('#') ||
    value.startsWith('./') ||
    value.startsWith('../') ||
    value.startsWith('?')
  ) {
    return true;
  }

  const match = value.match(/^([a-zA-Z][a-zA-Z\d+.-]*):/);
  if (!match) return true;

  const scheme = match[1].toLowerCase();
  return scheme === 'http' || scheme === 'https' || scheme === 'mailto' || scheme === 'tel';
}

/**
 * Utility Link コンポーネント
 *
 * @customElement
 * @tagname dads-utility-link
 *
 * @slot default - リンクラベル
 * @slot lead-icon - 先頭アイコン（任意）
 * @slot tail-icon - 末尾アイコン（任意、指定時は自動末尾アイコンより優先）
 *
 * @csspart base - リンク本体（a要素）
 * @csspart lead-icon - 先頭アイコン領域
 * @csspart label - ラベル領域
 * @csspart tail-icon - 末尾アイコン領域（tail-icon slot または target="_blank"/download フォールバックを表示）
 *
 * @attr {string} href - リンク先URL
 * @attr {string} target - リンクターゲット（download 指定時は内部リンクへは反映しない）
 * @attr {string} rel - リンクrel
 * @attr {boolean} download - download属性
 *
 * @cssprop --dads-utility-link-label-color - ラベル色
 * @cssprop --dads-utility-link-label-color-hover - ホバー時ラベル色
 * @cssprop --dads-utility-link-label-color-active - アクティブ時ラベル色
 * @cssprop --dads-utility-link-icon-color - アイコン色
 * @cssprop --dads-utility-link-underline-thickness - 下線太さ
 * @cssprop --dads-utility-link-underline-thickness-hover - ホバー時下線太さ
 * @cssprop --dads-utility-link-underline-offset - 下線オフセット
 * @cssprop --dads-utility-link-focus-outline-color - フォーカス時アウトライン色
 * @cssprop --dads-utility-link-focus-ring-color - フォーカス時リング色
 * @cssprop --dads-utility-link-focus-background - フォーカス時背景色
 */
export class DadsUtilityLink extends TypographyWebComponent {
  static definition = {
    name: 'dads-utility-link',
    template: html`
      <a part="base" id="base">
        <span part="lead-icon" id="lead-icon">
          <slot name="lead-icon" id="lead-icon-slot"></slot>
        </span>
        <span part="label" id="label">
          <slot></slot>
        </span>
        <span part="tail-icon" id="tail-icon" hidden>
          <slot name="tail-icon" id="tail-icon-slot"></slot>
          <svg
            id="tail-icon-svg"
            width="16"
            height="16"
            viewBox="${NEW_WINDOW_ICON_VIEWBOX}"
            fill="currentcolor"
            role="img"
            aria-label="${NEW_WINDOW_ICON_LABEL}"
            hidden
          >
            <path id="tail-icon-path" d="${NEW_WINDOW_ICON_PATH}" />
          </svg>
        </span>
      </a>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), utilityLinkTokens, utilityLinkStyles], 'minimal'),
    attributes: [
      PropertyAttr('href'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
      BooleanAttr('download'),
    ],
  };

  #base: HTMLAnchorElement | null = null;
  #leadIconSlot: HTMLSlotElement | null = null;
  #tailIconSlot: HTMLSlotElement | null = null;
  #tailIcon: HTMLElement | null = null;
  #tailIconSvg: SVGSVGElement | null = null;
  #tailIconPath: SVGPathElement | null = null;
  #slotMutationObserver: MutationObserver | null = null;

  declare href: string | null;
  declare target: string | null;
  declare rel: string | null;
  declare download: boolean;

  connectedCallback(): void {
    super.connectedCallback();

    this.#base = getRef<HTMLAnchorElement>(this, 'base');
    this.#leadIconSlot = getRef<HTMLSlotElement>(this, 'lead-icon-slot');
    this.#tailIconSlot = getRef<HTMLSlotElement>(this, 'tail-icon-slot');
    this.#tailIcon = getRef<HTMLElement>(this, 'tail-icon');
    this.#tailIconSvg = getRef<SVGSVGElement>(this, 'tail-icon-svg');
    this.#tailIconPath = getRef<SVGPathElement>(this, 'tail-icon-path');

    this.#leadIconSlot?.addEventListener('slotchange', this.#handleLeadIconSlotChange);
    this.#tailIconSlot?.addEventListener('slotchange', this.#handleTailIconSlotChange);
    this.#observeSlotMutations();

    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#leadIconSlot?.removeEventListener('slotchange', this.#handleLeadIconSlotChange);
    this.#tailIconSlot?.removeEventListener('slotchange', this.#handleTailIconSlotChange);
    this.#slotMutationObserver?.disconnect();
    this.#slotMutationObserver = null;
    this.#base = null;
    this.#leadIconSlot = null;
    this.#tailIconSlot = null;
    this.#tailIcon = null;
    this.#tailIconSvg = null;
    this.#tailIconPath = null;
    super.disconnectedCallback();
  }

  hrefChanged(): void {
    this.#syncLinkAttributes();
  }

  targetChanged(): void {
    this.#syncLinkAttributes();
  }

  relChanged(): void {
    this.#syncLinkAttributes();
  }

  downloadChanged(): void {
    this.#syncLinkAttributes();
  }

  #handleLeadIconSlotChange = (): void => {
    this.#syncLeadIconVisibility();
  };

  #handleTailIconSlotChange = (): void => {
    this.#syncTailIconVisibility(this.#computeAutoTailIconKind());
  };

  #syncAll(): void {
    this.#syncLinkAttributes();
    this.#syncLeadIconVisibility();
  }

  #observeSlotMutations(): void {
    this.#slotMutationObserver?.disconnect();
    this.#slotMutationObserver = new MutationObserver(() => {
      this.#syncLeadIconVisibility();
      this.#syncTailIconVisibility(this.#computeAutoTailIconKind());
    });
    this.#slotMutationObserver.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['slot', 'hidden'],
    });
  }

  #syncLinkAttributes(): void {
    const base = this.#base ?? getRef<HTMLAnchorElement>(this, 'base');
    const tailIcon = this.#tailIcon ?? getRef<HTMLElement>(this, 'tail-icon');
    if (!base || !tailIcon) return;

    const href = this.getAttribute('href');
    base.setAttribute('href', href && isSafeHref(href) ? href : '#');

    const rel = this.getAttribute('rel');
    if (rel) base.setAttribute('rel', rel);
    else base.removeAttribute('rel');

    const hasDownload = this.hasAttribute('download');
    if (hasDownload) base.setAttribute('download', '');
    else base.removeAttribute('download');

    const target = this.getAttribute('target');
    const effectiveTarget = hasDownload ? null : target;
    if (effectiveTarget) base.setAttribute('target', effectiveTarget);
    else base.removeAttribute('target');

    const tailIconKind: TailIconKind = hasDownload ? 'download' : effectiveTarget === '_blank' ? 'new-window' : 'none';
    if (tailIconKind === 'none') {
      this.removeAttribute('data-tail-icon-kind');
    } else {
      this.setAttribute('data-tail-icon-kind', tailIconKind);
      this.#syncTailIconKind(tailIconKind);
    }
    this.#syncTailIconVisibility(tailIconKind);
  }

  #syncTailIconKind(kind: Exclude<TailIconKind, 'none'>): void {
    const svg = this.#tailIconSvg ?? getRef<SVGSVGElement>(this, 'tail-icon-svg');
    const path = this.#tailIconPath ?? getRef<SVGPathElement>(this, 'tail-icon-path');
    if (!svg || !path) return;

    if (kind === 'download') {
      svg.setAttribute('aria-label', DOWNLOAD_ICON_LABEL);
      svg.setAttribute('viewBox', DOWNLOAD_ICON_VIEWBOX);
      path.setAttribute('d', DOWNLOAD_ICON_PATH);
      return;
    }

    svg.setAttribute('aria-label', NEW_WINDOW_ICON_LABEL);
    svg.setAttribute('viewBox', NEW_WINDOW_ICON_VIEWBOX);
    path.setAttribute('d', NEW_WINDOW_ICON_PATH);
  }

  #syncLeadIconVisibility(): void {
    const slot = this.#leadIconSlot ?? getRef<HTMLSlotElement>(this, 'lead-icon-slot');
    const hasLeadIcon = this.#hasMeaningfulSlottedContent(slot, 'lead-icon');
    this.toggleAttribute('data-has-lead-icon', hasLeadIcon);
  }

  #syncTailIconVisibility(autoTailIconKind: TailIconKind): void {
    const tailIcon = this.#tailIcon ?? getRef<HTMLElement>(this, 'tail-icon');
    const tailSlot = this.#tailIconSlot ?? getRef<HTMLSlotElement>(this, 'tail-icon-slot');
    const tailIconSvg = this.#tailIconSvg ?? getRef<SVGSVGElement>(this, 'tail-icon-svg');
    if (!tailIcon) return;

    const hasCustomTailIcon = this.#hasMeaningfulSlottedContent(tailSlot, 'tail-icon');
    tailSlot?.toggleAttribute('hidden', !hasCustomTailIcon);

    const showAutoTailIcon = !hasCustomTailIcon && autoTailIconKind !== 'none';
    tailIconSvg?.toggleAttribute('hidden', !showAutoTailIcon);

    const showTailIcon = hasCustomTailIcon || showAutoTailIcon;
    tailIcon.toggleAttribute('hidden', !showTailIcon);
    this.toggleAttribute('data-show-tail-icon', showTailIcon);
  }

  #computeAutoTailIconKind(): TailIconKind {
    if (this.hasAttribute('download')) return 'download';
    return this.getAttribute('target') === '_blank' ? 'new-window' : 'none';
  }

  #hasMeaningfulSlottedContent(slot: HTMLSlotElement | null, slotName: string): boolean {
    for (const node of this.#getAssignedNodesWithoutFallback(slot)) {
      if (isMeaningfulNode(node)) return true;
    }

    const directSlottedElements = Array.from(this.children).filter(
      (element) => element.getAttribute('slot') === slotName
    );
    return directSlottedElements.some((element) => !element.hasAttribute('hidden'));
  }

  #getAssignedNodesWithoutFallback(slot: HTMLSlotElement | null): Node[] {
    if (!slot) return [];
    return slot.assignedNodes({ flatten: true }).filter((node) => !slot.contains(node));
  }
}
