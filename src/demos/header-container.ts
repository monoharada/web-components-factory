import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  MENU_LIST_BOX_DUMMY_START_ICON_SVG,
  annotationToggleScript,
  annotationToggleUI,
  modulePreloadScript,
  renderApiPanelWrapper,
} from './shared.js';
import { createIconWithSlot } from '../../packages/utils/icons.js';

type HeaderMenuItemSpec = string | {
  label: string;
  current?: boolean;
  href?: string;
  startIcon?: boolean;
  submenu?: string[];
};

type HeaderUtilityLinkSpec = {
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean;
  leadIcon?: HeaderUtilityLeadIcon;
};

type HeaderUtilityLeadIcon = 'login' | 'logout';

const HEADER_CONTAINER_MENU_ANNOTATE: HeaderMenuItemSpec[] = ['ホーム', '申請一覧', '進捗管理', '台帳連携', '監査ログ'];
const HEADER_CONTAINER_MENU_API: HeaderMenuItemSpec[] = ['ダッシュボード', '案件一覧', '帳票', '設定'];
const HEADER_CONTAINER_MENU_API_USAGE: HeaderMenuItemSpec[] = ['ダッシュボード', '案件一覧', '帳票'];
const HEADER_CONTAINER_MENU_WIDE_FULL: HeaderMenuItemSpec[] = [
  'ダッシュボード',
  {
    label: '共通申請',
    startIcon: true,
    submenu: ['手続き検索', '新規申請', '申請状況'],
  },
  'データ連携',
  '監査・証跡',
  '設定',
];
const HEADER_CONTAINER_MENU_WIDE_SLIM: HeaderMenuItemSpec[] = ['手続き検索', '申請履歴', '通知'];
const HEADER_CONTAINER_MENU_THEME_LOCAL: HeaderMenuItemSpec[] = [
  {
    label: '住民票',
    startIcon: true,
    submenu: ['交付申請', '異動届', '履歴照会'],
  },
  '税務',
  '福祉',
  '収納',
];
const HEADER_CONTAINER_MENU_THEME_PORTAL: HeaderMenuItemSpec[] = ['手続き検索', '電子申請', '通知一覧', '問い合わせ'];
const HEADER_CONTAINER_MENU_THEME_CROSS: HeaderMenuItemSpec[] = [
  {
    label: 'サービス稼働',
    startIcon: true,
    submenu: ['稼働状況', '障害一覧', 'メンテナンス予定'],
  },
  '省庁KPI',
  '横断アラート',
  '監査証跡',
];

const HEADER_CONTAINER_UTILITY_LINKS_ANNOTATE: HeaderUtilityLinkSpec[] = [
  { label: 'ヘルプ' },
  { label: 'ログアウト' },
];

const HEADER_CONTAINER_UTILITY_LINKS_API: HeaderUtilityLinkSpec[] = [
  { label: 'サインアウト' },
];

const HEADER_CONTAINER_UTILITY_LINKS_USAGE: HeaderUtilityLinkSpec[] = [
  { label: 'ヘルプ' },
  { label: 'ログアウト' },
];

const HEADER_CONTAINER_UTILITY_LINKS_WIDE_FULL: HeaderUtilityLinkSpec[] = [
  { label: 'ヘルプデスク' },
  { label: '職員ポータル' },
  { label: 'ログアウト' },
];

const HEADER_CONTAINER_UTILITY_LINKS_WIDE_SLIM: HeaderUtilityLinkSpec[] = [
  { label: 'よくある質問' },
];

const HEADER_CONTAINER_UTILITY_LINKS_TABLET: HeaderUtilityLinkSpec[] = [
  { label: 'ヘルプ' },
  { label: 'ログイン' },
];

const HEADER_CONTAINER_UTILITY_LINKS_THEME_LOCAL: HeaderUtilityLinkSpec[] = [
  { label: '総合ヘルプ' },
  { label: 'ログアウト' },
];

const HEADER_CONTAINER_UTILITY_LINKS_THEME_PORTAL: HeaderUtilityLinkSpec[] = [
  { label: 'ログイン' },
  { label: 'ご利用ガイド' },
];

const HEADER_CONTAINER_UTILITY_LINKS_THEME_CROSS: HeaderUtilityLinkSpec[] = [
  { label: 'SLA' },
  { label: '障害一次連絡' },
  { label: '運用日誌' },
];

const HEADER_CONTAINER_UTILITY_LEAD_ICONS: Record<HeaderUtilityLeadIcon, string> = {
  login: createIconWithSlot('login', 'lead-icon', 16),
  logout: createIconWithSlot('logout', 'lead-icon', 16),
};

const inferUtilityLeadIcon = (label: string): HeaderUtilityLeadIcon | undefined => {
  if (label.includes('サインアウト') || label.includes('ログアウト')) return 'logout';
  if (label.includes('ログイン')) return 'login';
  return undefined;
};

const renderUtilityLink = (item: HeaderUtilityLinkSpec): string => {
  const hrefAttr = ` href="${item.href ?? '#'}"`;
  const targetAttr = item.target ? ` target="${item.target}"` : '';
  const relAttr = item.rel ? ` rel="${item.rel}"` : '';
  const downloadAttr = item.download ? ' download' : '';
  const leadIconKey = item.leadIcon ?? inferUtilityLeadIcon(item.label);
  const leadIcon = leadIconKey ? HEADER_CONTAINER_UTILITY_LEAD_ICONS[leadIconKey] : '';
  return `<dads-utility-link${hrefAttr}${targetAttr}${relAttr}${downloadAttr}>${leadIcon}${item.label}</dads-utility-link>`;
};

const renderUtilityLinks = (items: HeaderUtilityLinkSpec[]): string =>
  items.map((item) => renderUtilityLink(item)).join('\n');

const renderGlobalMenuItem = (item: HeaderMenuItemSpec, index: number, currentIndex: number): string => {
  if (typeof item === 'string') {
    return `<dads-global-menu-item href="#"${index === currentIndex ? ' current' : ''}>${item}</dads-global-menu-item>`;
  }

  const isCurrent = item.current ?? index === currentIndex;
  const currentAttr = isCurrent ? ' current' : '';
  const icon = item.startIcon ? MENU_LIST_BOX_DUMMY_START_ICON_SVG : '';

  if (item.submenu && item.submenu.length > 0) {
    const submenu = item.submenu.map((subItem) => `<dads-menu-list-item>${subItem}</dads-menu-list-item>`).join('\n');
    return `<dads-global-menu-item${currentAttr}>${icon}${item.label}
      <dads-menu-list-box label="${item.label}">
        ${submenu}
      </dads-menu-list-box>
    </dads-global-menu-item>`;
  }

  return `<dads-global-menu-item href="${item.href ?? '#'}"${currentAttr}>${icon}${item.label}</dads-global-menu-item>`;
};

const renderGlobalMenuItems = (items: HeaderMenuItemSpec[], currentIndex = 0): string =>
  items.map((item, index) => renderGlobalMenuItem(item, index, currentIndex)).join('\n');

const renderHeaderGlobalMenu = (items: HeaderMenuItemSpec[]): string => `
  <dads-global-menu slot="global-menu" class="header-container-demo__global-menu" aria-label="グローバルメニュー">
    ${renderGlobalMenuItems(items)}
  </dads-global-menu>
`;

const HEADER_CONTAINER_LANGUAGE_SELECTOR_ITEMS = `
  <dads-menu-list-item data-value="ja" current>日本語</dads-menu-list-item>
  <dads-menu-list-item data-value="en">English</dads-menu-list-item>
`;

const HEADER_CONTAINER_LANGUAGE_SELECTOR_TEXT = `
  <dads-language-selector class="header-container-demo__language-selector" size="sm" opener="text">
    ${HEADER_CONTAINER_LANGUAGE_SELECTOR_ITEMS}
  </dads-language-selector>
`;

const HEADER_CONTAINER_LANGUAGE_SELECTOR_ICON = `
  <dads-language-selector class="header-container-demo__language-selector" size="sm" opener="icon">
    ${HEADER_CONTAINER_LANGUAGE_SELECTOR_ITEMS}
  </dads-language-selector>
`;

const HEADER_CONTAINER_MOBILE_MENU_ITEMS = Array.from(
  { length: 7 },
  (_, index) => `<li><a href="#">モバイルメニュー ${index + 1}</a></li>`,
).join('\n');

const HEADER_CONTAINER_MOBILE_DRAWER_CONTENT = `
  <nav aria-label="モバイルメニュー">
    <ul class="header-container-demo__mobile-drawer-menu">
      ${HEADER_CONTAINER_MOBILE_MENU_ITEMS}
    </ul>
  </nav>
`;

export const demos = {
  headerContainer: () => `
    <div style="padding: 40px; max-width: 1440px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ヘッダーコンテナ</h2>
      <p style="color: #666; margin-bottom: 24px;">
        DADSの Header Container をベースに、
        <code>mode="auto|wide-full|wide-slim|medium|compact"</code> で
        desktop / tablet / mobile の構成を切り替えるレイアウトコンテナです。
      </p>

      <style>
        .header-container-demo__surface {
          overflow: visible;
          background: #f8fafc;
        }

        .header-container-demo__surface + .header-container-demo__surface {
          margin-top: 20px;
        }

        .header-container-demo__logo-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          line-height: 1.4;
          font-weight: 700;
          color: #172554;
          text-decoration: none;
          border-radius: 0.5rem;
        }

        .header-container-demo__logo-link:focus-visible {
          outline: var(--dads-focus-outline-width, 0.25rem) solid
            var(--dads-focus-outline-color, var(--color-neutral-black, #000000));
          outline-offset: var(--dads-focus-outline-offset, 0.125rem);
          background-color: var(--dads-focus-text-element-bg, var(--color-primitive-yellow-300, #ffd43d));
          box-shadow: 0 0 0 var(--dads-focus-ring-width, 0.125rem)
            var(--dads-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
          text-decoration: none;
        }

        .header-container-demo__logo-mark {
          display: inline-block;
          inline-size: 14px;
          block-size: 14px;
          border-radius: 999px;
          background: #1d4ed8;
        }

        .header-container-demo__utility-links {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: #475569;
        }

        .header-container-demo__utility-links dads-utility-link {
          display: inline-flex;
          align-items: center;
          --dads-utility-link-font-size: inherit;
          --dads-utility-link-line-height: inherit;
        }

        .header-container-demo__language-selector {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
        }

        .header-container-demo__language-selector::part(popup) {
          left: auto;
          right: 0;
        }

        .header-container-demo__global-menu {
          display: block;
          inline-size: 100%;
          --dads-global-menu-border-color: transparent;
        }

        .header-container-demo__layout-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 1fr);
        }

        .header-container-demo__layout-card {
          display: grid;
          gap: 10px;
        }

        .header-container-demo__layout-device {
          display: block;
          inline-size: 100%;
          --dads-device-mock-visible-height: calc(220 / 16 * 1rem);
          --dads-device-mock-screen-background: #f8fafc;
        }

        .header-container-demo__layout-title {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #1e3a8a;
        }

        .header-container-demo__layout-note {
          margin: 0;
          font-size: 12px;
          color: #475569;
        }

        .header-container-demo__mobile-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 1fr);
        }

        .header-container-demo__mobile-card {
          display: grid;
          gap: 12px;
          min-width: 0;
        }

        .header-container-demo__mobile-card-title {
          margin: 0;
          font-size: 16px;
          line-height: 1.2;
          color: #1976d2;
          font-weight: 700;
        }

        .header-container-demo__mobile-root {
          display: flex;
          justify-content: center;
          padding: 0;
          border: 0;
          border-radius: 0;
          background: transparent;
        }

        .header-container-demo__mobile-mock {
          display: block;
          inline-size: min(100%, calc(405 / 16 * 1rem));
          margin-inline: auto;
          --dads-device-mock-frame-width: calc(405 / 16 * 1rem);
          --dads-device-mock-screen-background: #f5f5f5;
        }

        .header-container-demo__mobile-safe-area {
          position: relative;
          min-block-size: 100%;
          block-size: 100%;
          background: #f5f5f5;
        }

        .header-container-demo__mobile-trigger-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .header-container-demo__mobile-trigger-layer .header-container-demo__mobile-header {
          pointer-events: auto;
        }

        .header-container-demo__mobile-header {
          --dads-header-container-inline-padding: 16px;
          --dads-header-container-primary-min-block-size: 80px;
          --dads-header-container-primary-padding-block: 0;
          --dads-header-container-border-color: #111827;
        }

        .header-container-demo__mobile-drawer {
          --dads-drawer-header-min-height: 80px;
          --dads-drawer-header-padding-inline: 16px;
          --dads-drawer-content-padding-inline: 16px;
          --dads-drawer-content-padding-block: 16px;
        }

        .header-container-demo__mobile-drawer--fullscreen {
          --dads-drawer-width: 100%;
          --dads-drawer-max-width: 100%;
          --dads-drawer-border-width: 0;
          --dads-drawer-shadow: none;
          --dads-drawer-backdrop-background: transparent;
        }

        .header-container-demo__mobile-drawer::part(base) {
          z-index: 0;
        }

        .header-container-demo__mobile-drawer::part(header) {
          border-top: 1px dashed #111827;
          border-bottom: 1px dashed #111827;
        }

        .header-container-demo__mobile-drawer-menu {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .header-container-demo__mobile-drawer-menu a {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding-inline: 8px;
          color: #111827;
          text-decoration: none;
          border-radius: 8px;
        }

        .header-container-demo__mobile-drawer-menu a:hover {
          background: #e2e8f0;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .header-container-demo__theme-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 1fr);
        }

        .header-container-demo__theme-card {
          display: grid;
        }

        .header-container-demo__theme-mock {
          display: block;
          inline-size: 100%;
          --dads-device-mock-frame-width: 100%;
          --dads-device-mock-screen-background: #fff;
        }

        .header-container-demo__theme-surface {
          display: block;
          background: #fff;
        }

      </style>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ レイアウトの責務を持つコンテナとして、主要パーツ（logo / utility / menu / hamburger）の役割を注釈で確認します。
        </p>
        <a11y-annotate
          target-selector="#header-container-annotate-target"
          callout-lane="side"
          style="
            --a11y-annotate-callout-gutter: 112px;
            --a11y-annotate-callout-lane-offset: 52px;
            --a11y-annotate-callout-lane-gap: 16px;
            --a11y-annotate-callout-anchor-corner-margin: 14px;
          "
        >
          <div class="header-container-demo__surface">
            <dads-header-container
              id="header-container-annotate-target"
              mode="wide-full"
              aria-label="自治体業務システムヘッダー"
            >
              <a slot="logo" class="header-container-demo__logo-link" href="#">
                <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                住基業務システム
              </a>
              <div slot="utility" class="header-container-demo__utility-links">
                ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_ANNOTATE)}
              </div>
              ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_ANNOTATE)}
            </dads-header-container>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          <code>mode</code> と主要 CSS vars を変更し、desktop/tablet/mobile の切り替えを確認できます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-header-container',
            'dads-hamburger-menu-button',
            'dads-drawer',
            'dads-language-selector',
            'dads-global-menu',
            'dads-global-menu-item',
            'dads-utility-link',
          ],
          rootAttrs: 'data-api-strip-attrs="id data-preview-contained"',
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div class="header-container-demo__surface" data-header-container-demo-root>
                <dads-header-container
                  id="header-container-api-target"
                  data-api-target
                  mode="auto"
                  aria-label="行政情報システムヘッダー"
                >
                  <a slot="logo" class="header-container-demo__logo-link" href="#">
                    <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                    行政情報システム
                  </a>
                  <div slot="utility" class="header-container-demo__utility-links">
                    ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_API)}
                    ${HEADER_CONTAINER_LANGUAGE_SELECTOR_TEXT}
                  </div>
                  ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_API)}
                  <dads-hamburger-menu-button
                    id="header-container-api-trigger"
                    slot="hamburger-menu"
                    variant="standard"
                    type="menu"
                    lang="ja"
                    command="show-modal"
                    commandfor="#header-container-api-drawer"
                    aria-controls="header-container-api-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>
                </dads-header-container>

                <dads-drawer
                  id="header-container-api-drawer"
                  data-preview-contained
                  placement="left"
                  close-label="閉じる"
                >
                  <span slot="title">メニュー</span>
                  <nav aria-label="プレビュー用メニュー">
                    <ul class="header-container-demo__mobile-drawer-menu">
                      <li><a href="#">ダッシュボード</a></li>
                      <li><a href="#">案件一覧</a></li>
                      <li><a href="#">帳票</a></li>
                      <li><a href="#">設定</a></li>
                    </ul>
                  </nav>
                </dads-drawer>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-header-container mode="auto" aria-label="行政情報システムヘッダー">
                      <a slot="logo" href="#">行政情報システム</a>

                      <div slot="utility">
                        ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_USAGE)}
                      </div>

                      ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_API_USAGE)}

                      <dads-hamburger-menu-button
                        slot="hamburger-menu"
                        variant="standard"
                        type="menu"
                        lang="ja"
                        command="show-modal"
                        commandfor="#global-nav"
                        aria-controls="global-nav"
                        aria-expanded="false"
                      ></dads-hamburger-menu-button>
                    </dads-header-container>

                    <dads-drawer id="global-nav" placement="left" close-label="閉じる">
                      <span slot="title">メニュー</span>
                      <nav aria-label="モバイルメニュー">...</nav>
                    </dads-drawer>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <script>
              (function() {
                var currentScript = document.currentScript;
                import('./packages/utils/command-store.js').then(function(mod) {
                  var apiPanel =
                    (currentScript && currentScript.closest('.wc-api-panel')) ||
                    (currentScript && currentScript.parentElement);
                  if (!apiPanel || !apiPanel.isConnected) return;
                  if (!mod || !mod.defaultCommandStore || !mod.defaultCommandStore.bind) return;

                  var demoRoot = apiPanel.querySelector('[data-header-container-demo-root]');
                  if (!demoRoot) return;
                  if (!demoRoot.hasAttribute('data-header-container-api-command-store-bound')) {
                    demoRoot.setAttribute('data-header-container-api-command-store-bound', 'true');
                    mod.defaultCommandStore.bind(demoRoot);
                  }

                  var drawer = demoRoot.querySelector('#header-container-api-drawer');
                  var trigger = demoRoot.querySelector('#header-container-api-trigger');
                  if (!drawer || !trigger) return;
                  if (demoRoot.hasAttribute('data-header-container-api-events-bound')) return;
                  demoRoot.setAttribute('data-header-container-api-events-bound', 'true');

                  var syncTrigger = function(isOpen) {
                    trigger.setAttribute('type', isOpen ? 'close' : 'menu');
                    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    queueMicrotask(function() {
                      trigger.setAttribute('command', isOpen ? 'close' : 'show-modal');
                    });
                  };

                  drawer.addEventListener('dads-drawer-open', function() {
                    syncTrigger(true);
                  });
                  drawer.addEventListener('dads-drawer-close', function() {
                    syncTrigger(false);
                  });

                  syncTrigger(drawer.hasAttribute('open'));
                });
              })();
            <\/script>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>mode</code></th>
                        <td><code>attr</code></td>
                        <td><code>auto</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="mode" data-api-attr="mode" data-default="auto">
                              <option value="auto" selected>auto</option>
                              <option value="wide-full">wide-full</option>
                              <option value="wide-slim">wide-slim</option>
                              <option value="medium">medium</option>
                              <option value="compact">compact</option>
                            </select>
                          </div>
                        </td>
                        <td>レイアウトモード</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="aria-label" value="行政情報システムヘッダー" data-api-attr="aria-label" data-default="行政情報システムヘッダー"></dads-input-text>
                          </div>
                        </td>
                        <td>ヘッダー領域のアクセシブル名</td>
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
                        <th scope="row"><code>--dads-header-container-inline-padding</code></th>
                        <td><code>mode依存</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-header-container-inline-padding" value="" data-api-css-var="--dads-header-container-inline-padding" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>インライン余白</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-header-container-primary-min-block-size</code></th>
                        <td><code>mode依存</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-header-container-primary-min-block-size" value="" data-api-css-var="--dads-header-container-primary-min-block-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>主段の最小高さ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-header-container-global-menu-min-block-size</code></th>
                        <td><code>mode依存</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-header-container-global-menu-min-block-size" value="" data-api-css-var="--dads-header-container-global-menu-min-block-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>グローバルメニュー段の高さ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-header-container-border-color</code></th>
                        <td><code>--color-neutral-opacity-gray-200</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-header-container-border-color" value="" data-api-css-var="--dads-header-container-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>境界線色</td>
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

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">レイアウト作例（Desktop / Tablet / Mobile）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          desktop（wide-full / wide-slim）、tablet（medium）、mobile（compact + drawer）を同一コンポーネントで再現します。
        </p>

        <div class="header-container-demo__layout-grid">
          <article class="header-container-demo__layout-card header-container-demo__layout-card--full">
            <h4 class="header-container-demo__layout-title">Desktop / Wide Full</h4>
            <p class="header-container-demo__layout-note">2段構成（logo + utility / global-menu）</p>
            <dads-device-mock class="header-container-demo__layout-device" device="desktop" visible-height="420px">
              <div class="header-container-demo__surface">
                <dads-header-container mode="wide-full" aria-label="省庁共通ヘッダー">
                  <a slot="logo" class="header-container-demo__logo-link" href="#">
                    <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                    省庁共通基盤
                  </a>
                  <div slot="utility" class="header-container-demo__utility-links">
                    ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_WIDE_FULL)}
                  </div>
                  ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_WIDE_FULL)}
                </dads-header-container>
              </div>
            </dads-device-mock>
          </article>

          <article class="header-container-demo__layout-card">
            <h4 class="header-container-demo__layout-title">Desktop / Wide Slim</h4>
            <p class="header-container-demo__layout-note">1段構成（logo + global-menu + utility）</p>
            <dads-device-mock class="header-container-demo__layout-device" device="desktop" visible-height="320px">
              <div class="header-container-demo__surface">
                <dads-header-container mode="wide-slim" aria-label="自治体システムヘッダー">
                  <a slot="logo" class="header-container-demo__logo-link" href="#">
                    <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                    自治体統合窓口
                  </a>
                  <div slot="utility" class="header-container-demo__utility-links">
                    ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_WIDE_SLIM)}
                    ${HEADER_CONTAINER_LANGUAGE_SELECTOR_TEXT}
                  </div>
                  ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_WIDE_SLIM)}
                </dads-header-container>
              </div>
            </dads-device-mock>
          </article>

          <article class="header-container-demo__layout-card">
            <h4 class="header-container-demo__layout-title">Tablet / Medium</h4>
            <p class="header-container-demo__layout-note">logo + utility + hamburger（global-menuはdrawerへ）</p>
            <dads-device-mock class="header-container-demo__layout-device" device="tablet" visible-height="170px">
              <div class="header-container-demo__surface">
                <dads-header-container mode="medium" aria-label="タブレットヘッダー">
                  <a slot="logo" class="header-container-demo__logo-link" href="#">
                    <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                    手続きポータル
                  </a>
                  <div slot="utility" class="header-container-demo__utility-links">
                    ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_TABLET)}
                  </div>
                  <dads-hamburger-menu-button slot="hamburger-menu" variant="standard" type="menu" lang="ja"></dads-hamburger-menu-button>
                </dads-header-container>
              </div>
            </dads-device-mock>
          </article>

          <article class="header-container-demo__layout-card">
            <h4 class="header-container-demo__layout-title">Mobile / Compact 全面展開モック</h4>
            <p class="header-container-demo__layout-note">drawer のモバイル全面展開作例と同じ trigger-layer + fullscreen drawer 構成</p>
            <div id="header-container-mobile-root" class="header-container-demo__mobile-grid">
              <article class="header-container-demo__mobile-card">
                <h5 class="header-container-demo__mobile-card-title">モバイル全面展開（compact）</h5>
                <div class="header-container-demo__mobile-root">
                  <dads-device-mock class="header-container-demo__mobile-mock" device="mobile" visible-height="560px">
                    <div class="header-container-demo__mobile-safe-area">
                      <div class="header-container-demo__mobile-trigger-layer" id="header-container-mobile-trigger-layer">
                        <dads-header-container
                          class="header-container-demo__mobile-header"
                          mode="compact"
                          aria-label="モバイルヘッダー"
                        >
                          <a slot="logo" class="header-container-demo__logo-link" href="#">
                            <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                            申請ポータル
                          </a>
                          <div slot="utility" class="header-container-demo__utility-links">
                            ${HEADER_CONTAINER_LANGUAGE_SELECTOR_ICON}
                          </div>
                          <dads-hamburger-menu-button
                            id="header-container-mobile-trigger"
                            slot="hamburger-menu"
                            variant="standard"
                            type="menu"
                            lang="ja"
                            command="show-modal"
                            commandfor="#header-container-mobile-drawer"
                            aria-controls="header-container-mobile-drawer"
                            aria-expanded="false"
                          ></dads-hamburger-menu-button>
                        </dads-header-container>
                      </div>

                      <dads-drawer
                        id="header-container-mobile-drawer"
                        class="header-container-demo__mobile-drawer header-container-demo__mobile-drawer--fullscreen"
                        data-preview-contained
                        placement="right"
                        close-label="閉じる"
                      >
                        <span slot="title">メニュー</span>
                        ${HEADER_CONTAINER_MOBILE_DRAWER_CONTENT}
                      </dads-drawer>
                    </div>
                  </dads-device-mock>
                </div>
              </article>
            </div>
          </article>
        </div>
      </section>

      <section style="margin-bottom: 24px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">業務シナリオ作例（行政SaaS向け）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          頻出ユースケースを想定した 3 テーマを同時に配置し、情報システムでの再利用性を確認します。
        </p>

        <div class="header-container-demo__theme-grid">
          <article class="header-container-demo__theme-card">
            <dads-device-mock class="header-container-demo__theme-mock" device="desktop" visible-height="420px">
              <div class="header-container-demo__theme-surface">
                <dads-header-container mode="wide-full" aria-label="自治体業務システムヘッダー">
                  <a slot="logo" class="header-container-demo__logo-link" href="#">
                    <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                    自治体業務システム
                  </a>
                  <div slot="utility" class="header-container-demo__utility-links">
                    ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_THEME_LOCAL)}
                  </div>
                  ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_THEME_LOCAL)}
                </dads-header-container>
              </div>
            </dads-device-mock>
          </article>

          <article class="header-container-demo__theme-card">
            <dads-device-mock class="header-container-demo__theme-mock" device="desktop" visible-height="220px">
              <div class="header-container-demo__theme-surface">
                <dads-header-container mode="wide-full" aria-label="行政手続きポータルヘッダー">
                  <a slot="logo" class="header-container-demo__logo-link" href="#">
                    <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                    行政手続きポータル
                  </a>
                  <div slot="utility" class="header-container-demo__utility-links">
                    ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_THEME_PORTAL)}
                  </div>
                  ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_THEME_PORTAL)}
                </dads-header-container>
              </div>
            </dads-device-mock>
          </article>

          <article class="header-container-demo__theme-card">
            <dads-device-mock class="header-container-demo__theme-mock" device="desktop" visible-height="420px">
              <div class="header-container-demo__theme-surface">
                <dads-header-container mode="wide-full" aria-label="省庁横断ダッシュボードヘッダー">
                  <a slot="logo" class="header-container-demo__logo-link" href="#">
                    <span class="header-container-demo__logo-mark" aria-hidden="true"></span>
                    省庁横断ダッシュボード
                  </a>
                  <div slot="utility" class="header-container-demo__utility-links">
                    ${renderUtilityLinks(HEADER_CONTAINER_UTILITY_LINKS_THEME_CROSS)}
                  </div>
                  ${renderHeaderGlobalMenu(HEADER_CONTAINER_MENU_THEME_CROSS)}
                </dads-header-container>
              </div>
            </dads-device-mock>
          </article>
        </div>
      </section>

      <script>
        (function() {
          var currentScript = document.currentScript;
          import('./packages/utils/command-store.js').then(function(mod) {
            var hostRoot = currentScript && currentScript.parentElement;
            if (!hostRoot || !hostRoot.isConnected) return;
            if (!mod || !mod.defaultCommandStore || !mod.defaultCommandStore.bind) return;

            var mobileRoot = hostRoot.querySelector('#header-container-mobile-root');
            if (mobileRoot && !mobileRoot.hasAttribute('data-header-container-mobile-command-store-bound')) {
              mobileRoot.setAttribute('data-header-container-mobile-command-store-bound', 'true');
              mod.defaultCommandStore.bind(mobileRoot);
            }

            var bindDrawerPair = function(drawerId, triggerId, triggerLayerId) {
              var drawer = mobileRoot.querySelector('#' + drawerId);
              var trigger = mobileRoot.querySelector('#' + triggerId);
              var triggerLayer = mobileRoot.querySelector('#' + triggerLayerId);
              if (!drawer || !trigger) return;

              var syncTrigger = function(isOpen) {
                trigger.setAttribute('type', isOpen ? 'close' : 'menu');
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                queueMicrotask(function() {
                  trigger.setAttribute('command', isOpen ? 'close' : 'show-modal');
                });
                if (triggerLayer) {
                  triggerLayer.hidden = isOpen;
                }
              };

              drawer.addEventListener('dads-drawer-open', function() {
                syncTrigger(true);
              });

              drawer.addEventListener('dads-drawer-close', function() {
                syncTrigger(false);
              });

              syncTrigger(drawer.hasAttribute('open'));
            };

            bindDrawerPair(
              'header-container-mobile-drawer',
              'header-container-mobile-trigger',
              'header-container-mobile-trigger-layer'
            );
          });
        })();
      <\/script>

      ${modulePreloadScript([
        'dads-header-container',
        'dads-hamburger-menu-button',
        'dads-drawer',
        'dads-device-mock',
        'dads-language-selector',
        'dads-global-menu',
        'dads-global-menu-item',
        'dads-utility-link',
        'dads-switch',
        'a11y-annotate',
      ])}
    </div>
  `,
};
