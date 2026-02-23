import {
  API_TABLE_PROPS_HEADER,
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  renderApiPanelWrapper,
  renderAnnotationToggleBlock,
  renderA11ySectionHeader,
} from './shared.js';

export const demos = {

  spinner: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">スピナー</h2>
      <p style="color: #666; margin-bottom: 24px;">
        円形の回転アニメーションで非同期処理中を表示するコンポーネントです。
        indeterminate専用（進捗率の表示には <code>dads-progress-bar</code> を使用）。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate target-selector="dads-spinner">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-spinner label="読み込み中"></dads-spinner>
          </div>
        </a11y-annotate>
      </section>

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

      <!-- 郵便番号検索連携デモ -->
      <section style="margin-top: 40px; margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">郵便番号から住所検索</h3>
        <p style="color: #666; margin-bottom: 16px;">
          郵便番号を入力して「検索」を押すと、模擬的なAPI通信後に住所が自動入力されます。
        </p>
        <div style="max-width: 600px;">
          <div style="display: flex; align-items: end; gap: 16px;">
            <dads-input-text id="postal-input" label="郵便番号" support-text="例: 100-0001 または 1000001" input-width="14ch"></dads-input-text>
            <dads-button id="postal-search-btn" variant="solid" size="medium">検索</dads-button>
          </div>
          <div id="postal-status" role="status" aria-live="polite" aria-atomic="true" style="margin-top: 8px; font-size: 14px; color: #666;"></div>
          <div id="postal-result-area" style="margin-top: 16px; min-height: 280px;">
            <div id="postal-spinner-wrap" style="display: none; height: 280px; align-items: center; justify-content: center;">
              <dads-spinner id="postal-spinner" size="lg" label="検索中"></dads-spinner>
            </div>
            <div id="postal-result" style="display: none;">
              <div style="display: grid; gap: 12px;">
                <dads-input-text id="postal-pref" label="都道府県" readonly></dads-input-text>
                <dads-input-text id="postal-city" label="市区町村" readonly></dads-input-text>
                <dads-input-text id="postal-town" label="町域" readonly></dads-input-text>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script type="module">
        await Promise.all([import('dads-input-text'), import('dads-button'), import('dads-spinner'), import('a11y-annotate')]);

        var toHalf = function(s) {
          return s.replace(/[０-９]/g, function(c) {
            return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
          });
        };
        var normalize = function(raw) {
          return toHalf(raw).replace(/[ー−―‐\\-]/g, '').replace(/[^\\d]/g, '').slice(0, 7);
        };

        var postalInput = document.querySelector('#postal-input');
        var postalBtn = document.querySelector('#postal-search-btn');
        var postalSpinnerWrap = document.querySelector('#postal-spinner-wrap');
        var postalStatus = document.querySelector('#postal-status');
        var postalResult = document.querySelector('#postal-result');
        var postalPref = document.querySelector('#postal-pref');
        var postalCity = document.querySelector('#postal-city');
        var postalTown = document.querySelector('#postal-town');
        var reqId = 0;

        if (postalBtn && postalInput && postalSpinnerWrap && postalStatus && postalResult && postalPref && postalCity && postalTown) {
          postalBtn.addEventListener('click', function() {
            var raw = postalInput.value || '';
            var code = normalize(raw);

            postalStatus.textContent = '';
            postalStatus.style.color = '#666';
            postalResult.style.display = 'none';
            postalSpinnerWrap.style.display = 'none';
            
            if (raw.length > 0 && !/^[0-9０-９ー−―‐\\-]+$/.test(raw)) {
              postalStatus.textContent = '数字とハイフンのみ入力できます';
              postalStatus.style.color = '#c53030';
              return;
            }

            if (code.length !== 7) {
              postalStatus.textContent = '郵便番号は7桁の数字で入力してください';
              postalStatus.style.color = '#c53030';
              return;
            }

            reqId++;
            var thisReq = reqId;

            postalInput.setAttribute('readonly', '');
            postalBtn.setAttribute('disabled', '');
            postalStatus.textContent = '検索中...';

            function finish(data, isError) {
              postalSpinnerWrap.style.display = 'none';
              postalInput.removeAttribute('readonly');
              postalBtn.removeAttribute('disabled');
              if (isError) {
                postalStatus.textContent = '通信エラーが発生しました';
                postalStatus.style.color = '#c53030';
              } else if (data && data.results && data.results.length > 0) {
                var r = data.results[0];
                postalPref.setAttribute('value', r.address1);
                postalCity.setAttribute('value', r.address2);
                postalTown.setAttribute('value', r.address3);
                postalResult.style.display = '';
                postalStatus.textContent = '住所が見つかりました';
                postalStatus.style.color = '#276749';
              } else {
                postalStatus.textContent = '該当する住所が見つかりませんでした';
                postalStatus.style.color = '#c53030';
              }
            }

            // 350ms後にスピナー表示 + fetch開始
            setTimeout(function() {
              if (thisReq !== reqId) return;

              postalSpinnerWrap.style.display = 'flex';
              var spinnerShownAt = Date.now();

              fetch('https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + code)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                  if (thisReq !== reqId) return;
                  var elapsed = Date.now() - spinnerShownAt;
                  var remaining = Math.max(0, 1000 - elapsed);
                  setTimeout(function() {
                    if (thisReq !== reqId) return;
                    finish(data, false);
                  }, remaining);
                })
                .catch(function() {
                  if (thisReq !== reqId) return;
                  var elapsed = Date.now() - spinnerShownAt;
                  var remaining = Math.max(0, 1000 - elapsed);
                  setTimeout(function() {
                    if (thisReq !== reqId) return;
                    finish(null, true);
                  }, remaining);
                });
            }, 350);
          });
        }
      </script>
    </div>
  `,

  progressBar: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">プログレスバー</h2>
      <p style="color: #666; margin-bottom: 24px;">
        水平バーで確定的な進捗状況を表示するコンポーネントです。
        不確定状態（indeterminate）には <code>dads-spinner</code> を使用してください。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate target-selector="dads-progress-bar">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-progress-bar value="0.5" label="50%完了" style="width: 240px;"></dads-progress-bar>
          </div>
        </a11y-annotate>
      </section>

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
                        <td>進捗値（0〜max）</td>
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
            <p style="margin-bottom: 8px; font-size: 14px; color: #888;">Inlined</p>
            <dads-progress-bar composition="inlined" value="0.7" label="70%完了" style="width: 240px;"></dads-progress-bar>
          </div>
          <div>
            <p style="margin-bottom: 8px; font-size: 14px; color: #888;">Underlay</p>
            <dads-progress-bar underlay value="0.3" label="30%完了" style="width: 240px;"></dads-progress-bar>
          </div>
        </div>
      </section>

      <!-- ファイルアップロード連携例 -->
      <section style="margin-top: 40px; margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">ファイルアップロード連携例</h3>
        <p style="color: #666; margin-bottom: 16px;">
          dads-file-upload でファイルを選択し「アップロード」ボタンを押すと、模擬的な進捗表示を行います。
        </p>
        <div style="max-width: 600px;">
          <dads-file-upload id="upload-demo" label="ファイル選択" max-files="1"></dads-file-upload>
          <div style="margin-top: 16px; display: flex; align-items: center; gap: 16px;">
            <dads-button id="upload-demo-btn" variant="solid" size="medium">アップロード</dads-button>
            <span id="upload-demo-status" role="status" aria-live="polite" aria-atomic="true" style="font-size: 14px; color: #666;"></span>
          </div>
          <div style="margin-top: 16px;">
            <dads-progress-bar id="upload-demo-bar" composition="inlined" value="0" label="0%" style="width: 360px;"></dads-progress-bar>
          </div>
        </div>
      </section>

      <script type="module">
        await Promise.all([import('dads-file-upload'), import('dads-button'), import('a11y-annotate')]);

        var btn = document.querySelector('#upload-demo-btn');
        var statusEl = document.querySelector('#upload-demo-status');
        var bar = document.querySelector('#upload-demo-bar');

        if (btn && statusEl && bar) {
          btn.addEventListener('click', function() {
            bar.setAttribute('value', '0');
            bar.setAttribute('label', '0%');
            statusEl.textContent = 'アップロード中...';

            var progress = 0;
            var interval = setInterval(function() {
              progress += 0.02 + Math.random() * 0.05;
              if (progress >= 1) {
                progress = 1;
                clearInterval(interval);
                bar.setAttribute('value', '1');
                bar.setAttribute('label', '100%');
                statusEl.textContent = 'アップロード完了';
              } else {
                var pct = Math.round(progress * 100);
                bar.setAttribute('value', String(progress));
                bar.setAttribute('label', pct + '%');
              }
            }, 100);
          });
        }
      </script>
    </div>
  `,

  loadingIcon: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ローディングアイコン</h2>
      <p style="color: #666; margin-bottom: 24px;">
        砂時計アイコンで処理中状態を静的に表示するコンポーネントです。
        アニメーションは含まず、視覚的なインジケーターとして機能します。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate target-selector="dads-loading-icon">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-loading-icon label="処理中"></dads-loading-icon>
          </div>
        </a11y-annotate>
      </section>

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

      <script type="module">
        await import('a11y-annotate');
      </script>
    </div>
  `,

};
