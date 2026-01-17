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
