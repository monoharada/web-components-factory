import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  annotationToggleScript,
  annotationToggleUI,
  modulePreloadScript,
  renderApiPanelWrapper,
} from './shared.js';

export const demos = {
  hamburgerMenuButton: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ハンバーガーメニューボタン</h2>
      <p style="color: #666; margin-bottom: 24px;">
        <code>variant="standard|icon"</code> で見た目を切り替える単一コンポーネントです。
        <code>command</code>/<code>commandfor</code> を <code>part="base"</code> に委譲し、
        Drawer など他コンポーネントを宣言的に操作できます。
      </p>

      <style>
        .hamburger-demo__surface {
          position: relative;
          min-height: 360px;
          border: 1px dashed #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #f8fafc;
          padding: 16px;
        }
        .hamburger-demo__surface--compact {
          min-height: 120px;
        }
        .hamburger-demo__row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .hamburger-demo__live-layout {
          display: grid;
          gap: 16px;
        }
        .hamburger-demo__live-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .hamburger-demo__event-panel {
          border: 1px solid #d1d5db;
          border-radius: 12px;
          background: #fff;
          padding: 14px;
        }
        .hamburger-demo__event-list {
          margin: 8px 0 0;
          padding-left: 20px;
          display: grid;
          gap: 6px;
          font-size: 14px;
          color: #374151;
          max-height: 220px;
          overflow: auto;
        }
      </style>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-hamburger-menu-button">
          <div style="display: grid; place-content: center; min-height: 200px; border: 1px dashed #e5e7eb; border-radius: 12px; background: #f8fafc;">
            <dads-hamburger-menu-button variant="standard" type="menu" lang="ja"></dads-hamburger-menu-button>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: ['dads-hamburger-menu-button', 'dads-drawer'],
          rootAttrs: 'data-api-strip-attrs="data-preview-contained"',
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div class="hamburger-demo__surface" data-hamburger-demo-root>
                <div class="hamburger-demo__row">
                  <dads-hamburger-menu-button
                    id="hamburger-api-target"
                    data-api-target
                    variant="standard"
                    type="menu"
                    lang="ja"
                    command="show-modal"
                    commandfor="#hamburger-demo-drawer"
                    aria-controls="hamburger-demo-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>

                  <dads-hamburger-menu-button
                    variant="standard"
                    type="menu"
                    lang="ja"
                    command="show-modal"
                    commandfor="#hamburger-demo-drawer"
                    aria-controls="hamburger-demo-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>

                  <dads-hamburger-menu-button
                    variant="standard"
                    type="menu"
                    lang="en"
                    command="show-modal"
                    commandfor="#hamburger-demo-drawer"
                    aria-controls="hamburger-demo-drawer"
                    aria-expanded="false"
                  ></dads-hamburger-menu-button>
                </div>

                <dads-drawer id="hamburger-demo-drawer" data-preview-contained placement="left" close-label="閉じる">
                  <span slot="title">メニュー</span>
                  Drawer連携確認用のコンテンツです。
                </dads-drawer>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-hamburger-menu-button
                      variant="standard"
                      type="menu"
                      lang="ja"
                      command="show-modal"
                      commandfor="#global-drawer"
                      aria-controls="global-drawer"
                      aria-expanded="false"
                    ></dads-hamburger-menu-button>

                    <dads-drawer id="global-drawer" placement="left">
                      <span slot="title">メニュー</span>
                      Drawer content
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
                  var demoRoot = apiPanel.querySelector('[data-hamburger-demo-root]');
                  if (!demoRoot) return;
                  if (!demoRoot.hasAttribute('data-hamburger-api-command-store-bound')) {
                    demoRoot.setAttribute('data-hamburger-api-command-store-bound', 'true');
                    mod.defaultCommandStore.bind(demoRoot);
                  }
                });

                customElements.whenDefined('dads-drawer').then(function() {
                  var apiPanel =
                    (currentScript && currentScript.closest('.wc-api-panel')) ||
                    (currentScript && currentScript.parentElement);
                  if (!apiPanel || !apiPanel.isConnected) return;
                  var demoRoot = apiPanel.querySelector('[data-hamburger-demo-root]');
                  if (!demoRoot) return;
                  if (demoRoot.hasAttribute('data-hamburger-api-events-bound')) return;
                  demoRoot.setAttribute('data-hamburger-api-events-bound', 'true');

                  var drawer = demoRoot.querySelector('#hamburger-demo-drawer');
                  var triggers = Array.prototype.slice.call(
                    demoRoot.querySelectorAll(
                      'dads-hamburger-menu-button[commandfor="#hamburger-demo-drawer"]',
                    ),
                  );
                  if (!drawer || !triggers.length) return;

                  var setTriggerState = function(trigger, isOpen) {
                    trigger.setAttribute('type', isOpen ? 'close' : 'menu');
                    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    queueMicrotask(function() {
                      trigger.setAttribute('command', isOpen ? 'close' : 'show-modal');
                    });
                  };

                  var syncTriggers = function(isOpen) {
                    triggers.forEach(function(trigger) {
                      setTriggerState(trigger, isOpen);
                    });
                  };

                  drawer.addEventListener('dads-drawer-open', function() {
                    syncTriggers(true);
                  });
                  drawer.addEventListener('dads-drawer-close', function() {
                    syncTriggers(false);
                  });
                  syncTriggers(drawer.hasAttribute('open'));
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
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>standard</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="variant" data-api-attr="variant" data-default="standard">
                              <option value="standard" selected>standard</option>
                              <option value="icon">icon</option>
                            </select>
                          </div>
                        </td>
                        <td>見た目バリアント</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>type</code></th>
                        <td><code>attr</code></td>
                        <td><code>menu</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="type" data-api-attr="type" data-default="menu">
                              <option value="menu" selected>menu</option>
                              <option value="close">close</option>
                            </select>
                          </div>
                        </td>
                        <td>メニュー / 閉じる 表示</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>lang</code></th>
                        <td><code>attr</code></td>
                        <td><code>ja</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="lang" data-api-attr="lang" data-default="ja">
                              <option value="ja" selected>ja</option>
                              <option value="en">en</option>
                            </select>
                          </div>
                        </td>
                        <td>ラベル言語</td>
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
                        <td>明示アクセシブル名</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>command</code></th>
                        <td><code>attr</code></td>
                        <td><code>show-modal</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="command" value="show-modal" data-api-attr="command" data-default="show-modal"></dads-input-text>
                          </div>
                        </td>
                        <td>実行コマンド</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>commandfor</code></th>
                        <td><code>attr</code></td>
                        <td><code>#hamburger-demo-drawer</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="commandfor" value="#hamburger-demo-drawer" data-api-attr="commandfor" data-default="#hamburger-demo-drawer"></dads-input-text>
                          </div>
                        </td>
                        <td>コマンド対象セレクタ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>aria-controls</code></th>
                        <td><code>attr</code></td>
                        <td><code>hamburger-demo-drawer</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="aria-controls" value="hamburger-demo-drawer" data-api-attr="aria-controls" data-default="hamburger-demo-drawer"></dads-input-text>
                          </div>
                        </td>
                        <td>制御対象ID</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>aria-expanded</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="aria-expanded" value="false" data-api-attr="aria-expanded" data-default="false"></dads-input-text>
                          </div>
                        </td>
                        <td>展開状態</td>
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
                        <th scope="row"><code>--dads-hamburger-menu-button-icon-size</code></th>
                        <td><code>24px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-hamburger-menu-button-icon-size" value="" data-api-css-var="--dads-hamburger-menu-button-icon-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>standardバリアントのアイコンサイズ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-hamburger-menu-button-min-height</code></th>
                        <td><code>44px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-hamburger-menu-button-min-height" value="" data-api-css-var="--dads-hamburger-menu-button-min-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>minimum tap target</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-hamburger-menu-button-background-hover</code></th>
                        <td><code>--color-neutral-solid-gray-50</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-hamburger-menu-button-background-hover" value="" data-api-css-var="--dads-hamburger-menu-button-background-hover" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>hover背景色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">実画面作例（showModal）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          標準バリアントで統一し、日本語/英語の2パターンを実画面で開閉します。
        </p>

        <div id="hamburger-live-root" class="hamburger-demo__live-layout">
          <div class="hamburger-demo__live-grid">
            <div class="hamburger-demo__surface hamburger-demo__surface--compact">
              <h4 style="font-size: 16px; margin: 0 0 8px; color: #333;">standard</h4>
              <dads-hamburger-menu-button
                id="hamburger-live-standard-trigger"
                variant="standard"
                type="menu"
                lang="ja"
                command="show-modal"
                commandfor="#hamburger-live-standard-drawer"
                aria-controls="hamburger-live-standard-drawer"
                aria-expanded="false"
              ></dads-hamburger-menu-button>
            </div>

            <div class="hamburger-demo__surface hamburger-demo__surface--compact">
              <h4 style="font-size: 16px; margin: 0 0 8px; color: #333;">standard (en)</h4>
              <dads-hamburger-menu-button
                id="hamburger-live-standard-en-trigger"
                variant="standard"
                type="menu"
                lang="en"
                command="show-modal"
                commandfor="#hamburger-live-standard-en-drawer"
                aria-controls="hamburger-live-standard-en-drawer"
                aria-expanded="false"
              ></dads-hamburger-menu-button>
            </div>
          </div>

          <div class="hamburger-demo__event-panel">
            <strong>last events</strong>
            <ol id="hamburger-live-events" class="hamburger-demo__event-list" aria-live="polite">
              <li data-initial="true">none</li>
            </ol>
          </div>
        </div>

        <dads-drawer id="hamburger-live-standard-drawer" placement="left" close-label="閉じる">
          <span slot="title">標準メニュードロワー</span>
          標準バリアントから開く実画面作例です。
        </dads-drawer>

        <dads-drawer id="hamburger-live-standard-en-drawer" placement="right" close-label="閉じる">
          <span slot="title">標準メニュードロワー（英語）</span>
          標準バリアント（英語ラベル）から開く実画面作例です。
        </dads-drawer>
      </section>

      <script>
        (function() {
          var currentScript = document.currentScript;
          import('./packages/utils/command-store.js').then(function(mod) {
            var hostRoot = currentScript && currentScript.parentElement;
            if (!hostRoot || !hostRoot.isConnected) return;
            if (!mod || !mod.defaultCommandStore || !mod.defaultCommandStore.bind) return;

            var liveRoot = hostRoot.querySelector('#hamburger-live-root');
            if (!liveRoot) return;
            var root = liveRoot.closest('section') || hostRoot;
            var log = root.querySelector('#hamburger-live-events');
            if (!liveRoot || !log) return;

            if (!root.hasAttribute('data-hamburger-live-command-store-bound')) {
              root.setAttribute('data-hamburger-live-command-store-bound', 'true');
              mod.defaultCommandStore.bind(root);
            }
            if (liveRoot.hasAttribute('data-hamburger-live-events-bound')) return;
            liveRoot.setAttribute('data-hamburger-live-events-bound', 'true');

            var appendEvent = function(source, eventName, detail) {
              var initial = log.querySelector('[data-initial="true"]');
              if (initial && initial.parentNode) initial.parentNode.removeChild(initial);
              var li = document.createElement('li');
              var reason = detail && detail.reason ? detail.reason : '-';
              li.textContent = '[' + source + '] ' + eventName + ' (reason: ' + reason + ')';
              log.insertBefore(li, log.firstChild);
              while (log.children.length > 10) {
                log.removeChild(log.lastElementChild);
              }
            };

            var bindPair = function(source, triggerSelector, drawerSelector) {
              var trigger = root.querySelector(triggerSelector);
              var drawer = root.querySelector(drawerSelector);
              if (!trigger || !drawer) return;

              var syncTrigger = function(isOpen) {
                trigger.setAttribute('type', isOpen ? 'close' : 'menu');
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                queueMicrotask(function() {
                  trigger.setAttribute('command', isOpen ? 'close' : 'show-modal');
                });
              };

              drawer.addEventListener('dads-drawer-before-open', function(event) {
                appendEvent(source, 'dads-drawer-before-open', event.detail);
              });
              drawer.addEventListener('dads-drawer-open', function(event) {
                appendEvent(source, 'dads-drawer-open', event.detail);
                syncTrigger(true);
              });
              drawer.addEventListener('dads-drawer-before-close', function(event) {
                appendEvent(source, 'dads-drawer-before-close', event.detail);
              });
              drawer.addEventListener('dads-drawer-close', function(event) {
                appendEvent(source, 'dads-drawer-close', event.detail);
                syncTrigger(false);
              });

              syncTrigger(drawer.hasAttribute('open'));
            };

            bindPair('standard-ja', '#hamburger-live-standard-trigger', '#hamburger-live-standard-drawer');
            bindPair(
              'standard-en',
              '#hamburger-live-standard-en-trigger',
              '#hamburger-live-standard-en-drawer'
            );
          });
        })();
      <\/script>

      ${modulePreloadScript(['dads-hamburger-menu-button', 'dads-drawer', 'dads-switch', 'a11y-annotate'])}
    </div>
  `,
};
