import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_WITH_TYPE_HEADER,
  CHIP_LABEL_ICON_SVG,
  HEADING_ICON_PATH_OPTIONS,
  renderApiPanelWrapper,
  renderA11ySectionHeader,
  renderAnnotationToggleBlock,
  renderApiTableMeta,
} from './shared.js';

export const headingDemo = () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">見出し</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム準拠の見出しコンポーネントです。見出しレベルとサイズ、マージンの自動設定に対応します。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈（a11y-annotate） -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; max-width: 360px; margin-bottom: 16px;">
          <dads-select id="heading-a11y-variant" label="preset" size="md 360" value="default">
            <option value="default">default</option>
            <option value="shoulder">shoulder</option>
            <option value="icon">icon</option>
            <option value="chip">chip</option>
            <option value="shoulder-chip">shoulder+chip</option>
          </dads-select>
        </div>
        <a11y-annotate target-selector="dads-heading" style="--a11y-annotate-callout-gutter: 120px;">
          <div style="padding: 40px 0;">
            <dads-heading id="heading-a11y-target" level="2" size="45">
              見出しコンポーネント
            </dads-heading>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-heading',
          ],
          rootAttrs: 'data-api-strip-attrs="role,aria-level,data-demo-variant"',
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-heading data-api-target level="2" size="36" margin="none">
                  見出しテキスト
                </dads-heading>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code></dads-code-block>
              </div>
            </div>

            <script>
              (function() {
                // IIFE + currentScript でスコープ分離（activateEmbeddedScripts の再実行対策）
                var currentScript = document.currentScript;
                var root = currentScript && currentScript.parentElement;
                if (!root) return;

                // NOTE: この script タグは HTML の途中に配置されるため、
                // 直後の Props/Attrs テーブルがまだ未生成のタイミングで実行されることがある。
                // その場合でも確実にコントロールにバインドできるように、初期化をリトライする。
                var INIT_KEY = '__dadsHeadingDemoInit';
                if (root[INIT_KEY]) return;
                root[INIT_KEY] = true;

                var DEFAULT_SHOULDER = 'ショルダー';

                function setValue(el, value) {
                  if (!el) return;
                  // Avoid property shadowing before custom elements are defined:
                  // prefer attribute assignment, and only set value once upgraded.
                  el.setAttribute('value', value);
                  var tag = String(el.tagName || '').toLowerCase();
                  var ctor = tag && tag.indexOf('-') !== -1 ? customElements.get(tag) : null;
                  if (ctor && el instanceof ctor) {
                    try { el.value = value; } catch (_) {}
                  } else if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
                    el.value = value;
                  }
                }

                function init(tryCount) {
                  var heading = root.querySelector('dads-heading[data-api-target]');
                  var presetSelect = root.querySelector('select[data-api-attr=\"data-demo-variant\"]');
                  var ruleSelect = root.querySelector('select[data-api-attr=\"rule\"]');
                  var shoulderControl = root.querySelector('[data-api-prop=\"textContent\"][data-api-target-selector*=\"shoulder\"]');
                  var iconControl = root.querySelector('select[data-api-attr=\"d\"][data-api-target-selector*=\"icon\"]');
                  var resetButton = root.querySelector('[data-api-reset]');

                  // 最低限: preview の dads-heading と preset が見つかったら初期化を進める。
                  // shoulder/icon コントロールは後から出現することがあるので optional 扱い。
                  if (!heading || !presetSelect) {
                    if (tryCount < 20) setTimeout(function() { init(tryCount + 1); }, 0);
                    return;
                  }

                  var DEFAULT_ICON_D = (iconControl && iconControl.getAttribute('data-default')) || '';

                  function clearVariantParts() {
                    heading.querySelectorAll('[slot=\"shoulder\"], [slot=\"icon\"]').forEach(function(n) { n.remove(); });
                    heading.removeAttribute('chip');
                  }

                  function ensureShoulder(text) {
                    var span = document.createElement('span');
                    span.setAttribute('slot', 'shoulder');
                    span.textContent = text || DEFAULT_SHOULDER;
                    heading.insertBefore(span, heading.firstChild);
                  }

                  function ensureIcon(pathD) {
                    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('slot', 'icon');
                    svg.setAttribute('width', '24');
                    svg.setAttribute('height', '24');
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.setAttribute('fill', 'currentcolor');
                    svg.setAttribute('aria-hidden', 'true');

                    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    if (pathD) path.setAttribute('d', pathD);
                    svg.appendChild(path);

                    heading.insertBefore(svg, heading.firstChild);
                  }

                  function applyPreset(preset) {
                    // presetごとに初期値へリセット（組み合わせを避ける）
                    clearVariantParts();

                    // Reset rule to default to keep markup minimal per preset.
                    if (ruleSelect) {
                      ruleSelect.value = '';
                    }
                    heading.removeAttribute('rule');

                    // Reset icon/shoulder controls to defaults (UI).
                    setValue(shoulderControl, DEFAULT_SHOULDER);
                    if (iconControl) iconControl.value = DEFAULT_ICON_D;

                    if (preset === 'chip') {
                      heading.setAttribute('chip', '');
                      return;
                    }

                    if (preset === 'shoulder') {
                      ensureShoulder(DEFAULT_SHOULDER);
                      return;
                    }

                    if (preset === 'shoulder-chip') {
                      heading.setAttribute('chip', '');
                      ensureShoulder(DEFAULT_SHOULDER);
                      return;
                    }

                    if (preset === 'icon') {
                      ensureIcon(DEFAULT_ICON_D);
                    }
                  }

                  // shoulderText/iconName を「操作したら効く」ように、必要な slot を自動生成する。
                  function ensurePresetValue(next) {
                    if (!presetSelect) return;
                    if (String(presetSelect.value || '') !== String(next)) {
                      // applyPreset を呼ぶと入力値が初期化されるので、UI表示だけ更新する（changeは発火しない）。
                      presetSelect.value = String(next);
                    }
                  }

                  function getShoulderNode() {
                    return heading.querySelector('[slot=\"shoulder\"]');
                  }

                  function getIconPathNode() {
                    return heading.querySelector('[slot=\"icon\"] path');
                  }

                  function readShoulderValue(e) {
                    // dads-input-text は detail.value を持つが、ShadowDOM の input イベント経由でも拾えるようにする。
                    var detailValue = e && e.detail && typeof e.detail.value === 'string' ? e.detail.value : '';
                    if (detailValue) return detailValue;

                    var t = e && e.target;
                    if (t && typeof t.value === 'string') return t.value;

                    if (shoulderControl && typeof shoulderControl.value === 'string') return shoulderControl.value;
                    return (shoulderControl && shoulderControl.getAttribute('value')) || '';
                  }

                  // preset 変更時に slot/attr を整える（bindApiControls より先に実行して Usage を最小化）
                  presetSelect.addEventListener('change', function() {
                    applyPreset(String(presetSelect.value || 'default'));
                  }, true);

                  // Reset は programmatic で change が飛ばないので、後追いで preset を適用
                  if (resetButton) {
                    resetButton.addEventListener('click', function() {
                      setTimeout(function() {
                        applyPreset(String(presetSelect.value || 'default'));
                      }, 0);
                    });
                  }

                  // 初期状態
                  setTimeout(function() {
                    applyPreset(String(presetSelect.value || 'default'));
                  }, 0);

                  if (shoulderControl) {
                    var onShoulderInput = function(e) {
                      var v = readShoulderValue(e);
                      var node = getShoulderNode();
                      if (!node) {
                        ensureShoulder(String(v || DEFAULT_SHOULDER));
                        if (presetSelect && presetSelect.value === 'default') ensurePresetValue('shoulder');
                        return;
                      }
                      node.textContent = String(v);
                    };
                    // dads-input / dads-change が主経路だが、念のためネイティブ input/change も拾う（アップグレード前/委譲差異対策）。
                    shoulderControl.addEventListener('dads-input', onShoulderInput);
                    shoulderControl.addEventListener('dads-change', onShoulderInput);
                    shoulderControl.addEventListener('input', onShoulderInput);
                    shoulderControl.addEventListener('change', onShoulderInput);
                  } else if (tryCount < 20) {
                    // shoulderControl がまだ生成されていない場合は再試行
                    setTimeout(function() { init(tryCount + 1); }, 0);
                  }

                  if (iconControl) {
                    iconControl.addEventListener('change', function() {
                      var path = getIconPathNode();
                      if (!path) {
                        ensureIcon(String(iconControl.value || DEFAULT_ICON_D));
                        if (presetSelect && presetSelect.value === 'default') ensurePresetValue('icon');
                        return;
                      }
                      // bindApiControls が path[d] を更新するが、存在しない場合に備えたフォールバックとして d を同期する。
                      path.setAttribute('d', String(iconControl.value || ''));
                    });
                  }
                }

                init(0);
              })();
            <\/script>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
	                <dads-table>
	                  <table class="wc-api-table" data-cell-border="bottom">
	                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
	                    <tbody>
	                      ${(() => {
	                        type Row = {
	                          name: string;
	                          kind: string;
	                          typeHtml: string;
	                          defaultHtml: string;
	                          controlHtml: string;
	                          description: string;
	                        };

	                        const renderRow = (row: Row) => `
	                          <tr>
	                            <th scope="row"><code>${row.name}</code></th>
	                            <td><code>${row.kind}</code></td>
	                            <td>${row.typeHtml}</td>
	                            <td>${row.defaultHtml}</td>
	                            <td>${row.controlHtml}</td>
	                            <td>${row.description}</td>
	                          </tr>
	                        `;

	                        const escapeHtmlAttrValue = (value: string): string =>
	                          value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

	                        const iconOptionsHtml = HEADING_ICON_PATH_OPTIONS.map(({ label, value }) => {
	                          const escapedValue = escapeHtmlAttrValue(value);
	                          const selected = label === 'dummy' ? 'selected' : '';
	                          return `<option value="${escapedValue}" ${selected}>${label}</option>`;
	                        }).join('');

	                        const rows: Row[] = [
	                          {
	                            name: 'preset',
	                            kind: 'demo',
	                            typeHtml: '<code>"default" | "shoulder" | "icon" | "chip" | "shoulder-chip"</code>',
	                            defaultHtml: '<code>default</code>',
	                            controlHtml: `
	                              <div class="wc-api-control">
	                                <select aria-label="preset" data-api-attr="data-demo-variant" data-default="default">
	                                  <option value="default" selected>default</option>
	                                  <option value="shoulder">shoulder</option>
	                                  <option value="icon">icon</option>
	                                  <option value="chip">chip</option>
	                                  <option value="shoulder-chip">shoulder+chip</option>
	                                </select>
	                              </div>
	                            `,
	                            description: 'デモ用プリセット（Usageを最小マークアップに揃える）',
	                          },
	                          {
	                            name: 'level',
	                            kind: 'attr',
	                            typeHtml: '<code>"1" | "2" | "3" | "4" | "5" | "6"</code>',
	                            defaultHtml: '<code>2</code>',
	                            controlHtml: `
	                              <div class="wc-api-control">
	                                <select aria-label="level" data-api-attr="level" data-default="2">
	                                  <option value="1">1</option>
	                                  <option value="2" selected>2</option>
	                                  <option value="3">3</option>
	                                  <option value="4">4</option>
	                                  <option value="5">5</option>
	                                  <option value="6">6</option>
	                                </select>
	                              </div>
	                            `,
	                            description: '見出しレベル',
	                          },
	                          {
	                            name: 'size',
	                            kind: 'attr',
	                            typeHtml: '<code>"64" | "57" | "45" | "36" | "32" | "28" | "24" | "20" | "18" | "16"</code>',
	                            defaultHtml: '<code>36</code>',
	                            controlHtml: `
	                              <div class="wc-api-control">
	                                <select aria-label="size" data-api-attr="size" data-default="36">
	                                  <option value="64">64</option>
	                                  <option value="57">57</option>
	                                  <option value="45">45</option>
	                                  <option value="36" selected>36</option>
	                                  <option value="32">32</option>
	                                  <option value="28">28</option>
	                                  <option value="24">24</option>
	                                  <option value="20">20</option>
	                                  <option value="18">18</option>
	                                  <option value="16">16</option>
	                                </select>
	                              </div>
	                            `,
	                            description: '見出しサイズ',
	                          },
	                          {
	                            name: 'margin',
	                            kind: 'attr',
	                            typeHtml: '<code>"none" | "top"</code>',
	                            defaultHtml: '<code>none</code>',
	                            controlHtml: `
	                              <div class="wc-api-control">
	                                <select aria-label="margin" data-api-attr="margin" data-default="none">
	                                  <option value="none" selected>none</option>
	                                  <option value="top">top</option>
	                                </select>
	                              </div>
	                            `,
	                            description: '上マージン（見出しの前の余白）',
	                          },
	                          {
	                            name: 'shoulderText',
	                            kind: 'prop',
	                            typeHtml: '<code>string</code>',
	                            defaultHtml: '<code>ショルダー</code>',
	                            controlHtml: `
	                              <div class="wc-api-control">
	                                <dads-input-text
	                                  label="shoulderText"
	                                  value="ショルダー"
	                                  data-api-prop="textContent"
	                                  data-api-target-selector="dads-heading[data-api-target] [slot=&quot;shoulder&quot;]"
	                                  data-default="ショルダー"
	                                ></dads-input-text>
	                              </div>
	                            `,
	                            description: 'デモ用（slot=&quot;shoulder&quot; を自動生成したときのテキスト）',
	                          },
	                          {
	                            name: 'iconName',
	                            kind: 'attr',
	                            typeHtml: `<code>${HEADING_ICON_PATH_OPTIONS.map(({ label }) => `"${label}"`).join(' | ')}</code>`,
	                            defaultHtml: '<code>dummy</code>',
	                            controlHtml: `
	                              <div class="wc-api-control">
	                                <select
	                                  aria-label="iconName"
	                                  data-api-attr="d"
	                                  data-api-target-selector="dads-heading[data-api-target] [slot=&quot;icon&quot;] path"
	                                  data-default="${HEADING_ICON_PATH_OPTIONS.find(({ label }) => label === 'dummy')?.value ?? ''}"
	                                >
	                                  ${iconOptionsHtml}
	                                </select>
	                              </div>
	                            `,
	                            description: 'デモ用（slot=&quot;icon&quot; のSVGに入れるパスを選択）',
	                          },
	                          {
	                            name: 'rule',
	                            kind: 'attr',
	                            typeHtml: '<code>"8" | "6" | "4" | "2"</code>',
	                            defaultHtml: '<code>(unset)</code>',
	                            controlHtml: `
	                              <div class="wc-api-control">
	                                <select aria-label="rule" data-api-attr="rule" data-default="">
	                                  <option value="" selected>(unset)</option>
	                                  <option value="8">8</option>
	                                  <option value="6">6</option>
	                                  <option value="4">4</option>
	                                  <option value="2">2</option>
	                                </select>
	                              </div>
	                            `,
	                            description: '下線の太さ',
	                          },
	                        ];

	                        return rows.map(renderRow).join('');
	                      })()}
	                    </tbody>
	                  </table>
	                </dads-table>
	              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                ${(() => {
                  const renderCssVarRow = (name: string, defaultCellHtml: string, description: string) => `
                    <tr>
                      <th scope="row"><code>${name}</code></th>
                      <td>${defaultCellHtml}</td>
                      <td>
                        <div class="wc-api-control">
                          <dads-input-text label="${name}" value="" data-api-css-var="${name}" data-default=""></dads-input-text>
                        </div>
                      </td>
                      <td>${description}</td>
                    </tr>
                  `;

                  const rows = [
                    {
                      name: '--dads-heading-color',
                      defaultCellHtml:
                        "<code>--color-neutral-solid-gray-800</code><br>" + renderApiTableMeta("(#333)"),
                      description: '文字色',
                    },
                    {
                      name: '--dads-heading-font-size',
                      defaultCellHtml:
                        "<code>--font-size-36</code><br>" + renderApiTableMeta("(36px)"),
                      description: '見出しフォントサイズ',
                    },
                    {
                      name: '--dads-heading-line-height',
                      defaultCellHtml:
                        "<code>--line-height-140</code><br>" + renderApiTableMeta("(1.4)"),
                      description: '行高',
                    },
                    { name: '--dads-heading-letter-spacing', defaultCellHtml: '<code>0.01em</code>', description: '文字間隔' },
                    {
                      name: '--dads-heading-shoulder-font-size',
                      defaultCellHtml:
                        "<code>--font-size-20</code><br>" + renderApiTableMeta("(20px)"),
                      description: 'ショルダーのフォントサイズ',
                    },
                    {
                      name: '--dads-heading-icon-size',
                      defaultCellHtml:
                        "<code>1.25em</code><br>" + renderApiTableMeta("(相対: font-size追従)"),
                      description: 'アイコンサイズ',
                    },
                    {
                      name: '--dads-heading-icon-gap',
                      defaultCellHtml:
                        "<code>calc(0.4em - 0.25em)</code><br>" + renderApiTableMeta("(相対: font-size追従)"),
                      description: 'アイコンと本文の間隔',
                    },
                    {
                      name: '--dads-heading-icon-vertical-align',
                      defaultCellHtml:
                        "<code>-0.19em</code><br>" + renderApiTableMeta("(相対: font-size追従)"),
                      description: 'アイコンの光学補正（vertical-align）',
                    },
                    {
                      name: '--dads-heading-margin-block-start',
                      defaultCellHtml: "<code>2lh</code><br>" + renderApiTableMeta("(default)"),
                      description: '上マージン',
                    },
                    {
                      name: '--dads-heading-chip-color',
                      defaultCellHtml: '<code>--color-primitive-blue-900</code>',
                      description: 'チップ色',
                    },
                    {
                      name: '--dads-heading-chip-width',
                      defaultCellHtml: "<code>--spacing-3</code><br>" + renderApiTableMeta("(size=36相当)"),
                      description: 'チップの幅',
                    },
                    {
                      name: '--dads-heading-chip-padding-inline',
                      defaultCellHtml: "<code>--spacing-8</code><br>" + renderApiTableMeta("(size=36相当)"),
                      description: 'チップのインライン余白',
                    },
                    {
                      name: '--dads-heading-chip-top',
                      defaultCellHtml: "<code>0.2em</code><br>" + renderApiTableMeta("(lh対応時は自動補正)"),
                      description: 'チップの上位置',
                    },
                    {
                      name: '--dads-heading-chip-bottom',
                      defaultCellHtml: "<code>0.1em</code><br>" + renderApiTableMeta("(lh対応時は自動補正)"),
                      description: 'チップの下位置',
                    },
                    {
                      name: '--dads-heading-rule-color',
                      defaultCellHtml: '<code>--color-primitive-blue-900</code>',
                      description: '下線色',
                    },
                  ];

                  return `
                    <dads-table>
                      <table class="wc-api-table" data-cell-border="bottom">
                        ${API_TABLE_CSS_VARS_HEADER}
                        <tbody>
                          ${rows.map((r) => renderCssVarRow(r.name, r.defaultCellHtml, r.description)).join('')}
                        </tbody>
                      </table>
                    </dads-table>
                    ${API_TABLE_CSS_VARS_NOTE}
                  `;
                })()}
              </div>
            </div>
          `,
        })}
      </section>

      <!-- Notes -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Notes</h3>
        <div style="color: #666; font-size: 14px; line-height: 1.8;">
          <p style="margin: 0 0 12px;">
            <code>slot=&quot;shoulder&quot;</code> / <code>slot=&quot;icon&quot;</code> は同時に指定できます（shoulderは上、iconは見出し行の先頭）。
          </p>
          <p style="margin: 0 0 12px;">
            <code>chip</code> と <code>rule</code> は装飾（意匠）です。情報の唯一の手掛かりにしないでください。
          </p>
          <p style="margin: 0 0 12px;">
            例: <code>&lt;dads-heading chip&gt;...&lt;/dads-heading&gt;</code> / <code>&lt;dads-heading rule=&quot;6&quot;&gt;...&lt;/dads-heading&gt;</code>
          </p>
          <p style="margin: 0;">
            アイコンが意味を持たない場合は、利用側で <code>aria-hidden=&quot;true&quot;</code> を付与するなど、読み上げへの影響に注意してください。
          </p>
        </div>
      </section>

      <!-- マージン付き作例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">上マージン付き作例（margin="top"）</h3>
        <div style="display: grid; gap: 28px;">
          <div>
            <p style="margin: 0; color: #666;">前段テキスト（size=45）</p>
            <dads-heading size="45" margin="top">大見出し（45）</dads-heading>
            <p style="margin: 0; color: #666;">後段テキスト</p>
          </div>
          <div>
            <p style="margin: 0; color: #666;">前段テキスト（size=32）</p>
            <dads-heading size="32" margin="top">中見出し（32）</dads-heading>
            <p style="margin: 0; color: #666;">後段テキスト</p>
          </div>
          <div>
            <p style="margin: 0; color: #666;">前段テキスト（size=28）</p>
            <dads-heading size="28" margin="top">小見出し（28）</dads-heading>
            <p style="margin: 0; color: #666;">後段テキスト</p>
          </div>
          <div>
            <p style="margin: 0; color: #666;">前段テキスト（size=24）</p>
            <dads-heading size="24" margin="top">小見出し（24）</dads-heading>
            <p style="margin: 0; color: #666;">後段テキスト</p>
          </div>
        </div>
      </section>
    </div>

    <script type="module">
      await Promise.all([import('dads-heading'), import('dads-select'), import('a11y-annotate')]);

      const presetSelect = document.querySelector('#heading-a11y-variant');
      const heading = document.querySelector('#heading-a11y-target');
      if (presetSelect && heading) {
        const ensureShoulder = () => {
          const span = document.createElement('span');
          span.setAttribute('slot', 'shoulder');
          span.textContent = 'カテゴリ';
          heading.insertBefore(span, heading.firstChild);
        };

        const ensureIcon = () => {
          heading.insertAdjacentHTML('afterbegin', ${JSON.stringify(CHIP_LABEL_ICON_SVG)});
        };

        const sync = (preset) => {
          heading.removeAttribute('chip');
          heading.querySelectorAll('[slot="shoulder"], [slot="icon"]').forEach((n) => n.remove());

          if (preset === 'chip') {
            heading.setAttribute('chip', '');
          } else if (preset === 'shoulder') {
            ensureShoulder();
          } else if (preset === 'shoulder-chip') {
            heading.setAttribute('chip', '');
            ensureShoulder();
          } else if (preset === 'icon') {
            ensureIcon();
          }
        };

        sync(presetSelect.getAttribute('value') || 'default');
        presetSelect.addEventListener('dads-change', (e) => {
          const next = e?.detail?.value || presetSelect.getAttribute('value') || 'default';
          sync(String(next));
        });
      }
    </script>
  `
