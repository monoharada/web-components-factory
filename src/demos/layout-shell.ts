import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_WITH_TYPE_HEADER,
  modulePreloadScript,
  renderApiPanelWrapper,
} from './shared.js';

function slotBlock(params: {
  slot?: 'header' | 'footer';
  region: 'header' | 'sidebar' | 'main' | 'aside' | 'footer';
  label: string;
  body?: string;
}): string {
  const slotAttr = params.slot ? ` slot="${params.slot}"` : '';
  const body = params.body ?? '';
  return `
    <div${slotAttr} class="layout-shell-slot" data-slot="${params.region}">
      <p class="layout-shell-slot-label">${params.label}</p>
      ${body}
    </div>
  `;
}

function previewControls(): string {
  return `
    <div class="layout-shell-preview-controls">
      <p class="layout-shell-preview-controls-label">プレビュー幅</p>
      <input class="layout-shell-preview-controls-range" data-layout-shell-preview-range type="range" min="320" max="1454" step="1" value="1454" aria-label="プレビュー幅">
      <p class="layout-shell-preview-controls-value" data-layout-shell-preview-value>1454px</p>
      <div class="layout-shell-preview-controls-presets" role="group" aria-label="デバイスプリセット">
        <button type="button" class="layout-shell-preview-controls-preset" data-layout-shell-preview-preset="1454" data-layout-shell-preview-device="desktop" aria-pressed="true">D</button>
        <button type="button" class="layout-shell-preview-controls-preset" data-layout-shell-preview-preset="782" data-layout-shell-preview-device="tablet" aria-pressed="false">T</button>
        <button type="button" class="layout-shell-preview-controls-preset" data-layout-shell-preview-preset="405" data-layout-shell-preview-device="mobile" aria-pressed="false">M</button>
      </div>
    </div>
  `;
}

function previewControlsScript(): string {
  return `
    <script>
      (function() {
        var resolveDeviceFromWidth = function(widthPx) {
          var remPx = 16;
          var root = document.documentElement;
          if (root && typeof window.getComputedStyle === 'function') {
            var parsed = parseFloat(window.getComputedStyle(root).fontSize || '');
            if (Number.isFinite(parsed) && parsed > 0) {
              remPx = parsed;
            }
          }

          if (widthPx >= remPx * 80) return 'desktop';
          if (widthPx >= remPx * 48) return 'tablet';
          return 'mobile';
        };

        var applyWidth = function(preview, rawValue) {
          var parsed = Number(rawValue);
          if (!Number.isFinite(parsed)) parsed = 1454;
          var clamped = Math.max(320, Math.min(1454, Math.round(parsed)));

          preview.style.setProperty('--layout-shell-preview-width', clamped + 'px');
          preview.setAttribute('data-layout-shell-preview-width', String(clamped));

          var range = preview.querySelector('[data-layout-shell-preview-range]');
          if (range && range.value !== String(clamped)) {
            range.value = String(clamped);
          }

          var valueEl = preview.querySelector('[data-layout-shell-preview-value]');
          if (valueEl) {
            valueEl.textContent = clamped + 'px';
          }

          return clamped;
        };

        var syncPreviewDevice = function(preview, preferredDevice) {
          var raw = preview.getAttribute('data-layout-shell-preview-width');
          var widthPx = raw ? Number(raw) : NaN;
          var device = preferredDevice || resolveDeviceFromWidth(widthPx);

          var deviceButtons = preview.querySelectorAll('[data-layout-shell-preview-device]');
          for (var i = 0; i < deviceButtons.length; i++) {
            var button = deviceButtons[i];
            var matches = button.getAttribute('data-layout-shell-preview-device') === device;
            button.setAttribute('aria-pressed', matches ? 'true' : 'false');
          }

          var mocks = preview.querySelectorAll('dads-device-mock.layout-shell-device');
          for (var j = 0; j < mocks.length; j++) {
            mocks[j].setAttribute('device', device);
          }

          var shells = preview.querySelectorAll('dads-layout-shell');
          for (var k = 0; k < shells.length; k++) {
            shells[k].setAttribute('mode', device);
          }
        };

        var bindPreview = function(preview) {
          if (preview.hasAttribute('data-layout-shell-preview-bound')) return;
          preview.setAttribute('data-layout-shell-preview-bound', '');

          var range = preview.querySelector('[data-layout-shell-preview-range]');
          if (range) {
            var onRangeInput = function() {
              applyWidth(preview, range.value);
              syncPreviewDevice(preview);
            };
            range.addEventListener('input', onRangeInput);
            range.addEventListener('change', onRangeInput);
          }

          var presets = preview.querySelectorAll('[data-layout-shell-preview-preset]');
          for (var i = 0; i < presets.length; i++) {
            presets[i].addEventListener('click', function(event) {
              var target = event.currentTarget;
              if (!target) return;
              var width = target.getAttribute('data-layout-shell-preview-preset');
              var device = target.getAttribute('data-layout-shell-preview-device');
              applyWidth(preview, width);
              syncPreviewDevice(preview, device || undefined);
            });
          }

          var initialWidth = range ? range.value : (preview.getAttribute('data-layout-shell-preview-width') || '1454');
          applyWidth(preview, initialWidth);
          syncPreviewDevice(preview);
        };

        var setup = function(root) {
          var previews = root.querySelectorAll('[data-layout-shell-preview]');
          for (var i = 0; i < previews.length; i++) {
            bindPreview(previews[i]);
          }
        };

        if (!window.__dadsLayoutShellInitPreviewControls) {
          window.__dadsLayoutShellInitPreviewControls = setup;
        }

        var currentScript = document.currentScript;
        var scope = currentScript && currentScript.parentElement ? currentScript.parentElement : document;
        window.__dadsLayoutShellInitPreviewControls(scope);
      })();
    <\/script>
  `;
}

export const demos = {
  layoutShell: () => `
    <div style="padding: clamp(10px, 1.2vw, 16px); max-width: min(100%, 1920px); margin: 0 auto;">
      <style>
        .layout-shell-device {
          --dads-device-mock-frame-width: min(100%, var(--layout-shell-preview-width, calc(1454 / 16 * 1rem)));
          --dads-device-mock-screen-background: #f3f4f6;
        }

        .layout-shell-device + .layout-shell-device {
          margin-top: 10px;
        }

        .layout-shell-preview {
          --layout-shell-preview-width: calc(1454 / 16 * 1rem);
          display: grid;
          gap: 8px;
        }

        .layout-shell-preview-controls {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .layout-shell-preview-controls-label {
          margin: 0;
          font-family: var(--font-family-sans);
          font-size: var(--font-size-14);
          font-weight: var(--font-weight-700);
          line-height: var(--line-height-150);
          color: #334155;
        }

        .layout-shell-preview-controls-range {
          margin: 0;
          inline-size: min(100%, 22rem);
          flex: 1 1 14rem;
          accent-color: #334155;
        }

        .layout-shell-preview-controls-value {
          margin: 0;
          min-inline-size: 7ch;
          font-family: var(--font-family-mono, var(--font-family-sans));
          font-size: var(--font-size-14);
          line-height: var(--line-height-150);
          color: #334155;
          text-align: right;
        }

        .layout-shell-preview-controls-presets {
          display: inline-flex;
          gap: 4px;
        }

        .layout-shell-preview-controls-preset {
          margin: 0;
          border: 1px solid #cbd5e1;
          border-radius: 0;
          background: #ffffff;
          color: #334155;
          padding: 4px 8px;
          font-family: var(--font-family-sans);
          font-size: var(--font-size-14);
          line-height: var(--line-height-150);
          cursor: pointer;
        }

        .layout-shell-preview-controls-preset[aria-pressed='true'] {
          background: #334155;
          border-color: #334155;
          color: #ffffff;
        }

        .layout-shell-demo-shell {
          display: block;
          border: 1px solid #cbd5e1;
          border-radius: 0;
          background: #ffffff;
          --dads-layout-shell-inline-padding: 0;
          --dads-layout-shell-block-gap: 0;
          --dads-layout-shell-main-max-width: 100%;
          block-size: 100%;
          min-block-size: 100%;
        }

        .layout-shell-demo-shell::part(base) {
          block-size: 100%;
          min-block-size: 100%;
          grid-template-rows: auto minmax(0, 1fr) auto;
        }

        .layout-shell-demo-shell::part(body) {
          block-size: 100%;
          min-block-size: 0;
          align-items: stretch;
        }

        .layout-shell-demo-shell::part(main),
        .layout-shell-demo-shell::part(sidebar),
        .layout-shell-demo-shell::part(aside) {
          block-size: 100%;
          min-block-size: 0;
        }

        .layout-shell-slot {
          border: 0;
          border-radius: 0;
          padding: clamp(10px, 1vw, 12px);
          box-sizing: border-box;
        }

        .layout-shell-slot-label {
          margin: 0 0 8px;
          font-family: var(--font-family-sans);
          font-size: var(--font-size-16);
          font-weight: var(--font-weight-700);
          line-height: var(--line-height-150);
          letter-spacing: 0;
          color: #334155;
          text-transform: none;
        }

        .layout-shell-slot[data-slot='header'] {
          background: #f1f5f9;
        }

        .layout-shell-slot[data-slot='sidebar'] {
          background: #e2e8f0;
        }

        .layout-shell-slot[data-slot='main'] {
          background: #f8fafc;
        }

        .layout-shell-slot[data-slot='aside'] {
          background: #f1f5f9;
        }

        .layout-shell-slot[data-slot='footer'] {
          background: #e2e8f0;
        }

        .layout-shell-slot[data-slot='sidebar'],
        .layout-shell-slot[data-slot='main'],
        .layout-shell-slot[data-slot='aside'] {
          min-block-size: 0;
          block-size: 100%;
        }

        dads-layout-sidebar[slot='sidebar'],
        dads-layout-aside[slot='aside'] {
          block-size: 100%;
          align-self: stretch;
        }

        dads-layout-sidebar[slot='sidebar']::part(base),
        dads-layout-aside[slot='aside']::part(base) {
          block-size: 100%;
          min-block-size: 0;
          display: flex;
          flex-direction: column;
        }

        dads-layout-sidebar[slot='sidebar'] > .layout-shell-slot[data-slot='sidebar'],
        dads-layout-aside[slot='aside'] > .layout-shell-slot[data-slot='aside'] {
          inline-size: 100%;
          block-size: 100%;
          min-block-size: 0;
          display: flex;
          flex-direction: column;
        }

        .layout-shell-note {
          margin-top: 12px;
          font-size: var(--font-size-14);
          line-height: var(--line-height-150);
          color: #475569;
        }

        .layout-shell-css-vars-details {
          margin-top: 12px;
        }

        .layout-shell-css-vars-summary {
          cursor: pointer;
          font-family: var(--font-family-sans);
          font-size: var(--font-size-14);
          line-height: var(--line-height-150);
          color: #334155;
        }
      </style>

      <h2 style="font-size: 28px; margin-bottom: 12px; color: #333;">レイアウトシェル</h2>
      <p style="color: #555; margin-bottom: 32px;">
        各パターンを単純なブロックUIで可視化し、ヘッダー・サイドバー・メイン・補助領域の配置を確認できるデモです（デバイスボタン/幅調整でレスポンシブ確認）。
      </p>

      ${modulePreloadScript([
        'dads-layout-shell',
        'dads-layout-sidebar',
        'dads-layout-aside',
        'dads-device-mock',
      ])}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          <code>pattern</code> / <code>mobile-sidebar</code> と、デバイスボタン・プレビュー幅でレイアウト変化を確認できます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-layout-shell',
            'dads-layout-sidebar',
            'dads-layout-aside',
            'dads-device-mock',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 0; background: #f8fafc;">
                <div class="layout-shell-preview" data-layout-shell-preview>
                  ${previewControls()}
                  <dads-device-mock class="layout-shell-device" device="desktop">
                    <dads-layout-shell class="layout-shell-demo-shell" data-api-target pattern="app-shell" mode="auto" data-dads-typeset>
                      ${slotBlock({
                        slot: 'header',
                        region: 'header',
                        label: 'ヘッダー',
                      })}

                      <dads-layout-sidebar slot="sidebar" style="--dads-layout-sidebar-background: #e2e8f0; --dads-layout-sidebar-border-color: transparent; --dads-layout-sidebar-padding: 8px; --border-radius-8: 0;">
                        ${slotBlock({
                          region: 'sidebar',
                          label: 'サイドバー',
                        })}
                      </dads-layout-sidebar>

                      <section class="layout-shell-slot" data-slot="main">
                        <p class="layout-shell-slot-label">メイン</p>
                      </section>

                      <dads-layout-aside slot="aside" style="--dads-layout-aside-background: #f1f5f9; --dads-layout-aside-border-color: transparent; --dads-layout-aside-padding: 8px; --border-radius-8: 0;">
                        ${slotBlock({
                          region: 'aside',
                          label: '補助領域',
                        })}
                      </dads-layout-aside>

                      ${slotBlock({
                        slot: 'footer',
                        region: 'footer',
                        label: 'フッター',
                      })}
                    </dads-layout-shell>
                  </dads-device-mock>
                </div>
                <p class="layout-shell-note">※ app-shell + desktop が初期状態です。pattern / mobile-sidebar とデバイス切替で可視領域が変化します。</p>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">使用例（HTML）</h4>
                <dads-code-block data-api-code>
                  <template>
<dads-layout-shell pattern="app-shell" mode="auto" mobile-sidebar="bottom" data-dads-typeset>
  <div slot="header">...</div>
  <dads-layout-sidebar slot="sidebar">...</dads-layout-sidebar>
  <section>...</section>
  <dads-layout-aside slot="aside">...</dads-layout-aside>
  <div slot="footer">...</div>
</dads-layout-shell>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>pattern</code></th>
                        <td><code>attr</code></td>
                        <td><code>'website' | 'app-shell' | 'master-detail' | 'left-header-pane' | 'three-pane' | 'three-pane-shell'</code></td>
                        <td><code>app-shell</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="pattern" data-api-attr="pattern" data-default="app-shell">
                              <option value="app-shell" selected>app-shell</option>
                              <option value="website">website</option>
                              <option value="master-detail">master-detail</option>
                              <option value="left-header-pane">left-header-pane</option>
                              <option value="three-pane">three-pane</option>
                              <option value="three-pane-shell">three-pane-shell</option>
                            </select>
                          </div>
                        </td>
                        <td>レイアウトパターン</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>mobile-sidebar</code></th>
                        <td><code>attr</code></td>
                        <td><code>'hidden' | 'top' | 'bottom'</code></td>
                        <td><code>bottom</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="mobile-sidebar" data-api-attr="mobile-sidebar" data-default="bottom">
                              <option value="bottom" selected>bottom</option>
                              <option value="top">top</option>
                              <option value="hidden">hidden</option>
                            </select>
                          </div>
                        </td>
                        <td>app-shell + mobile 時のサイドバー位置</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <p class="wc-api-panel__section-note">
                  基本は <code>space</code> / <code>pane-width</code> / <code>main-max-width</code> の3値だけ調整し、mobileは <code>space × mobile-space-scale</code> で自動連動します。
                </p>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-layout-shell-space</code></th>
                        <td><code>1.5rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-layout-shell-space"
                              value=""
                              data-api-css-var="--dads-layout-shell-space"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>余白の基本値（inline-padding / block-gap に連動）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-layout-shell-pane-width</code></th>
                        <td><code>18rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-layout-shell-pane-width"
                              value=""
                              data-api-css-var="--dads-layout-shell-pane-width"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ペイン幅の基本値（sidebar / rail / aside に連動）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-layout-shell-main-max-width</code></th>
                        <td><code>75rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-layout-shell-main-max-width"
                              value=""
                              data-api-css-var="--dads-layout-shell-main-max-width"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>website時のmain最大幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-layout-shell-mobile-space-scale</code></th>
                        <td><code>0.6666666667</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-layout-shell-mobile-space-scale"
                              value=""
                              data-api-css-var="--dads-layout-shell-mobile-space-scale"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>mobile時の余白倍率（spaceに乗算）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>

                <details class="layout-shell-css-vars-details">
                  <summary class="layout-shell-css-vars-summary">詳細上書き（既存6項目 + mobile倍率）</summary>
                  <dads-table>
                    <table class="wc-api-table" data-cell-border="bottom">
                      ${API_TABLE_CSS_VARS_HEADER}
                      <tbody>
                        <tr>
                          <th scope="row"><code>--dads-layout-shell-inline-padding</code></th>
                          <td><code>var(--dads-layout-shell-space)</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text
                                label="--dads-layout-shell-inline-padding"
                                value=""
                                data-api-css-var="--dads-layout-shell-inline-padding"
                                data-default=""
                              ></dads-input-text>
                            </div>
                          </td>
                          <td>左右余白を個別上書き</td>
                        </tr>
                        <tr>
                          <th scope="row"><code>--dads-layout-shell-block-gap</code></th>
                          <td><code>var(--dads-layout-shell-space)</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text
                                label="--dads-layout-shell-block-gap"
                                value=""
                                data-api-css-var="--dads-layout-shell-block-gap"
                                data-default=""
                              ></dads-input-text>
                            </div>
                          </td>
                          <td>ブロック間ギャップを個別上書き</td>
                        </tr>
                        <tr>
                          <th scope="row"><code>--dads-layout-shell-main-max-width</code></th>
                          <td><code>75rem</code></td>
                          <td><code>基本3項目の同名変数を使用</code></td>
                          <td>website時のmain最大幅（基本欄と同一）</td>
                        </tr>
                        <tr>
                          <th scope="row"><code>--dads-layout-shell-mobile-space-scale</code></th>
                          <td><code>0.6666666667</code></td>
                          <td><code>基本欄の同名変数を使用</code></td>
                          <td>mobile時の余白倍率（基本欄と同一）</td>
                        </tr>
                        <tr>
                          <th scope="row"><code>--dads-layout-shell-sidebar-width</code></th>
                          <td><code>var(--dads-layout-shell-pane-width)</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text
                                label="--dads-layout-shell-sidebar-width"
                                value=""
                                data-api-css-var="--dads-layout-shell-sidebar-width"
                                data-default=""
                              ></dads-input-text>
                            </div>
                          </td>
                          <td>desktop時のsidebar幅を個別上書き</td>
                        </tr>
                        <tr>
                          <th scope="row"><code>--dads-layout-shell-sidebar-rail-width</code></th>
                          <td><code>calc(var(--dads-layout-shell-pane-width) * 5 / 18)</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text
                                label="--dads-layout-shell-sidebar-rail-width"
                                value=""
                                data-api-css-var="--dads-layout-shell-sidebar-rail-width"
                                data-default=""
                              ></dads-input-text>
                            </div>
                          </td>
                          <td>tablet時のsidebar幅を個別上書き</td>
                        </tr>
                        <tr>
                          <th scope="row"><code>--dads-layout-shell-aside-width</code></th>
                          <td><code>calc(var(--dads-layout-shell-pane-width) + 4rem)</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text
                                label="--dads-layout-shell-aside-width"
                                value=""
                                data-api-css-var="--dads-layout-shell-aside-width"
                                data-default=""
                              ></dads-input-text>
                            </div>
                          </td>
                          <td>master-detail時のaside幅を個別上書き</td>
                        </tr>
                      </tbody>
                    </table>
                  </dads-table>
                </details>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <section style="margin-bottom: 32px;" data-layout-example="website">
        <h3 style="font-size: 20px; margin-bottom: 12px; color: #333;">パターン1: ウェブサイト（ヒーロー + セクション + フッター）</h3>
        <div class="layout-shell-preview" data-layout-shell-preview>
          ${previewControls()}
          <dads-device-mock class="layout-shell-device" device="desktop">
            <dads-layout-shell class="layout-shell-demo-shell" pattern="website" mode="auto" data-dads-typeset>
              ${slotBlock({
                slot: 'header',
                region: 'header',
                label: 'ヘッダー',
              })}
              <section class="layout-shell-slot" data-slot="main">
                <p class="layout-shell-slot-label">メイン</p>
              </section>
              ${slotBlock({
                slot: 'footer',
                region: 'footer',
                label: 'フッター',
              })}
            </dads-layout-shell>
          </dads-device-mock>
        </div>
      </section>

      <section style="margin-bottom: 32px;" data-layout-example="app-shell">
        <h3 style="font-size: 20px; margin-bottom: 12px; color: #333;">パターン2: 業務アプリ / SaaS（ヘッダー + サイドバー + メイン）</h3>
        <div class="layout-shell-preview" data-layout-shell-preview>
          ${previewControls()}
          <dads-device-mock class="layout-shell-device" device="desktop">
            <dads-layout-shell class="layout-shell-demo-shell" pattern="app-shell" mode="auto" data-dads-typeset>
              ${slotBlock({
                slot: 'header',
                region: 'header',
                label: 'ヘッダー',
              })}

              <dads-layout-sidebar slot="sidebar" style="--dads-layout-sidebar-background: #e2e8f0; --dads-layout-sidebar-border-color: transparent; --dads-layout-sidebar-padding: 8px; --border-radius-8: 0;">
                ${slotBlock({
                  region: 'sidebar',
                  label: 'サイドバー',
                })}
              </dads-layout-sidebar>

              <section class="layout-shell-slot" data-slot="main">
                <p class="layout-shell-slot-label">メイン</p>
              </section>
            </dads-layout-shell>
          </dads-device-mock>
        </div>
      </section>

      <section data-layout-example="master-detail">
        <h3 style="font-size: 20px; margin-bottom: 12px; color: #333;">パターン3: マスター詳細（メイン + 補助領域）</h3>
        <div class="layout-shell-preview" data-layout-shell-preview>
          ${previewControls()}
          <dads-device-mock class="layout-shell-device" device="desktop">
            <dads-layout-shell class="layout-shell-demo-shell" pattern="master-detail" mode="auto" data-dads-typeset>
              <section class="layout-shell-slot" data-slot="main">
                <p class="layout-shell-slot-label">メイン</p>
              </section>

              <dads-layout-aside slot="aside" style="--dads-layout-aside-background: #f1f5f9; --dads-layout-aside-border-color: transparent; --dads-layout-aside-padding: 8px; --border-radius-8: 0;">
                ${slotBlock({
                  region: 'aside',
                  label: '補助領域',
                })}
              </dads-layout-aside>
            </dads-layout-shell>
          </dads-device-mock>
        </div>
      </section>

      <section style="margin-top: 32px;" data-layout-example="left-header-pane">
        <h3 style="font-size: 20px; margin-bottom: 12px; color: #333;">パターン4: 左ペインヘッダー（ヘッダー + メイン + フッター）</h3>
        <div class="layout-shell-preview" data-layout-shell-preview>
          ${previewControls()}
          <dads-device-mock class="layout-shell-device" device="desktop">
            <dads-layout-shell class="layout-shell-demo-shell" pattern="left-header-pane" mode="auto" data-dads-typeset>
              ${slotBlock({
                slot: 'header',
                region: 'header',
                label: 'ヘッダー（左ペイン）',
              })}

              <section class="layout-shell-slot" data-slot="main">
                <p class="layout-shell-slot-label">メイン</p>
              </section>

              ${slotBlock({
                slot: 'footer',
                region: 'footer',
                label: 'フッター',
              })}
            </dads-layout-shell>
          </dads-device-mock>
        </div>
      </section>

      <section style="margin-top: 32px;" data-layout-example="three-pane">
        <h3 style="font-size: 20px; margin-bottom: 12px; color: #333;">パターン5: 3ペイン（サイドバー + メイン + 補助領域）</h3>
        <div class="layout-shell-preview" data-layout-shell-preview>
          ${previewControls()}
          <dads-device-mock class="layout-shell-device" device="desktop">
            <dads-layout-shell class="layout-shell-demo-shell" pattern="three-pane" mode="auto" data-dads-typeset>
              <dads-layout-sidebar slot="sidebar" style="--dads-layout-sidebar-background: #e2e8f0; --dads-layout-sidebar-border-color: transparent; --dads-layout-sidebar-padding: 0; --border-radius-8: 0;">
                ${slotBlock({
                  region: 'sidebar',
                  label: 'サイドバー',
                })}
              </dads-layout-sidebar>

              <section class="layout-shell-slot" data-slot="main">
                <p class="layout-shell-slot-label">メイン</p>
              </section>

              <dads-layout-aside slot="aside" style="--dads-layout-aside-background: #f1f5f9; --dads-layout-aside-border-color: transparent; --dads-layout-aside-padding: 0; --border-radius-8: 0;">
                ${slotBlock({
                  region: 'aside',
                  label: '補助領域',
                })}
              </dads-layout-aside>
            </dads-layout-shell>
          </dads-device-mock>
        </div>
      </section>

      <section style="margin-top: 32px;" data-layout-example="three-pane-shell">
        <h3 style="font-size: 20px; margin-bottom: 12px; color: #333;">パターン6: 3ペイン + ヘッダー・フッター</h3>
        <div class="layout-shell-preview" data-layout-shell-preview>
          ${previewControls()}
          <dads-device-mock class="layout-shell-device" device="desktop">
            <dads-layout-shell class="layout-shell-demo-shell" pattern="three-pane-shell" mode="auto" data-dads-typeset>
              ${slotBlock({
                slot: 'header',
                region: 'header',
                label: 'ヘッダー',
              })}

              <dads-layout-sidebar slot="sidebar" style="--dads-layout-sidebar-background: #e2e8f0; --dads-layout-sidebar-border-color: transparent; --dads-layout-sidebar-padding: 0; --border-radius-8: 0;">
                ${slotBlock({
                  region: 'sidebar',
                  label: 'サイドバー',
                })}
              </dads-layout-sidebar>

              <section class="layout-shell-slot" data-slot="main">
                <p class="layout-shell-slot-label">メイン</p>
              </section>

              <dads-layout-aside slot="aside" style="--dads-layout-aside-background: #f1f5f9; --dads-layout-aside-border-color: transparent; --dads-layout-aside-padding: 0; --border-radius-8: 0;">
                ${slotBlock({
                  region: 'aside',
                  label: '補助領域',
                })}
              </dads-layout-aside>

              ${slotBlock({
                slot: 'footer',
                region: 'footer',
                label: 'フッター',
              })}
            </dads-layout-shell>
          </dads-device-mock>
        </div>
      </section>

      ${previewControlsScript()}
    </div>
  `,
};
