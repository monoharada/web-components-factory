/**
 * @module language-selector
 * デジタル庁デザインシステム Language Selector
 */

import { PropertyAttr } from '../../core/web-components.js';
import { isNotWhitespace } from '../../utils/dom.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { DadsMenuListBox } from '../menu-list-box/menu-list-box.js';
import { languageSelectorStyles } from './language-selector-styles.js';
import { languageSelectorTokens } from './language-selector-tokens.js';

type LanguageSelectorOpener = 'text' | 'icon';

type MenuItemSelectDetail = {
  selectedItem?: HTMLElement;
  selectedValue?: string;
  selectedIndex?: number;
};

export type DadsLanguageSelectorChangeDetail = Readonly<{
  value: string;
  selectedValue: string;
  selectedIndex: number;
  selectedItem: HTMLElement;
}>;

export type DadsLanguageSelectorSelectedLanguage = Readonly<{
  value: string;
  label: string;
  selectedIndex: number;
  selectedItem: HTMLElement;
}>;

const AUTO_OPENER_ICON_ATTR = 'data-language-selector-auto-opener-icon';
const AUTO_CHECK_ICON_ATTR = 'data-language-selector-auto-check-icon';
const AUTO_ITEM_SIZE_ATTR = 'data-language-selector-auto-item-size';
const MENU_LIST_ITEM_SUFFIX = '-menu-list-item';
const SVG_NS = 'http://www.w3.org/2000/svg';
const MENU_LIST_ITEM_DEFAULT_SIZE = 'regular';

const openerIconPath =
  'M12 21.5A9.5 9.5 0 0 1 2.5 12c0-5.2 4.3-9.5 9.5-9.5s9.6 4.3 9.5 9.5c0 5.2-4.3 9.5-9.5 9.5Zm0-1.5c1-1.3 1.7-2.8 2.1-4.3H10c.4 1.5 1 3 2.1 4.3Zm-2-.3c-.8-1.2-1.4-2.6-1.7-4H5c1 2 3 3.5 5.2 4Zm4 0c2.2-.5 4-2 5-4h-3.3c-.4 1.4-1 2.8-1.8 4Zm-9.7-5.5H8a13 13 0 0 1 0-4.4H4.3a8 8 0 0 0 0 4.4Zm5.2 0h5c.2-1.5.2-3 0-4.4h-5c-.2 1.5-.2 3 0 4.4Zm6.5 0h3.7a8 8 0 0 0 0-4.4H16c.2 1.5.2 3 0 4.4Zm-.3-5.9H19c-1-2-3-3.5-5.2-4 .8 1.2 1.4 2.6 1.8 4Zm-5.8 0H14A12 12 0 0 0 12 4a12 12 0 0 0-2.1 4.3Zm-5 0h3.4c.4-1.4 1-2.8 1.8-4-2.3.5-4.1 2-5.2 4Z';
const checkIconPath = 'm9.5 18-5.7-5.7 1.5-1.4 4.2 4.3L18.7 6l1.4 1.4L9.5 18Z';

const baseDefinition = DadsMenuListBox.definition;
const baseStyles = Array.isArray(baseDefinition.styles)
  ? baseDefinition.styles
  : [baseDefinition.styles];

function createSvg(pathData: string): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentcolor');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', pathData);
  svg.appendChild(path);
  return svg;
}

function isCurrentItem(item: HTMLElement): boolean {
  if (item.hasAttribute('current')) return true;
  const ariaCurrent = item.getAttribute('aria-current');
  return ariaCurrent !== null && ariaCurrent !== 'false';
}

function getSlottedElements(host: HTMLElement, slotName: string): Element[] {
  const elements: Element[] = [];
  for (const child of Array.from(host.children)) {
    if (!(child instanceof Element)) continue;
    if (child.getAttribute('slot') !== slotName) continue;
    elements.push(child);
  }
  return elements;
}

function getAutoSlottedElements(host: HTMLElement, slotName: string, autoAttr: string): Element[] {
  return getSlottedElements(host, slotName).filter((element) => element.hasAttribute(autoAttr));
}

function hasCustomSlottedElement(host: HTMLElement, slotName: string, autoAttr: string): boolean {
  return getSlottedElements(host, slotName).some((element) => !element.hasAttribute(autoAttr));
}

/**
 * ランゲージセレクターコンポーネント
 *
 * @customElement
 * @tagname dads-language-selector
 *
 * @slot default - 言語メニュー項目（dads-menu-list-item）
 * @slot icon - opener 先頭アイコン（省略時は地球アイコン）
 * @slot label - opener ラベル（省略時は opener に応じて Language/LANG）
 *
 * @csspart opener - opener ボタン
 * @csspart opener-icon - opener 先頭アイコン領域
 * @csspart opener-label - opener ラベル領域
 * @csspart opener-arrow - opener 末尾矢印アイコン
 * @csspart popup - ポップアップ領域
 * @csspart menu - role="menu" のメニュー領域
 *
 * @attr {'text' | 'icon'} opener - opener 表示タイプ（text | icon）
 * @attr {'sm' | 'md'} size - サイズ（sm=36px相当 / md=44px相当）
 * @attr {string} label - opener ラベル（slot未使用時のフォールバック）
 * @attr {boolean} open - 開閉状態
 *
 * @fires menuitemselect - 項目選択時に発火（継承）
 * @fires dads-change - 項目選択確定時に発火（detail: { value, selectedValue, selectedIndex, selectedItem }）
 *
 * @method getSelectedLanguage - 現在選択されている言語情報を返す（選択なしは null）
 */
export class DadsLanguageSelector extends DadsMenuListBox {
  static definition = {
    ...baseDefinition,
    name: 'dads-language-selector',
    styles: [...baseStyles, languageSelectorTokens, languageSelectorStyles],
    attributes: [...baseDefinition.attributes, PropertyAttr('opener')],
  };

  #iconSlot: HTMLSlotElement | null = null;
  #labelSlot: HTMLSlotElement | null = null;
  #itemsObserver: MutationObserver | null = null;
  #isSyncing = false;
  #isSyncingAutoLabel = false;
  #autoLabelManaged = true;

  declare opener: LanguageSelectorOpener;

  connectedCallback(): void {
    super.connectedCallback();

    this.#autoLabelManaged = !this.hasAttribute('label');
    setDefaultAttributes(this, {
      opener: 'text',
    });

    this.#iconSlot = this.shadowRoot?.querySelector('#icon-slot') as HTMLSlotElement | null;
    this.#labelSlot = this.shadowRoot?.querySelector('#label-slot') as HTMLSlotElement | null;

    this.#iconSlot?.addEventListener('slotchange', this.#handleSlotChange);
    this.#labelSlot?.addEventListener('slotchange', this.#handleSlotChange);
    this.addEventListener('menuitemselect', this.#handleMenuItemSelect as EventListener);

    this.#itemsObserver = new MutationObserver(() => this.#syncAll());
    this.#itemsObserver.observe(this, {
      childList: true,
      subtree: false,
    });

    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#iconSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#labelSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.removeEventListener('menuitemselect', this.#handleMenuItemSelect as EventListener);
    this.#itemsObserver?.disconnect();
    this.#itemsObserver = null;

    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'label' && !this.#isSyncingAutoLabel) {
      this.#autoLabelManaged = newValue === null;
      if (this.#autoLabelManaged) this.#syncOpenerLabel(this.#getNormalizedOpener());
      return;
    }

    if (name === 'opener' || name === 'size') {
      this.#syncAll();
    }
  }

  /**
   * 現在選択されている言語情報を取得します。
   * 言語選択イベントは `dads-change` を利用し、現在値取得はこのメソッドを利用します。
   */
  getSelectedLanguage(): DadsLanguageSelectorSelectedLanguage | null {
    const items = this.#getMenuItems();
    const selectedIndex = this.#findCurrentItemIndex(items);
    if (selectedIndex < 0) return null;

    const selectedItem = items[selectedIndex];
    return {
      value: this.#resolveSelectedValue(selectedItem, undefined),
      label: (selectedItem.textContent ?? '').trim(),
      selectedIndex,
      selectedItem,
    };
  }

  #findCurrentItemIndex(items: HTMLElement[]): number {
    return items.findIndex((item) => isCurrentItem(item));
  }

  #removeElements(elements: Element[]): void {
    for (const element of elements) element.remove();
  }

  #removeDuplicateAutoElements(autoElements: Element[]): void {
    for (let i = 1; i < autoElements.length; i += 1) {
      autoElements[i].remove();
    }
  }

  #getAutoCheckIcons(item: HTMLElement): Element[] {
    return getAutoSlottedElements(item, 'start-icon', AUTO_CHECK_ICON_ATTR);
  }

  #hasCustomStartIcon(item: HTMLElement): boolean {
    return hasCustomSlottedElement(item, 'start-icon', AUTO_CHECK_ICON_ATTR);
  }

  #hasCustomLabelSlotContent(): boolean {
    const slot = this.#labelSlot;
    if (!slot) return false;
    return slot.assignedNodes({ flatten: true }).some((node) => isNotWhitespace(node));
  }

  #syncOpenerIcon(): void {
    const autoIcons = getAutoSlottedElements(this, 'icon', AUTO_OPENER_ICON_ATTR);

    if (hasCustomSlottedElement(this, 'icon', AUTO_OPENER_ICON_ATTR)) {
      this.#removeElements(autoIcons);
      return;
    }

    if (autoIcons.length > 0) {
      this.#removeDuplicateAutoElements(autoIcons);
      return;
    }

    const icon = createSvg(openerIconPath);
    icon.setAttribute('slot', 'icon');
    icon.setAttribute(AUTO_OPENER_ICON_ATTR, '');
    this.appendChild(icon);
  }

  #syncMenuItems(): void {
    const items = this.#getMenuItems();
    this.#syncMenuItemDefaults(items);

    const selected = this.#normalizeCurrentSelection(items);
    this.#syncSelectionCheckIcons(items, selected);
  }

  #normalizeCurrentSelection(items: HTMLElement[]): HTMLElement | null {
    const selectedIndex = this.#findCurrentItemIndex(items);
    if (selectedIndex < 0) return null;

    const selected = items[selectedIndex];
    this.#applyCurrentSelection(items, selected);
    return selected;
  }

  #syncSelectionCheckIcons(items: HTMLElement[], selected: HTMLElement | null): void {
    for (const item of items) {
      const autoIcons = this.#getAutoCheckIcons(item);
      const isSelected = item === selected;

      if (!isSelected || this.#hasCustomStartIcon(item)) {
        this.#removeElements(autoIcons);
        continue;
      }

      if (autoIcons.length === 0) {
        const icon = createSvg(checkIconPath);
        icon.setAttribute('slot', 'start-icon');
        icon.setAttribute(AUTO_CHECK_ICON_ATTR, '');
        item.appendChild(icon);
        continue;
      }

      this.#removeDuplicateAutoElements(autoIcons);
    }
  }

  #getMenuItems(): HTMLElement[] {
    const children = Array.from(this.children);
    const items: HTMLElement[] = [];

    for (const child of children) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.getAttribute('slot')) continue;
      if (!child.localName.endsWith(MENU_LIST_ITEM_SUFFIX)) continue;
      items.push(child);
    }

    return items;
  }

  #handleSlotChange = (): void => {
    this.#syncAll();
  };

  #handleMenuItemSelect = (event: Event): void => {
    const detail = (event as CustomEvent<MenuItemSelectDetail>).detail;
    if (!detail) return;

    const selectedItem = detail.selectedItem;
    if (!(selectedItem instanceof HTMLElement)) return;
    if (!selectedItem.localName.endsWith(MENU_LIST_ITEM_SUFFIX)) return;

    const items = this.#getMenuItems();
    if (!items.includes(selectedItem)) return;

    this.#applyCurrentSelection(items, selectedItem);
    this.#syncSelectionCheckIcons(items, selectedItem);

    const selectedValue = this.#resolveSelectedValue(selectedItem, detail.selectedValue);
    const selectedIndex = Number.isFinite(detail.selectedIndex)
      ? Number(detail.selectedIndex)
      : items.indexOf(selectedItem);

    const changeDetail: DadsLanguageSelectorChangeDetail = {
      value: selectedValue,
      selectedValue,
      selectedIndex,
      selectedItem,
    };

    this.dispatchEvent(
      new CustomEvent<DadsLanguageSelectorChangeDetail>('dads-change', {
        bubbles: true,
        composed: true,
        detail: changeDetail,
      }),
    );
  };

  #syncAll(): void {
    if (this.#isSyncing) return;
    this.#isSyncing = true;

    try {
      const opener = this.#getNormalizedOpener();
      this.#syncOpenerLabel(opener);
      this.#syncOpenerIcon();
      this.#syncMenuItems();
    } finally {
      this.#isSyncing = false;
    }
  }

  #getNormalizedOpener(): LanguageSelectorOpener {
    const opener = this.getAttribute('opener');
    if (opener === 'icon') return 'icon';
    if (opener === 'text') return 'text';

    this.setAttribute('opener', 'text');
    return 'text';
  }

  #syncOpenerLabel(opener: LanguageSelectorOpener): void {
    if (this.#hasCustomLabelSlotContent()) return;
    if (!this.#autoLabelManaged && this.hasAttribute('label')) return;

    const nextLabel = opener === 'icon' ? 'LANG' : 'Language';
    if (this.getAttribute('label') === nextLabel && this.#autoLabelManaged) return;

    this.#isSyncingAutoLabel = true;
    this.setAttribute('label', nextLabel);
    this.#isSyncingAutoLabel = false;
    this.#autoLabelManaged = true;
  }

  #syncMenuItemDefaults(items: HTMLElement[]): void {
    const itemSize = this.getAttribute('size') === 'md' ? 'regular' : 'small';

    for (const item of items) {
      if (!item.hasAttribute('variant')) item.setAttribute('variant', 'box');
      if (!item.hasAttribute('end-icon')) item.setAttribute('end-icon', 'none');

      if (!item.hasAttribute('size')) {
        item.setAttribute('size', itemSize);
        item.setAttribute(AUTO_ITEM_SIZE_ATTR, '');
        continue;
      }

      const currentSize = item.getAttribute('size');
      const isAutoManaged = item.hasAttribute(AUTO_ITEM_SIZE_ATTR);
      const isDefaultSized = currentSize === MENU_LIST_ITEM_DEFAULT_SIZE;

      if (isAutoManaged || isDefaultSized) {
        item.setAttribute(AUTO_ITEM_SIZE_ATTR, '');
        if (currentSize !== itemSize) item.setAttribute('size', itemSize);
      }
    }
  }

  #applyCurrentSelection(items: HTMLElement[], selected: HTMLElement): void {
    for (const item of items) {
      if (item === selected) {
        if (!item.hasAttribute('current')) item.setAttribute('current', '');
        if (item.getAttribute('aria-current') !== 'true') item.setAttribute('aria-current', 'true');
        continue;
      }
      if (item.hasAttribute('current')) item.removeAttribute('current');
      if (item.hasAttribute('aria-current')) item.removeAttribute('aria-current');
    }
  }

  #resolveSelectedValue(item: HTMLElement, preferred: string | undefined): string {
    if (preferred && preferred.trim() !== '') return preferred;

    const value = item.getAttribute('value');
    if (value && value.trim() !== '') return value;

    const dataValue = item.getAttribute('data-value');
    if (dataValue && dataValue.trim() !== '') return dataValue;

    return (item.textContent ?? '').trim();
  }
}
