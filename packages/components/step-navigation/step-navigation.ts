/**
 * @module step-navigation
 * デジタル庁デザインシステム Step Navigation コンポーネント
 * @version 0.1.0
 */

import { html, PropertyAttr, TransferringPropertyAttr, Keys } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import {
  stepNavigationTokens,
  stepNavigationSemanticTokens,
} from './step-navigation-tokens.js';
import { stepNavigationStyles, stepNavigationItemStyles } from './step-navigation-styles.js';

type Orientation = 'horizontal' | 'vertical';
type Size = 'normal' | 'small';
type State = 'reached' | 'completed' | 'editing' | 'error' | 'skipped';
type Interaction = 'none' | 'button';
type StatusLive = 'off' | 'polite' | 'assertive';

type RefsHost = { refs?: Record<string, unknown> };

function getRef<T extends Element>(host: RefsHost, id: string): T | null {
  const el = host.refs?.[id];
  return el instanceof Element ? (el as T) : null;
}

function normalizeOrientation(v: string | null): Orientation {
  return v === 'vertical' ? 'vertical' : 'horizontal';
}

function normalizeSize(v: string | null): Size {
  return v === 'small' ? 'small' : 'normal';
}

function normalizeInteraction(v: string | null): Interaction {
  return v === 'button' ? 'button' : 'none';
}

function normalizeStatusLive(v: string | null): StatusLive {
  if (v === 'polite' || v === 'assertive') return v;
  return 'off';
}

function hasMeaningfulAssignedText(slot: HTMLSlotElement): boolean {
  const nodes = slot.assignedNodes({ flatten: true });
  for (const node of nodes) {
    const text = node.textContent;
    if (text && text.trim().length > 0) return true;
  }
  return false;
}

function hasDirectMeaningfulSlottedContent(host: HTMLElement, slotName: string): boolean {
  for (const child of host.children) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.getAttribute('slot') !== slotName) continue;

    const text = child.textContent?.trim();
    if (text && text.length > 0) return true;

    const ariaLabel = child.getAttribute('aria-label');
    const ariaLabelledby = child.getAttribute('aria-labelledby');
    if (ariaLabel || ariaLabelledby) return true;
  }
  return false;
}

/**
 * Step Navigation（コンテナ）
 *
 * @customElement dads-step-navigation
 * @tagname dads-step-navigation
 *
 * @slot status - 進捗文言（スクリーンリーダー向け、visually-hidden）
 * @slot default - dads-step-navigation-item 群
 *
 * @csspart container - ナビゲーションコンテナ
 * @csspart status - 進捗文言のラッパー
 * @csspart list - ステップ一覧（リスト）
 *
 * @attr {string} orientation - 表示方向 (horizontal | vertical)
 * @attr {string} size - サイズ (normal | small)
 * @attr {string} status-live - ステータスの読み上げ (off | polite | assertive)
 */
export class DadsStepNavigation extends TypographyWebComponent {
  static readonly version = '0.1.0';

  static definition = {
    name: 'dads-step-navigation',
    template: html`
      <nav part="container" id="nav">
        <p part="visually-hidden status" id="status">
          <slot name="status" id="status-slot"></slot>
        </p>
        <ul part="list" id="list" role="list">
          <slot id="items-slot"></slot>
        </ul>
      </nav>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        stepNavigationTokens,
        stepNavigationStyles,
      ],
      'minimal',
    ),
    attributes: [
      PropertyAttr('orientation'),
      PropertyAttr('size'),
      PropertyAttr('statusLive', 'status-live'),
      TransferringPropertyAttr('nav', 'ariaLabel', 'aria-label'),
      TransferringPropertyAttr('nav', 'ariaLabelledby', 'aria-labelledby'),
    ],
  };


  #slot: HTMLSlotElement | null = null;
  #statusSlot: HTMLSlotElement | null = null;
  #itemsObserver: MutationObserver | null = null;
  #childObserver: MutationObserver | null = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.hasAttribute('orientation')) {
      this.setAttribute('orientation', 'horizontal');
    }
    if (!this.hasAttribute('size')) {
      this.setAttribute('size', 'normal');
    }

    this.#statusSlot = getRef<HTMLSlotElement>(this, 'status-slot');
    this.#statusSlot?.addEventListener('slotchange', this.#handleStatusSlotChange);
    this.#syncStatusVisibility();

    this.#slot = getRef<HTMLSlotElement>(this, 'items-slot');
    this.#slot?.addEventListener('slotchange', this.#handleSlotChange);

    // スロット変更が発火しない環境向け（子の増減）
    this.#childObserver = new MutationObserver(() => this.#syncItems());
    this.#childObserver.observe(this, { childList: true });

    // 子のインタラクション変更（href/interaction）に追従
    this.#itemsObserver = new MutationObserver(() => this.#syncItems());
    this.#syncStatusLive();
    this.#syncItems();
  }

  disconnectedCallback() {
    this.#statusSlot?.removeEventListener('slotchange', this.#handleStatusSlotChange);
    this.#statusSlot = null;
    this.#slot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#slot = null;
    this.#itemsObserver?.disconnect();
    this.#itemsObserver = null;
    this.#childObserver?.disconnect();
    this.#childObserver = null;
    super.disconnectedCallback();
  }

  orientationChanged(): void {
    this.#syncItems();
  }

  sizeChanged(): void {
    this.#syncItems();
  }

  statusLiveChanged(): void {
    this.#syncStatusLive();
  }

  #handleStatusSlotChange = (): void => {
    this.#syncStatusVisibility();
  };

  #handleSlotChange = (): void => {
    this.#syncItems();
  };

  #getItemTagName(): string {
    const tag = this.localName;
    return tag.endsWith('-step-navigation') ? `${tag}-item` : 'dads-step-navigation-item';
  }

  #syncStatusVisibility(): void {
    const status = getRef<HTMLElement>(this, 'status');
    if (!status) return;

    const slot = this.#statusSlot ?? getRef<HTMLSlotElement>(this, 'status-slot');
    if (!slot) return;

    // Safari/WebKit: :has(slot:empty) が信頼できないため、JSで制御する。
    const hasStatus =
      hasMeaningfulAssignedText(slot) || hasDirectMeaningfulSlottedContent(this, 'status');
    status.toggleAttribute('hidden', !hasStatus);
  }

  #syncStatusLive(): void {
    const status = getRef<HTMLElement>(this, 'status');
    if (!status) return;

    const live = normalizeStatusLive(this.getAttribute('status-live'));
    if (live === 'off') {
      status.removeAttribute('aria-live');
      status.removeAttribute('aria-atomic');
      return;
    }

    status.setAttribute('aria-live', live);
    status.setAttribute('aria-atomic', 'true');
  }

  #syncContainerSemantics(hasInteractiveItems: boolean): void {
    const nav = getRef<HTMLElement>(this, 'nav');
    if (!nav) return;

    if (hasInteractiveItems) {
      nav.removeAttribute('role');
      return;
    }

    nav.setAttribute('role', 'group');
  }

  #syncItems(): void {
    const orientation = normalizeOrientation(this.getAttribute('orientation'));
    const size = normalizeSize(this.getAttribute('size'));
    const itemTag = this.#getItemTagName();

    const items: HTMLElement[] = [];
    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.tagName.toLowerCase() !== itemTag) continue;
      items.push(child);
    }

    this.#itemsObserver?.disconnect();
    for (const item of items) {
      this.#itemsObserver?.observe(item, {
        attributes: true,
        attributeFilter: ['href', 'interaction'],
      });
    }

    const total = items.length;
    let hasInteractiveItems = false;
    for (let i = 0; i < total; i++) {
      const item = items[i];
      item.setAttribute('data-orientation', orientation);
      item.setAttribute('data-size', size);
      item.setAttribute('step', String(i + 1));
      item.toggleAttribute('data-first', i === 0);
      item.toggleAttribute('data-last', i === total - 1);
      item.setAttribute('role', 'listitem');
      item.setAttribute('aria-posinset', String(i + 1));
      item.setAttribute('aria-setsize', String(total));

      const href = item.getAttribute('href');
      if (href) hasInteractiveItems = true;
      else if (normalizeInteraction(item.getAttribute('interaction')) === 'button') {
        hasInteractiveItems = true;
      }
    }

    this.#syncContainerSemantics(hasInteractiveItems);
  }
}

/**
 * Step Navigation Item（各ステップ）
 *
 * @customElement dads-step-navigation-item
 * @tagname dads-step-navigation-item
 *
 * @slot title - ステップのタイトル
 * @slot description - ステップの説明（任意）
 *
 * @csspart step - ステップ要素（コネクタ線含む）
 * @csspart header - ヘッダー（リンクの場合は <a>）
 * @csspart number - ステップ番号（円形）
 * @csspart state-icon - 状態アイコン（completed/editing/error）
 * @csspart state-label - 状態ラベル（editing/error）
 * @csspart title - タイトル
 * @csspart description - 説明
 *
 * @attr {string} state - 状態 (reached | completed | editing | error | skipped)
 * @attr {string} href - リンクURL（指定時のみリンク表示）
 * @attr {string} interaction - ボタン相当のインタラクション (button)
 * @attr {string} target - リンクターゲット
 * @attr {string} rel - リンクrel
 * @attr {string} step - 親が付与する表示番号（1始まり）
 * @attr {string} label-step - スクリーンリーダー向け「ステップ」ラベル
 * @attr {string} label-completed - スクリーンリーダー向け「完了」ラベル
 * @attr {string} label-editing - 「編集中」ラベル
 * @attr {string} label-error - 「エラー」ラベル
 * @attr {string} label-skipped - スクリーンリーダー向け「スキップ」ラベル
 *
 * @fires dads-step-activate - interaction="button" のアクティベート時に発火（detail: {step, state, trigger}）
 */
export class DadsStepNavigationItem extends TypographyWebComponent {
  static readonly version = '0.1.0';

  static definition = {
    name: 'dads-step-navigation-item',
    template: html`
      <div part="step" id="step">
        <a part="header" id="header">
          <span part="visually-hidden step-label">ステップ</span>
          <span part="number" id="number">
            <span part="number-value" id="number-value"></span>

            <span part="state-icon" data-state-icon="completed" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11.5"></circle>
                <path d="M10 17.5 19.8 8l-1.5-1.5-8.1 8-4.1-4L4.5 12l5.6 5.5Z"></path>
              </svg>
            </span>
            <span part="visually-hidden state-sr" data-state-sr="completed">完了</span>

            <span part="state-icon" data-state-icon="editing" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.8 20c-.5 0-1-.2-1.3-.5-.3-.4-.5-.8-.5-1.3V5.6c0-.5.2-.9.5-1.3.4-.3.8-.5 1.3-.5h8L12 5.6H5.8v12.6h12.6V12l1.8-1.8v8c0 .5-.2 1-.5 1.3-.4.3-.8.5-1.3.5H5.8Zm3.6-5.4v-3.8l8.3-8.3a1.8 1.8 0 0 1 2.5 0l1.3 1.3.4.6a1.7 1.7 0 0 1 0 1.3c-.1.3-.2.5-.4.6l-8.3 8.3H9.4Zm1.8-1.8h1.3l5.2-5.2L17 7l-.7-.7-5.2 5.2v1.3Z"></path>
              </svg>
            </span>
            <span part="state-label" data-state-label="editing">編集中</span>

            <span part="state-icon" data-state-icon="error" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M1 21 12 2l11 19H1Zm3.5-2h15L12 6 4.5 19Zm7.5-1c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 0 0-.3-.7 1 1 0 0 0-.7-.3 1 1 0 0 0-.7.3 1 1 0 0 0-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3Zm-1-3h2v-5h-2v5Z"></path>
              </svg>
            </span>
            <span part="state-label" data-state-label="error">エラー</span>

            <span part="visually-hidden state-sr" data-state-sr="skipped">スキップされました</span>
          </span>
          <span part="title" id="title">
            <slot name="title" id="title-slot"><slot id="title-fallback-slot"></slot></slot>
          </span>
        </a>
        <p part="description" id="description">
          <slot name="description" id="description-slot"></slot>
        </p>
      </div>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        stepNavigationSemanticTokens,
        stepNavigationItemStyles,
      ],
      'minimal',
    ),
    attributes: [
      PropertyAttr('state'),
      PropertyAttr('step'),
      PropertyAttr('href'),
      PropertyAttr('interaction'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
      PropertyAttr('labelStep', 'label-step'),
      PropertyAttr('labelCompleted', 'label-completed'),
      PropertyAttr('labelEditing', 'label-editing'),
      PropertyAttr('labelError', 'label-error'),
      PropertyAttr('labelSkipped', 'label-skipped'),
    ],
  };


  #header: HTMLElement | null = null;
  #titleSlot: HTMLSlotElement | null = null;
  #titleFallbackSlot: HTMLSlotElement | null = null;
  #descriptionSlot: HTMLSlotElement | null = null;

  connectedCallback() {
    super.connectedCallback();

    this.#header = getRef<HTMLElement>(this, 'header');
    this.#header?.addEventListener('click', this.#handleHeaderClick);
    this.#header?.addEventListener('keydown', this.#handleHeaderKeydown);

    this.#titleSlot = getRef<HTMLSlotElement>(this, 'title-slot');
    this.#titleFallbackSlot = getRef<HTMLSlotElement>(this, 'title-fallback-slot');
    this.#descriptionSlot = getRef<HTMLSlotElement>(this, 'description-slot');

    this.#titleSlot?.addEventListener('slotchange', this.#handleTitleSlotChange);
    this.#titleFallbackSlot?.addEventListener('slotchange', this.#handleTitleSlotChange);
    this.#descriptionSlot?.addEventListener('slotchange', this.#handleDescriptionSlotChange);

    this.#syncNumber();
    this.#syncLink();
    this.#syncLabels();
    this.#syncInteraction();
    this.#syncTitleVisibility();
    this.#syncDescriptionVisibility();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
  }

  disconnectedCallback() {
    this.#header?.removeEventListener('click', this.#handleHeaderClick);
    this.#header?.removeEventListener('keydown', this.#handleHeaderKeydown);
    this.#header = null;

    this.#titleSlot?.removeEventListener('slotchange', this.#handleTitleSlotChange);
    this.#titleSlot = null;
    this.#titleFallbackSlot?.removeEventListener('slotchange', this.#handleTitleSlotChange);
    this.#titleFallbackSlot = null;
    this.#descriptionSlot?.removeEventListener('slotchange', this.#handleDescriptionSlotChange);
    this.#descriptionSlot = null;
    super.disconnectedCallback();
  }

  stepChanged(): void {
    this.#syncNumber();
  }

  hrefChanged(): void {
    this.#syncLink();
    this.#syncInteraction();
  }

  interactionChanged(): void {
    this.#syncInteraction();
  }

  targetChanged(): void {
    this.#syncLink();
  }

  relChanged(): void {
    this.#syncLink();
  }

  labelStepChanged(): void {
    this.#syncLabels();
  }

  labelCompletedChanged(): void {
    this.#syncLabels();
  }

  labelEditingChanged(): void {
    this.#syncLabels();
  }

  labelErrorChanged(): void {
    this.#syncLabels();
  }

  labelSkippedChanged(): void {
    this.#syncLabels();
  }

  #syncNumber(): void {
    const num = this.getAttribute('step') ?? '';
    const el = getRef<HTMLElement>(this, 'number-value');
    if (el) el.textContent = num;
  }

  #syncLabels(): void {
    const srStep = this.shadowRoot?.querySelector<HTMLElement>('[part~="step-label"]');
    if (srStep) srStep.textContent = this.getAttribute('label-step') ?? 'ステップ';

    const srCompleted = this.shadowRoot?.querySelector<HTMLElement>('[data-state-sr="completed"]');
    if (srCompleted) srCompleted.textContent = this.getAttribute('label-completed') ?? '完了';

    const srSkipped = this.shadowRoot?.querySelector<HTMLElement>('[data-state-sr="skipped"]');
    if (srSkipped) srSkipped.textContent = this.getAttribute('label-skipped') ?? 'スキップされました';

    const labelEditing = this.shadowRoot?.querySelector<HTMLElement>('[data-state-label="editing"]');
    if (labelEditing) labelEditing.textContent = this.getAttribute('label-editing') ?? '編集中';

    const labelError = this.shadowRoot?.querySelector<HTMLElement>('[data-state-label="error"]');
    if (labelError) labelError.textContent = this.getAttribute('label-error') ?? 'エラー';
  }

  #isButtonInteraction(): boolean {
    if (this.getAttribute('href')) return false;
    return normalizeInteraction(this.getAttribute('interaction')) === 'button';
  }

  #syncInteraction(): void {
    const header = this.#header ?? getRef<HTMLElement>(this, 'header');
    if (!header) return;

    if (this.getAttribute('href')) {
      header.removeAttribute('role');
      header.removeAttribute('tabindex');
      return;
    }

    if (this.#isButtonInteraction()) {
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      return;
    }

    header.removeAttribute('role');
    header.removeAttribute('tabindex');
  }

  #syncLink(): void {
    const header = (this.#header ?? getRef<HTMLElement>(this, 'header')) as HTMLAnchorElement | null;
    if (!header) return;

    const href = this.getAttribute('href');
    if (href) header.setAttribute('href', href);
    else header.removeAttribute('href');

    const target = this.getAttribute('target');
    if (target) header.setAttribute('target', target);
    else header.removeAttribute('target');

    const rel = this.getAttribute('rel');
    if (rel) header.setAttribute('rel', rel);
    else header.removeAttribute('rel');
  }

  #handleTitleSlotChange = (): void => {
    this.#syncTitleVisibility();
  };

  #handleDescriptionSlotChange = (): void => {
    this.#syncDescriptionVisibility();
  };

  #syncTitleVisibility(): void {
    const wrap = getRef<HTMLElement>(this, 'title');
    if (!wrap) return;

    const titleSlot = this.#titleSlot ?? getRef<HTMLSlotElement>(this, 'title-slot');
    const fallbackSlot = this.#titleFallbackSlot ?? getRef<HTMLSlotElement>(this, 'title-fallback-slot');

    if (!titleSlot || !fallbackSlot) return;

    const hasTitle =
      hasMeaningfulAssignedText(titleSlot) || hasMeaningfulAssignedText(fallbackSlot);
    wrap.toggleAttribute('hidden', !hasTitle);
  }

  #syncDescriptionVisibility(): void {
    const wrap = getRef<HTMLElement>(this, 'description');
    if (!wrap) return;

    const slot = this.#descriptionSlot ?? getRef<HTMLSlotElement>(this, 'description-slot');
    if (!slot) return;

    // Safari/WebKit: :has(slot:empty) が信頼できないため、JSで制御する。
    const hasDescription =
      hasMeaningfulAssignedText(slot) || hasDirectMeaningfulSlottedContent(this, 'description');
    wrap.toggleAttribute('hidden', !hasDescription);
  }

  #handleHeaderClick = (event: MouseEvent): void => {
    if (!this.#isButtonInteraction()) return;
    event.preventDefault();
    this.#emitActivateEvent('click');
  };

  #handleHeaderKeydown = (event: KeyboardEvent): void => {
    if (!this.#isButtonInteraction()) return;
    if (event.key !== Keys.enter && event.key !== Keys.space) return;
    event.preventDefault();
    this.#emitActivateEvent('keyboard');
  };

  #emitActivateEvent(trigger: 'click' | 'keyboard'): void {
    this.dispatchEvent(
      new CustomEvent('dads-step-activate', {
        detail: {
          step: this.getAttribute('step'),
          state: this.getAttribute('state') as State | null,
          trigger,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
