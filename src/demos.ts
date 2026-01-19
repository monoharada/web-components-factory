/**
 * コンポーネントのデモマークアップ定義
 * autoloaderと組み合わせて使用される
 */

/**
 * アクセシビリティ注釈の表示切り替えスクリプト
 * 各デモで共通して使用される
 */
function annotationToggleScript(): string {
  return `
    <script>
      // 注釈表示切り替え機能（mode属性でコールアウトをトグル）
      // IIFE でスコープを分離（activateEmbeddedScripts での再実行時の変数衝突を防ぐ）
      (function() {
        // 重要: document.currentScript は同期で捕捉する（then内だとnullになりうる）
        var currentScript = document.currentScript;
        customElements.whenDefined('dads-switch').then(function() {
          var root = currentScript?.parentElement;
          if (!root || !root.isConnected) return;

          var toggle = root.querySelector('[data-annotation-toggle]');
          if (!toggle) return;

          var updateAnnotations = function() {
            var isChecked = toggle.hasAttribute('checked');
            var annotations = root.querySelectorAll('a11y-annotate');
            for (var i = 0; i < annotations.length; i++) {
              // mode="both" でコールアウト表示、mode="panel" でパネルのみ
              annotations[i].setAttribute('mode', isChecked ? 'both' : 'panel');
            }
          };

          toggle.addEventListener('dads-change', updateAnnotations);
          updateAnnotations();
        });
      })();
    <\/script>
  `;
}

/**
 * 注釈表示切り替えUIコンポーネント
 */
function annotationToggleUI(): string {
  return `
    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding: 16px; background: #f0f4f8; border-radius: 8px;">
      <span style="font-weight: 600; color: #333;">アクセシビリティ注釈:</span>
      <dads-switch data-annotation-toggle checked>
        <span slot="label-left">非表示</span>
        <span slot="label-right">表示</span>
      </dads-switch>
    </div>
  `;
}

const CHIP_LABEL_ICON_SVG = `
  <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
    <path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z"/>
  </svg>
`;

function renderAllChipLabels(): string {
  const variants = ['text', 'outline', 'filled-outline', 'fill'] as const;
  const colors = [
    'gray',
    'blue',
    'light-blue',
    'cyan',
    'green',
    'lime',
    'yellow',
    'orange',
    'red',
    'magenta',
    'purple',
  ] as const;

  let out = '';
  for (const variant of variants) {
    for (const color of colors) {
      out += `
        <dads-chip-label variant="${variant}" color="${color}">
          ${CHIP_LABEL_ICON_SVG}
          ラベル
        </dads-chip-label>
      `;
    }
  }
  return out;
}

function repeatLines(line: string, count: number): string {
  let out = '';
  for (let i = 0; i < count; i++) {
    out += `${i === 0 ? '' : '\n'}${line}`;
  }
  return out;
}

function repeatBlocks(block: string, count: number): string {
  let out = '';
  for (let i = 0; i < count; i++) {
    out += `${i === 0 ? '' : '\n'}${block}`;
  }
  return out;
}

function dadsColHeaderLine(label = 'ラベル', attrs?: string): string {
  return `                  <th class="dads-table__col-header" scope="col"${attrs ? ` ${attrs}` : ''}>${label}</th>`;
}

function dadsColHeaderLines(count: number, label = 'ラベル'): string {
  return repeatLines(dadsColHeaderLine(label), count);
}

function dadsHeaderRow(colCount: number, label = 'ラベル'): string {
  return `                <tr>\n${dadsColHeaderLines(colCount, label)}\n                </tr>`;
}

function dadsDataCellLines(count: number, text = 'データ'): string {
  return repeatLines(`                  <td>${text}</td>`, count);
}

function dadsDataRow(colCount: number, text = 'データ'): string {
  return `                <tr>\n${dadsDataCellLines(colCount, text)}\n                </tr>`;
}

function dadsDataRows(rowCount: number, colCount: number, text = 'データ'): string {
  return repeatBlocks(dadsDataRow(colCount, text), rowCount);
}

function dadsRowHeaderRow(colCount: number, headerText = 'データ', cellText = 'データ'): string {
  return `                <tr>\n                  <th class="dads-table__row-header" scope="row">${headerText}</th>\n${dadsDataCellLines(colCount - 1, cellText)}\n                </tr>`;
}

function dadsRowHeaderRows(rowCount: number, colCount: number, headerText = 'データ', cellText = 'データ'): string {
  return repeatBlocks(dadsRowHeaderRow(colCount, headerText, cellText), rowCount);
}

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

    <script type="module">
      await Promise.all([import('dads-blockquote'), import('dads-switch')]);
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
  `,

  resetCss: () => `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 30px; color: #333;">リセットCSS比較デモ</h2>

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

      <!-- 基本 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本</h3>
        <div style="max-width: 500px;">
          <dads-textarea
            label="お問い合わせ内容"
            placeholder="内容を入力してください"
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
          <dads-textarea label="Small" size="sm" placeholder="小サイズ"></dads-textarea>
          <dads-textarea label="Medium（デフォルト）" size="md" placeholder="中サイズ"></dads-textarea>
          <dads-textarea label="Large" size="lg" placeholder="大サイズ"></dads-textarea>
        </div>
      </section>

      <!-- 行数 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">行数</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea label="3行（デフォルト）" rows="3" placeholder="デフォルトの行数"></dads-textarea>
          <dads-textarea label="5行" rows="5" placeholder="5行表示"></dads-textarea>
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
                placeholder="件名を入力してください"
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box;"
              >
            </div>

            <dads-textarea
              label="お問い合わせ内容"
              support-text="具体的な内容をご記入ください（500文字以内）"
              required
              show-counter
              maxlength="500"
              rows="5"
              placeholder="ご質問やご要望をお書きください"
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

        <div class="wc-api-panel">
          <div class="wc-api-panel__header">
            <div class="wc-api-panel__title">Controls</div>
            <dads-button data-api-reset type="button" variant="outlined" size="small">Reset</dads-button>
          </div>

          <div class="wc-api-panel__body">
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-button
                  data-api-target
                  variant="solid"
                  size="medium"
                >ボタンテキスト</dads-button>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Kind</th>
                        <th scope="col">Type</th>
                        <th scope="col">Default</th>
                        <th scope="col">Control</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
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
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Default</th>
                        <th scope="col">Value</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
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
                <p class="wc-api-panel__section-note">
                  ※ 空にすると <code>style.removeProperty()</code> で元のトークン値に戻ります。
                </p>
              </div>
            </div>
          </div>

          <script>
            (function() {
              var currentScript = document.currentScript;
              Promise.all([
                import('dads-button'),
                import('dads-table'),
                import('dads-switch'),
                import('dads-input-text'),
                import('/src/viewer-api-controls.js')
              ]).then(function(mods) {
                var root = currentScript?.parentElement;
                if (!root || !root.isConnected) return;
                var api = mods[4];
                if (api && api.bindApiControls) api.bindApiControls(root);
              });
            })();
          <\/script>
        </div>
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
                placeholder="example@email.com"
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"
              >
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

  textareaValidation: () => `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <h2 style="font-size: 24px; margin-bottom: 20px; color: #333;">Textarea Validation Test</h2>
      <p style="color: #666; margin-bottom: 30px;">
        auto-validate属性による自動バリデーション機能のテスト
      </p>

      <form id="validation-form">
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
          <dads-button variant="outlined" type="button" onclick="this.closest('form').reset()">リセット</dads-button>
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
    </div>
  `,

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

    <script type="module">
      await Promise.all([import('dads-calendar'), import('dads-switch'), import('a11y-annotate')]);
    </script>
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

    <script type="module">
      await Promise.all([import('dads-date-picker'), import('dads-calendar'), import('dads-fieldset'), import('dads-switch'), import('a11y-annotate')]);
    </script>
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

  inputTextValidation: () => `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <h2 style="font-size: 24px; margin-bottom: 20px; color: #333;">Input Text Validation Test</h2>
      <p style="color: #666; margin-bottom: 30px;">
        auto-validate属性による自動バリデーション機能のテスト（必須バリデーション + Emailフォーマット検証）
      </p>

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
    </div>
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
${repeatLines(dadsColHeaderLine('親ラベル', 'colspan="3"'), 2)}
                </tr>
                <tr>
${dadsColHeaderLines(6, '子ラベル')}
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

  empty: () => `
    <div style="padding: 40px; text-align: center; color: #666;">
      コンポーネントを選択してください
    </div>
  `
};

export type DemoName = keyof typeof demos;
