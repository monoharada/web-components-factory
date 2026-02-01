import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  API_TABLE_PROPS_WITH_TYPE_HEADER,
  CHIP_LABEL_ICON_SVG,
  annotationToggleScript,
  annotationToggleUI,
  dadsColHeaderLine,
  dadsColHeaderLines,
  dadsDataCellLines,
  dadsDataRows,
  dadsHeaderRow,
  dadsRowHeaderRows,
  modulePreloadScript,
  renderAllChipLabels,
  renderApiPanelWrapper,
  repeatLines,
} from './shared.js';

export const demos = {

  blockquote: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">引用ブロックコンポーネント</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム準拠の引用ブロックコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈（a11y-annotate） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-blockquote">
          <div style="padding: 60px 0;">
            <dads-blockquote>
              <p slot="lead">これは冒頭の段落です。</p>
              <p>本文の段落です。デジタル庁デザインシステムのスタイルに準拠しています。</p>
              <p slot="close">締め括りの段落です。</p>
            </dads-blockquote>
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
            'dads-blockquote',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-blockquote data-api-target>
                  <p slot="lead">これは冒頭の段落です。</p>
                  <p>本文の段落です。</p>
                  <p slot="close">締め括りの段落です。</p>
                </dads-blockquote>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-blockquote>
                      <p slot="lead">これは冒頭の段落です。</p>
                      <p>本文の段落です。</p>
                      <p slot="close">締め括りの段落です。</p>
                    </dads-blockquote>
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
                        <th scope="row"><code>cite</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="cite"
                              value=""
                              data-api-attr="cite"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>引用元URL</td>
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
                        <th scope="row"><code>--dads-blockquote-gap</code></th>
                        <td><code>--spacing-4</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-gap" value="" data-api-css-var="--dads-blockquote-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>段落間の余白</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-margin-inline</code></th>
                        <td><code>--spacing-10</code><br><small style="color:#666">(40px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-margin-inline" value="" data-api-css-var="--dads-blockquote-margin-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右マージン</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-padding-inline-start</code></th>
                        <td><code>--spacing-6</code><br><small style="color:#666">(24px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-padding-inline-start" value="" data-api-css-var="--dads-blockquote-padding-inline-start" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-padding-inline-end</code></th>
                        <td><code>--spacing-4</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-padding-inline-end" value="" data-api-css-var="--dads-blockquote-padding-inline-end" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-border-width</code></th>
                        <td><code>8px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-border-width" value="" data-api-css-var="--dads-blockquote-border-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左ボーダー幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-border-color</code></th>
                        <td><code>--color-neutral-solid-gray-536</code><br><small style="color:#666">(#767676)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-border-color" value="" data-api-css-var="--dads-blockquote-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左ボーダー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-font-size</code></th>
                        <td><code>1.0625rem</code><br><small style="color:#666">(17px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-font-size" value="" data-api-css-var="--dads-blockquote-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-color</code></th>
                        <td><code>--color-neutral-solid-gray-800</code><br><small style="color:#666">(#333)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-color" value="" data-api-css-var="--dads-blockquote-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字色</td>
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

      <!-- 基本（デフォルトスロットのみ） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本（デフォルトスロット）</h3>
        <dads-blockquote>
          <p>デジタル庁は、2021年9月1日に設置された日本の行政機関です。デジタル社会形成の司令塔として、国・地方行政のデジタル化を推進しています。</p>
        </dads-blockquote>
      </section>

      <!-- 3スロット構造 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">3スロット構造（lead / default / close）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ lead（冒頭）、デフォルト（本文）、close（締め括り）の3スロットでコンテンツを構造化。CSS Gridのgapで余白制御。
        </p>
        <dads-blockquote>
          <p slot="lead">これは冒頭の段落です。最初に表示されます。</p>
          <p>これは本文の段落1です。デフォルトスロットに配置されます。</p>
          <p>これは本文の段落2です。複数の段落を配置可能です。</p>
          <p slot="close">これは締め括りの段落です。最後に表示されます。</p>
        </dads-blockquote>
      </section>

      <!-- 本文のみ（3段落） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">本文のみ（3段落）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ lead/closeスロットが空の場合、非表示になり余分なgapが発生しません。
        </p>
        <dads-blockquote>
          <p>これは引用文の例です。デジタル庁デザインシステムでは、アクセシビリティファーストの原則に基づいて、すべてのユーザーが利用しやすいサービスの提供を目指しています。</p>
          <p>デジタル社会の形成は、国民の利便性向上を第一に考え、誰一人取り残されないよう配慮することが重要です。</p>
          <p>私たちは、これらの理念を実現するために、継続的な改善と研究・実践を行っています。</p>
        </dads-blockquote>
      </section>

      <!-- リスト付き -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">リスト付き</h3>
        <dads-blockquote>
          <p slot="lead">デジタル庁が推進する主な取り組み：</p>
          <ul>
            <li>マイナンバーカードの普及促進</li>
            <li>行政手続きのオンライン化</li>
            <li>データ連携基盤の整備</li>
          </ul>
        </dads-blockquote>
      </section>

      <!-- cite属性付き -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">cite属性付き</h3>
        <dads-blockquote cite="https://www.digital.go.jp/">
          <p>デジタル庁は、デジタル社会形成基本法に基づき、デジタル社会の形成に関する施策を迅速かつ重点的に推進することを目的として設置されました。</p>
        </dads-blockquote>
        <p style="margin-top: 10px; font-size: 14px; color: #666;">
          ※ cite属性は視覚的には表示されませんが、内部のblockquote要素に引用元URLとして設定されます。
        </p>
      </section>

      <!-- 自動スロット割り当て（3要素以上） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">自動スロット割り当て（3要素以上）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ slot属性なしで自動振り分け：最初→lead, 中間→body, 最後→close
        </p>
        <dads-blockquote>
          <p>これは最初の段落です。自動的にleadスロットに配置。</p>
          <p>これは中間の段落です。bodyスロットに配置。</p>
          <p>これは最後の段落です。自動的にcloseスロットに配置。</p>
        </dads-blockquote>
      </section>

      <!-- 自動スロット割り当て（2要素） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">自動スロット割り当て（2要素）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ 2要素の場合：最初→lead, 最後→body
        </p>
        <dads-blockquote>
          <p>これは最初の段落です。leadスロットに配置。</p>
          <p>これは最後の段落です。bodyスロットに配置。</p>
        </dads-blockquote>
      </section>

      <!-- 自動スロット割り当て（1要素） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">自動スロット割り当て（1要素）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ 1要素の場合：lead に配置
        </p>
        <dads-blockquote>
          <p>これは唯一の段落です。leadスロットに配置。</p>
        </dads-blockquote>
      </section>

      <!-- 明示的slot指定と自動振り分けの混在 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">明示的slot指定と自動振り分けの混在</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ slot属性を明示指定した要素は尊重され、残りの要素は自動振り分け
        </p>
        <dads-blockquote>
          <p slot="lead">明示的にlead指定</p>
          <p>自動振り分け1</p>
          <p>自動振り分け2</p>
          <p slot="close">明示的にclose指定</p>
        </dads-blockquote>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-top: 40px;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>DADS準拠:</strong> デジタル庁デザインシステムのスタイルに準拠</li>
          <li><strong>3スロット構造:</strong> lead（冒頭）/ default（本文）/ close（締め括り）</li>
          <li><strong>自動スロット割り当て:</strong> slot属性なしで最初→lead, 中間→body, 最後→close</li>
          <li><strong>空スロット非表示:</strong> 使用しないスロットは自動的に非表示</li>
          <li><strong>CSS Grid + gap:</strong> !importantを使わずに余白制御</li>
          <li><strong>cite属性サポート:</strong> 引用元URLを内部blockquoteに転送</li>
          <li><strong>::part()スタイリング:</strong> 外部からの柔軟なカスタマイズ</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
          <li><strong>TDD開発:</strong> テスト駆動開発で品質を担保</li>
        </ul>
      </div>
    </div>

    ${modulePreloadScript(['dads-blockquote', 'dads-switch'])}
  `,


  button: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ボタンコンポーネント</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステムv2.7.0準拠のボタンコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-button">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-button variant="solid" size="medium">ボタンテキスト</dads-button>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風・サンプル）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          テーブル内の操作が、同じパネル内のターゲット要素へ即時反映されます。
          以降のコンポーネントデモへ横展開するための作例です。
        </p>

        ${renderApiPanelWrapper({
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-button
                  data-api-target
                  variant="solid"
                  size="medium"
                >ボタンテキスト</dads-button>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-button variant="solid" size="medium">ボタンテキスト</dads-button>
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
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>"solid" | "outlined" | "text"</code></td>
                        <td><code>solid</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="variant" data-api-attr="variant" data-default="solid">
                              <option value="solid" selected>solid</option>
                              <option value="outlined">outlined</option>
                              <option value="text">text</option>
                            </select>
                          </div>
                        </td>
                        <td>見た目のバリアント</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>"x-small" | "small" | "medium" | "large"</code></td>
                        <td><code>medium</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="medium">
                              <option value="x-small">x-small</option>
                              <option value="small">small</option>
                              <option value="medium" selected>medium</option>
                              <option value="large">large</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ（最小44px高）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>full-width</code></th>
                        <td><code>attr</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="full-width" data-api-attr="full-width" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>幅100%（親要素基準）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>disabled</code></th>
                        <td><code>prop</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="disabled" data-api-prop="disabled" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>無効状態（デジタル庁では非推奨）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>textContent</code></th>
                        <td><code>prop</code></td>
                        <td><code>string</code></td>
                        <td><code>"ボタンテキスト"</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="textContent"
                              value="ボタンテキスト"
                              data-api-prop="textContent"
                              data-default="ボタンテキスト"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>デフォルトスロット（ラベル文字列）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="aria-label"
                              value=""
                              data-api-attr="aria-label"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>アクセシブルネーム（必要時のみ）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                <p class="wc-api-panel__section-note">
                  ※ 制御は <code>data-api-attr</code> / <code>data-api-prop</code> に宣言し、イベント（<code>dads-input</code>/<code>dads-change</code>）で反映します。
                </p>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-button-background</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-background"
                              value=""
                              data-api-css-var="--dads-button-background"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-button-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-color"
                              value=""
                              data-api-css-var="--dads-button-color"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>文字色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-button-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-border-color"
                              value=""
                              data-api-css-var="--dads-button-border-color"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-button-border-radius</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-border-radius"
                              value=""
                              data-api-css-var="--dads-button-border-radius"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
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

      <!-- バリアント -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">バリアント</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-button variant="solid">Solid（塗り）</dads-button>
          <dads-button variant="outlined">Outlined（枠線）</dads-button>
          <dads-button variant="text">Text（テキスト）</dads-button>
        </div>
      </section>

      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ（最小44px高）</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-button size="x-small">X-Small</dads-button>
          <dads-button size="small">Small</dads-button>
          <dads-button size="medium">Medium</dads-button>
          <dads-button size="large">Large</dads-button>
        </div>
      </section>

      <!-- 実際の使用例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">実際の使用例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9;">
          <form style="max-width: 400px;">
            <div style="margin-bottom: 16px;">
              <label for="demo-email" style="display: block; margin-bottom: 4px; font-weight: 500;">
                メールアドレス
              </label>
              <input
                id="demo-email"
                type="email"
                aria-describedby="demo-email-hint"
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"
              >
              <p id="demo-email-hint" style="margin: 4px 0 0; font-size: 14px; color: #666;">
                例: example@email.com
              </p>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <dads-button variant="text" type="button">キャンセル</dads-button>
              <dads-button variant="solid" type="submit">送信</dads-button>
            </div>
          </form>
        </div>
      </section>

      <!-- フルワイド -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">フルワイドボタン</h3>
        <div style="max-width: 400px;">
          <dads-button variant="solid" full-width>幅100%のボタン</dads-button>
        </div>
      </section>

      <!-- 無効状態（非推奨） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">無効状態（デジタル庁では非推奨）</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-button variant="solid" disabled>無効化されたボタン</dads-button>
          <span style="color: #dc3545; font-size: 14px;">
            ※ デジタル庁ガイドラインでは、disabled属性の使用は推奨されていません
          </span>
        </div>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>WCAG 2.2 AA準拠:</strong> 最小44x44pxタップターゲット</li>
          <li><strong>デザイントークン:</strong> セマンティック & ローカルトークンの2層構造</li>
          <li><strong>Figmaデザイン準拠:</strong> ピクセルパーフェクトな実装</li>
          <li><strong>TDD開発:</strong> 100%テストカバレッジ</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
        </ul>
      </div>
    </div>
  `,

  card: () => `
    <div class="card-page">
      <header class="card-page__header">
        <h2 class="card-page__title">カードコンポーネント</h2>
        <p class="card-page__lead">
          デジタル庁デザインシステム（DADS）準拠のカードコンポーネント。カードの構成ルール（コンテナ/メイン/イメージ/サブ）をWeb Componentsとして提供します。
        </p>
      </header>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <style>
        .card-page {
          padding: var(--spacing-10, 2.5rem) var(--spacing-6, 1.5rem);
          max-width: 1440px;
          margin: 0 auto;
        }

        .card-page__header {
          display: grid;
          gap: var(--spacing-3, 0.75rem);
          margin-bottom: var(--spacing-8, 2rem);
        }

        .card-page__title {
          margin: 0;
          color: var(--color-neutral-solid-gray-900, #1a1a1c);
          font-size: var(--font-size-32, 2rem);
          font-weight: var(--font-weight-700, 700);
          line-height: var(--line-height-140, 1.4);
          letter-spacing: 0.02em;
        }

        .card-page__lead {
          margin: 0;
          color: var(--color-neutral-solid-gray-700, #555555);
          line-height: var(--line-height-170, 1.7);
          max-width: 72rem;
        }

        .card-demo-section {
          margin-bottom: var(--spacing-10, 2.5rem);
        }

        .card-demo-subsection {
          margin-top: var(--spacing-10, 2.5rem);
        }

        .card-section__title {
          margin: 0 0 var(--spacing-4, 1rem);
          color: var(--color-neutral-solid-gray-900, #1a1a1c);
          font-size: var(--font-size-20, 1.25rem);
          font-weight: var(--font-weight-700, 700);
          line-height: var(--line-height-150, 1.5);
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: var(--spacing-3, 0.75rem);
        }

        .card-section__title::before {
          content: '';
          width: calc(4 / 16 * 1rem);
          height: calc(20 / 16 * 1rem);
          border-radius: calc(2 / 16 * 1rem);
          background: var(--color-primitive-blue-900, #0017c1);
          flex-shrink: 0;
        }

        .card-section__note {
          margin: 0 0 var(--spacing-4, 1rem);
          font-size: var(--font-size-14, 0.875rem);
          color: var(--color-neutral-solid-gray-700, #555555);
          line-height: var(--line-height-170, 1.7);
        }

        @media (max-width: 900px) {
          .card-page {
            padding: var(--spacing-8, 2rem) var(--spacing-4, 1rem);
          }
        }

        /* カードデモ共通: リンク下線スタイル */
        .card-demo-section dads-card h2 a {
          color: inherit;
          text-decoration: underline;
          text-decoration-thickness: calc(1 / 16 * 1rem);
          text-underline-offset: calc(3 / 16 * 1rem);
        }

        @media (hover: hover) {
          .card-demo-section dads-card[data-dads-card-delegate]:hover h2 a,
          .card-demo-section dads-card h2 a:hover {
            text-decoration-thickness: calc(3 / 16 * 1rem);
          }

          .card-demo-section dads-card[data-dads-card-delegate]:has(
            :is(
              dads-button,
              button,
              [role="button"],
              input,
              select,
              textarea,
              a:not([data-dads-card-primary])
            ):hover
          )
            h2
            a {
            text-decoration-thickness: calc(1 / 16 * 1rem);
          }
        }
      </style>

      <!-- アクセシビリティ注釈 -->
      <section class="card-demo-section">
        <h3 class="card-section__title">アクセシビリティ注釈（a11y-annotate）</h3>
        <p class="card-section__note">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-card">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-card style="width: min(420px, 100%);">
              <div slot="media" style="aspect-ratio: 3/2; background: linear-gradient(114deg, var(--color-primitive-cyan-400) 0%, var(--color-primitive-purple-500) 100%); display: grid; place-content: center; color: white; font-weight: 700;">
                Media
              </div>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>主リンク（カード面クリックON）</a></h2>
              <p>クリックは主リンクへ委譲されます（テキスト選択/内部ボタン操作は阻害しません）。</p>
              <div slot="sub" style="display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap;">
                <dads-button size="small" variant="outlined">関連情報</dads-button>
                <dads-button size="small" variant="solid">詳しくみる</dads-button>
              </div>
            </dads-card>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section class="card-demo-section">
        <h3 class="card-section__title">API / Controls（Storybook風）</h3>
        <p class="card-section__note">
          <code>layout</code> と CSS vars を変更し、見た目のカスタマイズを確認できます。
          "カード面クリック"は主リンク要素に <code>data-dads-card-delegate</code> を付けることで有効化します。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-card',
            'dads-accordion-details',
            'dads-accordion-item-details',
          ],
          body: `
            <h4 class="wc-api-panel__section-title">Preview</h4>
            <div style="display: grid; gap: 24px; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
              <dads-card data-api-target style="width: min(420px, 100%);">
                <div slot="media" style="aspect-ratio: 3/2; background: var(--color-neutral-solid-gray-100); display: grid; place-content: center; color: #333;">
                  Media
                </div>
                <h2><a href="#" data-demo-card-title data-dads-card-primary data-dads-card-delegate>主リンク（delegate）</a></h2>
                <p data-demo-card-content>layout と CSS vars を調整して確認してください。</p>
                <div slot="sub" style="display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap;">
                  <dads-button size="small" variant="outlined" data-demo-card-sub-button-1>関連情報</dads-button>
                  <dads-button size="small" variant="solid" data-demo-card-sub-button-2>詳しくみる</dads-button>
                </div>
              </dads-card>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                <p style="margin: 0; color: #666; font-size: 12px;">
                  ※ 主リンクから <code>data-dads-card-delegate</code> を外すと、カード面クリックはOFFになります（リンク自体は通常どおりクリック/Enter可能）。
                </p>
              </div>
            </div>

            <dads-accordion-details allow-multiple>
              <dads-accordion-item-details>
                <span slot="header">Usage (HTML)</span>
                <div slot="content">
                  <dads-code-block data-api-code data-api-code-collapse="off">
                    <template>
                      <dads-card>
                        <div slot="media">...</div>
                        <h2><a href="#" data-demo-card-title data-dads-card-primary data-dads-card-delegate>主リンク（delegate）</a></h2>
                        <p data-demo-card-content>layout と CSS vars を調整して確認してください。</p>
                        <div slot="sub" style="display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap;">
                          <dads-button size="small" variant="outlined" data-demo-card-sub-button-1>関連情報</dads-button>
                          <dads-button size="small" variant="solid" data-demo-card-sub-button-2>詳しくみる</dads-button>
                        </div>
                      </dads-card>
                    </template>
                  </dads-code-block>
                </div>
              </dads-accordion-item-details>

              <dads-accordion-item-details>
                <span slot="header">Content (Demo)</span>
                <div slot="content">
                  <dads-table>
                      <table class="wc-api-table" data-cell-border="bottom">
                        ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                        <tbody>
                          <tr>
                            <th scope="row"><code>slot:title</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>主リンク（delegate）</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="title text"
                                  value="主リンク（delegate）"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-title]"
                                  data-default="主リンク（delegate）"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>主リンクのテキスト（デフォルトスロット内）</td>
                          </tr>

                          <tr>
                            <th scope="row"><code>slot:content</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>layout と CSS vars を調整して確認してください。</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="content text"
                                  value="layout と CSS vars を調整して確認してください。"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-content]"
                                  data-default="layout と CSS vars を調整して確認してください。"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>メイン本文のテキスト（デフォルトスロット内）</td>
                          </tr>

                          <tr>
                            <th scope="row"><code>slot:sub (button 1)</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>関連情報</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="sub button 1"
                                  value="関連情報"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-sub-button-1]"
                                  data-default="関連情報"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>サブエリア（slot="sub"）1つ目のボタンラベル</td>
                          </tr>

                          <tr>
                            <th scope="row"><code>slot:sub (button 2)</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>詳しくみる</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="sub button 2"
                                  value="詳しくみる"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-sub-button-2]"
                                  data-default="詳しくみる"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>サブエリア（slot="sub"）2つ目のボタンラベル</td>
                          </tr>
                        </tbody>
                      </table>
                  </dads-table>
                  <p class="wc-api-panel__section-note">
                    ※ slot 内の要素へ <code>textContent</code> を適用してテキストを差し替えます（デモ用）。
                  </p>
                </div>
              </dads-accordion-item-details>

              <dads-accordion-item-details>
                <span slot="header">Props / Attrs</span>
                <div slot="content">
                  <dads-table>
                    <table class="wc-api-table" data-cell-border="bottom">
                      ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                      <tbody>
                        <tr>
                          <th scope="row"><code>layout</code></th>
                          <td><code>attr</code></td>
                          <td><code>"vertical" | "horizontal"</code></td>
                          <td><code>vertical</code></td>
                          <td>
                            <div class="wc-api-control">
                              <select aria-label="layout" data-api-attr="layout" data-default="">
                                <option value="" selected>vertical (default)</option>
                                <option value="horizontal">horizontal</option>
                              </select>
                            </div>
                          </td>
                          <td>レイアウト（縦/横）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>data-dads-card-primary</code></th>
                          <td><code>attr</code></td>
                          <td><code>boolean</code></td>
                          <td><code>true</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-switch
                                aria-label="data-dads-card-primary"
                                data-api-attr="data-dads-card-primary"
                                data-api-target-selector="dads-card [data-demo-card-title]"
                                data-default="true"
                                checked
                              >
                                <span slot="label-left">Off</span>
                                <span slot="label-right">On</span>
                              </dads-switch>
                            </div>
                          </td>
                          <td>主リンク要素を指定（主リンクは1つ）。主リンクに付与します。</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>data-dads-card-delegate</code></th>
                          <td><code>attr</code></td>
                          <td><code>boolean</code></td>
                          <td><code>true</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-switch
                                aria-label="data-dads-card-delegate"
                                data-api-attr="data-dads-card-delegate"
                                data-api-target-selector="dads-card [data-demo-card-title]"
                                data-default="true"
                                checked
                              >
                                <span slot="label-left">Off</span>
                                <span slot="label-right">On</span>
                              </dads-switch>
                            </div>
                          </td>
                          <td>カード面クリック（pointer）を主リンクへ委譲します（主リンクに付与）。</td>
                        </tr>
                      </tbody>
                    </table>
                  </dads-table>
                </div>
              </dads-accordion-item-details>

              <dads-accordion-item-details>
                <span slot="header">CSS vars</span>
                <div slot="content">
                  <dads-table>
                    <table class="wc-api-table" data-cell-border="bottom">
                      ${API_TABLE_CSS_VARS_HEADER}
                      <tbody>
                        <tr>
                          <th scope="row"><code>--dads-card-background</code></th>
                          <td><code>--color-neutral-white</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-background" value="" data-api-css-var="--dads-card-background" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>背景色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-border-color</code></th>
                          <td><code>--color-neutral-solid-gray-420</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-border-color" value="" data-api-css-var="--dads-card-border-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>外周色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-border-width</code></th>
                          <td><code>1px</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-border-width" value="" data-api-css-var="--dads-card-border-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>外周の線幅</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-border-radius</code></th>
                          <td><code>--border-radius-16</code><br><small style="color:#666">(16px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-border-radius" value="" data-api-css-var="--dads-card-border-radius" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>角丸</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-divider-color</code></th>
                          <td><code>--color-neutral-solid-gray-420</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-divider-color" value="" data-api-css-var="--dads-card-divider-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>エリア間の区切り線色（media/sub の境界）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-divider-width</code></th>
                          <td><code>1px</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-divider-width" value="" data-api-css-var="--dads-card-divider-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>エリア間の区切り線幅</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-media-width</code></th>
                          <td><code>calc(352 / 16 * 1rem)</code><br><small style="color:#666">(352px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-media-width" value="" data-api-css-var="--dads-card-media-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>layout="horizontal" のメディア列幅</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-media-aspect-ratio</code></th>
                          <td><code>auto</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-media-aspect-ratio" value="" data-api-css-var="--dads-card-media-aspect-ratio" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>メディア領域の aspect-ratio（未指定は slot 側に委譲）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-padding-block</code></th>
                          <td><code>--spacing-4</code><br><small style="color:#666">(16px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-padding-block" value="" data-api-css-var="--dads-card-padding-block" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>上下パディング（main/sub/media overlay）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-padding-inline</code></th>
                          <td><code>--spacing-6</code><br><small style="color:#666">(24px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-padding-inline" value="" data-api-css-var="--dads-card-padding-inline" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>左右パディング</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-gap</code></th>
                          <td><code>--spacing-4</code><br><small style="color:#666">(16px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-gap" value="" data-api-css-var="--dads-card-gap" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>エリア内の余白（見出し/本文/ボタン等）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-color</code></th>
                          <td><code>--color-neutral-solid-gray-800</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-color" value="" data-api-css-var="--dads-card-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>本文/ラベルなどの文字色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-color</code></th>
                          <td><code>--color-neutral-solid-gray-900</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-color" value="" data-api-css-var="--dads-card-title-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトル文字色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-font-size</code></th>
                          <td><code>--font-size-20</code><br><small style="color:#666">(1.25rem)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-font-size" value="" data-api-css-var="--dads-card-title-font-size" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトル文字サイズ</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-font-weight</code></th>
                          <td><code>--font-weight-700</code><br><small style="color:#666">(700)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-font-weight" value="" data-api-css-var="--dads-card-title-font-weight" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトルの太さ</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-line-height</code></th>
                          <td><code>1.5</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-line-height" value="" data-api-css-var="--dads-card-title-line-height" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトルの行高</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-underline-offset</code></th>
                          <td><code>calc(3 / 16 * 1rem)</code><br><small style="color:#666">(3px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-underline-offset" value="" data-api-css-var="--dads-card-title-underline-offset" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>主リンク時の下線オフセット</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-underline-thickness</code></th>
                          <td><code>calc(1 / 16 * 1rem)</code><br><small style="color:#666">(1px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-underline-thickness" value="" data-api-css-var="--dads-card-title-underline-thickness" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>主リンク時の下線太さ</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-underline-thickness-hover</code></th>
                          <td><code>calc(3 / 16 * 1rem)</code><br><small style="color:#666">(3px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-underline-thickness-hover" value="" data-api-css-var="--dads-card-title-underline-thickness-hover" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>ホバー時の下線太さ（主リンク時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-outline-color</code></th>
                          <td><code>--dads-focus-outline-color</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-outline-color" value="" data-api-css-var="--dads-card-focus-outline-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスアウトライン色（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-outline-width</code></th>
                          <td><code>--dads-focus-outline-width</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-outline-width" value="" data-api-css-var="--dads-card-focus-outline-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスアウトライン幅（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-outline-offset</code></th>
                          <td><code>--dads-focus-outline-offset</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-outline-offset" value="" data-api-css-var="--dads-card-focus-outline-offset" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスアウトラインのオフセット（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-ring-color</code></th>
                          <td><code>--dads-focus-ring-color</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-ring-color" value="" data-api-css-var="--dads-card-focus-ring-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスリング色（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-ring-width</code></th>
                          <td><code>--dads-focus-ring-width</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-ring-width" value="" data-api-css-var="--dads-card-focus-ring-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスリング幅（委譲ON時）</td>
                        </tr>
                      </tbody>
                    </table>
                  </dads-table>
                  ${API_TABLE_CSS_VARS_NOTE}
                </div>
              </dads-accordion-item-details>
            </dads-accordion-details>
`,
        })}
      </section>

      <!-- カード作例1（DADS公式） -->
      <section class="card-demo-section">
        <h3 class="card-section__title">カード作例1（DADS公式）</h3>
        <p class="card-section__note">
          DADS HTML Storybook の「作例1」を <code>&lt;dads-card&gt;</code> で再現しています。
        </p>

        <style>
          .card-example-1-list {
            /* DADS: card example 1 */
            --card-example-1-gap: calc(24 / 16 * 1rem);
            --card-example-1-card-width: calc(352 / 16 * 1rem);
            --card-example-1-border-width: 1px;
            --card-example-1-main-overlap: calc(-24 / 16 * 1rem);
            --card-example-1-main-row-gap: calc(16 / 16 * 1rem);
            --card-example-1-main-padding-block: calc(16 / 16 * 1rem);
            --card-example-1-main-padding-inline: calc(24 / 16 * 1rem);
            --card-example-1-icon-size: calc(64 / 16 * 1rem);
            --card-example-1-icon-offset: calc(-12 / 16 * 1rem);

            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: var(--card-example-1-gap);
            padding: 0;
            list-style: none;
          }

          .card-example-1-list > li {
            display: flex;
            min-width: 0;
          }

          dads-card.card-example-1 {
            box-sizing: border-box;
            min-width: 0;
            width: var(--card-example-1-card-width);
            max-width: 100%;
            --dads-card-border-width: var(--spacing-0-px, 0px);
            --dads-card-divider-width: var(--spacing-0-px, 0px);
            --dads-card-padding-block: var(--spacing-0, 0);
            --dads-card-padding-inline: var(--spacing-0, 0);
            --dads-card-gap: var(--spacing-0, 0);
            --dads-card-background: transparent;
            --dads-card-media-aspect-ratio: 3 / 2;

            --card-example-1-media-overlay: color-mix(
              in srgb,
              var(--color-neutral-white) 10%,
              transparent
            );
          }

          dads-card.card-example-1::part(media) {
            position: relative;
            box-sizing: content-box;
            border: var(--card-example-1-border-width) solid var(--dads-card-border-color);
            border-start-start-radius: var(--dads-card-border-radius);
            border-start-end-radius: var(--dads-card-border-radius);
            background:
              linear-gradient(
                0deg,
                var(--card-example-1-media-overlay) 0%,
                var(--card-example-1-media-overlay) 100%
              ),
              linear-gradient(
                114deg,
                var(--color-primitive-cyan-400) 0%,
                var(--color-primitive-purple-500) 100%
              );
            display: grid;
            place-content: center;
            color: var(--color-neutral-white);
            aspect-ratio: var(--dads-card-media-aspect-ratio);
          }

          .card-example-1__icon {
            width: var(--card-example-1-icon-size);
            height: var(--card-example-1-icon-size);
            translate: 0 var(--card-example-1-icon-offset);
          }

          dads-card.card-example-1::part(main) {
            position: relative;
            margin-top: var(--card-example-1-main-overlap);
            display: grid;
            align-content: start;
            row-gap: var(--card-example-1-main-row-gap);
            border: var(--card-example-1-border-width) solid var(--dads-card-border-color);
            border-radius: var(--dads-card-border-radius);
            background-color: var(--color-neutral-white);
            padding: var(--card-example-1-main-padding-block) var(--card-example-1-main-padding-inline);
          }

          .card-example-1__content {
            color: var(--color-neutral-solid-gray-800);
            font-weight: var(--font-weight-400);
            font-size: var(--font-size-16);
            line-height: var(--line-height-170);
          }

          /* 作例1固有: リンク下線スタイル */
          dads-card.card-example-1 h2 a {
            color: inherit;
            text-decoration: underline;
            text-decoration-thickness: calc(1 / 16 * 1rem);
            text-underline-offset: calc(3 / 16 * 1rem);
          }

          @media (hover: hover) {
            dads-card.card-example-1:hover h2 a {
              text-decoration-thickness: calc(3 / 16 * 1rem);
            }
          }
        </style>

        <ul class="card-example-1-list">
          <li>
            <dads-card class="card-example-1">
              <svg
                slot="media"
                class="card-example-1__icon"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M29.9 8C31.2 6.1 33 6.1 34 8c1.1 1.9 2.2 5 2.2 8.8v6.1l20.5 12.3c1 .8 1.9 2.1 1.9 3.5v4l-23-7.5-.9 12.1-3 2.6h.7l-.5.3-.3-.2-1.7 1.4 2-1.2 6.1 3.7Q39.7 55 40 57l-16 .2q.1-2 1.9-3.4l3.7-2.3L28.3 35l-23 7.8v-4q.1-2.2 1.9-3.5l20.5-12.3v-6.1c0-3.7 1.1-7 2.2-8.8"
                  fill="currentcolor"
                ></path>
              </svg>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>機内サービス</a></h2>
              <p class="card-example-1__content">快適なシートや機内食で空の旅をより快適にお過ごしいただけます</p>
            </dads-card>
          </li>

          <li>
            <dads-card class="card-example-1">
              <svg
                slot="media"
                class="card-example-1__icon"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M32 31.6q2 0 3.4-1.4 1.5-1.4 1.4-3.4 0-2-1.4-3.4Q34 22 32 22q-2 0-3.4 1.4-1.4 1.5-1.4 3.4 0 2 1.4 3.4 1.4 1.5 3.4 1.4m0 25.8A85 85 0 0 1 16.9 41q-5-7.5-5-13.8 0-9.1 6-15 6-5.6 14.1-5.6t14.2 5.7q6 5.7 6 15 0 6.2-5.1 13.7T32 57.4"
                  fill="currentcolor"
                ></path>
              </svg>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>乗り継ぎサポート</a></h2>
              <p class="card-example-1__content">お乗り継ぎ時の際に日本人のガイドがご案内いたします</p>
            </dads-card>
          </li>

          <li>
            <dads-card class="card-example-1">
              <svg
                slot="media"
                class="card-example-1__icon"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M40 5.3H24v8H13.3v40h7q-.4.7-.3 1.4c0 2.1 1.9 4 4 4s4-1.9 4-4q0-.7-.3-1.4h8.6q-.4.7-.3 1.4c0 2.1 1.9 4 4 4s4-1.9 4-4q0-.7-.3-1.4h7v-40H40zM25.3 44h-2.6V24h2.6zm8 0h-2.6V24h2.6zM36 13.3h-8v-4h8zM41.3 24v20h-2.6V24z"
                  fill="currentcolor"
                ></path>
              </svg>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>機内持ち込み手荷物検査</a></h2>
              <p class="card-example-1__content">機内にお持ち込みいただける手荷物について係員が検査いたします</p>
            </dads-card>
          </li>
        </ul>

        <!-- カード作例2（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例2（DADS公式）</h3>
          <p class="card-section__note">DADS HTML Storybook の「作例2」を再現。横型レイアウトで左に画像、右にコンテンツを配置し、ホバー/フォーカス時にスタイル変化</p>

          <style>
            .card-example-2-list {
              list-style: none;
              padding: 0;
              margin: 0;
              margin-top: var(--spacing-4, 1rem);
              display: grid;
              gap: var(--spacing-6, 1.5rem);
            }

            .card-example-2-list > li {
              display: flex;
              align-items: stretch;
            }

            dads-card.card-example-2 {
              max-width: 64rem;
              --dads-card-media-width: minmax(auto, min(50%, 22rem));
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-6, 1.5rem);
              --dads-card-gap: var(--spacing-4, 1rem);
              --dads-card-divider-width: 1px;
              --dads-card-border-radius: 0;
              width: 100%;
            }

            dads-card.card-example-2::part(media) {
              aspect-ratio: 3 / 2;
            }

            dads-card.card-example-2::part(base) {
              overflow: visible;
            }

            .card-example-2__header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: var(--spacing-4, 1rem);
              margin-right: calc(-1 * var(--spacing-6, 1.5rem));
            }

            .card-example-2__heading {
              margin: 0;
              min-width: 0;
              padding-top: var(--spacing-1, 0.25rem);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              font-weight: bold;
              font-size: var(--font-size-20, 1.25rem);
              line-height: 1.5;
              letter-spacing: 0.02em;
            }

            .card-example-2__menu-button {
              flex-shrink: 0;
              background-color: var(--color-neutral-white, #ffffff);
              border: 1px solid transparent;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 2.75rem;
              height: 2.75rem;
              color: var(--color-neutral-solid-gray-800, #414143);
              padding: 0;
              border-radius: var(--spacing-1-5, 0.375rem);
            }

            @media (hover: hover) {
              .card-example-2__menu-button:hover {
                border-color: var(--color-neutral-black, #000000);
                background-color: var(--color-neutral-solid-gray-50, #f8f8fb);
              }
            }

            .card-example-2__menu-button:focus-visible {
              outline: var(--spacing-1, 0.25rem) solid var(--color-neutral-black, #000000);
              outline-offset: var(--spacing-0-5, 0.125rem);
              box-shadow: 0 0 0 var(--spacing-0-5, 0.125rem) var(--color-primitive-yellow-300, #ffd43d);
            }

            .card-example-2__contents {
              margin: 0;
              min-width: 0;
            }

            .card-example-2__divider {
              padding-block: var(--spacing-2, 0.5rem);
              border-top: 1px solid var(--color-neutral-solid-gray-536, #757578);
            }

            .card-example-2__links {
              display: flex;
              column-gap: var(--spacing-4, 1rem);
              justify-content: end;
            }

            .card-example-2__learn-more:any-link {
              display: flex;
              border: 4px double transparent;
              padding: var(--spacing-1-5, 0.375rem) var(--spacing-2, 0.5rem);
              background: var(--color-primitive-light-blue-900, #004098);
              color: var(--color-neutral-white, #ffffff);
              text-decoration: none;
              font-weight: normal;
              font-size: var(--font-size-16, 1rem);
              line-height: 1;
              letter-spacing: 0.02em;
              cursor: pointer;
            }

            @media (hover: hover) {
              .card-example-2__learn-more:any-link:hover {
                background: var(--color-primitive-light-blue-1000, #002d6c);
                text-decoration: underline;
                text-decoration-thickness: 1px;
                text-underline-offset: 3px;
              }
            }

            .card-example-2__learn-more:focus-visible {
              outline: var(--spacing-1, 0.25rem) solid var(--color-neutral-black, #000000);
              outline-offset: var(--spacing-0-5, 0.125rem);
              border-radius: var(--spacing-1, 0.25rem);
              box-shadow: 0 0 0 var(--spacing-0-5, 0.125rem) var(--color-primitive-yellow-300, #ffd43d);
            }
          </style>

          <ul class="card-example-2-list">
            <li>
              <dads-card class="card-example-2" layout="horizontal">
                <img slot="media"
                     src="https://images.unsplash.com/photo-1522383225653-ed111181a951?w=352&h=235&fit=crop"
                     width="352" height="235"
                     alt="満開の桜の枝が青い水面を背景に咲き誇る春の風景写真">
                <div class="card-example-2__header">
                  <h2 class="card-example-2__heading">地域緑化事業</h2>
                  <button class="card-example-2__menu-button" aria-label="メニュー">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="presentation">
                      <circle cx="12" cy="4.5" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="12" cy="19.5" r="1.5"/>
                    </svg>
                  </button>
                </div>
                <p class="card-example-2__contents">住民の皆さまが参加できる地域緑化事業を行っています。地域交流を促進するとともに、地域の景観美化を目的としています。</p>
                <div class="card-example-2__divider"></div>
                <div class="card-example-2__links">
                  <a href="#" class="card-example-2__learn-more">詳しくみる</a>
                </div>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-2" layout="horizontal">
                <img slot="media"
                     src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=352&h=235&fit=crop"
                     width="352" height="235"
                     alt="子どもたちが一緒に遊んでいる公園の風景">
                <div class="card-example-2__header">
                  <h2 class="card-example-2__heading">子育て支援プログラム</h2>
                  <button class="card-example-2__menu-button" aria-label="メニュー">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="presentation">
                      <circle cx="12" cy="4.5" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="12" cy="19.5" r="1.5"/>
                    </svg>
                  </button>
                </div>
                <p class="card-example-2__contents">子育て世代の皆さまを応援する包括的なサポートプログラムです。育児相談から保育サービスまで幅広い支援を提供しています。</p>
                <div class="card-example-2__divider"></div>
                <div class="card-example-2__links">
                  <a href="#" class="card-example-2__learn-more">詳しくみる</a>
                </div>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-2" layout="horizontal">
                <img slot="media"
                     src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=352&h=235&fit=crop"
                     width="352" height="235"
                     alt="パソコンで作業をしている様子">
                <div class="card-example-2__header">
                  <h2 class="card-example-2__heading">デジタル化推進事業</h2>
                  <button class="card-example-2__menu-button" aria-label="メニュー">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="presentation">
                      <circle cx="12" cy="4.5" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="12" cy="19.5" r="1.5"/>
                    </svg>
                  </button>
                </div>
                <p class="card-example-2__contents">市民サービスのデジタル化を推進し、より便利で効率的な行政サービスの提供を目指しています。オンライン申請やAI相談など最新技術を活用しています。</p>
                <div class="card-example-2__divider"></div>
                <div class="card-example-2__links">
                  <a href="#" class="card-example-2__learn-more">詳しくみる</a>
                </div>
              </dads-card>
            </li>
          </ul>
        </section>

        <!-- カード作例3（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例3（DADS公式）</h3>
          <p class="card-section__note">
            DADS HTML Storybook の「作例3」を再現。縦型カードでヘッダー・説明・画像・アクションを配置。
          </p>

          <style>
            /* ========================================
             * Card Example 3 - DADS公式作例3
             * ======================================== */

            /* リストコンテナ - subgridで高さ揃え */
            .card-example-3-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(auto, calc(354 / 16 * 1rem)));
              gap: var(--spacing-8, 2rem) var(--spacing-6, 1.5rem);
            }

            /* 各リストアイテム - subgridで親の行を継承 */
            .card-example-3-list > li {
              display: grid;
              grid-row: span 2;
              grid-template-rows: subgrid;
              min-width: 0;
            }

            /* カード本体 - subgridで高さ揃え */
            dads-card.card-example-3 {
              position: relative;
              z-index: 0;
              box-sizing: border-box;
              display: grid;
              grid-row: span 2;
              row-gap: 0;
              width: 100%;
              max-width: 100%;

              color: var(--color-neutral-solid-gray-800, #333333);
              font-family: var(--font-family-sans);
              font-size: var(--font-size-16, 1rem);
              font-weight: var(--font-weight-400, 400);
              line-height: var(--line-height-170, 1.7);
              letter-spacing: 0.02em;

              /* カードトークン */
              --dads-card-border-width: 1px;
              --dads-card-border-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-border-radius: var(--border-radius-16, 1rem);
              --dads-card-divider-width: 0;
              --dads-card-background: var(--color-neutral-white, #ffffff);
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-6, 1.5rem);
              --dads-card-gap: var(--spacing-4, 1rem);
              --dads-card-color: var(--color-neutral-solid-gray-800, #333333);
            }

            /* フォーカスリング表示 */
            dads-card.card-example-3::part(base) {
              overflow: visible;
            }

            /* main上部のパディング調整 */
            dads-card.card-example-3::part(main) {
              padding-bottom: 0;
            }

            /* ヘッダー（アバター + heading） */
            .card-example-3__header {
              display: flex;
              align-items: start;
              column-gap: var(--spacing-4, 1rem);
              min-width: 0;
            }

            /* heading: ラベル + タイトル（上からラベル、タイトル） */
            .card-example-3__heading {
              display: flex;
              flex-direction: column;
              row-gap: var(--spacing-2, 0.5rem);
              min-width: 0;
              font-weight: var(--font-weight-400, 400);
              font-size: var(--font-size-16, 1rem);
              line-height: var(--line-height-170, 1.7);
              letter-spacing: 0.02em;
            }

            /* ラベル（カテゴリ） */
            .card-example-3__label {
              order: -1;
            }

            /* タイトル */
            .card-example-3__title {
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              font-size: var(--font-size-20, 1.25rem);
              font-weight: var(--font-weight-700, 700);
              line-height: var(--line-height-150, 1.5);
              letter-spacing: 0.02em;
              margin: 0;
              min-width: 0;
            }

            /* タイトルリンク */
            .card-example-3__title a:any-link {
              color: var(--color-primitive-blue-1000, #00118f);
              text-decoration: underline;
              text-decoration-thickness: calc(1 / 16 * 1rem);
              text-underline-offset: calc(3 / 16 * 1rem);
            }

            .card-example-3__title a:visited {
              color: var(--color-primitive-magenta-900, #8b008b);
            }

            @media (hover: hover) {
              .card-example-3__title a:hover {
                color: var(--color-primitive-blue-900, #0017c1);
                text-decoration-thickness: calc(3 / 16 * 1rem);
              }
            }

            .card-example-3__title a:active {
              color: var(--color-primitive-orange-800, #c74700);
              text-decoration-thickness: calc(1 / 16 * 1rem);
            }

            .card-example-3__title a:focus-visible {
              outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black, #000000);
              outline-offset: calc(2 / 16 * 1rem);
              box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300, #ffd43d);
              border-radius: calc(4 / 16 * 1rem);
            }

            /* アバター */
            .card-example-3__avatar {
              border-radius: 0;
              object-fit: cover;
              flex-shrink: 0;
              order: -1;
            }

            /* 説明文 */
            .card-example-3__contents {
              display: flex;
              flex-direction: column;
              row-gap: var(--spacing-4, 1rem);
              min-width: 0;
            }

            .card-example-3__contents > p {
              margin: 0;
            }

            .card-example-3__contents img {
              display: block;
              max-width: 100%;
              height: auto;
            }

            /* アクション */
            .card-example-3__actions {
              margin: 0;
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-end;
              gap: var(--spacing-4, 1rem);
              align-items: center;
              padding: 0;
              list-style: none;
            }
          </style>

          <ul class="card-example-3-list">
            <li>
              <dads-card class="card-example-3">
                <!-- main スロット（デフォルト）: ヘッダー + 説明 -->
                <div class="card-example-3__header">
                  <div class="card-example-3__heading">
                    <h2 class="card-example-3__title">
                      <a href="#">郵送する際のポイント</a>
                    </h2>
                    <span class="card-example-3__label">お役立ち情報</span>
                  </div>
                  <img
                    class="card-example-3__avatar"
                    src="https://design.digital.go.jp/dads/html/assets/card-3-1-DlYbs6z8.png"
                    width="64" height="64"
                    alt="著者のアイコン"
                  >
                </div>
                <div class="card-example-3__contents">
                  <p>重要な書類を郵送する際に注意すべきポイントをご紹介します</p>
                </div>
                <div slot="sub" class="card-example-3__contents">
                  <p>
                    <img
                      src="https://design.digital.go.jp/dads/html/assets/card-3-2-NWWtZhQN.png"
                      width="304" height="235"
                      alt="ポストに書類を投函する人物のイラスト"
                    >
                  </p>
                </div>

                <!-- sub スロット: お気に入りボタン -->
                <ul slot="sub" class="card-example-3__actions">
                  <li>
                    <dads-button variant="outlined" size="small">
                      <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 21-1.4-1.3a113 113 0 0 1-6.8-6.9 9 9 0 0 1-1.4-2.4Q2 9.3 2 8.2q0-2.4 1.6-4Q5 2.7 7.5 2.7a6 6 0 0 1 4.5 2 6 6 0 0 1 4.5-2q2.4 0 4 1.5 1.5 1.5 1.5 4 0 1.1-.4 2.2-.3 1-1.4 2.4t-2.6 3l-4.2 3.9zm0-2.7 6.4-6.4q.9-1 1.3-2l.3-1.7a3.4 3.4 0 0 0-3.5-3.5A4 4 0 0 0 12.9 7h-1.8q-.5-1-1.4-1.7-1-.6-2.2-.6A3.4 3.4 0 0 0 4 8.2l.3 1.7q.4 1 1.3 2 .9 1.2 2.5 2.7z" fill="currentcolor"/>
                      </svg>
                      お気に入り
                    </dads-button>
                  </li>
                </ul>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-3">
                <!-- main スロット（デフォルト）: ヘッダー + 説明 -->
                <div class="card-example-3__header">
                  <div class="card-example-3__heading">
                    <h2 class="card-example-3__title">
                      <a href="#">オンライン申請の手順</a>
                    </h2>
                    <span class="card-example-3__label">手続きガイド</span>
                  </div>
                  <img
                    class="card-example-3__avatar"
                    src="https://design.digital.go.jp/dads/html/assets/card-3-1-DlYbs6z8.png"
                    width="64" height="64"
                    alt="著者のアイコン"
                  >
                </div>
                <div class="card-example-3__contents">
                  <p>マイナンバーカードを使った各種オンライン申請の基本的な手順を分かりやすく解説します</p>
                </div>
                <div slot="sub" class="card-example-3__contents">
                  <p>
                    <img
                      src="https://design.digital.go.jp/dads/html/assets/card-3-2-NWWtZhQN.png"
                      width="304" height="235"
                      alt="パソコンでオンライン申請をする人物のイラスト"
                    >
                  </p>
                </div>

                <!-- sub スロット: お気に入りボタン -->
                <ul slot="sub" class="card-example-3__actions">
                  <li>
                    <dads-button variant="outlined" size="small">
                      <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 21-1.4-1.3a113 113 0 0 1-6.8-6.9 9 9 0 0 1-1.4-2.4Q2 9.3 2 8.2q0-2.4 1.6-4Q5 2.7 7.5 2.7a6 6 0 0 1 4.5 2 6 6 0 0 1 4.5-2q2.4 0 4 1.5 1.5 1.5 1.5 4 0 1.1-.4 2.2-.3 1-1.4 2.4t-2.6 3l-4.2 3.9zm0-2.7 6.4-6.4q.9-1 1.3-2l.3-1.7a3.4 3.4 0 0 0-3.5-3.5A4 4 0 0 0 12.9 7h-1.8q-.5-1-1.4-1.7-1-.6-2.2-.6A3.4 3.4 0 0 0 4 8.2l.3 1.7q.4 1 1.3 2 .9 1.2 2.5 2.7z" fill="currentcolor"/>
                      </svg>
                      お気に入り
                    </dads-button>
                  </li>
                </ul>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-3">
                <!-- main スロット（デフォルト）: ヘッダー + 説明 -->
                <div class="card-example-3__header">
                  <div class="card-example-3__heading">
                    <h2 class="card-example-3__title">
                      <a href="#">よくある質問と回答</a>
                    </h2>
                    <span class="card-example-3__label">FAQ</span>
                  </div>
                  <img
                    class="card-example-3__avatar"
                    src="https://design.digital.go.jp/dads/html/assets/card-3-1-DlYbs6z8.png"
                    width="64" height="64"
                    alt="著者のアイコン"
                  >
                </div>
                <div class="card-example-3__contents">
                  <p>お客様からよくお寄せいただくご質問とその回答をまとめました</p>
                </div>
                <div slot="sub" class="card-example-3__contents">
                  <p>
                    <img
                      src="https://design.digital.go.jp/dads/html/assets/card-3-2-NWWtZhQN.png"
                      width="304" height="235"
                      alt="よくある質問に答えるサポートスタッフのイラスト"
                    >
                  </p>
                </div>

                <!-- sub スロット: お気に入りボタン -->
                <ul slot="sub" class="card-example-3__actions">
                  <li>
                    <dads-button variant="outlined" size="small">
                      <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 21-1.4-1.3a113 113 0 0 1-6.8-6.9 9 9 0 0 1-1.4-2.4Q2 9.3 2 8.2q0-2.4 1.6-4Q5 2.7 7.5 2.7a6 6 0 0 1 4.5 2 6 6 0 0 1 4.5-2q2.4 0 4 1.5 1.5 1.5 1.5 4 0 1.1-.4 2.2-.3 1-1.4 2.4t-2.6 3l-4.2 3.9zm0-2.7 6.4-6.4q.9-1 1.3-2l.3-1.7a3.4 3.4 0 0 0-3.5-3.5A4 4 0 0 0 12.9 7h-1.8q-.5-1-1.4-1.7-1-.6-2.2-.6A3.4 3.4 0 0 0 4 8.2l.3 1.7q.4 1 1.3 2 .9 1.2 2.5 2.7z" fill="currentcolor"/>
                      </svg>
                      お気に入り
                    </dads-button>
                  </li>
                </ul>
              </dads-card>
            </li>
          </ul>
        </section>

        <!-- カード作例4（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例4（DADS公式）</h3>
          <p class="card-section__note">
            ダッシュボード用途を想定したカード。JSONの値を受け取って表示します。
          </p>

          <style>
            .card-example-4 {
              width: min(calc(360 / 16 * 1rem), 100%);
              min-width: 0;
              --dads-card-border-width: 1px;
              --dads-card-border-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-border-radius: var(--border-radius-16, 1rem);
              --dads-card-background: var(--color-neutral-white, #ffffff);
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-5, 1.25rem);
              --dads-card-gap: var(--spacing-5, 1.25rem);
              --dads-card-color: var(--color-neutral-solid-gray-800, #333333);
            }

            .card-example-4__layout {
              display: grid;
              row-gap: var(--spacing-4, 1rem);
            }

            .card-example-4__title {
              margin: 0;
              font-size: var(--font-size-20, 1.25rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
            }

            .card-example-4__title-link {
              display: block;
              width: 100%;
              color: inherit;
              font-weight: inherit;
              text-decoration: underline;
              text-decoration-thickness: calc(1 / 16 * 1rem);
              text-underline-offset: calc(4 / 16 * 1rem);
            }

            @media (any-hover: hover) {
              .card-example-4__title-link:hover {
                text-decoration-thickness: calc(2 / 16 * 1rem);
              }
            }

            .card-example-4__title-link:focus-visible {
              text-decoration-thickness: calc(2 / 16 * 1rem);
            }

            .card-example-4__value {
              display: flex;
              align-items: baseline;
              gap: var(--spacing-2, 0.5rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              line-height: 1.4;
            }

            .card-example-4__value-number {
              font-size: calc(64 / 16 * 1rem);
              letter-spacing: 0.01em;
            }

            .card-example-4__value-unit {
              font-size: calc(28 / 16 * 1rem);
            }

            .card-example-4__metrics {
              display: grid;
            }

            .card-example-4__delta {
              display: flex;
              align-items: center;
              gap: var(--spacing-2, 0.5rem);
              color: var(--color-primitive-blue-900, #0017c1);
              font-weight: var(--font-weight-700, 700);
              font-size: var(--font-size-18, 1.125rem);
              line-height: 1.4;
            }

            .card-example-4__delta svg {
              width: calc(20 / 16 * 1rem);
              height: calc(20 / 16 * 1rem);
              flex-shrink: 0;
            }

            .card-example-4__delta-label {
              color: var(--color-neutral-solid-gray-700, #555555);
              font-weight: var(--font-weight-600, 600);
            }

            .card-example-4__progress-group {
              display: grid;
              row-gap: var(--spacing-1, 0.25rem);
            }

            .card-example-4__progress-label {
              font-size: var(--font-size-14, 0.875rem);
              font-weight: var(--font-weight-600, 600);
              color: var(--color-neutral-solid-gray-700, #555555);
            }

            .card-example-4__progress-row {
              display: grid;
              grid-template-columns: minmax(0, 1fr) auto;
              align-items: center;
              gap: var(--spacing-3, 0.75rem);
            }

            .card-example-4__progress {
              position: relative;
              height: calc(10 / 16 * 1rem);
              background: var(--color-primitive-blue-100, #d9e6ff);
              border-radius: 999px;
              overflow: hidden;
            }

            .card-example-4__progress-fill {
              position: absolute;
              inset: 0;
              width: 0;
              background: var(--color-primitive-blue-900, #0017c1);
              border-radius: inherit;
            }

            .card-example-4__count {
              font-size: var(--font-size-18, 1.125rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              white-space: nowrap;
            }

            .card-example-4__divider {
              border-top: 1px solid var(--color-neutral-solid-gray-420, #949494);
              margin-block: var(--spacing-2, 0.5rem);
            }

            .card-example-4__description {
              margin: 0;
              font-size: var(--font-size-18, 1.125rem);
              line-height: var(--line-height-160, 1.6);
              color: var(--color-neutral-solid-gray-800, #333333);
            }

            .card-example-4__footer {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: var(--spacing-4, 1rem);
              flex-wrap: wrap;
              margin-top: var(--spacing-2, 0.5rem);
            }

            .card-example-4__chips {
              display: flex;
              flex-wrap: wrap;
              gap: var(--spacing-2, 0.5rem);
            }

            .card-example-4__updated {
              display: inline-flex;
              align-items: center;
              gap: var(--spacing-2, 0.5rem);
              color: var(--color-neutral-solid-gray-700, #555555);
              font-size: var(--font-size-16, 1rem);
            }

            .card-example-4__updated svg {
              width: calc(20 / 16 * 1rem);
              height: calc(20 / 16 * 1rem);
            }
          </style>

          <script type="application/json" data-card-example-4-json>
            {
              "title": "導入企業の割合",
              "value": 68.5,
              "unit": "%",
              "delta": 12,
              "deltaLabel": "先月比",
              "progress": 0.685,
              "countLabel": "886/1294件",
              "description": "導入企業の割合を業種・地域ごとにグラフで確認いただけます",
              "chips": ["Android", "iOS"],
              "updatedLabel": "17日前"
            }
          </script>

          <dads-card class="card-example-4">
            <div class="card-example-4__layout">
              <h4 class="card-example-4__title">
                <a class="card-example-4__title-link" href="#" data-card-example-4-title></a>
              </h4>

              <div class="card-example-4__metrics">
                <div class="card-example-4__value">
                  <span class="card-example-4__value-number" data-card-example-4-value></span>
                  <span class="card-example-4__value-unit" data-card-example-4-unit></span>
                </div>

                <div class="card-example-4__delta">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 4 4 12l1.4 1.4L11 7.8V20h2V7.8l5.6 5.6L20 12Z" fill="currentColor"/>
                  </svg>
                  <span data-card-example-4-delta></span>
                  <span class="card-example-4__delta-label" data-card-example-4-delta-label></span>
                </div>
              </div>

              <div class="card-example-4__progress-group">
                <div class="card-example-4__progress-label">進捗</div>
                <div class="card-example-4__progress-row">
                  <div
                    class="card-example-4__progress"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    data-card-example-4-progress
                  >
                    <div class="card-example-4__progress-fill" data-card-example-4-progress-fill></div>
                  </div>
                  <div class="card-example-4__count" data-card-example-4-count></div>
                </div>
              </div>

              <div class="card-example-4__divider" aria-hidden="true"></div>

              <p class="card-example-4__description" data-card-example-4-description></p>

              <div class="card-example-4__footer">
                <div class="card-example-4__chips" data-card-example-4-chips></div>
                <div class="card-example-4__updated">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 4a8 8 0 1 1-8 8 8 8 0 0 1 8-8m0-2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm.5 5H11v6l5 3 .8-1.3-4.3-2.6Z" fill="currentColor"/>
                  </svg>
                  <span data-card-example-4-updated></span>
                </div>
              </div>
            </div>
          </dads-card>

          <script>
            (function() {
              var currentScript = document.currentScript;
              var root = currentScript?.parentElement;
              if (!root) return;

              var jsonScript = root.querySelector('[data-card-example-4-json]');
              if (!jsonScript) return;

              var data = {};
              try {
                data = JSON.parse(jsonScript.textContent || '{}');
              } catch (error) {
                return;
              }

              var setText = function(selector, value) {
                var target = root.querySelector(selector);
                if (!target || value === undefined || value === null) return;
                target.textContent = String(value);
              };

              var deltaText = data.delta;
              if (typeof data.delta === 'number' && Number.isFinite(data.delta)) {
                deltaText = data.delta + '%';
              } else if (typeof data.delta === 'string') {
                var trimmedDelta = data.delta.trim();
                if (trimmedDelta !== '' && Number.isFinite(Number(trimmedDelta))) {
                  deltaText = Number(trimmedDelta) + '%';
                }
              }
              [
                ['[data-card-example-4-title]', data.title],
                ['[data-card-example-4-value]', data.value],
                ['[data-card-example-4-unit]', data.unit],
                ['[data-card-example-4-delta]', deltaText],
                ['[data-card-example-4-delta-label]', data.deltaLabel],
                ['[data-card-example-4-count]', data.countLabel],
                ['[data-card-example-4-description]', data.description],
                ['[data-card-example-4-updated]', data.updatedLabel],
              ].forEach(function(entry) {
                setText(entry[0], entry[1]);
              });

              var progress = Number(data.progress);
              if (!Number.isNaN(progress)) {
                var clamped = Math.min(1, Math.max(0, progress));
                var fill = root.querySelector('[data-card-example-4-progress-fill]');
                var progressEl = root.querySelector('[data-card-example-4-progress]');
                if (fill) {
                  fill.style.width = Math.round(clamped * 1000) / 10 + '%';
                }
                if (progressEl) {
                  progressEl.setAttribute('aria-valuenow', String(Math.round(clamped * 100)));
                }
              }

              if (Array.isArray(data.chips)) {
                var chipsWrap = root.querySelector('[data-card-example-4-chips]');
                if (chipsWrap) {
                  chipsWrap.textContent = '';
                  data.chips.forEach(function(label) {
                    var chip = document.createElement('dads-chip-label');
                    chip.setAttribute('variant', 'filled-outline');
                    chip.setAttribute('color', 'cyan');
                    chip.textContent = String(label);
                    chipsWrap.appendChild(chip);
                  });
                }
              }
            })();
          <\/script>
        </section>

        <!-- カード作例5（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例5（DADS公式）</h3>
          <p class="card-section__note">
            DADS HTML Storybook の「作例5」を再現。スイッチで縦/横レイアウトを切り替えます。
          </p>

          <div class="card-example-5__toggle">
            <span class="card-example-5__toggle-label">レイアウト</span>
            <dads-switch data-card-example-5-toggle>
              <span slot="label-left">縦</span>
              <span slot="label-right">横</span>
            </dads-switch>
          </div>

          <style>
            .card-example-5__toggle {
              display: flex;
              align-items: center;
              gap: var(--spacing-4, 1rem);
              margin-bottom: var(--spacing-6, 1.5rem);
            }

            .card-example-5__toggle-label {
              font-size: var(--font-size-14, 0.875rem);
              font-weight: var(--font-weight-600, 600);
              color: var(--color-neutral-solid-gray-800, #333333);
            }

            .card-example-5-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: grid;
              gap: var(--spacing-6, 1.5rem);
              grid-template-columns: repeat(auto-fit, minmax(calc(300 / 16 * 1rem), 1fr));
            }

            .card-example-5-list[data-layout-horizontal] {
              grid-template-columns: minmax(0, 1fr);
              width: 100%;
              max-width: calc(940 / 16 * 1rem);
              margin-inline: auto;
            }

            .card-example-5-list > li {
              display: flex;
              min-width: 0;
            }

            dads-card.card-example-5 {
              width: 100%;
              min-width: 0;
              --card-example-5-actions-justify: flex-end;
              --card-example-5-actions-wrap: wrap;
              --dads-card-border-width: 1px;
              --dads-card-border-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-border-radius: var(--border-radius-16, 1rem);
              --dads-card-divider-width: 1px;
              --dads-card-divider-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-background: var(--color-neutral-white, #ffffff);
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-6, 1.5rem);
              --dads-card-gap: var(--spacing-3, 0.75rem);
              --dads-card-media-aspect-ratio: 16 / 9;
            }

            dads-card.card-example-5[layout="horizontal"] {
              --card-example-5-actions-wrap: nowrap;
              --card-example-5-actions-width: calc(320 / 16 * 1rem);
              --card-example-5-main-min: calc(360 / 16 * 1rem);
              --dads-card-media-width: calc(360 / 16 * 1rem);
              --dads-card-media-aspect-ratio: 3 / 2;
            }

            dads-card.card-example-5[layout="horizontal"]::part(base) {
              grid-template-columns:
                minmax(0, var(--dads-card-media-width))
                minmax(var(--card-example-5-main-min), 1fr)
                minmax(0, var(--card-example-5-actions-width));
              grid-template-areas: "media main sub";
              grid-template-rows: auto;
            }

            dads-card.card-example-5[layout="horizontal"]::part(sub) {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            dads-card.card-example-5::part(media) {
              position: relative;
            }

            .card-example-5__media {
              position: relative;
              width: 100%;
              height: 100%;
            }

            .card-example-5__media img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .card-example-5__date {
              position: absolute;
              top: var(--spacing-4, 1rem);
              left: var(--spacing-4, 1rem);
              background: var(--color-neutral-white, #ffffff);
              border-radius: var(--border-radius-8, 0.5rem);
              padding: var(--spacing-2, 0.5rem) var(--spacing-3, 0.75rem);
              text-align: center;
              line-height: 1;
            }

            .card-example-5__month {
              display: block;
              font-size: var(--font-size-14, 0.875rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-primitive-blue-900, #0017c1);
            }

            .card-example-5__day {
              display: block;
              margin-top: var(--spacing-1, 0.25rem);
              font-size: var(--font-size-24, 1.5rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
            }

            .card-example-5__meta {
              font-size: var(--font-size-14, 0.875rem);
              color: var(--color-neutral-solid-gray-700, #555555);
            }

            .card-example-5__title {
              margin: 0;
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              font-size: var(--font-size-20, 1.25rem);
              font-weight: var(--font-weight-700, 700);
              line-height: var(--line-height-150, 1.5);
              letter-spacing: 0.02em;
            }

            .card-example-5__title a:any-link {
              display: block;
              width: 100%;
              color: var(--color-primitive-blue-1000, #00118f);
              text-decoration: underline;
              text-decoration-thickness: calc(1 / 16 * 1rem);
              text-underline-offset: calc(3 / 16 * 1rem);
            }

            .card-example-5__title a:visited {
              color: var(--color-primitive-magenta-900, #8b008b);
            }

            @media (hover: hover) {
              .card-example-5__title a:hover {
                color: var(--color-primitive-blue-900, #0017c1);
                text-decoration-thickness: calc(3 / 16 * 1rem);
              }
            }

            .card-example-5__title a:active {
              color: var(--color-primitive-orange-800, #c74700);
              text-decoration-thickness: calc(1 / 16 * 1rem);
            }

            .card-example-5__description {
              margin: 0;
              color: var(--color-neutral-solid-gray-800, #333333);
              font-size: var(--font-size-16, 1rem);
              line-height: var(--line-height-170, 1.7);
              letter-spacing: 0.02em;
            }

            .card-example-5__actions {
              display: flex;
              width: 100%;
              justify-content: var(--card-example-5-actions-justify, flex-end);
              gap: var(--spacing-4, 1rem);
              flex-wrap: var(--card-example-5-actions-wrap, wrap);
              --card-example-5-cyan-50: var(--color-primitive-cyan-50, #e9f7f9);
              --card-example-5-cyan-100: var(--color-primitive-cyan-100, #c8f8ff);
              --card-example-5-cyan-900: var(--color-primitive-cyan-900, #006f83);
              --card-example-5-cyan-1000: var(--color-primitive-cyan-1000, #006173);
              --card-example-5-cyan-1100: var(--color-primitive-cyan-1100, #004c59);
              --card-example-5-cyan-1200: var(--color-primitive-cyan-1200, #003741);
              --card-example-5-white: var(--color-primitive-white, #ffffff);
            }

            .card-example-5__actions dads-button[variant="outlined"] {
              --dads-button-background: var(--card-example-5-white);
              --dads-button-background-hover: var(--card-example-5-cyan-50);
              --dads-button-background-active: var(--card-example-5-cyan-100);
              --dads-button-color: var(--card-example-5-cyan-900);
              --dads-button-color-hover: var(--card-example-5-cyan-1000);
              --dads-button-color-active: var(--card-example-5-cyan-1100);
              --dads-button-border-color: var(--card-example-5-cyan-900);
              --dads-button-border-color-hover: var(--card-example-5-cyan-1000);
              --dads-button-border-color-active: var(--card-example-5-cyan-1100);
            }

            .card-example-5__actions dads-button[variant="solid"] {
              --dads-button-background: var(--card-example-5-cyan-900);
              --dads-button-background-hover: var(--card-example-5-cyan-1000);
              --dads-button-background-active: var(--card-example-5-cyan-1200);
              --dads-button-color: var(--card-example-5-white);
              --dads-button-border-color: var(--card-example-5-cyan-900);
              --dads-button-border-color-hover: var(--card-example-5-cyan-1000);
              --dads-button-border-color-active: var(--card-example-5-cyan-1200);
            }

          </style>

          <ul class="card-example-5-list" data-card-example-5-list>
            <li>
              <dads-card class="card-example-5" data-card-example-5>
                <div slot="media" class="card-example-5__media">
                  <img
                    src="https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=960&h=640&fit=crop"
                    width="960" height="640"
                    alt="雪原と空が広がる冬の風景写真"
                  >
                  <div class="card-example-5__date" aria-hidden="true">
                    <span class="card-example-5__month">12月</span>
                    <span class="card-example-5__day">27</span>
                  </div>
                </div>
                <div class="card-example-5__meta">トラベル情報</div>
                <h2 class="card-example-5__title">
                  <a href="#" data-dads-card-primary>鳥の野鳥観察ツアー</a>
                </h2>
                <p class="card-example-5__description">
                  大自然の中で野鳥を観察できます。ガイド付きで安心してご参加いただけます。
                </p>
                <div slot="sub" class="card-example-5__actions">
                  <dads-button size="small" variant="outlined">共有する</dads-button>
                  <dads-button size="small" variant="solid">あとで読む</dads-button>
                </div>
              </dads-card>
            </li>

            <li>
              <dads-card class="card-example-5" data-card-example-5>
                <div slot="media" class="card-example-5__media">
                  <img
                    src="https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=960&h=640&fit=crop"
                    width="960" height="640"
                    alt="雪景色が広がる湖畔の風景写真"
                  >
                  <div class="card-example-5__date" aria-hidden="true">
                    <span class="card-example-5__month">1月</span>
                    <span class="card-example-5__day">15</span>
                  </div>
                </div>
                <div class="card-example-5__meta">宿泊情報</div>
                <h2 class="card-example-5__title">
                  <a href="#" data-dads-card-primary>温泉リゾート滞在プラン</a>
                </h2>
                <p class="card-example-5__description">
                  美しい山間の温泉で心身ともにリフレッシュ。地元の食材を使った料理もお楽しみいただけます。
                </p>
                <div slot="sub" class="card-example-5__actions">
                  <dads-button size="small" variant="outlined">共有する</dads-button>
                  <dads-button size="small" variant="solid">あとで読む</dads-button>
                </div>
              </dads-card>
            </li>

            <li>
              <dads-card class="card-example-5" data-card-example-5>
                <div slot="media" class="card-example-5__media">
                  <img
                    src="https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=960&h=640&fit=crop"
                    width="960" height="640"
                    alt="雪の平原を望む冬の風景写真"
                  >
                  <div class="card-example-5__date" aria-hidden="true">
                    <span class="card-example-5__month">2月</span>
                    <span class="card-example-5__day">3</span>
                  </div>
                </div>
                <div class="card-example-5__meta">文化体験</div>
                <h2 class="card-example-5__title">
                  <a href="#" data-dads-card-primary>古都散策ウォーキング</a>
                </h2>
                <p class="card-example-5__description">
                  歴史ある街並みをゆっくりと歩きながら、伝統文化と建築美を堪能できるコースです。
                </p>
                <div slot="sub" class="card-example-5__actions">
                  <dads-button size="small" variant="outlined">共有する</dads-button>
                  <dads-button size="small" variant="solid">あとで読む</dads-button>
                </div>
              </dads-card>
            </li>
          </ul>

          <script>
            (function() {
              var currentScript = document.currentScript;
              customElements.whenDefined('dads-switch').then(function() {
                var root = currentScript?.parentElement;
                if (!root || !root.isConnected) return;

                var toggle = root.querySelector('[data-card-example-5-toggle]');
                var list = root.querySelector('[data-card-example-5-list]');
                var cards = root.querySelectorAll('[data-card-example-5]');
                if (!toggle || !list || cards.length === 0) return;

                var applyLayout = function() {
                  var isHorizontal = toggle.hasAttribute('checked');
                  list.toggleAttribute('data-layout-horizontal', isHorizontal);
                  for (var i = 0; i < cards.length; i++) {
                    if (isHorizontal) {
                      cards[i].setAttribute('layout', 'horizontal');
                    } else {
                      cards[i].removeAttribute('layout');
                    }
                  }
                };

                toggle.addEventListener('dads-change', applyLayout);
                applyLayout();
              });
            })();
          <\/script>
        </section>
      </section>
    </div>
  `,

  chipLabel: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">チップラベル</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム（DADS）HTML版 chip-label.css と同一の見た目になるよう実装したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-chip-label">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-chip-label variant="filled-outline" color="purple">
              ${CHIP_LABEL_ICON_SVG}
              ラベル
            </dads-chip-label>
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
            'dads-chip-label',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-chip-label data-api-target variant="filled-outline" color="purple">
                  ${CHIP_LABEL_ICON_SVG}
                  ラベル
                </dads-chip-label>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-chip-label variant="filled-outline" color="purple">
                      ${CHIP_LABEL_ICON_SVG}
                      ラベル
                    </dads-chip-label>
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
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>filled-outline</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="variant" data-api-attr="variant" data-default="filled-outline">
                              <option value="text">text</option>
                              <option value="outline">outline</option>
                              <option value="filled-outline" selected>filled-outline</option>
                              <option value="fill">fill</option>
                            </select>
                          </div>
                        </td>
                        <td>見た目</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>color</code></th>
                        <td><code>attr</code></td>
                        <td><code>purple</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="color" data-api-attr="color" data-default="purple">
                              <option value="gray">gray</option>
                              <option value="blue">blue</option>
                              <option value="light-blue">light-blue</option>
                              <option value="cyan">cyan</option>
                              <option value="green">green</option>
                              <option value="lime">lime</option>
                              <option value="yellow">yellow</option>
                              <option value="orange">orange</option>
                              <option value="red">red</option>
                              <option value="magenta">magenta</option>
                              <option value="purple" selected>purple</option>
                            </select>
                          </div>
                        </td>
                        <td>カラーバリエーション</td>
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
                        <th scope="row"><code>--dads-chip-label-min-height</code></th>
                        <td><code>--spacing-8</code><br><small style="color:#666">(32px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-min-height" value="" data-api-css-var="--dads-chip-label-min-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-border-radius</code></th>
                        <td><code>--spacing-2</code><br><small style="color:#666">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-border-radius" value="" data-api-css-var="--dads-chip-label-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-padding-block</code></th>
                        <td><code>3px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-padding-block" value="" data-api-css-var="--dads-chip-label-padding-block" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>上下パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-padding-inline</code></th>
                        <td><code>7px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-padding-inline" value="" data-api-css-var="--dads-chip-label-padding-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-font-size</code></th>
                        <td><code>--font-size-16</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-font-size" value="" data-api-css-var="--dads-chip-label-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-font-weight</code></th>
                        <td><code>400</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-font-weight" value="" data-api-css-var="--dads-chip-label-font-weight" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>太さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-icon-gap</code></th>
                        <td><code>--spacing-1</code><br><small style="color:#666">(4px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-icon-gap" value="" data-api-css-var="--dads-chip-label-icon-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコンとテキストの間隔</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-chip-label>ラベル</dads-chip-label>
          <dads-chip-label>
            ${CHIP_LABEL_ICON_SVG}
            ラベル（アイコンあり）
          </dads-chip-label>
        </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">全チップラベル</h3>
        <div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 40px;">
          <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: center;">
            ${renderAllChipLabels()}
          </div>
        </div>
      </section>
    </div>

    <script type="module">
      // custom element定義前にプロパティへ触ると、upgrade後に「自前プロパティ」が残り挙動が壊れるため先に読み込む
      await Promise.all([import('dads-chip-label'), import('dads-switch'), import('a11y-annotate')]);
    </script>
  `,


  table: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">テーブル／データテーブル</h2>
      <p style="color: #666; margin-bottom: 40px;">
        ネイティブの&lt;table&gt;をそのまま使い、DADS準拠の見た目とページ利用時の利便性（水平スクロール、行選択、ソートUI）を提供します。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- 基本 -->
      <section class="table-annotate-basic" style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本</h3>

        <a11y-annotate target-selector="dads-table">
          <dads-table hover>
            <table>
              <caption>テーブルタイトル</caption>
              <thead>
                <tr>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ1</td>
                  <td>データ2</td>
                  <td>データ3</td>
                </tr>
                <tr>
                  <td>データ4</td>
                  <td>データ5</td>
                  <td>データ6</td>
                </tr>
              </tbody>
            </table>
          </dads-table>

          <style>
            .table-annotate-basic a11y-annotate {
              display: block;
              --a11y-annotate-preview-min-height: 360px;
            }
          </style>
        </a11y-annotate>
      </section>

      <!-- データテーブル（行選択 + ソート + ストライプ） -->
      <section class="table-annotate-section" style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">データテーブル（行選択・ソート）</h3>

        <a11y-annotate target-selector="dads-table">
          <dads-table selectable striped hover sort-behavior="dom">
            <table>
              <caption>利用者一覧</caption>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" data-select-all aria-label="すべて選択" />
                  </th>
                  <th scope="col" data-column="id">
                    <button type="button" data-sort>利用者ID</button>
                  </th>
                  <th scope="col" data-column="name">
                    <button type="button" data-sort>氏名</button>
                  </th>
                  <th scope="col">電話番号</th>
                  <th scope="col" data-column="createdAt" data-sort-type="date">
                    <button type="button" data-sort>登録日</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr data-row-id="A003">
                  <td><input type="checkbox" data-select-row aria-label="行を選択: A003" /></td>
                  <td>A003</td>
                  <td>鈴木 次郎</td>
                  <td>03-9999-0000</td>
                  <td>2026-01-03</td>
                </tr>
                <tr data-row-id="A001">
                  <td><input type="checkbox" data-select-row aria-label="行を選択: A001" /></td>
                  <td>A001</td>
                  <td>山田 太郎</td>
                  <td>03-1234-5678</td>
                  <td>2026-01-01</td>
                </tr>
                <tr data-row-id="A002">
                  <td><input type="checkbox" data-select-row aria-label="行を選択: A002" /></td>
                  <td>A002</td>
                  <td>佐藤 花子</td>
                  <td>03-2222-3333</td>
                  <td>2026-01-02</td>
                </tr>
              </tbody>
            </table>
          </dads-table>

          <style>
            .table-annotate-section a11y-annotate {
              display: block;
              /* プレビュー領域を広げる */
              --a11y-annotate-preview-min-height: 520px;
            }

            .table-annotate-section dads-table {
              max-width: 1100px;
            }
          </style>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; overflow-x: auto;">
                <dads-table data-api-target selectable striped hover sort-behavior="dom">
                  <table style="min-width: 520px;">
                    <caption>利用者一覧（サンプル）</caption>
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" data-select-all aria-label="すべて選択" />
                        </th>
                        <th scope="col" data-column="id">
                          <button type="button" data-sort>利用者ID</button>
                        </th>
                        <th scope="col" data-column="name">
                          <button type="button" data-sort>氏名</button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr data-row-id="A001">
                        <td><input type="checkbox" data-select-row aria-label="行を選択: A001" /></td>
                        <td>A001</td>
                        <td>山田 太郎</td>
                      </tr>
                      <tr data-row-id="A002">
                        <td><input type="checkbox" data-select-row aria-label="行を選択: A002" /></td>
                        <td>A002</td>
                        <td>佐藤 花子</td>
                      </tr>
                      <tr data-row-id="A003">
                        <td><input type="checkbox" data-select-row aria-label="行を選択: A003" /></td>
                        <td>A003</td>
                        <td>鈴木 次郎</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-table selectable striped hover sort-behavior="dom">
                      <table>
                        <caption>利用者一覧（サンプル）</caption>
                        <thead>
                          <tr>
                            <th>
                              <input type="checkbox" data-select-all aria-label="すべて選択" />
                            </th>
                            <th scope="col" data-column="id">
                              <button type="button" data-sort>利用者ID</button>
                            </th>
                            <th scope="col" data-column="name">
                              <button type="button" data-sort>氏名</button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr data-row-id="A001">
                            <td><input type="checkbox" data-select-row aria-label="行を選択: A001" /></td>
                            <td>A001</td>
                            <td>山田 太郎</td>
                          </tr>
                          <tr data-row-id="A002">
                            <td><input type="checkbox" data-select-row aria-label="行を選択: A002" /></td>
                            <td>A002</td>
                            <td>佐藤 花子</td>
                          </tr>
                          <tr data-row-id="A003">
                            <td><input type="checkbox" data-select-row aria-label="行を選択: A003" /></td>
                            <td>A003</td>
                            <td>鈴木 次郎</td>
                          </tr>
                        </tbody>
                      </table>
                    </dads-table>
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
                        <th scope="row"><code>hover</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="hover" data-api-attr="hover" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>行ホバー</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>striped</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="striped" data-api-attr="striped" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>交互行背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>selectable</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="selectable" data-api-attr="selectable" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>行選択</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>sort-behavior</code></th>
                        <td><code>attr</code></td>
                        <td><code>dom</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="sort-behavior" data-api-attr="sort-behavior" data-default="dom">
                              <option value="">（unset）</option>
                              <option value="dom" selected>dom</option>
                            </select>
                          </div>
                        </td>
                        <td>ソート挙動</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="">
                              <option value="" selected>default</option>
                              <option value="sm">sm</option>
                              <option value="dense">dense</option>
                            </select>
                          </div>
                        </td>
                        <td>密度（padding/line-height）</td>
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
                        <th scope="row"><code>--dads-table-header-background</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-header-background" value="" data-api-css-var="--dads-table-header-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ヘッダー背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-border-color" value="" data-api-css-var="--dads-table-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-row-background-hover</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-row-background-hover" value="" data-api-css-var="--dads-table-row-background-hover" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-cell-padding-x</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-cell-padding-x" value="" data-api-css-var="--dads-table-cell-padding-x" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-cell-padding-y</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-cell-padding-y" value="" data-api-css-var="--dads-table-cell-padding-y" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>上下パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-font-size</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-font-size" value="" data-api-css-var="--dads-table-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字サイズ</td>
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

      <!-- オーバーフロー（横スクロール） -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">オーバーフロー（横スクロール）</h3>
        <div style="max-width: 520px; border: 1px dashed #ccc; padding: 16px;">
          <dads-table hover>
            <table>
              <caption>横幅が足りない場合の例</caption>
              <thead>
                <tr>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
              </tbody>
            </table>
          </dads-table>
        </div>
      </section>

      <!-- DADS公式（HTML Storybook）作例 -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">DADS公式（HTML Storybook）作例</h3>
        <p style="color: #666; margin-bottom: 0;">
          公式のHTML作例（<code>.dads-table</code> / <code>data-*</code> 属性 / <code>data-js-*</code> セレクタ）を
          <code>&lt;dads-table&gt;</code> の中へ貼り付けて動作する形で網羅しています。
        </p>
      </section>

      <!-- Playground -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Playground</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table">
              <thead>
${dadsHeaderRow(4)}
              </thead>
              <tbody>
${dadsDataRows(4, 4)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Plain -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Plain</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table">
              <tbody>
${dadsDataRows(4, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- First Row As Header Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">First Row As Header Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody data-cell-border="bottom">
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- First Column As Header Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">First Column As Header Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-cell-border="right">
              <tbody>
${dadsRowHeaderRows(4, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- First Row And Column As Header Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">First Row And Column As Header Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
                <tr>
                  <td data-bg="solid-gray-100" data-border="right"></td>
${dadsColHeaderLines(5)}
                </tr>
              </thead>
              <tbody>
${dadsRowHeaderRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Condensed Table -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Condensed Table</h3>
        <dads-table>
          <div class="dads-table" data-size="dense">
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Border On Row And Column -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Border On Row And Column</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-border="hidden" data-cell-border>
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Table Header With Colspan -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Table Header With Colspan</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-border data-cell-border="bottom">
              <thead data-cell-border="right">
                <tr>
${repeatLines(dadsColHeaderLine("親ラベル", 'colspan="3"'), 2)}
                </tr>
                <tr>
${dadsColHeaderLines(6, "子ラベル")}
                </tr>
              </thead>
              <tbody>
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Table Header With Rowspan -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Table Header With Rowspan</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-border data-cell-border="bottom">
              <tbody>
                <tr>
                  <th class="dads-table__row-header" scope="row" rowspan="2" data-border="right">親ラベル</th>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
                <tr>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
                <tr>
                  <th class="dads-table__row-header" scope="row" rowspan="2" data-border="right">親ラベル</th>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
                <tr>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Indented Rows -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Indented Rows</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-cell-border="bottom">
              <col style="width: calc(32 / 16 * 1rem);">
              <thead>
                <tr>
                  <td class="dads-table__col-header"></td>
                  <td class="dads-table__col-header"></td>
                  <th class="dads-table__col-header" scope="col">代表者名</th>
                  <th class="dads-table__col-header" scope="col">電話番号</th>
                  <th class="dads-table__col-header" scope="col">住所</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" colspan="2">東京本社</th>
                  <td>山田太郎</td>
                  <td>03-1234-5678</td>
                  <td>東京都新宿区1-2-3</td>
                </tr>
                <tr>
                  <th scope="row"><span class="dads-u-visually-hidden">東京本社</span></th>
                  <th scope="row">営業部</th>
                  <td>佐藤花子</td>
                  <td>03-2345-6789</td>
                  <td>東京都渋谷区4-5-6</td>
                </tr>
                <tr>
                  <th scope="row"><span class="dads-u-visually-hidden">東京本社</span></th>
                  <th scope="row">開発部</th>
                  <td>鈴木一郎</td>
                  <td>03-3456-7890</td>
                  <td>東京都港区7-8-9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Stripe Table -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Stripe Table</h3>
        <dads-table>
          <div class="dads-table" data-row-stripe>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(6, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Highlight Hovered Row -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Highlight Hovered Row</h3>
        <dads-table>
          <div class="dads-table" data-row-stripe data-row-hover-highlight>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(6, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Selectable Table -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Selectable Table</h3>
        <dads-table>
          <div class="dads-table" data-size="dense" data-selectable data-js-indeterminate-example>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
                <tr>
                  <th class="dads-table__col-header" scope="col">
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" aria-label="行を選択" aria-description="すべての行を選択する" data-js-check-all>
                      </span>
                    </label>
                  </th>
                  <th class="dads-table__col-header" scope="col">タイトル</th>
                  <th class="dads-table__col-header" scope="col">状態</th>
                  <th class="dads-table__col-header" scope="col">コメント数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" aria-labelledby="selectable-table-title-1" data-js-check>
                      </span>
                    </label>
                  </td>
                  <td id="selectable-table-title-1">記事タイトル1</td>
                  <td>公開中</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" checked aria-labelledby="selectable-table-title-2" data-js-check>
                      </span>
                    </label>
                  </td>
                  <td id="selectable-table-title-2">記事タイトル2</td>
                  <td>下書き</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" aria-labelledby="selectable-table-title-3" data-js-check>
                      </span>
                    </label>
                  </td>
                  <td id="selectable-table-title-3">記事タイトル3</td>
                  <td>非公開</td>
                  <td>3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Sortable Header -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Sortable Header</h3>
        <dads-table sort-behavior="dom">
          <div class="dads-table" data-js-sortable-table>
            <table class="dads-table__table" data-border data-cell-border>
              <thead>
                <tr>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="number">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                      <button class="dads-table__action" type="button" aria-haspopup="true">
                        <svg class="dads-table__action-svg" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="img" aria-label="列メニュー">
                          <circle cx="12" cy="4.5" r="1.5"/>
                          <circle cx="12" cy="12" r="1.5"/>
                          <circle cx="12" cy="19.5" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="date">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>記事タイトルA</td>
                  <td>10</td>
                  <td>2026-01-03</td>
                  <td>公開中</td>
                  <td>担当C</td>
                </tr>
                <tr>
                  <td>記事タイトルB</td>
                  <td>2</td>
                  <td>2026-01-01</td>
                  <td>下書き</td>
                  <td>担当A</td>
                </tr>
                <tr>
                  <td>記事タイトルC</td>
                  <td>30</td>
                  <td>2026-01-02</td>
                  <td>非公開</td>
                  <td>担当B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Sortable Header Dense -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Sortable Header Dense</h3>
        <dads-table sort-behavior="dom">
          <div class="dads-table" data-size="dense" data-js-sortable-table>
            <table class="dads-table__table" data-border data-cell-border>
              <thead>
                <tr>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="number">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                      <button class="dads-table__action" type="button" aria-haspopup="true">
                        <svg class="dads-table__action-svg" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="img" aria-label="列メニュー">
                          <circle cx="12" cy="4.5" r="1.5"/>
                          <circle cx="12" cy="12" r="1.5"/>
                          <circle cx="12" cy="19.5" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="date">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>記事タイトルA</td>
                  <td>10</td>
                  <td>2026-01-03</td>
                  <td>公開中</td>
                  <td>担当C</td>
                </tr>
                <tr>
                  <td>記事タイトルB</td>
                  <td>2</td>
                  <td>2026-01-01</td>
                  <td>下書き</td>
                  <td>担当A</td>
                </tr>
                <tr>
                  <td>記事タイトルC</td>
                  <td>30</td>
                  <td>2026-01-02</td>
                  <td>非公開</td>
                  <td>担当B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Linked Text In Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Linked Text In Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-width="full" data-layout="fixed" data-cell-border="bottom">
              <thead>
                <tr>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a class="dads-link" href="#">デジタル庁</a></td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>
                    <ul class="dads-list">
                      <li class="dads-list__item"><a class="dads-link" href="#">デジタル庁</a></li>
                      <li class="dads-list__item"><a class="dads-link" href="#">デジタル庁デザインシステム</a></li>
                    </ul>
                  </td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- With Caption -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">With Caption</h3>
        <dads-table>
          <figure class="dads-table">
            <figcaption class="dads-table__caption">表1: テーブルキャプション</figcaption>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
                <tr>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
              </tbody>
            </table>
          </figure>
        </dads-table>
      </section>

      <!-- Overflow On Mobile -->
      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Overflow On Mobile</h3>
        <div style="max-width: 520px; border: 1px dashed #ccc; padding: 16px;">
          <dads-table>
            <div class="dads-table">
              <table class="dads-table__table" data-cell-border="bottom" style="min-width: calc(640 / 16 * 1rem);">
                <thead>
                  <tr>
                    <th class="dads-table__col-header" scope="col" style="width: 25%;">項目</th>
                    <th class="dads-table__col-header" scope="col">例</th>
                    <th class="dads-table__col-header" scope="col">説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>チャネルの種類</td>
                    <td>オンラインポータル、電話サポート、メール窓口、情報パンフ、動画案内、SNSアカウント、イベント告知、FAQページ</td>
                    <td>市民は自分に適した手段で情報取得やサービス利用が可能で、行政も効果的なコミュニケーションとサポートを提供できます</td>
                  </tr>
                  <tr>
                    <td>プロバイダー</td>
                    <td>光ファイバー、DSL、ケーブル、ワイヤレスなど</td>
                    <td>ユーザーは異なるプロバイダータイプから、自分のニーズに合った高速インターネット接続を選択できます</td>
                  </tr>
                  <tr>
                    <td>サービスを提供する地域</td>
                    <td>
                      <ol class="dads-list">
                        <li class="dads-list__item">りんご区</li>
                        <li class="dads-list__item">みかん区</li>
                        <li class="dads-list__item">ぶどう区</li>
                        <li class="dads-list__item">いちご区</li>
                        <li class="dads-list__item">なし区</li>
                      </ol>
                    </td>
                    <td>特有のニーズに応えながら、高品質かつ効率的なサポートを目指しています。地元のコミュニティと密接に連携し、信頼性とアクセシビリティを大切にしています。</td>
                  </tr>
                  <tr>
                    <td>チャネルアイコン</td>
                    <td>テレビ、ラジオ、スマートフォン、パソコン、ニュース、ゲーム、料理、アート、音楽、カメラ</td>
                    <td>これらのアイコンは利用者が興味を持ちそうなチャンネルを素早く特定し、アクセスしやすくするのに役立ちます。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </dads-table>
        </div>
      </section>
    </div>
  `,


  switch: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">スイッチコンポーネント</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム準拠のスイッチ（トグル）コンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- 基本（アクセシビリティ注釈付き） -->
      <section style="margin-bottom: 60px;">
        <h3 style="font-size: 20px; margin-bottom: 24px; color: #333;">基本（アクセシビリティ注釈付き）</h3>
        <style>
          /* 注釈プレビューを大きくする */
          .switch-annotate-section a11y-annotate {
            /* コールアウトの配置距離を広げる */
            --spacing-6: 64px;
          }
          .switch-annotate-section [part="preview"] {
            padding: 120px 160px;
            min-height: 320px;
            display: flex;
            align-items: center;
            justify-content: center;
            /* コールアウトがはみ出せる領域を広げる */
            --a11y-annotate-callout-gutter: 100px;
          }
          .switch-annotate-section [part="preview-inner"] {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .switch-annotate-section [part="layout"] {
            gap: 32px;
          }
        </style>
        <div class="switch-annotate-section">
          <a11y-annotate target-selector="dads-switch">
            <dads-switch checked>
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </a11y-annotate>
        </div>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-switch data-api-target checked size="md">
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-switch checked size="md">
                      <span slot="label-left">OFF</span>
                      <span slot="label-right">ON</span>
                    </dads-switch>
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
                        <th scope="row"><code>checked</code></th>
                        <td><code>prop</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="checked" data-api-prop="checked" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>ON/OFF</td>
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
                        <td>無効化</td>
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
                        <th scope="row"><code>name</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="name" value="" data-api-attr="name" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーム名</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="value" value="" data-api-attr="value" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーム値（チェック時）</td>
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
                        <th scope="row"><code>--dads-switch-track-bg</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-track-bg" value="" data-api-css-var="--dads-switch-track-bg" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-track-width</code></th>
                        <td><code>48px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-track-width" value="" data-api-css-var="--dads-switch-track-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-track-height</code></th>
                        <td><code>24px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-track-height" value="" data-api-css-var="--dads-switch-track-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-knob-size</code></th>
                        <td><code>20px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-knob-size" value="" data-api-css-var="--dads-switch-knob-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ノブサイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-knob-bg</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-knob-bg" value="" data-api-css-var="--dads-switch-knob-bg" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ノブ背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-label-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-label-color" value="" data-api-css-var="--dads-switch-label-color" data-default=""></dads-input-text>
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

      <!-- 基本（状態比較） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本（状態比較）</h3>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
          <dads-switch>
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
          <dads-switch checked>
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
        </div>
      </section>

      <!-- 日本語ラベル -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">日本語ラベル</h3>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
          <dads-switch>
            <span slot="label-left">オフ</span>
            <span slot="label-right">オン</span>
          </dads-switch>
          <dads-switch checked>
            <span slot="label-left">オフ</span>
            <span slot="label-right">オン</span>
          </dads-switch>
        </div>
      </section>

      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ</h3>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: monospace; color: #666;">sm:</span>
            <dads-switch size="sm">
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: monospace; color: #666;">md:</span>
            <dads-switch size="md">
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: monospace; color: #666;">lg:</span>
            <dads-switch size="lg">
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </div>
        </div>
      </section>

      <!-- 無効状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">無効状態</h3>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
          <dads-switch disabled>
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
          <dads-switch disabled checked>
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
        </div>
      </section>

      <!-- 実際の使用例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">実際の使用例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9; max-width: 500px;">
          <form id="switch-demo-form">
            <h4 style="font-size: 18px; margin-bottom: 20px; color: #333;">通知設定</h4>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <label for="email-notify">メール通知</label>
                <dads-switch id="email-notify" name="email-notify" value="enabled" checked>
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <label for="push-notify">プッシュ通知</label>
                <dads-switch id="push-notify" name="push-notify" value="enabled">
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <label for="weekly-report">週次レポート</label>
                <dads-switch id="weekly-report" name="weekly-report" value="enabled" checked>
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px;">
              <dads-button variant="text" type="reset">リセット</dads-button>
              <dads-button variant="solid" type="submit">保存</dads-button>
            </div>
          </form>
        </div>
      </section>

      <!-- イベントテスト -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">イベントテスト</h3>
        <div style="display: flex; gap: 16px; align-items: center;">
          <dads-switch id="event-test-switch">
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
          <span id="event-status" style="font-family: monospace; color: #666;">状態: false</span>
        </div>
        <script>
          // カスタム要素の定義を待ってからイベントリスナーを設定
          customElements.whenDefined('dads-switch').then(() => {
            const switchEl = document.getElementById('event-test-switch');
            const statusEl = document.getElementById('event-status');
            if (switchEl && statusEl) {
              switchEl.addEventListener('dads-change', (e) => {
                statusEl.textContent = '状態: ' + e.detail.checked;
              });
            }
          });
        </script>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>WCAG 2.2 AA準拠:</strong> role="switch"、aria-checked、フォーカス管理</li>
          <li><strong>キーボード操作:</strong> Enter/Space（トグル）、←（OFF）、→（ON）</li>
          <li><strong>サイズバリエーション:</strong> sm (40x20px) / md (48x24px) / lg (56x28px)</li>
          <li><strong>デザイントークン:</strong> セマンティック & ローカルトークンの2層構造</li>
          <li><strong>Form Associated:</strong> ネイティブフォームに参加</li>
          <li><strong>ラベルスロット:</strong> label-left / label-right（必須）</li>
          <li><strong>::part()スタイリング:</strong> wrapper, switch, track, knob, checkbox, label-left, label-right</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
          <li><strong>TDD開発:</strong> 32テストケースで品質担保</li>
        </ul>
      </div>
    </div>
  `,
} as const;
