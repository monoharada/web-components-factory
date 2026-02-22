/**
 * @module combobox
 * デジタル庁デザインシステム Comboboxコンポーネント
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DadsCombobox_instances, _DadsCombobox_input, _DadsCombobox_searchInput, _DadsCombobox_control, _DadsCombobox_indicator, _DadsCombobox_panel, _DadsCombobox_searchBox, _DadsCombobox_listbox, _DadsCombobox_chipList, _DadsCombobox_labelSlot, _DadsCombobox_supportSlot, _DadsCombobox_errorSlot, _DadsCombobox_labelFallback, _DadsCombobox_supportText, _DadsCombobox_supportFallback, _DadsCombobox_errorText, _DadsCombobox_errorFallback, _DadsCombobox_requirement, _DadsCombobox_listboxId, _DadsCombobox_isOpen, _DadsCombobox_query, _DadsCombobox_activeIndex, _DadsCombobox_isSearchInputComposing, _DadsCombobox_isInputComposing, _DadsCombobox_isPointerDownOnPanel, _DadsCombobox_options, _DadsCombobox_groups, _DadsCombobox_selectedSingle, _DadsCombobox_selectedMultiple, _DadsCombobox_defaultValue, _DadsCombobox_formDisabled, _DadsCombobox_optionsObserver, _DadsCombobox_documentAbort, _DadsCombobox_ensureDefaultBooleans, _DadsCombobox_upgradePreDefinedValueProperty, _DadsCombobox_isMultiple_get, _DadsCombobox_behavior_get, _DadsCombobox_isFilterable_get, _DadsCombobox_noMatchBehavior_get, _DadsCombobox_setupSlots, _DadsCombobox_setupControlListeners, _DadsCombobox_hasVisibleSearchInput, _DadsCombobox_setupOptionsObserver, _DadsCombobox_shouldSyncOptionsFromMutation, _DadsCombobox_syncAllState, _DadsCombobox_syncFromLightDomOptions, _DadsCombobox_parseSearchAliases, _DadsCombobox_parseOptionElement, _DadsCombobox_buildSearchIndex, _DadsCombobox_normalizeSearchText, _DadsCombobox_parseCommaSeparatedValues, _DadsCombobox_applyValueAttribute, _DadsCombobox_syncSelectionForModeChange, _DadsCombobox_isKnownOptionValue, _DadsCombobox_filterKnownValues, _DadsCombobox_syncInputAttributes, _DadsCombobox_resolveControlPlaceholder, _DadsCombobox_syncInputAria, _DadsCombobox_syncFormValue, _DadsCombobox_isDisabled, _DadsCombobox_updateAriaDescribedBy, _DadsCombobox_toggleOpenFromControl, _DadsCombobox_handleControlClick, _DadsCombobox_handleChipRemove, _DadsCombobox_resolveChipRemoveValue, _DadsCombobox_handleInput, _DadsCombobox_handleSearchInput, _DadsCombobox_handleSearchCompositionStart, _DadsCombobox_handleSearchCompositionEnd, _DadsCombobox_handleInputCompositionStart, _DadsCombobox_handleInputCompositionEnd, _DadsCombobox_handlePanelPointerDown, _DadsCombobox_handlePanelPointerUp, _DadsCombobox_handleInputBlur, _DadsCombobox_isInsideComponent, _DadsCombobox_handleBlurCommit, _DadsCombobox_commitFreeText, _DadsCombobox_resolveQueryFromRawInput, _DadsCombobox_handleInputKeydown, _DadsCombobox_commitIndex, _DadsCombobox_syncOpenState, _DadsCombobox_syncDocumentListeners, _DadsCombobox_handleDocumentClick, _DadsCombobox_handleDocumentKeydown, _DadsCombobox_handleDocumentFocusIn, _DadsCombobox_renderChipList, _DadsCombobox_setChipListVisible, _DadsCombobox_createChipItem, _DadsCombobox_renderOptions, _DadsCombobox_syncPanelVisibility, _DadsCombobox_renderOptionRowsIntoListbox, _DadsCombobox_clearRenderedOptionRows, _DadsCombobox_createGroupHeader, _DadsCombobox_createOptionElement, _DadsCombobox_isIconName, _DadsCombobox_isSafeIconUrl, _DadsCombobox_syncListboxFloatingPosition, _DadsCombobox_isOptionSelected, _DadsCombobox_getFilteredIndexes, _DadsCombobox_allOptionIndexes, _DadsCombobox_findFirstFilteredEnabledIndex, _DadsCombobox_findLastFilteredEnabledIndex, _DadsCombobox_preferredActiveIndex, _DadsCombobox_moveActive, _DadsCombobox_setActiveIndex, _DadsCombobox_focusTabTargetOption, _DadsCombobox_getTabNavigableOptions, _DadsCombobox_getChipActionButtons, _DadsCombobox_restoreSearchInputFocus, _DadsCombobox_handleOptionKeydown, _DadsCombobox_handleOptionTab, _DadsCombobox_handleHostKeydown, _DadsCombobox_isEscapeKey, _DadsCombobox_isImeComposing, _DadsCombobox_syncSelectionView, _DadsCombobox_syncValueAndSelectionView, _DadsCombobox_syncInputDisplay, _DadsCombobox_labelFromValue, _DadsCombobox_focusControl, _DadsCombobox_renderOptionLabel;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { comboboxTokens } from './combobox-tokens.js';
import { comboboxStyles } from './combobox-styles.js';
import { setDefaultAttributes, updateLabelFallback, updateSupportFallback, updateErrorFallback, updateRequirement, updateAriaDescribedBy, setupSlotChangeListeners, } from '../../utils/form-component-helpers.js';
import { iconPaths } from '../../utils/icons.js';
import { getPrefix } from '../../config.js';
let comboboxIdSequence = 0;
/**
 * Comboboxコンポーネント
 *
 * @customElement
 * @tagname dads-combobox
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト
 * @slot error-text - エラーテキスト
 * @slot required-error - 必須バリデーション用のカスタムメッセージ
 * @slot - option 要素（optionの `data-search` にJSON配列文字列を指定すると検索別名を追加可能）
 *
 * @csspart wrapper - 全体ラッパー
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキスト
 * @csspart requirement - 必須表示
 * @csspart support-text - サポートテキスト
 * @csspart control - 入力コントロール
 * @csspart input - 入力欄
 * @csspart chip-list - 複数選択チップ群
 * @csspart chip - 複数選択チップ
 * @csspart indicator - ドロップダウンインジケータ
 * @csspart panel - フローティングパネル
 * @csspart listbox - 候補リスト
 * @csspart search-box - パネル内検索ラッパー
 * @csspart search-icon - パネル内検索アイコン
 * @csspart search-input - パネル内検索入力
 * @csspart option - 候補行
 * @csspart option-check - 候補行チェック領域（multiple）
 * @csspart option-label - 候補ラベル
 * @csspart option-match - 候補ラベル内のquery一致強調
 * @csspart option-meta - 候補補助テキスト
 * @csspart option-icon - 候補行のアイコン画像
 * @csspart option-avatar - 候補行のアバター画像
 * @csspart option-group-label - グループ見出し
 * @csspart error-text - エラーテキスト
 *
 * @attr {boolean} multiple - 複数選択モード
 * @attr {boolean} filterable - 入力絞り込みの有効化
 * @attr {boolean} clear-on-close - close時にqueryをクリア（常に実行）
 * @attr {boolean} restore-on-cancel - singleで未確定離脱時の復帰
 * @attr {boolean} open - 開閉状態
 * @attr {boolean} disabled - 無効状態
 * @attr {boolean} required - 必須状態
 * @attr {string} name - フォーム名
 * @attr {string} value - 選択値（multiple時はカンマ区切り）
 * @attr {string} placeholder - プレースホルダー
 * @attr {'s' | 'm' | 'l' | 'sm' | 'md' | 'lg'} size - サイズ
 * @attr {'selection' | 'input'} behavior - 操作モード（default: selection）
 * @attr {'notice' | 'create'} no-match-behavior - 候補なし時挙動（default: notice）
 * @attr {string} label - ラベル属性フォールバック
 * @attr {string} support-text - サポート属性フォールバック
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラー属性フォールバック
 *
 * @fires dads-input - query入力変化時
 * @fires dads-change - 明示確定時のみ
 * @fires dads-open - ポップアップ開時
 * @fires dads-close - ポップアップ閉時
 */
export class DadsCombobox extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsCombobox_instances.add(this);
        _DadsCombobox_input.set(this, null);
        _DadsCombobox_searchInput.set(this, null);
        _DadsCombobox_control.set(this, null);
        _DadsCombobox_indicator.set(this, null);
        _DadsCombobox_panel.set(this, null);
        _DadsCombobox_searchBox.set(this, null);
        _DadsCombobox_listbox.set(this, null);
        _DadsCombobox_chipList.set(this, null);
        _DadsCombobox_labelSlot.set(this, null);
        _DadsCombobox_supportSlot.set(this, null);
        _DadsCombobox_errorSlot.set(this, null);
        _DadsCombobox_labelFallback.set(this, null);
        _DadsCombobox_supportText.set(this, null);
        _DadsCombobox_supportFallback.set(this, null);
        _DadsCombobox_errorText.set(this, null);
        _DadsCombobox_errorFallback.set(this, null);
        _DadsCombobox_requirement.set(this, null);
        _DadsCombobox_listboxId.set(this, `combobox-listbox-${comboboxIdSequence++}`);
        _DadsCombobox_isOpen.set(this, false);
        _DadsCombobox_query.set(this, '');
        _DadsCombobox_activeIndex.set(this, -1);
        _DadsCombobox_isSearchInputComposing.set(this, false);
        _DadsCombobox_isInputComposing.set(this, false);
        _DadsCombobox_isPointerDownOnPanel.set(this, false);
        _DadsCombobox_options.set(this, []);
        _DadsCombobox_groups.set(this, []);
        _DadsCombobox_selectedSingle.set(this, '');
        _DadsCombobox_selectedMultiple.set(this, new Set());
        _DadsCombobox_defaultValue.set(this, null);
        _DadsCombobox_formDisabled.set(this, false);
        _DadsCombobox_optionsObserver.set(this, null);
        _DadsCombobox_documentAbort.set(this, null);
        _DadsCombobox_handleControlClick.set(this, (event) => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            const path = event.composedPath();
            const clickedIndicator = __classPrivateFieldGet(this, _DadsCombobox_indicator, "f") ? path.includes(__classPrivateFieldGet(this, _DadsCombobox_indicator, "f")) : false;
            if (clickedIndicator)
                event.preventDefault();
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_toggleOpenFromControl).call(this);
        });
        _DadsCombobox_handleChipRemove.set(this, (event) => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            const value = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_resolveChipRemoveValue).call(this, event);
            if (!value)
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
                if (!__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").has(value))
                    return;
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").delete(value);
                this.setAttribute('value', Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncValueAndSelectionView).call(this);
                if (__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").size === 0)
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusControl).call(this);
                this.emitEvent('dads-change', { value: Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")) });
                return;
            }
            if (__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f") !== value)
                return;
            event.preventDefault();
            __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, '', "f");
            this.removeAttribute('value');
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncValueAndSelectionView).call(this);
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusControl).call(this);
            this.emitEvent('dads-change', { value: '' });
        });
        _DadsCombobox_handleInput.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isFilterable_get))
                return;
            if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
                return;
            const isInputBehavior = __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input';
            // selection型 + multipleは入力無効（従来動作）
            if (!isInputBehavior && __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get))
                return;
            __classPrivateFieldSet(this, _DadsCombobox_query, isInputBehavior ? __classPrivateFieldGet(this, _DadsCombobox_input, "f").value : __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_resolveQueryFromRawInput).call(this, __classPrivateFieldGet(this, _DadsCombobox_input, "f").value), "f");
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                this.setAttribute('open', '');
            __classPrivateFieldSet(this, _DadsCombobox_activeIndex, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this), "f");
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
            this.emitEvent('dads-input', { query: __classPrivateFieldGet(this, _DadsCombobox_query, "f") });
        });
        _DadsCombobox_handleSearchInput.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isFilterable_get))
                return;
            if (!__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f"))
                return;
            __classPrivateFieldSet(this, _DadsCombobox_query, __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").value, "f");
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                this.setAttribute('open', '');
            __classPrivateFieldSet(this, _DadsCombobox_activeIndex, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this), "f");
            if (__classPrivateFieldGet(this, _DadsCombobox_isSearchInputComposing, "f")) {
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptionRowsIntoListbox).call(this);
                this.emitEvent('dads-input', { query: __classPrivateFieldGet(this, _DadsCombobox_query, "f") });
                return;
            }
            const selectionStart = __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").selectionStart ?? __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").value.length;
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
            if (__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")) {
                __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").focus();
                const nextCursor = Math.min(selectionStart, __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").value.length);
                __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").setSelectionRange(nextCursor, nextCursor);
            }
            this.emitEvent('dads-input', { query: __classPrivateFieldGet(this, _DadsCombobox_query, "f") });
        });
        _DadsCombobox_handleSearchCompositionStart.set(this, () => {
            __classPrivateFieldSet(this, _DadsCombobox_isSearchInputComposing, true, "f");
        });
        _DadsCombobox_handleSearchCompositionEnd.set(this, () => {
            __classPrivateFieldSet(this, _DadsCombobox_isSearchInputComposing, false, "f");
            __classPrivateFieldGet(this, _DadsCombobox_handleSearchInput, "f").call(this);
        });
        _DadsCombobox_handleInputCompositionStart.set(this, () => {
            __classPrivateFieldSet(this, _DadsCombobox_isInputComposing, true, "f");
        });
        _DadsCombobox_handleInputCompositionEnd.set(this, () => {
            __classPrivateFieldSet(this, _DadsCombobox_isInputComposing, false, "f");
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) !== 'input')
                return;
            __classPrivateFieldGet(this, _DadsCombobox_handleInput, "f").call(this);
        });
        _DadsCombobox_handlePanelPointerDown.set(this, () => {
            __classPrivateFieldSet(this, _DadsCombobox_isPointerDownOnPanel, true, "f");
        });
        _DadsCombobox_handlePanelPointerUp.set(this, () => {
            __classPrivateFieldSet(this, _DadsCombobox_isPointerDownOnPanel, false, "f");
        });
        _DadsCombobox_handleInputBlur.set(this, (event) => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) !== 'input')
                return;
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            // Guard 1: relatedTarget（パネル内遷移は確定しない）
            const related = event.relatedTarget;
            if (related instanceof Node && __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isInsideComponent).call(this, related))
                return;
            // Guard 2: pointerdown（option click中のblurは無視）
            if (__classPrivateFieldGet(this, _DadsCombobox_isPointerDownOnPanel, "f"))
                return;
            // Guard 3: isComposing（IME中は無視）
            if (__classPrivateFieldGet(this, _DadsCombobox_isInputComposing, "f"))
                return;
            // Guard 4: timing（setTimeout(0)で遅延判定）
            setTimeout(() => {
                if (!this.isConnected)
                    return;
                if (__classPrivateFieldGet(this, _DadsCombobox_isInputComposing, "f"))
                    return;
                if (__classPrivateFieldGet(this, _DadsCombobox_isPointerDownOnPanel, "f"))
                    return;
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_handleBlurCommit).call(this);
            }, 0);
        });
        _DadsCombobox_handleInputKeydown.set(this, (event) => {
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isImeComposing).call(this, event))
                return;
            const isControlInput = event.target === __classPrivateFieldGet(this, _DadsCombobox_input, "f");
            const isSearchInput = event.target === __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f");
            const searchCursor = isSearchInput
                ? (__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.selectionStart ?? __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.value.length ?? 0)
                : 0;
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isEscapeKey).call(this, event)) {
                if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                    return;
                event.preventDefault();
                this.removeAttribute('open');
                return;
            }
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f")) {
                        this.setAttribute('open', '');
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this));
                        break;
                    }
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_moveActive).call(this, 1, true);
                    if (isSearchInput)
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_restoreSearchInputFocus).call(this, searchCursor);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f")) {
                        this.setAttribute('open', '');
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findLastFilteredEnabledIndex).call(this));
                        break;
                    }
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_moveActive).call(this, -1, true);
                    if (isSearchInput)
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_restoreSearchInputFocus).call(this, searchCursor);
                    break;
                case 'Home':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this));
                    break;
                case 'End':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findLastFilteredEnabledIndex).call(this));
                    break;
                case 'Enter':
                    if (isControlInput && !__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f")) {
                        event.preventDefault();
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_toggleOpenFromControl).call(this);
                        return;
                    }
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    event.preventDefault();
                    if (__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f") >= 0) {
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_commitIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"));
                        break;
                    }
                    // activeIndex < 0
                    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input') {
                        const query = __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.value.trim() ?? '';
                        const filteredIndexes = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
                        if (filteredIndexes.length === 0 && query.length > 0 && __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_noMatchBehavior_get) === 'create') {
                            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_commitFreeText).call(this, query);
                        }
                        else if (filteredIndexes.length === 0 && __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_noMatchBehavior_get) === 'notice') {
                            // no-op: nothingFound + notice は状態維持
                        }
                        else {
                            this.removeAttribute('open');
                        }
                        return;
                    }
                    if (isControlInput)
                        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_toggleOpenFromControl).call(this);
                    break;
                case ' ':
                case 'Spacebar':
                    if (!isControlInput)
                        return;
                    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input')
                        return;
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_toggleOpenFromControl).call(this);
                    break;
                case 'Tab':
                    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                        return;
                    if (event.shiftKey)
                        return;
                    if (isControlInput && __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input') {
                        this.removeAttribute('open');
                        return;
                    }
                    if (isControlInput) {
                        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_hasVisibleSearchInput).call(this)) {
                            event.preventDefault();
                            __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.focus();
                            return;
                        }
                        this.removeAttribute('open');
                        return;
                    }
                    if (isSearchInput) {
                        this.removeAttribute('open');
                        return;
                    }
                    break;
            }
        });
        _DadsCombobox_handleDocumentClick.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            if (event.composedPath().includes(this))
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input')
                return;
            this.removeAttribute('open');
        });
        _DadsCombobox_handleDocumentKeydown.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isEscapeKey).call(this, event))
                return;
            event.preventDefault();
            this.removeAttribute('open');
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusControl).call(this);
        });
        _DadsCombobox_handleDocumentFocusIn.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            if (event.composedPath().includes(this))
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input')
                return;
            this.removeAttribute('open');
        });
        _DadsCombobox_handleOptionKeydown.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_moveActive).call(this, 1, true);
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusTabTargetOption).call(this);
                    return;
                case 'ArrowUp':
                    event.preventDefault();
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_moveActive).call(this, -1, true);
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusTabTargetOption).call(this);
                    return;
                case 'Tab':
                    if (event.shiftKey)
                        return;
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_handleOptionTab).call(this, event);
                    return;
            }
            if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isEscapeKey).call(this, event))
                return;
            event.preventDefault();
            this.removeAttribute('open');
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusControl).call(this);
        });
        _DadsCombobox_handleHostKeydown.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isEscapeKey).call(this, event)) {
                event.preventDefault();
                this.removeAttribute('open');
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusControl).call(this);
                return;
            }
            if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isImeComposing).call(this, event))
                return;
            const key = event.key;
            if (key !== 'ArrowDown' && key !== 'ArrowUp')
                return;
            // composedPath を使い Shadow DOM 内の実際の発行元を判定する
            // （host の capture リスナーでは event.target が host にリターゲットされるため）
            const path = event.composedPath();
            if (__classPrivateFieldGet(this, _DadsCombobox_input, "f") && path.includes(__classPrivateFieldGet(this, _DadsCombobox_input, "f")))
                return;
            if (__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f") && path.includes(__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")))
                return;
            if (path.some((node) => node instanceof HTMLElement && node.getAttribute('part') === 'option'))
                return;
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_moveActive).call(this, key === 'ArrowDown' ? 1 : -1, true);
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusTabTargetOption).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, { size: 'md' });
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_ensureDefaultBooleans).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_upgradePreDefinedValueProperty).call(this);
        __classPrivateFieldSet(this, _DadsCombobox_input, this.shadowRoot?.querySelector('#input'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_control, this.shadowRoot?.querySelector('#control'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_indicator, this.shadowRoot?.querySelector('#indicator'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_panel, this.shadowRoot?.querySelector('#panel'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_searchBox, this.shadowRoot?.querySelector('#search-box'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_searchInput, this.shadowRoot?.querySelector('#search-input'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_listbox, this.shadowRoot?.querySelector('#listbox'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_chipList, this.shadowRoot?.querySelector('#chip-list'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_errorSlot, this.shadowRoot?.querySelector('#error-slot'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_labelFallback, this.shadowRoot?.querySelector('#label-fallback'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_supportText, this.shadowRoot?.querySelector('#support-text'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_supportFallback, this.shadowRoot?.querySelector('#support-fallback'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_errorFallback, this.shadowRoot?.querySelector('#error-fallback'), "f");
        __classPrivateFieldSet(this, _DadsCombobox_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setupSlots).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setupControlListeners).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setupOptionsObserver).call(this);
        this.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleHostKeydown, "f"), true);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFromLightDomOptions).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncAllState).call(this);
        __classPrivateFieldSet(this, _DadsCombobox_defaultValue, this.getAttribute('value'), "f");
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncAllState).call(this);
        });
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleInputKeydown, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('input', __classPrivateFieldGet(this, _DadsCombobox_handleInput, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_control, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleControlClick, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_chipList, "f")?.removeEventListener('dads-chip-tag-remove', __classPrivateFieldGet(this, _DadsCombobox_handleChipRemove, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleInputKeydown, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.removeEventListener('input', __classPrivateFieldGet(this, _DadsCombobox_handleSearchInput, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.removeEventListener('compositionstart', __classPrivateFieldGet(this, _DadsCombobox_handleSearchCompositionStart, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.removeEventListener('compositionend', __classPrivateFieldGet(this, _DadsCombobox_handleSearchCompositionEnd, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('compositionstart', __classPrivateFieldGet(this, _DadsCombobox_handleInputCompositionStart, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('compositionend', __classPrivateFieldGet(this, _DadsCombobox_handleInputCompositionEnd, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.removeEventListener('blur', __classPrivateFieldGet(this, _DadsCombobox_handleInputBlur, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_panel, "f")?.removeEventListener('pointerdown', __classPrivateFieldGet(this, _DadsCombobox_handlePanelPointerDown, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_panel, "f")?.removeEventListener('pointerup', __classPrivateFieldGet(this, _DadsCombobox_handlePanelPointerUp, "f"));
        this.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleHostKeydown, "f"), true);
        __classPrivateFieldGet(this, _DadsCombobox_optionsObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsCombobox_optionsObserver, null, "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncDocumentListeners).call(this, false);
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
            return;
        switch (name) {
            case 'label':
                updateLabelFallback(__classPrivateFieldGet(this, _DadsCombobox_labelSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_labelFallback, "f"), this.getAttribute('label'));
                break;
            case 'support-text':
                updateSupportFallback(__classPrivateFieldGet(this, _DadsCombobox_supportSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportText, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportFallback, "f"), this.getAttribute('support-text'));
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
                break;
            case 'error':
            case 'error-text':
                updateErrorFallback(__classPrivateFieldGet(this, _DadsCombobox_errorSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorText, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
                break;
            case 'required':
                updateRequirement(__classPrivateFieldGet(this, _DadsCombobox_requirement, "f"), this.hasAttribute('required'), false);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
                break;
            case 'multiple':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionForModeChange).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionView).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
                break;
            case 'behavior':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAttributes).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncPanelVisibility).call(this);
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
                if (__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
                    __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-activedescendant');
                break;
            case 'no-match-behavior':
                break;
            case 'filterable':
            case 'disabled':
            case 'placeholder':
            case 'name':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAttributes).call(this);
                if (name === 'disabled')
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
                break;
            case 'open':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncOpenState).call(this, this.hasAttribute('open'));
                break;
            case 'value':
                if (newValue !== oldValue) {
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_applyValueAttribute).call(this, newValue);
                    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncValueAndSelectionView).call(this);
                }
                break;
            case 'restore-on-cancel':
            case 'clear-on-close':
            case 'size':
                __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
                break;
        }
    }
    get value() {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get))
            return Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f"));
        return __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f");
    }
    set value(v) {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
            const next = new Set();
            if (Array.isArray(v)) {
                for (const value of v) {
                    if (typeof value === 'string' && value.length > 0)
                        next.add(value);
                }
            }
            else if (typeof v === 'string' && v.length > 0) {
                for (const token of __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_parseCommaSeparatedValues).call(this, v))
                    next.add(token);
            }
            __classPrivateFieldSet(this, _DadsCombobox_selectedMultiple, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_filterKnownValues).call(this, next), "f");
            this.setAttribute('value', Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
        }
        else {
            const next = typeof v === 'string' ? v : String(v?.[0] ?? '');
            __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input' || __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, next)) ? next : '', "f");
            if (__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f").length > 0)
                this.setAttribute('value', __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
            else
                this.removeAttribute('value');
        }
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncValueAndSelectionView).call(this);
    }
    formResetCallback() {
        // 内部状態を先にクリアしてから初期値を適用する
        // （attributeChangedCallback が既存選択を保持するのを防ぐため）
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, '', "f");
        __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").clear();
        if (__classPrivateFieldGet(this, _DadsCombobox_defaultValue, "f") !== null) {
            this.setAttribute('value', __classPrivateFieldGet(this, _DadsCombobox_defaultValue, "f"));
        }
        else {
            this.removeAttribute('value');
        }
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_applyValueAttribute).call(this, __classPrivateFieldGet(this, _DadsCombobox_defaultValue, "f"));
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncValueAndSelectionView).call(this);
    }
    formStateRestoreCallback(state, _mode) {
        if (typeof state !== 'string')
            return;
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get))
            this.value = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_parseCommaSeparatedValues).call(this, state);
        else
            this.value = state;
    }
    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        __classPrivateFieldSet(this, _DadsCombobox_formDisabled, disabled, "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAttributes).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
    }
    focus(options) {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.blur();
    }
}
_DadsCombobox_input = new WeakMap(), _DadsCombobox_searchInput = new WeakMap(), _DadsCombobox_control = new WeakMap(), _DadsCombobox_indicator = new WeakMap(), _DadsCombobox_panel = new WeakMap(), _DadsCombobox_searchBox = new WeakMap(), _DadsCombobox_listbox = new WeakMap(), _DadsCombobox_chipList = new WeakMap(), _DadsCombobox_labelSlot = new WeakMap(), _DadsCombobox_supportSlot = new WeakMap(), _DadsCombobox_errorSlot = new WeakMap(), _DadsCombobox_labelFallback = new WeakMap(), _DadsCombobox_supportText = new WeakMap(), _DadsCombobox_supportFallback = new WeakMap(), _DadsCombobox_errorText = new WeakMap(), _DadsCombobox_errorFallback = new WeakMap(), _DadsCombobox_requirement = new WeakMap(), _DadsCombobox_listboxId = new WeakMap(), _DadsCombobox_isOpen = new WeakMap(), _DadsCombobox_query = new WeakMap(), _DadsCombobox_activeIndex = new WeakMap(), _DadsCombobox_isSearchInputComposing = new WeakMap(), _DadsCombobox_isInputComposing = new WeakMap(), _DadsCombobox_isPointerDownOnPanel = new WeakMap(), _DadsCombobox_options = new WeakMap(), _DadsCombobox_groups = new WeakMap(), _DadsCombobox_selectedSingle = new WeakMap(), _DadsCombobox_selectedMultiple = new WeakMap(), _DadsCombobox_defaultValue = new WeakMap(), _DadsCombobox_formDisabled = new WeakMap(), _DadsCombobox_optionsObserver = new WeakMap(), _DadsCombobox_documentAbort = new WeakMap(), _DadsCombobox_handleControlClick = new WeakMap(), _DadsCombobox_handleChipRemove = new WeakMap(), _DadsCombobox_handleInput = new WeakMap(), _DadsCombobox_handleSearchInput = new WeakMap(), _DadsCombobox_handleSearchCompositionStart = new WeakMap(), _DadsCombobox_handleSearchCompositionEnd = new WeakMap(), _DadsCombobox_handleInputCompositionStart = new WeakMap(), _DadsCombobox_handleInputCompositionEnd = new WeakMap(), _DadsCombobox_handlePanelPointerDown = new WeakMap(), _DadsCombobox_handlePanelPointerUp = new WeakMap(), _DadsCombobox_handleInputBlur = new WeakMap(), _DadsCombobox_handleInputKeydown = new WeakMap(), _DadsCombobox_handleDocumentClick = new WeakMap(), _DadsCombobox_handleDocumentKeydown = new WeakMap(), _DadsCombobox_handleDocumentFocusIn = new WeakMap(), _DadsCombobox_handleOptionKeydown = new WeakMap(), _DadsCombobox_handleHostKeydown = new WeakMap(), _DadsCombobox_instances = new WeakSet(), _DadsCombobox_ensureDefaultBooleans = function _DadsCombobox_ensureDefaultBooleans() {
    if (!this.hasAttribute('filterable'))
        this.setAttribute('filterable', '');
    if (!this.hasAttribute('clear-on-close'))
        this.setAttribute('clear-on-close', '');
    if (!this.hasAttribute('restore-on-cancel'))
        this.setAttribute('restore-on-cancel', '');
}, _DadsCombobox_upgradePreDefinedValueProperty = function _DadsCombobox_upgradePreDefinedValueProperty() {
    const hasOwnValue = Object.prototype.hasOwnProperty.call(this, 'value');
    const ownValue = hasOwnValue ? this.value : undefined;
    if (hasOwnValue) {
        delete this.value;
        if (ownValue !== undefined)
            this.value = ownValue;
    }
}, _DadsCombobox_isMultiple_get = function _DadsCombobox_isMultiple_get() {
    return this.hasAttribute('multiple');
}, _DadsCombobox_behavior_get = function _DadsCombobox_behavior_get() {
    return this.getAttribute('behavior') === 'input' ? 'input' : 'selection';
}, _DadsCombobox_isFilterable_get = function _DadsCombobox_isFilterable_get() {
    return __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input' || this.hasAttribute('filterable');
}, _DadsCombobox_noMatchBehavior_get = function _DadsCombobox_noMatchBehavior_get() {
    return this.getAttribute('no-match-behavior') === 'create' ? 'create' : 'notice';
}, _DadsCombobox_setupSlots = function _DadsCombobox_setupSlots() {
    setupSlotChangeListeners({
        label: __classPrivateFieldGet(this, _DadsCombobox_labelSlot, "f"),
        support: __classPrivateFieldGet(this, _DadsCombobox_supportSlot, "f"),
        error: __classPrivateFieldGet(this, _DadsCombobox_errorSlot, "f"),
    }, {
        onLabelChange: () => updateLabelFallback(__classPrivateFieldGet(this, _DadsCombobox_labelSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_labelFallback, "f"), this.getAttribute('label')),
        onSupportChange: () => {
            updateSupportFallback(__classPrivateFieldGet(this, _DadsCombobox_supportSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportText, "f"), __classPrivateFieldGet(this, _DadsCombobox_supportFallback, "f"), this.getAttribute('support-text'));
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
        },
        onErrorChange: () => {
            updateErrorFallback(__classPrivateFieldGet(this, _DadsCombobox_errorSlot, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorText, "f"), __classPrivateFieldGet(this, _DadsCombobox_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
        },
    });
    updateRequirement(__classPrivateFieldGet(this, _DadsCombobox_requirement, "f"), this.hasAttribute('required'), false);
}, _DadsCombobox_setupControlListeners = function _DadsCombobox_setupControlListeners() {
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleInputKeydown, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('input', __classPrivateFieldGet(this, _DadsCombobox_handleInput, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_control, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleControlClick, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_chipList, "f")?.addEventListener('dads-chip-tag-remove', __classPrivateFieldGet(this, _DadsCombobox_handleChipRemove, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleInputKeydown, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.addEventListener('input', __classPrivateFieldGet(this, _DadsCombobox_handleSearchInput, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.addEventListener('compositionstart', __classPrivateFieldGet(this, _DadsCombobox_handleSearchCompositionStart, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.addEventListener('compositionend', __classPrivateFieldGet(this, _DadsCombobox_handleSearchCompositionEnd, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('compositionstart', __classPrivateFieldGet(this, _DadsCombobox_handleInputCompositionStart, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('compositionend', __classPrivateFieldGet(this, _DadsCombobox_handleInputCompositionEnd, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.addEventListener('blur', __classPrivateFieldGet(this, _DadsCombobox_handleInputBlur, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_panel, "f")?.addEventListener('pointerdown', __classPrivateFieldGet(this, _DadsCombobox_handlePanelPointerDown, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_panel, "f")?.addEventListener('pointerup', __classPrivateFieldGet(this, _DadsCombobox_handlePanelPointerUp, "f"));
}, _DadsCombobox_hasVisibleSearchInput = function _DadsCombobox_hasVisibleSearchInput() {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input')
        return false;
    return Boolean(__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isFilterable_get) &&
        __classPrivateFieldGet(this, _DadsCombobox_searchBox, "f") &&
        !__classPrivateFieldGet(this, _DadsCombobox_searchBox, "f").hidden &&
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f") &&
        !__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").hidden &&
        !__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").disabled);
}, _DadsCombobox_setupOptionsObserver = function _DadsCombobox_setupOptionsObserver() {
    __classPrivateFieldGet(this, _DadsCombobox_optionsObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsCombobox_optionsObserver, new MutationObserver((mutations) => {
        if (!mutations.some((m) => __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_shouldSyncOptionsFromMutation).call(this, m)))
            return;
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFromLightDomOptions).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncValueAndSelectionView).call(this);
    }), "f");
    __classPrivateFieldGet(this, _DadsCombobox_optionsObserver, "f").observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    });
}, _DadsCombobox_shouldSyncOptionsFromMutation = function _DadsCombobox_shouldSyncOptionsFromMutation(mutation) {
    if (mutation.type === 'childList')
        return true;
    if (mutation.type === 'attributes') {
        const target = mutation.target;
        return target instanceof HTMLOptionElement || target instanceof HTMLOptGroupElement;
    }
    if (mutation.type === 'characterData') {
        const parent = mutation.target.parentElement;
        return parent instanceof HTMLOptionElement || parent instanceof HTMLOptGroupElement;
    }
    return false;
}, _DadsCombobox_syncAllState = function _DadsCombobox_syncAllState() {
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFromLightDomOptions).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAttributes).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_updateAriaDescribedBy).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionView).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncOpenState).call(this, this.hasAttribute('open'));
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
}, _DadsCombobox_syncFromLightDomOptions = function _DadsCombobox_syncFromLightDomOptions() {
    __classPrivateFieldSet(this, _DadsCombobox_groups, [], "f");
    const newOptions = [];
    for (const child of Array.from(this.children)) {
        if (child instanceof HTMLOptGroupElement) {
            const groupIndex = __classPrivateFieldGet(this, _DadsCombobox_groups, "f").length;
            __classPrivateFieldGet(this, _DadsCombobox_groups, "f").push({ label: child.label || '', groupIndex });
            for (const option of Array.from(child.children)) {
                if (option instanceof HTMLOptionElement) {
                    newOptions.push(__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_parseOptionElement).call(this, option, groupIndex));
                }
            }
        }
        else if (child instanceof HTMLOptionElement) {
            newOptions.push(__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_parseOptionElement).call(this, child, -1));
        }
    }
    __classPrivateFieldSet(this, _DadsCombobox_options, newOptions, "f");
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_applyValueAttribute).call(this, this.getAttribute('value'));
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionForModeChange).call(this);
}, _DadsCombobox_parseSearchAliases = function _DadsCombobox_parseSearchAliases(rawValue) {
    if (!rawValue)
        return [];
    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed))
            return [];
        return parsed
            .filter((item) => typeof item === 'string')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    }
    catch {
        return [];
    }
}, _DadsCombobox_parseOptionElement = function _DadsCombobox_parseOptionElement(option, group = -1) {
    const value = option.value;
    const label = option.label || option.textContent || option.value;
    const meta = option.getAttribute('data-meta') ?? '';
    const icon = (option.getAttribute('data-icon') ?? '').trim();
    const iconStyle = option.getAttribute('data-icon-style') === 'avatar' ? 'avatar' : 'icon';
    const avatarColor = (option.getAttribute('data-avatar-color') ?? '').trim();
    const searchAliases = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_parseSearchAliases).call(this, option.getAttribute('data-search'));
    return {
        value,
        label,
        meta,
        icon,
        iconStyle,
        avatarColor,
        disabled: option.disabled,
        selected: option.selected,
        searchIndex: __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_buildSearchIndex).call(this, label, value, meta, ...searchAliases),
        group,
    };
}, _DadsCombobox_buildSearchIndex = function _DadsCombobox_buildSearchIndex(...tokens) {
    return tokens.map((token) => __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_normalizeSearchText).call(this, token)).filter(Boolean).join(' ');
}, _DadsCombobox_normalizeSearchText = function _DadsCombobox_normalizeSearchText(value) {
    return value.trim().normalize('NFKC').toLocaleLowerCase('ja-JP');
}, _DadsCombobox_parseCommaSeparatedValues = function _DadsCombobox_parseCommaSeparatedValues(rawValue) {
    return rawValue
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0);
}, _DadsCombobox_applyValueAttribute = function _DadsCombobox_applyValueAttribute(attrValue) {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        if (attrValue !== null) {
            __classPrivateFieldSet(this, _DadsCombobox_selectedMultiple, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_filterKnownValues).call(this, new Set(__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_parseCommaSeparatedValues).call(this, attrValue))), "f");
        }
        else {
            const selected = new Set();
            for (const option of __classPrivateFieldGet(this, _DadsCombobox_options, "f")) {
                if (option.selected)
                    selected.add(option.value);
            }
            __classPrivateFieldSet(this, _DadsCombobox_selectedMultiple, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_filterKnownValues).call(this, selected), "f");
        }
        return;
    }
    if (attrValue !== null) {
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input' || __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, attrValue)) ? attrValue : '', "f");
        return;
    }
    const selectedOption = __classPrivateFieldGet(this, _DadsCombobox_options, "f").find((option) => option.selected);
    if (selectedOption) {
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, selectedOption.value, "f");
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) !== 'input' && !__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"))) {
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, '', "f");
    }
}, _DadsCombobox_syncSelectionForModeChange = function _DadsCombobox_syncSelectionForModeChange() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"))) {
            const firstMultiple = Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f"))[0];
            __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, firstMultiple) ? firstMultiple : '', "f");
        }
        __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").clear();
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").size === 0 && __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"))) {
        __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").add(__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
    }
}, _DadsCombobox_isKnownOptionValue = function _DadsCombobox_isKnownOptionValue(value) {
    if (!value)
        return false;
    return __classPrivateFieldGet(this, _DadsCombobox_options, "f").some((option) => option.value === value);
}, _DadsCombobox_filterKnownValues = function _DadsCombobox_filterKnownValues(values) {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input')
        return values;
    const filtered = new Set();
    for (const value of values) {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isKnownOptionValue).call(this, value))
            filtered.add(value);
    }
    return filtered;
}, _DadsCombobox_syncInputAttributes = function _DadsCombobox_syncInputAttributes() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f") || !__classPrivateFieldGet(this, _DadsCombobox_listbox, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-controls', __classPrivateFieldGet(this, _DadsCombobox_listboxId, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").id = __classPrivateFieldGet(this, _DadsCombobox_listboxId, "f");
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").setAttribute('aria-multiselectable', __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get) ? 'true' : 'false');
    const disabled = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this);
    const isInputBehavior = __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input';
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").disabled = disabled;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").readOnly = !isInputBehavior;
    if (__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")) {
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").disabled = disabled || isInputBehavior;
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").hidden = isInputBehavior;
    }
    __classPrivateFieldGet(this, _DadsCombobox_indicator, "f")?.toggleAttribute('disabled', disabled);
    const placeholder = this.getAttribute('placeholder');
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").placeholder = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_resolveControlPlaceholder).call(this, placeholder);
}, _DadsCombobox_resolveControlPlaceholder = function _DadsCombobox_resolveControlPlaceholder(placeholderAttr) {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get) && __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").size > 0)
        return '';
    if (placeholderAttr !== null)
        return placeholderAttr;
    return __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input' ? '入力してください' : '選択してください';
}, _DadsCombobox_syncInputAria = function _DadsCombobox_syncInputAria() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-expanded', __classPrivateFieldGet(this, _DadsCombobox_isOpen, "f") ? 'true' : 'false');
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-invalid', this.hasAttribute('error') ? 'true' : 'false');
    if (this.hasAttribute('required'))
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-required', 'true');
    else
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-required');
}, _DadsCombobox_syncFormValue = function _DadsCombobox_syncFormValue() {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        this._internals.setFormValue(Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
        return;
    }
    this._internals.setFormValue(__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
}, _DadsCombobox_isDisabled = function _DadsCombobox_isDisabled() {
    return __classPrivateFieldGet(this, _DadsCombobox_formDisabled, "f") || this.hasAttribute('disabled');
}, _DadsCombobox_updateAriaDescribedBy = function _DadsCombobox_updateAriaDescribedBy() {
    const supportVisible = __classPrivateFieldGet(this, _DadsCombobox_supportText, "f")?.style.display !== 'none';
    updateAriaDescribedBy(__classPrivateFieldGet(this, _DadsCombobox_input, "f"), supportVisible, this.hasAttribute('error'));
}, _DadsCombobox_toggleOpenFromControl = function _DadsCombobox_toggleOpenFromControl() {
    if (__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
        this.removeAttribute('open');
    else
        this.setAttribute('open', '');
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_focusControl).call(this);
}, _DadsCombobox_resolveChipRemoveValue = function _DadsCombobox_resolveChipRemoveValue(event) {
    const target = event.target;
    const optionValue = target instanceof HTMLElement ? target.getAttribute('data-option-value') ?? '' : '';
    if (optionValue.length > 0)
        return optionValue;
    const detailValue = event.detail?.value;
    if (typeof detailValue === 'string' && detailValue.length > 0)
        return detailValue;
    return '';
}, _DadsCombobox_isInsideComponent = function _DadsCombobox_isInsideComponent(node) {
    if (this.contains(node))
        return true;
    if (this.shadowRoot?.contains(node))
        return true;
    const root = node.getRootNode();
    if (root instanceof ShadowRoot && root.host === this)
        return true;
    return false;
}, _DadsCombobox_handleBlurCommit = function _DadsCombobox_handleBlurCommit() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
        return;
    const query = __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.value.trim() ?? '';
    // 空文字はキャンセル（D-09）
    if (query.length === 0) {
        this.removeAttribute('open');
        return;
    }
    // activeIndexがあれば候補確定
    if (__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f") >= 0) {
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_commitIndex).call(this, __classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"));
        return;
    }
    // 候補なし時の分岐（P-15）
    const filteredIndexes = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
    if (filteredIndexes.length === 0) {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_noMatchBehavior_get) === 'create') {
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_commitFreeText).call(this, query);
            return;
        }
        // notice: キャンセル
        this.removeAttribute('open');
        return;
    }
    // 候補ありだがactiveIndex < 0: キャンセル
    this.removeAttribute('open');
}, _DadsCombobox_commitFreeText = function _DadsCombobox_commitFreeText(text) {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").add(text);
        this.setAttribute('value', Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionView).call(this);
        this.emitEvent('dads-change', { value: Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")), source: 'free-text' });
    }
    else {
        __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, text, "f");
        this.setAttribute('value', text);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
        this.emitEvent('dads-change', { value: text, source: 'free-text' });
    }
    this.removeAttribute('open');
}, _DadsCombobox_resolveQueryFromRawInput = function _DadsCombobox_resolveQueryFromRawInput(rawInput) {
    if (__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f") || __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get))
        return rawInput;
    const selectedLabel = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_labelFromValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
    if (selectedLabel.length === 0)
        return rawInput;
    return rawInput.startsWith(selectedLabel) ? rawInput.slice(selectedLabel.length) : rawInput;
}, _DadsCombobox_commitIndex = function _DadsCombobox_commitIndex(index) {
    const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f")[index];
    if (!option || option.disabled)
        return;
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        if (__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").has(option.value))
            __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").delete(option.value);
        else
            __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").add(option.value);
        this.setAttribute('value', Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")).join(','));
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
        this.emitEvent('dads-change', { value: Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f")) });
        return;
    }
    __classPrivateFieldSet(this, _DadsCombobox_selectedSingle, option.value, "f");
    this.setAttribute('value', __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
    this.emitEvent('dads-change', { value: __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f") });
    this.removeAttribute('open');
}, _DadsCombobox_syncOpenState = function _DadsCombobox_syncOpenState(nextOpen) {
    if (nextOpen === __classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
        return;
    __classPrivateFieldSet(this, _DadsCombobox_isOpen, nextOpen, "f");
    if (nextOpen) {
        __classPrivateFieldSet(this, _DadsCombobox_activeIndex, __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_preferredActiveIndex).call(this), "f");
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncDocumentListeners).call(this, true);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isFilterable_get) && __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) !== 'input') {
            __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")?.focus();
        }
        this.emitEvent('dads-open');
        return;
    }
    // 拘束条件: close時は常にqueryをクリアする
    __classPrivateFieldSet(this, _DadsCombobox_query, '', "f");
    __classPrivateFieldSet(this, _DadsCombobox_activeIndex, -1, "f");
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncDocumentListeners).call(this, false);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputAria).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
    this.emitEvent('dads-close');
}, _DadsCombobox_syncDocumentListeners = function _DadsCombobox_syncDocumentListeners(enable) {
    __classPrivateFieldGet(this, _DadsCombobox_documentAbort, "f")?.abort();
    __classPrivateFieldSet(this, _DadsCombobox_documentAbort, null, "f");
    if (!enable)
        return;
    const controller = new AbortController();
    __classPrivateFieldSet(this, _DadsCombobox_documentAbort, controller, "f");
    document.addEventListener('click', __classPrivateFieldGet(this, _DadsCombobox_handleDocumentClick, "f"), { signal: controller.signal });
    document.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleDocumentKeydown, "f"), { signal: controller.signal });
    document.addEventListener('focusin', __classPrivateFieldGet(this, _DadsCombobox_handleDocumentFocusIn, "f"), { signal: controller.signal });
}, _DadsCombobox_renderChipList = function _DadsCombobox_renderChipList() {
    const chipList = __classPrivateFieldGet(this, _DadsCombobox_chipList, "f");
    if (!chipList)
        return;
    // behavior="input" ではchipを表示しない
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input') {
        chipList.replaceChildren();
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setChipListVisible).call(this, false);
        return;
    }
    chipList.replaceChildren();
    if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f").find((item) => item.value === __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
        if (!option) {
            __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setChipListVisible).call(this, false);
            return;
        }
        chipList.appendChild(__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_createChipItem).call(this, option));
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setChipListVisible).call(this, true);
        return;
    }
    const values = Array.from(__classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f"));
    if (values.length === 0) {
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setChipListVisible).call(this, false);
        return;
    }
    let hasChips = false;
    for (const value of values) {
        const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f").find((item) => item.value === value);
        if (!option)
            continue;
        chipList.appendChild(__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_createChipItem).call(this, option));
        hasChips = true;
    }
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setChipListVisible).call(this, hasChips);
}, _DadsCombobox_setChipListVisible = function _DadsCombobox_setChipListVisible(visible) {
    if (!__classPrivateFieldGet(this, _DadsCombobox_chipList, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_chipList, "f").hidden = !visible;
    if (visible)
        __classPrivateFieldGet(this, _DadsCombobox_control, "f")?.setAttribute('data-has-chip', '');
    else
        __classPrivateFieldGet(this, _DadsCombobox_control, "f")?.removeAttribute('data-has-chip');
}, _DadsCombobox_createChipItem = function _DadsCombobox_createChipItem(option) {
    const chip = document.createElement('dads-chip-tag');
    chip.setAttribute('part', 'chip');
    chip.setAttribute('action', 'remove');
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
        chip.setAttribute('disabled', '');
    chip.setAttribute('remove-label', `${option.label}を削除`);
    chip.setAttribute('value', option.label);
    chip.setAttribute('data-option-value', option.value);
    chip.textContent = option.label;
    const item = document.createElement('li');
    item.setAttribute('part', 'chip-item');
    item.appendChild(chip);
    return item;
}, _DadsCombobox_renderOptions = function _DadsCombobox_renderOptions() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_listbox, "f") || !__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").replaceChildren();
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncListboxFloatingPosition).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncPanelVisibility).call(this);
    if (!__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f")) {
        __classPrivateFieldSet(this, _DadsCombobox_isSearchInputComposing, false, "f");
        __classPrivateFieldSet(this, _DadsCombobox_isInputComposing, false, "f");
        __classPrivateFieldSet(this, _DadsCombobox_isPointerDownOnPanel, false, "f");
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-activedescendant');
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f")) {
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").value = __classPrivateFieldGet(this, _DadsCombobox_query, "f");
        __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").placeholder = '';
    }
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptionRowsIntoListbox).call(this);
}, _DadsCombobox_syncPanelVisibility = function _DadsCombobox_syncPanelVisibility() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_panel, "f") || !__classPrivateFieldGet(this, _DadsCombobox_listbox, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_panel, "f").hidden = !__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f");
    __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").hidden = !__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f");
    if (!__classPrivateFieldGet(this, _DadsCombobox_searchBox, "f"))
        return;
    const showSearchBox = __classPrivateFieldGet(this, _DadsCombobox_isOpen, "f") && __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isFilterable_get) && __classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) !== 'input';
    __classPrivateFieldGet(this, _DadsCombobox_searchBox, "f").hidden = !showSearchBox;
}, _DadsCombobox_renderOptionRowsIntoListbox = function _DadsCombobox_renderOptionRowsIntoListbox() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_listbox, "f") || !__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_clearRenderedOptionRows).call(this);
    const filteredIndexes = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
    if (filteredIndexes.length === 0) {
        const empty = document.createElement('div');
        empty.setAttribute('part', 'empty');
        empty.textContent = '候補がありません';
        __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").appendChild(empty);
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-activedescendant');
        return;
    }
    let lastRenderedGroup = -2;
    for (const index of filteredIndexes) {
        const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f")[index];
        if (option.group >= 0 && option.group !== lastRenderedGroup) {
            const groupData = __classPrivateFieldGet(this, _DadsCombobox_groups, "f")[option.group];
            if (groupData)
                __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").appendChild(__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_createGroupHeader).call(this, groupData));
        }
        lastRenderedGroup = option.group;
        __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").appendChild(__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_createOptionElement).call(this, index));
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f") >= 0) {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").setAttribute('aria-activedescendant', `${__classPrivateFieldGet(this, _DadsCombobox_listboxId, "f")}-option-${__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f")}`);
    }
    else {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").removeAttribute('aria-activedescendant');
    }
}, _DadsCombobox_clearRenderedOptionRows = function _DadsCombobox_clearRenderedOptionRows() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_listbox, "f"))
        return;
    const renderedRows = __classPrivateFieldGet(this, _DadsCombobox_listbox, "f").querySelectorAll('[part="option"], [part="empty"], [part="option-group-label"]');
    for (const row of renderedRows) {
        row.remove();
    }
}, _DadsCombobox_createGroupHeader = function _DadsCombobox_createGroupHeader(group) {
    const header = document.createElement('div');
    header.setAttribute('part', 'option-group-label');
    header.setAttribute('role', 'presentation');
    header.setAttribute('aria-hidden', 'true');
    header.textContent = group.label;
    return header;
}, _DadsCombobox_createOptionElement = function _DadsCombobox_createOptionElement(index) {
    const option = __classPrivateFieldGet(this, _DadsCombobox_options, "f")[index];
    const optionId = `${__classPrivateFieldGet(this, _DadsCombobox_listboxId, "f")}-option-${index}`;
    const optionElement = document.createElement('button');
    optionElement.type = 'button';
    optionElement.id = optionId;
    optionElement.setAttribute('part', 'option');
    optionElement.setAttribute('role', 'option');
    optionElement.setAttribute('aria-selected', __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isOptionSelected).call(this, option) ? 'true' : 'false');
    optionElement.setAttribute('data-option-index', String(index));
    if (index === __classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"))
        optionElement.setAttribute('data-active', 'true');
    optionElement.tabIndex = -1;
    if (option.disabled)
        optionElement.setAttribute('aria-disabled', 'true');
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        const check = document.createElement('span');
        check.setAttribute('part', 'option-check');
        check.setAttribute('aria-hidden', 'true');
        optionElement.appendChild(check);
    }
    if (option.icon.length > 0) {
        const partName = option.iconStyle === 'avatar' ? 'option-avatar' : 'option-icon';
        if (option.iconStyle === 'avatar' && !__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isIconName).call(this, option.icon) && !__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isSafeIconUrl).call(this, option.icon)) {
            const avatarEl = document.createElement(`${getPrefix()}-avatar`);
            avatarEl.setAttribute('initials', option.icon);
            if (option.avatarColor.length > 0) {
                avatarEl.setAttribute('color', option.avatarColor);
            }
            avatarEl.setAttribute('size', '32');
            avatarEl.setAttribute('part', partName);
            avatarEl.setAttribute('aria-hidden', 'true');
            optionElement.appendChild(avatarEl);
        }
        else if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isIconName).call(this, option.icon)) {
            const iconEl = document.createElement(`${getPrefix()}-icon`);
            iconEl.setAttribute('name', option.icon);
            iconEl.setAttribute('size', option.iconStyle === 'avatar' ? '32' : '20');
            iconEl.setAttribute('part', partName);
            iconEl.setAttribute('aria-hidden', 'true');
            optionElement.appendChild(iconEl);
        }
        else if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isSafeIconUrl).call(this, option.icon)) {
            const img = document.createElement('img');
            img.setAttribute('part', partName);
            img.src = option.icon;
            img.alt = '';
            img.setAttribute('aria-hidden', 'true');
            optionElement.appendChild(img);
        }
    }
    const label = document.createElement('span');
    label.setAttribute('part', 'option-label');
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptionLabel).call(this, label, option.label);
    optionElement.appendChild(label);
    if (option.meta.length > 0) {
        const meta = document.createElement('span');
        meta.setAttribute('part', 'option-meta');
        meta.textContent = option.meta;
        optionElement.appendChild(meta);
    }
    optionElement.addEventListener('click', (event) => {
        event.preventDefault();
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_commitIndex).call(this, index);
    });
    optionElement.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCombobox_handleOptionKeydown, "f"));
    return optionElement;
}, _DadsCombobox_isIconName = function _DadsCombobox_isIconName(value) {
    return value in iconPaths;
}, _DadsCombobox_isSafeIconUrl = function _DadsCombobox_isSafeIconUrl(value) {
    if (/^https?:\/\//.test(value))
        return true;
    if (/^data:image\//.test(value))
        return true;
    if (/^(\/|\.\.?\/)/.test(value))
        return true;
    return false;
}, _DadsCombobox_syncListboxFloatingPosition = function _DadsCombobox_syncListboxFloatingPosition() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_panel, "f") || !__classPrivateFieldGet(this, _DadsCombobox_control, "f"))
        return;
    const controlBottom = __classPrivateFieldGet(this, _DadsCombobox_control, "f").offsetTop + __classPrivateFieldGet(this, _DadsCombobox_control, "f").offsetHeight;
    __classPrivateFieldGet(this, _DadsCombobox_panel, "f").style.setProperty('--dads-combobox-control-bottom', `${controlBottom}px`);
}, _DadsCombobox_isOptionSelected = function _DadsCombobox_isOptionSelected(option) {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get))
        return __classPrivateFieldGet(this, _DadsCombobox_selectedMultiple, "f").has(option.value);
    return __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f").length > 0 && __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f") === option.value;
}, _DadsCombobox_getFilteredIndexes = function _DadsCombobox_getFilteredIndexes() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isFilterable_get))
        return __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_allOptionIndexes).call(this);
    const query = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_normalizeSearchText).call(this, __classPrivateFieldGet(this, _DadsCombobox_query, "f"));
    if (query.length === 0)
        return __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_allOptionIndexes).call(this);
    return __classPrivateFieldGet(this, _DadsCombobox_options, "f").reduce((indexes, option, index) => {
        if (option.searchIndex.includes(query))
            indexes.push(index);
        return indexes;
    }, []);
}, _DadsCombobox_allOptionIndexes = function _DadsCombobox_allOptionIndexes() {
    return __classPrivateFieldGet(this, _DadsCombobox_options, "f").map((_option, index) => index);
}, _DadsCombobox_findFirstFilteredEnabledIndex = function _DadsCombobox_findFirstFilteredEnabledIndex() {
    const filtered = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
    for (const index of filtered) {
        if (!__classPrivateFieldGet(this, _DadsCombobox_options, "f")[index].disabled)
            return index;
    }
    return -1;
}, _DadsCombobox_findLastFilteredEnabledIndex = function _DadsCombobox_findLastFilteredEnabledIndex() {
    const filtered = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this);
    for (let i = filtered.length - 1; i >= 0; i -= 1) {
        const index = filtered[i];
        if (!__classPrivateFieldGet(this, _DadsCombobox_options, "f")[index].disabled)
            return index;
    }
    return -1;
}, _DadsCombobox_preferredActiveIndex = function _DadsCombobox_preferredActiveIndex() {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get))
        return -1;
    if (__classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f")) {
        const selectedIndex = __classPrivateFieldGet(this, _DadsCombobox_options, "f").findIndex((option) => option.value === __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
        if (selectedIndex >= 0 && __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this).includes(selectedIndex))
            return selectedIndex;
    }
    return __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_findFirstFilteredEnabledIndex).call(this);
}, _DadsCombobox_moveActive = function _DadsCombobox_moveActive(step, allowInitialize) {
    const filtered = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getFilteredIndexes).call(this).filter((index) => !__classPrivateFieldGet(this, _DadsCombobox_options, "f")[index].disabled);
    if (filtered.length === 0) {
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, -1);
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f") < 0 || !filtered.includes(__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"))) {
        if (!allowInitialize)
            return;
        __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, step === 1 ? filtered[0] : filtered[filtered.length - 1]);
        return;
    }
    const current = filtered.indexOf(__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f"));
    const next = (current + step + filtered.length) % filtered.length;
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_setActiveIndex).call(this, filtered[next]);
}, _DadsCombobox_setActiveIndex = function _DadsCombobox_setActiveIndex(index) {
    __classPrivateFieldSet(this, _DadsCombobox_activeIndex, index, "f");
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
}, _DadsCombobox_focusTabTargetOption = function _DadsCombobox_focusTabTargetOption() {
    const options = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getTabNavigableOptions).call(this);
    if (options.length === 0)
        return false;
    const activeOption = options.find((option) => option.getAttribute('data-option-index') === String(__classPrivateFieldGet(this, _DadsCombobox_activeIndex, "f")));
    (activeOption ?? options[0]).focus();
    return true;
}, _DadsCombobox_getTabNavigableOptions = function _DadsCombobox_getTabNavigableOptions() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_listbox, "f"))
        return [];
    return Array.from(__classPrivateFieldGet(this, _DadsCombobox_listbox, "f").querySelectorAll('[part="option"]')).filter((node) => node instanceof HTMLButtonElement && node.getAttribute('aria-disabled') !== 'true');
}, _DadsCombobox_getChipActionButtons = function _DadsCombobox_getChipActionButtons() {
    const chips = Array.from(this.shadowRoot?.querySelectorAll('dads-chip-tag') ?? []);
    return chips
        .map((chip) => chip.shadowRoot?.querySelector('[part="action"]'))
        .filter((button) => button instanceof HTMLButtonElement);
}, _DadsCombobox_restoreSearchInputFocus = function _DadsCombobox_restoreSearchInputFocus(cursor) {
    if (!__classPrivateFieldGet(this, _DadsCombobox_searchInput, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").focus();
    const nextCursor = Math.min(cursor, __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").value.length);
    __classPrivateFieldGet(this, _DadsCombobox_searchInput, "f").setSelectionRange(nextCursor, nextCursor);
}, _DadsCombobox_handleOptionTab = function _DadsCombobox_handleOptionTab(event) {
    const currentOption = event.currentTarget;
    if (!(currentOption instanceof HTMLButtonElement))
        return;
    const options = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getTabNavigableOptions).call(this);
    if (options.length === 0) {
        this.removeAttribute('open');
        return;
    }
    const lastOption = options[options.length - 1];
    if (currentOption !== lastOption)
        return;
    const chipActions = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_getChipActionButtons).call(this);
    if (chipActions.length > 0) {
        event.preventDefault();
        chipActions[0].focus();
        return;
    }
    this.removeAttribute('open');
}, _DadsCombobox_isEscapeKey = function _DadsCombobox_isEscapeKey(eventOrKey) {
    const key = typeof eventOrKey === 'string' ? eventOrKey : eventOrKey.key;
    if (key === 'Escape' || key === 'Esc')
        return true;
    if (typeof eventOrKey === 'string')
        return false;
    if (eventOrKey.code === 'Escape')
        return true;
    return eventOrKey.keyCode === 27 || eventOrKey.which === 27;
}, _DadsCombobox_isImeComposing = function _DadsCombobox_isImeComposing(event) {
    if (event.isComposing)
        return true;
    if (event.key === 'Process')
        return true;
    return event.keyCode === 229 || event.which === 229;
}, _DadsCombobox_syncSelectionView = function _DadsCombobox_syncSelectionView() {
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderChipList).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_renderOptions).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncInputDisplay).call(this);
}, _DadsCombobox_syncValueAndSelectionView = function _DadsCombobox_syncValueAndSelectionView() {
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncFormValue).call(this);
    __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_syncSelectionView).call(this);
}, _DadsCombobox_syncInputDisplay = function _DadsCombobox_syncInputDisplay() {
    if (!__classPrivateFieldGet(this, _DadsCombobox_input, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").placeholder = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_resolveControlPlaceholder).call(this, this.getAttribute('placeholder'));
    // behavior="input": open中は入力値保持、close時はラベルまたは空
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_behavior_get) === 'input') {
        if (__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f"))
            return;
        if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
            const label = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_labelFromValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
            __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = label.length > 0 ? label : __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f");
        }
        else {
            __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = '';
        }
        return;
    }
    if (__classPrivateFieldGet(this, _DadsCombobox_isOpen, "f") && this.hasAttribute('filterable')) {
        if (__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
            __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = '';
            return;
        }
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_labelFromValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
        return;
    }
    if (!__classPrivateFieldGet(this, _DadsCombobox_instances, "a", _DadsCombobox_isMultiple_get)) {
        __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = __classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_labelFromValue).call(this, __classPrivateFieldGet(this, _DadsCombobox_selectedSingle, "f"));
        return;
    }
    __classPrivateFieldGet(this, _DadsCombobox_input, "f").value = '';
}, _DadsCombobox_labelFromValue = function _DadsCombobox_labelFromValue(value) {
    if (!value)
        return '';
    const found = __classPrivateFieldGet(this, _DadsCombobox_options, "f").find((option) => option.value === value);
    return found?.label ?? '';
}, _DadsCombobox_focusControl = function _DadsCombobox_focusControl() {
    if (__classPrivateFieldGet(this, _DadsCombobox_instances, "m", _DadsCombobox_isDisabled).call(this))
        return;
    __classPrivateFieldGet(this, _DadsCombobox_input, "f")?.focus();
}, _DadsCombobox_renderOptionLabel = function _DadsCombobox_renderOptionLabel(labelElement, labelText) {
    const query = __classPrivateFieldGet(this, _DadsCombobox_query, "f").trim();
    if (query.length === 0) {
        labelElement.textContent = labelText;
        return;
    }
    const lowerLabel = labelText.toLocaleLowerCase('ja-JP');
    const lowerQuery = query.toLocaleLowerCase('ja-JP');
    const matchStart = lowerLabel.indexOf(lowerQuery);
    if (matchStart < 0) {
        labelElement.textContent = labelText;
        return;
    }
    const matchEnd = matchStart + query.length;
    const before = labelText.slice(0, matchStart);
    const matched = labelText.slice(matchStart, matchEnd);
    const after = labelText.slice(matchEnd);
    if (before.length > 0)
        labelElement.append(before);
    const match = document.createElement('strong');
    match.setAttribute('part', 'option-match');
    match.textContent = matched;
    labelElement.append(match);
    if (after.length > 0)
        labelElement.append(after);
};
DadsCombobox.formAssociated = true;
DadsCombobox.definition = {
    name: 'dads-combobox',
    template: html `
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="input">
          <span part="label-text" id="label-text">
            <slot name="label" id="label-slot"></slot>
            <span id="label-fallback"></span>
          </span>
          <span part="requirement" id="requirement"></span>
        </label>

        <div part="support-text" id="support-text">
          <slot name="support-text" id="support-slot"></slot>
          <span id="support-fallback"></span>
        </div>

        <div part="control" id="control">
          <input
            part="input"
            id="input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="false"
            autocomplete="off"
          />
          <ul part="chip-list" id="chip-list"></ul>
          <button part="indicator" id="indicator" type="button" aria-label="候補を開閉" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z"></path>
            </svg>
          </button>
        </div>

        <div part="panel" id="panel" hidden>
          <div part="search-box" id="search-box" hidden>
            <span part="search-icon" id="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"></path>
              </svg>
            </span>
            <input part="search-input" id="search-input" type="text" aria-label="候補を検索" autocomplete="off" />
          </div>
          <div part="listbox" id="listbox" role="listbox" hidden></div>
        </div>

        <div part="error-text" id="error-text">
          <slot name="error-text" id="error-slot"></slot>
          <span id="error-fallback"></span>
        </div>

        <slot name="required-error" id="required-error-slot" hidden></slot>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), comboboxTokens, comboboxStyles, applyDADSFocusStyles()], 'minimal'),
    attributes: [
        PropertyAttr('label'),
        PropertyAttr('support-text'),
        BooleanAttr('required'),
        BooleanAttr('error'),
        PropertyAttr('error-text'),
        BooleanAttr('disabled'),
        PropertyAttr('name'),
        BooleanAttr('multiple'),
        BooleanAttr('filterable'),
        BooleanAttr('clear-on-close'),
        BooleanAttr('restore-on-cancel'),
        BooleanAttr('open'),
        PropertyAttr('placeholder'),
        PropertyAttr('size'),
        PropertyAttr('behavior'),
        PropertyAttr('no-match-behavior'),
        { attribute: 'value' },
    ],
};
