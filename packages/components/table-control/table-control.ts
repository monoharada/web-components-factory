/**
 * @module table-control
 * DADS Table Control component.
 * @version 1.0.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { ensurePrefixedElement, getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { defineButton } from '../button/button-define.js';
import { defineChipTag } from '../chip-tag/chip-tag-define.js';
import { definePageNavigation } from '../page-navigation/page-navigation-define.js';
import { defineSearchBox } from '../search-box/search-box-define.js';
import { tableControlStyles } from './table-control-styles.js';
import { tableControlTokens } from './table-control-tokens.js';

export type DadsTableControlVariant = 'header' | 'footer';
export type DadsTableControlPaginationPosition = 'start' | 'end';

export type DadsTableControlSearchDetail = Readonly<{
  query: string;
  scope: string;
}>;

export type DadsTableControlResetDetail = Readonly<{
  query: string;
}>;

export type DadsTableControlPageSizeChangeDetail = Readonly<{
  value: string;
  itemsPerPage: number;
}>;

type SearchBoxEventDetail = Readonly<{
  query?: string;
  scope?: string;
}>;

type SearchBoxElement = HTMLElement & {
  value?: string;
};

/**
 * Table Control component.
 *
 * @customElement
 * @tagname dads-table-control
 *
 * @slot actions - Header action area (e.g. print / csv / create buttons)
 * @slot presets - Header popular-search presets (e.g. chip tags)
 * @slot page-navigation - Footer page navigation area (e.g. dads-page-navigation)
 *
 * @csspart base - Root wrapper
 * @csspart header - Header control row
 * @csspart search - Search control block
 * @csspart count - Result count label
 * @csspart reset - Reset trigger button
 * @csspart actions - Header actions area
 * @csspart popular - Popular-search area
 * @csspart footer - Footer control row
 * @csspart items-per-page - Items-per-page block
 * @csspart items-option - Items-per-page option button
 * @csspart pagination - Pagination area
 *
 * @attr {'header' | 'footer'} variant - Render variant
 * @attr {string} query - Search query for header
 * @attr {string} result-count - Result count for header
 * @attr {boolean} show-reset - Shows reset button in header
 * @attr {string} reset-label - Reset button label
 * @attr {string} popular-label - Popular search area label
 * @attr {string} items-per-page - Current page size for footer
 * @attr {string} page-size-options - Comma separated page size options
 * @attr {string} page-size-label - Page size label
 * @attr {'start' | 'end'} pagination-position - Footer pagination alignment
 *
 * @cssprop --dads-table-control-gap - Primary spacing between blocks
 * @cssprop --dads-table-control-count-color - Result count text color
 * @cssprop --dads-table-control-divider-color - Divider color for action group
 * @cssprop --dads-table-control-items-gap - Gap between page size options
 * @cssprop --dads-table-control-popular-gap - Gap between search and popular areas
 *
 * @fires dads-table-control-search - Fired when search is requested
 * @fires dads-table-control-reset - Fired when reset is requested
 * @fires dads-table-control-page-size-change - Fired when page size option changes
 */
export class DadsTableControl extends TypographyWebComponent {
  static readonly version = '1.0.0';

  static definition = {
    name: 'dads-table-control',
    template: html`
      <div part="base" id="base">
        <div part="header" id="header">
          <div id="header-leading">
            <div part="search" id="search">
              <dads-search-box id="search-box" aria-label="検索"></dads-search-box>
              <span part="count" id="count" aria-live="polite"></span>
              <button part="reset" id="reset" type="button"></button>
            </div>

            <div part="popular" id="popular">
              <span id="popular-label"></span>
              <slot name="presets" id="presets-slot"></slot>
            </div>
          </div>

          <div part="actions" id="actions">
            <slot name="actions" id="actions-slot"></slot>
          </div>
        </div>

        <div part="footer" id="footer">
          <div part="items-per-page" id="items-per-page">
            <span id="page-size-label"></span>
            <div id="items-options"></div>
          </div>

          <div part="pagination" id="pagination">
            <slot name="page-navigation" id="page-navigation-slot"></slot>
          </div>
        </div>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      tableControlTokens,
      tableControlStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('query'),
      PropertyAttr('resultCount', 'result-count'),
      BooleanAttr('showReset', 'show-reset'),
      PropertyAttr('resetLabel', 'reset-label'),
      PropertyAttr('popularLabel', 'popular-label'),
      PropertyAttr('itemsPerPage', 'items-per-page'),
      PropertyAttr('pageSizeOptions', 'page-size-options'),
      PropertyAttr('pageSizeLabel', 'page-size-label'),
      PropertyAttr('paginationPosition', 'pagination-position'),
    ],
  };

  #header: HTMLElement | null = null;
  #searchBox: SearchBoxElement | null = null;
  #count: HTMLElement | null = null;
  #reset: HTMLButtonElement | null = null;
  #popular: HTMLElement | null = null;
  #popularLabel: HTMLElement | null = null;
  #presetsSlot: HTMLSlotElement | null = null;
  #actions: HTMLElement | null = null;
  #actionsSlot: HTMLSlotElement | null = null;
  #footer: HTMLElement | null = null;
  #itemsPerPage: HTMLElement | null = null;
  #pageSizeLabel: HTMLElement | null = null;
  #itemsOptions: HTMLElement | null = null;
  #pagination: HTMLElement | null = null;
  #pageNavigationSlot: HTMLSlotElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    const prefix = getPrefixFromLocalName(this.localName, '-table-control');

    // dependencies
    defineSearchBox(prefix);
    defineChipTag(prefix);
    definePageNavigation(prefix);
    defineButton(prefix);

    setDefaultAttributes(this, {
      variant: 'header',
      'result-count': '0',
      'reset-label': 'リセット',
      'items-per-page': '10',
      'page-size-options': '10,50,100',
      'page-size-label': '表示件数',
      'pagination-position': 'start',
    });

    this.#header = this.shadowRoot?.querySelector('#header') as HTMLElement | null;
    if (this.shadowRoot) {
      this.#searchBox = ensurePrefixedElement<SearchBoxElement>(
        this.shadowRoot,
        'search-box',
        `${prefix}-search-box`,
      );
    }
    this.#count = this.shadowRoot?.querySelector('#count') as HTMLElement | null;
    this.#reset = this.shadowRoot?.querySelector('#reset') as HTMLButtonElement | null;
    this.#popular = this.shadowRoot?.querySelector('#popular') as HTMLElement | null;
    this.#popularLabel = this.shadowRoot?.querySelector('#popular-label') as HTMLElement | null;
    this.#presetsSlot = this.shadowRoot?.querySelector('#presets-slot') as HTMLSlotElement | null;
    this.#actions = this.shadowRoot?.querySelector('#actions') as HTMLElement | null;
    this.#actionsSlot = this.shadowRoot?.querySelector('#actions-slot') as HTMLSlotElement | null;
    this.#footer = this.shadowRoot?.querySelector('#footer') as HTMLElement | null;
    this.#itemsPerPage = this.shadowRoot?.querySelector('#items-per-page') as HTMLElement | null;
    this.#pageSizeLabel = this.shadowRoot?.querySelector('#page-size-label') as HTMLElement | null;
    this.#itemsOptions = this.shadowRoot?.querySelector('#items-options') as HTMLElement | null;
    this.#pagination = this.shadowRoot?.querySelector('#pagination') as HTMLElement | null;
    this.#pageNavigationSlot = this.shadowRoot?.querySelector('#page-navigation-slot') as HTMLSlotElement | null;

    this.#searchBox?.addEventListener('dads-input', this.#handleSearchInput as EventListener);
    this.#searchBox?.addEventListener('dads-search', this.#handleSearchRequest as EventListener);
    this.#reset?.addEventListener('click', this.#handleResetClick);
    this.#itemsOptions?.addEventListener('click', this.#handleItemsOptionClick);

    this.#presetsSlot?.addEventListener('slotchange', this.#handlePresetsSlotChange);
    this.#actionsSlot?.addEventListener('slotchange', this.#handleActionsSlotChange);
    this.#pageNavigationSlot?.addEventListener('slotchange', this.#handlePageNavigationSlotChange);

    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.#searchBox?.removeEventListener('dads-input', this.#handleSearchInput as EventListener);
    this.#searchBox?.removeEventListener('dads-search', this.#handleSearchRequest as EventListener);
    this.#reset?.removeEventListener('click', this.#handleResetClick);
    this.#itemsOptions?.removeEventListener('click', this.#handleItemsOptionClick);

    this.#presetsSlot?.removeEventListener('slotchange', this.#handlePresetsSlotChange);
    this.#actionsSlot?.removeEventListener('slotchange', this.#handleActionsSlotChange);
    this.#pageNavigationSlot?.removeEventListener('slotchange', this.#handlePageNavigationSlotChange);

    super.disconnectedCallback();
  }

  variantChanged(): void {
    this.#syncVariant();
  }

  queryChanged(): void {
    this.#syncQuery();
  }

  resultCountChanged(): void {
    this.#syncResultCount();
  }

  showResetChanged(): void {
    this.#syncReset();
  }

  resetLabelChanged(): void {
    this.#syncReset();
  }

  popularLabelChanged(): void {
    this.#syncPopular();
  }

  itemsPerPageChanged(): void {
    this.#renderPageSizeOptions();
  }

  pageSizeOptionsChanged(): void {
    this.#renderPageSizeOptions();
  }

  pageSizeLabelChanged(): void {
    this.#syncPageSizeLabel();
  }

  paginationPositionChanged(): void {
    this.#syncPaginationPosition();
  }

  #syncAll(): void {
    this.#syncVariant();
    this.#syncQuery();
    this.#syncResultCount();
    this.#syncReset();
    this.#syncPopular();
    this.#syncActions();
    this.#syncPageSizeLabel();
    this.#renderPageSizeOptions();
    this.#syncPaginationPosition();
    this.#syncPaginationVisibility();
  }

  #resolveVariant(): DadsTableControlVariant {
    const raw = this.getAttribute('variant');
    if (raw === 'footer') return 'footer';
    if (raw === 'header') return 'header';
    if (raw !== null) this.setAttribute('variant', 'header');
    return 'header';
  }

  #resolvePaginationPosition(): DadsTableControlPaginationPosition {
    const raw = this.getAttribute('pagination-position');
    if (raw === 'end') return 'end';
    if (raw === 'start') return 'start';
    if (raw !== null) this.setAttribute('pagination-position', 'start');
    return 'start';
  }

  #syncVariant(): void {
    const variant = this.#resolveVariant();
    if (this.#header) this.#header.hidden = variant !== 'header';
    if (this.#footer) this.#footer.hidden = variant !== 'footer';
  }

  #syncQuery(): void {
    const query = this.getAttribute('query') ?? '';
    if (!this.#searchBox) return;

    if (typeof this.#searchBox.value === 'string') {
      this.#searchBox.value = query;
    } else if (this.#searchBox.getAttribute('value') !== query) {
      this.#searchBox.setAttribute('value', query);
    }
  }

  #syncResultCount(): void {
    if (!this.#count) return;

    const raw = (this.getAttribute('result-count') ?? '').trim();
    if (raw === '') {
      this.#count.hidden = true;
      this.#count.textContent = '';
      return;
    }

    const text = raw.includes('件') ? raw : `${this.#formatNumber(raw)} 件`;
    this.#count.hidden = false;
    this.#count.textContent = text;
  }

  #syncReset(): void {
    if (!this.#reset) return;
    this.#reset.hidden = !this.hasAttribute('show-reset');
    this.#reset.textContent = this.getAttribute('reset-label') ?? 'リセット';
  }

  #syncPopular(): void {
    if (!this.#popular || !this.#popularLabel) return;

    const label = (this.getAttribute('popular-label') ?? '').trim();
    this.#popularLabel.textContent = label;
    this.#popularLabel.hidden = label === '';

    const hasVisiblePresets = this.#hasVisibleAssignedElements(this.#presetsSlot);
    this.#popular.hidden = !hasVisiblePresets;
  }

  #syncActions(): void {
    this.#syncSlotVisibility(this.#actions, this.#actionsSlot);
  }

  #syncPageSizeLabel(): void {
    if (!this.#pageSizeLabel) return;
    this.#pageSizeLabel.textContent = this.getAttribute('page-size-label') ?? '表示件数';
  }

  #syncPaginationPosition(): void {
    if (!this.#footer) return;
    this.#footer.setAttribute('data-pagination-position', this.#resolvePaginationPosition());
  }

  #syncPaginationVisibility(): void {
    this.#syncSlotVisibility(this.#pagination, this.#pageNavigationSlot);
  }

  #renderPageSizeOptions(): void {
    if (!this.#itemsOptions || !this.#itemsPerPage) return;

    const options = this.#parsePageSizeOptions();
    const current = this.getAttribute('items-per-page') ?? '';

    this.#itemsOptions.replaceChildren();
    const fragment = document.createDocumentFragment();

    for (const value of options) {
      const option = document.createElement('button');
      option.type = 'button';
      option.setAttribute('part', 'items-option');
      option.setAttribute('data-items-value', value);
      option.textContent = `${value}件`;
      option.setAttribute('aria-label', `表示件数 ${value}件`);

      if (value === current) {
        option.setAttribute('data-active', '');
        option.setAttribute('aria-current', 'true');
      }

      fragment.appendChild(option);
    }

    this.#itemsOptions.appendChild(fragment);
    this.#itemsPerPage.hidden = options.length === 0;
  }

  #parsePageSizeOptions(): string[] {
    const raw = this.getAttribute('page-size-options') ?? '';
    const out: string[] = [];
    const seen = new Set<string>();

    for (const token of raw.split(',')) {
      const value = token.trim();
      if (value === '') continue;
      if (seen.has(value)) continue;
      seen.add(value);
      out.push(value);
    }

    return out;
  }

  #hasVisibleAssignedElements(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    const assigned = slot.assignedElements({ flatten: true });
    for (const node of assigned) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.hidden) continue;
      if (node.style.display === 'none') continue;
      return true;
    }
    return false;
  }

  #syncSlotVisibility(container: HTMLElement | null, slot: HTMLSlotElement | null): void {
    if (!container) return;
    container.hidden = !this.#hasVisibleAssignedElements(slot);
  }

  #formatNumber(raw: string): string {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) return raw;
    return new Intl.NumberFormat('ja-JP').format(numeric);
  }

  #currentQuery(): string {
    const valueFromSearchBox = this.#searchBox?.value;
    if (typeof valueFromSearchBox === 'string') return valueFromSearchBox;
    return this.getAttribute('query') ?? '';
  }

  #resolveQuery(detail: SearchBoxEventDetail | undefined): string {
    return typeof detail?.query === 'string' ? detail.query : this.#currentQuery();
  }

  #handleSearchInput = (event: CustomEvent<SearchBoxEventDetail>): void => {
    const query = this.#resolveQuery(event.detail);
    this.setAttribute('query', query);
  };

  #handleSearchRequest = (event: CustomEvent<SearchBoxEventDetail>): void => {
    const query = this.#resolveQuery(event.detail);
    const scope = typeof event.detail?.scope === 'string' ? event.detail.scope : '';

    this.setAttribute('query', query);

    this.dispatchEvent(
      new CustomEvent<DadsTableControlSearchDetail>('dads-table-control-search', {
        detail: { query, scope },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #handleResetClick = (): void => {
    this.setAttribute('query', '');

    this.dispatchEvent(
      new CustomEvent<DadsTableControlResetDetail>('dads-table-control-reset', {
        detail: { query: '' },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #handleItemsOptionClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const option = target.closest<HTMLButtonElement>('button[data-items-value]');
    if (!option) return;

    const value = option.getAttribute('data-items-value');
    if (!value) return;

    this.setAttribute('items-per-page', value);

    const parsed = Number(value);
    const itemsPerPage = Number.isFinite(parsed) ? parsed : 0;

    this.dispatchEvent(
      new CustomEvent<DadsTableControlPageSizeChangeDetail>('dads-table-control-page-size-change', {
        detail: {
          value,
          itemsPerPage,
        },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #handlePresetsSlotChange = (): void => {
    this.#syncPopular();
  };

  #handleActionsSlotChange = (): void => {
    this.#syncActions();
  };

  #handlePageNavigationSlotChange = (): void => {
    this.#syncPaginationVisibility();
  };
}
