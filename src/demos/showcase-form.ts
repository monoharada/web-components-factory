import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  API_TABLE_PROPS_WITH_TYPE_HEADER,
  annotationToggleScript,
  annotationToggleUI,
  renderApiPanelWrapper,
} from './shared.js';

export const demos = {
  checkbox: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">チェックボックス</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 checkbox.css と同一の見た目になるよう実装したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます（Annotateのバッジにバージョン表示）。
        </p>

        <a11y-annotate target-selector="dads-fieldset">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <form class="checkbox-validation">
              <dads-fieldset required>
                <span slot="legend">利用規約</span>
                <p slot="support-text">送信ボタンでrequiredバリデーションを確認できます。</p>
                <dads-checkbox
                  label="利用規約に同意する"
                  size="sm"
                  name="agreement"
                  value="yes"
                  required
                  auto-validate
                ></dads-checkbox>
              </dads-fieldset>

              <div>
                <dads-button type="submit">送信</dads-button>
              </div>
            </form>
          </div>

          <style>
            .checkbox-validation {
              display: grid;
              gap: 12px;
              width: 520px;
            }

            .checkbox-validation dads-checkbox {
              display: block;
            }
          </style>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-checkbox',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-checkbox data-api-target label="同意する" size="md"></dads-checkbox>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-checkbox label="同意する" size="md"></dads-checkbox>
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
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>同意する</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="同意する"
                              data-api-attr="label"
                              data-default="同意する"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ラベルテキスト</td>
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
                        <th scope="row"><code>checked</code></th>
                        <td><code>prop</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="checked" data-api-prop="checked" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>チェック状態</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>indeterminate</code></th>
                        <td><code>prop</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="indeterminate" data-api-prop="indeterminate" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>不確定状態</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>required</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="required" data-api-attr="required" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>必須（※必須ラベル表示）</td>
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
                            <dads-input-text
                              label="error-text"
                              value=""
                              data-api-attr="error-text"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>エラーメッセージ（フォールバック）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                  <code>--dads-checkbox-*</code> が薄いため、暫定でグローバルトークンを上書きして調整します。
                </p>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--spacing-8</code></th>
                        <td><code>2rem</code><br><small style="color:#666">(32px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-8" value="" data-api-css-var="--spacing-8" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>チェックボックスサイズ（md）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--spacing-2</code></th>
                        <td><code>0.5rem</code><br><small style="color:#666">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-2" value="" data-api-css-var="--spacing-2" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>gap（md）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--spacing-0-5</code></th>
                        <td><code>0.125rem</code><br><small style="color:#666">(2px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-0-5" value="" data-api-css-var="--spacing-0-5" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>枠線/アウトライン幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--font-size-16</code></th>
                        <td><code>1rem</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--font-size-16" value="" data-api-css-var="--font-size-16" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル文字サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-primitive-blue-900</code></th>
                        <td><code>#0017c1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-primitive-blue-900" value="" data-api-css-var="--color-primitive-blue-900" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>チェック時の色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-neutral-solid-gray-600</code></th>
                        <td><code>#666</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-neutral-solid-gray-600" value="" data-api-css-var="--color-neutral-solid-gray-600" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色（通常）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-neutral-solid-gray-800</code></th>
                        <td><code>#333</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-neutral-solid-gray-800" value="" data-api-css-var="--color-neutral-solid-gray-800" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本</h3>
        <dads-checkbox label="ラベル" size="sm"></dads-checkbox>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">オプション（ラベル無し）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ 視覚ラベルを出さない場合は <code>aria-label</code> または <code>aria-labelledby</code> を指定してください。
        </p>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-checkbox size="sm" aria-label="ラベルなしチェックボックス"></dads-checkbox>
          <dads-checkbox size="sm" checked aria-label="ラベルなし（checked）"></dads-checkbox>
          <dads-checkbox size="sm" indeterminate aria-label="ラベルなし（indeterminate）"></dads-checkbox>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">必須項目（※必須ラベル）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ <code>required</code>属性が付与されていると「※必須」ラベルが自動表示されます。
        </p>
        <dads-fieldset required>
          <span slot="legend">東京23区</span>
          <p slot="support-text">該当するすべての項目を選択してください。</p>
          <dads-checkbox label="東京23区" size="sm"></dads-checkbox>
          <dads-checkbox label="その他の地域" size="sm"></dads-checkbox>
        </dads-fieldset>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">サポートテキスト（aria-describedby）</h3>
        <p id="checkbox-support-2" style="margin: 0 0 12px; font-size: 0.875rem; line-height: 1.5; color: #4d4d4d;">
          該当するすべての項目を選択してください。
        </p>
        <dads-checkbox label="東京23区（例）" size="sm" aria-describedby="checkbox-support-2"></dads-checkbox>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">状態（サイズ別）</h3>
        <div style="display: grid; grid-template-columns: repeat(6, auto); gap: 2rem; justify-content: start;">
          <dads-checkbox label="ラベル" size="lg"></dads-checkbox>
          <dads-checkbox label="ラベル" size="lg" checked></dads-checkbox>
          <dads-checkbox label="ラベル" size="lg" error></dads-checkbox>
          <dads-checkbox label="ラベル" size="lg" checked error></dads-checkbox>
          <dads-checkbox label="ラベル" size="lg" disabled></dads-checkbox>
          <dads-checkbox label="ラベル" size="lg" checked disabled></dads-checkbox>

          <dads-checkbox label="ラベル" size="md"></dads-checkbox>
          <dads-checkbox label="ラベル" size="md" checked></dads-checkbox>
          <dads-checkbox label="ラベル" size="md" error></dads-checkbox>
          <dads-checkbox label="ラベル" size="md" checked error></dads-checkbox>
          <dads-checkbox label="ラベル" size="md" disabled></dads-checkbox>
          <dads-checkbox label="ラベル" size="md" checked disabled></dads-checkbox>

          <dads-checkbox label="ラベル" size="sm"></dads-checkbox>
          <dads-checkbox label="ラベル" size="sm" checked></dads-checkbox>
          <dads-checkbox label="ラベル" size="sm" error></dads-checkbox>
          <dads-checkbox label="ラベル" size="sm" checked error></dads-checkbox>
          <dads-checkbox label="ラベル" size="sm" disabled></dads-checkbox>
          <dads-checkbox label="ラベル" size="sm" checked disabled></dads-checkbox>
        </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">不確定状態（チェック全選択）</h3>
        <div data-js-indeterminate-example>
          <dads-checkbox data-js-check-all label="全てのスポーツ" size="sm"></dads-checkbox>

          <div style="margin-top: calc(16 / 16 * 1rem); display: grid; gap: 8px;">
            <dads-checkbox data-js-check label="サッカー" size="sm"></dads-checkbox>
            <dads-checkbox data-js-check label="バスケットボール" size="sm" checked></dads-checkbox>
            <dads-checkbox data-js-check label="テニス" size="sm"></dads-checkbox>
            <dads-checkbox data-js-check label="スイミング" size="sm" checked></dads-checkbox>
          </div>
        </div>
      </section>
    </div>

    <script type="module">
      // custom element定義前にプロパティへ触ると、upgrade後に「自前プロパティ」が残り挙動が壊れるため先に読み込む
      await Promise.all([import('dads-checkbox'), import('dads-button'), import('dads-fieldset'), import('dads-switch')]);

      // デモ用: フォーム送信でページ遷移しないようにする
      document.querySelectorAll('.checkbox-validation').forEach((form) => {
        form.addEventListener('submit', (e) => e.preventDefault());
      });

      document.querySelectorAll('[data-js-indeterminate-example]').forEach((el) => {
        const checkAll = el.querySelector('[data-js-check-all]');
        const checks = [...el.querySelectorAll('[data-js-check]')];
        if (!checkAll) return;
        if (checks.length === 0) return;

        function updateCheckAll() {
          const allChecked = checks.every((c) => c.checked);
          const noneChecked = checks.every((c) => !c.checked);
          checkAll.checked = allChecked;
          checkAll.indeterminate = !allChecked && !noneChecked;
        }

        function checkOrUncheckAll() {
          const checked = checkAll.checked;
          for (const c of checks) c.checked = checked;
          updateCheckAll();
        }

        checkAll.addEventListener('dads-change', checkOrUncheckAll);
        for (const c of checks) c.addEventListener('dads-change', updateCheckAll);

        updateCheckAll();
      });
    <\/script>
  `,


  radio: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ラジオボタン</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 radio.css 相当をShadow DOM向けに移植したWeb Components版です。
        Shadow DOMの制約により、同一nameグルーピング（排他）をコンポーネント側で補完します。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>

        <a11y-annotate target-selector="dads-radio">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-radio label="ラベル" size="sm" name="annotate"></dads-radio>
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
            'dads-radio',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-radio data-api-target label="足立区" size="md" name="api-demo" value="adachi"></dads-radio>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-radio label="足立区" size="md" name="api-demo" value="adachi"></dads-radio>
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
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>足立区</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="足立区"
                              data-api-attr="label"
                              data-default="足立区"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ラベルテキスト</td>
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
                        <th scope="row"><code>checked</code></th>
                        <td><code>prop</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="checked" data-api-prop="checked" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>選択状態</td>
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

                      <tr>
                        <th scope="row"><code>required</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="required" data-api-attr="required" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>必須（グループ内で未選択時にinvalid）</td>
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
                            <dads-input-text
                              label="error-text"
                              value=""
                              data-api-attr="error-text"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>エラーメッセージ（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td><code>adachi</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="value"
                              value="adachi"
                              data-api-attr="value"
                              data-default="adachi"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>送信値</td>
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
                        <th scope="row"><code>--dads-radio-gap</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-radio-gap" value="" data-api-css-var="--dads-radio-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>radio とラベルの間隔</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-radio-target-size</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-radio-target-size" value="" data-api-css-var="--dads-radio-target-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>タップターゲットサイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-radio-input-accent-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-radio-input-accent-color" value="" data-api-css-var="--dads-radio-input-accent-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>選択時の色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-radio-input-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-radio-input-border-color" value="" data-api-css-var="--dads-radio-input-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-radio-label-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-radio-label-color" value="" data-api-css-var="--dads-radio-label-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-radio-focus-ring-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-radio-focus-ring-color" value="" data-api-css-var="--dads-radio-focus-ring-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカスリング色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本（グループ）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ Tabでフォーカス移動、Arrowキー（↑↓←→）で選択移動できます。
        </p>
        <div style="display: grid; gap: 8px;">
          <dads-radio label="足立区" size="sm" name="tokyo-23" value="adachi"></dads-radio>
          <dads-radio label="荒川区" size="sm" name="tokyo-23" value="arakawa"></dads-radio>
          <dads-radio label="板橋区" size="sm" name="tokyo-23" value="itabashi"></dads-radio>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">状態（サイズ別）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ <code>size</code> は <code>sm</code> / <code>md</code> / <code>lg</code> をサポートします。
        </p>

        <div style="display: grid; grid-template-columns: repeat(6, auto); gap: 2rem; justify-content: start;">
          <!-- lg -->
          <dads-radio label="ラベル" size="lg" name="all-lg-1"></dads-radio>
          <dads-radio label="ラベル" size="lg" name="all-lg-1" checked></dads-radio>
          <dads-radio label="ラベル" size="lg" name="all-lg-2" error></dads-radio>
          <dads-radio label="ラベル" size="lg" name="all-lg-2" checked error></dads-radio>
          <dads-radio label="ラベル" size="lg" name="all-lg-3" disabled></dads-radio>
          <dads-radio label="ラベル" size="lg" name="all-lg-3" checked disabled></dads-radio>

          <!-- md -->
          <dads-radio label="ラベル" size="md" name="all-md-1"></dads-radio>
          <dads-radio label="ラベル" size="md" name="all-md-1" checked></dads-radio>
          <dads-radio label="ラベル" size="md" name="all-md-2" error></dads-radio>
          <dads-radio label="ラベル" size="md" name="all-md-2" checked error></dads-radio>
          <dads-radio label="ラベル" size="md" name="all-md-3" disabled></dads-radio>
          <dads-radio label="ラベル" size="md" name="all-md-3" checked disabled></dads-radio>

          <!-- sm -->
          <dads-radio label="ラベル" size="sm" name="all-sm-1"></dads-radio>
          <dads-radio label="ラベル" size="sm" name="all-sm-1" checked></dads-radio>
          <dads-radio label="ラベル" size="sm" name="all-sm-2" error></dads-radio>
          <dads-radio label="ラベル" size="sm" name="all-sm-2" checked error></dads-radio>
          <dads-radio label="ラベル" size="sm" name="all-sm-3" disabled></dads-radio>
          <dads-radio label="ラベル" size="sm" name="all-sm-3" checked disabled></dads-radio>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">必須バリデーション（required + auto-validate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ 送信ボタンで required バリデーションを確認できます（未選択ならエラー）。
        </p>

        <div style="display: grid; place-content: center; padding: 20px 0;">
          <form class="radio-validation">
            <dads-fieldset required>
              <span slot="legend">東京23区</span>
              <p slot="support-text">該当する区を1つ選択してください。</p>
              <div style="display: grid; gap: 8px;">
                <dads-radio
                  label="足立区"
                  size="sm"
                  name="required-group"
                  value="adachi"
                  required
                  auto-validate
                ></dads-radio>
                <dads-radio label="荒川区" size="sm" name="required-group" value="arakawa" required></dads-radio>
                <dads-radio label="板橋区" size="sm" name="required-group" value="itabashi" required></dads-radio>
              </div>
            </dads-fieldset>

            <div>
              <dads-button type="submit">送信</dads-button>
            </div>
          </form>
        </div>

        <style>
          .radio-validation {
            display: grid;
            gap: 12px;
            width: 520px;
          }

          .radio-validation dads-radio {
            display: block;
          }
        </style>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">ラベルなし（aria-label）</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-radio size="sm" aria-label="ラベルなしラジオ" name="nolabel"></dads-radio>
          <dads-radio size="sm" checked aria-label="ラベルなし（checked）" name="nolabel"></dads-radio>
        </div>
      </section>
    </div>

    <script type="module">
      await Promise.all([import('dads-radio'), import('dads-button'), import('dads-fieldset'), import('dads-switch')]);

      // デモ用: フォーム送信でページ遷移しないようにする
      document.querySelectorAll('.radio-validation').forEach((form) => {
        form.addEventListener('submit', (e) => e.preventDefault());
      });
    <\/script>
  `,


  fieldset: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">フィールドセット</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）準拠のフィールドセットWeb Componentです。
        フォーム要素のグループ化と、aria-describedbyの自動設定を行います。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>

        <a11y-annotate target-selector="dads-fieldset">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-fieldset required style="width: 500px;">
              <span slot="legend">東京23区</span>
              <p slot="support-text">該当するすべての項目を選択してください。</p>
              <dads-checkbox label="東京23区" size="sm"></dads-checkbox>
              <dads-checkbox label="その他の地域" size="sm"></dads-checkbox>
            </dads-fieldset>
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
            'dads-fieldset',
            'dads-checkbox',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-fieldset
                  data-api-target
                  legend="東京23区"
                  support-text="該当するすべての項目を選択してください。"
                  required
                  style="width: 520px;"
                >
                  <dads-checkbox label="足立区" size="sm"></dads-checkbox>
                  <dads-checkbox label="荒川区" size="sm"></dads-checkbox>
                </dads-fieldset>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-fieldset legend="東京23区" support-text="該当するすべての項目を選択してください。" required>
                      <dads-checkbox label="足立区" size="sm"></dads-checkbox>
                      <dads-checkbox label="荒川区" size="sm"></dads-checkbox>
                    </dads-fieldset>
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
                        <th scope="row"><code>legend</code></th>
                        <td><code>attr</code></td>
                        <td><code>東京23区</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="legend" value="東京23区" data-api-attr="legend" data-default="東京23区"></dads-input-text>
                          </div>
                        </td>
                        <td>レジェンド（スロット未使用時のフォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>support-text</code></th>
                        <td><code>attr</code></td>
                        <td><code>該当するすべての項目を選択してください。</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="support-text" value="該当するすべての項目を選択してください。" data-api-attr="support-text" data-default="該当するすべての項目を選択してください。"></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト（スロット未使用時のフォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>required</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="required" data-api-attr="required" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>※必須ラベルを表示</td>
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
                        <td>無効状態（子要素に伝播）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                  <code>--dads-fieldset-*</code> が薄いため、暫定でグローバルトークンを上書きして調整します。
                </p>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--spacing-1</code></th>
                        <td><code>0.25rem</code><br><small style="color:#666">(4px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-1" value="" data-api-css-var="--spacing-1" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>legend と必須ラベルのgap</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--spacing-3</code></th>
                        <td><code>0.75rem</code><br><small style="color:#666">(12px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-3" value="" data-api-css-var="--spacing-3" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>legend / support-text の下余白</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--spacing-2</code></th>
                        <td><code>0.5rem</code><br><small style="color:#666">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--spacing-2" value="" data-api-css-var="--spacing-2" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>子要素のgap</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--font-size-16</code></th>
                        <td><code>1rem</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--font-size-16" value="" data-api-css-var="--font-size-16" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト/必須ラベルの文字サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-neutral-solid-gray-700</code></th>
                        <td><code>#4d4d4d</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-neutral-solid-gray-700" value="" data-api-css-var="--color-neutral-solid-gray-700" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-semantic-error-1</code></th>
                        <td><code>#ec0000</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-semantic-error-1" value="" data-api-css-var="--color-semantic-error-1" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>必須ラベル色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">属性によるレジェンド・サポートテキスト</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ スロットの代わりにlegend属性とsupport-text属性でテキストを指定できます。
        </p>
        <dads-fieldset
          legend="お住まいのエリア"
          support-text="該当する項目を選択してください"
        >
          <dads-checkbox label="関東" size="sm"></dads-checkbox>
          <dads-checkbox label="関西" size="sm"></dads-checkbox>
          <dads-checkbox label="その他" size="sm"></dads-checkbox>
        </dads-fieldset>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">aria-describedby自動設定</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ support-textスロットに一意IDが付与され、子のform要素にaria-describedbyが自動設定されます。
          開発者ツールで確認してください。
        </p>
        <dads-fieldset>
          <span slot="legend">興味のある分野</span>
          <p slot="support-text">複数選択可能です。</p>
          <dads-checkbox label="プログラミング" size="sm"></dads-checkbox>
          <dads-checkbox label="デザイン" size="sm"></dads-checkbox>
          <dads-checkbox label="マーケティング" size="sm"></dads-checkbox>
        </dads-fieldset>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">disabled状態</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ dads-fieldsetにdisabled属性を付けると、子のform要素にも伝播します。
        </p>
        <dads-fieldset disabled>
          <span slot="legend">無効化されたグループ</span>
          <p slot="support-text">この選択肢は現在利用できません。</p>
          <dads-checkbox label="選択肢A" size="sm" checked></dads-checkbox>
          <dads-checkbox label="選択肢B" size="sm"></dads-checkbox>
        </dads-fieldset>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-top: 40px;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>DADS準拠:</strong> デジタル庁デザインシステムのスタイルに準拠</li>
          <li><strong>セマンティクス:</strong> ネイティブfieldset/legendを内部で使用</li>
          <li><strong>※必須ラベル:</strong> required属性で自動表示</li>
          <li><strong>aria-describedby自動設定:</strong> support-textスロットのIDを子要素に設定</li>
          <li><strong>disabled伝播:</strong> 親のdisabledが子要素に伝播</li>
          <li><strong>スロットと属性:</strong> legend/support-textはスロットでも属性でも指定可能</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
        </ul>
      </div>
    </div>

    <script type="module">
      await Promise.all([import('dads-fieldset'), import('dads-checkbox'), import('dads-switch')]);
    <\/script>
  `,


  inputText: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">インプットテキストコンポーネント</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム準拠のインプットテキストコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-input-text">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-input-text
              label="氏名"
              support-text="姓と名の間にスペースを入れてください"
              required
              style="width: 500px;"
            ></dads-input-text>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-input-text
                  data-api-target
                  label="氏名"
                  support-text="姓と名の間にスペースを入れてください"
                  required
                  type="text"
                  value="山田 太郎"
                  size="md"
                  input-width="full"
                  style="width: 520px;"
                ></dads-input-text>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-input-text
                      label="氏名"
                      support-text="姓と名の間にスペースを入れてください"
                      required
                      type="text"
                      value="山田 太郎"
                      size="md"
                      input-width="full"
                    ></dads-input-text>
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
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>氏名</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="label" value="氏名" data-api-attr="label" data-default="氏名"></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>support-text</code></th>
                        <td><code>attr</code></td>
                        <td><code>姓と名の間にスペースを入れてください</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="support-text" value="姓と名の間にスペースを入れてください" data-api-attr="support-text" data-default="姓と名の間にスペースを入れてください"></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>type</code></th>
                        <td><code>attr</code></td>
                        <td><code>text</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="type" data-api-attr="type" data-default="text">
                              <option value="text" selected>text</option>
                              <option value="email">email</option>
                              <option value="tel">tel</option>
                            </select>
                          </div>
                        </td>
                        <td>入力タイプ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td><code>山田 太郎</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="value" value="山田 太郎" data-api-attr="value" data-default="山田 太郎"></dads-input-text>
                          </div>
                        </td>
                        <td>値</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>required</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="required" data-api-attr="required" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>必須</td>
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
                        <th scope="row"><code>input-width</code></th>
                        <td><code>attr</code></td>
                        <td><code>full</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="input-width" data-api-attr="input-width" data-default="full">
                              <option value="short">short</option>
                              <option value="medium">medium</option>
                              <option value="full" selected>full</option>
                              <option value="300px">300px</option>
                            </select>
                          </div>
                        </td>
                        <td>幅バリアント</td>
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
                        <th scope="row"><code>--dads-input-background</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-background" value="" data-api-css-var="--dads-input-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-input-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-border-color" value="" data-api-css-var="--dads-input-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-input-border-radius</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-border-radius" value="" data-api-css-var="--dads-input-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-input-width</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-width" value="" data-api-css-var="--dads-input-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>入力幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-input-height</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-height" value="" data-api-css-var="--dads-input-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-input-label-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-label-color" value="" data-api-css-var="--dads-input-label-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-input-support-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-support-color" value="" data-api-css-var="--dads-input-support-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-input-error-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-input-error-color" value="" data-api-css-var="--dads-input-error-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>エラー色</td>
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

      <!-- 基本 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本</h3>
        <div style="max-width: 500px;">
          <dads-input-text
            label="氏名"
            support-text="姓と名の間にスペースを入れてください"
          ></dads-input-text>
        </div>
      </section>

      <!-- 入力タイプ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">入力タイプ</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-input-text
            label="氏名"
            type="text"
            support-text="テキスト入力"
          ></dads-input-text>

          <dads-input-text
            label="メールアドレス"
            type="email"
            support-text="例: example@example.com"
            autocomplete="email"
          ></dads-input-text>

          <dads-input-text
            label="電話番号"
            type="tel"
            support-text="例: 090-1234-5678"
            autocomplete="tel"
            input-width="medium"
          ></dads-input-text>
        </div>
      </section>

      <!-- 幅バリエーション -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">幅バリエーション</h3>
        <div style="display: grid; gap: 24px; max-width: 600px;">
          <dads-input-text
            label="郵便番号"
            input-width="short"
            support-text="short (8ch)"
          ></dads-input-text>

          <dads-input-text
            label="電話番号"
            input-width="medium"
            support-text="medium (16ch)"
          ></dads-input-text>

          <dads-input-text
            label="住所"
            input-width="full"
            support-text="full (100%)"
          ></dads-input-text>

          <dads-input-text
            label="カスタム幅"
            input-width="300px"
            support-text="カスタム値 (300px)"
          ></dads-input-text>
        </div>
      </section>

      <!-- サポートテキスト・要否ラベル -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サポートテキスト・要否ラベル</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-input-text
            label="必須項目"
            support-text="入力が必須です"
            required
          ></dads-input-text>

          <dads-input-text
            label="任意項目"
            support-text="入力は任意です"
          ></dads-input-text>
        </div>
      </section>

      <!-- エラー状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">エラー状態</h3>
        <div style="max-width: 500px;">
          <dads-input-text
            label="メールアドレス"
            required
            error
            error-text="メールアドレスの形式が正しくありません"
            value="invalid-email"
          ></dads-input-text>
        </div>
      </section>

      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-input-text label="Small" size="sm"></dads-input-text>
          <dads-input-text label="Medium（デフォルト）" size="md"></dads-input-text>
          <dads-input-text label="Large" size="lg"></dads-input-text>
        </div>
      </section>

      <!-- 状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">状態</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-input-text
            label="無効状態"
            disabled
            value="編集できません"
          ></dads-input-text>

          <dads-input-text
            label="ユーザーID"
            readonly
            support-text="この項目は編集できません"
            value="user-12345678"
          ></dads-input-text>
        </div>
      </section>

      <!-- 実際の使用例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">実際の使用例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9;">
          <form style="max-width: 600px;">
            <h4 style="font-size: 18px; margin-bottom: 20px; color: #333;">お問い合わせフォーム</h4>

            <div style="display: grid; gap: 16px; margin-bottom: 24px;">
              <dads-input-text
                label="氏名"
                required
                support-text="姓と名の間にスペースを入れてください"
                autocomplete="name"
                auto-validate
              ></dads-input-text>

              <dads-input-text
                label="メールアドレス"
                type="email"
                required
                support-text="例: example@example.com"
                autocomplete="email"
                auto-validate
              ></dads-input-text>

              <dads-input-text
                label="電話番号"
                type="tel"
                support-text="例: 090-1234-5678"
                autocomplete="tel"
                input-width="medium"
              ></dads-input-text>
            </div>

            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <dads-button variant="text" type="button">キャンセル</dads-button>
              <dads-button variant="solid" type="submit">送信</dads-button>
            </div>
          </form>
        </div>
      </section>

      <!-- 住所入力フォーム -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">住所入力フォーム例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9; max-width: 500px;">
          <div style="display: grid; gap: 16px;">
            <dads-input-text
              label="郵便番号"
              support-text="例: 100-0001"
              input-width="short"
              autocomplete="postal-code"
            ></dads-input-text>

            <dads-input-text
              label="都道府県"
              input-width="medium"
              autocomplete="address-level1"
            ></dads-input-text>

            <dads-input-text
              label="市区町村"
              autocomplete="address-level2"
            ></dads-input-text>

            <dads-input-text
              label="番地・建物名"
              support-text="建物名・部屋番号がある場合は入力してください"
              autocomplete="street-address"
            ></dads-input-text>
          </div>
        </div>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>WCAG 2.2 AA準拠:</strong> ラベル関連付け、aria-describedby、フォーカス管理</li>
          <li><strong>幅バリエーション:</strong> short(8ch) / medium(16ch) / full(100%) / カスタム値</li>
          <li><strong>エラー状態:</strong> aria-describedbyで関連付け（DADSガイドライン準拠）</li>
          <li><strong>Form Associated:</strong> ネイティブフォームに参加</li>
          <li><strong>スロット対応:</strong> label、support-text、error-textをスロットでカスタマイズ可能</li>
          <li><strong>::part()スタイリング:</strong> 外部からの柔軟なカスタマイズ</li>
          <li><strong>入力タイプ:</strong> text / email / tel をサポート</li>
        </ul>
      </div>
    </div>
  `,


  textarea: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">テキストエリアコンポーネント</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム準拠のテキストエリアコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-textarea">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-textarea
              label="お問い合わせ内容"
              support-text="500文字以内で入力してください"
              required
              show-counter
              maxlength="500"
              rows="3"
              style="width: 500px;"
            ></dads-textarea>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-textarea',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-textarea
                  data-api-target
                  label="お問い合わせ内容"
                  support-text="500文字以内で入力してください"
                  required
                  show-counter
                  maxlength="200"
                  rows="3"
                  style="width: 520px;"
                ></dads-textarea>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-textarea
                      label="お問い合わせ内容"
                      support-text="500文字以内で入力してください"
                      required
                      show-counter
                      maxlength="200"
                      rows="3"
                    ></dads-textarea>
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
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>お問い合わせ内容</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="label" value="お問い合わせ内容" data-api-attr="label" data-default="お問い合わせ内容"></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>support-text</code></th>
                        <td><code>attr</code></td>
                        <td><code>500文字以内で入力してください</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="support-text" value="500文字以内で入力してください" data-api-attr="support-text" data-default="500文字以内で入力してください"></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>required</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="required" data-api-attr="required" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>必須</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>show-counter</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="show-counter" data-api-attr="show-counter" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>文字数カウンター表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>maxlength</code></th>
                        <td><code>attr</code></td>
                        <td><code>200</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="maxlength" value="200" data-api-attr="maxlength" data-default="200"></dads-input-text>
                          </div>
                        </td>
                        <td>最大文字数</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>rows</code></th>
                        <td><code>attr</code></td>
                        <td><code>3</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="rows" value="3" data-api-attr="rows" data-default="3"></dads-input-text>
                          </div>
                        </td>
                        <td>行数</td>
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
                        <th scope="row"><code>--dads-textarea-background</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-background" value="" data-api-css-var="--dads-textarea-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-textarea-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-border-color" value="" data-api-css-var="--dads-textarea-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-textarea-border-radius</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-border-radius" value="" data-api-css-var="--dads-textarea-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-textarea-padding</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-padding" value="" data-api-css-var="--dads-textarea-padding" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>内側余白</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-textarea-min-height</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-min-height" value="" data-api-css-var="--dads-textarea-min-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-textarea-label-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-label-color" value="" data-api-css-var="--dads-textarea-label-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-textarea-support-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-support-color" value="" data-api-css-var="--dads-textarea-support-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-textarea-error-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-textarea-error-color" value="" data-api-css-var="--dads-textarea-error-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>エラー色</td>
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

      <!-- 基本 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本</h3>
        <div style="max-width: 500px;">
          <dads-textarea
            label="お問い合わせ内容"
            support-text="内容を入力してください"
          ></dads-textarea>
        </div>
      </section>

      <!-- サポートテキスト・要否ラベル -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サポートテキスト・要否ラベル</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea
            label="必須項目"
            support-text="入力が必須です"
            required
          ></dads-textarea>

          <dads-textarea
            label="任意項目"
            support-text="入力は任意です"
          ></dads-textarea>
        </div>
      </section>

      <!-- 文字数カウンター -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">文字数カウンター</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea
            label="入力制限あり"
            support-text="500文字以内で入力してください"
            show-counter
            maxlength="500"
          ></dads-textarea>

          <dads-textarea
            label="目安表示のみ"
            support-text="200文字程度を目安に入力してください"
            show-counter
            counter-max="200"
          ></dads-textarea>
        </div>
      </section>

      <!-- エラー状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">エラー状態</h3>
        <div style="max-width: 500px;">
          <dads-textarea
            label="お問い合わせ内容"
            required
            error
            error-text="入力内容を確認してください"
            value="不正な入力"
          ></dads-textarea>
        </div>
      </section>

      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea label="Small" size="sm" support-text="小サイズ"></dads-textarea>
          <dads-textarea label="Medium（デフォルト）" size="md" support-text="中サイズ"></dads-textarea>
          <dads-textarea label="Large" size="lg" support-text="大サイズ"></dads-textarea>
        </div>
      </section>

      <!-- 行数 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">行数</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea label="3行（デフォルト）" rows="3" support-text="デフォルトの行数"></dads-textarea>
          <dads-textarea label="5行" rows="5" support-text="5行表示"></dads-textarea>
        </div>
      </section>

      <!-- 状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">状態</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea
            label="無効状態"
            disabled
            value="編集できません"
          ></dads-textarea>

          <dads-textarea
            label="ユーザーID"
            readonly
            support-text="この項目は編集できません。"
            value="user-12345678"
          ></dads-textarea>
        </div>
      </section>

      <!-- 実際の使用例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">実際の使用例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9;">
          <form style="max-width: 600px;">
            <h4 style="font-size: 18px; margin-bottom: 20px; color: #333;">お問い合わせフォーム</h4>

            <div style="margin-bottom: 16px;">
              <label for="demo-subject" style="display: block; margin-bottom: 4px; font-weight: 500;">
                件名
              </label>
              <input
                id="demo-subject"
                type="text"
                aria-describedby="demo-subject-hint"
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box;"
              >
              <p id="demo-subject-hint" style="margin: 4px 0 0; font-size: 14px; color: #666;">
                例: 申請書類について
              </p>
            </div>

            <dads-textarea
              label="お問い合わせ内容"
              support-text="具体的な内容をご記入ください（500文字以内）"
              required
              show-counter
              maxlength="500"
              rows="5"
              style="margin-bottom: 24px;"
            ></dads-textarea>

            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <dads-button variant="text" type="button">キャンセル</dads-button>
              <dads-button variant="solid" type="submit">送信</dads-button>
            </div>
          </form>
        </div>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>WCAG 2.2 AA準拠:</strong> ラベル関連付け、aria-describedby、フォーカス管理</li>
          <li><strong>文字数カウンター:</strong> 「0/100」形式、aria-describedbyで関連付け</li>
          <li><strong>エラー状態:</strong> aria-describedbyで関連付け（DADSガイドライン準拠）</li>
          <li><strong>Form Associated:</strong> ネイティブフォームに参加</li>
          <li><strong>スロット対応:</strong> label、support-text、error-textをスロットでカスタマイズ可能</li>
          <li><strong>::part()スタイリング:</strong> 外部からの柔軟なカスタマイズ</li>
        </ul>
      </div>
    </div>
  `,


  searchBox: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">検索ボックス</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 search-box.css 相当をShadow DOM向けに移植したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-search-box">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <form
              id="search-box-form"
              role="search"
              aria-labelledby="site-search-heading"
              style="display: grid; gap: 16px; width: 720px;"
            >
              <div>
                <h1 id="site-search-heading" style="font-size: 20px; margin: 0 0 12px;">サイト内検索</h1>
                <dads-search-box>
                  <option value="">すべて</option>
                  <option value="images">画像</option>
                  <option value="files">ファイル</option>
                  <option value="map">地図</option>
                  <option value="videos">動画</option>
                </dads-search-box>
              </div>
              <pre id="search-box-output" style="margin: 0; padding: 12px; background: #f7f7f7; border-radius: 8px;"></pre>
            </form>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">ランドマーク（role=&quot;search&quot; をコンポーネントに付与）</h3>
        <div style="max-width: 720px;">
          <form style="display: grid; gap: 12px;">
            <h4 id="site-search-heading-component" style="font-size: 16px; margin: 0;">サイト内検索（コンポーネントがsearchランドマーク）</h4>
            <dads-search-box role="search" aria-labelledby="site-search-heading-component">
              <option value="">すべて</option>
              <option value="images">画像</option>
              <option value="files">ファイル</option>
            </dads-search-box>
          </form>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本（検索対象あり）</h3>
        <div style="max-width: 720px;">
          <dads-search-box>
            <option value="">すべて</option>
            <option value="images">画像</option>
            <option value="files">ファイル</option>
          </dads-search-box>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">検索対象なし</h3>
        <div style="max-width: 720px;">
          <dads-search-box></dads-search-box>
        </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          テーブル内の操作が Preview のターゲット要素へ即時反映されます。
          検索対象（scope）は <code>&lt;dads-search-box&gt;</code> の子要素として <code>&lt;option&gt;</code>/<code>&lt;optgroup&gt;</code> を指定します。
          option が 0 件の場合は scope UI を表示せず、フォーム送信（FormData）にも含めません。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-search-box',
          ],
          body: `
	            <div>
	              <h4 class="wc-api-panel__section-title">Preview</h4>
	              <div style="display: grid; gap: 12px; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
	                <form data-search-box-preview-form style="display: grid; gap: 12px; width: 720px; max-width: 100%; margin: 0;">
	                  <dads-search-box data-api-target>
	                    <option value="">すべて</option>
	                    <option value="images">画像</option>
	                    <option value="files">ファイル</option>
	                  </dads-search-box>
	                  <pre data-search-box-preview-output style="margin: 0; padding: 12px; background: #f7f7f7; border-radius: 8px;"></pre>
	                </form>
	              </div>
	              <div style="margin-top: 16px;">
	                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
	                <dads-code-block data-api-code>
	                  <template>
	                    <dads-search-box>
	                      <option value="">すべて</option>
	                      <option value="images">画像</option>
	                      <option value="files">ファイル</option>
	                    </dads-search-box>
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
                        <th scope="row"><code>scope options</code></th>
                        <td><code>children</code></td>
                        <td><code>option/optgroup</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="scope options" data-search-box-scope-options data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>Light DOM の option/optgroup を追加/削除して検索対象 UI を出し分け</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>name</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>q</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="name" value="q" data-api-attr="name" data-default="q"></dads-input-text>
                          </div>
                        </td>
                        <td>検索語（query）を FormData に追加する際の name</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>prop</code></td>
                        <td><code>string</code></td>
                        <td><code>""</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="value" value="" data-api-prop="value" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>検索語（query）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>検索</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="label" value="検索" data-api-attr="label" data-default="検索"></dads-input-text>
                          </div>
                        </td>
                        <td>検索語 input の視覚的に非表示ラベル（アクセシブルネーム）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>button-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>検索</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="button-label" value="検索" data-api-attr="button-label" data-default="検索"></dads-input-text>
                          </div>
                        </td>
                        <td>送信ボタンのラベル</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>scope-value</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>""</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="scope-value" data-api-attr="scope-value" data-default="">
                              <option value="" selected>(empty)</option>
                              <option value="images">画像</option>
                              <option value="files">ファイル</option>
                            </select>
                          </div>
                        </td>
                        <td>検索対象（scope）の選択値（初期値）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>scope-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>検索対象</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="scope-label" value="検索対象" data-api-attr="scope-label" data-default="検索対象"></dads-input-text>
                          </div>
                        </td>
                        <td>検索対象 select の可視ラベル</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="aria-label" value="" data-api-attr="aria-label" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>検索語 input へ転写（label の代替）</td>
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
                        <th scope="row"><code>--dads-search-box-gap</code></th>
                        <td><code>--spacing-4</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-gap" value="" data-api-css-var="--dads-search-box-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>fields と button の間隔</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-border-color</code></th>
                        <td><code>--color-neutral-solid-gray-600</code><br><small style="color:#666">(#666)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-search-box-border-color"
                              value=""
                              data-api-css-var="--dads-search-box-border-color"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-border-width</code></th>
                        <td><code>1px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-border-width" value="" data-api-css-var="--dads-search-box-border-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>枠線幅</td>
                      </tr>
	                      <tr>
	                        <th scope="row"><code>--dads-search-box-input-min-width</code></th>
	                        <td><code>8rem</code><br><small style="color:#666">(128px)</small></td>
	                        <td>
	                          <div class="wc-api-control">
	                            <dads-input-text label="--dads-search-box-input-min-width" value="" data-api-css-var="--dads-search-box-input-min-width" data-default=""></dads-input-text>
	                          </div>
	                        </td>
	                        <td>input 最小幅</td>
	                      </tr>
	                      <tr>
	                        <th scope="row"><code>--dads-search-box-search-icon-size</code></th>
	                        <td><code>1.5rem</code><br><small style="color:#666">(24px)</small></td>
	                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-search-icon-size" value="" data-api-css-var="--dads-search-box-search-icon-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>虫眼鏡アイコンサイズ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-scope-icon-size</code></th>
                        <td><code>1rem</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-scope-icon-size" value="" data-api-css-var="--dads-search-box-scope-icon-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>scope アイコンサイズ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-scope-padding</code></th>
                        <td><code>20px 40px 0 16px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-scope-padding" value="" data-api-css-var="--dads-search-box-scope-padding" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>scope パディング</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-button-bg</code></th>
                        <td><code>--color-primitive-blue-900</code><br><small style="color:#666">(#1a4ccc)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-button-bg" value="" data-api-css-var="--dads-search-box-button-bg" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボタン背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-button-color</code></th>
                        <td><code>--color-neutral-white</code><br><small style="color:#666">(#fff)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-button-color" value="" data-api-css-var="--dads-search-box-button-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボタン文字色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-button-bg-hover</code></th>
                        <td><code>--color-primitive-blue-1000</code><br><small style="color:#666">(#143da3)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-button-bg-hover" value="" data-api-css-var="--dads-search-box-button-bg-hover" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボタンホバー時背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-search-box-button-border-color</code></th>
                        <td><code>transparent</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-search-box-button-border-color" value="" data-api-css-var="--dads-search-box-button-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボタン枠線色</td>
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
                        <th scope="col">Detail</th>
                        <th scope="col">Cancelable</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><code>dads-input</code></th>
                        <td><code>{ query: string; scope: string }</code></td>
                        <td><code>true</code></td>
                        <td>入力中に発火（検索語/検索対象）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dads-change</code></th>
                        <td><code>{ query: string; scope: string }</code></td>
                        <td><code>true</code></td>
                        <td>値変更確定時に発火（検索語/検索対象）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dads-search</code></th>
                        <td><code>{ query: string; scope: string }</code></td>
                        <td><code>true</code></td>
                        <td>Enter/クリックで発火。<code>preventDefault()</code> されなければ <code>form.requestSubmit()</code> を呼びます。</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS Parts</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><th scope="row"><code>base</code></th><td>ルート（横並びコンテナ）</td></tr>
                      <tr><th scope="row"><code>fields</code></th><td>フィールド群（scope + query）</td></tr>
                      <tr><th scope="row"><code>scope</code></th><td>検索対象セレクトのラベルコンテナ</td></tr>
                      <tr><th scope="row"><code>scope-label</code></th><td>検索対象ラベルテキスト</td></tr>
                      <tr><th scope="row"><code>scope-select</code></th><td>検索対象セレクト</td></tr>
                      <tr><th scope="row"><code>scope-icon</code></th><td>検索対象セレクトの矢印アイコン</td></tr>
                      <tr><th scope="row"><code>query</code></th><td>検索語入力のラベルコンテナ</td></tr>
                      <tr><th scope="row"><code>search-icon</code></th><td>虫眼鏡アイコン</td></tr>
                      <tr><th scope="row"><code>visually-hidden</code></th><td>スクリーンリーダー向けラベル</td></tr>
                      <tr><th scope="row"><code>input</code></th><td>検索語 input[type="search"]</td></tr>
                      <tr><th scope="row"><code>button</code></th><td>送信ボタン（&lt;dads-button&gt;）</td></tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
          `,
          footer: `
          <script>
            (function() {
              var currentScript = document.currentScript;
              customElements.whenDefined('dads-search-box').then(function() {
                var root = currentScript?.parentElement;
                if (!root || !root.isConnected) return;

                var target = root.querySelector('[data-api-target]');
                var scopeToggle = root.querySelector('[data-search-box-scope-options]');
                var reset = root.querySelector('[data-api-reset]');
                var form = root.querySelector('[data-search-box-preview-form]');
                var out = root.querySelector('[data-search-box-preview-output]');

                var setScopeOptions = function(enabled) {
                  if (!(target instanceof HTMLElement)) return;

                  var children = Array.from(target.children);
                  for (var i = 0; i < children.length; i++) {
                    var el = children[i];
                    if (el.tagName === 'OPTION' || el.tagName === 'OPTGROUP') target.removeChild(el);
                  }

                  if (!enabled) return;

                  target.insertAdjacentHTML(
                    'beforeend',
                    '<option value=\"\">すべて</option>' +
                      '<option value=\"images\">画像</option>' +
                      '<option value=\"files\">ファイル</option>'
                  );
                };

                var syncOutput = function() {
                  if (!(form instanceof HTMLFormElement)) return;
                  if (!(out instanceof HTMLElement)) return;

                  var lines = [];
                  var data = new FormData(form);
                  data.forEach(function(v, k) {
                    lines.push(String(k) + '=' + String(v));
                  });
                  out.textContent = lines.join('\\n');
                };

                var updateScope = function() {
                  var enabled = scopeToggle ? scopeToggle.hasAttribute('checked') : true;
                  setScopeOptions(enabled);
                  syncOutput();
                };

                if (form instanceof HTMLFormElement) {
                  form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    syncOutput();
                  });
                  form.addEventListener('dads-search', syncOutput);
                }

                if (scopeToggle) scopeToggle.addEventListener('dads-change', updateScope);
                if (reset) {
                  reset.addEventListener('click', function() {
                    if (scopeToggle) {
                      var def = scopeToggle.getAttribute('data-default');
                      scopeToggle.toggleAttribute('checked', def !== 'false');
                    }
                    updateScope();
                  });
                }

                root.addEventListener('dads-change', function() { setTimeout(syncOutput); });
                root.addEventListener('dads-input', function() { setTimeout(syncOutput); });
                root.addEventListener('change', function() { setTimeout(syncOutput); });
                root.addEventListener('input', function() { setTimeout(syncOutput); });

                updateScope();
              });
            })();
          </script>
          `,
        })}
      </section>
    </div>

    <script type="module">
      await Promise.all([import('dads-search-box'), import('dads-switch'), import('a11y-annotate')]);

      const form = document.querySelector('#search-box-form');
      const out = document.querySelector('#search-box-output');
      if (form instanceof HTMLFormElement && out instanceof HTMLElement) {
        const write = (data) => {
          const lines = [];
          for (const [k, v] of data.entries()) lines.push(String(k) + '=' + String(v));
          out.textContent = lines.join('\\n');
        };

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          write(new FormData(form));
        });

        form.addEventListener('dads-search', () => {
          write(new FormData(form));
        });
      }
    </script>
  `,


  select: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">セレクトボックス</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム（DADS）HTML版 select.css 相当をShadow DOM向けに移植したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-select">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-select
              label="東京23区"
              support-text="該当する区を選択してください。"
              required
              size="md 420"
            >
              <option value="">選択してください</option>
              <option value="1">足立区</option>
              <option value="2">荒川区</option>
              <option value="3">板橋区</option>
              <option value="4">江戸川区</option>
            </dads-select>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-select',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-select
                  data-api-target
                  label="東京23区"
                  support-text="該当する区を選択してください。"
                  required
                  size="md 420"
                  value="2"
                >
                  <option value="">選択してください</option>
                  <option value="1">足立区</option>
                  <option value="2">荒川区</option>
                  <option value="3">板橋区</option>
                  <option value="4">江戸川区</option>
                </dads-select>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-select
                      label="東京23区"
                      support-text="該当する区を選択してください。"
                      required
                      size="md 420"
                      value="2"
                    >
                      <option value="">選択してください</option>
                      <option value="1">足立区</option>
                      <option value="2">荒川区</option>
                      <option value="3">板橋区</option>
                      <option value="4">江戸川区</option>
                    </dads-select>
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
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>東京23区</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="label" value="東京23区" data-api-attr="label" data-default="東京23区"></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>support-text</code></th>
                        <td><code>attr</code></td>
                        <td><code>該当する区を選択してください。</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="support-text" value="該当する区を選択してください。" data-api-attr="support-text" data-default="該当する区を選択してください。"></dads-input-text>
                          </div>
                        </td>
                        <td>サポートテキスト（フォールバック）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>required</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="required" data-api-attr="required" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>必須</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>md 420</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="md 420">
                              <option value="sm 240">sm 240</option>
                              <option value="md 420" selected>md 420</option>
                              <option value="lg 420">lg 420</option>
                              <option value="md full">md full</option>
                              <option value="md fit-content">md fit-content</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ + 幅指定</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td><code>2</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="value" data-api-attr="value" data-default="2">
                              <option value="">（未選択）</option>
                              <option value="1">1</option>
                              <option value="2" selected>2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                          </div>
                        </td>
                        <td>初期値</td>
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
                        <th scope="row"><code>--dads-select-background</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-background" value="" data-api-css-var="--dads-select-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-select-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-border-color" value="" data-api-css-var="--dads-select-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-select-border-radius</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-border-radius" value="" data-api-css-var="--dads-select-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-select-height</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-height" value="" data-api-css-var="--dads-select-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-select-width</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-width" value="" data-api-css-var="--dads-select-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-select-chevron-color</code></th>
                        <td><code>currentColor</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-chevron-color" value="" data-api-css-var="--dads-select-chevron-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-select-label-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-label-color" value="" data-api-css-var="--dads-select-label-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル色</td>
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

      <!-- 基本 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本</h3>
        <div style="max-width: 420px;">
          <dads-select label="都道府県" support-text="お住まいの都道府県を選択してください。">
            <option value="">選択してください</option>
            <option value="tokyo">東京都</option>
            <option value="kanagawa">神奈川県</option>
            <option value="chiba">千葉県</option>
            <option value="saitama">埼玉県</option>
          </dads-select>
        </div>
      </section>

      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ（sm / md / lg）</h3>
        <div style="display: grid; gap: 24px; max-width: 420px;">
          <dads-select size="sm" label="サイズ sm" support-text='size="sm"（高さ40px相当）'>
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2</option>
          </dads-select>

          <dads-select size="md" label="サイズ md" support-text='size="md"（高さ48px相当）'>
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2</option>
          </dads-select>

          <dads-select size="lg" label="サイズ lg" support-text='size="lg"（高さ56px相当）'>
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2</option>
          </dads-select>
        </div>
      </section>

      <!-- optgroup -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">グルーピング（optgroup）</h3>
        <div style="max-width: 420px;">
          <dads-select label="種目" support-text="optgroupを含む選択肢例">
            <option value="">選択してください</option>
            <optgroup label="球技">
              <option value="soccer">サッカー</option>
              <option value="baseball">野球</option>
              <option value="basketball">バスケットボール</option>
            </optgroup>
            <optgroup label="その他">
              <option value="swim">水泳</option>
              <option value="run">陸上</option>
            </optgroup>
          </dads-select>
        </div>
      </section>

      <!-- 状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">状態</h3>
        <div style="display: grid; gap: 24px; max-width: 420px;">
          <dads-select label="エラー" required error error-text="選択してください">
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2</option>
          </dads-select>

          <dads-select label="Disabled（disabled）" disabled>
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2</option>
          </dads-select>

          <dads-select label="Aria Disabled（aria-disabled）" aria-disabled="true" value="2">
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2（固定）</option>
          </dads-select>
        </div>
      </section>

      <!-- 幅 -->
      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">幅例</h3>
        <div style="display: grid; gap: 24px;">
          <dads-select label="100%幅" support-text='size="md full"' size="md full">
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2</option>
          </dads-select>

          <dads-select label="固定幅（256px）" support-text='size="md 256"' size="md 256">
            <option value="">選択してください</option>
            <option value="1">選択肢1</option>
            <option value="2">選択肢2</option>
          </dads-select>

          <dads-select label="内容にフィット（fit-content）" support-text='size="md fit-content"' size="md fit-content">
            <option value="">選択してください</option>
            <option value="1">短い</option>
            <option value="2">やや長い選択肢</option>
          </dads-select>
        </div>
      </section>
    </div>

    <script type="module">
      await Promise.all([import('dads-select'), import('dads-switch'), import('a11y-annotate')]);
    </script>
  `,
} as const;
