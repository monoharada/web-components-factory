import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  API_TABLE_PROPS_WITH_TYPE_HEADER,
  CARD_APPLICATION_STEPS,
  CARD_APPLICATION_STEPS_EXTENDED,
  MENU_LIST_BOX_DUMMY_START_ICON_SVG,
  MENU_LIST_BOX_OPENER_ICON,
  annotationToggleScript,
  annotationToggleUI,
  menuListBoxNumberedItems,
  renderApiPanelWrapper,
  renderStepNavigationItems,
} from './shared.js';

export const demos = {

  accordion: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">アコーディオン</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム準拠のアコーディオンコンポーネント。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-accordion-details">
          <div style="padding: 60px 0;">
            <dads-accordion-details>
              <dads-accordion-item-details expanded>
                <span slot="header">デジタル庁について</span>
                <div slot="content">
                  デジタル庁は、2021年9月1日に設置された日本の行政機関です。
                  デジタル社会形成の司令塔として、国・地方行政のデジタル化を推進しています。
                </div>
              </dads-accordion-item-details>
            </dads-accordion-details>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-accordion-details',
            'dads-accordion-item-details',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-accordion-details data-api-target animation="none">
                  <dads-accordion-item-details expanded>
                    <span slot="header">デジタル庁について</span>
                    <div slot="content">
                      デジタル庁は、2021年9月1日に設置された日本の行政機関です。
                    </div>
                  </dads-accordion-item-details>
                  <dads-accordion-item-details>
                    <span slot="header">利用可能なサービス</span>
                    <div slot="content">
                      マイナポータル、e-Tax、各種オンライン申請など。
                    </div>
                  </dads-accordion-item-details>
                </dads-accordion-details>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-accordion-details animation="none">
                      <dads-accordion-item-details expanded>
                        <span slot="header">デジタル庁について</span>
                        <div slot="content">
                          デジタル庁は、2021年9月1日に設置された日本の行政機関です。
                        </div>
                      </dads-accordion-item-details>
                      <dads-accordion-item-details>
                        <span slot="header">利用可能なサービス</span>
                        <div slot="content">
                          マイナポータル、e-Tax、各種オンライン申請など。
                        </div>
                      </dads-accordion-item-details>
                    </dads-accordion-details>
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
                        <th scope="row"><code>allow-multiple</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="allow-multiple" data-api-attr="allow-multiple" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>複数アイテムの同時展開</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>animation</code></th>
                        <td><code>attr</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="animation" data-api-attr="animation" data-default="none">
                              <option value="none" selected>none</option>
                              <option value="smooth">smooth</option>
                            </select>
                          </div>
                        </td>
                        <td>アニメーション方針</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>respect-motion-preference</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="respect-motion-preference" data-api-attr="respect-motion-preference" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>prefers-reduced-motion に追従</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                  <code>--dads-accordion-*</code> が薄いため、暫定で既存の上書き可能な変数（グローバルトークン含む）を掲載します。
                </p>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--accordion-border-color</code></th>
                        <td><code>--color-neutral-solid-gray-420</code><br><small style="color:#666">(#949494)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--accordion-border-color" value="" data-api-css-var="--accordion-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--accordion-border-width</code></th>
                        <td><code>1px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--accordion-border-width" value="" data-api-css-var="--accordion-border-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り線幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--accordion-hover-bg</code></th>
                        <td><code>--color-neutral-solid-gray-50</code><br><small style="color:#666">(#f2f2f2)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--accordion-hover-bg" value="" data-api-css-var="--accordion-hover-bg" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--accordion-text-primary</code></th>
                        <td><code>--color-neutral-solid-gray-900</code><br><small style="color:#666">(#1a1a1a)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--accordion-text-primary" value="" data-api-css-var="--accordion-text-primary" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--accordion-font-size</code></th>
                        <td><code>--font-size-16</code><br><small style="color:#666">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--accordion-font-size" value="" data-api-css-var="--accordion-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--color-primitive-blue-1000</code></th>
                        <td><code>#00118f</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--color-primitive-blue-1000" value="" data-api-css-var="--color-primitive-blue-1000" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコン/リンク色</td>
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

      <div style="margin-top: 40px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <dads-accordion-details>
          <dads-accordion-item-details>
            <span slot="header">デジタル庁について</span>
            <div slot="content">
              デジタル庁は、2021年9月1日に設置された日本の行政機関です。
              デジタル社会形成の司令塔として、国・地方行政のデジタル化を推進しています。
            </div>
          </dads-accordion-item-details>
          <dads-accordion-item-details>
            <span slot="header">利用可能なサービス</span>
            <div slot="content">
              マイナポータル、e-Tax、各種オンライン申請など、
              様々な行政サービスをデジタルで利用できます。
            </div>
          </dads-accordion-item-details>
          <dads-accordion-item-details>
            <span slot="header">お問い合わせ</span>
            <div slot="content">
              ご不明な点がございましたら、公式ウェブサイトのお問い合わせフォームよりご連絡ください。
            </div>
          </dads-accordion-item-details>
        </dads-accordion-details>
      </div>
    </div>
  `,


  disclosure: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ディスクロージャー</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 disclosure.css と同一の見た目になるよう実装したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-disclosure">
          <div style="padding: 60px 0;">
            <dads-disclosure open>
              <span slot="summary">ダミーテキストとは何ですか？</span>
              <div slot="content">
                <div style="margin-bottom: 1lh;">これはダミーテキストです。</div>
                <div style="margin-bottom: 0;">
                  ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。
                  ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。
                  ダミーテキストは実際の文章ではないので、内容には意味がありません。
                </div>
              </div>
              <span slot="back-link">「ダミーテキストとは何ですか？」の先頭に戻る</span>
            </dads-disclosure>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          テーブル内の操作が Preview のターゲット要素へ即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-disclosure',
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-disclosure data-api-target open style="max-width: 720px;">
                  <span slot="summary" data-disclosure-summary>ダミーテキストとは何ですか？</span>
                  <div slot="content">
                    <div data-disclosure-content-lead style="margin-bottom: 1lh;">これはダミーテキストです。</div>
                    <div style="margin-bottom: 0;">
                      <span data-disclosure-content-body>ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。</span>
                    </div>
                  </div>
                  <span slot="back-link" data-disclosure-back-link>「ダミーテキストとは何ですか？」の先頭に戻る</span>
                </dads-disclosure>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-disclosure open>
                      <span slot="summary">ダミーテキストとは何ですか？</span>
                      <div slot="content">
                        <div style="margin-bottom: 1lh;">これはダミーテキストです。</div>
                        <div style="margin-bottom: 0;">
                          ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。
                        </div>
                      </div>
                      <span slot="back-link">「ダミーテキストとは何ですか？」の先頭に戻る</span>
                    </dads-disclosure>
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
                        <th scope="row"><code>open</code></th>
                        <td><code>attr</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="open" data-api-attr="open" data-default="false" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>開閉状態（trueでopen）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>summaryText</code></th>
                        <td><code>prop</code></td>
                        <td><code>string</code></td>
                        <td><code>"ダミーテキストとは何ですか？"</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="summaryText"
                              value="ダミーテキストとは何ですか？"
                              data-api-prop="textContent"
                              data-api-target-selector="[data-disclosure-summary]"
                              data-default="ダミーテキストとは何ですか？"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td><code>slot="summary"</code> のテキスト</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>contentLeadText</code></th>
                        <td><code>prop</code></td>
                        <td><code>string</code></td>
                        <td><code>"これはダミーテキストです。"</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="contentLeadText"
                              value="これはダミーテキストです。"
                              data-api-prop="textContent"
                              data-api-target-selector="[data-disclosure-content-lead]"
                              data-default="これはダミーテキストです。"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td><code>slot="content"</code> 冒頭のテキスト</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>contentBodyText</code></th>
                        <td><code>prop</code></td>
                        <td><code>string</code></td>
                        <td><code>"ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。"</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="contentBodyText"
                              value="ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。"
                              data-api-prop="textContent"
                              data-api-target-selector="[data-disclosure-content-body]"
                              data-default="ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td><code>slot="content"</code> 本文のテキスト</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>backLinkText</code></th>
                        <td><code>prop</code></td>
                        <td><code>string</code></td>
                        <td><code>"「ダミーテキストとは何ですか？」の先頭に戻る"</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="backLinkText"
                              value="「ダミーテキストとは何ですか？」の先頭に戻る"
                              data-api-prop="textContent"
                              data-api-target-selector="[data-disclosure-back-link]"
                              data-default="「ダミーテキストとは何ですか？」の先頭に戻る"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td><code>slot="back-link"</code>（空文字で非表示）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>backLinkSlot</code></th>
                        <td><code>attr</code></td>
                        <td><code>"back-link" | (unset)</code></td>
                        <td><code>back-link</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="backLinkSlot"
                              data-api-attr="slot"
                              data-api-target-selector="[data-disclosure-back-link]"
                              data-default="back-link"
                            >
                              <option value="back-link" selected>slot="back-link"</option>
                              <option value="">(unset)</option>
                            </select>
                          </div>
                        </td>
                        <td>戻るリンク用スロットの有無</td>
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
                        <th scope="row"><code>--dads-disclosure-gap</code></th>
                        <td><code>--spacing-2</code><br><small style="color:#666">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-disclosure-gap" value="" data-api-css-var="--dads-disclosure-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>summary内のgap</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-disclosure-icon-size</code></th>
                        <td><code>1.5rem</code><br><small style="color:#666">(24px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-disclosure-icon-size" value="" data-api-css-var="--dads-disclosure-icon-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコンサイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-disclosure-icon-color</code></th>
                        <td><code>--color-primitive-blue-1000</code><br><small style="color:#666">(#00118f)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-disclosure-icon-color" value="" data-api-css-var="--dads-disclosure-icon-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコン色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-disclosure-content-padding-inline-start</code></th>
                        <td><code>--spacing-8</code><br><small style="color:#666">(32px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-disclosure-content-padding-inline-start" value="" data-api-css-var="--dads-disclosure-content-padding-inline-start" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>本文のインライン開始padding</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-disclosure-back-link-color</code></th>
                        <td><code>--color-primitive-blue-1000</code><br><small style="color:#666">(#00118f)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-disclosure-back-link-color" value="" data-api-css-var="--dads-disclosure-back-link-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>戻るリンク色</td>
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
    </div>
  `,


  menuList: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">メニューリスト</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS準拠のメニューリスト（hover / focus / current / expanded / indentation）。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>

        <a11y-annotate target-selector="dads-menu-list-item[current]">
          <div style="max-width: 560px; margin: 0 auto; padding: 24px 0;">
            <dads-menu-list>
              <dads-menu-list-item current>メニュー項目（current）</dads-menu-list-item>
              <dads-menu-list-item>メニュー項目</dads-menu-list-item>
              <dads-menu-list-item expanded>
                メニュー項目（expanded）
                <dads-menu-list indentation="1">
                  <dads-menu-list-item>子メニュー1</dads-menu-list-item>
                  <dads-menu-list-item>子メニュー2</dads-menu-list-item>
                </dads-menu-list>
              </dads-menu-list-item>
            </dads-menu-list>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-menu-list',
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-menu-list data-api-target style="width: 560px;">
                  <dads-menu-list-item current>メニュー項目1</dads-menu-list-item>
                  <dads-menu-list-item expanded>
                    メニュー項目2（expanded）
                    <dads-menu-list indentation="1">
                      <dads-menu-list-item>メニュー項目2-1</dads-menu-list-item>
                      <dads-menu-list-item current>メニュー項目2-2（current）</dads-menu-list-item>
                      <dads-menu-list-item>メニュー項目2-3</dads-menu-list-item>
                    </dads-menu-list>
                  </dads-menu-list-item>
                  <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
                </dads-menu-list>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-menu-list>
                      <dads-menu-list-item current>メニュー項目1</dads-menu-list-item>
                      <dads-menu-list-item expanded>
                        メニュー項目2（expanded）
                        <dads-menu-list indentation="1">
                          <dads-menu-list-item>メニュー項目2-1</dads-menu-list-item>
                          <dads-menu-list-item current>メニュー項目2-2（current）</dads-menu-list-item>
                          <dads-menu-list-item>メニュー項目2-3</dads-menu-list-item>
                        </dads-menu-list>
                      </dads-menu-list-item>
                      <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
                    </dads-menu-list>
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
                        <th scope="row"><code>indentation</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="indentation" value="" data-api-attr="indentation" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>インデント（子メニューの字下げ）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>standard</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="variant"
                              data-api-attr="variant"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default="standard"
                            >
                              <option value="standard" selected>standard</option>
                              <option value="box">box</option>
                            </select>
                          </div>
                        </td>
                        <td>表示タイプ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>regular</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="size"
                              data-api-attr="size"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default="regular"
                            >
                              <option value="regular" selected>regular</option>
                              <option value="small">small</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>current</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch
                              aria-label="current"
                              data-api-attr="current"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default="true"
                              checked
                            >
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>現在地</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>tail-icon</code></th>
                        <td><code>attr</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="tail-icon"
                              data-api-attr="tail-icon"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default="none"
                            >
                              <option value="none" selected>none</option>
                              <option value="new-window">new-window</option>
                            </select>
                          </div>
                        </td>
                        <td>末尾アイコン</td>
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
                        <th scope="row"><code>--dads-menu-list-item-padding-x</code></th>
                        <td><code>--spacing-4</code><br><small style="color:#666">(1rem)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-menu-list-item-padding-x"
                              value=""
                              data-api-css-var="--dads-menu-list-item-padding-x"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>左右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-menu-list-item-padding-y</code></th>
                        <td><code>--spacing-2-5</code><br><small style="color:#666">(0.625rem)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-menu-list-item-padding-y"
                              value=""
                              data-api-css-var="--dads-menu-list-item-padding-y"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>上下パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-menu-list-item-hover-background</code></th>
                        <td><code>--color-neutral-solid-gray-50</code><br><small style="color:#666">(#f2f2f2)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-menu-list-item-hover-background"
                              value=""
                              data-api-css-var="--dads-menu-list-item-hover-background"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-menu-list-item-current-background</code></th>
                        <td><code>--color-primitive-blue-100</code><br><small style="color:#666">(#d9e6ff)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-menu-list-item-current-background"
                              value=""
                              data-api-css-var="--dads-menu-list-item-current-background"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>current背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-menu-list-item-current-color</code></th>
                        <td><code>--color-primitive-blue-1000</code><br><small style="color:#666">(#00118f)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-menu-list-item-current-color"
                              value=""
                              data-api-css-var="--dads-menu-list-item-current-color"
                              data-api-target-selector="dads-menu-list > dads-menu-list-item:first-of-type"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>current文字色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Standard</h3>
        <dads-menu-list>
          <dads-menu-list-item>メニュー項目1</dads-menu-list-item>
          <dads-menu-list-item expanded>
            メニュー項目2（expanded）
            <dads-menu-list indentation="1">
              <dads-menu-list-item>メニュー項目2-1</dads-menu-list-item>
              <dads-menu-list-item current>メニュー項目2-2（current）</dads-menu-list-item>
              <dads-menu-list-item>メニュー項目2-3</dads-menu-list-item>
            </dads-menu-list>
          </dads-menu-list-item>
          <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
          <dads-menu-list-item tail-icon="new-window">メニュー項目4（tail icon）</dads-menu-list-item>
          <dads-menu-list-item
            href="https://design.digital.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
            tail-icon="new-window"
          >
            リンク（別タブ）
          </dads-menu-list-item>
        </dads-menu-list>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Box + indentation</h3>
        <div style="border: 1px solid #eee; border-radius: 8px; padding: 16px 0; background: #fff;">
          <dads-menu-list>
            <dads-menu-list-item variant="box">メニュー項目1</dads-menu-list-item>
            <dads-menu-list-item variant="box" expanded>
              メニュー項目2（expanded）
              <dads-menu-list indentation="1">
                <dads-menu-list-item variant="box">メニュー項目2-1</dads-menu-list-item>
                <dads-menu-list-item variant="box" current>メニュー項目2-2（current）</dads-menu-list-item>
                <dads-menu-list-item variant="box">メニュー項目2-3</dads-menu-list-item>
              </dads-menu-list>
            </dads-menu-list-item>
            <dads-menu-list-item variant="box">メニュー項目3</dads-menu-list-item>
            <dads-menu-list-item variant="box" current>メニュー項目4（current）</dads-menu-list-item>
            <dads-menu-list-item variant="box">メニュー項目5</dads-menu-list-item>
            <dads-menu-list-item variant="box">メニュー項目6</dads-menu-list-item>
            <dads-menu-list-item variant="box">メニュー項目7</dads-menu-list-item>
          </dads-menu-list>
        </div>
      </section>
    </div>
  `,

  /**
   * Menu List Box - 人間向けショーケース
   * API / Controls + 実務的な作例（2〜3件）
   * E2E/Figma検証用デモは menuListBoxFidelity に分離
   */

  menuListBox: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">メニューリストボックス</h2>
      <p style="color: #666; margin-bottom: 24px;">
        opener + popup のメニュー（矢印キー / Home / End / Escape / 外側クリックで close）。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- 1. Overview -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Overview</h3>
        <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
          <li><strong>用途</strong>: ドロップダウンメニュー、セレクトボックスの代替、アクションリスト</li>
          <li><strong>操作</strong>: クリックで開閉、矢印キーで移動、Enter/Spaceで選択、Escapeで閉じる</li>
          <li><strong>注意</strong>: 選択状態は <code>current</code> 属性で表現、値の取得は <code>menuitemselect</code> イベント</li>
        </ul>
      </section>

      <!-- 2. A11y -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-menu-list-box">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-menu-list-box variant="outlined" size="sm" label="メニュー">
              ${MENU_LIST_BOX_OPENER_ICON}
              <dads-menu-list-item>メニュー項目1</dads-menu-list-item>
              <dads-menu-list-item>メニュー項目2</dads-menu-list-item>
              <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
            </dads-menu-list-box>
          </div>
        </a11y-annotate>
      </section>

      <!-- 3. API / Controls -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          Storybook風のインタラクティブAPIパネルです。各プロパティを変更するとプレビューに即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-menu-list-box',
          ],
          body: `
            <!-- 3.1 Preview -->
            <div class="wc-api-panel__section">
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-menu-list-box
                  data-api-target
                  variant="outlined"
                  size="sm"
                  label="メニュー"
                >
                  ${MENU_LIST_BOX_OPENER_ICON}
                  <dads-menu-list-item>メニュー項目1</dads-menu-list-item>
                  <dads-menu-list-item>メニュー項目2</dads-menu-list-item>
                  <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
                </dads-menu-list-box>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-menu-list-box variant="outlined" size="sm" label="メニュー">
                      ${MENU_LIST_BOX_OPENER_ICON}
                      <dads-menu-list-item>メニュー項目1</dads-menu-list-item>
                      <dads-menu-list-item>メニュー項目2</dads-menu-list-item>
                      <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
                    </dads-menu-list-box>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <!-- 3.2 Props / Attrs -->
            <div class="wc-api-panel__section">
              <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
              <dads-table>
                <table class="wc-api-table" data-cell-border="bottom">
                  ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                  <tbody>
                    <tr>
                      <th scope="row"><code>size</code></th>
                      <td><code>attr</code></td>
                      <td><code>'sm' | 'md'</code></td>
                      <td><code>sm</code></td>
                      <td>
                        <div class="wc-api-control">
                          <select aria-label="size" data-api-attr="size" data-default="sm">
                            <option value="sm" selected>sm</option>
                            <option value="md">md</option>
                          </select>
                        </div>
                      </td>
                      <td>サイズ</td>
                    </tr>

                    <tr>
                      <th scope="row"><code>variant</code></th>
                      <td><code>attr</code></td>
                      <td><code>'text' | 'outlined' | 'filled'</code></td>
                      <td><code>outlined</code></td>
                      <td>
                        <div class="wc-api-control">
                          <select aria-label="variant" data-api-attr="variant" data-default="outlined">
                            <option value="text">text</option>
                            <option value="outlined" selected>outlined</option>
                            <option value="filled">filled</option>
                          </select>
                        </div>
                      </td>
                      <td>見た目</td>
                    </tr>

                    <tr>
                      <th scope="row"><code>bold</code></th>
                      <td><code>attr</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>
                        <div class="wc-api-control">
                          <dads-switch aria-label="bold" data-api-attr="bold" data-default="false">
                            <span slot="label-left">Off</span>
                            <span slot="label-right">On</span>
                          </dads-switch>
                        </div>
                      </td>
                      <td>ラベル太字</td>
                    </tr>

                    <tr>
                      <th scope="row"><code>label</code></th>
                      <td><code>attr</code></td>
                      <td><code>string</code></td>
                      <td><code>メニュー</code></td>
                      <td>
                        <div class="wc-api-control">
                          <dads-input-text
                            label="label"
                            value="メニュー"
                            data-api-attr="label"
                            data-default="メニュー"
                          ></dads-input-text>
                        </div>
                      </td>
                      <td>ラベル</td>
                    </tr>

                    <tr>
                      <th scope="row"><code>open</code></th>
                      <td><code>attr</code></td>
                      <td><code>boolean</code></td>
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
                  </tbody>
                </table>
              </dads-table>
            </div>

            <!-- 3.3 CSS Variables -->
            <div class="wc-api-panel__section">
              <h4 class="wc-api-panel__section-title">CSS vars</h4>
              <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                <code>--dads-menu-list-box-*</code> で外部からスタイルをカスタマイズできます。空にするとトークン初期値に戻ります。
              </p>

              <!-- Opener 関連 -->
              <details style="margin-bottom: 16px;" open>
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px; color: #555;">Opener（トリガーボタン）</summary>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-min-width</code></th>
                        <td><code>auto</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-min-width" value="" data-api-css-var="--dads-menu-list-box-min-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>全体最小幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-min-height</code></th>
                        <td><code>36px/44px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-min-height" value="" data-api-css-var="--dads-menu-list-box-opener-min-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小高さ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-padding-x</code></th>
                        <td><code>4px/16px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-padding-x" value="" data-api-css-var="--dads-menu-list-box-opener-padding-x" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>水平パディング</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-padding-y</code></th>
                        <td><code>4px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-padding-y" value="" data-api-css-var="--dads-menu-list-box-opener-padding-y" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>垂直パディング</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-gap</code></th>
                        <td><code>4px/8px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-gap" value="" data-api-css-var="--dads-menu-list-box-opener-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>要素間ギャップ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-border-radius</code></th>
                        <td><code>8px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-border-radius" value="" data-api-css-var="--dads-menu-list-box-opener-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-background</code></th>
                        <td><code>transparent</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-background" value="" data-api-css-var="--dads-menu-list-box-opener-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-border-width</code></th>
                        <td><code>0/1px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-border-width" value="" data-api-css-var="--dads-menu-list-box-opener-border-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー幅</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-border-color</code></th>
                        <td><code>transparent</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-border-color" value="" data-api-css-var="--dads-menu-list-box-opener-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-font-weight</code></th>
                        <td><code>400/700</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-font-weight" value="" data-api-css-var="--dads-menu-list-box-opener-font-weight" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォントウェイト</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-hover-background</code></th>
                        <td><code>gray-50</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-hover-background" value="" data-api-css-var="--dads-menu-list-box-opener-hover-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー時背景</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-hover-border-color</code></th>
                        <td><code>black</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-hover-border-color" value="" data-api-css-var="--dads-menu-list-box-opener-hover-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー時ボーダー</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-icon-size</code></th>
                        <td><code>20px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-icon-size" value="" data-api-css-var="--dads-menu-list-box-opener-icon-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコンサイズ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-arrow-size</code></th>
                        <td><code>16px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-arrow-size" value="" data-api-css-var="--dads-menu-list-box-opener-arrow-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印サイズ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-arrow-margin-top</code></th>
                        <td><code>4px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-arrow-margin-top" value="" data-api-css-var="--dads-menu-list-box-opener-arrow-margin-top" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印上マージン</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-arrow-margin-left</code></th>
                        <td><code>0</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-arrow-margin-left" value="" data-api-css-var="--dads-menu-list-box-opener-arrow-margin-left" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印左マージン</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-underline-offset</code></th>
                        <td><code>3px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-underline-offset" value="" data-api-css-var="--dads-menu-list-box-opener-underline-offset" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>下線オフセット</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </details>

              <!-- Popup 関連 -->
              <details style="margin-bottom: 16px;">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px; color: #555;">Popup（ドロップダウン）</summary>
                <dads-table>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">変数名</th>
                        <th scope="col">値</th>
                        <th scope="col">説明</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-min-width</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="min-width" value="" data-api-css-var="--dads-menu-list-box-popup-min-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小幅（auto）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-min-width-scroll</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="min-width-scroll" value="" data-api-css-var="--dads-menu-list-box-popup-min-width-scroll" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>スクロール時最小幅（auto）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-max-height</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="max-height" value="" data-api-css-var="--dads-menu-list-box-popup-max-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最大高さ（約302px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-padding-y</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="padding-y" value="" data-api-css-var="--dads-menu-list-box-popup-padding-y" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>垂直パディング（16px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-padding-x</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="padding-x" value="" data-api-css-var="--dads-menu-list-box-popup-padding-x" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>水平パディング（0）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-border-radius</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="border-radius" value="" data-api-css-var="--dads-menu-list-box-popup-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸（8px 0 0 8px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-border-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="border-color" value="" data-api-css-var="--dads-menu-list-box-popup-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色（gray-420）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-border-color-scroll</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="border-color-scroll" value="" data-api-css-var="--dads-menu-list-box-popup-border-color-scroll" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>スクロール時ボーダー色</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-background</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="background" value="" data-api-css-var="--dads-menu-list-box-popup-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色（white）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-shadow</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="shadow" value="" data-api-css-var="--dads-menu-list-box-popup-shadow" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>シャドウ（elevation-1）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-z-index</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="z-index" value="" data-api-css-var="--dads-menu-list-box-popup-z-index" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>z-index（1000）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-scrollbar-padding-right</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="scrollbar-padding-right" value="" data-api-css-var="--dads-menu-list-box-popup-scrollbar-padding-right" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>スクロールバー余白（17px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-item-divider</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="item-divider" value="" data-api-css-var="--dads-menu-list-box-popup-item-divider" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>項目区切り線（none）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-popup-item-divider-scroll</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="item-divider-scroll" value="" data-api-css-var="--dads-menu-list-box-popup-item-divider-scroll" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>スクロール時区切り線（none）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </details>

              <!-- Divider 関連 -->
              <details style="margin-bottom: 16px;">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px; color: #555;">Divider（区切り線）</summary>
                <dads-table>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">変数名</th>
                        <th scope="col">値</th>
                        <th scope="col">説明</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>--dads-divider-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="divider-color" value="" data-api-css-var="--dads-divider-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り線色（gray-420 42%）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-divider-margin-block</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="divider-margin-block" value="" data-api-css-var="--dads-divider-margin-block" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り線上下余白（既定 8px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-divider-margin-inline</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="divider-margin-inline" value="" data-api-css-var="--dads-divider-margin-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り線左右余白（16px）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </details>

              <!-- Typography 関連 -->
              <details style="margin-bottom: 16px;">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px; color: #555;">Typography（文字）</summary>
                <dads-table>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">変数名</th>
                        <th scope="col">値</th>
                        <th scope="col">説明</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>--dads-menu-list-box-font-family</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="font-family" value="" data-api-css-var="--dads-menu-list-box-font-family" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォントファミリー（sans）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-font-size</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="font-size" value="" data-api-css-var="--dads-menu-list-box-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォントサイズ（16px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-line-height</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="line-height" value="" data-api-css-var="--dads-menu-list-box-line-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>行高（1.2）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-letter-spacing</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="letter-spacing" value="" data-api-css-var="--dads-menu-list-box-letter-spacing" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>字間（0.02em）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="color" value="" data-api-css-var="--dads-menu-list-box-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>テキスト色（gray-900）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </details>

              <!-- Focus 関連 -->
              <details>
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px; color: #555;">Focus（フォーカス）</summary>
                <dads-table>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">変数名</th>
                        <th scope="col">値</th>
                        <th scope="col">説明</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-focus-outline-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="outline-color" value="" data-api-css-var="--dads-menu-list-box-opener-focus-outline-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アウトライン色</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-focus-outline-width</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="outline-width" value="" data-api-css-var="--dads-menu-list-box-opener-focus-outline-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アウトライン幅</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-focus-outline-offset</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="outline-offset" value="" data-api-css-var="--dads-menu-list-box-opener-focus-outline-offset" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アウトラインオフセット</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-focus-ring-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="ring-color" value="" data-api-css-var="--dads-menu-list-box-opener-focus-ring-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカスリング色</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-focus-ring-width</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="ring-width" value="" data-api-css-var="--dads-menu-list-box-opener-focus-ring-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカスリング幅</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-focus-background</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="focus-background" value="" data-api-css-var="--dads-menu-list-box-opener-focus-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカス時背景</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </details>
            </div>
          `,
        })}
      </section>

      <!-- 4. Examples（実務的な作例 2〜3件） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Examples</h3>

        <!-- Example 1: プロジェクト切替 -->
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">例1: プロジェクト切替（カテゴリ + divider + current）</h4>
          <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
            カテゴリ見出し・区切り線・選択状態を組み合わせた実務的なパターンです。
          </p>
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <dads-menu-list-box
              data-sync-current
              variant="outlined"
              size="sm"
              label="プロジェクト"
            >
              ${MENU_LIST_BOX_OPENER_ICON}
              <dads-menu-list-item style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);">
                ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
                最近のプロジェクト
              </dads-menu-list-item>
              <dads-menu-list-item current data-value="proj-a">プロジェクトA</dads-menu-list-item>
              <dads-menu-list-item data-value="proj-b">プロジェクトB</dads-menu-list-item>
              <dads-divider></dads-divider>
              <dads-menu-list-item style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);">
                ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
                アーカイブ
              </dads-menu-list-item>
              <dads-menu-list-item data-value="proj-old">旧プロジェクト</dads-menu-list-item>
            </dads-menu-list-box>
          </div>
        </div>

        <!-- Example 2: 環境選択 -->
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">例2: 環境選択（2行説明付き）</h4>
          <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
            各項目に説明文を付与するパターンです。flexbox + column でラベル・説明を縦に並べます。
          </p>
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <dads-menu-list-box
              data-sync-current
              variant="outlined"
              size="sm"
              label="環境"
            >
              ${MENU_LIST_BOX_OPENER_ICON}
              <dads-menu-list-item current data-value="production">
                ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
                <span style="display: flex; flex-direction: column; gap: var(--spacing-0-5, 2px);">
                  <span style="font-weight: var(--font-weight-600, 600);">Production</span>
                  <span style="font-weight: var(--font-weight-400, 400); font-size: var(--font-size-14, 0.875rem); color: var(--color-neutral-solid-gray-536, #666);">本番環境（api.example.com）</span>
                </span>
              </dads-menu-list-item>
              <dads-menu-list-item data-value="staging">
                ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
                <span style="display: flex; flex-direction: column; gap: var(--spacing-0-5, 2px);">
                  <span style="font-weight: var(--font-weight-600, 600);">Staging</span>
                  <span style="font-weight: var(--font-weight-400, 400); font-size: var(--font-size-14, 0.875rem); color: var(--color-neutral-solid-gray-536, #666);">ステージング環境</span>
                </span>
              </dads-menu-list-item>
              <dads-menu-list-item data-value="development">
                ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
                <span style="display: flex; flex-direction: column; gap: var(--spacing-0-5, 2px);">
                  <span style="font-weight: var(--font-weight-600, 600);">Development</span>
                  <span style="font-weight: var(--font-weight-400, 400); font-size: var(--font-size-14, 0.875rem); color: var(--color-neutral-solid-gray-536, #666);">開発環境（localhost）</span>
                </span>
              </dads-menu-list-item>
            </dads-menu-list-box>
          </div>
        </div>

        <!-- Example 3: 選択肢が多い場合 -->
        <div style="margin-bottom: 0;">
          <h4 style="font-size: 16px; margin-bottom: 8px; color: #555;">例3: 選択肢が多い場合（スクロール）</h4>
          <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
            項目数が多い場合は max-height + overflow-y でスクロールが発生します。
          </p>
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <dads-menu-list-box variant="outlined" size="sm" label="都道府県">
              ${MENU_LIST_BOX_OPENER_ICON}
              ${menuListBoxNumberedItems(20)}
            </dads-menu-list-box>
            <span style="color: #666; font-size: 13px;">※ポップアップは max-height 超過でスクロール</span>
          </div>
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
              if (box.hasAttribute('data-sync-current')) {
                const items = Array.from(box.querySelectorAll('dads-menu-list-item'));
                for (const item of items) item.removeAttribute('current');
                if (e.detail.selectedItem) e.detail.selectedItem.setAttribute('current', '');
              }
            });
          }
        });
      </script>

      <script type="module">
        // a11y-annotate が target の a11yAnnotations を読めるよう、
        // dads-menu-list-box を先に import してから a11y-annotate を import する。
        await import('dads-menu-list-box');
        await Promise.all([
          import('dads-divider'),
          import('dads-switch'),
          import('dads-button'),
          import('dads-input-text'),
          import('dads-table'),
          import('a11y-annotate')
        ]);
      </script>
    </div>
  `,

  globalMenu: () => `
    <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">グローバルメニュー</h2>
      <p style="color: #666; margin-bottom: 24px;">
        DADS準拠のグローバルメニュー。<code>dads-menu-list-box</code> と連携してサブメニューを表示します。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、プレビュー上にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate
          target-selector="dads-global-menu"
        >
          <div style="padding: 60px 0; border: 1px dashed #e5e7eb; border-radius: 12px; background: #fff;">
            <dads-global-menu aria-label="主要メニュー">
              <dads-global-menu-item href="#" current>ホーム</dads-global-menu-item>
              <dads-global-menu-item>
                申請手続き
                <dads-menu-list-box label="申請手続き サブメニュー">
                  <dads-menu-list-item>オンライン申請を開始する</dads-menu-list-item>
                  <dads-menu-list-item>申請状況を確認する</dads-menu-list-item>
                  <dads-menu-list-item>必要書類・記入例</dads-menu-list-item>
                </dads-menu-list-box>
              </dads-global-menu-item>
              <dads-global-menu-item href="#">よくある質問</dads-global-menu-item>
              <dads-global-menu-item href="#">お問い合わせ</dads-global-menu-item>
            </dads-global-menu>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ナビゲーション名（<code>aria-label</code>）とトップレベル項目/サブメニュー項目の属性を変更できます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-global-menu',
            'dads-menu-list-box',
          ],
          body: `
            <div class="wc-api-panel__section">
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; background: #fff;">
                <dads-global-menu data-api-target aria-label="グローバルナビゲーション">
                  <dads-global-menu-item href="#" current>メニュー1</dads-global-menu-item>
                  <dads-global-menu-item>
                    メニュー2
                    <dads-menu-list-box label="メニュー2 サブメニュー">
                      <dads-menu-list-item>サブメニュー1</dads-menu-list-item>
                      <dads-menu-list-item>サブメニュー2</dads-menu-list-item>
                      <dads-menu-list-item>サブメニュー3</dads-menu-list-item>
                    </dads-menu-list-box>
                  </dads-global-menu-item>
                  <dads-global-menu-item href="#">メニュー3</dads-global-menu-item>
                </dads-global-menu>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-global-menu aria-label="グローバルナビゲーション">
                      <dads-global-menu-item href="#" current>メニュー1</dads-global-menu-item>
                      <dads-global-menu-item>
                        メニュー2
                        <dads-menu-list-box label="メニュー2 サブメニュー">
                          <dads-menu-list-item>サブメニュー1</dads-menu-list-item>
                          <dads-menu-list-item>サブメニュー2</dads-menu-list-item>
                          <dads-menu-list-item>サブメニュー3</dads-menu-list-item>
                        </dads-menu-list-box>
                      </dads-global-menu-item>
                      <dads-global-menu-item href="#">メニュー3</dads-global-menu-item>
                    </dads-global-menu>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__section">
              <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
              <dads-table>
                <table class="wc-api-table" data-cell-border="bottom">
                  ${API_TABLE_PROPS_HEADER}
                  <tbody>
                    <tr>
                      <th scope="row"><code>aria-label</code></th>
                      <td><code>attr</code></td>
                      <td><code>グローバルナビゲーション</code></td>
                      <td>
                        <div class="wc-api-control">
                          <dads-input-text
                            label="aria-label"
                            value="グローバルナビゲーション"
                            data-api-attr="aria-label"
                            data-default="グローバルナビゲーション"
                          ></dads-input-text>
                        </div>
                      </td>
                      <td>nav ランドマーク名（<code>aria-labelledby</code> の代替）</td>
                    </tr>

                    <tr>
                      <th scope="row"><code>current</code></th>
                      <td><code>attr</code></td>
                      <td><code>true</code></td>
                      <td>
                        <div class="wc-api-control">
                          <dads-switch
                            aria-label="current"
                            data-api-attr="current"
                            data-api-target-selector="dads-global-menu-item:first-of-type"
                            data-default="true"
                            checked
                          >
                            <span slot="label-left">Off</span>
                            <span slot="label-right">On</span>
                          </dads-switch>
                        </div>
                      </td>
                      <td>現在地表示</td>
                    </tr>

                    <tr>
                      <th scope="row"><code>href</code></th>
                      <td><code>attr</code></td>
                      <td><code>#</code></td>
                      <td>
                        <div class="wc-api-control">
                          <dads-input-text
                            label="href"
                            value="#"
                            data-api-attr="href"
                            data-api-target-selector="dads-global-menu-item:first-of-type"
                            data-default="#"
                          ></dads-input-text>
                        </div>
                      </td>
                      <td>リンク先（submenu未指定時）</td>
                    </tr>

                    <tr>
                      <th scope="row"><code>expanded</code></th>
                      <td><code>attr</code></td>
                      <td><code>false</code></td>
                      <td>
                        <div class="wc-api-control">
                          <dads-switch
                            aria-label="expanded"
                            data-api-attr="expanded"
                            data-api-target-selector="dads-global-menu-item:nth-of-type(2)"
                            data-default="false"
                          >
                            <span slot="label-left">Off</span>
                            <span slot="label-right">On</span>
                          </dads-switch>
                        </div>
                      </td>
                      <td>サブメニュー展開</td>
                    </tr>
                  </tbody>
                </table>
              </dads-table>
            </div>
          `,
        })}
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Examples</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 12px;">
          実運用を想定した文言の作例です。<strong>申請手続き</strong>・<strong>事業者向け</strong>・<strong>自治体向け</strong>でサブメニュー表示を確認できます。
        </p>
        <div style="display: grid; gap: 24px;">
          <div style="position: relative; z-index: 2; border: 1px solid #d9dee5; border-radius: 16px; overflow: visible; background: #fff; box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);">
            <dads-global-menu aria-label="主要メニュー">
              <dads-global-menu-item href="#" current>ホーム</dads-global-menu-item>
              <dads-global-menu-item>
                申請手続き
                <dads-menu-list-box label="申請手続き サブメニュー">
                  <dads-menu-list-item>オンライン申請を開始する</dads-menu-list-item>
                  <dads-menu-list-item>申請状況を確認する</dads-menu-list-item>
                  <dads-divider></dads-divider>
                  <dads-menu-list-item>必要書類・記入例</dads-menu-list-item>
                  <dads-menu-list-item>審査期間と手数料</dads-menu-list-item>
                </dads-menu-list-box>
              </dads-global-menu-item>
              <dads-global-menu-item href="#">よくある質問</dads-global-menu-item>
              <dads-global-menu-item href="#">お問い合わせ</dads-global-menu-item>
            </dads-global-menu>
          </div>

          <div style="position: relative; z-index: 1; border: 1px solid #d9dee5; border-radius: 16px; overflow: visible; background: #fff; box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);">
            <dads-global-menu aria-label="制度情報メニュー">
              <dads-global-menu-item href="#">制度概要</dads-global-menu-item>
              <dads-global-menu-item>
                事業者向け
                <dads-menu-list-box label="事業者向け サブメニュー">
                  <dads-menu-list-item>公募情報・採択結果</dads-menu-list-item>
                  <dads-menu-list-item>申請ガイドライン</dads-menu-list-item>
                  <dads-menu-list-item>実施要領と提出様式</dads-menu-list-item>
                </dads-menu-list-box>
              </dads-global-menu-item>
              <dads-global-menu-item>
                自治体向け
                <dads-menu-list-box label="自治体向け サブメニュー">
                  <dads-menu-list-item>導入スケジュール</dads-menu-list-item>
                  <dads-menu-list-item>担当者向け研修資料</dads-menu-list-item>
                  <dads-menu-list-item>運用サポート窓口</dads-menu-list-item>
                </dads-menu-list-box>
              </dads-global-menu-item>
            </dads-global-menu>
          </div>
        </div>
      </section>

      <script type="module">
        // a11y-annotate が target の a11yAnnotations を読めるよう、
        // dads-global-menu を先に import してから a11y-annotate を import する。
        await import('dads-global-menu');
        await Promise.all([
          import('dads-menu-list-box'),
          import('dads-divider'),
          import('dads-switch'),
          import('dads-input-text'),
          import('dads-table'),
          import('a11y-annotate'),
        ]);
      </script>
    </div>
  `,

  /**
   * Menu List Box - Fidelity Tests (E2E/Figma検証用)
   * ID安定性を優先。ショーケースとは分離。
   */


  breadcrumb: () => `
    <div class="demo-breadcrumb" style="padding: 40px; max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">パンくずリスト</h2>
      <p style="color: #666; margin-bottom: 32px;">
        現在位置ナビゲーション（パンくず）として、<code>p</code>要素ベースで実装しています。
        <code>ul/ol/li</code> は使用せず、<code>role="list"</code>/<code>role="listitem"</code> でセマンティクスを補完します。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>

        <a11y-annotate target-selector="dads-breadcrumb">
          <div style="display: grid; place-content: center; padding: 48px 0;">
            <dads-breadcrumb show-label structured-data="microdata" base-url="https://design.example.go.jp/">
              <dads-breadcrumb-item home href="/">ホーム</dads-breadcrumb-item>
              <dads-breadcrumb-item href="/page-1">ページ 1</dads-breadcrumb-item>
              <dads-breadcrumb-item href="/page-2">ページ 2</dads-breadcrumb-item>
              <dads-breadcrumb-item href="/page-3">ページ 3</dads-breadcrumb-item>
              <dads-breadcrumb-item>ページ 4</dads-breadcrumb-item>
            </dads-breadcrumb>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          構造化データ（Microdata）は <code>structured-data="microdata"</code> で有効化できます（Light DOMにミラーを生成）。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-breadcrumb',
            'dads-breadcrumb-item',
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-breadcrumb
                  data-api-target
                  separator="chevron"
                  structured-data="off"
                  base-url="https://design.example.go.jp/"
                >
                  <dads-breadcrumb-item home href="/">ホーム</dads-breadcrumb-item>
                  <dads-breadcrumb-item href="/page-1">ページ 1</dads-breadcrumb-item>
                  <dads-breadcrumb-item href="/page-2">ページ 2</dads-breadcrumb-item>
                  <dads-breadcrumb-item>ページ 3</dads-breadcrumb-item>
                </dads-breadcrumb>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-breadcrumb separator="chevron" structured-data="off" base-url="https://design.example.go.jp/">
                      <dads-breadcrumb-item home href="/">ホーム</dads-breadcrumb-item>
                      <dads-breadcrumb-item href="/page-1">ページ 1</dads-breadcrumb-item>
                      <dads-breadcrumb-item href="/page-2">ページ 2</dads-breadcrumb-item>
                      <dads-breadcrumb-item>ページ 3</dads-breadcrumb-item>
                    </dads-breadcrumb>
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
                        <th scope="row"><code>show-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="show-label" data-api-attr="show-label" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>「現在位置」ラベルを表示する</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>structured-data</code></th>
                        <td><code>attr</code></td>
                        <td><code>off</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="structured-data" data-api-attr="structured-data" data-default="off">
                              <option value="off" selected>off</option>
                              <option value="microdata">microdata</option>
                            </select>
                          </div>
                        </td>
                        <td>構造化データ出力モード</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>separator</code></th>
                        <td><code>attr</code></td>
                        <td><code>chevron</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="separator" data-api-attr="separator" data-default="chevron">
                              <option value="chevron" selected>chevron</option>
                              <option value="slash">slash</option>
                              <option value="pipe">pipe</option>
                            </select>
                          </div>
                        </td>
                        <td>区切り表示（山形矢印 / スラッシュ / パイプ）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>base-url</code></th>
                        <td><code>attr</code></td>
                        <td><code>document.baseURI</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="base-url"
                              value="https://design.example.go.jp/"
                              data-api-attr="base-url"
                              data-default="https://design.example.go.jp/"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>構造化データURL解決のベース</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>current</code></th>
                        <td><code>attr</code></td>
                        <td><code>(auto: last)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch
                              aria-label="current"
                              data-api-attr="current"
                              data-api-target-selector="dads-breadcrumb-item:nth-of-type(2)"
                              data-default="false"
                            >
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>2番目項目を明示的に現在ページにする</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>home</code></th>
                        <td><code>attr</code></td>
                        <td><code>true(1st)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch
                              aria-label="home"
                              data-api-attr="home"
                              data-api-target-selector="dads-breadcrumb-item:first-of-type"
                              data-default="true"
                              checked
                            >
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>先頭項目のホームアイコン表示</td>
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
                        <th scope="row"><code>--dads-breadcrumb-link-color</code></th>
                        <td><code>--color-primitive-blue-1000</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-breadcrumb-link-color" value="" data-api-css-var="--dads-breadcrumb-link-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>リンク通常色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-breadcrumb-link-color-hover</code></th>
                        <td><code>--color-primitive-blue-900</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-breadcrumb-link-color-hover" value="" data-api-css-var="--dads-breadcrumb-link-color-hover" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>リンクホバー色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-breadcrumb-link-color-active</code></th>
                        <td><code>--color-primitive-orange-800</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-breadcrumb-link-color-active" value="" data-api-css-var="--dads-breadcrumb-link-color-active" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>リンクアクティブ色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-breadcrumb-separator-color</code></th>
                        <td><code>--color-neutral-solid-gray-900</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-breadcrumb-separator-color" value="" data-api-css-var="--dads-breadcrumb-separator-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り矢印の色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Variants</h3>
        <div style="display: grid; gap: 24px;">
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">通常</p>
            <dads-breadcrumb>
              <dads-breadcrumb-item href="/">ホーム</dads-breadcrumb-item>
              <dads-breadcrumb-item href="/page-1">ページ 1</dads-breadcrumb-item>
              <dads-breadcrumb-item>ページ 2</dads-breadcrumb-item>
            </dads-breadcrumb>
          </div>

          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">ホームアイコン + ラベル表示</p>
            <dads-breadcrumb show-label>
              <dads-breadcrumb-item home href="/">ホーム</dads-breadcrumb-item>
              <dads-breadcrumb-item href="/section">セクション</dads-breadcrumb-item>
              <dads-breadcrumb-item>現在ページ</dads-breadcrumb-item>
            </dads-breadcrumb>
          </div>

          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">スラッシュ区切り</p>
            <dads-breadcrumb separator="slash">
              <dads-breadcrumb-item href="/">ホーム</dads-breadcrumb-item>
              <dads-breadcrumb-item href="/page-1">ページ 1</dads-breadcrumb-item>
              <dads-breadcrumb-item>ページ 2</dads-breadcrumb-item>
            </dads-breadcrumb>
          </div>

          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">パイプ区切り</p>
            <dads-breadcrumb separator="pipe">
              <dads-breadcrumb-item href="/">ホーム</dads-breadcrumb-item>
              <dads-breadcrumb-item href="/page-1">ページ 1</dads-breadcrumb-item>
              <dads-breadcrumb-item>ページ 2</dads-breadcrumb-item>
            </dads-breadcrumb>
          </div>
        </div>
      </section>

      <script type="module">
        await import('dads-breadcrumb');
        await import('dads-switch');
        await import('a11y-annotate');
      </script>
    </div>
  `,


  utilityLink: () => `
    <div style="padding: 40px; max-width: 1120px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ユーティリティリンク</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS準拠の補助リンク。先頭/末尾アイコンは任意で、末尾は <code>slot=&quot;tail-icon&quot;</code> が優先され、未指定時のみ <code>target=&quot;_blank&quot;</code> / <code>download</code> で自動表示します。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-utility-link">
          <div style="display: grid; place-content: center; padding: 48px 0;">
            <dads-utility-link href="#" target="_blank">
              <svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
                <path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" />
              </svg>
              リンクテキスト
            </dads-utility-link>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          属性とCSS varsの変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-utility-link',
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-utility-link data-api-target href="#" target="_blank">
                  <svg
                    data-utility-link-lead-icon
                    slot="lead-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentcolor"
                    aria-hidden="true"
                  >
                    <path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" />
                  </svg>
                  リンクテキスト
                  <svg
                    data-utility-link-tail-icon
                    slot="tail-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentcolor"
                    aria-hidden="true"
                  >
                    <path d="M13 5 11.6 6.4 16.2 11H4v2h12.2l-4.6 4.6L13 19l7-7-7-7Z" />
                  </svg>
                </dads-utility-link>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-utility-link href="#" target="_blank">
                      <svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
                        <path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" />
                      </svg>
                      リンクテキスト
                      <svg slot="tail-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
                        <path d="M13 5 11.6 6.4 16.2 11H4v2h12.2l-4.6 4.6L13 19l7-7-7-7Z" />
                      </svg>
                    </dads-utility-link>
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
                        <th scope="row"><code>href</code></th>
                        <td><code>attr</code></td>
                        <td><code>#</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="href"
                              value="#"
                              data-api-attr="href"
                              data-default="#"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>リンク先URL</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>target</code></th>
                        <td><code>attr</code></td>
                        <td><code>_blank</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="target" data-api-attr="target" data-default="_blank">
                              <option value="_blank" selected>_blank</option>
                              <option value="_self">_self</option>
                              <option value="">(unset)</option>
                            </select>
                          </div>
                        </td>
                        <td><code>tail-icon</code> 未指定かつ <code>download</code> が無い場合に <code>_blank</code> で新規タブアイコンを表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>rel</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="rel"
                              value=""
                              data-api-attr="rel"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>リンクrel（自動補完なし）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>download</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="download" data-api-attr="download" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td><code>tail-icon</code> 未指定時に download属性の付与でダウンロードアイコンを表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>lead-icon</code></th>
                        <td><code>slot</code></td>
                        <td><code>lead-icon</code></td>
                        <td>
                          <div class="wc-api-control">
                            <label
                              for="utility-link-lead-icon-visibility"
                              style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
                            >
                              lead-icon
                            </label>
                            <select id="utility-link-lead-icon-visibility" aria-label="lead-icon" data-api-target-selector="[data-utility-link-lead-icon]" data-api-attr="hidden" data-default="">
                              <option value="" selected>show</option>
                              <option value="true">hide</option>
                            </select>
                          </div>
                        </td>
                        <td>先頭アイコンの表示/非表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>tail-icon</code></th>
                        <td><code>slot</code></td>
                        <td><code>tail-icon</code></td>
                        <td>
                          <div class="wc-api-control">
                            <label
                              for="utility-link-tail-icon-visibility"
                              style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
                            >
                              tail-icon
                            </label>
                            <select id="utility-link-tail-icon-visibility" aria-label="tail-icon" data-api-target-selector="[data-utility-link-tail-icon]" data-api-attr="hidden" data-default="">
                              <option value="" selected>show</option>
                              <option value="true">hide</option>
                            </select>
                          </div>
                        </td>
                        <td>末尾アイコンの表示/非表示（指定時は自動アイコンより優先）</td>
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
                        <th scope="row"><code>--dads-utility-link-label-color</code></th>
                        <td><code>--color-neutral-solid-gray-800</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-utility-link-label-color" value="" data-api-css-var="--dads-utility-link-label-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル文字色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-utility-link-icon-color</code></th>
                        <td><code>--color-neutral-solid-gray-900</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-utility-link-icon-color" value="" data-api-css-var="--dads-utility-link-icon-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコン色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-utility-link-underline-thickness</code></th>
                        <td><code>1px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-utility-link-underline-thickness" value="" data-api-css-var="--dads-utility-link-underline-thickness" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>通常時の下線太さ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-utility-link-underline-thickness-hover</code></th>
                        <td><code>3px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-utility-link-underline-thickness-hover" value="" data-api-css-var="--dads-utility-link-underline-thickness-hover" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー時の下線太さ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-utility-link-focus-outline-color</code></th>
                        <td><code>--color-neutral-black</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-utility-link-focus-outline-color" value="" data-api-css-var="--dads-utility-link-focus-outline-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカスのアウトライン色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-utility-link-focus-background</code></th>
                        <td><code>--color-primitive-yellow-300</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-utility-link-focus-background" value="" data-api-css-var="--dads-utility-link-focus-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーカス時背景色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Examples（Figma Link Units）</h3>
        <div style="display: grid; gap: 20px; max-width: 820px;">
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Units = 2</p>
            <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 1rem;">
              <dads-utility-link href="#" target="_blank">
                <svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" /></svg>
                リンクテキスト
              </dads-utility-link>
              <dads-utility-link href="#" target="_blank">
                <svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" /></svg>
                リンクテキスト
              </dads-utility-link>
            </div>
          </div>

          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Units = 3 / 4 / 5</p>
            <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 1rem;">
              <dads-utility-link href="#" target="_blank"><svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" /></svg>リンクテキスト</dads-utility-link>
              <dads-utility-link href="#" target="_blank"><svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" /></svg>リンクテキスト</dads-utility-link>
              <dads-utility-link href="#" target="_blank"><svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" /></svg>リンクテキスト</dads-utility-link>
              <dads-utility-link href="#" target="_blank"><svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" /></svg>リンクテキスト</dads-utility-link>
              <dads-utility-link href="#" target="_blank"><svg slot="lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" /></svg>リンクテキスト</dads-utility-link>
            </div>
          </div>
        </div>
      </section>

      <script type="module">
        await import('dads-utility-link');
        await import('dads-switch');
        await import('a11y-annotate');
      </script>
    </div>
  `,


  languageSelector: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ランゲージセレクター</h2>
      <p style="color: #666; margin-bottom: 24px;">
        DADS準拠の言語切替UI。opener（text/icon）、サイズ（regular/small）、キーボード操作、選択状態を提供します。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          opener は表示言語に関わらず英語で表示し、項目は各言語表記で示します。
        </p>
        <a11y-annotate target-selector="dads-language-selector">
          <div style="display: grid; place-content: center; padding: 40px 0;">
            <dads-language-selector size="md" opener="text">
              <dads-menu-list-item data-value="ja">日本語</dads-menu-list-item>
              <dads-menu-list-item data-value="en" current>English</dads-menu-list-item>
              <dads-menu-list-item data-value="zh-cn">简体中文</dads-menu-list-item>
              <dads-menu-list-item data-value="zh-tw">繁體中文</dads-menu-list-item>
              <dads-menu-list-item data-value="ko">한국어</dads-menu-list-item>
              <dads-menu-list-item data-value="es">Español</dads-menu-list-item>
              <dads-menu-list-item data-value="id">Bahasa Indonesia</dads-menu-list-item>
              <dads-menu-list-item data-value="vi">Tiếng Việt</dads-menu-list-item>
            </dads-language-selector>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-language-selector',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-language-selector data-api-target size="md" opener="text">
                  <dads-menu-list-item data-value="ja">日本語</dads-menu-list-item>
                  <dads-menu-list-item data-value="en" current>English</dads-menu-list-item>
                  <dads-menu-list-item data-value="zh-cn">简体中文</dads-menu-list-item>
                  <dads-menu-list-item data-value="zh-tw">繁體中文</dads-menu-list-item>
                  <dads-menu-list-item data-value="ko">한국어</dads-menu-list-item>
                  <dads-menu-list-item data-value="es">Español</dads-menu-list-item>
                  <dads-menu-list-item data-value="id">Bahasa Indonesia</dads-menu-list-item>
                  <dads-menu-list-item data-value="vi">Tiếng Việt</dads-menu-list-item>
                </dads-language-selector>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-language-selector size="md" opener="text">
                      <dads-menu-list-item data-value="ja">日本語</dads-menu-list-item>
                      <dads-menu-list-item data-value="en" current>English</dads-menu-list-item>
                      <dads-menu-list-item data-value="zh-cn">简体中文</dads-menu-list-item>
                      <dads-menu-list-item data-value="zh-tw">繁體中文</dads-menu-list-item>
                      <dads-menu-list-item data-value="ko">한국어</dads-menu-list-item>
                      <dads-menu-list-item data-value="es">Español</dads-menu-list-item>
                      <dads-menu-list-item data-value="id">Bahasa Indonesia</dads-menu-list-item>
                      <dads-menu-list-item data-value="vi">Tiếng Việt</dads-menu-list-item>
                    </dads-language-selector>
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
                        <th scope="row"><code>opener</code></th>
                        <td><code>attr</code></td>
                        <td><code>'text' | 'icon'</code></td>
                        <td><code>text</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="opener" data-api-attr="opener" data-default="text">
                              <option value="text" selected>text</option>
                              <option value="icon">icon</option>
                            </select>
                          </div>
                        </td>
                        <td>opener 表示（Language / LANG）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>'sm' | 'md'</code></td>
                        <td><code>md</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="md">
                              <option value="md" selected>md</option>
                              <option value="sm">sm</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ（md: 44px / sm: 36px）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>bold</code></th>
                        <td><code>attr</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="bold" data-api-attr="bold" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>opener の文字太さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>Language</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="label" value="Language" data-api-attr="label" data-default="Language"></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル（slot 未使用時）</td>
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
                        <th scope="row"><code>--dads-menu-list-box-opener-padding-x</code></th>
                        <td><code>4px / 16px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-padding-x" value="" data-api-css-var="--dads-menu-list-box-opener-padding-x" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>opener 左右余白</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-menu-list-box-opener-gap</code></th>
                        <td><code>4px / 8px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-menu-list-box-opener-gap" value="" data-api-css-var="--dads-menu-list-box-opener-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>opener 要素間隔</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-language-selector-check-color</code></th>
                        <td><code>--color-primitive-blue-1000</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-language-selector-check-color" value="" data-api-css-var="--dads-language-selector-check-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>選択チェック色</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">イベント利用例</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          <code>dads-change</code> を受け取り、<code>getSelectedLanguage()</code> で選択中の言語を取得します。
        </p>
        <div style="display: grid; gap: 12px; place-content: start; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">
          <dads-language-selector data-language-selector-events size="md" opener="text">
            <dads-menu-list-item data-value="ja">日本語</dads-menu-list-item>
            <dads-menu-list-item data-value="en" current>English</dads-menu-list-item>
            <dads-menu-list-item data-value="zh-cn">简体中文</dads-menu-list-item>
            <dads-menu-list-item data-value="zh-tw">繁體中文</dads-menu-list-item>
            <dads-menu-list-item data-value="ko">한국어</dads-menu-list-item>
            <dads-menu-list-item data-value="es">Español</dads-menu-list-item>
            <dads-menu-list-item data-value="id">Bahasa Indonesia</dads-menu-list-item>
            <dads-menu-list-item data-value="vi">Tiếng Việt</dads-menu-list-item>
          </dads-language-selector>
          <div data-language-selector-output style="font-size: 14px; color: #1f2937;">未選択</div>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Text Opener（Regular）</h3>
        <dads-language-selector size="md" opener="text">
          <dads-menu-list-item data-value="ja" current>日本語</dads-menu-list-item>
          <dads-menu-list-item data-value="en">English</dads-menu-list-item>
          <dads-menu-list-item data-value="zh-cn">简体中文</dads-menu-list-item>
          <dads-menu-list-item data-value="zh-tw">繁體中文</dads-menu-list-item>
          <dads-menu-list-item data-value="ko">한국어</dads-menu-list-item>
          <dads-menu-list-item data-value="es">Español</dads-menu-list-item>
          <dads-menu-list-item data-value="id">Bahasa Indonesia</dads-menu-list-item>
          <dads-menu-list-item data-value="vi">Tiếng Việt</dads-menu-list-item>
        </dads-language-selector>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Icon Opener（Small）</h3>
        <dads-language-selector size="sm" opener="icon">
          <dads-menu-list-item data-value="ja">日本語</dads-menu-list-item>
          <dads-menu-list-item data-value="en" current>English</dads-menu-list-item>
          <dads-menu-list-item data-value="zh-cn">简体中文</dads-menu-list-item>
          <dads-menu-list-item data-value="zh-tw">繁體中文</dads-menu-list-item>
          <dads-menu-list-item data-value="ko">한국어</dads-menu-list-item>
          <dads-menu-list-item data-value="es">Español</dads-menu-list-item>
          <dads-menu-list-item data-value="id">Bahasa Indonesia</dads-menu-list-item>
          <dads-menu-list-item data-value="vi">Tiếng Việt</dads-menu-list-item>
        </dads-language-selector>
      </section>

      <script>
        (() => {
          const host = document.querySelector('[data-language-selector-events]');
          const output = document.querySelector('[data-language-selector-output]');
          if (!(host instanceof HTMLElement) || !(output instanceof HTMLElement)) return;

          const update = () => {
            const canRead = typeof host.getSelectedLanguage === 'function';
            const selected = canRead ? host.getSelectedLanguage() : null;
            if (!selected) {
              output.textContent = '未選択';
              return;
            }

            output.textContent = 'selected: ' + selected.value + ' (' + selected.label + ')';
          };

          host.addEventListener('dads-change', update);
          update();
        })();
      </script>
    </div>
  `,

  carousel: () => `
    <div class="demo-carousel" style="padding: 40px; max-width: 1240px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">カルーセル</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS カルーセル仕様に準拠しつつ、<code>items</code>（配列データ入力）と slot 入力の両方に対応し、<code>image-slider</code> で幅狭モードを明示指定できます。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">使い方（写真データの準備）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          実運用では <code>items</code> で渡すのが最も扱いやすいです。最低限 <code>src</code> と <code>alt</code> を用意し、表示安定のために
          <code>width</code> / <code>height</code> / <code>srcset</code> も付与してください。
        </p>

        <ul style="margin: 0 0 16px 20px; color: #374151; font-size: 14px; line-height: 1.8;">
          <li><code>src</code>（必須）: 1x画像URL</li>
          <li><code>alt</code>（必須）: 画像の代替テキスト</li>
          <li><code>href</code>（任意）: スライド遷移先URL（未指定なら非リンク）</li>
          <li><code>srcset</code>（推奨）: 2x画像（例: <code>image-1@2x.webp 2x</code>）</li>
          <li><code>width</code> / <code>height</code>（推奨）: 画像の元サイズ（レイアウト安定化）</li>
        </ul>

        <div style="display: grid; gap: 16px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #fff;">
            <h4 style="font-size: 15px; margin: 0 0 8px; color: #111827;">基本例（items を直接渡す）</h4>
            <pre style="margin: 0; font-size: 12px; line-height: 1.6; overflow-x: auto; color: #111827;"><code>const items = [
  {
    src: '/images/event-1.webp',
    srcset: '/images/event-1@2x.webp 2x',
    alt: '学ぼうSDGs 偶数月の第3土曜日',
    href: '/events/1',
    width: 696,
    height: 392,
    title: '開催中のイベント 1'
  },
  {
    src: '/images/event-2.webp',
    srcset: '/images/event-2@2x.webp 2x',
    alt: '地産地消キャンペーン',
    href: '/events/2',
    width: 696,
    height: 392
  }
];

const carousel = document.querySelector('dads-carousel');
if (carousel) carousel.items = items;</code></pre>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #fff;">
            <h4 style="font-size: 15px; margin: 0 0 8px; color: #111827;">CMSレスポンスから変換する例</h4>
            <pre style="margin: 0; font-size: 12px; line-height: 1.6; overflow-x: auto; color: #111827;"><code>const items = cmsResponse.banners.map((banner, index) => ({
  src: banner.image.url,
  srcset: banner.image.url2x ? banner.image.url2x + ' 2x' : undefined,
  alt: banner.image.alt || 'バナー画像 ' + (index + 1),
  href: banner.link?.url,
  width: banner.image.width || 696,
  height: banner.image.height || 392,
  title: banner.title
}));</code></pre>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-carousel">
          <div style="padding: 24px 0;">
            <dads-carousel data-carousel-items aria-label="注目トピック"></dads-carousel>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          <code>breakpoint-rem</code> と Preview 幅を調整して、desktop 時の <code>data-wide="true"</code> 切替を確認できます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-carousel',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <div style="display: grid; gap: 12px;">
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151;">
                    <span>Preview width</span>
                    <input type="range" min="480" max="1320" step="10" value="1024" aria-label="Preview width" data-carousel-api-width />
                    <span data-carousel-api-width-value>1024px</span>
                  </label>

                  <div data-carousel-api-frame style="width: 1024px; max-width: 100%;">
                    <dads-carousel data-api-target data-carousel-api-target aria-label="カルーセル（API Preview）"></dads-carousel>
                  </div>

                  <p data-carousel-api-state style="margin: 0; font-size: 13px; color: #4b5563;">
                    state: data-image-slider=-, data-wide=-, data-expanded=-
                  </p>
                </div>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-carousel aria-label="カルーセル"></dads-carousel>
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
                        <td><code>container</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="type" data-api-attr="type" data-default="container">
                              <option value="container" selected>container</option>
                              <option value="key-visual">key-visual</option>
                            </select>
                          </div>
                        </td>
                        <td>レイアウト種別</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>current-index</code></th>
                        <td><code>attr</code></td>
                        <td><code>0</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="current-index" value="0" data-api-attr="current-index" data-default="0"></dads-input-text>
                          </div>
                        </td>
                        <td>現在スライド（0始まり）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>breakpoint-rem</code></th>
                        <td><code>attr</code></td>
                        <td><code>64</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="breakpoint-rem" value="64" data-api-attr="breakpoint-rem" data-default="64"></dads-input-text>
                          </div>
                        </td>
                        <td>desktop 判定幅（rem）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>カルーセル</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="aria-label" value="カルーセル（API Preview）" data-api-attr="aria-label" data-default="カルーセル（API Preview）"></dads-input-text>
                          </div>
                        </td>
                        <td>ランドマーク名</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>prev-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>前のスライド</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="prev-label" value="前のスライド" data-api-attr="prev-label" data-default="前のスライド"></dads-input-text>
                          </div>
                        </td>
                        <td>前ボタンラベル</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>next-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>次のスライド</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="next-label" value="次のスライド" data-api-attr="next-label" data-default="次のスライド"></dads-input-text>
                          </div>
                        </td>
                        <td>次ボタンラベル</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>all-slides-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>すべてのスライド</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="all-slides-label" value="すべてのスライド" data-api-attr="all-slides-label" data-default="すべてのスライド"></dads-input-text>
                          </div>
                        </td>
                        <td>一覧トグルのラベル</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>image-slider</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="image-slider" data-api-attr="image-slider" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>幅狭コンテナ（イメージスライダー）表示を強制</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>unit</code></th>
                        <td><code>attr</code></td>
                        <td><code>スライド</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="unit" value="スライド" data-api-attr="unit" data-default="スライド"></dads-input-text>
                          </div>
                        </td>
                        <td>読み上げ単位</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>data-wide</code></th>
                        <td><code>state</code></td>
                        <td><code>false | true</code></td>
                        <td>Preview width + breakpoint-rem で自動切替</td>
                        <td>desktop レイアウト判定結果</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>data-image-slider</code></th>
                        <td><code>state</code></td>
                        <td><code>false | true</code></td>
                        <td><code>image-slider</code> 属性で切替</td>
                        <td>イメージスライダー（幅狭固定）モードの状態</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
          `,
        })}
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Events API</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          Splide 互換方針の拡張イベントを利用して、遷移前キャンセル・遷移後同期・レイアウト変化監視を行えます。
        </p>
        <ul style="margin: 0 0 16px 20px; color: #374151; font-size: 14px; line-height: 1.8;">
          <li><code>dads-carousel-before-change</code>（cancelable）</li>
          <li><code>dads-carousel-index-change</code></li>
          <li><code>dads-carousel-layout-change</code></li>
          <li><code>dads-carousel-controls-update</code></li>
          <li><code>dads-carousel-media-loaded</code> / <code>dads-carousel-media-error</code></li>
        </ul>
        <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #fff;">
          <pre style="margin: 0; font-size: 12px; line-height: 1.6; overflow-x: auto; color: #111827;"><code>const carousel = document.querySelector('dads-carousel');

carousel?.addEventListener('dads-carousel-before-change', (event) => {
  // 例: 3枚目への遷移を抑止
  if (event.detail.nextIndex === 2) event.preventDefault();
});

carousel?.addEventListener('dads-carousel-index-change', (event) => {
  console.log('index changed', event.detail.currentIndex, event.detail.source);
});

carousel?.addEventListener('dads-carousel-layout-change', (event) => {
  console.log('layout', event.detail.wide ? 'desktop' : 'mobile', event.detail.reason);
});</code></pre>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">items API（推奨）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          画像データを配列で渡せるため、CMS/JSON 連携時に実装しやすくなります。
        </p>
        <dads-carousel data-carousel-items-api aria-label="カルーセル（items API）"></dads-carousel>
        <div data-carousel-event-output style="margin-top: 12px; font-size: 14px; color: #1f2937;">event: 未発火</div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">image-slider API（幅狭固定）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          <code>image-slider</code> 属性を付与すると、プレビュー幅に関係なくページナビゲーション主体の幅狭レイアウトになります。
        </p>
        <dads-carousel data-carousel-image-slider image-slider aria-label="イメージスライダー"></dads-carousel>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">type=\"key-visual\"</h3>
        <dads-carousel data-carousel-key-visual type="key-visual" current-index="1" aria-label="キービジュアル"></dads-carousel>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">slot 入力（互換モード）</h3>
        <dads-carousel aria-label="slot 入力のカルーセル">
          <a href="#slot-1">
            <img src="/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-1.webp" alt="slot スライド1" />
          </a>
          <a href="#slot-2">
            <img src="/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-2.webp" alt="slot スライド2" />
          </a>
          <img src="/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-3.webp" alt="slot スライド3" />
        </dads-carousel>
      </section>

      <script type="module">
        await import('dads-carousel');
        await import('a11y-annotate');

        (() => {
          const baseItems = [
            {
              src: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-1.webp',
              srcset: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-1@2x.webp 2x',
              alt: '学ぼうSDGs 偶数月の第3土曜日 環境保全の「自分事化」で学べるワークショップ開催',
              href: '#news-1',
              title: '開催中のイベント 1',
              width: 696,
              height: 392,
            },
            {
              src: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-2.webp',
              srcset: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-2@2x.webp 2x',
              alt: '地産地消キャンペーン 県の名産品や体験イベントを楽しもう 期間：4月から7月までの毎週末開催！',
              href: '#news-2',
              title: '開催中のイベント 2',
              width: 696,
              height: 392,
            },
            {
              src: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-3.webp',
              srcset: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-3@2x.webp 2x',
              alt: '令和 国立公園・歴史名所スタンプラリー',
              href: '#news-3',
              title: '開催中のイベント 3',
              width: 696,
              height: 392,
            },
            {
              src: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-4.webp',
              srcset: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-4@2x.webp 2x',
              alt: '合同健康診断のお知らせ ご自身とご家族の健康維持のため、定期的な健康診断の受診を。',
              href: '#news-4',
              title: '開催中のイベント 4',
              width: 696,
              height: 392,
            },
            {
              src: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-5.webp',
              srcset: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-5@2x.webp 2x',
              alt: '夏の体験学習プログラム 参加者募集',
              href: '#news-5',
              title: '開催中のイベント 5',
              width: 696,
              height: 392,
            },
            {
              src: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-6.webp',
              srcset: '/resources/dads/components/carousel/upstream/design-system-example-components-html/src/components/carousel/image-6@2x.webp 2x',
              alt: '地域防災フェアのお知らせ',
              href: '#news-6',
              title: '開催中のイベント 6',
              width: 696,
              height: 392,
            },
          ];

          const carousel = document.querySelector('[data-carousel-items]');
          const carouselApi = document.querySelector('[data-carousel-items-api]');
          const carouselImageSlider = document.querySelector('[data-carousel-image-slider]');
          const carouselApiPreview = document.querySelector('[data-carousel-api-target]');
          const keyVisual = document.querySelector('[data-carousel-key-visual]');
          const output = document.querySelector('[data-carousel-event-output]');
          const apiFrame = document.querySelector('[data-carousel-api-frame]');
          const apiWidth = document.querySelector('[data-carousel-api-width]');
          const apiWidthValue = document.querySelector('[data-carousel-api-width-value]');
          const apiState = document.querySelector('[data-carousel-api-state]');

          if (carousel) carousel.items = baseItems;
          if (carouselApi) carouselApi.items = baseItems;
          if (carouselImageSlider) carouselImageSlider.items = baseItems;
          if (carouselApiPreview) carouselApiPreview.items = baseItems;
          if (keyVisual) {
            keyVisual.items = baseItems.map((item) => ({
              ...item,
              description: undefined,
            }));
          }

          if (carouselApi && output) {
            carouselApi.addEventListener('dads-carousel-change', (event) => {
              const detail = event && event.detail ? event.detail : {};
              output.textContent =
                'event: index=' +
                String(detail.currentIndex ?? '-') +
                ', previous=' +
                String(detail.previousIndex ?? '-') +
                ', source=' +
                String(detail.source ?? '-');
            });
          }

          const updateApiState = () => {
            if (!carouselApiPreview || !apiState) return;
            const imageSlider = carouselApiPreview.getAttribute('data-image-slider') ?? '-';
            const wide = carouselApiPreview.getAttribute('data-wide') ?? '-';
            const expanded = carouselApiPreview.getAttribute('data-expanded') ?? '-';
            const breakpointRem = carouselApiPreview.getAttribute('breakpoint-rem') ?? '-';
            const frameWidth =
              apiFrame instanceof HTMLElement
                ? Math.round(apiFrame.getBoundingClientRect().width)
                : 0;

            apiState.textContent =
              'state: data-image-slider=' +
              String(imageSlider) +
              ', data-wide=' +
              String(wide) +
              ', data-expanded=' +
              String(expanded) +
              ', breakpoint-rem=' +
              String(breakpointRem) +
              ', frame=' +
              String(frameWidth) +
              'px';
          };

          if (carouselApiPreview && apiState) {
            const observer = new MutationObserver(updateApiState);
            observer.observe(carouselApiPreview, {
              attributes: true,
              attributeFilter: ['data-image-slider', 'data-wide', 'data-expanded', 'breakpoint-rem'],
            });
            updateApiState();
          }

          if (apiWidth instanceof HTMLInputElement && apiFrame instanceof HTMLElement) {
            const updatePreviewWidth = () => {
              const value = Number.parseInt(apiWidth.value, 10);
              const width = Number.isFinite(value) ? value : 1024;
              apiFrame.style.width = String(width) + 'px';
              if (apiWidthValue instanceof HTMLElement) {
                apiWidthValue.textContent = String(width) + 'px';
              }
              updateApiState();
            };

            apiWidth.addEventListener('input', updatePreviewWidth);
            updatePreviewWidth();
          }
        })();
      </script>
    </div>
  `,

  stepNavigation: () => `
    <div class="demo-step-navigation" style="padding: 40px; max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ステップナビゲーション</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 step-navigation.css と同一の見た目になるよう実装したWeb Components版です。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>

        <a11y-annotate target-selector="dads-step-navigation">
          <div style="display: grid; place-content: center; padding: 48px 0;">
            <dads-step-navigation orientation="horizontal" size="normal" aria-label="ステップ">
              <span slot="status">全4ステップ中、1ステップ目まで到達済み</span>
              <dads-step-navigation-item state="reached" aria-current="step">
                <span slot="title">申請者情報</span>
                <span slot="description">入力</span>
              </dads-step-navigation-item>
              <dads-step-navigation-item state="completed">
                <span slot="title">添付書類</span>
                <span slot="description">アップロード</span>
              </dads-step-navigation-item>
              <dads-step-navigation-item state="editing">
                <span slot="title">確認</span>
                <span slot="description">内容</span>
              </dads-step-navigation-item>
              <dads-step-navigation-item state="error">
                <span slot="title">完了</span>
                <span slot="description">送信</span>
              </dads-step-navigation-item>
            </dads-step-navigation>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-step-navigation',
            'dads-step-navigation-item',
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-step-navigation data-api-target orientation="horizontal" size="normal" aria-label="ステップ" status-live="off">
                  <span slot="status">全4ステップ中、1ステップ目まで到達済み</span>
                  <dads-step-navigation-item state="reached" aria-current="step">
                    <span slot="title">申請者情報</span>
                    <span slot="description">入力</span>
                  </dads-step-navigation-item>
                  <dads-step-navigation-item state="completed">
                    <span slot="title">添付書類</span>
                    <span slot="description">アップロード</span>
                  </dads-step-navigation-item>
                  <dads-step-navigation-item>
                    <span slot="title">確認</span>
                    <span slot="description">内容</span>
                  </dads-step-navigation-item>
                  <dads-step-navigation-item>
                    <span slot="title">完了</span>
                    <span slot="description">送信</span>
                  </dads-step-navigation-item>
                </dads-step-navigation>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-step-navigation orientation="horizontal" size="normal" aria-label="ステップ" status-live="off">
                      <span slot="status">全4ステップ中、1ステップ目まで到達済み</span>
                      <dads-step-navigation-item state="reached" aria-current="step">
                        <span slot="title">申請者情報</span>
                        <span slot="description">入力</span>
                      </dads-step-navigation-item>
                      <dads-step-navigation-item state="completed">
                        <span slot="title">添付書類</span>
                        <span slot="description">アップロード</span>
                      </dads-step-navigation-item>
                      <dads-step-navigation-item>
                        <span slot="title">確認</span>
                        <span slot="description">内容</span>
                      </dads-step-navigation-item>
                      <dads-step-navigation-item>
                        <span slot="title">完了</span>
                        <span slot="description">送信</span>
                      </dads-step-navigation-item>
                    </dads-step-navigation>
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
                        <th scope="row"><code>orientation</code></th>
                        <td><code>attr</code></td>
                        <td><code>horizontal</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="orientation" data-api-attr="orientation" data-default="horizontal">
                              <option value="horizontal" selected>horizontal</option>
                              <option value="vertical">vertical</option>
                            </select>
                          </div>
                        </td>
                        <td>表示方向</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>normal</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="normal">
                              <option value="normal" selected>normal</option>
                              <option value="small">small</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>status-live</code></th>
                        <td><code>attr</code></td>
                        <td><code>off</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="status-live" data-api-attr="status-live" data-default="off">
                              <option value="off" selected>off</option>
                              <option value="polite">polite</option>
                              <option value="assertive">assertive</option>
                            </select>
                          </div>
                        </td>
                        <td>status の aria-live</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>ステップ</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="aria-label" value="ステップ" data-api-attr="aria-label" data-default="ステップ"></dads-input-text>
                          </div>
                        </td>
                        <td>ナビゲーションのラベル</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>state</code></th>
                        <td><code>attr</code></td>
                        <td><code>reached</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="state"
                              data-api-attr="state"
                              data-api-target-selector="dads-step-navigation-item:first-of-type"
                              data-default="reached"
                            >
                              <option value="reached" selected>reached</option>
                              <option value="completed">completed</option>
                              <option value="editing">editing</option>
                              <option value="error">error</option>
                              <option value="skipped">skipped</option>
                            </select>
                          </div>
                        </td>
                        <td>ステップ状態（1つ目）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-current</code></th>
                        <td><code>attr</code></td>
                        <td><code>step</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="aria-current"
                              data-api-attr="aria-current"
                              data-api-target-selector="dads-step-navigation-item:first-of-type"
                              data-default="step"
                            >
                              <option value="step" selected>step</option>
                              <option value="">（unset）</option>
                            </select>
                          </div>
                        </td>
                        <td>現在位置（1つ目）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>href</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="href"
                              value=""
                              data-api-attr="href"
                              data-api-target-selector="dads-step-navigation-item:first-of-type"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>リンク化（1つ目）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>interaction</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="interaction"
                              data-api-attr="interaction"
                              data-api-target-selector="dads-step-navigation-item:first-of-type"
                              data-default=""
                            >
                              <option value="" selected>none</option>
                              <option value="button">button</option>
                            </select>
                          </div>
                        </td>
                        <td>ボタン相当（1つ目）</td>
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
                        <th scope="row"><code>--dads-step-navigation-step-width</code></th>
                        <td><code>20rem</code><br><small style="color:#666">(320px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-step-navigation-step-width" value="" data-api-css-var="--dads-step-navigation-step-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ステップ幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-step-navigation-step-min-width</code></th>
                        <td><code>10rem</code><br><small style="color:#666">(160px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-step-navigation-step-min-width" value="" data-api-css-var="--dads-step-navigation-step-min-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小幅（横スクロール発生ライン）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-step-navigation-color</code></th>
                        <td><code>--color-neutral-solid-gray-800</code><br><small style="color:#666">(#333333)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-step-navigation-color" value="" data-api-css-var="--dads-step-navigation-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字色/線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-step-navigation-reached-number-bg</code></th>
                        <td><code>--color-neutral-solid-gray-800</code><br><small style="color:#666">(#333333)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-step-navigation-reached-number-bg" value="" data-api-css-var="--dads-step-navigation-reached-number-bg" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>reached番号背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-step-navigation-reached-number-color</code></th>
                        <td><code>--color-neutral-white</code><br><small style="color:#666">(#ffffff)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-step-navigation-reached-number-color" value="" data-api-css-var="--dads-step-navigation-reached-number-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>reached番号文字色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-step-navigation-error-color</code></th>
                        <td><code>--color-semantic-error-1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-step-navigation-error-color" value="" data-api-css-var="--dads-step-navigation-error-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>エラー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-step-navigation-focus-ring-color</code></th>
                        <td><code>--color-primitive-yellow-300</code><br><small style="color:#666">(#ffd43d)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-step-navigation-focus-ring-color" value="" data-api-css-var="--dads-step-navigation-focus-ring-color" data-default=""></dads-input-text>
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

      <style>
        .demo-step-navigation .api-table-wrap {
          overflow-x: auto;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #fff;
        }

        .demo-step-navigation .api-table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
        }

        .demo-step-navigation .api-table th,
        .demo-step-navigation .api-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e5e5e5;
          text-align: left;
          vertical-align: top;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
        }

        .demo-step-navigation .api-table thead th {
          background: #fafafa;
          font-weight: 600;
          color: #111;
        }

        .demo-step-navigation .api-table td[data-col="preview"] {
          width: 240px;
        }

        .demo-step-navigation .state-preview {
          display: grid;
          place-items: center;
          padding: 6px 0;
        }

        .demo-step-navigation .state-preview dads-step-navigation-item {
          --dads-step-navigation-step-width: 12rem;
          --dads-step-navigation-step-min-width: 12rem;
        }

        .demo-step-navigation .api-table tr:last-child td {
          border-bottom: none;
        }

        .demo-step-navigation code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
            monospace;
          font-size: 12px;
          background: #f6f8fa;
          border: 1px solid #e5e5e5;
          padding: 2px 6px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .demo-step-navigation code + code {
          margin-left: 6px;
        }
      </style>

      <section style="margin-bottom: 40px; max-width: 720px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">リンクなし / ステップ一覧（Figma: 17938:43547）</h3>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <h4 style="margin: 0 0 12px; font-size: 20px;">カード交付申請</h4>
          <p style="margin: 0 0 24px; color: #666;">申請は以下の6つの手順で行います。</p>

          <dads-step-navigation orientation="vertical" size="normal">
            ${renderStepNavigationItems({ steps: CARD_APPLICATION_STEPS, includeDescription: true })}
          </dads-step-navigation>

          <div style="margin-top: 24px;">
            <dads-button>申請をはじめる</dads-button>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">リンクなし / ステップ1 / Descriptionなし（Figma: 17938:43715）</h3>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 10rem;">
            ${renderStepNavigationItems({
              steps: CARD_APPLICATION_STEPS,
              currentStep: 1,
              states: ['reached'],
            })}
          </dads-step-navigation>

          <div style="margin-top: 24px;">
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">1 /6</div>
            <h4 style="margin: 0 0 12px; font-size: 28px;">基本情報入力</h4>
            <p style="margin: 0; color: #666;">
              申請に必要な基本情報を入力します。氏名や住所などの内容は、本人確認やカード送付に使用されます。正確な情報を入力し、誤りがないようご確認ください。
            </p>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">リンクなし / ステップ1 / Descriptionあり（Figma: 18620:1283）</h3>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 12.5rem;">
            ${renderStepNavigationItems({
              steps: CARD_APPLICATION_STEPS,
              includeDescription: true,
              currentStep: 1,
              states: ['reached'],
            })}
          </dads-step-navigation>

          <div style="margin-top: 24px;">
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">1 /6</div>
            <h4 style="margin: 0 0 12px; font-size: 28px;">基本情報入力</h4>
            <p style="margin: 0; color: #666;">
              申請に必要な基本情報を入力します。氏名や住所などの内容は、本人確認やカード送付に使用されます。正確な情報を入力し、誤りがないようご確認ください。
            </p>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">リンクなし / ステップ5（Figma: 17938:44530）</h3>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 10rem;">
            ${renderStepNavigationItems({
              steps: CARD_APPLICATION_STEPS,
              currentStep: 5,
              states: ['completed', 'completed', 'completed', 'completed', 'reached'],
            })}
          </dads-step-navigation>

          <div style="margin-top: 24px;">
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">5 /6</div>
            <h4 style="margin: 0 0 12px; font-size: 28px;">申請情報の入力</h4>
            <p style="margin: 0; color: #666;">申請情報を入力してください。</p>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">全部入り（state一覧）（Figma: 17946:44906）</h3>
        <p style="color: #666; margin-bottom: 16px; font-size: 14px;">
          state: reached / completed / editing / error / skipped、aria-current で現在位置を表現します。
        </p>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 12.5rem;">
            <span slot="status">全6ステップ中、5ステップ目まで到達済み</span>

            <dads-step-navigation-item state="completed" href="#all-1">
              <span>ステップタイトル</span>
              <span slot="description">ステップの説明が入ります。</span>
            </dads-step-navigation-item>

            <dads-step-navigation-item state="editing">
              <span>ステップタイトル</span>
              <span slot="description">ステップの説明が入ります。</span>
            </dads-step-navigation-item>

            <dads-step-navigation-item state="error">
              <span>ステップタイトル</span>
              <span slot="description">ステップの説明が入ります。</span>
            </dads-step-navigation-item>

            <dads-step-navigation-item state="skipped">
              <span>ステップタイトル</span>
              <span slot="description">ステップの説明が入ります。</span>
            </dads-step-navigation-item>

            <dads-step-navigation-item state="reached" aria-current="step">
              <span>ステップタイトル</span>
              <span slot="description">ステップの説明が入ります。</span>
            </dads-step-navigation-item>

            <dads-step-navigation-item>
              <span>ステップタイトル</span>
              <span slot="description">ステップの説明が入ります。</span>
            </dads-step-navigation-item>
          </dads-step-navigation>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">ステータス（state）とスタイル解説</h3>
        <p style="color: #666; margin-bottom: 16px; font-size: 14px;">
          <code>state</code> 属性で状態表現を切り替えます。トークン（CSSカスタムプロパティ）は <code>dads-step-navigation</code>（コンテナ）に指定し、子の <code>dads-step-navigation-item</code> へ継承させる運用が基本です。
        </p>

        <div class="api-table-wrap" role="region" aria-label="ステータスとスタイルの対応表">
          <table class="api-table">
            <thead>
              <tr>
                <th>state</th>
                <th>意味</th>
                <th>主な見た目</th>
                <th>関連トークン（例）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>（なし）</td>
                <td>未到達</td>
                <td data-col="preview">
                  <div class="state-preview">
                    <dads-step-navigation-item
                      step="1"
                      data-first
                      data-last
                      data-orientation="horizontal"
                      data-size="small"
                    >
                      <span slot="title">ステップ</span>
                    </dads-step-navigation-item>
                  </div>
                </td>
                <td>
                  <code>--dads-step-navigation-number-bg</code>
                  <code>--dads-step-navigation-color</code>
                </td>
              </tr>
              <tr>
                <td>reached</td>
                <td>到達/現在</td>
                <td data-col="preview">
                  <div class="state-preview">
                    <dads-step-navigation-item
                      state="reached"
                      aria-current="step"
                      step="2"
                      data-first
                      data-last
                      data-orientation="horizontal"
                      data-size="small"
                    >
                      <span slot="title">ステップ</span>
                    </dads-step-navigation-item>
                  </div>
                </td>
                <td>
                  <code>--dads-step-navigation-reached-number-bg</code>
                  <code>--dads-step-navigation-reached-number-color</code>
                </td>
              </tr>
              <tr>
                <td>completed</td>
                <td>完了</td>
                <td data-col="preview">
                  <div class="state-preview">
                    <dads-step-navigation-item
                      state="completed"
                      step="3"
                      data-first
                      data-last
                      data-orientation="horizontal"
                      data-size="small"
                    >
                      <span slot="title">ステップ</span>
                    </dads-step-navigation-item>
                  </div>
                </td>
                <td>
                  <code>--dads-step-navigation-completed-number-bg</code>
                  <code>--dads-step-navigation-completed-icon-circle</code>
                  <code>--dads-step-navigation-completed-icon-check</code>
                </td>
              </tr>
              <tr>
                <td>editing</td>
                <td>編集中</td>
                <td data-col="preview">
                  <div class="state-preview">
                    <dads-step-navigation-item
                      state="editing"
                      step="4"
                      data-first
                      data-last
                      data-orientation="horizontal"
                      data-size="small"
                    >
                      <span slot="title">ステップ</span>
                    </dads-step-navigation-item>
                  </div>
                </td>
                <td>
                  <code>--dads-step-navigation-editing-icon-color</code>
                  <code>--dads-step-navigation-state-badge-bg</code>
                </td>
              </tr>
              <tr>
                <td>error</td>
                <td>エラー</td>
                <td data-col="preview">
                  <div class="state-preview">
                    <dads-step-navigation-item
                      state="error"
                      step="5"
                      data-first
                      data-last
                      data-orientation="horizontal"
                      data-size="small"
                    >
                      <span slot="title">ステップ</span>
                    </dads-step-navigation-item>
                  </div>
                </td>
                <td>
                  <code>--dads-step-navigation-error-color</code>
                  <code>--dads-step-navigation-error-icon-color</code>
                  <code>--dads-step-navigation-state-badge-bg</code>
                </td>
              </tr>
              <tr>
                <td>skipped</td>
                <td>スキップ</td>
                <td data-col="preview">
                  <div class="state-preview">
                    <dads-step-navigation-item
                      state="skipped"
                      step="6"
                      data-first
                      data-last
                      data-orientation="horizontal"
                      data-size="small"
                    >
                      <span slot="title">ステップ</span>
                    </dads-step-navigation-item>
                  </div>
                </td>
                <td>
                  <code>--dads-step-navigation-color</code>
                  <code>--dads-step-navigation-connector-color</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="color: #666; margin-top: 12px; font-size: 14px;">
          現在位置は <code>aria-current="step"</code> で示します（番号にアウトライン）。フォーカス表示は <code>--dads-step-navigation-focus-outline-color</code> / <code>--dads-step-navigation-focus-ring-color</code> で調整できます。
        </p>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">リンクあり / ホバー（Figma: 18460:2887）</h3>
        <p style="color: #666; margin-bottom: 16px; font-size: 14px;">
          例: 完了済みのステップを <code>href</code> で戻れるようにするパターンです（CSSのホバー表現も確認できます）。
        </p>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 10rem;">
            ${renderStepNavigationItems({
              steps: CARD_APPLICATION_STEPS,
              currentStep: 5,
              states: ['completed', 'completed', 'completed', 'completed', 'reached'],
              hrefForIndex: (i) => (i < 4 ? `#step-${i + 1}` : undefined),
            })}
          </dads-step-navigation>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">ボタン相当（イベントで遷移）</h3>
        <p style="color: #666; margin-bottom: 16px; font-size: 14px;">
          <code>interaction="button"</code> を指定すると、href無しでもクリック/Enter/Spaceで <code>dads-step-activate</code> が発火します（detailにstep/state）。
        </p>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <div id="step-activate-log" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; font-size: 12px; color: #666; margin-bottom: 12px;">
            last: (none)
          </div>
          <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 10rem;">
            ${renderStepNavigationItems({
              steps: CARD_APPLICATION_STEPS,
              currentStep: 2,
              states: ['completed', 'reached'],
              interaction: 'button',
            })}
          </dads-step-navigation>
        </div>

        <script>
          (function() {
            var currentScript = document.currentScript;
            customElements.whenDefined('dads-step-navigation-item').then(() => {
              var root = currentScript?.previousElementSibling;
              if (!root) return;
              var log = root.querySelector('#step-activate-log');
              var nav = root.querySelector('dads-step-navigation');
              if (!log || !nav) return;
              nav.addEventListener('dads-step-activate', (e) => {
                var detail = e.detail || {};
                log.textContent = 'last: ' + JSON.stringify(detail);
              });
            });
          })();
        </script>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">動的ステータス（status-live）</h3>
        <p style="color: #666; margin-bottom: 16px; font-size: 14px;">
          <code>status-live="polite"</code> を指定すると、<code>slot="status"</code> の文言更新を <code>aria-live</code> で通知できます（SPA等）。
          このデモでは、クリックで「見た目（state/aria-current）」と「読み上げ（status）」を同時に更新します。
        </p>

        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px;">
          <dads-button type="button" id="demo-step-navigation-status-update">進捗を進める</dads-button>
          <span style="font-size: 12px; color: #666;">クリックで state/aria-current と slot="status" を更新します</span>
        </div>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; gap: 12px; align-items: baseline; flex-wrap: wrap; margin-bottom: 12px;">
            <div id="demo-step-navigation-status-visible" style="font-size: 14px; color: #333;">全6ステップ中、1ステップ目まで到達済み</div>
            <div style="font-size: 12px; color: #666;">読み上げ: status-live（polite）</div>
          </div>
          <dads-step-navigation
            id="demo-step-navigation-status-nav"
            orientation="horizontal"
            size="normal"
            aria-label="ステップ"
            status-live="polite"
            style="--dads-step-navigation-step-min-width: 10rem;"
          >
            <span slot="status" id="demo-step-navigation-status">全6ステップ中、1ステップ目まで到達済み</span>
            ${renderStepNavigationItems({
              steps: CARD_APPLICATION_STEPS,
              currentStep: 1,
              states: ['reached'],
              hrefForIndex: (i) => '#status-live-' + String(i + 1),
            })}
          </dads-step-navigation>
        </div>

        <script>
          customElements.whenDefined('dads-step-navigation').then(() => {
            const button = document.getElementById('demo-step-navigation-status-update');
            const status = document.getElementById('demo-step-navigation-status');
            const statusVisible = document.getElementById('demo-step-navigation-status-visible');
            const nav = document.getElementById('demo-step-navigation-status-nav');
            if (!button || !status) return;
            if (!nav) return;

            const items = Array.from(nav.querySelectorAll('dads-step-navigation-item'));
            const total = items.length || 6;

            let reached = 1;
            const sync = () => {
              const text = '全' + total + 'ステップ中、' + reached + 'ステップ目まで到達済み';
              status.textContent = text;
              if (statusVisible) statusVisible.textContent = text;

              for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (i < reached - 1) {
                  item.setAttribute('state', 'completed');
                  item.removeAttribute('aria-current');
                  continue;
                }
                if (i === reached - 1) {
                  item.setAttribute('state', 'reached');
                  item.setAttribute('aria-current', 'step');
                  continue;
                }
                item.removeAttribute('state');
                item.removeAttribute('aria-current');
              }
            };

            sync();
            button.addEventListener('click', (e) => {
              // dads-button はネイティブclick（number detail）に加え、CustomEvent('click')（object detail）を再発火する。
              // ここではネイティブclickのみ扱い、1クリック=1回の更新にする。
              if (typeof e.detail !== 'number') return;
              reached = (reached % total) + 1;
              sync();
            });
          });
        </script>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="color: #666; margin-bottom: 16px; font-size: 14px;">
          複数ステップを並べて、状態（state）や現在位置（aria-current）の注釈が分散して表示されるようにしています。
          リンク/ボタンとして利用する場合は <code>aria-label</code>/<code>aria-labelledby</code> で「何のナビか」を指定し、必要に応じて <code>status-live</code> で進捗文言の読み上げを有効化します。
        </p>

        ${annotationToggleUI()}
        ${annotationToggleScript()}

        <a11y-annotate target-selector="dads-step-navigation">
          <div style="display: grid; place-content: center; padding: 24px 0;">
            <dads-step-navigation
              orientation="horizontal"
              size="normal"
              aria-label="ステップ"
              style="--dads-step-navigation-step-width: 10rem; --dads-step-navigation-step-min-width: 10rem;"
            >
              <span slot="status">全4ステップ中、3ステップ目でエラーがあります</span>

              <dads-step-navigation-item state="completed" href="#step-1">
                <span slot="title">入力</span>
                <span slot="description">申請に必要な基本情報を入力します。</span>
              </dads-step-navigation-item>

              <dads-step-navigation-item state="reached" aria-current="step">
                <span slot="title">確認</span>
                <span slot="description">入力内容を確認します。</span>
              </dads-step-navigation-item>

              <dads-step-navigation-item state="error">
                <span slot="title">本人確認</span>
                <span slot="description">アップロード書類に不備があります。</span>
              </dads-step-navigation-item>

              <dads-step-navigation-item state="editing">
                <span slot="title">提出</span>
                <span slot="description">提出前に最終確認します。</span>
              </dads-step-navigation-item>
            </dads-step-navigation>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">スクロール（7〜8ステップ）（Figma: 17949:46465 / 17949:46835）</h3>

        <div style="display: grid; gap: 16px;">
          <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; max-width: 760px; min-width: 0;">
            <div style="font-size: 14px; color: #666; margin-bottom: 12px;">7ステップ（横スクロール）</div>
            <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 10rem;">
              ${renderStepNavigationItems({
                steps: CARD_APPLICATION_STEPS_EXTENDED.slice(0, 7),
                currentStep: 1,
                states: ['reached'],
              })}
            </dads-step-navigation>
          </div>

          <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; max-width: 760px; min-width: 0;">
            <div style="font-size: 14px; color: #666; margin-bottom: 12px;">8ステップ（横スクロール）</div>
            <dads-step-navigation orientation="horizontal" size="normal" style="--dads-step-navigation-step-min-width: 10rem;">
              ${renderStepNavigationItems({
                steps: CARD_APPLICATION_STEPS_EXTENDED,
                currentStep: 3,
                states: ['completed', 'completed', 'reached'],
              })}
            </dads-step-navigation>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">サイドステップ表示（Figma: 17949:47429）</h3>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
          <div style="display: grid; grid-template-columns: 240px 1fr; gap: 32px;">
            <dads-step-navigation orientation="vertical" size="small">
              ${renderStepNavigationItems({
                steps: CARD_APPLICATION_STEPS,
                currentStep: 4,
                states: ['completed', 'completed', 'completed', 'reached'],
              })}
            </dads-step-navigation>

            <div>
              <div style="font-size: 14px; color: #666; margin-bottom: 8px;">4 /6</div>
              <h4 style="margin: 0 0 16px; font-size: 28px;">利用規約の確認</h4>
              <p style="margin: 0 0 16px; color: #666;">利用規約を確認して次へ進んでください。</p>

              <div style="font-size: 14px; line-height: 1.8; color: #333;">
                <h5 style="margin: 0 0 8px; font-size: 16px;">利用規約</h5>
                <p style="margin: 0 0 16px;">
                  本利用規約（以下「本規約」といいます。）は、○○（以下「当社」といいます。）が提供する
                  「○○サービス」（以下「本サービス」といいます。）の利用条件を定めるものです。本サービスを利用される方（以下「利用者」といいます。）は、本規約に同意のうえ、本サービスを利用するものとします。
                </p>
                <h5 style="margin: 16px 0 8px; font-size: 16px;">第1条（適用）</h5>
                <p style="margin: 0 0 16px;">
                  本規約は、利用者と当社との間の本サービスの利用に関わる一切の関係に適用されます。
                </p>
                <h5 style="margin: 16px 0 8px; font-size: 16px;">第2条（利用登録）</h5>
                <p style="margin: 0 0 16px;">
                  利用者は、本規約に同意のうえ、当社の定める方法により利用登録を行うことができます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">モバイル（Figma: 17957:48071 / 17957:48374 / 17957:48663）</h3>

        <div style="display: grid; gap: 16px; max-width: 375px;">
          <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; min-width: 0;">
            <h4 style="margin: 0 0 12px; font-size: 20px;">カード交付申請</h4>
            <p style="margin: 0 0 16px; color: #666; font-size: 14px;">申請は以下の6つの手順で行います。</p>
            <dads-step-navigation orientation="vertical" size="small">
              ${renderStepNavigationItems({ steps: CARD_APPLICATION_STEPS, includeDescription: true })}
            </dads-step-navigation>
            <div style="margin-top: 16px;">
              <dads-button style="width: 100%;">申請をはじめる</dads-button>
            </div>
          </div>

          <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; min-width: 0;">
            <dads-step-navigation orientation="horizontal" size="small" style="--dads-step-navigation-step-width: 3.75rem; --dads-step-navigation-step-min-width: 3.75rem;">
              ${renderStepNavigationItems({
                steps: CARD_APPLICATION_STEPS,
                includeTitle: false,
                currentStep: 1,
                states: ['reached'],
              })}
            </dads-step-navigation>
            <div style="margin-top: 16px;">
              <div style="font-size: 14px; color: #666; margin-bottom: 8px;">1 /6</div>
              <h4 style="margin: 0 0 12px; font-size: 24px;">基本情報入力</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">
                オンライン申請を行うために基本情報を入力してください。
              </p>
            </div>
          </div>

          <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; min-width: 0;">
            <dads-step-navigation orientation="horizontal" size="small" style="--dads-step-navigation-step-width: 3.75rem; --dads-step-navigation-step-min-width: 3.75rem;">
              ${renderStepNavigationItems({
                steps: CARD_APPLICATION_STEPS_EXTENDED,
                includeTitle: false,
                currentStep: 3,
                states: ['completed', 'completed', 'reached'],
              })}
            </dads-step-navigation>
            <div style="margin-top: 16px;">
              <h4 style="margin: 0 0 12px; font-size: 24px;">3 /8 本人確認</h4>
              <p style="margin: 0 0 16px; color: #666; font-size: 14px;">
                オンライン申請を行うため、メールアドレスの登録が必要となります。登録いただきましたメールアドレスに、申請手続きのご案内メールを送信します。
              </p>
              <dads-button style="width: 100%;">次のステップへ</dads-button>
              <div style="text-align: center; margin-top: 16px;">
                <a href="#" style="color: #1d4ed8; text-decoration: underline;">戻る</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <script type="module">
      await import('dads-step-navigation');
      await import('dads-switch');
      await import('a11y-annotate');
      await import('dads-button');
    </script>
  `,


  pageNavigation: () => `
    <div style="padding: 40px; max-width: 1120px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ページナビゲーション</h2>
      <p style="color: #666; margin-bottom: 32px;">
        前/次の移動と、任意のステータス表示（例: 1/24, 9,999 / 9,999, ページ名など）を組み合わせるコンポーネント。
      </p>

      ${annotationToggleUI()}
      ${annotationToggleScript()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（a11y-annotate）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ※ 右側パネルに仕様メモ、左側にターゲット要素のコールアウトが表示されます。
        </p>
        <a11y-annotate target-selector="dads-page-navigation">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-page-navigation
              type="text"
              prev-href="#"
              next-href="#"
              current="9999"
              total="9999"
              status-separator=" / "
            ></dads-page-navigation>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / Controls（Storybook風） -->
      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / Controls（Storybook風・サンプル）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          テーブル内の操作が、同じパネル内のターゲット要素へ即時反映されます。
          ステータスは <code>slot="status"</code> / <code>status</code> / <code>current+total</code> から選べます（優先順: slot → status → current/total）。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-page-navigation',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-page-navigation
                  data-api-target
                  type="text"
                  size="m"
                  prev-href="#"
                  next-href="#"
                  prev-label="前のページ"
                  next-label="次のページ"
                  current="1"
                  total="24"
                  status-separator="/"
                ></dads-page-navigation>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-page-navigation
                      type="text"
                      size="m"
                      prev-href="#"
                      next-href="#"
                      prev-label="前のページ"
                      next-label="次のページ"
                      current="1"
                      total="24"
                      status-separator="/"
                    ></dads-page-navigation>
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
                        <td><code>text</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select data-api-attr="type" data-default="text" aria-label="type">
                              <option value="text" selected>text</option>
                              <option value="arrow">arrow</option>
                              <option value="outlined">outlined</option>
                            </select>
                          </div>
                        </td>
                        <td>表示タイプ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>m</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select data-api-attr="size" data-default="m" aria-label="size">
                              <option value="l">l</option>
                              <option value="m" selected>m</option>
                              <option value="s">s</option>
                              <option value="xs">xs</option>
                            </select>
                          </div>
                        </td>
                        <td>arrow時のサイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>prev-href</code></th>
                        <td><code>attr</code></td>
                        <td><code>#</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="prev-href"
                              value="#"
                              data-api-attr="prev-href"
                              data-default="#"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>前へリンク先（空で非表示）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>next-href</code></th>
                        <td><code>attr</code></td>
                        <td><code>#</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="next-href"
                              value="#"
                              data-api-attr="next-href"
                              data-default="#"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>次へリンク先（空で非表示）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>prev-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>前のページ</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="prev-label"
                              value="前のページ"
                              data-api-attr="prev-label"
                              data-default="前のページ"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>前へラベル（例: 前の3件）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>next-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>次のページ</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="next-label"
                              value="次のページ"
                              data-api-attr="next-label"
                              data-default="次のページ"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>次へラベル（例: 次の3件）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>status</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="status"
                              value=""
                              data-api-attr="status"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>任意のステータス文字列（空なら current/total）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>current</code></th>
                        <td><code>attr</code></td>
                        <td><code>1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="current"
                              value="1"
                              data-api-attr="current"
                              data-default="1"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>現在値（status未指定時）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>total</code></th>
                        <td><code>attr</code></td>
                        <td><code>24</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="total"
                              value="24"
                              data-api-attr="total"
                              data-default="24"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>総数（status未指定時）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>status-separator</code></th>
                        <td><code>attr</code></td>
                        <td><code>/</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="status-separator"
                              value="/"
                              data-api-attr="status-separator"
                              data-default="/"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>current/total の区切り（例: <code> / </code>）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>hide-status</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch data-api-attr="hide-status" data-default="false" aria-label="hide-status">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>ステータスを強制非表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>ページナビゲーション</code></td>
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
                        <td>nav のラベル（空ならデフォルト）</td>
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
                        <th scope="row"><code>--dads-page-navigation-width</code></th>
                        <td><code>fit-content</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-page-navigation-width"
                              value=""
                              data-api-css-var="--dads-page-navigation-width"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>nav の幅（例: <code>100%</code>, <code>fit-content</code>）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-page-navigation-justify-content</code></th>
                        <td><code>flex-start</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              data-api-css-var="--dads-page-navigation-justify-content"
                              data-default=""
                              aria-label="--dads-page-navigation-justify-content"
                            >
                              <option value="" selected>(default)</option>
                              <option value="flex-start">flex-start</option>
                              <option value="center">center</option>
                              <option value="flex-end">flex-end</option>
                              <option value="space-between">space-between</option>
                            </select>
                          </div>
                        </td>
                        <td>コントロールの寄せ方（flexの <code>justify-content</code>）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-page-navigation-gap</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-page-navigation-gap"
                              value=""
                              data-api-css-var="--dads-page-navigation-gap"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>前/ステータス/次の間隔</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-page-navigation-control-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-page-navigation-control-color"
                              value=""
                              data-api-css-var="--dads-page-navigation-control-color"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>コントロールの文字/アイコン色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-page-navigation-control-background-hover</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-page-navigation-control-background-hover"
                              value=""
                              data-api-css-var="--dads-page-navigation-control-background-hover"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>hover 背景色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-page-navigation-control-border-radius</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-page-navigation-control-border-radius"
                              value=""
                              data-api-css-var="--dads-page-navigation-control-border-radius"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>角丸（outlined/arrow など）</td>
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
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Text（current/total + status-separator）</h3>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
          <dads-page-navigation
            type="text"
            prev-href="#"
            next-href="#"
            current="9999"
            total="9999"
            status-separator=" / "
          ></dads-page-navigation>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Arrow（アイコンのみ + ステータス）</h3>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: grid; gap: 16px;">
          <dads-page-navigation
            type="arrow"
            size="m"
            prev-href="#"
            next-href="#"
            current="9999"
            total="9999"
            status-separator=" / "
          ></dads-page-navigation>

          <dads-page-navigation type="arrow" size="xs" prev-href="#" next-href="#">
            <span slot="status">カスタム</span>
          </dads-page-navigation>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Outlined（status slot / status attr）</h3>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: grid; gap: 16px;">
          <dads-page-navigation type="outlined" prev-href="#" next-href="#">
            <span slot="status">ページ 1/24（全120件）</span>
          </dads-page-navigation>

          <dads-page-navigation
            type="outlined"
            prev-href="#"
            next-href="#"
            status="9,999 / 9,999"
          ></dads-page-navigation>

          <dads-page-navigation
            type="outlined"
            prev-href="#"
            next-href="#"
            prev-label="申請情報の事前準備"
            next-label="申請情報の確認"
            hide-status
          ></dads-page-navigation>
        </div>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">ボタンモード (as="button")</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          テーブルのページネーションなど、AJAX更新に対応するボタンモード。
          クリック時に <code>prev</code> / <code>next</code> イベントが発火します。
        </p>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: grid; gap: 16px;">
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Arrow タイプ（disabled-prev で前ボタン非表示）</p>
            <dads-page-navigation
              id="button-demo-1"
              as="button"
              type="arrow"
              size="m"
              current="1"
              total="12"
              disabled-prev
            ></dads-page-navigation>
          </div>
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Text タイプ</p>
            <dads-page-navigation
              id="button-demo-2"
              as="button"
              type="text"
              current="6"
              total="12"
            ></dads-page-navigation>
          </div>
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Outlined タイプ（disabled-next で次ボタン非表示）</p>
            <dads-page-navigation
              id="button-demo-3"
              as="button"
              type="outlined"
              current="12"
              total="12"
              disabled-next
            ></dads-page-navigation>
          </div>
          <div style="margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 8px;">
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">イベントログ（DevTools Consoleでも確認可能）</p>
            <pre id="button-event-log" style="font-family: monospace; font-size: 12px; color: #333; margin: 0; white-space: pre-wrap;">イベント未発生</pre>
          </div>
        </div>
        <script>
          (function() {
            var log = document.getElementById('button-event-log');
            var demos = ['button-demo-1', 'button-demo-2', 'button-demo-3'];
            demos.forEach(function(id) {
              var el = document.getElementById(id);
              if (el) {
                el.addEventListener('prev', function(e) {
                  var msg = '[prev] ' + id + ' clicked';
                  console.log(msg, e.detail);
                  if (log) log.textContent = msg;
                });
                el.addEventListener('next', function(e) {
                  var msg = '[next] ' + id + ' clicked';
                  console.log(msg, e.detail);
                  if (log) log.textContent = msg;
                });
              }
            });
          })();
        <\/script>
      </section>

      <section style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Fill レイアウト (fill)</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          2つのコントロールがコンテナ幅を50%ずつ埋めるレイアウト。
        </p>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: grid; gap: 16px;">
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Outlined + fill（リンクモード）</p>
            <dads-page-navigation
              type="outlined"
              prev-href="#"
              next-href="#"
              prev-label="申請情報の事前準備"
              next-label="申請情報の確認"
              hide-status
              fill
            ></dads-page-navigation>
          </div>
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Outlined + fill（ボタンモード）</p>
            <dads-page-navigation
              as="button"
              type="outlined"
              prev-label="前のステップ"
              next-label="次のステップ"
              hide-status
              fill
            ></dads-page-navigation>
          </div>
          <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Text + fill</p>
            <dads-page-navigation
              type="text"
              prev-href="#"
              next-href="#"
              hide-status
              fill
            ></dads-page-navigation>
          </div>
        </div>
      </section>

      <section>
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">片側のみ / ラベル差し替え</h3>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: grid; gap: 16px;">
          <dads-page-navigation type="text" next-href="#" current="1" total="24"></dads-page-navigation>
          <dads-page-navigation
            type="text"
            prev-href="#"
            next-href="#"
            prev-label="前の3件"
            next-label="次の3件"
          ></dads-page-navigation>
        </div>
      </section>
    </div>
  `,
} as const;
