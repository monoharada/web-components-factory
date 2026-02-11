/**
 * @module table-control
 * DADS Table Control component.
 * @version 1.0.0
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsTableControl_instances, _DadsTableControl_header, _DadsTableControl_searchBox, _DadsTableControl_count, _DadsTableControl_reset, _DadsTableControl_popular, _DadsTableControl_popularLabel, _DadsTableControl_presetsSlot, _DadsTableControl_actions, _DadsTableControl_actionsSlot, _DadsTableControl_footer, _DadsTableControl_itemsPerPage, _DadsTableControl_pageSizeLabel, _DadsTableControl_itemsOptions, _DadsTableControl_pagination, _DadsTableControl_pageNavigationSlot, _DadsTableControl_syncAll, _DadsTableControl_resolveVariant, _DadsTableControl_resolvePaginationPosition, _DadsTableControl_syncVariant, _DadsTableControl_syncQuery, _DadsTableControl_syncResultCount, _DadsTableControl_syncReset, _DadsTableControl_syncPopular, _DadsTableControl_syncActions, _DadsTableControl_syncPageSizeLabel, _DadsTableControl_syncPaginationPosition, _DadsTableControl_syncPaginationVisibility, _DadsTableControl_renderPageSizeOptions, _DadsTableControl_parsePageSizeOptions, _DadsTableControl_hasVisibleAssignedElements, _DadsTableControl_syncSlotVisibility, _DadsTableControl_formatNumber, _DadsTableControl_currentQuery, _DadsTableControl_resolveQuery, _DadsTableControl_handleSearchInput, _DadsTableControl_handleSearchRequest, _DadsTableControl_handleResetClick, _DadsTableControl_handleItemsOptionClick, _DadsTableControl_handlePresetsSlotChange, _DadsTableControl_handleActionsSlotChange, _DadsTableControl_handlePageNavigationSlotChange;
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
    constructor() {
        super(...arguments);
        _DadsTableControl_instances.add(this);
        _DadsTableControl_header.set(this, null);
        _DadsTableControl_searchBox.set(this, null);
        _DadsTableControl_count.set(this, null);
        _DadsTableControl_reset.set(this, null);
        _DadsTableControl_popular.set(this, null);
        _DadsTableControl_popularLabel.set(this, null);
        _DadsTableControl_presetsSlot.set(this, null);
        _DadsTableControl_actions.set(this, null);
        _DadsTableControl_actionsSlot.set(this, null);
        _DadsTableControl_footer.set(this, null);
        _DadsTableControl_itemsPerPage.set(this, null);
        _DadsTableControl_pageSizeLabel.set(this, null);
        _DadsTableControl_itemsOptions.set(this, null);
        _DadsTableControl_pagination.set(this, null);
        _DadsTableControl_pageNavigationSlot.set(this, null);
        _DadsTableControl_handleSearchInput.set(this, (event) => {
            const query = __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_resolveQuery).call(this, event.detail);
            this.setAttribute('query', query);
        });
        _DadsTableControl_handleSearchRequest.set(this, (event) => {
            const query = __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_resolveQuery).call(this, event.detail);
            const scope = typeof event.detail?.scope === 'string' ? event.detail.scope : '';
            this.setAttribute('query', query);
            this.dispatchEvent(new CustomEvent('dads-table-control-search', {
                detail: { query, scope },
                bubbles: true,
                composed: true,
            }));
        });
        _DadsTableControl_handleResetClick.set(this, () => {
            this.setAttribute('query', '');
            this.dispatchEvent(new CustomEvent('dads-table-control-reset', {
                detail: { query: '' },
                bubbles: true,
                composed: true,
            }));
        });
        _DadsTableControl_handleItemsOptionClick.set(this, (event) => {
            const target = event.target;
            if (!(target instanceof Element))
                return;
            const option = target.closest('button[data-items-value]');
            if (!option)
                return;
            const value = option.getAttribute('data-items-value');
            if (!value)
                return;
            this.setAttribute('items-per-page', value);
            const parsed = Number(value);
            const itemsPerPage = Number.isFinite(parsed) ? parsed : 0;
            this.dispatchEvent(new CustomEvent('dads-table-control-page-size-change', {
                detail: {
                    value,
                    itemsPerPage,
                },
                bubbles: true,
                composed: true,
            }));
        });
        _DadsTableControl_handlePresetsSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPopular).call(this);
        });
        _DadsTableControl_handleActionsSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncActions).call(this);
        });
        _DadsTableControl_handlePageNavigationSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPaginationVisibility).call(this);
        });
    }
    connectedCallback() {
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
        __classPrivateFieldSet(this, _DadsTableControl_header, this.shadowRoot?.querySelector('#header'), "f");
        if (this.shadowRoot) {
            __classPrivateFieldSet(this, _DadsTableControl_searchBox, ensurePrefixedElement(this.shadowRoot, 'search-box', `${prefix}-search-box`), "f");
        }
        __classPrivateFieldSet(this, _DadsTableControl_count, this.shadowRoot?.querySelector('#count'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_reset, this.shadowRoot?.querySelector('#reset'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_popular, this.shadowRoot?.querySelector('#popular'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_popularLabel, this.shadowRoot?.querySelector('#popular-label'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_presetsSlot, this.shadowRoot?.querySelector('#presets-slot'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_actions, this.shadowRoot?.querySelector('#actions'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_actionsSlot, this.shadowRoot?.querySelector('#actions-slot'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_footer, this.shadowRoot?.querySelector('#footer'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_itemsPerPage, this.shadowRoot?.querySelector('#items-per-page'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_pageSizeLabel, this.shadowRoot?.querySelector('#page-size-label'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_itemsOptions, this.shadowRoot?.querySelector('#items-options'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_pagination, this.shadowRoot?.querySelector('#pagination'), "f");
        __classPrivateFieldSet(this, _DadsTableControl_pageNavigationSlot, this.shadowRoot?.querySelector('#page-navigation-slot'), "f");
        __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f")?.addEventListener('dads-input', __classPrivateFieldGet(this, _DadsTableControl_handleSearchInput, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f")?.addEventListener('dads-search', __classPrivateFieldGet(this, _DadsTableControl_handleSearchRequest, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_reset, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsTableControl_handleResetClick, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_itemsOptions, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsTableControl_handleItemsOptionClick, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_presetsSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsTableControl_handlePresetsSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_actionsSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsTableControl_handleActionsSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_pageNavigationSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsTableControl_handlePageNavigationSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f")?.removeEventListener('dads-input', __classPrivateFieldGet(this, _DadsTableControl_handleSearchInput, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f")?.removeEventListener('dads-search', __classPrivateFieldGet(this, _DadsTableControl_handleSearchRequest, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_reset, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsTableControl_handleResetClick, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_itemsOptions, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsTableControl_handleItemsOptionClick, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_presetsSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsTableControl_handlePresetsSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_actionsSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsTableControl_handleActionsSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsTableControl_pageNavigationSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsTableControl_handlePageNavigationSlotChange, "f"));
        super.disconnectedCallback();
    }
    variantChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncVariant).call(this);
    }
    queryChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncQuery).call(this);
    }
    resultCountChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncResultCount).call(this);
    }
    showResetChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncReset).call(this);
    }
    resetLabelChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncReset).call(this);
    }
    popularLabelChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPopular).call(this);
    }
    itemsPerPageChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_renderPageSizeOptions).call(this);
    }
    pageSizeOptionsChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_renderPageSizeOptions).call(this);
    }
    pageSizeLabelChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPageSizeLabel).call(this);
    }
    paginationPositionChanged() {
        __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPaginationPosition).call(this);
    }
}
_DadsTableControl_header = new WeakMap(), _DadsTableControl_searchBox = new WeakMap(), _DadsTableControl_count = new WeakMap(), _DadsTableControl_reset = new WeakMap(), _DadsTableControl_popular = new WeakMap(), _DadsTableControl_popularLabel = new WeakMap(), _DadsTableControl_presetsSlot = new WeakMap(), _DadsTableControl_actions = new WeakMap(), _DadsTableControl_actionsSlot = new WeakMap(), _DadsTableControl_footer = new WeakMap(), _DadsTableControl_itemsPerPage = new WeakMap(), _DadsTableControl_pageSizeLabel = new WeakMap(), _DadsTableControl_itemsOptions = new WeakMap(), _DadsTableControl_pagination = new WeakMap(), _DadsTableControl_pageNavigationSlot = new WeakMap(), _DadsTableControl_handleSearchInput = new WeakMap(), _DadsTableControl_handleSearchRequest = new WeakMap(), _DadsTableControl_handleResetClick = new WeakMap(), _DadsTableControl_handleItemsOptionClick = new WeakMap(), _DadsTableControl_handlePresetsSlotChange = new WeakMap(), _DadsTableControl_handleActionsSlotChange = new WeakMap(), _DadsTableControl_handlePageNavigationSlotChange = new WeakMap(), _DadsTableControl_instances = new WeakSet(), _DadsTableControl_syncAll = function _DadsTableControl_syncAll() {
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncVariant).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncQuery).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncResultCount).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncReset).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPopular).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncActions).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPageSizeLabel).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_renderPageSizeOptions).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPaginationPosition).call(this);
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncPaginationVisibility).call(this);
}, _DadsTableControl_resolveVariant = function _DadsTableControl_resolveVariant() {
    const raw = this.getAttribute('variant');
    if (raw === 'footer')
        return 'footer';
    if (raw === 'header')
        return 'header';
    if (raw !== null)
        this.setAttribute('variant', 'header');
    return 'header';
}, _DadsTableControl_resolvePaginationPosition = function _DadsTableControl_resolvePaginationPosition() {
    const raw = this.getAttribute('pagination-position');
    if (raw === 'end')
        return 'end';
    if (raw === 'start')
        return 'start';
    if (raw !== null)
        this.setAttribute('pagination-position', 'start');
    return 'start';
}, _DadsTableControl_syncVariant = function _DadsTableControl_syncVariant() {
    const variant = __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_resolveVariant).call(this);
    if (__classPrivateFieldGet(this, _DadsTableControl_header, "f"))
        __classPrivateFieldGet(this, _DadsTableControl_header, "f").hidden = variant !== 'header';
    if (__classPrivateFieldGet(this, _DadsTableControl_footer, "f"))
        __classPrivateFieldGet(this, _DadsTableControl_footer, "f").hidden = variant !== 'footer';
}, _DadsTableControl_syncQuery = function _DadsTableControl_syncQuery() {
    const query = this.getAttribute('query') ?? '';
    if (!__classPrivateFieldGet(this, _DadsTableControl_searchBox, "f"))
        return;
    if (typeof __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f").value === 'string') {
        __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f").value = query;
    }
    else if (__classPrivateFieldGet(this, _DadsTableControl_searchBox, "f").getAttribute('value') !== query) {
        __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f").setAttribute('value', query);
    }
}, _DadsTableControl_syncResultCount = function _DadsTableControl_syncResultCount() {
    if (!__classPrivateFieldGet(this, _DadsTableControl_count, "f"))
        return;
    const raw = (this.getAttribute('result-count') ?? '').trim();
    if (raw === '') {
        __classPrivateFieldGet(this, _DadsTableControl_count, "f").hidden = true;
        __classPrivateFieldGet(this, _DadsTableControl_count, "f").textContent = '';
        return;
    }
    const text = raw.includes('件') ? raw : `${__classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_formatNumber).call(this, raw)} 件`;
    __classPrivateFieldGet(this, _DadsTableControl_count, "f").hidden = false;
    __classPrivateFieldGet(this, _DadsTableControl_count, "f").textContent = text;
}, _DadsTableControl_syncReset = function _DadsTableControl_syncReset() {
    if (!__classPrivateFieldGet(this, _DadsTableControl_reset, "f"))
        return;
    __classPrivateFieldGet(this, _DadsTableControl_reset, "f").hidden = !this.hasAttribute('show-reset');
    __classPrivateFieldGet(this, _DadsTableControl_reset, "f").textContent = this.getAttribute('reset-label') ?? 'リセット';
}, _DadsTableControl_syncPopular = function _DadsTableControl_syncPopular() {
    if (!__classPrivateFieldGet(this, _DadsTableControl_popular, "f") || !__classPrivateFieldGet(this, _DadsTableControl_popularLabel, "f"))
        return;
    const label = (this.getAttribute('popular-label') ?? '').trim();
    __classPrivateFieldGet(this, _DadsTableControl_popularLabel, "f").textContent = label;
    __classPrivateFieldGet(this, _DadsTableControl_popularLabel, "f").hidden = label === '';
    const hasVisiblePresets = __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_hasVisibleAssignedElements).call(this, __classPrivateFieldGet(this, _DadsTableControl_presetsSlot, "f"));
    __classPrivateFieldGet(this, _DadsTableControl_popular, "f").hidden = !hasVisiblePresets;
}, _DadsTableControl_syncActions = function _DadsTableControl_syncActions() {
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncSlotVisibility).call(this, __classPrivateFieldGet(this, _DadsTableControl_actions, "f"), __classPrivateFieldGet(this, _DadsTableControl_actionsSlot, "f"));
}, _DadsTableControl_syncPageSizeLabel = function _DadsTableControl_syncPageSizeLabel() {
    if (!__classPrivateFieldGet(this, _DadsTableControl_pageSizeLabel, "f"))
        return;
    __classPrivateFieldGet(this, _DadsTableControl_pageSizeLabel, "f").textContent = this.getAttribute('page-size-label') ?? '表示件数';
}, _DadsTableControl_syncPaginationPosition = function _DadsTableControl_syncPaginationPosition() {
    if (!__classPrivateFieldGet(this, _DadsTableControl_footer, "f"))
        return;
    __classPrivateFieldGet(this, _DadsTableControl_footer, "f").setAttribute('data-pagination-position', __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_resolvePaginationPosition).call(this));
}, _DadsTableControl_syncPaginationVisibility = function _DadsTableControl_syncPaginationVisibility() {
    __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_syncSlotVisibility).call(this, __classPrivateFieldGet(this, _DadsTableControl_pagination, "f"), __classPrivateFieldGet(this, _DadsTableControl_pageNavigationSlot, "f"));
}, _DadsTableControl_renderPageSizeOptions = function _DadsTableControl_renderPageSizeOptions() {
    if (!__classPrivateFieldGet(this, _DadsTableControl_itemsOptions, "f") || !__classPrivateFieldGet(this, _DadsTableControl_itemsPerPage, "f"))
        return;
    const options = __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_parsePageSizeOptions).call(this);
    const current = this.getAttribute('items-per-page') ?? '';
    __classPrivateFieldGet(this, _DadsTableControl_itemsOptions, "f").replaceChildren();
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
    __classPrivateFieldGet(this, _DadsTableControl_itemsOptions, "f").appendChild(fragment);
    __classPrivateFieldGet(this, _DadsTableControl_itemsPerPage, "f").hidden = options.length === 0;
}, _DadsTableControl_parsePageSizeOptions = function _DadsTableControl_parsePageSizeOptions() {
    const raw = this.getAttribute('page-size-options') ?? '';
    const out = [];
    const seen = new Set();
    for (const token of raw.split(',')) {
        const value = token.trim();
        if (value === '')
            continue;
        if (seen.has(value))
            continue;
        seen.add(value);
        out.push(value);
    }
    return out;
}, _DadsTableControl_hasVisibleAssignedElements = function _DadsTableControl_hasVisibleAssignedElements(slot) {
    if (!slot)
        return false;
    const assigned = slot.assignedElements({ flatten: true });
    for (const node of assigned) {
        if (!(node instanceof HTMLElement))
            continue;
        if (node.hidden)
            continue;
        if (node.style.display === 'none')
            continue;
        return true;
    }
    return false;
}, _DadsTableControl_syncSlotVisibility = function _DadsTableControl_syncSlotVisibility(container, slot) {
    if (!container)
        return;
    container.hidden = !__classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_hasVisibleAssignedElements).call(this, slot);
}, _DadsTableControl_formatNumber = function _DadsTableControl_formatNumber(raw) {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric))
        return raw;
    return new Intl.NumberFormat('ja-JP').format(numeric);
}, _DadsTableControl_currentQuery = function _DadsTableControl_currentQuery() {
    const valueFromSearchBox = __classPrivateFieldGet(this, _DadsTableControl_searchBox, "f")?.value;
    if (typeof valueFromSearchBox === 'string')
        return valueFromSearchBox;
    return this.getAttribute('query') ?? '';
}, _DadsTableControl_resolveQuery = function _DadsTableControl_resolveQuery(detail) {
    return typeof detail?.query === 'string' ? detail.query : __classPrivateFieldGet(this, _DadsTableControl_instances, "m", _DadsTableControl_currentQuery).call(this);
};
DadsTableControl.version = '1.0.0';
DadsTableControl.definition = {
    name: 'dads-table-control',
    template: html `
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
