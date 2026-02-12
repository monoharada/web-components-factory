import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  modulePreloadScript,
  renderApiPanelWrapper,
  renderA11ySectionHeader,
  renderAnnotationToggleBlock,
} from './shared.js';

const BACK_ICON = `
  <svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14.9 4.5L13.8 3.4L5.2 12L13.8 20.6L14.9 19.5L7.4 12L14.9 4.5Z" />
  </svg>
`;

const DRILLDOWN_RIGHT_ICON = `
  <svg
    slot="end-icon"
    data-mobile-menu-drill-end-icon
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.1 4.5L8 5.6L14.4 12L8 18.4L9.1 19.5L16.6 12L9.1 4.5Z" />
  </svg>
`;

const MENU_ICON_INFO = `
  <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
    <circle cx="12" cy="8" r="1.1" fill="currentColor" />
    <path d="M12 11.2V16.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
`;

const MENU_ICON_FOLDER = `
  <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3.5 6.5H9l2 2h9.5v9.5H3.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M3.5 10h17" stroke="currentColor" stroke-width="1.8" />
  </svg>
`;

const MENU_ICON_APPLICATION = `
  <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 3.5h8l3 3V20.5H7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M15 3.5v3h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M10 11.2h5.6M10 14.5h4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
`;

const MENU_ICON_PERSON = `
  <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8.2" r="3.2" stroke="currentColor" stroke-width="1.8" />
    <path d="M5.5 19.2a6.5 6.5 0 0 1 13 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
`;

const MENU_ICON_QUESTION = `
  <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 4.3 1.8c-.9.9-1.8 1.4-1.8 2.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="12" cy="16.8" r="1" fill="currentColor" />
  </svg>
`;

const MENU_ICON_LANGUAGE = `
  <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
    <path d="M3.5 12h17M12 3.2c2.2 2.2 3.5 5.4 3.5 8.8s-1.3 6.6-3.5 8.8M12 3.2c-2.2 2.2-3.5 5.4-3.5 8.8s1.3 6.6 3.5 8.8" stroke="currentColor" stroke-width="1.4" />
  </svg>
`;

const MOCK_BODY_PLACEHOLDER = `
  <div class="mobile-menu-demo__mock-body" aria-hidden="true">
    <p class="mobile-menu-demo__mock-kicker">サンプルページ</p>
    <div class="mobile-menu-demo__mock-card"></div>
    <div class="mobile-menu-demo__mock-card"></div>
    <div class="mobile-menu-demo__mock-card mobile-menu-demo__mock-card--wide"></div>
  </div>
`;

type AccordionMenuOptions = Readonly<{
  idPrefix: string;
  withBack: boolean;
  backLabel?: string;
  backDataAttribute?: string;
  rootAttributes?: string;
  sampleName?: string;
  currentItemId?: string;
}>;

type DrilldownMenuOptions = Readonly<{
  withSectionChip: boolean;
  rootAttributes?: string;
  sampleName?: string;
  currentItemId?: string;
  dividerVariant?: 'default' | 'wide';
  storyId?: string;
}>;

function renderBackLink(backLabel: string, backDataAttribute?: string): string {
  const dataAttribute = backDataAttribute ? ` ${backDataAttribute}` : '';
  return `
      <dads-utility-link slot="back" href="#"${dataAttribute}>
        ${BACK_ICON}
        ${backLabel}
      </dads-utility-link>
  `;
}

function renderAccordionMenuMarkup(options: AccordionMenuOptions): string {
  const reportsSectionId = `${options.idPrefix}-section-open`;
  const reportsTriggerId = `${options.idPrefix}-section-open-trigger`;
  const applicationSectionId = `${options.idPrefix}-section-closed`;
  const applicationTriggerId = `${options.idPrefix}-section-closed-trigger`;
  const languageSectionId = `${options.idPrefix}-section-language`;
  const languageTriggerId = `${options.idPrefix}-section-language-trigger`;
  const sampleAttribute = options.sampleName ? ` data-mobile-menu-sample="${options.sampleName}"` : '';
  const rootAttributes = options.rootAttributes ? ` ${options.rootAttributes}` : '';
  const currentIdAttr = options.currentItemId ? ` id="${options.currentItemId}"` : '';

  return `
    <dads-mobile-menu aria-label="グローバルメニュー"${sampleAttribute}${rootAttributes}>
      ${options.withBack
        ? renderBackLink(options.backLabel ?? '戻る', options.backDataAttribute)
        : ''}

      <dads-menu-list>
        <dads-menu-list-item href="#">
          メニューアイテム
        </dads-menu-list-item>

        <dads-menu-list-item href="#">
          お知らせ
        </dads-menu-list-item>

        <dads-menu-list-item
          id="${reportsTriggerId}"
          aria-controls="${reportsSectionId}"
          aria-expanded="true"
          end-icon="caret"
          expanded
        >
          白書・統計・資料
        </dads-menu-list-item>
        <dads-menu-list id="${reportsSectionId}" indentation="1">
          <dads-menu-list-item href="#">
            白書
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            統計
          </dads-menu-list-item>
          <dads-menu-list-item${currentIdAttr} current>
            パンフレット・リーフレット・ポスター
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            資料
          </dads-menu-list-item>
        </dads-menu-list>

        <dads-menu-list-item
          id="${applicationTriggerId}"
          aria-controls="${applicationSectionId}"
          aria-expanded="false"
          end-icon="caret"
        >
          申請
        </dads-menu-list-item>
        <dads-menu-list id="${applicationSectionId}" indentation="1" hidden>
          <dads-menu-list-item href="#">
            オンライン申請
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            申請状況の確認
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            必要書類
          </dads-menu-list-item>
        </dads-menu-list>

        <dads-menu-list-item href="#">採用</dads-menu-list-item>
        <dads-menu-list-item href="#">よくあるご質問</dads-menu-list-item>
        <dads-divider></dads-divider>
        <dads-menu-list-item href="#">プライバシーポリシー</dads-menu-list-item>
        <dads-menu-list-item href="#">ウェブアクセシビリティ</dads-menu-list-item>
        <dads-menu-list-item href="#">お問い合わせ</dads-menu-list-item>

        <dads-menu-list-item
          id="${languageTriggerId}"
          aria-controls="${languageSectionId}"
          aria-expanded="false"
          end-icon="caret"
        >
          ${MENU_ICON_LANGUAGE}
          Language
        </dads-menu-list-item>
        <dads-menu-list id="${languageSectionId}" indentation="1" hidden>
          <dads-menu-list-item>日本語</dads-menu-list-item>
          <dads-menu-list-item href="#">English</dads-menu-list-item>
        </dads-menu-list>
      </dads-menu-list>
    </dads-mobile-menu>
  `;
}

function renderDrilldownMenuMarkup(options: DrilldownMenuOptions): string {
  const sampleAttribute = options.sampleName ? ` data-mobile-menu-sample="${options.sampleName}"` : '';
  const rootAttributes = options.rootAttributes ? ` ${options.rootAttributes}` : '';
  const currentIdAttr = options.currentItemId ? ` id="${options.currentItemId}"` : '';
  const storyAttribute = options.storyId ? ` data-mobile-menu-story="${options.storyId}"` : '';
  const wideDividerStyle = options.dividerVariant === 'wide'
    ? ' style="--dads-mobile-menu-divider-margin-inline: var(--dads-mobile-menu-divider-margin-inline-wide);"'
    : '';
  const headingChip = options.withSectionChip ? '<span class="mobile-menu-demo__section-chip" aria-hidden="true"></span>' : '';
  const reportsHeadingClass = options.withSectionChip
    ? 'mobile-menu-demo__drilldown-section-title mobile-menu-demo__drilldown-section-title--with-chip'
    : 'mobile-menu-demo__drilldown-section-title';

  return `
    <dads-mobile-menu aria-label="グローバルメニュー"${sampleAttribute}${rootAttributes}${storyAttribute}${wideDividerStyle} data-mobile-menu-drilldown-root>
      <dads-utility-link slot="back" href="#" data-mobile-menu-drilldown-back hidden>
        ${BACK_ICON}
        <span data-mobile-menu-drilldown-back-label>戻る</span>
      </dads-utility-link>

      <div class="mobile-menu-demo__drilldown-panel" data-mobile-menu-drilldown-panel="root">
        <dads-menu-list>
          <dads-menu-list-item href="#">
            ${MENU_ICON_INFO}
            お知らせ
          </dads-menu-list-item>
          <dads-menu-list-item end-icon="arrow-right" data-drill-target="drill-reports">
            ${MENU_ICON_FOLDER}
            白書・統計・資料
            ${DRILLDOWN_RIGHT_ICON}
          </dads-menu-list-item>
          <dads-menu-list-item end-icon="arrow-right" data-drill-target="drill-application">
            ${MENU_ICON_APPLICATION}
            申請
            ${DRILLDOWN_RIGHT_ICON}
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            ${MENU_ICON_PERSON}
            採用
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            ${MENU_ICON_QUESTION}
            よくあるご質問
          </dads-menu-list-item>
          <dads-divider></dads-divider>
          <dads-menu-list-item href="#">
            プライバシーポリシー
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            ウェブアクセシビリティ
          </dads-menu-list-item>
          <dads-menu-list-item end-icon="arrow-right" data-drill-target="drill-contact">
            お問い合わせ
            ${DRILLDOWN_RIGHT_ICON}
          </dads-menu-list-item>
          <dads-menu-list-item end-icon="arrow-right" data-drill-target="drill-language">
            ${MENU_ICON_LANGUAGE}
            Language
            ${DRILLDOWN_RIGHT_ICON}
          </dads-menu-list-item>
          <dads-menu-list-item href="#">メニューアイテム</dads-menu-list-item>
        </dads-menu-list>
      </div>

      <div class="mobile-menu-demo__drilldown-panel" data-mobile-menu-drilldown-panel="drill-reports" data-mobile-menu-drilldown-title="白書・統計・資料" hidden>
        <p class="${reportsHeadingClass}">
          ${headingChip}
          <span>オンライン刊行物</span>
        </p>
        <dads-menu-list>
          <dads-menu-list-item href="#" tail-icon="new-window">
            白書
          </dads-menu-list-item>
          <dads-menu-list-item href="#">
            統計
          </dads-menu-list-item>
          <dads-menu-list-item${currentIdAttr} current>
            パンフレット・リーフレット・ポスター
          </dads-menu-list-item>
          <dads-menu-list-item href="#">資料</dads-menu-list-item>
        </dads-menu-list>
        <p class="${reportsHeadingClass}">
          ${headingChip}
          <span>予算・決算</span>
        </p>
        <dads-menu-list>
          <dads-menu-list-item href="#" tail-icon="new-window">令和5年度予算</dads-menu-list-item>
          <dads-menu-list-item href="#" tail-icon="new-window">令和4年度予算</dads-menu-list-item>
          <dads-menu-list-item href="#" tail-icon="new-window">令和3年度予算</dads-menu-list-item>
        </dads-menu-list>
      </div>

      <div class="mobile-menu-demo__drilldown-panel" data-mobile-menu-drilldown-panel="drill-application" data-mobile-menu-drilldown-title="申請" hidden>
        <p class="mobile-menu-demo__drilldown-section-title" data-mobile-menu-drilldown-heading>申請メニュー</p>
        <dads-menu-list>
          <dads-menu-list-item href="#">オンライン申請</dads-menu-list-item>
          <dads-menu-list-item href="#">申請状況の確認</dads-menu-list-item>
          <dads-menu-list-item href="#">必要書類</dads-menu-list-item>
        </dads-menu-list>
      </div>

      <div class="mobile-menu-demo__drilldown-panel" data-mobile-menu-drilldown-panel="drill-contact" data-mobile-menu-drilldown-title="お問い合わせ" hidden>
        <p class="mobile-menu-demo__drilldown-section-title" data-mobile-menu-drilldown-heading>お問い合わせ先</p>
        <dads-menu-list>
          <dads-menu-list-item href="#">お問い合わせフォーム</dads-menu-list-item>
          <dads-menu-list-item href="#">電話窓口</dads-menu-list-item>
          <dads-menu-list-item href="#" tail-icon="new-window">各府省の相談窓口</dads-menu-list-item>
        </dads-menu-list>
      </div>

      <div class="mobile-menu-demo__drilldown-panel" data-mobile-menu-drilldown-panel="drill-language" data-mobile-menu-drilldown-title="Language" hidden>
        <p class="mobile-menu-demo__drilldown-section-title" data-mobile-menu-drilldown-heading>Language</p>
        <dads-menu-list>
          <dads-menu-list-item>日本語</dads-menu-list-item>
          <dads-menu-list-item href="#">English</dads-menu-list-item>
        </dads-menu-list>
      </div>
    </dads-mobile-menu>
  `;
}

const API_MENU_MARKUP = renderAccordionMenuMarkup({
  idPrefix: 'mobile-menu-api-code',
  withBack: true,
  backLabel: '戻る',
});

const API_PREVIEW_MENU_MARKUP = renderAccordionMenuMarkup({
  idPrefix: 'mobile-menu-api-preview',
  withBack: true,
  backLabel: '戻る',
  backDataAttribute: 'data-mobile-menu-api-back-link',
  currentItemId: 'mobile-menu-api-current-item',
  sampleName: 'api-preview',
  rootAttributes: 'id="mobile-menu-api-target" data-api-target style="width: min(360px, 100%);"',
});

const LIVE_ACCORDION_MENU_MARKUP = renderAccordionMenuMarkup({
  idPrefix: 'mobile-menu-live-accordion',
  withBack: false,
  sampleName: 'live-accordion',
});

const LIVE_DRILLDOWN_MENU_MARKUP = renderDrilldownMenuMarkup({
  withSectionChip: true,
  sampleName: 'live-drilldown-chip',
  storyId: 'public-services',
});

const LIVE_RIGHT_MENU_MARKUP = renderDrilldownMenuMarkup({
  withSectionChip: true,
  sampleName: 'live-drilldown-right',
  storyId: 'public-services',
});

const LIVE_LEFT_MENU_MARKUP = renderDrilldownMenuMarkup({
  withSectionChip: true,
  sampleName: 'live-drilldown-left',
  dividerVariant: 'wide',
  storyId: 'public-services',
});

export const demos = {
  mobileMenu: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">モバイルメニュー</h2>
      <p style="color: #666; margin-bottom: 24px;">
        DADS / Figma に合わせ、<code>dads-menu-list</code> と <code>dads-menu-list-item</code> を再利用したモバイルメニューです。
        アコーディオン構成とドリルダウン構成を分離し、<code>current</code> は各メニューで1件のみ表示します。
      </p>

      <style>
        .mobile-menu-demo__surface {
          display: grid;
          place-content: center;
          padding: 24px;
          border: 1px dashed #e5e7eb;
          border-radius: 12px;
          background: #f8fafc;
        }

        .mobile-menu-demo__surface dads-mobile-menu {
          width: min(360px, 100%);
        }

        .mobile-menu-demo__live {
          display: grid;
          gap: 16px;
          margin-top: 40px;
        }

        .mobile-menu-demo__live-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }

        .mobile-menu-demo__mock {
          width: min(420px, 100%);
          margin: 0 auto;
          --dads-mobile-mock-frame-width: calc(402 / 16 * 1rem);
          --dads-mobile-mock-screen-background: #f5f5f5;
        }

        .mobile-menu-demo__mock-safe {
          position: relative;
          display: grid;
          grid-template-rows: auto 1fr;
          block-size: 100%;
          min-block-size: 100%;
          background: #f5f5f5;
        }

        .mobile-menu-demo__mock-header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          min-block-size: 68px;
          padding-inline: 16px;
          border-bottom: 1px solid #d1d5db;
          background: #ffffff;
        }

        .mobile-menu-demo__mock-header-title {
          margin: 0;
          margin-right: auto;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .mobile-menu-demo__floating-toggle {
          position: absolute;
          inset-block-start: 16px;
          inset-inline: 16px;
          z-index: 40;
          display: flex;
          pointer-events: none;
        }

        .mobile-menu-demo__floating-toggle--right {
          justify-content: flex-end;
        }

        .mobile-menu-demo__floating-toggle--left {
          justify-content: flex-start;
        }

        .mobile-menu-demo__floating-toggle dads-hamburger-menu-button {
          pointer-events: auto;
        }

        .mobile-menu-demo__mock-safe--floating-toggle .mobile-menu-demo__mock-body {
          padding-block-start: 84px;
        }

        .mobile-menu-demo__mock-safe--floating-toggle:has(.mobile-menu-demo__drawer[open]) .mobile-menu-demo__floating-toggle {
          display: none;
        }

        .mobile-menu-demo__mock-body {
          padding: 20px 16px;
          display: grid;
          gap: 12px;
          align-content: start;
          background: #f5f5f5;
        }

        .mobile-menu-demo__mock-kicker {
          margin: 0 0 4px;
          font-size: 14px;
          color: #4b5563;
        }

        .mobile-menu-demo__mock-card {
          block-size: 56px;
          border-radius: 10px;
          background: #e5e7eb;
        }

        .mobile-menu-demo__mock-card--wide {
          block-size: 88px;
        }

        .mobile-menu-demo__drawer {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          inline-size: 100%;
          block-size: 100%;
          --dads-drawer-width: 100%;
          --dads-drawer-max-width: 100%;
          --dads-drawer-border-width: 0;
          --dads-drawer-shadow: none;
          --dads-drawer-backdrop-background: transparent;
          --dads-drawer-content-padding-inline: 0;
          --dads-drawer-content-padding-block: 0;
          --dads-drawer-header-min-height: 68px;
          --dads-drawer-header-padding-inline: 16px;
        }

        .mobile-menu-demo__drawer--partial {
          --dads-drawer-width: calc(100% - 32px);
          --dads-drawer-max-width: calc(100% - 32px);
        }

        .mobile-menu-demo__drawer--no-header {
          --dads-drawer-header-min-height: 0;
        }

        .mobile-menu-demo__drawer[open] {
          pointer-events: auto;
        }

        .mobile-menu-demo__drawer::part(header) {
          border-bottom: 1px solid #d1d5db;
        }

        .mobile-menu-demo__drawer--no-header::part(header) {
          display: none;
        }

        .mobile-menu-demo__drawer-content-shell {
          display: grid;
          gap: 8px;
          padding: 12px 12px 0;
        }

        .mobile-menu-demo__drawer-close-row {
          display: flex;
          align-items: center;
          min-block-size: 44px;
          padding-inline: 4px;
        }

        .mobile-menu-demo__drawer-close-row--right {
          justify-content: flex-end;
        }

        .mobile-menu-demo__drawer-close-row--left {
          justify-content: flex-start;
        }

        .mobile-menu-demo__drawer-close-row dads-hamburger-menu-button {
          flex: 0 0 auto;
        }

        .mobile-menu-demo__drawer-content-shell dads-mobile-menu {
          --dads-mobile-menu-padding-inline: 4px;
        }

        .mobile-menu-demo__drawer::part(close-button) {
          border: 0;
          min-block-size: 44px;
          padding-inline: 12px;
        }

        .mobile-menu-demo__drawer::part(content) {
          padding: 0;
          background: #ffffff;
        }

        .mobile-menu-demo__drilldown-panel {
          display: grid;
          gap: 8px;
        }

        .mobile-menu-demo__drilldown-panel[hidden] {
          display: none;
        }

        .mobile-menu-demo__drilldown-heading {
          margin: 0;
          padding-inline: 16px;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          color: #1a1a1a;
        }

        .mobile-menu-demo__drilldown-section-title {
          margin: 0;
          padding-inline: 16px;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.35;
          color: #1a1a1a;
        }

        .mobile-menu-demo__drilldown-section-title--with-chip {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-menu-demo__section-chip {
          inline-size: 4px;
          block-size: 24px;
          border-radius: 2px;
          background: #005fcc;
          flex: 0 0 auto;
        }
      </style>

      ${renderAnnotationToggleBlock()}

      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader({ note: "注釈対象は <code>dads-mobile-menu</code> 本体です。アコーディオン開閉、外部リンク、区切り線、現在地表示を確認できます。" })}

        <a11y-annotate target-selector="dads-mobile-menu">
          <div class="mobile-menu-demo__surface">
            ${renderAccordionMenuMarkup({
              idPrefix: 'mobile-menu-a11y',
              withBack: false,
              sampleName: 'a11y-accordion',
            })}
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">ドリルダウン（2階層）プレビュー</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          親項目（右向きシェブロン）をクリックすると、常に1パネル表示で次の画面へ遷移します。
          戻るリンクでカテゴリ一覧に戻れます。
        </p>
        <div class="mobile-menu-demo__surface">
          ${renderDrilldownMenuMarkup({
            withSectionChip: true,
            sampleName: 'drilldown-preview',
          })}
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Preview は <code>dads-mobile-menu</code> 本体を直接ターゲットにしています。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-mobile-menu',
            'dads-menu-list',
            'dads-divider',
            'dads-utility-link',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div class="mobile-menu-demo__surface">
                ${API_PREVIEW_MENU_MARKUP}
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-hamburger-menu-button
                      command="show-modal"
                      commandfor="#mobile-menu-drawer"
                      aria-controls="mobile-menu-drawer"
                      aria-expanded="false"
                    ></dads-hamburger-menu-button>

                    <dads-drawer id="mobile-menu-drawer" placement="left" close-label="閉じる">
                      <span slot="title">メニュー</span>

                      ${API_MENU_MARKUP}
                    </dads-drawer>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>"グローバルメニュー"</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="aria-label"
                              value="グローバルメニュー"
                              data-api-attr="aria-label"
                              data-default="グローバルメニュー"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>nav ランドマーク名</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-labelledby</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="aria-labelledby"
                              value=""
                              data-api-attr="aria-labelledby"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル参照先ID</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>back slot</code></th>
                        <td><code>slot</code></td>
                        <td><code>back</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="back-slot"
                              data-api-attr="slot"
                              data-api-target-selector="[data-mobile-menu-api-back-link]"
                              data-default="back"
                            >
                              <option value="back" selected>slot=&quot;back&quot;</option>
                              <option value="">(unset)</option>
                            </select>
                          </div>
                        </td>
                        <td>L2戻る行の表示切替</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>open section</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="open-section"
                              data-api-attr="aria-expanded"
                              data-api-target-selector="#mobile-menu-api-preview-section-open-trigger"
                              data-default="true"
                            >
                              <option value="true" selected>true</option>
                              <option value="false">false</option>
                            </select>
                          </div>
                        </td>
                        <td>展開セクション（aria-controls連動）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>current item</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch
                              aria-label="current-item"
                              checked
                              data-api-attr="current"
                              data-api-target-selector="#mobile-menu-api-current-item"
                              data-default="true"
                            >
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>現在地ハイライト</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-width</code></th>
                        <td><code>100%</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-width" value="" data-api-css-var="--dads-mobile-menu-width" data-default=""></dads-input-text></div></td>
                        <td>メニュー幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-background</code></th>
                        <td><code>--color-neutral-white</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-background" value="" data-api-css-var="--dads-mobile-menu-background" data-default=""></dads-input-text></div></td>
                        <td>背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-border-color</code></th>
                        <td><code>--color-neutral-solid-gray-420</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-border-color" value="" data-api-css-var="--dads-mobile-menu-border-color" data-default=""></dads-input-text></div></td>
                        <td>枠線色 / 区切り線色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-border-width</code></th>
                        <td><code>1px</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-border-width" value="" data-api-css-var="--dads-mobile-menu-border-width" data-default=""></dads-input-text></div></td>
                        <td>枠線幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-divider-margin-inline</code></th>
                        <td><code>--spacing-4</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-divider-margin-inline" value="" data-api-css-var="--dads-mobile-menu-divider-margin-inline" data-default=""></dads-input-text></div></td>
                        <td>区切り線の左右余白（標準）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-divider-margin-inline-wide</code></th>
                        <td><code>--spacing-8</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-divider-margin-inline-wide" value="" data-api-css-var="--dads-mobile-menu-divider-margin-inline-wide" data-default=""></dads-input-text></div></td>
                        <td>区切り線の左右余白（ワイド）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-padding-block</code></th>
                        <td><code>--spacing-4</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-padding-block" value="" data-api-css-var="--dads-mobile-menu-padding-block" data-default=""></dads-input-text></div></td>
                        <td>上下余白</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-padding-inline</code></th>
                        <td><code>0</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-padding-inline" value="" data-api-css-var="--dads-mobile-menu-padding-inline" data-default=""></dads-input-text></div></td>
                        <td>左右余白</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-back-padding-inline</code></th>
                        <td><code>--spacing-4</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-back-padding-inline" value="" data-api-css-var="--dads-mobile-menu-back-padding-inline" data-default=""></dads-input-text></div></td>
                        <td>戻る行 左右余白</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-back-padding-block-start</code></th>
                        <td><code>--spacing-4</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-back-padding-block-start" value="" data-api-css-var="--dads-mobile-menu-back-padding-block-start" data-default=""></dads-input-text></div></td>
                        <td>戻る行 上余白</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-mobile-menu-back-padding-block-end</code></th>
                        <td><code>--spacing-6</code></td>
                        <td><div class="wc-api-control"><dads-input-text label="--dads-mobile-menu-back-padding-block-end" value="" data-api-css-var="--dads-mobile-menu-back-padding-block-end" data-default=""></dads-input-text></div></td>
                        <td>戻る行 下余白</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <section class="mobile-menu-demo__live">
        <h3 style="font-size: 20px; color: #333;">実画面作例（モバイルモック + ハンバーガーメニューボタン）</h3>
        <p style="font-size: 14px; color: #666; margin: 0;">
          A/Bを維持した上で、C（右）/D（左）も同じ情報ストーリーで実クリック遷移できるようにしています。
        </p>

        <div class="mobile-menu-demo__live-grid">
          <div id="mobile-menu-live-accordion-root" class="mobile-menu-demo__mock">
            <h4 style="font-size: 16px; margin: 0 0 10px; color: #333;">A. アコーディオン構成</h4>
            <dads-mobile-mock class="mobile-menu-demo__mock">
              <div class="mobile-menu-demo__mock-safe">
                <div class="mobile-menu-demo__mock-header">
                  <p class="mobile-menu-demo__mock-header-title">ホーム</p>
                  <dads-hamburger-menu-button
                    id="mobile-menu-live-accordion-trigger"
                    data-mobile-menu-live-trigger
                    variant="standard"
                    type="menu"
                    command="show-modal"
                    commandfor="#mobile-menu-live-accordion-drawer"
                    aria-controls="mobile-menu-live-accordion-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>
                </div>
                ${MOCK_BODY_PLACEHOLDER}

                <dads-drawer
                  id="mobile-menu-live-accordion-drawer"
                  data-mobile-menu-live-drawer
                  class="mobile-menu-demo__drawer"
                  data-preview-contained
                  placement="left"
                  close-label="閉じる"
                >
                  <span slot="title">メニュー</span>
                  ${LIVE_ACCORDION_MENU_MARKUP}
                </dads-drawer>
              </div>
            </dads-mobile-mock>
          </div>

          <div id="mobile-menu-live-drilldown-root" class="mobile-menu-demo__mock">
            <h4 style="font-size: 16px; margin: 0 0 10px; color: #333;">B. ドリルダウン（2階層）+ chip</h4>
            <dads-mobile-mock class="mobile-menu-demo__mock">
              <div class="mobile-menu-demo__mock-safe">
                <div class="mobile-menu-demo__mock-header">
                  <p class="mobile-menu-demo__mock-header-title">ホーム</p>
                  <dads-hamburger-menu-button
                    id="mobile-menu-live-drilldown-trigger"
                    data-mobile-menu-live-trigger
                    variant="standard"
                    type="menu"
                    command="show-modal"
                    commandfor="#mobile-menu-live-drilldown-drawer"
                    aria-controls="mobile-menu-live-drilldown-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>
                </div>
                ${MOCK_BODY_PLACEHOLDER}

                <dads-drawer
                  id="mobile-menu-live-drilldown-drawer"
                  data-mobile-menu-live-drawer
                  class="mobile-menu-demo__drawer"
                  data-preview-contained
                  placement="left"
                  close-label="閉じる"
                >
                  <span slot="title">メニュー</span>
                  ${LIVE_DRILLDOWN_MENU_MARKUP}
                </dads-drawer>
              </div>
            </dads-mobile-mock>
          </div>

          <div
            id="mobile-menu-live-right-root"
            class="mobile-menu-demo__mock"
            data-mobile-menu-single-toggle-button
          >
            <h4 style="font-size: 16px; margin: 0 0 10px; color: #333;">C. 右タイプ（実クリック遷移 / divider 16px）</h4>
            <dads-mobile-mock class="mobile-menu-demo__mock">
              <div class="mobile-menu-demo__mock-safe mobile-menu-demo__mock-safe--floating-toggle">
                <div class="mobile-menu-demo__floating-toggle mobile-menu-demo__floating-toggle--right">
                  <dads-hamburger-menu-button
                    id="mobile-menu-live-right-trigger"
                    data-mobile-menu-live-trigger
                    variant="icon"
                    type="menu"
                    command="show-modal"
                    commandfor="#mobile-menu-live-right-drawer"
                    aria-controls="mobile-menu-live-right-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>
                </div>
                ${MOCK_BODY_PLACEHOLDER}

                <dads-drawer
                  id="mobile-menu-live-right-drawer"
                  data-mobile-menu-live-drawer
                  class="mobile-menu-demo__drawer mobile-menu-demo__drawer--partial mobile-menu-demo__drawer--no-header"
                  data-preview-contained
                  placement="right"
                  close-label="閉じる"
                >
                  <div class="mobile-menu-demo__drawer-content-shell">
                    <div class="mobile-menu-demo__drawer-close-row mobile-menu-demo__drawer-close-row--right">
                      <dads-hamburger-menu-button
                        id="mobile-menu-live-right-close-trigger"
                        data-mobile-menu-live-close-trigger
                        variant="icon"
                        type="close"
                        command="close"
                        commandfor="#mobile-menu-live-right-drawer"
                        aria-controls="mobile-menu-live-right-drawer"
                        aria-expanded="false"
                      ></dads-hamburger-menu-button>
                    </div>
                    ${LIVE_RIGHT_MENU_MARKUP}
                  </div>
                </dads-drawer>
              </div>
            </dads-mobile-mock>
          </div>

          <div
            id="mobile-menu-live-left-root"
            class="mobile-menu-demo__mock"
            data-mobile-menu-single-toggle-button
          >
            <h4 style="font-size: 16px; margin: 0 0 10px; color: #333;">D. 左タイプ（実クリック遷移 / divider 32px）</h4>
            <dads-mobile-mock class="mobile-menu-demo__mock">
              <div class="mobile-menu-demo__mock-safe mobile-menu-demo__mock-safe--floating-toggle">
                <div class="mobile-menu-demo__floating-toggle mobile-menu-demo__floating-toggle--left">
                  <dads-hamburger-menu-button
                    id="mobile-menu-live-left-trigger"
                    data-mobile-menu-live-trigger
                    variant="icon"
                    type="menu"
                    command="show-modal"
                    commandfor="#mobile-menu-live-left-drawer"
                    aria-controls="mobile-menu-live-left-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>
                </div>
                ${MOCK_BODY_PLACEHOLDER}

                <dads-drawer
                  id="mobile-menu-live-left-drawer"
                  data-mobile-menu-live-drawer
                  class="mobile-menu-demo__drawer mobile-menu-demo__drawer--partial mobile-menu-demo__drawer--no-header"
                  data-preview-contained
                  placement="left"
                  close-label="閉じる"
                >
                  <div class="mobile-menu-demo__drawer-content-shell">
                    <div class="mobile-menu-demo__drawer-close-row mobile-menu-demo__drawer-close-row--left">
                      <dads-hamburger-menu-button
                        id="mobile-menu-live-left-close-trigger"
                        data-mobile-menu-live-close-trigger
                        variant="icon"
                        type="close"
                        command="close"
                        commandfor="#mobile-menu-live-left-drawer"
                        aria-controls="mobile-menu-live-left-drawer"
                        aria-expanded="false"
                      ></dads-hamburger-menu-button>
                    </div>
                    ${LIVE_LEFT_MENU_MARKUP}
                  </div>
                </dads-drawer>
              </div>
            </dads-mobile-mock>
          </div>
        </div>
      </section>

      <script>
        (function() {
          var currentScript = document.currentScript;
          var liveRootIds = [
            'mobile-menu-live-accordion-root',
            'mobile-menu-live-drilldown-root',
            'mobile-menu-live-right-root',
            'mobile-menu-live-left-root',
          ];

          var eachLiveRoot = function(hostRoot, fn) {
            liveRootIds.forEach(function(rootId) {
              var root = hostRoot.querySelector('#' + rootId);
              if (!root) return;
              fn(root);
            });
          };

          var findFromPath = function(event, hostRoot, matcher) {
            var path = typeof event.composedPath === 'function' ? event.composedPath() : [];
            for (var i = 0; i < path.length; i += 1) {
              var node = path[i];
              if (node === hostRoot) break;
              if (!(node instanceof HTMLElement)) continue;
              if (!hostRoot.contains(node)) continue;
              if (matcher(node)) return node;
            }

            var target = event.target;
            if (!(target instanceof Element)) return null;
            var fallback = target.closest('[data-drill-target],[data-mobile-menu-drilldown-back]');
            if (!(fallback instanceof HTMLElement)) return null;
            if (!hostRoot.contains(fallback)) return null;
            return matcher(fallback) ? fallback : null;
          };

          var bindDrilldownMenu = function(menuRoot) {
            if (menuRoot.hasAttribute('data-mobile-menu-drilldown-bound')) return;

            var panels = Array.prototype.slice.call(
              menuRoot.querySelectorAll('[data-mobile-menu-drilldown-panel]')
            );
            if (!panels.length) return;

            var panelMap = {};
            panels.forEach(function(panel) {
              var panelId = panel.getAttribute('data-mobile-menu-drilldown-panel');
              if (panelId) panelMap[panelId] = panel;
            });

            var backLink = menuRoot.querySelector('[data-mobile-menu-drilldown-back]');
            var backLabel = menuRoot.querySelector('[data-mobile-menu-drilldown-back-label]');
            var history = [];
            var activePanelId = 'root';

            var getPanelTitle = function(panelId) {
              var panel = panelMap[panelId];
              if (!panel) return '';
              var attrTitle = panel.getAttribute('data-mobile-menu-drilldown-title');
              if (attrTitle) return attrTitle;
              var heading = panel.querySelector('[data-mobile-menu-drilldown-heading]');
              if (!(heading instanceof HTMLElement)) return '';
              return (heading.textContent || '').trim();
            };

            var syncBackLabel = function(panelId) {
              if (!(backLabel instanceof HTMLElement)) return;
              if (panelId === 'root') {
                backLabel.textContent = '戻る';
                return;
              }
              var title = getPanelTitle(panelId);
              backLabel.textContent = title || '戻る';
            };

            var showPanel = function(panelId) {
              var nextPanel = panelMap[panelId];
              if (!nextPanel) return false;

              panels.forEach(function(panel) {
                panel.toggleAttribute('hidden', panel !== nextPanel);
              });

              activePanelId = panelId;
              menuRoot.setAttribute('data-mobile-menu-drilldown-active', panelId);

              if (backLink instanceof HTMLElement) {
                backLink.toggleAttribute('hidden', panelId === 'root');
              }

              return true;
            };

            var resetDrilldown = function() {
              history.length = 0;
              showPanel('root');
              syncBackLabel('root');
            };

            menuRoot.setAttribute('data-mobile-menu-drilldown-bound', 'true');
            menuRoot.__resetMobileMenuDrilldown = resetDrilldown;
            resetDrilldown();

            menuRoot.addEventListener('click', function(event) {
              var backTrigger = findFromPath(event, menuRoot, function(node) {
                return node.hasAttribute('data-mobile-menu-drilldown-back');
              });
              if (backTrigger) {
                event.preventDefault();
                var previousPanelId = history.pop();
                if (!previousPanelId) {
                  resetDrilldown();
                  return;
                }

                showPanel(previousPanelId);
                syncBackLabel(previousPanelId);
                return;
              }

              var trigger = findFromPath(event, menuRoot, function(node) {
                return node.hasAttribute('data-drill-target');
              });
              if (!trigger) return;

              var targetPanelId = trigger.getAttribute('data-drill-target');
              if (!targetPanelId || !panelMap[targetPanelId]) return;

              event.preventDefault();
              history.push(activePanelId);
              showPanel(targetPanelId);
              syncBackLabel(targetPanelId);
            });
          };

          var bindAllDrilldownMenus = function(scope) {
            var roots = scope.querySelectorAll('[data-mobile-menu-drilldown-root]');
            roots.forEach(function(root) {
              if (!(root instanceof HTMLElement)) return;
              bindDrilldownMenu(root);
            });
          };

          var initialHostRoot = currentScript && currentScript.parentElement;
          if (initialHostRoot && initialHostRoot.isConnected) {
            bindAllDrilldownMenus(initialHostRoot);
          }

          import('./packages/utils/command-store.js').then(function(mod) {
            var hostRoot = currentScript && currentScript.parentElement;
            if (!hostRoot || !hostRoot.isConnected) return;
            if (!mod || !mod.defaultCommandStore || !mod.defaultCommandStore.bind) return;

            bindAllDrilldownMenus(hostRoot);

            eachLiveRoot(hostRoot, function(liveRoot) {
              if (liveRoot.hasAttribute('data-mobile-menu-command-store-bound')) return;
              liveRoot.setAttribute('data-mobile-menu-command-store-bound', 'true');
              mod.defaultCommandStore.bind(liveRoot);
            });
          });

          customElements.whenDefined('dads-drawer').then(function() {
            var hostRoot = currentScript && currentScript.parentElement;
            if (!hostRoot || !hostRoot.isConnected) return;

            eachLiveRoot(hostRoot, function(liveRoot) {
              if (liveRoot.hasAttribute('data-mobile-menu-live-events-bound')) return;

              var drawer = liveRoot.querySelector('[data-mobile-menu-live-drawer]');
              var trigger = liveRoot.querySelector('[data-mobile-menu-live-trigger]');
              var closeTrigger = liveRoot.querySelector('[data-mobile-menu-live-close-trigger]');
              if (!drawer || !trigger) return;

              liveRoot.setAttribute('data-mobile-menu-live-events-bound', 'true');
              var usesToggleButton = liveRoot.hasAttribute('data-mobile-menu-single-toggle-button');

              var setTriggerState = function(isOpen) {
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                if (usesToggleButton) {
                  trigger.toggleAttribute('hidden', isOpen);
                  if (closeTrigger instanceof HTMLElement) {
                    closeTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                  }
                  return;
                }

                trigger.setAttribute('type', 'menu');
                queueMicrotask(function() {
                  trigger.setAttribute('command', 'show-modal');
                });
                trigger.toggleAttribute('hidden', isOpen);
              };

              drawer.addEventListener('dads-drawer-open', function() {
                setTriggerState(true);
                bindAllDrilldownMenus(liveRoot);
                var drilldownMenu = liveRoot.querySelector('[data-mobile-menu-drilldown-root]');
                if (drilldownMenu && typeof drilldownMenu.__resetMobileMenuDrilldown === 'function') {
                  drilldownMenu.__resetMobileMenuDrilldown();
                }
              });

              drawer.addEventListener('dads-drawer-close', function() {
                setTriggerState(false);
              });

              setTriggerState(drawer.hasAttribute('open'));
            });
          });
        })();
      <\/script>

      ${modulePreloadScript([
        'a11y-annotate',
        'dads-mobile-menu',
        'dads-menu-list',
        'dads-divider',
        'dads-drawer',
        'dads-mobile-mock',
        'dads-hamburger-menu-button',
        'dads-utility-link',
      ])}
    </div>
  `,
};
