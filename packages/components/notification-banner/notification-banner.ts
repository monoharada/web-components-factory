/**
 * @module notification-banner
 * デジタル庁デザインシステム Notification Banner コンポーネント
 * @version 1.0.0
 */

import { html, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { hasSlotContent } from '../../utils/dom.js';
import { notificationBannerTokens } from './notification-banner-tokens.js';
import { notificationBannerStyles } from './notification-banner-styles.js';

type NotificationBannerType = 'success' | 'error' | 'warning' | 'info-1' | 'info-2';
type NotificationBannerVariant = 'standard' | 'color-chip';
type NotificationBannerCloseStyle = 'default' | 'compact';
type NotificationBannerActionsLayout = 'vertical' | 'horizontal';
type NotificationBannerInteraction = 'none' | 'title-and-actions' | 'whole' | 'actions-only';
type NotificationBannerDismissMode = 'hide' | 'collapse';

const VALID_TYPES = new Set<NotificationBannerType>(['success', 'error', 'warning', 'info-1', 'info-2']);
const VALID_VARIANTS = new Set<NotificationBannerVariant>(['standard', 'color-chip']);
const VALID_CLOSE_STYLES = new Set<NotificationBannerCloseStyle>(['default', 'compact']);
const VALID_ACTIONS_LAYOUTS = new Set<NotificationBannerActionsLayout>(['vertical', 'horizontal']);
const VALID_INTERACTIONS = new Set<NotificationBannerInteraction>([
  'none',
  'title-and-actions',
  'whole',
  'actions-only',
]);
const VALID_DISMISS_MODES = new Set<NotificationBannerDismissMode>(['hide', 'collapse']);
const DEFAULT_ATTRIBUTE_VALUES = [
  ['type', 'info-1'],
  ['variant', 'standard'],
  ['close-style', 'default'],
  ['actions-layout', 'horizontal'],
  ['interaction', 'none'],
  ['dismiss-mode', 'hide'],
  ['close-label', '閉じる'],
  ['restore-label', '再表示'],
] as const;

type CloseDetail = {
  type: NotificationBannerType;
  variant: NotificationBannerVariant;
  dismissMode: NotificationBannerDismissMode;
};

type RestoreDetail = CloseDetail;

/**
 * ノティフィケーションバナーコンポーネント
 *
 * @customElement
 * @tagname dads-notification-banner
 *
 * @slot title - バナータイトル（必須）
 * @slot icon - バナーアイコン（未指定時はtypeに応じた既定アイコン）
 * @slot meta - 年月日などの補助情報
 * @slot default - バナーデスクリプション
 * @slot actions - アクションボタン群
 *
 * @csspart base - ルート要素
 * @csspart header - ヘッダー領域
 * @csspart icon - アイコン領域
 * @csspart title - タイトル領域
 * @csspart close - 閉じるボタン
 * @csspart close-icon - 閉じるアイコン
 * @csspart close-label - 閉じるラベル
 * @csspart body - 説明領域
 * @csspart meta - 年月日などの領域
 * @csspart description - バナーデスクリプション領域
 * @csspart actions - アクション領域
 * @csspart restore - 再表示導線の領域（dismiss-mode="collapse" 時）
 * @csspart restore-text - 折りたたみ時の補助テキスト
 * @csspart restore-button - 再表示ボタン
 *
 * @attr {'success' | 'error' | 'warning' | 'info-1' | 'info-2'} type - 情報タイプ
 * @attr {'standard' | 'color-chip'} variant - 表示スタイル
 * @attr {boolean} dismissible - 閉じるボタンを表示
 * @attr {boolean} dense - 省スペース表示（モバイル向け）
 * @attr {'default' | 'compact'} close-style - 閉じるボタンの見た目
 * @attr {'vertical' | 'horizontal'} actions-layout - アクションボタンの並び方向
 * @attr {'none' | 'title-and-actions' | 'whole' | 'actions-only'} interaction - リンク委譲のクリック領域
 * @attr {'hide' | 'collapse'} dismiss-mode - 閉じる押下時の挙動
 * @attr {string} close-label - 閉じるボタンのラベル
 * @attr {string} restore-label - 再表示ボタンのラベル
 *
 * @cssprop --dads-notification-banner-background - 背景色
 * @cssprop --dads-notification-banner-color - 本文文字色
 * @cssprop --dads-notification-banner-title-color - タイトル文字色
 * @cssprop --dads-notification-banner-border-color - 外枠色
 * @cssprop --dads-notification-banner-border-width - 外枠線幅
 * @cssprop --dads-notification-banner-border-radius - 角丸
 * @cssprop --dads-notification-banner-chip-color - color-chip左帯色
 * @cssprop --dads-notification-banner-icon-color - アイコン色
 * @cssprop --dads-notification-banner-action-color - アクション色
 *
 * @fires dads-notification-banner-close - 閉じる押下時に発火（detail: { type, variant, dismissMode }）
 * @fires dads-notification-banner-restore - 再表示押下時に発火（detail: { type, variant, dismissMode }）
 *
 * @example
 * ```html
 * <dads-notification-banner type="success" variant="standard" dismissible>
 *   <span slot="title">登録手続きは全て完了しました</span>
 *   <time slot="meta" datetime="2024-07-01">2024年7月1日</time>
 *   <p>ダミーテキストです。</p>
 *   <dads-button slot="actions" variant="outlined">詳細</dads-button>
 *   <dads-button slot="actions" variant="solid">確認</dads-button>
 * </dads-notification-banner>
 * ```
 */
export class DadsNotificationBanner extends TypographyWebComponent {
  static definition = {
    name: 'dads-notification-banner',
    template: html`
      <div part="base" id="base">
        <div part="header" id="header">
          <div part="icon" id="icon" aria-hidden="true">
            <slot name="icon" id="icon-slot">
              <svg data-default-icon="success" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="成功">
                <circle cx="12" cy="12" r="12" fill="currentcolor"></circle>
                <path d="M9.6 18 3.6 12 5.292 10.308 9.6 14.604l9.108-9.108L20.4 7.2 9.6 18Z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="error" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="エラー">
                <path d="M8.25 24 0 15.75v-7.5L8.25 0h7.5L24 8.25v7.5L15.75 24h-7.5Z" fill="currentcolor"></path>
                <path d="m12 13.4-2.85 2.85-1.4-1.4L10.6 12 7.75 9.15l1.4-1.4L12 10.6l2.85-2.85 1.4 1.4L13.4 12l2.85 2.85-1.4 1.4L12 13.4Z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="warning" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="警告">
                <path d="M0 20.7273h24L12 0 0 20.7273Z" fill="currentcolor"></path>
                <path d="M13.0909 17.4545h-2.1818v-2.1818h2.1818v2.1818Zm0-4.3636h-2.1818V8.7273h2.1818v4.3636Z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="info-1" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="インフォメーション">
                <circle cx="12" cy="12" r="12" fill="currentcolor"></circle>
                <circle cx="12" cy="7.2" r="1.2" fill="Canvas"></circle>
                <path d="M10.8 10.8h2.4V18h-2.4z" fill="Canvas"></path>
              </svg>
              <svg data-default-icon="info-2" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="インフォメーション">
                <circle cx="12" cy="12" r="12" fill="currentcolor"></circle>
                <circle cx="12" cy="7.2" r="1.2" fill="Canvas"></circle>
                <path d="M10.8 10.8h2.4V18h-2.4z" fill="Canvas"></path>
              </svg>
            </slot>
          </div>

          <div part="title" id="title">
            <slot name="title" id="title-slot"></slot>
          </div>

          <button part="close" id="close" type="button" hidden>
            <svg part="close-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.4 18.6-1-1 5.5-5.6-5.6-5.6 1.1-1 5.6 5.5 5.6-5.6 1 1.1L13 12l5.6 5.6-1 1L12 13l-5.6 5.6Z" fill="currentcolor"></path>
            </svg>
            <span part="close-label" id="close-label">閉じる</span>
          </button>
        </div>

        <div part="body" id="body">
          <div part="meta" id="meta" hidden>
            <slot name="meta" id="meta-slot"></slot>
          </div>
          <div part="description" id="description" hidden>
            <slot id="description-slot"></slot>
          </div>
        </div>

        <div part="actions" id="actions" hidden>
          <slot name="actions" id="actions-slot"></slot>
        </div>

        <div part="restore" id="restore" hidden>
          <span part="restore-text" id="restore-text"></span>
          <button part="restore-button" id="restore-button" type="button">再表示</button>
        </div>
      </div>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        notificationBannerTokens,
        notificationBannerStyles,
        applyDADSFocusStyles(),
      ],
      'minimal'
    ),
    attributes: [
      { attribute: 'type' },
      { attribute: 'variant' },
      BooleanAttr('dismissible'),
      BooleanAttr('dense'),
      { attribute: 'close-style' },
      { attribute: 'actions-layout' },
      { attribute: 'interaction' },
      { attribute: 'dismiss-mode' },
      { attribute: 'close-label' },
      { attribute: 'restore-label' },
    ],
  };

  #base: HTMLElement | null = null;
  #header: HTMLElement | null = null;
  #title: HTMLElement | null = null;
  #close: HTMLButtonElement | null = null;
  #closeLabel: HTMLElement | null = null;
  #body: HTMLElement | null = null;
  #meta: HTMLElement | null = null;
  #description: HTMLElement | null = null;
  #actions: HTMLElement | null = null;
  #restore: HTMLElement | null = null;
  #restoreText: HTMLElement | null = null;
  #restoreButton: HTMLButtonElement | null = null;

  #titleSlot: HTMLSlotElement | null = null;
  #metaSlot: HTMLSlotElement | null = null;
  #descriptionSlot: HTMLSlotElement | null = null;
  #actionsSlot: HTMLSlotElement | null = null;

  #primaryLink: HTMLAnchorElement | null = null;
  #abortController: AbortController | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    this.#base = this.shadowRoot?.querySelector('#base') ?? null;
    this.#header = this.shadowRoot?.querySelector('#header') ?? null;
    this.#title = this.shadowRoot?.querySelector('#title') ?? null;
    this.#close = this.shadowRoot?.querySelector('#close') as HTMLButtonElement | null;
    this.#closeLabel = this.shadowRoot?.querySelector('#close-label') ?? null;
    this.#body = this.shadowRoot?.querySelector('#body') ?? null;
    this.#meta = this.shadowRoot?.querySelector('#meta') ?? null;
    this.#description = this.shadowRoot?.querySelector('#description') ?? null;
    this.#actions = this.shadowRoot?.querySelector('#actions') ?? null;
    this.#restore = this.shadowRoot?.querySelector('#restore') ?? null;
    this.#restoreText = this.shadowRoot?.querySelector('#restore-text') ?? null;
    this.#restoreButton = this.shadowRoot?.querySelector('#restore-button') as HTMLButtonElement | null;

    this.#titleSlot = this.shadowRoot?.querySelector('#title-slot') as HTMLSlotElement | null;
    this.#metaSlot = this.shadowRoot?.querySelector('#meta-slot') as HTMLSlotElement | null;
    this.#descriptionSlot = this.shadowRoot?.querySelector('#description-slot') as HTMLSlotElement | null;
    this.#actionsSlot = this.shadowRoot?.querySelector('#actions-slot') as HTMLSlotElement | null;

    this.#ensureDefaultAttributes();
    this.#bindEvents();
    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#abortController?.abort();
    this.#abortController = null;
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;
    if (!this.isConnected) return;

    if (
      name === 'type' ||
      name === 'variant' ||
      name === 'close-style' ||
      name === 'actions-layout' ||
      name === 'interaction' ||
      name === 'dismiss-mode'
    ) {
      this.#normalizeEnumAttributes();
    }

    this.#syncAll();
  }

  #ensureDefaultAttributes(): void {
    for (const [name, value] of DEFAULT_ATTRIBUTE_VALUES) {
      if (!this.hasAttribute(name)) {
        this.setAttribute(name, value);
      }
    }
  }

  #bindEvents(): void {
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    const signal = this.#abortController.signal;

    this.#close?.addEventListener('click', this.#handleCloseClick, { signal });
    this.#restoreButton?.addEventListener('click', this.#handleRestoreClick, { signal });

    this.#base?.addEventListener('click', this.#handleBaseClick, { signal });
    this.#title?.addEventListener('click', this.#handleTitleClick, { signal });

    this.#base?.addEventListener('keydown', this.#handleBaseKeydown, { signal });
    this.#title?.addEventListener('keydown', this.#handleTitleKeydown, { signal });

    this.#titleSlot?.addEventListener('slotchange', this.#handleSlotChange, { signal });
    this.#metaSlot?.addEventListener('slotchange', this.#handleSlotChange, { signal });
    this.#descriptionSlot?.addEventListener('slotchange', this.#handleSlotChange, { signal });
    this.#actionsSlot?.addEventListener('slotchange', this.#handleSlotChange, { signal });
  }

  #handleSlotChange = (): void => {
    this.#syncAll();
  };

  #handleCloseClick = (event: MouseEvent): void => {
    // Close interaction should not trigger outer click delegation.
    event.preventDefault();
    event.stopPropagation();

    const detail: CloseDetail = {
      type: this.#getType(),
      variant: this.#getVariant(),
      dismissMode: this.#getDismissMode(),
    };

    const shouldClose = this.dispatchEvent(
      new CustomEvent<CloseDetail>('dads-notification-banner-close', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail,
      })
    );

    if (shouldClose) {
      this.#applyDismissState();
    }
  };

  #handleRestoreClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.hasAttribute('data-dismissed')) return;

    const detail: RestoreDetail = {
      type: this.#getType(),
      variant: this.#getVariant(),
      dismissMode: this.#getDismissMode(),
    };

    this.dispatchEvent(
      new CustomEvent<RestoreDetail>('dads-notification-banner-restore', {
        bubbles: true,
        composed: true,
        detail,
      })
    );

    this.hidden = false;
    this.removeAttribute('data-dismissed');
    this.#syncAll();
  };

  #applyDismissState(): void {
    this.setAttribute('data-dismissed', '');

    if (this.#getDismissMode() === 'collapse') {
      this.hidden = false;
      this.#syncAll();
      return;
    }

    this.hidden = true;
  }

  #handleBaseClick = (event: MouseEvent): void => {
    this.#maybeDelegateByInteraction(event, 'whole');
  };

  #handleTitleClick = (event: MouseEvent): void => {
    this.#maybeDelegateByInteraction(event, 'title-and-actions');
  };

  #handleBaseKeydown = (event: KeyboardEvent): void => {
    this.#handleLinkDelegationKeydown(event, 'whole');
  };

  #handleTitleKeydown = (event: KeyboardEvent): void => {
    this.#handleLinkDelegationKeydown(event, 'title-and-actions');
  };

  #syncAll(): void {
    this.#normalizeEnumAttributes();
    this.#syncCloseState();
    this.#syncSectionVisibility();
    this.#syncDismissState();
    this.#syncPrimaryLink();
    this.#syncInteractionState();
  }

  #normalizeEnumAttributes(): void {
    this.#normalizeAttributeValue('type', (value) => this.#normalizeType(value));
    this.#normalizeAttributeValue('variant', (value) => this.#normalizeVariant(value));
    this.#normalizeAttributeValue('close-style', (value) => this.#normalizeCloseStyle(value));
    this.#normalizeAttributeValue('actions-layout', (value) => this.#normalizeActionsLayout(value));
    this.#normalizeAttributeValue('interaction', (value) => this.#normalizeInteraction(value));
    this.#normalizeAttributeValue('dismiss-mode', (value) => this.#normalizeDismissMode(value));
  }

  #normalizeAttributeValue<T extends string>(
    attrName: string,
    normalize: (value: string | null) => T
  ): void {
    const normalized = normalize(this.getAttribute(attrName));
    if (this.getAttribute(attrName) !== normalized) {
      this.setAttribute(attrName, normalized);
    }
  }

  #syncCloseState(): void {
    if (!this.#close || !this.#closeLabel) return;

    const label = this.getAttribute('close-label') || '閉じる';
    this.#close.hidden = !this.hasAttribute('dismissible');
    this.#close.setAttribute('aria-label', label);
    this.#closeLabel.textContent = label;
  }

  #syncSectionVisibility(): void {
    const hasMeta = hasSlotContent(this.#metaSlot);
    const hasDescription = hasSlotContent(this.#descriptionSlot);
    const hasActions = hasSlotContent(this.#actionsSlot);
    const actionsCount = this.#actionsSlot?.assignedElements({ flatten: true }).length ?? 0;

    this.#meta?.toggleAttribute('hidden', !hasMeta);
    this.#description?.toggleAttribute('hidden', !hasDescription);
    this.#actions?.toggleAttribute('hidden', !hasActions);

    const hasBody = hasMeta || hasDescription;
    this.#body?.toggleAttribute('hidden', !hasBody);

    this.toggleAttribute('data-has-actions', hasActions);
    this.toggleAttribute('data-multiple-actions', actionsCount > 1);
    this.toggleAttribute('data-has-body', hasBody);
  }

  #syncDismissState(): void {
    if (!this.#header || !this.#body || !this.#actions || !this.#restore || !this.#restoreText || !this.#restoreButton) {
      return;
    }

    const collapsed = this.#isDismissedCollapsed();
    const restoreLabel = this.getAttribute('restore-label') || '再表示';
    const hasBody = this.hasAttribute('data-has-body');
    const hasActions = this.hasAttribute('data-has-actions');

    this.#header.toggleAttribute('hidden', collapsed);
    this.#body.toggleAttribute('hidden', collapsed || !hasBody);
    this.#actions.toggleAttribute('hidden', collapsed || !hasActions);
    this.#restore.toggleAttribute('hidden', !collapsed);

    this.#restoreText.textContent = this.#buildRestoreText();
    this.#restoreButton.textContent = restoreLabel;
    this.#restoreButton.setAttribute('aria-label', restoreLabel);
  }

  #buildRestoreText(): string {
    const titleText = this.#titleSlot
      ?.assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? '')
      .join(' ')
      .trim();

    if (!titleText) return '閉じた通知';
    return `閉じた通知: ${titleText}`;
  }

  #syncPrimaryLink(): void {
    this.#primaryLink = this.#findPrimaryLink();
  }

  #syncInteractionState(): void {
    const mode = this.#getInteraction();
    const hasPrimaryLink = this.#primaryLink !== null;

    this.removeAttribute('data-link-target');

    this.#base?.removeAttribute('tabindex');
    this.#base?.removeAttribute('role');
    this.#title?.removeAttribute('tabindex');
    this.#title?.removeAttribute('role');

    if (this.#isDismissedCollapsed()) {
      return;
    }

    if (!hasPrimaryLink || mode === 'none' || mode === 'actions-only') {
      return;
    }

    if (mode === 'whole') {
      this.setAttribute('data-link-target', 'whole');
      this.#base?.setAttribute('tabindex', '0');
      this.#base?.setAttribute('role', 'link');
      return;
    }

    this.setAttribute('data-link-target', 'title');
    this.#title?.setAttribute('tabindex', '0');
    this.#title?.setAttribute('role', 'link');
  }

  #findPrimaryLink(): HTMLAnchorElement | null {
    const fromTitle = this.#findAnchorInSlot(this.#titleSlot);
    if (fromTitle) return fromTitle;

    const fallback = this.querySelector('a[href]');
    if (fallback instanceof HTMLAnchorElement) {
      return fallback;
    }

    return null;
  }

  #findAnchorInSlot(slot: HTMLSlotElement | null): HTMLAnchorElement | null {
    if (!slot) return null;

    const assigned = slot.assignedElements({ flatten: true });
    for (const element of assigned) {
      if (element instanceof HTMLAnchorElement && element.hasAttribute('href')) {
        return element;
      }
      const anchor = element.querySelector('a[href]');
      if (anchor instanceof HTMLAnchorElement) {
        return anchor;
      }
    }

    return null;
  }

  #handleLinkDelegationKeydown(
    event: KeyboardEvent,
    expected: Exclude<NotificationBannerInteraction, 'none' | 'actions-only'>
  ): void {
    if (this.#isDismissedCollapsed()) return;
    if (this.#getInteraction() !== expected) return;
    if (!this.#primaryLink) return;

    const key = event.key;
    if (key !== 'Enter' && key !== ' ') return;

    const target = event.currentTarget;
    if (expected === 'whole' && target !== this.#base) return;
    if (expected === 'title-and-actions' && target !== this.#title) return;

    event.preventDefault();
    this.#activatePrimaryLink();
  }

  #maybeDelegateByInteraction(
    event: MouseEvent,
    expected: Exclude<NotificationBannerInteraction, 'none' | 'actions-only'>
  ): void {
    if (this.#isDismissedCollapsed()) return;
    if (this.#getInteraction() !== expected) return;
    if (!this.#primaryLink) return;
    if (event.defaultPrevented) return;

    const target = event.target;
    const targetElement = target instanceof Element ? target : null;

    if (targetElement && this.#isInteractiveTarget(targetElement)) {
      return;
    }

    if (targetElement && this.#close?.contains(targetElement)) {
      return;
    }

    if (targetElement && this.#actions?.contains(targetElement)) {
      return;
    }

    event.preventDefault();
    this.#activatePrimaryLink();
  }

  #isInteractiveTarget(target: Element): boolean {
    return Boolean(target.closest('a[href],button,input,select,textarea,[role="button"]'));
  }

  #activatePrimaryLink(): void {
    this.#primaryLink?.click();
  }

  #normalizeType(value: string | null): NotificationBannerType {
    const normalized = (value ?? '').trim().toLowerCase();

    if (normalized === 'info1') return 'info-1';
    if (normalized === 'info2') return 'info-2';
    if (normalized && VALID_TYPES.has(normalized as NotificationBannerType)) {
      return normalized as NotificationBannerType;
    }
    return 'info-1';
  }

  #normalizeVariant(value: string | null): NotificationBannerVariant {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_VARIANTS.has(normalized as NotificationBannerVariant)) {
      return normalized as NotificationBannerVariant;
    }
    return 'standard';
  }

  #normalizeCloseStyle(value: string | null): NotificationBannerCloseStyle {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_CLOSE_STYLES.has(normalized as NotificationBannerCloseStyle)) {
      return normalized as NotificationBannerCloseStyle;
    }
    return 'default';
  }

  #normalizeActionsLayout(value: string | null): NotificationBannerActionsLayout {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_ACTIONS_LAYOUTS.has(normalized as NotificationBannerActionsLayout)) {
      return normalized as NotificationBannerActionsLayout;
    }
    return 'horizontal';
  }

  #normalizeInteraction(value: string | null): NotificationBannerInteraction {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_INTERACTIONS.has(normalized as NotificationBannerInteraction)) {
      return normalized as NotificationBannerInteraction;
    }
    return 'none';
  }

  #normalizeDismissMode(value: string | null): NotificationBannerDismissMode {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized && VALID_DISMISS_MODES.has(normalized as NotificationBannerDismissMode)) {
      return normalized as NotificationBannerDismissMode;
    }
    return 'hide';
  }

  #getType(): NotificationBannerType {
    return this.#normalizeType(this.getAttribute('type'));
  }

  #getVariant(): NotificationBannerVariant {
    return this.#normalizeVariant(this.getAttribute('variant'));
  }

  #getInteraction(): NotificationBannerInteraction {
    return this.#normalizeInteraction(this.getAttribute('interaction'));
  }

  #getDismissMode(): NotificationBannerDismissMode {
    return this.#normalizeDismissMode(this.getAttribute('dismiss-mode'));
  }

  #isDismissedCollapsed(): boolean {
    return this.hasAttribute('data-dismissed') && this.#getDismissMode() === 'collapse';
  }
}
