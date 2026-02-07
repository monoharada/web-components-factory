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
  dialog: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">Dialog（Modal）</h2>
      <p style="color: #666; margin-bottom: 32px;">
        commandfor / command で宣言的に開閉できるモーダルダイアログです。light dismiss は行わず、Esc と明示操作で閉じます。
      </p>
      <style>
        .dialog-demo__footer-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .dialog-demo__sample {
          display: grid;
          gap: 12px;
        }
        .dialog-demo__sample--after-api-table {
          margin-top: 20px;
        }
        .dialog-demo__sample-note {
          margin: 0;
          font-size: 14px;
          color: #4b5563;
        }
        .dialog-demo__preview-surface {
          position: relative;
          min-height: 320px;
          padding: 16px;
          border: 1px dashed #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #f8fafc;
        }
        .dialog-demo__preview-surface--commandfor {
          display: grid;
          align-content: start;
          gap: 1lh;
        }
        .dialog-demo__modal-stage {
          position: relative;
          min-height: 320px;
          border-radius: 10px;
          overflow: hidden;
          background: #d1d5db;
        }
        .dialog-demo__commandfor-layout {
          display: grid;
          gap: 16px;
        }
        .dialog-demo__event-panel {
          border: 1px solid #d1d5db;
          border-radius: 12px;
          background: #fff;
          padding: 14px;
        }
        .dialog-demo__event-list {
          margin: 8px 0 0;
          padding-left: 20px;
          display: grid;
          gap: 6px;
          font-size: 14px;
          color: #374151;
          max-height: 240px;
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
        <a11y-annotate target-selector="dads-dialog" style="--a11y-annotate-callout-gutter: 112px;">
          <div style="position: relative; height: 360px; padding: 16px; border: 1px dashed #e5e7eb; border-radius: 12px; overflow: hidden; background: #f8fafc;">
            <dads-dialog open size="s" close-button data-preview-contained>
              <dads-heading slot="title" level="2" size="32" margin="none">確認ダイアログ</dads-heading>
              この内容で申請を確定してよろしいですか？
              <div slot="footer" class="dialog-demo__footer-actions">
                <dads-button variant="outlined">戻る</dads-button>
                <dads-button>確定する</dads-button>
              </div>
            </dads-dialog>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: ['dads-dialog', 'dads-list', 'dads-heading'],
          rootAttrs: 'data-api-strip-attrs="data-preview-contained"',
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="position: relative; height: 360px; padding: 16px; border: 1px dashed #e5e7eb; border-radius: 12px; overflow: hidden; background: #f8fafc;">
                <dads-dialog id="dialog-api-target" data-api-target open data-preview-contained close-button size="s">
                  <dads-heading slot="title" level="2" size="32" margin="none">ダイアログタイトル</dads-heading>
                  ダイアログ本文です。必要な情報を記載します。
                  <div slot="footer" class="dialog-demo__footer-actions">
                    <dads-button commandfor="#dialog-api-target" command="close" variant="outlined">閉じる</dads-button>
                    <dads-button commandfor="#dialog-api-target" command="close">完了</dads-button>
                  </div>
                </dads-dialog>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-button commandfor="#dialog-sample" command="show-modal">開く</dads-button>
                    <dads-dialog id="dialog-sample" close-button size="m">
                      <dads-heading slot="title" level="2" size="32" margin="none">ダイアログタイトル</dads-heading>
                      ダイアログ本文です。
                      <div slot="footer" class="dialog-demo__footer-actions">
                        <dads-button commandfor="#dialog-sample" command="close" variant="outlined">閉じる</dads-button>
                        <dads-button commandfor="#dialog-sample" command="close">完了</dads-button>
                      </div>
                    </dads-dialog>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <script>
              (function() {
                var currentScript = document.currentScript;
                import('./packages/utils/command-store.js').then(function(mod) {
                  var root = currentScript && currentScript.parentElement;
                  if (!root || !root.isConnected) return;
                  if (!mod || !mod.defaultCommandStore || !mod.defaultCommandStore.bind) return;
                  if (!root.hasAttribute('data-dialog-api-command-store-bound')) {
                    root.setAttribute('data-dialog-api-command-store-bound', 'true');
                    mod.defaultCommandStore.bind(root);
                  }
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
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="open" data-api-attr="open" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>開閉状態</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>s</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="s">
                              <option value="s" selected>s</option>
                              <option value="m">m</option>
                              <option value="l">l</option>
                            </select>
                          </div>
                        </td>
                        <td>ダイアログサイズ（s | m | l）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>initial-focus</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="initial-focus" data-api-attr="initial-focus" data-default="">
                              <option value="" selected>auto</option>
                              <option value="title">title</option>
                            </select>
                          </div>
                        </td>
                        <td>初期フォーカス位置（auto: 先頭操作要素 / title: 見出し）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>close-button</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="close-button" data-api-attr="close-button" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>閉じるボタン表示</td>
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
                        <td>title未使用時のアクセシブル名</td>
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
                        <th scope="row"><code>--dads-dialog-backdrop-background</code></th>
                        <td><code>--color-neutral-opacity-gray-100</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-dialog-backdrop-background" value="" data-api-css-var="--dads-dialog-backdrop-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景(backdrop)色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-dialog-border-color</code></th>
                        <td><code>--color-neutral-solid-gray-536</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-dialog-border-color" value="" data-api-css-var="--dads-dialog-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>境界線色（3:1以上を維持）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-dialog-border-width</code></th>
                        <td><code>1px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-dialog-border-width" value="" data-api-css-var="--dads-dialog-border-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>境界線幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-dialog-width</code></th>
                        <td><code>40rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-dialog-width" value="" data-api-css-var="--dads-dialog-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ダイアログ幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-dialog-border-radius</code></th>
                        <td><code>--border-radius-12</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-dialog-border-radius" value="" data-api-css-var="--dads-dialog-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">Events</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">When</th>
                        <th scope="col">Detail</th>
                        <th scope="col">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><code>dads-dialog-before-open</code></th>
                        <td>開く直前</td>
                        <td><code>{ reason, invoker, originalEvent, returnFocusTo }</code></td>
                        <td><code>cancelable</code>。<code>preventDefault()</code> で開閉を中断可能</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dads-dialog-open</code></th>
                        <td>開いた直後</td>
                        <td><code>{ reason, invoker, originalEvent, returnFocusTo }</code></td>
                        <td>開閉完了後の通知イベント</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dads-dialog-before-close</code></th>
                        <td>閉じる直前</td>
                        <td><code>{ reason, invoker, originalEvent, returnFocusTo }</code></td>
                        <td><code>cancelable</code>。<code>preventDefault()</code> で開閉を中断可能</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dads-dialog-close</code></th>
                        <td>閉じた直後</td>
                        <td><code>{ reason, invoker, originalEvent, returnFocusTo }</code></td>
                        <td><code>returnFocusTo</code> に復帰先要素が入る</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>

            <div class="dialog-demo__sample dialog-demo__sample--after-api-table">
              <h4 class="wc-api-panel__section-title">トリガー付き作例（initial-focus="title"）</h4>
              <p class="dialog-demo__sample-note">
                長文説明を含むダイアログで、開いた直後に見出しへフォーカスします。
              </p>
              <div>
                <dads-button commandfor="#dialog-api-heading-focus" command="show-modal" variant="outlined">
                  見出しフォーカスの作例を開く
                </dads-button>
              </div>
              <dads-dialog id="dialog-api-heading-focus" close-button close-label="閉じる" initial-focus="title">
                <dads-heading slot="title" level="2" size="32" margin="none">申請ガイドを確認してください</dads-heading>
                このダイアログは、最初に見出しへフォーカスして文脈を先に把握できるようにしています。
                <dads-list variant="marker" spacing="md">
                  <dads-list-item>入力内容を確認する</dads-list-item>
                  <dads-list-item>注意事項を読む</dads-list-item>
                  <dads-list-item>問題なければ送信する</dads-list-item>
                </dads-list>
                <div slot="footer" class="dialog-demo__footer-actions">
                  <dads-button commandfor="#dialog-api-heading-focus" command="close" variant="outlined">
                    戻る
                  </dads-button>
                  <dads-button commandfor="#dialog-api-heading-focus" command="close">
                    続行する
                  </dads-button>
                </div>
              </dads-dialog>
            </div>

            <div class="dialog-demo__sample dialog-demo__sample--after-api-table">
              <h4 class="wc-api-panel__section-title">commandfor 作例（イベント確認）</h4>
              <p class="dialog-demo__sample-note">
                <code>defaultCommandStore.bind(...)</code> で <code>commandfor / command</code> を有効化し、開閉イベント（before-open / open / before-close / close）を記録します。
              </p>
              <div class="dialog-demo__commandfor-layout">
                <div class="dialog-demo__preview-surface dialog-demo__preview-surface--commandfor">
                  <dads-button commandfor="#dialog-api-commandfor" command="show-modal">
                    住民票の申請内容を確認
                  </dads-button>
                  <div class="dialog-demo__modal-stage">
                    <dads-dialog id="dialog-api-commandfor" data-preview-contained close-button close-label="閉じる" size="l">
                      <dads-heading slot="title" level="2" size="32" margin="none">申請内容を確定しますか？</dads-heading>
                      この操作を行うと、申請内容が確定されます。内容を確認してから実行してください。
                      <div slot="footer" class="dialog-demo__footer-actions">
                        <dads-button commandfor="#dialog-api-commandfor" command="close" variant="outlined">
                          戻る
                        </dads-button>
                        <dads-button commandfor="#dialog-api-commandfor" command="close">
                          確定する
                        </dads-button>
                      </div>
                    </dads-dialog>
                  </div>
                </div>
                <div class="dialog-demo__event-panel">
                  <strong>last events</strong>
                  <ol id="dialog-api-event-log" class="dialog-demo__event-list" aria-live="polite">
                    <li data-initial="true">none</li>
                  </ol>
                </div>
              </div>
              <script>
                (function() {
                  var currentScript = document.currentScript;
                  var root = currentScript && currentScript.parentElement;
                  if (!root || !root.isConnected) return;
                  if (root.hasAttribute('data-dialog-api-events-bound')) return;
                  root.setAttribute('data-dialog-api-events-bound', 'true');

                  var dialog = root.querySelector('#dialog-api-commandfor');
                  var log = root.querySelector('#dialog-api-event-log');
                  if (!dialog || !log) return;

                  var appendEvent = function(name) {
                    var initial = log.querySelector('[data-initial="true"]');
                    if (initial && initial.parentNode) initial.parentNode.removeChild(initial);
                    var li = document.createElement('li');
                    li.textContent = name;
                    log.insertBefore(li, log.firstChild);
                    while (log.children.length > 8) {
                      log.removeChild(log.lastElementChild);
                    }
                  };

                  [
                    'dads-dialog-before-open',
                    'dads-dialog-open',
                    'dads-dialog-before-close',
                    'dads-dialog-close',
                  ].forEach(function(eventName) {
                    dialog.addEventListener(eventName, function() { appendEvent(eventName); });
                  });
                })();
              <\/script>
            </div>
          `,
        })}
      </section>

      ${modulePreloadScript([
        'dads-dialog',
        'dads-list',
        'dads-heading',
        'dads-button',
        'dads-switch',
        'a11y-annotate',
      ])}
    </div>
  `,
};
