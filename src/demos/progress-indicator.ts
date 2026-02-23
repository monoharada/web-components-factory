import {
  API_TABLE_PROPS_HEADER,
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  renderApiPanelWrapper,
} from './shared.js';

export const demos = {

  spinner: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">スピナー</h2>
      <p style="color: #666; margin-bottom: 24px;">
        円形の回転アニメーションで非同期処理中を表示するコンポーネントです。
        indeterminate専用（進捗率の表示には <code>dads-progress-bar</code> を使用）。
      </p>

      <!-- API Panel -->
      ${renderApiPanelWrapper({
        imports: [
          'dads-spinner',
        ],
        body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; min-height: 120px;">
                <dads-spinner
                  data-api-target
                  label="読み込み中"
                ></dads-spinner>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
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
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>lg</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="lg">
                              <option value="sm">sm (24px)</option>
                              <option value="lg" selected>lg (48px)</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>composition</code></th>
                        <td><code>attr</code></td>
                        <td><code>stacked</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="composition" data-api-attr="composition" data-default="stacked">
                              <option value="stacked" selected>stacked</option>
                              <option value="inlined">inlined</option>
                            </select>
                          </div>
                        </td>
                        <td>レイアウト方向</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>underlay</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch label="underlay" data-api-attr="underlay" data-default="false"></dads-switch>
                          </div>
                        </td>
                        <td>カード背景表示</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="読み込み中"
                              data-api-attr="label"
                              data-default="読み込み中"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>表示ラベル兼アクセシブル名</td>
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
                        <th scope="row"><code>--dads-spinner-track-color</code></th>
                        <td>blue-100</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-spinner-track-color" value="" data-api-css-var="--dads-spinner-track-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-spinner-indicator-color</code></th>
                        <td>blue-1200</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-spinner-indicator-color" value="" data-api-css-var="--dads-spinner-indicator-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>インジケーター色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS Parts</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Part</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><th scope="row"><code>base</code></th><td>ルートコンテナ（role="progressbar"）</td></tr>
                      <tr><th scope="row"><code>underlay</code></th><td>カード背景</td></tr>
                      <tr><th scope="row"><code>svg</code></th><td>SVGコンテナ</td></tr>
                      <tr><th scope="row"><code>track</code></th><td>トラック円（背景）</td></tr>
                      <tr><th scope="row"><code>indicator</code></th><td>インジケーター円（アニメーション）</td></tr>
                      <tr><th scope="row"><code>label</code></th><td>ラベルテキスト</td></tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
        `,
      })}

      <!-- 作例 -->
      <section style="margin-top: 40px; margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">バリエーション一覧</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 32px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; align-items: end;">
          <div style="text-align: center;">
            <dads-spinner size="lg" label="Large"></dads-spinner>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">lg (48px)</p>
          </div>
          <div style="text-align: center;">
            <dads-spinner size="sm" label="Small"></dads-spinner>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">sm (24px)</p>
          </div>
          <div style="text-align: center;">
            <dads-spinner composition="inlined" label="Inlined"></dads-spinner>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">inlined</p>
          </div>
          <div style="text-align: center;">
            <dads-spinner underlay label="Underlay"></dads-spinner>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">underlay</p>
          </div>
        </div>
      </section>
    </div>
  `,

  progressBar: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">プログレスバー</h2>
      <p style="color: #666; margin-bottom: 24px;">
        水平バーで進捗状況を表示するコンポーネントです。
        <code>value</code> 未設定で indeterminate（不確定）、設定で determinate（確定）モードになります。
      </p>

      <!-- API Panel -->
      ${renderApiPanelWrapper({
        imports: [
          'dads-progress-bar',
        ],
        body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; min-height: 80px;">
                <dads-progress-bar
                  data-api-target
                  value="0.5"
                  label="ファイルアップロード中"
                  style="width: 240px;"
                ></dads-progress-bar>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
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
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="value"
                              value="0.5"
                              data-api-attr="value"
                              data-default="0.5"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>進捗値（0〜max、未設定=indeterminate）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>max</code></th>
                        <td><code>attr</code></td>
                        <td><code>1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="max"
                              value="1"
                              data-api-attr="max"
                              data-default="1"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>最大値</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>composition</code></th>
                        <td><code>attr</code></td>
                        <td><code>stacked</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="composition" data-api-attr="composition" data-default="stacked">
                              <option value="stacked" selected>stacked</option>
                              <option value="inlined">inlined</option>
                            </select>
                          </div>
                        </td>
                        <td>レイアウト方向</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>underlay</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch label="underlay" data-api-attr="underlay" data-default="false"></dads-switch>
                          </div>
                        </td>
                        <td>カード背景表示</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="ファイルアップロード中"
                              data-api-attr="label"
                              data-default="ファイルアップロード中"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>表示ラベル兼アクセシブル名</td>
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
                        <th scope="row"><code>--dads-progress-bar-track-color</code></th>
                        <td>blue-100</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-progress-bar-track-color" value="" data-api-css-var="--dads-progress-bar-track-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-progress-bar-indicator-color</code></th>
                        <td>blue-1200</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-progress-bar-indicator-color" value="" data-api-css-var="--dads-progress-bar-indicator-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>インジケーター色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS Parts</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Part</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><th scope="row"><code>base</code></th><td>ルートコンテナ（role="progressbar"）</td></tr>
                      <tr><th scope="row"><code>underlay</code></th><td>カード背景</td></tr>
                      <tr><th scope="row"><code>track</code></th><td>トラックバー（背景）</td></tr>
                      <tr><th scope="row"><code>indicator</code></th><td>インジケーターバー（進捗表示）</td></tr>
                      <tr><th scope="row"><code>label</code></th><td>ラベルテキスト</td></tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
        `,
      })}

      <!-- 作例 -->
      <section style="margin-top: 40px; margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">バリエーション一覧</h3>
        <div style="display: grid; gap: 32px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <div>
            <p style="margin-bottom: 8px; font-size: 14px; color: #888;">Determinate (50%)</p>
            <dads-progress-bar value="0.5" label="50%完了" style="width: 240px;"></dads-progress-bar>
          </div>
          <div>
            <p style="margin-bottom: 8px; font-size: 14px; color: #888;">Indeterminate</p>
            <dads-progress-bar label="読み込み中" style="width: 240px;"></dads-progress-bar>
          </div>
          <div>
            <p style="margin-bottom: 8px; font-size: 14px; color: #888;">Inlined</p>
            <dads-progress-bar composition="inlined" value="0.7" label="70%完了" style="width: 240px;"></dads-progress-bar>
          </div>
          <div>
            <p style="margin-bottom: 8px; font-size: 14px; color: #888;">Underlay</p>
            <dads-progress-bar underlay value="0.3" label="30%完了" style="width: 240px;"></dads-progress-bar>
          </div>
        </div>
      </section>
    </div>
  `,

  loadingIcon: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ローディングアイコン</h2>
      <p style="color: #666; margin-bottom: 24px;">
        砂時計アイコンで処理中状態を静的に表示するコンポーネントです。
        アニメーションは含まず、視覚的なインジケーターとして機能します。
      </p>

      <!-- API Panel -->
      ${renderApiPanelWrapper({
        imports: [
          'dads-loading-icon',
        ],
        body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; min-height: 120px;">
                <dads-loading-icon
                  data-api-target
                  label="処理中"
                ></dads-loading-icon>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
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
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>lg</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="lg">
                              <option value="sm">sm (24px)</option>
                              <option value="lg" selected>lg (48px)</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>composition</code></th>
                        <td><code>attr</code></td>
                        <td><code>stacked</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="composition" data-api-attr="composition" data-default="stacked">
                              <option value="stacked" selected>stacked</option>
                              <option value="inlined">inlined</option>
                            </select>
                          </div>
                        </td>
                        <td>レイアウト方向</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>underlay</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch label="underlay" data-api-attr="underlay" data-default="false"></dads-switch>
                          </div>
                        </td>
                        <td>カード背景表示</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="処理中"
                              data-api-attr="label"
                              data-default="処理中"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>表示ラベル兼アクセシブル名</td>
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
                        <th scope="row"><code>--dads-loading-icon-color</code></th>
                        <td>blue-1200</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-loading-icon-color" value="" data-api-css-var="--dads-loading-icon-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコン色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS Parts</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Part</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><th scope="row"><code>base</code></th><td>ルートコンテナ</td></tr>
                      <tr><th scope="row"><code>underlay</code></th><td>カード背景</td></tr>
                      <tr><th scope="row"><code>icon</code></th><td>砂時計SVG</td></tr>
                      <tr><th scope="row"><code>label</code></th><td>ラベルテキスト</td></tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
        `,
      })}

      <!-- 作例 -->
      <section style="margin-top: 40px; margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">バリエーション一覧</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 32px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; align-items: end;">
          <div style="text-align: center;">
            <dads-loading-icon size="lg" label="Large"></dads-loading-icon>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">lg (48px)</p>
          </div>
          <div style="text-align: center;">
            <dads-loading-icon size="sm" label="Small"></dads-loading-icon>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">sm (24px)</p>
          </div>
          <div style="text-align: center;">
            <dads-loading-icon composition="inlined" label="Inlined"></dads-loading-icon>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">inlined</p>
          </div>
          <div style="text-align: center;">
            <dads-loading-icon underlay label="Underlay"></dads-loading-icon>
            <p style="margin-top: 8px; font-size: 12px; color: #888;">underlay</p>
          </div>
        </div>
      </section>
    </div>
  `,

};
