import {
  API_TABLE_PROPS_HEADER,
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  renderApiPanelWrapper,
  renderAnnotationToggleBlock,
  renderA11ySectionHeader,
} from './shared.js';

export const demos = {

  tab: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">タブ</h2>
      <p style="color: #666; margin-bottom: 24px;">
        APG Tabs Pattern 準拠のタブコンポーネントです。
        4方向レイアウト（top/bottom/left/right）、auto/manual アクティベーション、
        roving tabindex によるキーボードナビゲーションに対応しています。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate
          target-selector="#tab-annotate-target"
          callout-lane="side"
          style="
            --a11y-annotate-callout-gutter: clamp(5rem, 12vw, 10rem);
            --a11y-annotate-callout-lane-offset: 72px;
            --a11y-annotate-callout-lane-gap: 12px;
          "
        >
          <div style="display: grid; place-content: center; padding: 20px 0; max-width: 56rem;">
            <dads-tab id="tab-annotate-target">
              <div data-tab-label="概要">
                <p>概要の内容がここに表示されます。</p>
              </div>
              <div data-tab-label="詳細">
                <p>詳細の内容がここに表示されます。</p>
              </div>
              <div data-tab-label="関連情報">
                <p>関連情報がここに表示されます。</p>
              </div>
            </dads-tab>
          </div>
        </a11y-annotate>
      </section>

      <!-- 4方向レイアウト例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">4方向レイアウト</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          <div>
            <h4 style="font-size: 14px; color: #666; margin-bottom: 8px;">orientation="top"（デフォルト）</h4>
            <dads-tab orientation="top">
              <div data-tab-label="タブA">タブAの内容</div>
              <div data-tab-label="タブB">タブBの内容</div>
              <div data-tab-label="タブC">タブCの内容</div>
            </dads-tab>
          </div>

          <div>
            <h4 style="font-size: 14px; color: #666; margin-bottom: 8px;">orientation="bottom"</h4>
            <dads-tab orientation="bottom">
              <div data-tab-label="タブA">タブAの内容</div>
              <div data-tab-label="タブB">タブBの内容</div>
              <div data-tab-label="タブC">タブCの内容</div>
            </dads-tab>
          </div>

          <div>
            <h4 style="font-size: 14px; color: #666; margin-bottom: 8px;">orientation="left"</h4>
            <dads-tab orientation="left" style="min-height: 120px;">
              <div data-tab-label="タブA">タブAの内容</div>
              <div data-tab-label="タブB">タブBの内容</div>
              <div data-tab-label="タブC">タブCの内容</div>
            </dads-tab>
          </div>

          <div>
            <h4 style="font-size: 14px; color: #666; margin-bottom: 8px;">orientation="right"</h4>
            <dads-tab orientation="right" style="min-height: 120px;">
              <div data-tab-label="タブA">タブAの内容</div>
              <div data-tab-label="タブB">タブBの内容</div>
              <div data-tab-label="タブC">タブCの内容</div>
            </dads-tab>
          </div>
        </div>
      </section>

      <!-- Disabled タブ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Disabled タブ</h3>
        <dads-tab>
          <div data-tab-label="有効なタブ1">有効なタブ1の内容</div>
          <div data-tab-label="無効なタブ" data-tab-disabled>このタブは無効です</div>
          <div data-tab-label="有効なタブ2">有効なタブ2の内容</div>
        </dads-tab>
      </section>

      <!-- Manual アクティベーション -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Manual アクティベーション</h3>
        <p style="color: #666; margin-bottom: 8px; font-size: 14px;">
          矢印キーでフォーカス移動のみ。Enter/Space で選択を確定します。
        </p>
        <dads-tab activation-mode="manual">
          <div data-tab-label="手動タブ1">手動タブ1の内容</div>
          <div data-tab-label="手動タブ2">手動タブ2の内容</div>
          <div data-tab-label="手動タブ3">手動タブ3の内容</div>
        </dads-tab>
      </section>

      <!-- API Panel -->
      ${renderApiPanelWrapper({
        imports: [
          'dads-tab',
        ],
        body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; min-height: 120px;">
                <dads-tab
                  data-api-target
                  orientation="top"
                  activation-mode="auto"
                  selected-index="0"
                >
                  <div data-tab-label="タブ1">タブ1のコンテンツです。</div>
                  <div data-tab-label="タブ2">タブ2のコンテンツです。</div>
                  <div data-tab-label="タブ3">タブ3のコンテンツです。</div>
                </dads-tab>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <p class="wc-api-panel__section-note">
                  ※ <code>tablist</code> は Shadow DOM 内で自動生成されます。<br />
                  Light DOM では <code>data-tab-label</code> 付きパネルのみを記述します。
                </p>
                <dads-code-block data-api-code></dads-code-block>
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
                        <th scope="row"><code>orientation</code></th>
                        <td><code>attr</code></td>
                        <td><code>top</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="orientation" data-api-attr="orientation" data-default="top">
                              <option value="top" selected>top</option>
                              <option value="bottom">bottom</option>
                              <option value="left">left</option>
                              <option value="right">right</option>
                            </select>
                          </div>
                        </td>
                        <td>タブリストの配置方向</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>activation-mode</code></th>
                        <td><code>attr</code></td>
                        <td><code>auto</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="activation-mode" data-api-attr="activation-mode" data-default="auto">
                              <option value="auto" selected>auto</option>
                              <option value="manual">manual</option>
                            </select>
                          </div>
                        </td>
                        <td>アクティベーションモード</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>selected-index</code></th>
                        <td><code>attr</code></td>
                        <td><code>0</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="selected-index" data-api-attr="selected-index" data-default="0">
                              <option value="0" selected>0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                            </select>
                          </div>
                        </td>
                        <td>選択中のタブインデックス</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>data-tab-label</code> (panel 1)</th>
                        <td><code>attr</code></td>
                        <td><code>タブ1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="panel-1-label"
                              data-api-attr="data-tab-label"
                              data-api-target-selector="[data-api-target] > div:nth-of-type(1)"
                              data-default="タブ1"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>1つ目パネルのタブラベル</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>data-tab-label</code> (panel 2)</th>
                        <td><code>attr</code></td>
                        <td><code>タブ2</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="panel-2-label"
                              data-api-attr="data-tab-label"
                              data-api-target-selector="[data-api-target] > div:nth-of-type(2)"
                              data-default="タブ2"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>2つ目パネルのタブラベル</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>data-tab-label</code> (panel 3)</th>
                        <td><code>attr</code></td>
                        <td><code>タブ3</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="panel-3-label"
                              data-api-attr="data-tab-label"
                              data-api-target-selector="[data-api-target] > div:nth-of-type(3)"
                              data-default="タブ3"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>3つ目パネルのタブラベル</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                ${API_TABLE_CSS_VARS_NOTE}
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-tab-background</code></th>
                        <td>--tab-bg-default</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-background" data-api-css-var="--dads-tab-background"></dads-input-text>
                          </div>
                        </td>
                        <td>タブ背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-background-hover</code></th>
                        <td>--tab-bg-hover</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-background-hover" data-api-css-var="--dads-tab-background-hover"></dads-input-text>
                          </div>
                        </td>
                        <td>タブホバー時背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-color</code></th>
                        <td>--tab-text-default</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-color" data-api-css-var="--dads-tab-color"></dads-input-text>
                          </div>
                        </td>
                        <td>タブテキスト色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-color-selected</code></th>
                        <td>--tab-text-selected</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-color-selected" data-api-css-var="--dads-tab-color-selected"></dads-input-text>
                          </div>
                        </td>
                        <td>選択タブテキスト色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-color-disabled</code></th>
                        <td>--tab-text-disabled</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-color-disabled" data-api-css-var="--dads-tab-color-disabled"></dads-input-text>
                          </div>
                        </td>
                        <td>無効タブテキスト色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-border-color</code></th>
                        <td>--tab-border-default</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-border-color" data-api-css-var="--dads-tab-border-color"></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-indicator-color</code></th>
                        <td>--tab-border-active</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-indicator-color" data-api-css-var="--dads-tab-indicator-color"></dads-input-text>
                          </div>
                        </td>
                        <td>インジケーター色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-indicator-height</code></th>
                        <td>6px</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-indicator-height" data-api-css-var="--dads-tab-indicator-height"></dads-input-text>
                          </div>
                        </td>
                        <td>インジケーター高さ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-focus-outline-color</code></th>
                        <td>--tab-focus-outline-color</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-focus-outline-color" data-api-css-var="--dads-tab-focus-outline-color"></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカスアウトライン色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-tab-focus-ring-color</code></th>
                        <td>--tab-focus-ring-color</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-tab-focus-ring-color" data-api-css-var="--dads-tab-focus-ring-color"></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカスリング色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
        `,
      })}
    </div>
  `,

};
