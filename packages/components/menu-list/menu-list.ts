/**
 * @module menu-list
 * デジタル庁デザインシステム Menu List / Menu List Item
 */

import { html, PropertyAttr, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { menuListTokens } from './menu-list-tokens.js';
import { menuListStyles, menuListItemStyles } from './menu-list-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

/**
 * メニューリストコンポーネント
 *
 * @customElement dads-menu-list
 * @tagname dads-menu-list
 *
 * @slot default - メニュー項目（dads-menu-list-item）
 *
 * @csspart base - role="list" のルート
 *
 * @attr {number} indentation - インデント（CSS変数 --menu-list-indentation に反映）
 */
export class DadsMenuList extends TypographyWebComponent {
  static definition = {
    name: 'dads-menu-list',
    template: html`
      <div part="base" role="list" id="base">
        <slot></slot>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), menuListTokens, menuListStyles], 'minimal'),
    attributes: [PropertyAttr('indentation')],
  };

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'メニューリスト仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        'メニュー項目の集合を表します。ナビゲーション用途の場合は、上位で<nav>等の適切なランドマークを付与します。',
      ],
      keyboard: [
        '各メニュー項目（dads-menu-list-item）の内部要素がTabでフォーカス可能です。',
      ],
      zoom: [
        '相対単位（rem）ベースのトークンを利用し、ズーム時もレイアウトが破綻しないことを想定します。',
      ],
      states: [
        'インデントは CSS 変数 --menu-list-indentation（数値）で制御します。',
      ],
      labels: [
        '必要に応じて aria-label / aria-labelledby を利用してください。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [],
  };

  declare indentation: string | null;

  connectedCallback(): void {
    super.connectedCallback();
    this.#syncIndentation();
  }

  indentationChanged(): void {
    this.#syncIndentation();
  }

  #syncIndentation(): void {
    const raw = (this.getAttribute('indentation') ?? '').trim();
    if (!raw) {
      this.style.removeProperty('--menu-list-indentation');
      return;
    }

    const n = Number(raw);
    if (Number.isNaN(n) || n < 0) {
      this.style.removeProperty('--menu-list-indentation');
      return;
    }

    this.style.setProperty('--menu-list-indentation', String(n));
  }
}

type EndIconKind = 'arrow-right' | 'caret' | 'none';
type TailIconKind = 'new-window' | 'none';
type MenuListVariant = 'standard' | 'box';
type MenuListSize = 'regular' | 'small';

const menuListItemInnerHtml = `
  <span part="start-icon" id="start-icon">
    <slot name="start-icon" id="start-icon-slot"></slot>
  </span>
  <span part="label" id="label">
    <slot></slot>
    <span part="tail-icon" id="tail-icon">
      <slot name="tail-icon" id="tail-icon-slot">
        <svg width="16" height="16" viewBox="0 0 48 48" role="img" aria-label="新規タブで開きます">
          <path d="M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z" fill="currentcolor"/>
        </svg>
      </slot>
    </span>
  </span>
  <span part="end-icon" id="end-icon">
    <slot name="end-icon" id="end-icon-slot">
      <svg data-icon="arrow-right" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
        <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z"/>
      </svg>
      <svg data-icon="caret" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
        <path d="M12.5 17.1 3.5 8l1-1 8 8 8-8 1 1-9 9.1Z"/>
      </svg>
    </slot>
  </span>
`;

/**
 * メニューリスト項目コンポーネント
 *
 * @customElement dads-menu-list-item
 * @tagname dads-menu-list-item
 *
 * @slot default - ラベル
 * @slot start-icon - 先頭アイコン
 * @slot tail-icon - ラベル末尾アイコン（デフォルト: 新規タブで開く）
 * @slot end-icon - 末尾アイコン（arrow-right / caret）
 * @slot children - 子メニュー（ネスト）
 *
 * @csspart base - ボタン/リンク本体
 * @csspart start-icon - 先頭アイコン領域
 * @csspart label - ラベル領域
 * @csspart tail-icon - ラベル末尾アイコン領域
 * @csspart end-icon - 末尾アイコン領域
 *
 * @attr {string} variant - 表示タイプ（standard | box）
 * @attr {string} size - サイズ（regular | small）
 * @attr {boolean} current - 現在地
 * @attr {boolean} expanded - 展開状態
 * @attr {string} end-icon - 末尾アイコン（arrow-right | caret | none）
 * @attr {string} tail-icon - ラベル末尾アイコン（new-window | none）
 * @attr {string} href - リンクURL（指定時は <a> として動作）
 * @attr {string} target - リンクターゲット
 * @attr {string} rel - リンクrel
 * @attr {boolean} download - download属性
 */
export class DadsMenuListItem extends TypographyWebComponent {
  #base: HTMLElement | null = null;
  #startSlot: HTMLSlotElement | null = null;
  #tailSlot: HTMLSlotElement | null = null;
  #childObserver: MutationObserver | null = null;
  #isEndIconAuto = false;
  #isSyncingAutoEndIcon = false;

  static definition = {
    name: 'dads-menu-list-item',
    template: html`
      <button part="base" type="button" id="base">
        ${menuListItemInnerHtml}
      </button>
      <slot name="children"></slot>
    `,
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), menuListTokens, menuListItemStyles],
      'minimal'
    ),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('size'),
      BooleanAttr('current'),
      BooleanAttr('expanded'),
      PropertyAttr('end-icon'),
      PropertyAttr('tail-icon'),
      PropertyAttr('href'),
      PropertyAttr('target'),
      PropertyAttr('rel'),
      BooleanAttr('download'),
    ],
  };

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'メニューリスト項目仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        '内部は <button> または <a>（href指定時）で実装します。',
        'current属性で現在地（選択中）状態を視覚的に示します。',
      ],
      keyboard: [
        'Tabでフォーカス可能です。',
      ],
      zoom: [
        'サイズ: regular / small。',
      ],
      states: [
        'variant="standard|box" で表示タイプを切り替えます。',
        'expanded属性で end-icon を回転します（展開状態の表現）。',
      ],
      labels: [
        '末尾アイコン（tail-icon）は新規タブで開く等の補助情報に利用できます。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [],
  };

  declare variant: MenuListVariant;
  declare size: MenuListSize;
  declare current: boolean;
  declare expanded: boolean;
  declare ['end-icon']: EndIconKind | null;
  declare ['tail-icon']: TailIconKind | null;
  declare href: string | null;
  declare target: string | null;
  declare rel: string | null;
  declare download: boolean;

  connectedCallback(): void {
    super.connectedCallback();

    const hasExplicitEndIcon = this.hasAttribute('end-icon');
    const isInsideMenuListBox = this.#isInsideMenuListBox();
    const hasChildrenMenuList = this.#syncChildSlotting();

    setDefaultAttributes(this, {
      variant: isInsideMenuListBox ? 'box' : 'standard',
      size: 'regular',
      'tail-icon': 'none',
    });

    if (isInsideMenuListBox && !hasExplicitEndIcon) {
      // Menu List Box items are "box" style and have no end icon by default.
      // (If needed, users can explicitly set end-icon.)
      this.setAttribute('end-icon', 'none');
    } else if (!hasExplicitEndIcon) {
      this.#isEndIconAuto = true;
      this.#syncAutoEndIcon(hasChildrenMenuList);
    }

    this.#renderTemplate();

    // MutationObserver fallback (happy-dom などで slotchange が発火しないケースに対応)
    if (!this.#childObserver) {
      this.#childObserver = new MutationObserver(() => {
        const hasChildren = this.#syncChildSlotting();
        this.#syncAutoEndIcon(hasChildren);
        this.#syncIconFallbackVisibility();
      });
      this.#childObserver.observe(this, {
        childList: true,
        // slot 属性変更を子要素で検知するため subtree を有効化する
        subtree: true,
        attributes: true,
        attributeFilter: ['slot'],
      });
    }
  }

  disconnectedCallback(): void {
    if (this.#startSlot) this.#startSlot.removeEventListener('slotchange', this.#handleSlotsChanged);
    if (this.#tailSlot) this.#tailSlot.removeEventListener('slotchange', this.#handleSlotsChanged);
    this.#childObserver?.disconnect();
    this.#childObserver = null;
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'href') {
      this.#renderTemplate();
      return;
    }

    if (name === 'target' || name === 'rel' || name === 'download') {
      this.#syncLinkAttributes();
      return;
    }

    if (name === 'expanded') {
      this.#syncAutoEndIcon(this.#hasChildrenMenuList());
      return;
    }

    if (name === 'end-icon') {
      if (this.#isEndIconAuto && !this.#isSyncingAutoEndIcon) {
        // User override
        this.#isEndIconAuto = false;
      }
      this.#syncIconFallbackVisibility();
      return;
    }

    if (name === 'tail-icon') {
      this.#syncIconFallbackVisibility();
      return;
    }
  }

  /**
   * MenuListBox等が内部のフォーカス対象を参照するためのAPI
   */
  getFocusTarget(): HTMLElement | null {
    return this.#base;
  }

  focus(options?: FocusOptions): void {
    this.#base?.focus(options);
  }

  #isLink(): boolean {
    return this.hasAttribute('href');
  }

  #isInsideMenuListBox(): boolean {
    let current = this.parentElement;
    while (current) {
      if (current.localName.endsWith('-menu-list-box')) return true;
      current = current.parentElement;
    }
    return false;
  }

  #renderTemplate(): void {
    if (!this.shadowRoot) return;
    const template = this.#createTemplate(this.#isLink());
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#base = this.shadowRoot.querySelector('#base') as HTMLElement | null;
    this.#startSlot = this.shadowRoot.querySelector('#start-icon-slot') as HTMLSlotElement | null;
    this.#tailSlot = this.shadowRoot.querySelector('#tail-icon-slot') as HTMLSlotElement | null;

    this.#setupSlotListeners();
    this.#syncIconFallbackVisibility();
    this.#syncLinkAttributes();
  }

  #createTemplate(isLink: boolean): HTMLTemplateElement {
    const template = document.createElement('template');
    const inner = menuListItemInnerHtml;

    if (isLink) {
      // Create anchor element safely to prevent XSS via javascript: URLs
      const anchor = document.createElement('a');
      anchor.setAttribute('part', 'base');
      anchor.setAttribute('id', 'base');

      const href = this.getAttribute('href') || '#';
      // Validate URL scheme - only allow safe URL types
      const isValidUrl =
        href === '#' ||
        href.startsWith('/') ||
        href.startsWith('#') ||
        href.startsWith('./') ||
        href.startsWith('../') ||
        /^https?:\/\//i.test(href) ||
        /^mailto:/i.test(href) ||
        /^tel:/i.test(href);

      if (isValidUrl) {
        anchor.href = href;
      } else {
        // Fallback to '#' for potentially malicious URLs (e.g., javascript:)
        anchor.href = '#';
      }

      anchor.innerHTML = inner;
      const childrenSlot = document.createElement('slot');
      childrenSlot.setAttribute('name', 'children');
      template.content.append(anchor, childrenSlot);
    } else {
      template.innerHTML = `
        <button part="base" id="base" type="button">
          ${inner}
        </button>
        <slot name="children"></slot>
      `;
    }

    return template;
  }

  #syncChildSlotting(): boolean {
    const children = Array.from(this.children) as HTMLElement[];
    let hasChildrenMenuList = false;
    for (const child of children) {
      const slot = child.getAttribute('slot');

      if (child.localName.endsWith('-menu-list')) {
        hasChildrenMenuList = true;
      }

      if (slot) continue;

      if (child.localName.endsWith('-menu-list')) {
        child.setAttribute('slot', 'children');
      }
    }

    return hasChildrenMenuList;
  }

  #hasChildrenMenuList(): boolean {
    return Array.from(this.children).some((child) => child.localName.endsWith('-menu-list'));
  }

  #syncAutoEndIcon(hasChildrenMenuList: boolean): void {
    if (!this.#isEndIconAuto) return;
    const hasEndIconAttr = this.hasAttribute('end-icon');
    const endIcon = (this.getAttribute('end-icon') ?? 'none') as EndIconKind;

    const shouldShowCaret = this.hasAttribute('expanded') || hasChildrenMenuList;
    const next: EndIconKind = shouldShowCaret ? 'caret' : 'none';
    if (hasEndIconAttr && endIcon === next) return;

    this.#isSyncingAutoEndIcon = true;
    this.setAttribute('end-icon', next);
    this.#isSyncingAutoEndIcon = false;
  }

  #syncLinkAttributes(): void {
    const base = this.#base;
    if (!base) return;
    if (!(base instanceof HTMLAnchorElement)) return;

    const target = this.getAttribute('target');
    const rel = this.getAttribute('rel');
    const download = this.hasAttribute('download');

    if (target) base.setAttribute('target', target);
    else base.removeAttribute('target');

    if (rel) base.setAttribute('rel', rel);
    else base.removeAttribute('rel');

    if (download) base.setAttribute('download', '');
    else base.removeAttribute('download');
  }

  #handleSlotsChanged = (): void => {
    this.#syncIconFallbackVisibility();
  };

  #setupSlotListeners(): void {
    if (this.#startSlot) {
      this.#startSlot.removeEventListener('slotchange', this.#handleSlotsChanged);
      this.#startSlot.addEventListener('slotchange', this.#handleSlotsChanged);
    }
    if (this.#tailSlot) {
      this.#tailSlot.removeEventListener('slotchange', this.#handleSlotsChanged);
      this.#tailSlot.addEventListener('slotchange', this.#handleSlotsChanged);
    }
  }

  #hasSlottedContent(slot: HTMLSlotElement | null, slotName: string): boolean {
    const hasAssigned = (() => {
      const s = slot;
      if (!s) return false;
      const nodes = s.assignedNodes({ flatten: true });
      for (const node of nodes) {
        // Some environments may incorrectly include fallback nodes as "assigned".
        // Fallback nodes are contained in the <slot> itself; real slotted nodes are not.
        if (s.contains(node)) continue;
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '') return true;
      }
      return false;
    })();
    if (hasAssigned) return true;

    // Fallback: some environments (e.g. happy-dom) may not fully implement slot assignment.
    return this.querySelector(`[slot="${slotName}"]`) !== null;
  }

  #syncIconFallbackVisibility(): void {
    const hasStartSlot = this.#hasSlottedContent(this.#startSlot, 'start-icon');
    this.toggleAttribute('data-has-start-icon', hasStartSlot);

    // Tail icon wrapper is only shown when:
    // - slot has assigned nodes, OR
    // - tail-icon attribute is not "none"
    const tailKind = (this.getAttribute('tail-icon') ?? 'none') as TailIconKind;
    const hasTailSlot = this.#hasSlottedContent(this.#tailSlot, 'tail-icon');

    const shouldShowTail = tailKind !== 'none' || hasTailSlot;
    this.toggleAttribute('data-has-tail-icon', shouldShowTail);

    // End icon fallbacks: show one of the fallback svgs
    const endKind = (this.getAttribute('end-icon') ?? 'arrow-right') as EndIconKind;
    const endIcon = this.shadowRoot?.querySelector('[part="end-icon"]') as HTMLElement | null;
    if (endIcon) {
      const arrow = endIcon.querySelector('[data-icon="arrow-right"]') as HTMLElement | null;
      const caret = endIcon.querySelector('[data-icon="caret"]') as HTMLElement | null;
      if (arrow) arrow.toggleAttribute('hidden', endKind !== 'arrow-right');
      if (caret) caret.toggleAttribute('hidden', endKind !== 'caret');
    }
  }
}
