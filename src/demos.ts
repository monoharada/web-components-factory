/**
 * コンポーネントのデモマークアップ定義
 * autoloaderと組み合わせて使用される
 */
import { createIconWithSlot } from '../packages/utils/icons.js';

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

const CHIP_LABEL_ICON_SVG = createIconWithSlot('dummy', 'icon', 24);

function renderAllChipLabels(): string {
  const variants = ["text", "outline", "filled-outline", "fill"] as const;
  const colors = [
    "gray",
    "blue",
    "light-blue",
    "cyan",
    "green",
    "lime",
    "yellow",
    "orange",
    "red",
    "magenta",
    "purple",
  ] as const;

  let out = "";
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
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `${i === 0 ? "" : "\n"}${line}`;
  }
  return out;
}

function repeatBlocks(block: string, count: number): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `${i === 0 ? "" : "\n"}${block}`;
  }
  return out;
}

const MENU_LIST_BOX_PLAIN_ITEMS_3 = repeatBlocks(
  "            <dads-menu-list-item>リストアイテム</dads-menu-list-item>",
  3,
);

function menuListBoxNumberedItems(count: number): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `${i === 0 ? "" : "\n"}            <dads-menu-list-item>リストアイテム${i + 1}</dads-menu-list-item>`;
  }
  return out;
}

const MENU_LIST_BOX_DUMMY_START_ICON_SVG = `              ${createIconWithSlot('dummy', 'start-icon', 20)}`;

// トリガーボタン用のアイコン（slot="icon"）
const MENU_LIST_BOX_OPENER_ICON = createIconWithSlot('dummy', 'icon', 24);

// メニューアイテム用のスタートアイコン（slot="start-icon"）
function menuListItemStartIcon(iconName: Parameters<typeof createIconWithSlot>[0]): string {
  return `
              ${createIconWithSlot(iconName, 'start-icon', 20)}`
}

function menuListBoxDescriptionItems(count: number): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    const value = String(i + 1);
    const current = i === 0 ? " current" : "";
    const labelStyle = i === 0 ? "" : ' style="font-weight: var(--font-weight-600, 600);"';
    out += `${i === 0 ? "" : "\n\n"}            <dads-menu-list-item${current} data-value="${value}">
${MENU_LIST_BOX_DUMMY_START_ICON_SVG}              <span style="display: flex; flex-direction: column; gap: var(--spacing-0-5, 2px);">
                <span${labelStyle}>リストアイテム</span>
                <span style="font-weight: var(--font-weight-400, 400); font-size: var(--font-size-14, 0.875rem); color: var(--color-neutral-solid-gray-536, #666);">ディスクリプション</span>
              </span>
            </dads-menu-list-item>`;
  }
  return out;
}

function dadsColHeaderLine(label = "ラベル", attrs?: string): string {
  return `                  <th class="dads-table__col-header" scope="col"${attrs ? ` ${attrs}` : ""}>${label}</th>`;
}

function dadsColHeaderLines(count: number, label = "ラベル"): string {
  return repeatLines(dadsColHeaderLine(label), count);
}

function dadsHeaderRow(colCount: number, label = "ラベル"): string {
  return `                <tr>\n${dadsColHeaderLines(colCount, label)}\n                </tr>`;
}

function dadsDataCellLines(count: number, text = "データ"): string {
  return repeatLines(`                  <td>${text}</td>`, count);
}

function dadsDataRow(colCount: number, text = "データ"): string {
  return `                <tr>\n${dadsDataCellLines(colCount, text)}\n                </tr>`;
}

function dadsDataRows(
  rowCount: number,
  colCount: number,
  text = "データ",
): string {
  return repeatBlocks(dadsDataRow(colCount, text), rowCount);
}

function dadsRowHeaderRow(
  colCount: number,
  headerText = "データ",
  cellText = "データ",
): string {
  return `                <tr>\n                  <th class="dads-table__row-header" scope="row">${headerText}</th>\n${dadsDataCellLines(colCount - 1, cellText)}\n                </tr>`;
}

function dadsRowHeaderRows(
  rowCount: number,
  colCount: number,
  headerText = "データ",
  cellText = "データ",
): string {
  return repeatBlocks(
    dadsRowHeaderRow(colCount, headerText, cellText),
    rowCount,
  );
}

type StepDefinition = {
  title: string;
  description?: string;
};

const CARD_APPLICATION_STEPS: readonly StepDefinition[] = [
  {
    title: '基本情報入力',
    description: '氏名・生年月日・住所など、申請に必要な基本情報を入力します。',
  },
  {
    title: '利用規約の確認',
    description: '本サービスの利用規約を確認し、同意します。',
  },
  {
    title: '本人確認',
    description: '身分証明書などを用いて本人確認を行います。',
  },
  {
    title: '顔写真の登録',
    description: 'カードに印字される顔写真を撮影またはアップロードします。',
  },
  {
    title: '申請情報の入力',
    description: '受取方法や交付場所など、申請に関する詳細情報を入力します。',
  },
  {
    title: '申請情報の確認',
    description: '入力内容を確認し、間違いがなければ申請を完了します。',
  },
] as const;

const CARD_APPLICATION_STEPS_EXTENDED: readonly StepDefinition[] = [
  ...CARD_APPLICATION_STEPS,
  {
    title: '送付先住所の設定',
  },
  {
    title: '提出',
  },
] as const;

type StepNavigationItemRenderOptions = {
  steps: readonly StepDefinition[];
  includeTitle?: boolean;
  includeDescription?: boolean;
  currentStep?: number; // 1-based
  interaction?: 'button';
  states?: readonly (string | undefined)[];
  hrefForIndex?: (index: number) => string | undefined;
};

function renderStepNavigationItems(options: StepNavigationItemRenderOptions): string {
  const {
    steps,
    includeTitle = true,
    includeDescription = false,
    currentStep,
    interaction,
    states,
    hrefForIndex,
  } = options;

  return steps
    .map((step, index) => {
      const attrs: string[] = [];
      const state = states?.[index];
      if (state) attrs.push(`state="${state}"`);
      if (currentStep === index + 1) attrs.push('aria-current="step"');
      const href = hrefForIndex?.(index);
      if (href) attrs.push(`href="${href}"`);
      if (interaction) attrs.push(`interaction="${interaction}"`);
      const attrText = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';

      const title = includeTitle ? `<span>${step.title}</span>` : '';
      const description =
        includeDescription && step.description
          ? `<span slot="description">${step.description}</span>`
          : '';

      return `
        <dads-step-navigation-item${attrText}>
          ${title}
          ${description}
        </dads-step-navigation-item>
      `;
    })
    .join('');
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
                import('dads-code-block'),
                import('/src/viewer-api-controls.js')
              ]).then(function(mods) {
                var root = currentScript?.parentElement;
                if (!root || !root.isConnected) return;
                var api = mods[5];
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

        <div class="wc-api-panel">
          <div class="wc-api-panel__header">
            <div class="wc-api-panel__title">Controls</div>
            <dads-button data-api-reset type="button" variant="outlined" size="small">Reset</dads-button>
          </div>

	          <div class="wc-api-panel__body">
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
                <p class="wc-api-panel__section-note">
                  ※ 空にすると <code>style.removeProperty()</code> で元のトークン値に戻ります。
                </p>
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
          </div>

	          <script>
	            (function() {
	              var currentScript = document.currentScript;
	              Promise.all([
	                import('dads-search-box'),
	                import('dads-button'),
	                import('dads-table'),
	                import('dads-switch'),
	                import('dads-input-text'),
	                import('dads-code-block'),
	                import('/src/viewer-api-controls.js')
	              ]).then(function(mods) {
	                var root = currentScript?.parentElement;
	                if (!root || !root.isConnected) return;
	
	                var api = mods[6];
	                if (api && api.bindApiControls) api.bindApiControls(root);

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
                    '<option value="">すべて</option>' +
                      '<option value="images">画像</option>' +
                      '<option value="files">ファイル</option>'
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
          <\/script>
        </div>
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

  selectValidation: () => `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <h2 style="font-size: 24px; margin-bottom: 20px; color: #333;">Select Validation Test</h2>
      <p style="color: #666; margin-bottom: 30px;">
        auto-validate属性による必須バリデーション機能のテスト（セレクトボックス）
      </p>

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
    </div>

    <script type="module">
      await Promise.all([import('dads-select'), import('dads-button')]);
      const form = document.getElementById('select-validation-form');
      if (form) form.addEventListener('submit', (e) => e.preventDefault());
    </script>
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

  menuList: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">メニューリスト</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS準拠のメニューリスト（hover / focus / current / expanded / indentation）。
      </p>

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

        <div class="wc-api-panel">
          <div class="wc-api-panel__header">
            <div class="wc-api-panel__title">Controls</div>
            <dads-button data-api-reset type="button" variant="outlined" size="small">Reset</dads-button>
          </div>

          <div class="wc-api-panel__body">
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

            <!-- 3.2 Attributes / Properties -->
            <div class="wc-api-panel__section">
              <h4 class="wc-api-panel__section-title">Attributes / Properties</h4>
              <dads-table>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">属性</th>
                      <th scope="col">型</th>
                      <th scope="col">初期値</th>
                      <th scope="col">値</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>size</code></td>
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
                    </tr>
                    <tr>
                      <td><code>variant</code></td>
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
                    </tr>
                    <tr>
                      <td><code>bold</code></td>
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
                    </tr>
                    <tr>
                      <td><code>label</code></td>
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
                    </tr>
                    <tr>
                      <td><code>open</code></td>
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
                    </tr>
                  </tbody>
                </table>
              </dads-table>
            </div>

            <!-- 3.3 CSS Variables -->
            <div class="wc-api-panel__section">
              <h4 class="wc-api-panel__section-title">CSS Variables</h4>
              <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                <code>--dads-menu-list-box-*</code> で外部からスタイルをカスタマイズできます。空にするとトークン初期値に戻ります。
              </p>

              <!-- Opener 関連 -->
              <details style="margin-bottom: 16px;" open>
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px; color: #555;">Opener（トリガーボタン）</summary>
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
                        <td><code>--dads-menu-list-box-min-width</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="min-width" value="" data-api-css-var="--dads-menu-list-box-min-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>全体最小幅（auto）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-min-height</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="min-height" value="" data-api-css-var="--dads-menu-list-box-opener-min-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小高さ（36px/44px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-padding-x</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="padding-x" value="" data-api-css-var="--dads-menu-list-box-opener-padding-x" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>水平パディング（4px/16px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-padding-y</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="padding-y" value="" data-api-css-var="--dads-menu-list-box-opener-padding-y" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>垂直パディング（4px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-gap</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="gap" value="" data-api-css-var="--dads-menu-list-box-opener-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>要素間ギャップ（4px/8px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-border-radius</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="border-radius" value="" data-api-css-var="--dads-menu-list-box-opener-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸（8px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-background</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="background" value="" data-api-css-var="--dads-menu-list-box-opener-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色（transparent）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-border-width</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="border-width" value="" data-api-css-var="--dads-menu-list-box-opener-border-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー幅（0/1px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-border-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="border-color" value="" data-api-css-var="--dads-menu-list-box-opener-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色（transparent）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-font-weight</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="font-weight" value="" data-api-css-var="--dads-menu-list-box-opener-font-weight" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォントウェイト（400/700）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-hover-background</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="hover-background" value="" data-api-css-var="--dads-menu-list-box-opener-hover-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー時背景（gray-50）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-hover-border-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="hover-border-color" value="" data-api-css-var="--dads-menu-list-box-opener-hover-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー時ボーダー（black）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-icon-size</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="icon-size" value="" data-api-css-var="--dads-menu-list-box-opener-icon-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコンサイズ（20px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-arrow-size</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="arrow-size" value="" data-api-css-var="--dads-menu-list-box-opener-arrow-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印サイズ（16px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-arrow-margin-top</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="arrow-margin-top" value="" data-api-css-var="--dads-menu-list-box-opener-arrow-margin-top" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印上マージン（4px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-arrow-margin-left</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="arrow-margin-left" value="" data-api-css-var="--dads-menu-list-box-opener-arrow-margin-left" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>矢印左マージン（0）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-opener-underline-offset</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="underline-offset" value="" data-api-css-var="--dads-menu-list-box-opener-underline-offset" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>下線オフセット（3px）</td>
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
                        <td><code>--dads-menu-list-box-divider-color</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="divider-color" value="" data-api-css-var="--dads-menu-list-box-divider-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り線色（gray-420 42%）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-divider-margin-block</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="divider-margin-block" value="" data-api-css-var="--dads-menu-list-box-divider-margin-block" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り線上下余白（16px）</td>
                      </tr>
                      <tr>
                        <td><code>--dads-menu-list-box-divider-margin-inline</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="divider-margin-inline" value="" data-api-css-var="--dads-menu-list-box-divider-margin-inline" data-default=""></dads-input-text>
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
          </div>

	          <script>
	            (function() {
	              var currentScript = document.currentScript;
	              Promise.all([
	                import('dads-menu-list-box'),
	                import('dads-table'),
	                import('dads-switch'),
	                import('dads-input-text'),
	                import('dads-button'),
	                import('dads-code-block'),
	                import('/src/viewer-api-controls.js')
	              ]).then(function(mods) {
	                var root = currentScript?.parentElement;
	                if (!root || !root.isConnected) return;
	                var api = mods[6];
	                if (api && api.bindApiControls) api.bindApiControls(root);
	              });
	            })();
	          <\/script>
	        </div>
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
              <hr />
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
          import('dads-switch'),
          import('dads-button'),
          import('dads-input-text'),
          import('dads-table'),
          import('a11y-annotate')
        ]);
      </script>
    </div>
  `,

  /**
   * Menu List Box - Fidelity Tests (E2E/Figma検証用)
   * ID安定性を優先。ショーケースとは分離。
   */
  menuListBoxFidelity: () => `
    <div style="padding: 40px; max-width: 960px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">Menu List Box - Fidelity Tests</h2>
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

            <hr />

            <dads-menu-list-item
              data-value="category-2"
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>

            <dads-menu-list-item data-value="item-3">リストアイテム</dads-menu-list-item>
            <dads-menu-list-item current data-value="checked">${menuListItemStartIcon('checkmark')}リストアイテム</dads-menu-list-item>

            <hr />

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
            <hr />
            <dads-menu-list-item
              style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);"
            >
              ${MENU_LIST_BOX_DUMMY_START_ICON_SVG}
              カテゴリータイトル
            </dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <dads-menu-list-item>リストアイテム</dads-menu-list-item>
            <hr />
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
            <hr />
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

      <script type="module">
        await Promise.all([
          import('dads-menu-list-box')
        ]);
      </script>
    </div>
  `,

  stepNavigation: () => `
    <div class="demo-step-navigation" style="padding: 40px; max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ステップナビゲーション</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム（DADS）HTML版 step-navigation.css と同一の見た目になるよう実装したWeb Components版です。
      </p>

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

        <div class="wc-api-panel">
          <div class="wc-api-panel__header">
            <div class="wc-api-panel__title">Controls</div>
            <dads-button data-api-reset type="button" variant="outlined" size="small">Reset</dads-button>
          </div>

          <div class="wc-api-panel__body">
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
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Attrs</h4>
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
                        <th scope="row"><code>type</code></th>
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
                import('dads-page-navigation'),
                import('dads-table'),
                import('dads-switch'),
                import('dads-input-text'),
                import('dads-button'),
                import('/src/viewer-api-controls.js')
              ]).then(function(mods) {
                var root = currentScript?.parentElement;
                if (!root || !root.isConnected) return;
                var api = mods[5];
                if (api && api.bindApiControls) api.bindApiControls(root);
              });
            })();
          <\/script>
        </div>
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

  empty: () => `
    <div style="padding: 40px; text-align: center; color: #666;">
      コンポーネントを選択してください
    </div>
  `,
};

export type DemoName = keyof typeof demos;
