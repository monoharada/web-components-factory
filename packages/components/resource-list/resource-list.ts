/**
 * @module resource-list
 * デジタル庁デザインシステム Resource List コンポーネント
 * @version 1.0.0
 */

import {
  html,
  PropertyAttr,
  BooleanAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { isSafeHref } from '../../utils/safe-href.js';
import { resourceListTokens } from './resource-list-tokens.js';
import { resourceListStyles } from './resource-list-styles.js';

type DataStyle = 'list' | 'frame';
type DataInteraction = 'inline' | 'whole';

const VALID_STYLES: readonly DataStyle[] = ['list', 'frame'] as const;
const VALID_INTERACTIONS: readonly DataInteraction[] = ['inline', 'whole'] as const;

const DEFAULT_STYLE: DataStyle = 'list';
const DEFAULT_INTERACTION: DataInteraction = 'inline';
const CONTROL_DEFAULT_SIZE = 'md';
const AUTO_CONTROL_LABELLED_BY_ATTR = 'data-resource-list-auto-labelled-by';
let resourceListInstanceCounter = 0;

function normalizeStyle(value: string | null): DataStyle {
  if (!value) return DEFAULT_STYLE;
  const normalized = value.trim().toLowerCase();
  return (VALID_STYLES as readonly string[]).includes(normalized)
    ? (normalized as DataStyle)
    : DEFAULT_STYLE;
}

function normalizeInteraction(value: string | null): DataInteraction {
  if (!value) return DEFAULT_INTERACTION;
  const normalized = value.trim().toLowerCase();
  return (VALID_INTERACTIONS as readonly string[]).includes(normalized)
    ? (normalized as DataInteraction)
    : DEFAULT_INTERACTION;
}

function isMeaningfulNode(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    if (element.hasAttribute('hidden')) return false;
    return true;
  }
  if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? '').trim() !== '';
  return false;
}

function isInteractiveElement(node: Element): boolean {
  return Boolean(node.closest('a,button,input,select,textarea,label,summary,[contenteditable="true"]'));
}

function shouldCancelControlActivationFromNode(
  node: Element,
  options: {
    boundControlInput: HTMLInputElement | null;
    boundControlHost: HTMLElement | null;
    allowLabelClick?: boolean;
  }
): boolean {
  const { boundControlInput, boundControlHost, allowLabelClick = false } = options;
  if (node === boundControlInput) return true;
  if (boundControlHost && node !== boundControlHost && boundControlHost.contains(node)) return true;
  if (!isInteractiveElement(node)) return false;
  if (allowLabelClick && node.tagName.toLowerCase() === 'label') return false;
  return true;
}

type ControlTarget = {
  host: HTMLElement | null;
  input: HTMLInputElement | null;
};

type RadioControlGroup = {
  name: string;
  form: HTMLFormElement | null;
  root: Document | ShadowRoot;
};

/**
 * リソースリストコンポーネント
 *
 * DADS の Resource List を Web Components として提供します。
 *
 * @customElement
 * @tagname dads-resource-list
 *
 * @slot control - チェックボックス/ラジオ等の選択コントロール
 * @slot icon - 先頭アイコン
 * @slot title - タイトル
 * @slot label - ラベル
 * @slot support - サポートテキスト
 * @slot sub - サブラベル
 * @slot action - 右端アクション
 *
 * @csspart base - ルート領域
 * @csspart body - 本体領域（全体リンク時は <a>）
 * @csspart control - 選択コントロール領域
 * @csspart icon - 先頭アイコン領域
 * @csspart contents - タイトル/ラベル/サポートテキスト領域
 * @csspart title - タイトル領域
 * @csspart label - ラベル領域
 * @csspart support - サポートテキスト領域
 * @csspart sub - サブラベル領域
 * @csspart action - 右端アクション領域
 *
 * @attr {'list' | 'frame'} data-style - スタイル種別（DADS互換）
 * @attr {'inline' | 'whole'} data-interaction - 操作方式（DADS互換）
 * @attr {string} href - 全体リンク時の遷移先URL
 * @attr {string} target - 全体リンク時のtarget属性
 * @attr {string} rel - 全体リンク時のrel属性
 * @attr {boolean} download - 全体リンク時のdownload属性
 *
 * @cssprop --dads-resource-list-background - 背景色
 * @cssprop --dads-resource-list-background-selected - 選択時背景色
 * @cssprop --dads-resource-list-background-disabled - 無効時背景色
 * @cssprop --dads-resource-list-color - 文字色
 * @cssprop --dads-resource-list-color-disabled - 無効時文字色
 * @cssprop --dads-resource-list-border-color - 罫線色
 * @cssprop --dads-resource-list-border-color-selected - 選択時罫線色
 * @cssprop --dads-resource-list-border-color-disabled - 無効時罫線色
 * @cssprop --dads-resource-list-padding-block - 上下余白
 * @cssprop --dads-resource-list-padding-inline - 左右余白
 * @cssprop --dads-resource-list-gap - body 内要素間隔
 * @cssprop --dads-resource-list-content-gap - contents 内行間
 * @cssprop --dads-resource-list-control-hit-area - control 領域の最小ヒットサイズ
 * @cssprop --dads-resource-list-action-width - action 幅
 */
export class DadsResourceList extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-resource-list',
    template: html`
      <div part="base" id="base">
        <div part="body" id="body">
          <span part="control" id="control">
            <slot name="control" id="control-slot"></slot>
          </span>
          <span part="icon" id="icon">
            <slot name="icon" id="icon-slot"></slot>
          </span>
          <div part="contents" id="contents">
            <div part="title" id="title">
              <slot name="title" id="title-slot"></slot>
            </div>
            <div part="label" id="label">
              <slot name="label" id="label-slot"></slot>
            </div>
            <div part="support" id="support">
              <slot name="support" id="support-slot"></slot>
            </div>
          </div>
          <div part="sub" id="sub">
            <slot name="sub" id="sub-slot"></slot>
          </div>
        </div>
        <div part="action" id="action">
          <slot name="action" id="action-slot"></slot>
        </div>
      </div>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), resourceListTokens, resourceListStyles],
      'minimal'
    ),
    attributes: [
      PropertyAttr('dataStyle', 'data-style'),
      PropertyAttr('dataInteraction', 'data-interaction'),
      PropertyAttr('href'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
      BooleanAttr('download'),
    ],
  };

  declare dataStyle: string | null;
  declare dataInteraction: string | null;
  declare href: string | null;
  declare target: string | null;
  declare rel: string | null;
  declare download: boolean;

  #body: HTMLElement | null = null;
  #controlPart: HTMLElement | null = null;
  #contentsPart: HTMLElement | null = null;
  #controlSlot: HTMLSlotElement | null = null;
  #iconSlot: HTMLSlotElement | null = null;
  #titleSlot: HTMLSlotElement | null = null;
  #labelSlot: HTMLSlotElement | null = null;
  #supportSlot: HTMLSlotElement | null = null;
  #subSlot: HTMLSlotElement | null = null;
  #actionSlot: HTMLSlotElement | null = null;

  #slotMutationObserver: MutationObserver | null = null;
  #pendingControlUpgradeTags = new Set<string>();
  #boundControlHost: HTMLElement | null = null;
  #boundControlInput: HTMLInputElement | null = null;
  #primaryTitleLink: HTMLAnchorElement | null = null;
  #instanceId = ++resourceListInstanceCounter;

  connectedCallback(): void {
    super.connectedCallback();

    setDefaultAttributes(this, {
      'data-style': DEFAULT_STYLE,
      'data-interaction': DEFAULT_INTERACTION,
    });

    this.#body = this.shadowRoot?.querySelector('#body') as HTMLElement | null;
    this.#controlPart = this.shadowRoot?.querySelector('#control') as HTMLElement | null;
    this.#contentsPart = this.shadowRoot?.querySelector('#contents') as HTMLElement | null;
    this.#controlSlot = this.shadowRoot?.querySelector('#control-slot') as HTMLSlotElement | null;
    this.#iconSlot = this.shadowRoot?.querySelector('#icon-slot') as HTMLSlotElement | null;
    this.#titleSlot = this.shadowRoot?.querySelector('#title-slot') as HTMLSlotElement | null;
    this.#labelSlot = this.shadowRoot?.querySelector('#label-slot') as HTMLSlotElement | null;
    this.#supportSlot = this.shadowRoot?.querySelector('#support-slot') as HTMLSlotElement | null;
    this.#subSlot = this.shadowRoot?.querySelector('#sub-slot') as HTMLSlotElement | null;
    this.#actionSlot = this.shadowRoot?.querySelector('#action-slot') as HTMLSlotElement | null;

    this.#body?.addEventListener('click', this.#handleBodyClick);
    this.addEventListener('click', this.#handleHostClick);
    this.addEventListener('focusin', this.#handleFocusStateChange);
    this.addEventListener('focusout', this.#handleFocusStateChange);
    this.#bindSlotListeners();
    this.#observeSlotMutations();

    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#body?.removeEventListener('click', this.#handleBodyClick);
    this.removeEventListener('click', this.#handleHostClick);
    this.removeEventListener('focusin', this.#handleFocusStateChange);
    this.removeEventListener('focusout', this.#handleFocusStateChange);
    this.#unbindSlotListeners();
    this.#unbindControlListeners();
    this.#slotMutationObserver?.disconnect();
    this.#slotMutationObserver = null;
    this.#pendingControlUpgradeTags.clear();
    this.#primaryTitleLink = null;
    this.#controlPart = null;
    this.#contentsPart = null;
    this.removeAttribute('data-primary-focus');
    super.disconnectedCallback();
  }

  dataStyleChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeStyle(newValue);
    if (newValue !== normalized) {
      this.setAttribute('data-style', normalized);
      return;
    }
    this.#syncAll();
  }

  dataInteractionChanged(_oldValue: string | null, newValue: string | null): void {
    const normalized = normalizeInteraction(newValue);
    if (newValue !== normalized) {
      this.setAttribute('data-interaction', normalized);
      return;
    }
    this.#syncAll();
  }

  hrefChanged(): void {
    this.#syncAll();
  }

  targetChanged(): void {
    this.#syncBodyLinkAttributes();
  }

  relChanged(): void {
    this.#syncBodyLinkAttributes();
  }

  downloadChanged(): void {
    this.#syncBodyLinkAttributes();
  }

  #slots(): Array<HTMLSlotElement | null> {
    return [
      this.#controlSlot,
      this.#iconSlot,
      this.#titleSlot,
      this.#labelSlot,
      this.#supportSlot,
      this.#subSlot,
      this.#actionSlot,
    ];
  }

  #bindSlotListeners(): void {
    for (const slot of this.#slots()) {
      slot?.addEventListener('slotchange', this.#handleSlotChange);
    }
  }

  #unbindSlotListeners(): void {
    for (const slot of this.#slots()) {
      slot?.removeEventListener('slotchange', this.#handleSlotChange);
    }
  }

  #observeSlotMutations(): void {
    this.#slotMutationObserver?.disconnect();
    this.#slotMutationObserver = new MutationObserver(() => this.#syncAll());
    this.#slotMutationObserver.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['slot', 'hidden', 'checked', 'disabled', 'aria-disabled', 'href'],
    });
  }

  #handleSlotChange = (): void => {
    this.#syncAll();
  };

  #syncAll(): void {
    this.#syncPresenceFlags();
    this.#syncPrimaryTitleLink();
    this.#syncControlTarget();
    this.#syncControlComponentSize();
    this.#syncControlAccessibleName();
    this.#syncControlStateFlags();
    this.#syncBodyMode();
    this.#syncBodyLinkAttributes();
    this.#syncInteractionFlags();
    this.#syncActionStateFlags();
  }

  #syncControlComponentSize(): void {
    const controlHost = this.#boundControlHost;
    if (!controlHost) return;

    const tagName = controlHost.tagName.toLowerCase();
    if (tagName !== 'dads-checkbox' && tagName !== 'dads-radio') return;

    const currentSize = controlHost.getAttribute('size');
    if (currentSize === CONTROL_DEFAULT_SIZE || currentSize === 'lg') return;

    controlHost.setAttribute('size', CONTROL_DEFAULT_SIZE);
  }

  #syncPresenceFlags(): void {
    const hasControl = this.#hasMeaningfulSlotContent('control', this.#controlSlot);
    const hasIcon = this.#hasMeaningfulSlotContent('icon', this.#iconSlot);
    const hasTitle = this.#hasMeaningfulSlotContent('title', this.#titleSlot);
    const hasLabel = this.#hasMeaningfulSlotContent('label', this.#labelSlot);
    const hasSupport = this.#hasMeaningfulSlotContent('support', this.#supportSlot);
    const hasSub = this.#hasMeaningfulSlotContent('sub', this.#subSlot);
    const hasAction = this.#hasMeaningfulSlotContent('action', this.#actionSlot);

    this.toggleAttribute('data-has-control', hasControl);
    this.toggleAttribute('data-has-icon', hasIcon);
    this.toggleAttribute('data-has-title', hasTitle);
    this.toggleAttribute('data-has-label', hasLabel);
    this.toggleAttribute('data-has-support', hasSupport);
    this.toggleAttribute('data-has-sub', hasSub);
    this.toggleAttribute('data-has-action', hasAction);
    this.toggleAttribute('data-has-contents', hasTitle || hasLabel || hasSupport);
  }

  #syncControlTarget(): void {
    const next = this.#resolveControlTarget();

    const hasChanged =
      this.#boundControlHost !== next.host || this.#boundControlInput !== next.input;

    if (!hasChanged) return;

    this.#unbindControlListeners();

    this.#boundControlHost = next.host;
    this.#boundControlInput = next.input;

    this.#boundControlInput?.addEventListener('change', this.#handleControlStateChange);
    this.#boundControlInput?.addEventListener('input', this.#handleControlStateChange);

    if (this.#boundControlHost && this.#boundControlHost !== this.#boundControlInput) {
      this.#boundControlHost.addEventListener('dads-change', this.#handleControlStateChange);
      this.#boundControlHost.addEventListener('change', this.#handleControlStateChange);
    }
  }

  #unbindControlListeners(): void {
    const previousHost = this.#boundControlHost;
    const previousInput = this.#boundControlInput;
    this.#boundControlInput?.removeEventListener('change', this.#handleControlStateChange);
    this.#boundControlInput?.removeEventListener('input', this.#handleControlStateChange);
    if (this.#boundControlHost && this.#boundControlHost !== this.#boundControlInput) {
      this.#boundControlHost.removeEventListener('dads-change', this.#handleControlStateChange);
      this.#boundControlHost.removeEventListener('change', this.#handleControlStateChange);
    }
    this.#clearAutoControlLabelledbyFrom(previousHost);
    if (previousInput !== previousHost) this.#clearAutoControlLabelledbyFrom(previousInput);
    this.#boundControlHost = null;
    this.#boundControlInput = null;
  }

  #syncControlAccessibleName(): void {
    const target = this.#resolveControlAccessibleNameTarget();
    if (!target || !this.hasAttribute('data-has-control')) {
      this.#clearAutoControlLabelledby();
      return;
    }

    const hasAutoManagedLabel = target.hasAttribute(AUTO_CONTROL_LABELLED_BY_ATTR);
    const hasUserLabelledBy = target.hasAttribute('aria-labelledby') && !hasAutoManagedLabel;
    const hasUserLabel = target.hasAttribute('aria-label');
    if (hasUserLabelledBy || hasUserLabel) {
      this.#clearAutoControlLabelledby();
      return;
    }

    const labelIds = this.#resolveControlLabelReferenceIds();
    if (labelIds.length === 0) {
      this.#clearAutoControlLabelledby();
      return;
    }

    this.#clearAutoControlLabelledby(target);
    target.setAttribute('aria-labelledby', labelIds.join(' '));
    target.setAttribute(AUTO_CONTROL_LABELLED_BY_ATTR, '');
  }

  #resolveControlAccessibleNameTarget(): HTMLElement | HTMLInputElement | null {
    const host = this.#boundControlHost;
    if (host) {
      const tagName = host.tagName.toLowerCase();
      if (tagName === 'dads-checkbox' || tagName === 'dads-radio') return host;
      if (host instanceof HTMLInputElement) return host;
    }

    return this.#boundControlInput;
  }

  #resolveControlLabelReferenceIds(): string[] {
    const refs: string[] = [];
    const titleElements = this.#resolveLabelSourceElements('title', this.#titleSlot);
    const supportElements = this.#resolveLabelSourceElements('support', this.#supportSlot);

    for (const [index, element] of titleElements.entries()) {
      refs.push(this.#ensureLabelSourceElementId(element, 'title', index));
    }

    for (const [index, element] of supportElements.entries()) {
      refs.push(this.#ensureLabelSourceElementId(element, 'support', index));
    }

    return Array.from(new Set(refs));
  }

  #resolveLabelSourceElements(slotName: string, slot: HTMLSlotElement | null): HTMLElement[] {
    const elements: HTMLElement[] = [];

    if (slot) {
      const assigned = slot.assignedElements({ flatten: true });
      for (const candidate of assigned) {
        if (!(candidate instanceof HTMLElement)) continue;
        if (!this.#isLabelSourceElement(candidate)) continue;
        elements.push(candidate);
      }
    }

    if (elements.length > 0) return elements;

    const lightDomElements = Array.from(this.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element.getAttribute('slot') === slotName &&
        this.#isLabelSourceElement(element)
    );

    return lightDomElements;
  }

  #isLabelSourceElement(element: HTMLElement): boolean {
    if (element.hasAttribute('hidden')) return false;
    return (element.textContent ?? '').trim().length > 0;
  }

  #ensureLabelSourceElementId(element: HTMLElement, slotName: string, index: number): string {
    const existingId = element.getAttribute('id');
    if (existingId && existingId.trim().length > 0) return existingId;

    const generatedId = `${this.localName}-${this.#instanceId}-${slotName}-${index + 1}`;
    element.id = generatedId;
    return generatedId;
  }

  #clearAutoControlLabelledby(except: Element | null = null): void {
    const candidates = new Set<Element>();
    if (this.#boundControlHost) candidates.add(this.#boundControlHost);
    if (this.#boundControlInput) candidates.add(this.#boundControlInput);

    for (const candidate of candidates) {
      if (candidate === except) continue;
      this.#clearAutoControlLabelledbyFrom(candidate);
    }
  }

  #clearAutoControlLabelledbyFrom(candidate: Element | null): void {
    if (!candidate || !candidate.hasAttribute(AUTO_CONTROL_LABELLED_BY_ATTR)) return;
    candidate.removeAttribute('aria-labelledby');
    candidate.removeAttribute(AUTO_CONTROL_LABELLED_BY_ATTR);
  }

  #resolveControlTarget(): ControlTarget {
    const bySlot = this.#resolveControlTargetFromSlot();
    if (bySlot.host || bySlot.input) return bySlot;

    // slot API が不安定なテスト環境向けフォールバック
    const direct = this.querySelector('[slot="control"]');
    if (direct instanceof HTMLElement) {
      return this.#resolveControlTargetFromElement(direct);
    }

    return { host: null, input: null };
  }

  #resolveControlTargetFromSlot(): ControlTarget {
    if (!this.#controlSlot) return { host: null, input: null };

    const assigned = this.#controlSlot.assignedElements({ flatten: true });
    for (const candidate of assigned) {
      if (!(candidate instanceof HTMLElement)) continue;
      const resolved = this.#resolveControlTargetFromElement(candidate);
      if (resolved.host || resolved.input) return resolved;
    }
    return { host: null, input: null };
  }

  #resolveControlTargetFromElement(element: HTMLElement): ControlTarget {
    if (element instanceof HTMLInputElement) {
      const type = element.type.toLowerCase();
      if (type === 'checkbox' || type === 'radio') {
        return { host: element, input: element };
      }
    }

    const tagName = element.tagName.toLowerCase();
    if (tagName === 'dads-checkbox' || tagName === 'dads-radio') {
      const shadowInput = element.shadowRoot?.querySelector(
        'input[type="checkbox"], input[type="radio"]'
      );
      if (!(shadowInput instanceof HTMLInputElement) && customElements.get(tagName) === undefined) {
        this.#queueControlUpgradeSync(tagName);
      }
      return {
        host: element,
        input: shadowInput instanceof HTMLInputElement ? shadowInput : null,
      };
    }

    const nestedInput = element.querySelector('input[type="checkbox"], input[type="radio"]');
    if (nestedInput instanceof HTMLInputElement) {
      return { host: element, input: nestedInput };
    }

    const shadowInput = element.shadowRoot?.querySelector(
      'input[type="checkbox"], input[type="radio"]'
    );
    if (shadowInput instanceof HTMLInputElement) {
      return { host: element, input: shadowInput };
    }

    if ('checked' in (element as unknown as Record<string, unknown>) || element.hasAttribute('checked')) {
      return { host: element, input: null };
    }

    return { host: null, input: null };
  }

  #queueControlUpgradeSync(tagName: string): void {
    if (this.#pendingControlUpgradeTags.has(tagName)) return;
    if (customElements.get(tagName) !== undefined) return;

    this.#pendingControlUpgradeTags.add(tagName);
    void customElements
      .whenDefined(tagName)
      .then(() => {
        this.#pendingControlUpgradeTags.delete(tagName);
        if (!this.isConnected) return;
        queueMicrotask(() => this.#syncAll());
      })
      .catch(() => {
        this.#pendingControlUpgradeTags.delete(tagName);
      });
  }

  #syncControlStateFlags(): void {
    if (!this.hasAttribute('data-has-control')) {
      this.removeAttribute('data-selected');
      this.removeAttribute('data-disabled');
      return;
    }

    this.toggleAttribute('data-selected', this.#isControlChecked());
    this.toggleAttribute('data-disabled', this.#isControlDisabled());
  }

  #isControlChecked(): boolean {
    if (this.#boundControlInput) return this.#boundControlInput.checked;
    if (!this.#boundControlHost) return false;

    const shadowInput = this.#boundControlHost.shadowRoot?.querySelector(
      'input[type="checkbox"], input[type="radio"]'
    );
    if (shadowInput instanceof HTMLInputElement) return shadowInput.checked;

    const control = this.#boundControlHost as unknown as { checked?: unknown };
    if (typeof control.checked === 'boolean') return control.checked;
    if (this.#boundControlHost.getAttribute('aria-checked') === 'true') return true;
    return this.#boundControlHost.hasAttribute('checked');
  }

  #isControlDisabled(): boolean {
    if (this.#boundControlInput) return this.#boundControlInput.disabled;
    if (!this.#boundControlHost) return false;

    const shadowInput = this.#boundControlHost.shadowRoot?.querySelector(
      'input[type="checkbox"], input[type="radio"]'
    );
    if (shadowInput instanceof HTMLInputElement) return shadowInput.disabled;

    const control = this.#boundControlHost as unknown as { disabled?: unknown };
    if (typeof control.disabled === 'boolean') return control.disabled;

    return (
      this.#boundControlHost.hasAttribute('disabled') ||
      this.#boundControlHost.getAttribute('aria-disabled') === 'true'
    );
  }

  #syncBodyMode(): void {
    const interactionWhole = normalizeInteraction(this.getAttribute('data-interaction')) === 'whole';
    const hasControl = this.hasAttribute('data-has-control');
    const hasHostHref = this.#getHostHref() !== null;
    const hasPrimaryTitleLink = this.#primaryTitleLink !== null;
    const shouldAnchor = interactionWhole && !hasControl && hasHostHref;

    const current = this.#body;
    if (!current) return;

    const isCurrentAnchor = current instanceof HTMLAnchorElement;
    if (isCurrentAnchor === shouldAnchor) return;

    this.#body?.removeEventListener('click', this.#handleBodyClick);

    const replacement = document.createElement(shouldAnchor ? 'a' : 'div');
    replacement.setAttribute('part', 'body');
    replacement.id = 'body';

    while (current.firstChild) replacement.appendChild(current.firstChild);
    current.replaceWith(replacement);

    this.#body = replacement;
    this.#body.addEventListener('click', this.#handleBodyClick);
  }

  #syncBodyLinkAttributes(): void {
    if (!(this.#body instanceof HTMLAnchorElement)) return;

    const href = this.getAttribute('href');
    const safeHref = href && isSafeHref(href) ? href : '#';
    this.#body.setAttribute('href', safeHref);

    if (this.hasAttribute('download')) this.#body.setAttribute('download', '');
    else this.#body.removeAttribute('download');

    const rel = this.getAttribute('rel');
    if (rel) this.#body.setAttribute('rel', rel);
    else this.#body.removeAttribute('rel');

    const target = this.getAttribute('target');
    if (target && !this.hasAttribute('download')) this.#body.setAttribute('target', target);
    else this.#body.removeAttribute('target');
  }

  #syncInteractionFlags(): void {
    const interaction = normalizeInteraction(this.getAttribute('data-interaction'));
    const hasControl = this.hasAttribute('data-has-control');
    const canWholeControl = interaction === 'whole' && hasControl && !this.hasAttribute('data-disabled');
    const canWholeLink =
      interaction === 'whole' &&
      !hasControl &&
      !this.hasAttribute('data-disabled') &&
      (this.#body instanceof HTMLAnchorElement || this.#isWholeDelegatedLinkInteraction());

    this.toggleAttribute('data-interactive-whole', canWholeControl || canWholeLink);
    this.toggleAttribute('data-whole-control', canWholeControl);
    this.toggleAttribute('data-whole-link', canWholeLink);
    if (!canWholeLink) this.removeAttribute('data-primary-focus');
    this.#syncPrimaryFocusFlag();
  }

  #syncActionStateFlags(): void {
    if (!this.hasAttribute('data-has-action')) {
      this.removeAttribute('data-action-disabled');
      return;
    }

    const action = this.#resolvePrimaryActionElement();
    const isDisabled = action ? this.#isActionDisabled(action) : false;
    this.toggleAttribute('data-action-disabled', isDisabled);
  }

  #resolvePrimaryActionElement(): HTMLElement | null {
    const bySlot = this.#resolvePrimaryActionElementFromSlot();
    if (bySlot) return bySlot;

    const direct = this.querySelector('[slot="action"]');
    if (direct instanceof HTMLElement && !direct.hasAttribute('hidden')) return direct;

    return null;
  }

  #resolvePrimaryActionElementFromSlot(): HTMLElement | null {
    if (!this.#actionSlot) return null;

    const assigned = this.#actionSlot.assignedElements({ flatten: true });
    for (const candidate of assigned) {
      if (!(candidate instanceof HTMLElement)) continue;
      if (candidate.hasAttribute('hidden')) continue;
      return candidate;
    }

    return null;
  }

  #isActionDisabled(action: HTMLElement): boolean {
    const control = action as HTMLElement & { disabled?: unknown };
    if (typeof control.disabled === 'boolean') return control.disabled;
    if (action.hasAttribute('disabled')) return true;
    return action.getAttribute('aria-disabled') === 'true';
  }

  #hasMeaningfulSlotContent(slotName: string, slot: HTMLSlotElement | null): boolean {
    if (slot) {
      const hasAssigned = slot.assignedNodes({ flatten: true }).some((node) => isMeaningfulNode(node));
      if (hasAssigned) return true;
    }

    const lightDomSlotted = Array.from(this.children).filter(
      (element) => element.getAttribute('slot') === slotName && !element.hasAttribute('hidden')
    );
    return lightDomSlotted.length > 0;
  }

  #isWholeControlInteraction(): boolean {
    return (
      normalizeInteraction(this.getAttribute('data-interaction')) === 'whole' &&
      this.hasAttribute('data-has-control')
    );
  }

  #isInlineControlInteraction(): boolean {
    return (
      normalizeInteraction(this.getAttribute('data-interaction')) === 'inline' &&
      this.hasAttribute('data-has-control')
    );
  }

  #isControlRegionClick(path: readonly EventTarget[]): boolean {
    const controlPart = this.#controlPart;
    if (!controlPart) return false;

    for (const node of path) {
      if (node === controlPart || node === this.#controlSlot) return true;
      if (!(node instanceof Node)) continue;
      if (controlPart.contains(node)) return true;
    }
    return false;
  }

  #isContentsRegionClick(path: readonly EventTarget[]): boolean {
    const contentsPart = this.#contentsPart;
    if (!contentsPart) return false;

    for (const node of path) {
      if (node === contentsPart || node === this.#titleSlot || node === this.#labelSlot || node === this.#supportSlot) {
        return true;
      }
      if (!(node instanceof Node)) continue;
      if (contentsPart.contains(node)) return true;
    }

    return false;
  }

  #isSlottedContentsClick(path: readonly EventTarget[]): boolean {
    const targetSlots = new Set(['title', 'label', 'support']);

    for (const node of path) {
      if (!(node instanceof Element)) continue;
      const slotName = node.getAttribute('slot');
      if (slotName && targetSlots.has(slotName) && this.contains(node)) return true;
      if (!(node instanceof HTMLElement)) continue;
      const slottedAncestor = node.closest('[slot]');
      if (!slottedAncestor) continue;
      const ancestorSlot = slottedAncestor.getAttribute('slot');
      if (ancestorSlot && targetSlots.has(ancestorSlot) && this.contains(slottedAncestor)) return true;
    }

    return false;
  }

  #isSlottedControlClick(path: readonly EventTarget[]): boolean {
    for (const node of path) {
      if (!(node instanceof Element)) continue;
      if (node === this.#boundControlHost) return true;
      const slotName = node.getAttribute('slot');
      if (slotName === 'control' && this.contains(node)) return true;
      if (!(node instanceof HTMLElement)) continue;
      const slottedAncestor = node.closest('[slot]');
      if (!slottedAncestor) continue;
      if (slottedAncestor.getAttribute('slot') === 'control' && this.contains(slottedAncestor)) {
        return true;
      }
    }
    return false;
  }

  #isWholeDelegatedLinkInteraction(): boolean {
    return (
      normalizeInteraction(this.getAttribute('data-interaction')) === 'whole' &&
      !this.hasAttribute('data-has-control') &&
      !(this.#body instanceof HTMLAnchorElement) &&
      this.#primaryTitleLink !== null
    );
  }

  #getHostHref(): string | null {
    const href = this.getAttribute('href');
    if (href == null) return null;
    return href.trim() === '' ? null : href;
  }

  #syncPrimaryTitleLink(): void {
    this.#primaryTitleLink = this.#resolvePrimaryTitleLink();
    this.#syncPrimaryFocusFlag();
  }

  #resolvePrimaryTitleLink(): HTMLAnchorElement | null {
    const bySlot = this.#resolvePrimaryTitleLinkFromSlot();
    if (bySlot) return bySlot;

    const slottedTitleNodes = Array.from(this.querySelectorAll('[slot="title"]'));
    for (const node of slottedTitleNodes) {
      if (!(node instanceof HTMLElement)) continue;
      const resolved = this.#resolvePrimaryTitleLinkFromElement(node);
      if (resolved) return resolved;
    }

    return null;
  }

  #resolvePrimaryTitleLinkFromSlot(): HTMLAnchorElement | null {
    if (!this.#titleSlot) return null;
    const assigned = this.#titleSlot.assignedElements({ flatten: true });
    for (const candidate of assigned) {
      if (!(candidate instanceof HTMLElement)) continue;
      const resolved = this.#resolvePrimaryTitleLinkFromElement(candidate);
      if (resolved) return resolved;
    }
    return null;
  }

  #resolvePrimaryTitleLinkFromElement(element: HTMLElement): HTMLAnchorElement | null {
    if (element instanceof HTMLAnchorElement && this.#isUsablePrimaryTitleLink(element)) return element;

    const nested = element.querySelector('a[href]');
    if (nested instanceof HTMLAnchorElement && this.#isUsablePrimaryTitleLink(nested)) return nested;

    return null;
  }

  #isUsablePrimaryTitleLink(link: HTMLAnchorElement): boolean {
    if (link.hasAttribute('hidden')) return false;
    const href = link.getAttribute('href');
    return Boolean(href && isSafeHref(href));
  }

  #syncPrimaryFocusFlag(): void {
    const active = document.activeElement;
    const hasFocus =
      this.hasAttribute('data-whole-link') &&
      this.#primaryTitleLink !== null &&
      active instanceof Node &&
      (active === this.#primaryTitleLink || this.#primaryTitleLink.contains(active));
    this.toggleAttribute('data-primary-focus', hasFocus);
  }

  #activatePrimaryTitleLink(): void {
    const link = this.#primaryTitleLink;
    if (!link) return;
    link.click();
  }

  #activateControl(): void {
    const input = this.#boundControlInput;
    if (input && !input.disabled) {
      input.click();
      input.focus();
      this.#queueControlStateSync();
      return;
    }

    const host = this.#boundControlHost;
    if (!host) return;

    const shadowInput = host.shadowRoot?.querySelector(
      'input[type="checkbox"], input[type="radio"]'
    );
    if (shadowInput instanceof HTMLInputElement && !shadowInput.disabled) {
      shadowInput.click();
      shadowInput.focus();
      this.#queueControlStateSync();
      return;
    }

    const tagName = host.tagName.toLowerCase();
    const hostControl = host as unknown as { checked?: boolean; disabled?: boolean };
    if (
      (tagName === 'dads-checkbox' || tagName === 'dads-radio') &&
      typeof hostControl.checked === 'boolean' &&
      hostControl.disabled !== true
    ) {
      const nextChecked = tagName === 'dads-radio' ? true : !hostControl.checked;
      hostControl.checked = nextChecked;
      host.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      host.dispatchEvent(new CustomEvent('dads-change', {
        detail: { checked: nextChecked },
        bubbles: true,
        composed: true,
      }));
      this.#queueControlStateSync();
      return;
    }

    if (typeof host.click === 'function') {
      host.click();
      this.#queueControlStateSync();
    }
  }

  #handleControlStateChange = (): void => {
    this.#syncControlTarget();
    this.#syncControlStateFlags();
    this.#syncInteractionFlags();
    this.#syncRelatedRadioRows();
  };

  #handleFocusStateChange = (): void => {
    queueMicrotask(() => this.#syncPrimaryFocusFlag());
  };

  #handleBodyClick = (event: MouseEvent): void => {
    if (event.defaultPrevented) return;

    if (this.#isWholeControlInteraction()) {
      if (this.#isControlDisabled()) return;

      const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
      for (const node of path) {
        if (!(node instanceof Element)) continue;
        if (
          shouldCancelControlActivationFromNode(node, {
            boundControlInput: this.#boundControlInput,
            boundControlHost: this.#boundControlHost,
          })
        ) return;
      }

      event.preventDefault();
      this.#activateControl();
      return;
    }

    if (this.#isInlineControlInteraction()) {
      if (this.#isControlDisabled()) return;

      const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
      const isControlRegion = this.#isControlRegionClick(path);
      const isContentsRegion = this.#isContentsRegionClick(path);
      if (!isControlRegion && !isContentsRegion) return;

      for (const node of path) {
        if (!(node instanceof Element)) continue;
        if (
          shouldCancelControlActivationFromNode(node, {
            boundControlInput: this.#boundControlInput,
            boundControlHost: this.#boundControlHost,
            allowLabelClick: isContentsRegion,
          })
        ) return;
      }
      event.preventDefault();
      this.#activateControl();
      return;
    }

    if (!this.#isWholeDelegatedLinkInteraction()) return;
    if (this.hasAttribute('data-disabled')) return;

    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (const node of path) {
      if (!(node instanceof Element)) continue;
      if (this.#primaryTitleLink && (node === this.#primaryTitleLink || this.#primaryTitleLink.contains(node))) {
        return;
      }
      if (isInteractiveElement(node)) return;
    }

    event.preventDefault();
    this.#activatePrimaryTitleLink();
  };

  #handleHostClick = (event: MouseEvent): void => {
    if (event.defaultPrevented) return;
    if (!this.#isInlineControlInteraction()) return;
    if (this.#isControlDisabled()) return;

    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (path.some((node) => node === this.#body)) return;
    const isSlottedControl = this.#isSlottedControlClick(path);
    const isSlottedContents = this.#isSlottedContentsClick(path);
    if (!isSlottedControl && !isSlottedContents) return;

    for (const node of path) {
      if (!(node instanceof Element)) continue;
      if (
        shouldCancelControlActivationFromNode(node, {
          boundControlInput: this.#boundControlInput,
          boundControlHost: this.#boundControlHost,
          allowLabelClick: isSlottedContents,
        })
      ) return;
    }

    event.preventDefault();
    this.#activateControl();
  };

  #syncRelatedRadioRows(): void {
    const currentGroup = this.#resolveRadioControlGroup();
    if (!currentGroup) return;

    const lists = currentGroup.root.querySelectorAll(this.localName);
    for (const candidate of lists) {
      if (!(candidate instanceof DadsResourceList)) continue;
      if (candidate === this) continue;
      if (!candidate.#isSameRadioControlGroup(currentGroup)) continue;
      candidate.#syncControlStateFlags();
      candidate.#syncInteractionFlags();
    }
  }

  #queueControlStateSync(): void {
    queueMicrotask(() => {
      this.#syncControlTarget();
      this.#syncControlStateFlags();
      this.#syncInteractionFlags();
      this.#syncRelatedRadioRows();
    });
  }

  #resolveRadioControlGroup(): RadioControlGroup | null {
    const root = this.getRootNode();
    if (!(root instanceof Document || root instanceof ShadowRoot)) return null;

    const name = this.#resolveRadioControlName();
    if (!name) return null;

    return {
      name,
      form: this.closest('form'),
      root,
    };
  }

  #isSameRadioControlGroup(group: RadioControlGroup): boolean {
    const current = this.#resolveRadioControlGroup();
    if (!current) return false;
    return (
      current.root === group.root &&
      current.form === group.form &&
      current.name === group.name
    );
  }

  #resolveRadioControlName(): string | null {
    if (this.#boundControlInput && this.#boundControlInput.type.toLowerCase() === 'radio') {
      const inputName = this.#boundControlInput.name.trim();
      return inputName === '' ? null : inputName;
    }

    if (!this.#boundControlHost) return null;
    if (this.#boundControlHost.tagName.toLowerCase() !== 'dads-radio') return null;
    const controlName = (this.#boundControlHost.getAttribute('name') ?? '').trim();
    return controlName === '' ? null : controlName;
  }
}
