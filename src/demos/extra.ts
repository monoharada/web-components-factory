import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  MENU_LIST_BOX_DUMMY_START_ICON_SVG,
  MENU_LIST_BOX_OPENER_ICON,
  annotationToggleScript,
  annotationToggleUI,
  menuListBoxDescriptionItems,
  menuListBoxNumberedItems,
  menuListItemStartIcon,
  modulePreloadScript,
  renderApiPanelWrapper,
} from './shared.js';

const DEMO_H2_STYLE = 'font-size: 28px; margin-bottom: 20px; color: #333;';

export const demos = {

  resetCss: () => `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 30px; color: #333;">リセットCSS比較デモ（独自）</h2>

      <div style="display: grid; gap: 30px; max-width: 1280px;">
        <!-- 既存サイトのスタイル影響テスト -->
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
          <h3 style="color: #666; margin-bottom: 15px;">既存サイトのスタイル（グローバルCSS）</h3>
          <p style="margin: 10px 0; line-height: 1.8;">
            これは既存サイトの段落です。フォントサイズ、行間、マージンなどが設定されています。
          </p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 5px 0;">既存サイトのリスト項目1</li>
            <li style="margin: 5px 0;">既存サイトのリスト項目2</li>
          </ul>
          <dads-button variant="solid">既存のボタンスタイル</dads-button>
        </div>

        <!-- Web Components（Shadow DOM隔離） -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <!-- フルリセット適用 -->
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">フルリセット適用（kiso.css）</h3>
            <reset-card>
              <span slot="title">Shadow DOM内でリセット</span>
              <span slot="description">
                kiso.cssのフルリセットがShadow DOM内にのみ適用されます。
                既存サイトのスタイルには影響しません。
              </span>
              <span slot="action">詳細を見る</span>
            </reset-card>
          </div>

          <!-- 最小限リセット -->
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">最小限リセット</h3>
            <minimal-reset-card>
              <span slot="title">軽量リセット版</span>
              <span slot="description">
                最小限のリセットCSSのみ適用。
                パフォーマンスを重視する場合に適しています。
              </span>
              <span slot="action">詳細を見る</span>
            </minimal-reset-card>
          </div>

          <!-- リセットなし -->
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">リセットなし（比較用）</h3>
            <no-reset-card>
              <span slot="title">リセットCSS未適用</span>
              <span slot="description">
                リセットCSSを使用していない状態。
                ブラウザのデフォルトスタイルが適用されます。
              </span>
              <span slot="action">詳細を見る</span>
            </no-reset-card>
          </div>
        </div>

        <!-- 解説 -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-bottom: 10px;">重要なポイント</h3>
          <ul style="color: #856404; line-height: 1.8; padding-left: 20px;">
            <li><strong>Shadow DOM の隔離性:</strong> リセットCSSはコンポーネント内部にのみ適用され、外部に影響しません</li>
            <li><strong>既存サイトとの共存:</strong> 上記の「既存サイトのスタイル」セクションが崩れていないことを確認してください</li>
            <li><strong>選択的適用:</strong> withReset()ヘルパーでコンポーネントごとにリセットを選択できます</li>
            <li><strong>::part()によるカスタマイズ:</strong> 外部からのスタイル調整も可能です</li>
          </ul>
        </div>
      </div>
    </div>
  `,


  textareaValidation: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="${DEMO_H2_STYLE}">テキストエリア（バリデーション検証）</h2>
      <p style="color: #666; margin-bottom: 32px;">
        auto-validate 属性による自動バリデーションの作例です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-textarea">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-textarea
              label="お問い合わせ内容"
              support-text="必須項目です。15文字以内で入力してください。"
              required
              maxlength="15"
              show-counter
              auto-validate
            ></dads-textarea>
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
            'dads-textarea',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-textarea
                  data-api-target
                  label="カスタムメッセージ"
                  support-text="required / maxlength / auto-validate を操作できます"
                  required
                  maxlength="10"
                  show-counter
                  auto-validate
                >
                  <span slot="required-error">入力してください（カスタム）</span>
                  <span slot="overflow-error">10文字までです（カスタム）</span>
                </dads-textarea>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-textarea
                      label="カスタムメッセージ"
                      support-text="required / maxlength / auto-validate を操作できます"
                      required
                      maxlength="10"
                      show-counter
                      auto-validate
                    >
                      <span slot="required-error">入力してください（カスタム）</span>
                      <span slot="overflow-error">10文字までです（カスタム）</span>
                    </dads-textarea>
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
                        <th scope="row"><code>maxlength</code></th>
                        <td><code>attr</code></td>
                        <td><code>10</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="maxlength" value="10" data-api-attr="maxlength" data-default="10"></dads-input-text>
                          </div>
                        </td>
                        <td>文字数制限</td>
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
                        <td>カウンター表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>auto-validate</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="auto-validate" data-api-attr="auto-validate" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>自動バリデーション</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>カスタムメッセージ</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="カスタムメッセージ"
                              data-api-attr="label"
                              data-default="カスタムメッセージ"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル</td>
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
                        <td>ボーダー色</td>
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

      <section style="margin-top: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Validation Scenarios</h3>

        <form id="validation-form" novalidate>
          <!-- 15文字制限（E2Eテスト用） -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">文字数バリデーション（15文字）</h3>
            <dads-textarea
              id="test-overflow"
              label="文字数テスト"
              support-text="15文字以内で入力してください。超えるとblur時にエラー表示されます。"
              maxlength="15"
              show-counter
              auto-validate
            ></dads-textarea>
          </section>

          <!-- 必須バリデーション -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">必須バリデーション</h3>
            <dads-textarea
              id="test-required"
              label="必須項目"
              support-text="空のまま送信するとエラー表示されます。"
              required
              auto-validate
            ></dads-textarea>
          </section>

          <!-- カスタムメッセージ -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">カスタムエラーメッセージ</h3>
            <dads-textarea
              id="test-custom"
              label="カスタムメッセージ"
              support-text="スロットでエラーメッセージをカスタマイズ"
              required
              maxlength="10"
              show-counter
              auto-validate
            >
              <span slot="required-error">入力してください（カスタム）</span>
              <span slot="overflow-error">10文字までです（カスタム）</span>
            </dads-textarea>
          </section>

          <!-- 複合テスト -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">複合テスト（必須 + 文字数制限）</h3>
            <dads-textarea
              id="test-combined"
              label="お問い合わせ内容"
              support-text="必須項目です。100文字以内で入力してください。"
              required
              maxlength="100"
              show-counter
              auto-validate
            ></dads-textarea>
          </section>

          <!-- バリデーション無効（比較用） -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">バリデーション無効（比較用）</h3>
            <dads-textarea
              id="test-no-validate"
              label="auto-validateなし"
              support-text="auto-validate属性がないため、blur/submitでバリデーションされません。"
              required
              maxlength="10"
              show-counter
            ></dads-textarea>
          </section>

          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
            <dads-button variant="outlined" type="reset">リセット</dads-button>
            <dads-button variant="solid" type="submit">送信</dads-button>
          </div>
        </form>

        <div style="margin-top: 40px; background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-bottom: 10px;">テスト手順</h3>
          <ol style="color: #856404; line-height: 1.8; padding-left: 20px;">
            <li>「文字数テスト」に16文字以上入力し、フォーカスを外す → エラー表示</li>
            <li>文字を削減して入力 → エラークリア</li>
            <li>「必須項目」を空のまま「送信」ボタン → エラー表示</li>
            <li>カスタムメッセージの表示確認</li>
            <li>auto-validateなしのフィールドでは、バリデーションが発生しないことを確認</li>
          </ol>
        </div>
      </section>

      <script type="module">
        await import('dads-textarea');
        await Promise.all([import('dads-switch'), import('a11y-annotate')]);
        const form = document.getElementById('validation-form');
        if (form) form.addEventListener('submit', (e) => e.preventDefault());
      </script>
    </div>
  `,


  inputTextValidation: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="${DEMO_H2_STYLE}">インプットテキスト（バリデーション検証）</h2>
      <p style="color: #666; margin-bottom: 32px;">
        auto-validate 属性による必須バリデーションと、Emailフォーマット検証の作例です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-input-text">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-input-text
              label="メールアドレス"
              type="email"
              support-text="必須 / Email形式を検証します"
              required
              auto-validate
            ></dads-input-text>
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
            'dads-input-text',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-input-text
                  data-api-target
                  label="メールアドレス"
                  type="email"
                  support-text="required / type を操作できます"
                  required
                  auto-validate
                >
                  <span slot="required-error">入力してください（カスタム）</span>
                  <span slot="type-mismatch-error">正しいメールアドレス形式で入力してください（カスタム）</span>
                </dads-input-text>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-input-text
                      label="メールアドレス"
                      type="email"
                      support-text="required / type を操作できます"
                      required
                      auto-validate
                    >
                      <span slot="required-error">入力してください（カスタム）</span>
                      <span slot="type-mismatch-error">正しいメールアドレス形式で入力してください（カスタム）</span>
                    </dads-input-text>
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
                        <th scope="row"><code>type</code></th>
                        <td><code>attr</code></td>
                        <td><code>email</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="type" data-api-attr="type" data-default="email">
                              <option value="text">text</option>
                              <option value="email" selected>email</option>
                            </select>
                          </div>
                        </td>
                        <td>入力タイプ</td>
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
                        <th scope="row"><code>auto-validate</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="auto-validate" data-api-attr="auto-validate" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>自動バリデーション</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>メールアドレス</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="メールアドレス"
                              data-api-attr="label"
                              data-default="メールアドレス"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル</td>
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
                        <td>ボーダー色</td>
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

      <section style="margin-top: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Validation Scenarios</h3>

        <form id="input-validation-form" novalidate>
          <!-- 必須バリデーション -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">必須バリデーション</h3>
            <dads-input-text
              id="test-required-input"
              label="必須項目"
              support-text="空のまま送信するとエラー表示されます"
              required
              auto-validate
            ></dads-input-text>
          </section>

          <!-- Emailバリデーション -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">Emailバリデーション</h3>
            <dads-input-text
              id="test-email-input"
              label="メールアドレス"
              type="email"
              support-text="不正な形式（@なし等）で送信するとエラー表示されます"
              auto-validate
            ></dads-input-text>
          </section>

          <!-- 必須 + Emailバリデーション -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">必須 + Emailバリデーション（複合）</h3>
            <dads-input-text
              id="test-combined-input"
              label="メールアドレス（必須）"
              type="email"
              support-text="必須チェック → Email形式チェックの順で検証"
              required
              auto-validate
            ></dads-input-text>
          </section>

          <!-- カスタムエラーメッセージ（必須） -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">カスタムエラーメッセージ（必須）</h3>
            <dads-input-text
              id="test-custom-required-input"
              label="お名前"
              support-text="required-errorスロットでメッセージをカスタマイズ"
              required
              auto-validate
            >
              <span slot="required-error">お名前を入力してください（カスタム）</span>
            </dads-input-text>
          </section>

          <!-- カスタムエラーメッセージ（Email） -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">カスタムエラーメッセージ（Email）</h3>
            <dads-input-text
              id="test-custom-email-input"
              label="連絡先メール"
              type="email"
              support-text="type-mismatch-errorスロットでメッセージをカスタマイズ"
              auto-validate
            >
              <span slot="type-mismatch-error">正しいメールアドレス形式で入力してください（カスタム）</span>
            </dads-input-text>
          </section>

          <!-- バリデーション無効（比較用） -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">バリデーション無効（比較用）</h3>
            <dads-input-text
              id="test-no-validate-input"
              label="auto-validateなし"
              support-text="auto-validate属性がないため、バリデーションされません"
              required
            ></dads-input-text>
          </section>

          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
            <dads-button type="reset">リセット</dads-button>
            <dads-button type="submit" variant="solid">送信</dads-button>
          </div>
        </form>

        <div style="margin-top: 40px; background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-bottom: 10px;">テスト手順</h3>
          <ol style="color: #856404; line-height: 1.8; padding-left: 20px;">
            <li>「必須項目」を空のまま「送信」ボタン → 「この項目は入力が必須です」エラー表示</li>
            <li>値を入力して再送信 → エラークリア、送信成功</li>
            <li>「Emailバリデーション」に「test」と入力して送信 → 「メールアドレスの形式が正しくありません」エラー表示</li>
            <li>「test@example.com」と入力して送信 → エラークリア、送信成功</li>
            <li>「必須 + Email」を空のまま送信 → 必須エラー表示</li>
            <li>「必須 + Email」に「test」と入力して送信 → Emailエラー表示（必須は通過）</li>
            <li>カスタムメッセージのスロット表示確認</li>
            <li>auto-validateなしのフィールドでは、バリデーションが発生しないことを確認</li>
          </ol>
        </div>
      </section>

      <script type="module">
        await import('dads-input-text');
        await Promise.all([import('dads-switch'), import('a11y-annotate')]);
        const form = document.getElementById('input-validation-form');
        if (form) form.addEventListener('submit', (e) => e.preventDefault());
      </script>
    </div>
  `,


  selectValidation: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="${DEMO_H2_STYLE}">セレクトボックス（バリデーション検証）</h2>
      <p style="color: #666; margin-bottom: 32px;">
        auto-validate 属性による必須バリデーションの作例です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-select">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-select
              label="必須項目"
              support-text="必須を検証します"
              required
              auto-validate
            >
              <option value="">選択してください</option>
              <option value="1">選択肢1</option>
              <option value="2">選択肢2</option>
              <option value="3">選択肢3</option>
            </dads-select>
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
            'dads-select',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-select
                  data-api-target
                  label="必須項目"
                  support-text="required / auto-validate を操作できます"
                  required
                  auto-validate
                >
                  <option value="">選択してください</option>
                  <option value="1">選択肢1</option>
                  <option value="2">選択肢2</option>
                  <option value="3">選択肢3</option>
                  <span slot="required-error">選択してください（カスタム）</span>
                </dads-select>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-select
                      label="必須項目"
                      support-text="required / auto-validate を操作できます"
                      required
                      auto-validate
                    >
                      <option value="">選択してください</option>
                      <option value="1">選択肢1</option>
                      <option value="2">選択肢2</option>
                      <option value="3">選択肢3</option>
                      <span slot="required-error">選択してください（カスタム）</span>
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
                        <th scope="row"><code>auto-validate</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="auto-validate" data-api-attr="auto-validate" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>自動バリデーション</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>必須項目</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value="必須項目"
                              data-api-attr="label"
                              data-default="必須項目"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル</td>
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
                        <td>ボーダー色</td>
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
                        <th scope="row"><code>--dads-select-chevron-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-select-chevron-color" value="" data-api-css-var="--dads-select-chevron-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印色</td>
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

      <section style="margin-top: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Validation Scenarios</h3>

        <form id="select-validation-form" novalidate>
          <!-- 必須バリデーション -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">必須バリデーション</h3>
            <dads-select
              label="必須項目"
              support-text="空のまま送信するとエラー表示されます"
              required
              auto-validate
            >
              <option value="">選択してください</option>
              <option value="1">選択肢1</option>
              <option value="2">選択肢2</option>
              <option value="3">選択肢3</option>
            </dads-select>
          </section>

          <!-- カスタムエラーメッセージ -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">カスタムエラーメッセージ（required-error）</h3>
            <dads-select
              label="お住まいの地域"
              support-text="required-errorスロットでメッセージをカスタマイズ"
              required
              auto-validate
            >
              <option value="">選択してください</option>
              <option value="east">東日本</option>
              <option value="west">西日本</option>
              <span slot="required-error">地域を選択してください（カスタム）</span>
            </dads-select>
          </section>

          <!-- バリデーション無効（比較用） -->
          <section style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">バリデーション無効（比較用）</h3>
            <dads-select
              label="auto-validateなし"
              support-text="auto-validate属性がないため、バリデーションされません"
              required
            >
              <option value="">選択してください</option>
              <option value="1">選択肢1</option>
              <option value="2">選択肢2</option>
            </dads-select>
          </section>

          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
            <dads-button type="reset">リセット</dads-button>
            <dads-button type="submit" variant="solid">送信</dads-button>
          </div>
        </form>

        <div style="margin-top: 40px; background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-bottom: 10px;">テスト手順</h3>
          <ol style="color: #856404; line-height: 1.8; padding-left: 20px;">
            <li>「必須項目」を未選択のまま「送信」ボタン → エラー表示</li>
            <li>選択肢を選んで再送信 → エラークリア</li>
            <li>カスタムメッセージの表示確認（required-errorスロット）</li>
            <li>auto-validateなしのフィールドでは、バリデーションが発生しないことを確認</li>
          </ol>
        </div>
      </section>

      <script type="module">
        await import('dads-select');
        await Promise.all([import('dads-switch'), import('a11y-annotate')]);
        const form = document.getElementById('select-validation-form');
        if (form) form.addEventListener('submit', (e) => e.preventDefault());
      </script>
    </div>
  `,

  menuListBoxFidelity: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="${DEMO_H2_STYLE}">メニューリストボックス（忠実度検証）</h2>
      <p style="color: #666; margin-bottom: 24px;">
        E2E・Figma検証用デモ（ID安定性優先）。人間向けショーケースは <code>menuListBox</code> を参照してください。
      </p>

      <!-- E2E参照デモ群 -->
      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Standard（Figma: icon + label）</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-menu-list-box
            id="demo-menu-list-box-basic"
            data-status-id="menu-list-box-status-basic"
            variant="text"
            size="sm"
            label="メニュー"
          >
            ${MENU_LIST_BOX_OPENER_ICON}
            <dads-menu-list-item>メニュー項目1</dads-menu-list-item>
            <dads-menu-list-item>メニュー項目2</dads-menu-list-item>
            <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
            <dads-menu-list-item>メニュー項目4</dads-menu-list-item>
            <dads-menu-list-item>メニュー項目5</dads-menu-list-item>
            <dads-menu-list-item>メニュー項目6</dads-menu-list-item>
            <dads-menu-list-item>メニュー項目7</dads-menu-list-item>
          </dads-menu-list-box>

          <button type="button">外側クリック確認用</button>
          <span id="menu-list-box-status-basic" style="font-family: monospace; color: #666;">選択: -</span>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Start icon items（Figma: 8263-19774）</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-menu-list-box
            id="demo-menu-list-box-item-icons"
            data-status-id="menu-list-box-status-item-icons"
            data-sync-current
            variant="outlined"
            size="sm"
            label="選択リストタイトル"
            open
          >
            <dads-menu-list-item current data-value="edit">${menuListItemStartIcon('edit')}リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="download">${menuListItemStartIcon('download')}リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="duplicate">${menuListItemStartIcon('duplicate')}リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="delete">${menuListItemStartIcon('delete')}リストアイテム</dads-menu-list-item>
          </dads-menu-list-box>

          <span id="menu-list-box-status-item-icons" style="font-family: monospace; color: #666;">選択: edit</span>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Start icon + description（Figma: 8263-19830）</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-menu-list-box
            id="demo-menu-list-box-description"
            data-status-id="menu-list-box-status-description"
            data-sync-current
            variant="outlined"
            size="sm"
            label="選択リストタイトル"
            open
          >
            ${menuListBoxDescriptionItems(8)}
          </dads-menu-list-box>

          <span id="menu-list-box-status-description" style="font-family: monospace; color: #666;">選択: 1</span>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Category + divider（Figma: 8263-19815）</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-menu-list-box
            id="demo-menu-list-box-category"
            data-status-id="menu-list-box-status-category"
            data-sync-current
            variant="outlined"
            size="sm"
            label="選択リストタイトル"
            open
          >
            <dads-menu-list-item
              data-value="category-1"
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>

            <dads-menu-list-item data-value="item-1">リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="item-2">リストアイテム</dads-menu-list-item>

            <dads-divider></dads-divider>

            <dads-menu-list-item
              data-value="category-2"
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>

            <dads-menu-list-item data-value="item-3">リストアイテム</dads-menu-list-item>
            <dads-menu-list-item current data-value="checked">${menuListItemStartIcon('checkmark')}リストアイテム</dads-menu-list-item>

            <dads-divider></dads-divider>

            <dads-menu-list-item
              data-value="category-3"
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>

            <dads-menu-list-item data-value="item-4">リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="item-5">リストアイテム</dads-menu-list-item>
          </dads-menu-list-box>

          <span id="menu-list-box-status-category" style="font-family: monospace; color: #666;">選択: checked</span>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Current（選択状態の表現）</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-menu-list-box
            id="demo-menu-list-box-current"
            data-status-id="menu-list-box-status-current"
            data-sync-current
            variant="text"
            size="sm"
            label="選択中"
          >
            <dads-menu-list-item current data-value="a">リストアイテムA</dads-menu-list-item>
            <dads-menu-list-item data-value="b">リストアイテムB</dads-menu-list-item>
            <dads-menu-list-item data-value="c">リストアイテムC</dads-menu-list-item>
          </dads-menu-list-box>

          <span id="menu-list-box-status-current" style="font-family: monospace; color: #666;">選択: a</span>
        </div>
      </section>

      <!-- Figma Fidelity Test Demos -->
      <section style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Figma Fidelity Test Demos</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 24px;">
          以下はFigmaデザインとの比較テスト用デモです。テスト実行時にopen属性が動的に付与されます。
        </p>

        <!-- 19766: Basic Menu List (plain items) -->
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">Figma 8263:19766 - Basic Menu List (plain items)</h4>
          <dads-menu-list-box
            id="demo-menu-list-box-figma-19766"
            variant="text"
            size="sm"
            label="選択リストタイトル"
          >
            ${MENU_LIST_BOX_OPENER_ICON}
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
          </dads-menu-list-box>
        </div>

        <!-- 19781: Basic Menu List (start icons + current) -->
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">Figma 8263:19781 - Basic Menu List (start icons + current)</h4>
          <dads-menu-list-box
            id="demo-menu-list-box-figma-19781"
            variant="outlined"
            size="sm"
            label="選択リストタイトル"
          >
            ${MENU_LIST_BOX_OPENER_ICON}
            <dads-menu-list-item current data-value="edit">${menuListItemStartIcon('edit')}リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="download">${menuListItemStartIcon('download')}リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="duplicate">${menuListItemStartIcon('duplicate')}リストアイテム</dads-menu-list-item>
            <dads-menu-list-item data-value="delete">${menuListItemStartIcon('delete')}リストアイテム</dads-menu-list-item>
          </dads-menu-list-box>
        </div>

        <!-- 19788: Menu List with Scrollbar -->
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">Figma 8263:19788 - Menu List with Scrollbar</h4>
          <dads-menu-list-box
            id="demo-menu-list-box-figma-19788"
            variant="text"
            size="sm"
            label="選択リストタイトル"
          >
            ${MENU_LIST_BOX_OPENER_ICON}
            ${menuListBoxNumberedItems(12)}
          </dads-menu-list-box>
        </div>

        <!-- 19800: Menu List with Scrollbar & Categories -->
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">Figma 8263:19800 - Menu List with Scrollbar & Categories</h4>
          <dads-menu-list-box
            id="demo-menu-list-box-figma-19800"
            variant="outlined"
            size="sm"
            label="選択リストタイトル"
          >
            ${MENU_LIST_BOX_OPENER_ICON}
            <dads-menu-list-item
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-divider></dads-divider>
            <dads-menu-list-item
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-divider></dads-divider>
            <dads-menu-list-item
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
          </dads-menu-list-box>
        </div>

        <!-- 19832: Menu List with Categories -->
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">Figma 8263:19832 - Menu List with Categories</h4>
          <dads-menu-list-box
            id="demo-menu-list-box-figma-19832"
            variant="outlined"
            size="sm"
            label="選択リストタイトル"
          >
            ${MENU_LIST_BOX_OPENER_ICON}
            <dads-menu-list-item
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-divider></dads-divider>
            <dads-menu-list-item
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
          </dads-menu-list-box>
        </div>
      </section>

      <script>
        customElements.whenDefined('dads-menu-list-box').then(() => {
          const boxes = Array.from(document.querySelectorAll('dads-menu-list-box'));

          // デモ表示上、初期状態で複数 open だと重なって見づらいため、1つだけ開く
          const initiallyOpen = boxes.filter((box) => box.hasAttribute('open'));
          for (const box of initiallyOpen.slice(1)) box.removeAttribute('open');

          // open されたら他は閉じる（重なり防止）
          for (const box of boxes) {
            const observer = new MutationObserver(() => {
              if (!box.hasAttribute('open')) return;
              for (const other of boxes) {
                if (other === box) continue;
                other.removeAttribute('open');
              }
            });
            observer.observe(box, { attributes: true, attributeFilter: ['open'] });
          }

          for (const box of boxes) {
            box.addEventListener('menuitemselect', (e) => {
              const statusId = box.getAttribute('data-status-id');
              if (statusId) {
                const status = document.getElementById(statusId);
                if (status) status.textContent = '選択: ' + e.detail.selectedValue;
              }

              if (box.hasAttribute('data-sync-current')) {
                const items = Array.from(box.querySelectorAll('dads-menu-list-item'));
                for (const item of items) item.removeAttribute('current');
                if (e.detail.selectedItem) e.detail.selectedItem.setAttribute('current', '');
              }
            });
          }
        });
      </script>

      ${modulePreloadScript(['dads-menu-list-box', 'dads-divider'])}
    </div>
  `,

  listFidelity: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="${DEMO_H2_STYLE}">箇条書きリスト（忠実度検証）</h2>
      <p style="color: #666; margin-bottom: 24px;">
        E2E・VRT検証用デモ（ID安定性優先）。人間向けショーケースは <code>list</code> を参照してください。
      </p>

      <style>
        .list-fidelity-caption {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          color: #666;
          margin-bottom: 12px;
        }
        .list-fidelity-section {
          margin-bottom: 32px;
        }
        .list-fidelity-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 900px) {
          .list-fidelity-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        .list-fidelity-capture {
          width: 280px; /* Figma frames are 280px wide */
          box-sizing: border-box;
        }
        .list-fidelity-capture--unordered {
          padding: 12px 0 12px 24px;
        }
        .list-fidelity-capture--ordered {
          padding: 12px 0;
        }
      </style>

      <section class="list-fidelity-section">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Unordered (marker)</h3>
        <div class="list-fidelity-grid">
          <div>
            <div class="list-fidelity-caption">spacing=lg (8263:22351)</div>
            <div id="demo-list-unordered-spacing-lg" class="list-fidelity-capture list-fidelity-capture--unordered">
              <dads-list variant="marker" spacing="lg">
                <dads-list-item>リストアイテム1</dads-list-item>
                <dads-list-item>リストアイテム2</dads-list-item>
                <dads-list-item>
                  リストアイテム3
                  <dads-list variant="marker" spacing="lg">
                    <dads-list-item>リストアイテム3.1</dads-list-item>
                    <dads-list-item>リストアイテム3.2</dads-list-item>
                    <dads-list-item>
                      リストアイテム3.3
                      <dads-list variant="marker" spacing="lg">
                        <dads-list-item>リストアイテム3.3.1</dads-list-item>
                        <dads-list-item>リストアイテム3.3.2</dads-list-item>
                      </dads-list>
                    </dads-list-item>
                  </dads-list>
                </dads-list-item>
              </dads-list>
            </div>
          </div>

          <div>
            <div class="list-fidelity-caption">spacing=md (8263:22341)</div>
            <div id="demo-list-unordered-spacing-md" class="list-fidelity-capture list-fidelity-capture--unordered">
              <dads-list variant="marker" spacing="md">
                <dads-list-item>リストアイテム1</dads-list-item>
                <dads-list-item>リストアイテム2</dads-list-item>
                <dads-list-item>
                  リストアイテム3
                  <dads-list variant="marker" spacing="md">
                    <dads-list-item>リストアイテム3.1</dads-list-item>
                    <dads-list-item>リストアイテム3.2</dads-list-item>
                    <dads-list-item>
                      リストアイテム3.3
                      <dads-list variant="marker" spacing="md">
                        <dads-list-item>リストアイテム3.3.1</dads-list-item>
                        <dads-list-item>リストアイテム3.3.2</dads-list-item>
                      </dads-list>
                    </dads-list-item>
                  </dads-list>
                </dads-list-item>
              </dads-list>
            </div>
          </div>

          <div>
            <div class="list-fidelity-caption">spacing=sm (8263:22430)</div>
            <div id="demo-list-unordered-spacing-sm" class="list-fidelity-capture list-fidelity-capture--unordered">
              <dads-list variant="marker" spacing="sm">
                <dads-list-item>リストアイテム1</dads-list-item>
                <dads-list-item>リストアイテム2</dads-list-item>
                <dads-list-item>
                  リストアイテム3
                  <dads-list variant="marker" spacing="sm">
                    <dads-list-item>リストアイテム3.1</dads-list-item>
                    <dads-list-item>リストアイテム3.2</dads-list-item>
                    <dads-list-item>
                      リストアイテム3.3
                      <dads-list variant="marker" spacing="sm">
                        <dads-list-item>リストアイテム3.3.1</dads-list-item>
                        <dads-list-item>リストアイテム3.3.2</dads-list-item>
                      </dads-list>
                    </dads-list-item>
                  </dads-list>
                </dads-list-item>
              </dads-list>
            </div>
          </div>
        </div>
      </section>

      <section class="list-fidelity-section">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Ordered (number, copyable marker slot)</h3>
        <div class="list-fidelity-grid">
          <div>
            <div class="list-fidelity-caption">spacing=lg (8263:22408)</div>
            <div id="demo-list-ordered-spacing-lg" class="list-fidelity-capture list-fidelity-capture--ordered">
              <dads-list variant="number" spacing="lg" marker-width="2">
                <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                <dads-list-item>
                  <span slot="marker">3.</span>リストアイテム
                  <dads-list variant="number" spacing="lg" marker-width="2">
                    <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                    <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                    <dads-list-item>
                      <span slot="marker">3.</span>リストアイテム
                      <dads-list variant="number" spacing="lg" marker-width="2">
                        <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                        <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                        <dads-list-item><span slot="marker">3.</span>リストアイテム</dads-list-item>
                      </dads-list>
                    </dads-list-item>
                  </dads-list>
                </dads-list-item>
              </dads-list>
            </div>
          </div>

          <div>
            <div class="list-fidelity-caption">spacing=md (8263:22397)</div>
            <div id="demo-list-ordered-spacing-md" class="list-fidelity-capture list-fidelity-capture--ordered">
              <dads-list variant="number" spacing="md" marker-width="2">
                <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                <dads-list-item>
                  <span slot="marker">3.</span>リストアイテム
                  <dads-list variant="number" spacing="md" marker-width="2">
                    <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                    <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                    <dads-list-item>
                      <span slot="marker">3.</span>リストアイテム
                      <dads-list variant="number" spacing="md" marker-width="2">
                        <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                        <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                        <dads-list-item><span slot="marker">3.</span>リストアイテム</dads-list-item>
                      </dads-list>
                    </dads-list-item>
                  </dads-list>
                </dads-list-item>
              </dads-list>
            </div>
          </div>

          <div>
            <div class="list-fidelity-caption">spacing=sm (8263:22419)</div>
            <div id="demo-list-ordered-spacing-sm" class="list-fidelity-capture list-fidelity-capture--ordered">
              <dads-list variant="number" spacing="sm" marker-width="2">
                <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                <dads-list-item>
                  <span slot="marker">3.</span>リストアイテム
                  <dads-list variant="number" spacing="sm" marker-width="2">
                    <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                    <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                    <dads-list-item>
                      <span slot="marker">3.</span>リストアイテム
                      <dads-list variant="number" spacing="sm" marker-width="2">
                        <dads-list-item><span slot="marker">1.</span>リストアイテム</dads-list-item>
                        <dads-list-item><span slot="marker">2.</span>リストアイテム</dads-list-item>
                        <dads-list-item><span slot="marker">3.</span>リストアイテム</dads-list-item>
                      </dads-list>
                    </dads-list-item>
                  </dads-list>
                </dads-list-item>
              </dads-list>
            </div>
          </div>
        </div>
      </section>

      ${modulePreloadScript(['dads-list'])}
    </div>
  `,

  descriptionListFidelity: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="${DEMO_H2_STYLE}">説明リスト（忠実度検証）</h2>
      <p style="color: #666; margin-bottom: 24px;">
        E2E・VRT検証用デモ（ID安定性優先）。人間向けショーケースは <code>descriptionList</code> を参照してください。
      </p>

      <style>
        .description-list-fidelity-caption {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          color: #666;
          margin-bottom: 12px;
        }
        .description-list-fidelity-capture {
          inline-size: 760px;
          max-inline-size: 100%;
        }
      </style>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Playground（marker=none）</h3>
        <div class="description-list-fidelity-caption">Storybook: components-説明リスト--playground</div>
        <div class="description-list-fidelity-capture">
          <dads-description-list id="demo-description-list-playground" marker="none">
            <div>
              <dt>項目名1</dt>
              <dd>これは項目1の説明文です。説明リストは用語とその説明をセットで表示するのに適しています。</dd>
            </div>
            <div>
              <dt>項目名2</dt>
              <dd>これは項目2の説明文です。マーカーの種類を変更することで、ブレットや連番を表示できます。</dd>
            </div>
            <div>
              <dt>項目名3</dt>
              <dd>これは項目3の説明文です。HTMLのdl、dt、dd要素に対応したコンポーネントです。</dd>
            </div>
          </dads-description-list>
        </div>
      </section>

      ${modulePreloadScript(['dads-description-list'])}
    </div>
  `,

  empty: () => `
    <div style="padding: 40px; text-align: center; color: #666;">
      コンポーネントを選択してください
    </div>
  `,
} as const;
