import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  modulePreloadScript,
  renderApiPanelWrapper,
  renderA11ySectionHeader,
  renderAnnotationToggleBlock,
} from './shared.js';

const DRAWER_MOBILE_MENU_ITEMS = Array.from(
  { length: 7 },
  () => '<li class="drawer-demo__mobile-list-item">メニューアイテム</li>',
).join('\n');

const DRAWER_MOBILE_CONTENT = `
  <div class="drawer-demo__mobile-content">
    <p class="drawer-demo__mobile-section-title">セクションタイトル</p>
    <ul class="drawer-demo__mobile-list">
      ${DRAWER_MOBILE_MENU_ITEMS}
    </ul>
  </div>
`;

export const demos = {
  drawer: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ドロワー</h2>
      <p style="color: #666; margin-bottom: 32px;">
        <code>commandfor</code> / <code>command</code> で宣言的に開閉できるドロワーです。
        <code>dads-drawer-before-open/open/before-close/close</code> を発火し、
        <code>light-dismiss</code> 指定時のみ背景クリックで閉じます。
      </p>

      <style>
        .drawer-demo__surface {
          position: relative;
          min-height: 360px;
          border: 1px dashed #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #f8fafc;
          padding: 16px;
        }
        .drawer-demo__surface--live {
          min-height: 220px;
        }
        .drawer-demo__trigger-row {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .drawer-demo__links {
          display: grid;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .drawer-demo__plain-item {
          display: flex;
          align-items: center;
          min-height: 44px;
          border-radius: 8px;
          padding: 8px 12px;
          color: #374151;
          font-size: 24px;
          line-height: 1.4;
          letter-spacing: 0;
        }
        .drawer-demo__link {
          display: flex;
          align-items: center;
          min-height: 44px;
          border-radius: 8px;
          padding: 8px 12px;
          color: #1f2937;
          text-decoration: none;
        }
        .drawer-demo__link:hover {
          background: #f3f4f6;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .drawer-demo__event-panel {
          border: 1px solid #d1d5db;
          border-radius: 12px;
          background: #fff;
          padding: 14px;
        }
        .drawer-demo__event-list {
          margin: 8px 0 0;
          padding-left: 20px;
          display: grid;
          gap: 6px;
          font-size: 14px;
          color: #374151;
          max-height: 220px;
          overflow: auto;
        }
        .drawer-demo__live-layout {
          display: grid;
          gap: 16px;
        }
        .drawer-demo__mobile-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .drawer-demo__mobile-card {
          display: grid;
          gap: 12px;
          min-width: 0;
        }
        .drawer-demo__mobile-card-title {
          margin: 0;
          font-size: 16px;
          line-height: 1.2;
          color: #1976d2;
          font-weight: 700;
        }
        .drawer-demo__mobile-mock {
          display: block;
          inline-size: 100%;
          --dads-device-mock-frame-width: calc(405 / 16 * 1rem);
          --dads-device-mock-screen-background: #f5f5f5;
          margin: 0 auto;
        }
        .drawer-demo__mobile-safe-area {
          position: relative;
          min-block-size: 100%;
          block-size: 100%;
          background: #f5f5f5;
        }
        .drawer-demo__mobile-header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          block-size: 68px;
          min-block-size: 68px;
          padding-inline: 16px;
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          background: #fff;
        }
        .drawer-demo__mobile-trigger-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .drawer-demo__mobile-trigger-layer .drawer-demo__mobile-header {
          pointer-events: auto;
        }
        .drawer-demo__mobile-trigger-layer--right .drawer-demo__mobile-trigger {
          position: absolute;
          inset-block-start: 12px;
          inset-inline-end: 16px;
          pointer-events: auto;
        }
        .drawer-demo__mobile-drawer {
          display: block;
          inline-size: 100%;
          block-size: 100%;
          --dads-drawer-header-min-height: 68px;
          --dads-drawer-header-padding-inline: 16px;
          --dads-drawer-content-padding-block: 16px;
          --dads-drawer-content-padding-inline: 24px;
          --dads-drawer-background: #fff;
          --dads-drawer-border-color: #d1d5db;
          --dads-drawer-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
        }
        .drawer-demo__mobile-drawer--fullscreen {
          --dads-drawer-width: 100%;
          --dads-drawer-max-width: 100%;
          --dads-drawer-border-width: 0;
          --dads-drawer-shadow: none;
          --dads-drawer-backdrop-background: transparent;
        }
        .drawer-demo__mobile-drawer--right-type {
          --dads-drawer-width: 74%;
          --dads-drawer-max-width: 74%;
          --dads-drawer-border-width: 1px;
          --dads-drawer-backdrop-background: rgba(0, 0, 0, 0.14);
        }
        .drawer-demo__mobile-drawer::part(base) {
          z-index: 0;
        }
        .drawer-demo__mobile-drawer::part(header) {
          box-sizing: border-box;
          block-size: 68px;
          min-block-size: 68px;
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          background: #fff;
        }
        .drawer-demo__mobile-drawer--right-type::part(header) {
          border-top: 0;
          border-bottom: 0;
        }
        .drawer-demo__mobile-drawer::part(close-button) {
          border: 0;
          border-radius: var(--border-radius-6, 0.375rem);
          gap: var(--spacing-1, 0.25rem);
          min-inline-size: auto;
          inline-size: auto;
          min-block-size: 44px;
          block-size: 44px;
          padding-inline: 12px;
          padding-block: 0;
          line-height: 1;
        }
        .drawer-demo__mobile-drawer::part(content) {
          padding-inline: 24px 8px;
        }
        .drawer-demo__mobile-content {
          display: grid;
        }
        .drawer-demo__mobile-section-title {
          margin: 0;
          min-block-size: 44px;
          padding-inline: 16px;
          display: flex;
          align-items: center;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 700;
          color: #1a1a1a;
        }
        .drawer-demo__mobile-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .drawer-demo__mobile-list-item {
          margin: 0;
          min-block-size: 44px;
          padding-inline: 16px;
          display: flex;
          align-items: center;
          font-size: 16px;
          line-height: 1.2;
          color: #1a1a1a;
        }
        @media (max-width: 980px) {
          .drawer-demo__mobile-grid {
            grid-template-columns: 1fr;
          }
        }
        .drawer-demo__surface--annotate dads-drawer {
          --dads-drawer-width: 46%;
          --dads-drawer-max-width: 46%;
        }
        .drawer-demo__surface--annotate dads-drawer::part(base) {
          z-index: 1;
        }
      </style>

      ${renderAnnotationToggleBlock()}

      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate
          target-selector="dads-drawer"
          callout-lane="side"
          style="
            --a11y-annotate-callout-gutter: 112px;
            --a11y-annotate-callout-lane-offset: 52px;
            --a11y-annotate-callout-lane-gap: 16px;
            --a11y-annotate-callout-anchor-corner-margin: 14px;
          "
        >
          <div class="drawer-demo__surface drawer-demo__surface--annotate">
            <dads-drawer open data-preview-contained placement="left" close-label="閉じる">
              <span slot="title">メニュー</span>
              <ul class="drawer-demo__links">
                <li class="drawer-demo__plain-item">メニューアイテム1</li>
                <li class="drawer-demo__plain-item">メニューアイテム2</li>
                <li class="drawer-demo__plain-item">メニューアイテム3</li>
              </ul>
            </dads-drawer>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: ['dads-drawer', 'dads-hamburger-menu-button'],
          rootAttrs: 'data-api-strip-attrs="data-preview-contained"',
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div class="drawer-demo__surface" data-drawer-demo-root>
                <div class="drawer-demo__trigger-row">
                  <dads-hamburger-menu-button
                    id="drawer-api-trigger"
                    commandfor="#drawer-api-target"
                    command="show-modal"
                    aria-controls="drawer-api-target"
                    aria-expanded="false"
                    type="menu"
                  ></dads-hamburger-menu-button>
                </div>

                <dads-drawer
                  id="drawer-api-target"
                  data-api-target
                  data-preview-contained
                  placement="left"
                  close-label="閉じる"
                >
                  <span slot="title">メニュー</span>
                  <ul class="drawer-demo__links">
                    <li><a class="drawer-demo__link" href="#">メニューアイテム1</a></li>
                    <li><a class="drawer-demo__link" href="#">メニューアイテム2</a></li>
                    <li><a class="drawer-demo__link" href="#">メニューアイテム3</a></li>
                  </ul>
                </dads-drawer>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-hamburger-menu-button
                      commandfor="#global-drawer"
                      command="show-modal"
                      aria-controls="global-drawer"
                      aria-expanded="false"
                      type="menu"
                    ></dads-hamburger-menu-button>

                    <dads-drawer id="global-drawer" placement="left" close-label="閉じる">
                      <span slot="title">メニュー</span>
                      <nav>
                        <a href="#">メニューアイテム1</a>
                        <a href="#">メニューアイテム2</a>
                        <a href="#">メニューアイテム3</a>
                      </nav>
                    </dads-drawer>
                  </template>
                </dads-code-block>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Events</h4>
                <div class="drawer-demo__event-panel">
                  <p style="margin: 0; font-size: 14px; color: #4b5563;">
                    before-open / open / before-close / close の順でイベントを記録します。
                  </p>
                  <ol class="drawer-demo__event-list" id="drawer-api-events"></ol>
                </div>
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
                  var demoRoot = apiPanel.querySelector('[data-drawer-demo-root]');
                  if (!demoRoot) return;
                  if (!demoRoot.hasAttribute('data-drawer-api-command-store-bound')) {
                    demoRoot.setAttribute('data-drawer-api-command-store-bound', 'true');
                    mod.defaultCommandStore.bind(demoRoot);
                  }
                });

                customElements.whenDefined('dads-drawer').then(function() {
                  var apiPanel =
                    (currentScript && currentScript.closest('.wc-api-panel')) ||
                    (currentScript && currentScript.parentElement);
                  if (!apiPanel || !apiPanel.isConnected) return;

                  var drawer = apiPanel.querySelector('#drawer-api-target');
                  var trigger = apiPanel.querySelector('#drawer-api-trigger');
                  var eventList = apiPanel.querySelector('#drawer-api-events');
                  if (!drawer || !trigger || !eventList) return;

                  var pushEvent = function(name, detail) {
                    var item = document.createElement('li');
                    var reason = detail && detail.reason ? detail.reason : '-';
                    item.textContent = name + ' (reason: ' + reason + ')';
                    eventList.prepend(item);
                    while (eventList.children.length > 12) {
                      eventList.removeChild(eventList.lastChild);
                    }
                  };

                  var setTriggerState = function(target, isOpen) {
                    target.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    target.setAttribute('type', isOpen ? 'close' : 'menu');
                    queueMicrotask(function() {
                      target.setAttribute('command', isOpen ? 'close' : 'show-modal');
                    });
                  };

                  var syncTrigger = function(isOpen) {
                    setTriggerState(trigger, isOpen);
                  };

                  drawer.addEventListener('dads-drawer-before-open', function(event) {
                    pushEvent('dads-drawer-before-open', event.detail);
                  });
                  drawer.addEventListener('dads-drawer-open', function(event) {
                    pushEvent('dads-drawer-open', event.detail);
                    syncTrigger(true);
                  });
                  drawer.addEventListener('dads-drawer-before-close', function(event) {
                    pushEvent('dads-drawer-before-close', event.detail);
                  });
                  drawer.addEventListener('dads-drawer-close', function(event) {
                    pushEvent('dads-drawer-close', event.detail);
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
                        <th scope="row"><code>open</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="open" data-api-attr="open" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>開閉状態</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>placement</code></th>
                        <td><code>attr</code></td>
                        <td><code>left</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="placement" data-api-attr="placement" data-default="left">
                              <option value="left" selected>left</option>
                              <option value="right">right</option>
                            </select>
                          </div>
                        </td>
                        <td>表示位置（left | right）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>light-dismiss</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="light-dismiss" data-api-attr="light-dismiss" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>背景クリックで閉じる</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>close-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>閉じる</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="close-label" value="閉じる" data-api-attr="close-label" data-default="閉じる"></dads-input-text>
                          </div>
                        </td>
                        <td>閉じるボタンラベル</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="aria-label" value="" data-api-attr="aria-label" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>指定時はtitleより優先されるアクセシブル名</td>
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
                        <th scope="row"><code>--dads-drawer-width</code></th>
                        <td><code>18rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-drawer-width" value="" data-api-css-var="--dads-drawer-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ドロワー幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-drawer-backdrop-background</code></th>
                        <td><code>--color-neutral-opacity-gray-100</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-drawer-backdrop-background" value="" data-api-css-var="--dads-drawer-backdrop-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景(backdrop)色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-drawer-shadow</code></th>
                        <td><code>2-layer shadow</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-drawer-shadow" value="" data-api-css-var="--dads-drawer-shadow" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ドロワー影</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">モバイル全面展開作例</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          左は全面タイプ、右は右タイプ（light dismiss）です。提供いただいたスマホモック SVG に合わせて再現しています。
        </p>

        <div class="drawer-demo__mobile-grid" id="drawer-mobile-root">
          <article class="drawer-demo__mobile-card">
            <h4 class="drawer-demo__mobile-card-title">Mobile: Right Menu</h4>
            <dads-device-mock class="drawer-demo__mobile-mock" device="mobile">
              <div class="drawer-demo__mobile-safe-area">
                <div class="drawer-demo__mobile-trigger-layer" id="drawer-mobile-trigger-layer">
                  <header class="drawer-demo__mobile-header">
                    <dads-hamburger-menu-button
                      id="drawer-mobile-trigger"
                      variant="standard"
                      type="menu"
                      lang="ja"
                      commandfor="#drawer-mobile-target"
                      command="show-modal"
                      aria-controls="drawer-mobile-target"
                      aria-expanded="false"
                    ></dads-hamburger-menu-button>
                  </header>
                </div>
                <dads-drawer
                  id="drawer-mobile-target"
                  class="drawer-demo__mobile-drawer drawer-demo__mobile-drawer--fullscreen"
                  data-preview-contained
                  placement="right"
                  close-label="閉じる"
                >
                  ${DRAWER_MOBILE_CONTENT}
                </dads-drawer>
              </div>
            </dads-device-mock>
          </article>

          <article class="drawer-demo__mobile-card">
            <h4 class="drawer-demo__mobile-card-title">右タイプ（light-dismiss）</h4>
            <dads-device-mock class="drawer-demo__mobile-mock" device="mobile">
              <div class="drawer-demo__mobile-safe-area">
                <div
                  class="drawer-demo__mobile-trigger-layer drawer-demo__mobile-trigger-layer--right"
                  id="drawer-mobile-right-trigger-layer"
                >
                  <dads-hamburger-menu-button
                    class="drawer-demo__mobile-trigger"
                    id="drawer-mobile-right-trigger"
                    variant="standard"
                    type="menu"
                    lang="ja"
                    commandfor="#drawer-mobile-right-target"
                    command="show-modal"
                    aria-controls="drawer-mobile-right-target"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>
                </div>
                <dads-drawer
                  id="drawer-mobile-right-target"
                  class="drawer-demo__mobile-drawer drawer-demo__mobile-drawer--right-type"
                  data-preview-contained
                  placement="right"
                  close-label="閉じる"
                  light-dismiss
                >
                  ${DRAWER_MOBILE_CONTENT}
                </dads-drawer>
              </div>
            </dads-device-mock>
          </article>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">実画面作例（showModal）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          <code>data-preview-contained</code> を使わずに実際の画面上で開閉します。
        </p>
        <div class="drawer-demo__live-layout" id="drawer-live-root">
          <div class="drawer-demo__surface drawer-demo__surface--live">
            <div class="drawer-demo__trigger-row">
              <dads-hamburger-menu-button
                id="drawer-live-trigger"
                commandfor="#drawer-live-target"
                command="show-modal"
                aria-controls="drawer-live-target"
                aria-expanded="false"
                type="menu"
              ></dads-hamburger-menu-button>
            </div>
          </div>
          <div class="drawer-demo__event-panel">
            <strong>last events</strong>
            <ol id="drawer-live-events" class="drawer-demo__event-list" aria-live="polite">
              <li data-initial="true">none</li>
            </ol>
          </div>
        </div>

        <dads-drawer id="drawer-live-target" placement="left" close-label="閉じる">
          <span slot="title">メニュー</span>
          <ul class="drawer-demo__links">
            <li><a class="drawer-demo__link" href="#">住民票の写し</a></li>
            <li><a class="drawer-demo__link" href="#">戸籍証明書</a></li>
            <li><a class="drawer-demo__link" href="#">引越し手続き</a></li>
          </ul>
        </dads-drawer>
      </section>

      <script>
        (function() {
          var currentScript = document.currentScript;
          import('./packages/utils/command-store.js').then(function(mod) {
            var hostRoot = currentScript && currentScript.parentElement;
            if (!hostRoot || !hostRoot.isConnected) return;
            if (!mod || !mod.defaultCommandStore || !mod.defaultCommandStore.bind) return;

            var liveRoot = hostRoot.querySelector('#drawer-live-root');
            if (!liveRoot) return;
            var root = liveRoot.closest('section') || hostRoot;
            var drawer = root.querySelector('#drawer-live-target');
            var trigger = root.querySelector('#drawer-live-trigger');
            var log = root.querySelector('#drawer-live-events');
            if (!drawer || !trigger || !log) return;

            if (!root.hasAttribute('data-drawer-live-command-store-bound')) {
              root.setAttribute('data-drawer-live-command-store-bound', 'true');
              mod.defaultCommandStore.bind(root);
            }

            if (liveRoot.hasAttribute('data-drawer-live-events-bound')) return;
            liveRoot.setAttribute('data-drawer-live-events-bound', 'true');

            var appendEvent = function(name, detail) {
              var initial = log.querySelector('[data-initial="true"]');
              if (initial && initial.parentNode) initial.parentNode.removeChild(initial);
              var li = document.createElement('li');
              var reason = detail && detail.reason ? detail.reason : '-';
              li.textContent = name + ' (reason: ' + reason + ')';
              log.insertBefore(li, log.firstChild);
              while (log.children.length > 8) {
                log.removeChild(log.lastElementChild);
              }
            };

            var setTriggerState = function(target, isOpen) {
              target.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
              target.setAttribute('type', isOpen ? 'close' : 'menu');
              queueMicrotask(function() {
                target.setAttribute('command', isOpen ? 'close' : 'show-modal');
              });
            };

            var syncTrigger = function(isOpen) {
              setTriggerState(trigger, isOpen);
            };

            drawer.addEventListener('dads-drawer-before-open', function(event) {
              appendEvent('dads-drawer-before-open', event.detail);
            });
            drawer.addEventListener('dads-drawer-open', function(event) {
              appendEvent('dads-drawer-open', event.detail);
              syncTrigger(true);
            });
            drawer.addEventListener('dads-drawer-before-close', function(event) {
              appendEvent('dads-drawer-before-close', event.detail);
            });
            drawer.addEventListener('dads-drawer-close', function(event) {
              appendEvent('dads-drawer-close', event.detail);
              syncTrigger(false);
            });

            syncTrigger(drawer.hasAttribute('open'));

            var mobileRoot = hostRoot.querySelector('#drawer-mobile-root');
            if (!mobileRoot) return;

            if (!mobileRoot.hasAttribute('data-drawer-mobile-command-store-bound')) {
              mobileRoot.setAttribute('data-drawer-mobile-command-store-bound', 'true');
              mod.defaultCommandStore.bind(mobileRoot);
            }

            if (mobileRoot.hasAttribute('data-drawer-mobile-events-bound')) return;
            mobileRoot.setAttribute('data-drawer-mobile-events-bound', 'true');

            var bindMobilePair = function(drawerId, triggerId, triggerLayerId) {
              var mobileDrawer = mobileRoot.querySelector('#' + drawerId);
              var mobileTrigger = mobileRoot.querySelector('#' + triggerId);
              var triggerLayer = mobileRoot.querySelector('#' + triggerLayerId);
              if (!mobileDrawer || !mobileTrigger) return;

              var syncMobileTrigger = function(isOpen) {
                setTriggerState(mobileTrigger, isOpen);
                if (triggerLayer) {
                  triggerLayer.hidden = isOpen;
                }
              };

              mobileDrawer.addEventListener('dads-drawer-open', function() {
                syncMobileTrigger(true);
              });
              mobileDrawer.addEventListener('dads-drawer-close', function() {
                syncMobileTrigger(false);
              });

              syncMobileTrigger(mobileDrawer.hasAttribute('open'));
            };

            bindMobilePair('drawer-mobile-target', 'drawer-mobile-trigger', 'drawer-mobile-trigger-layer');
            bindMobilePair(
              'drawer-mobile-right-target',
              'drawer-mobile-right-trigger',
              'drawer-mobile-right-trigger-layer'
            );
          });
        })();
      <\/script>

      ${modulePreloadScript(['dads-drawer', 'dads-hamburger-menu-button', 'dads-device-mock', 'dads-switch', 'a11y-annotate'])}
    </div>
  `,
};
