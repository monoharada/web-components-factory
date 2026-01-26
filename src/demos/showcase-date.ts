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

  calendar: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">カレンダー</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 calendar.css と同等の見た目・操作になるよう実装したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-calendar">
          <div style="display: grid; place-content: center; padding: 40px 0;">
            <dads-calendar min-date="2024-01-01" max-date="2026-12-31"></dads-calendar>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-calendar',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-calendar data-api-target min-date="2024-01-01" max-date="2026-12-31"></dads-calendar>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-calendar min-date="2024-01-01" max-date="2026-12-31"></dads-calendar>
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
                        <th scope="row"><code>range</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="range" data-api-attr="range" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>期間選択モード</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>min-date</code></th>
                        <td><code>attr</code></td>
                        <td><code>2024-01-01</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="min-date" value="2024-01-01" data-api-attr="min-date" data-default="2024-01-01"></dads-input-text>
                          </div>
                        </td>
                        <td>最小日付（YYYY-MM-DD）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>max-date</code></th>
                        <td><code>attr</code></td>
                        <td><code>2026-12-31</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="max-date" value="2026-12-31" data-api-attr="max-date" data-default="2026-12-31"></dads-input-text>
                          </div>
                        </td>
                        <td>最大日付（YYYY-MM-DD）</td>
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
                        <th scope="row"><code>--dads-calendar-control-size</code></th>
                        <td><code>2.75rem</code><br><small style="color:#666">(44px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-calendar-control-size" value="" data-api-css-var="--dads-calendar-control-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>コントロールの高さ/幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-primitive-blue-900</code></th>
                        <td><code>#0017c1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-primitive-blue-900" value="" data-api-css-var="--color-primitive-blue-900" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>選択日の背景/期間ライン</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-primitive-yellow-300</code></th>
                        <td><code>#ffd43d</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-primitive-yellow-300" value="" data-api-css-var="--color-primitive-yellow-300" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカス背景/リング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-neutral-solid-gray-600</code></th>
                        <td><code>#666</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-neutral-solid-gray-600" value="" data-api-css-var="--color-neutral-solid-gray-600" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色（select等）</td>
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

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本</h3>
        <dads-calendar min-date="2024-01-01" max-date="2026-12-31"></dads-calendar>
      </section>

      <section style="margin-top: 32px; margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">期間選択（range）</h3>
        <p style="margin: 0 0 16px; color: #666; font-size: 14px;">
          開始日→終了日の順に選択します。選択状態はカレンダー下部に表示され、aria-live で読み上げも行います。
        </p>
        <dads-calendar range min-date="2024-01-01" max-date="2026-12-31"></dads-calendar>
      </section>
    </div>

    ${modulePreloadScript(['dads-calendar', 'dads-switch', 'a11y-annotate'])}
  `,


  datePicker: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">日付ピッカー</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 date-picker.css 相当をShadow DOM向けに移植したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-date-picker">
          <div style="display: grid; place-content: center; padding: 40px 0;">
            <dads-fieldset required>
              <span slot="legend">生年月日</span>
              <p slot="support-text">西暦で記入してください。例）2021年09月01日</p>
              <dads-date-picker calendar min-date="2024-01-01" max-date="2026-12-31"></dads-date-picker>
            </dads-fieldset>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-date-picker',
            'dads-calendar',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-date-picker
                  data-api-target
                  calendar
                  min-date="2024-01-01"
                  max-date="2026-12-31"
                  value="2024-01-02"
                  size="md"
                ></dads-date-picker>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-date-picker
                      calendar
                      min-date="2024-01-01"
                      max-date="2026-12-31"
                      value="2024-01-02"
                      size="md"
                    ></dads-date-picker>
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
                        <th scope="row"><code>calendar</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="calendar" data-api-attr="calendar" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>カレンダー表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>data-type</code></th>
                        <td><code>attr</code></td>
                        <td><code>consolidated</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="data-type" data-api-attr="data-type" data-default="">
                              <option value="" selected>consolidated</option>
                              <option value="separated">separated</option>
                            </select>
                          </div>
                        </td>
                        <td>表示タイプ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>md</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="md">
                              <option value="sm">sm</option>
                              <option value="md" selected>md</option>
                              <option value="lg">lg</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td><code>2024-01-02</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="value" value="2024-01-02" data-api-attr="value" data-default="2024-01-02"></dads-input-text>
                          </div>
                        </td>
                        <td>値（YYYY-MM-DD）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>min-date</code></th>
                        <td><code>attr</code></td>
                        <td><code>2024-01-01</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="min-date" value="2024-01-01" data-api-attr="min-date" data-default="2024-01-01"></dads-input-text>
                          </div>
                        </td>
                        <td>最小日付</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>max-date</code></th>
                        <td><code>attr</code></td>
                        <td><code>2026-12-31</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="max-date" value="2026-12-31" data-api-attr="max-date" data-default="2026-12-31"></dads-input-text>
                          </div>
                        </td>
                        <td>最大日付</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>error</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="error" data-api-attr="error" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>エラー状態</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>error-text</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="error-text" value="" data-api-attr="error-text" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>エラーテキスト（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>readonly</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="readonly" data-api-attr="readonly" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>読み取り専用</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>disabled</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="disabled" data-api-attr="disabled" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>無効状態</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                  ローカルCSS varsが薄いため、暫定でグローバルトークンを上書きして調整します。
                </p>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--spacing-4</code></th>
                        <td><code>1rem</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-4" value="" data-api-css-var="--spacing-4" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>gap / padding</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--spacing-2</code></th>
                        <td><code>0.5rem</code><br><small style="color:#666">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-2" value="" data-api-css-var="--spacing-2" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-neutral-solid-gray-600</code></th>
                        <td><code>#666</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-neutral-solid-gray-600" value="" data-api-css-var="--color-neutral-solid-gray-600" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-neutral-black</code></th>
                        <td><code>#000</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-neutral-black" value="" data-api-css-var="--color-neutral-black" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー/フォーカスのボーダー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-primitive-yellow-300</code></th>
                        <td><code>#ffd43d</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-primitive-yellow-300" value="" data-api-css-var="--color-primitive-yellow-300" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカスリング</td>
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

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">2タイプ（Consolidated / Separated）</h3>
        <div style="display: grid; gap: 24px;">
          <div>
            <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Consolidated</p>
            <dads-date-picker calendar></dads-date-picker>
          </div>
          <div>
            <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Separated</p>
            <dads-date-picker calendar data-type="separated"></dads-date-picker>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">状態</h3>
        <div style="display: grid; gap: 24px;">
          <div>
            <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Error</p>
            <dads-date-picker calendar error error-text="正しい日付を入力してください"></dads-date-picker>
          </div>
          <div>
            <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Readonly</p>
            <dads-date-picker calendar readonly value="2024-01-02"></dads-date-picker>
          </div>
          <div>
            <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Disabled</p>
            <dads-date-picker calendar disabled value="2024-01-02"></dads-date-picker>
          </div>
        </div>
      </section>
    </div>

    ${modulePreloadScript(['dads-date-picker', 'dads-calendar', 'dads-fieldset', 'dads-switch', 'a11y-annotate'])}
  `,
} as const;
