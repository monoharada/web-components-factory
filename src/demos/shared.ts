/**
 * コンポーネントのデモマークアップ定義
 * autoloaderと組み合わせて使用される
 */
import { createIconWithSlot, iconPaths } from '../../packages/utils/icons.js';

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

function apiPanelInitScript(imports: readonly string[]): string {
  const lines = imports
    .map((specifier) => `                import('${specifier}')`)
    .join(',\n');

  return `
    <script>
      (function() {
        var currentScript = document.currentScript;
        Promise.all([
${lines}
        ]).then(function(mods) {
          var root = currentScript?.parentElement;
          if (!root || !root.isConnected) return;
          var api = mods[mods.length - 1];
          if (api && api.bindApiControls) api.bindApiControls(root);
        });
      })();
    <\/script>
  `;
}

function modulePreloadScript(imports: readonly string[]): string {
  const calls = imports.map((specifier) => `import('${specifier}')`).join(', ');
  return `
    <script type="module">
      await Promise.all([${calls}]);
    <\/script>
  `;
}

const API_PANEL_BASE_IMPORTS = [
  'dads-button',
  'dads-table',
  'dads-switch',
  'dads-input-text',
  'dads-code-block',
  'dads-disclosure',
] as const;

const API_PANEL_API_MODULE = './src/viewer-api-controls.js';

function apiPanelImports(imports: readonly string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  const add = (specifier: string) => {
    if (seen.has(specifier)) return;
    seen.add(specifier);
    out.push(specifier);
  };

  for (const specifier of imports) add(specifier);
  for (const specifier of API_PANEL_BASE_IMPORTS) add(specifier);
  add(API_PANEL_API_MODULE);

  return out;
}

type ApiPanelWrapperOptions = Readonly<{
  body: string;
  imports?: readonly string[];
  footer?: string;
  rootAttrs?: string;
}>;

function renderApiPanelWrapper(options: ApiPanelWrapperOptions): string {
  const imports = options.imports ?? [];
  const footer = options.footer ?? '';
  const rootAttrs = options.rootAttrs ? ` ${options.rootAttrs}` : '';
  return `
        <div class="wc-api-panel"${rootAttrs}>
          <div class="wc-api-panel__header">
            <div class="wc-api-panel__title">Controls</div>
            <dads-button data-api-reset type="button" variant="outlined" size="small">Reset</dads-button>
          </div>

          <div class="wc-api-panel__body">
${options.body}
          </div>

          ${apiPanelInitScript(apiPanelImports(imports))}
${footer}
        </div>
  `;
}

const API_TABLE_PROPS_HEADER = `
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Kind</th>
      <th scope="col">Default</th>
      <th scope="col">Control</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
`;

const API_TABLE_PROPS_WITH_TYPE_HEADER = `
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
`;

const API_TABLE_CSS_VARS_HEADER = `
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Default</th>
      <th scope="col">Value</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
`;

const API_TABLE_CSS_VARS_NOTE = `
  <p class="wc-api-panel__section-note">
    ※ 空にすると <code>style.removeProperty()</code> で元のトークン値に戻ります。
  </p>
`;

const CHIP_LABEL_ICON_SVG = createIconWithSlot('dummy', 'icon', 24);

const HEADING_ICON_PATH_OPTIONS = [
  { label: 'dummy', value: iconPaths.dummy },
  { label: 'search', value: iconPaths.search },
  { label: 'checkmark', value: iconPaths.checkmark },
  { label: 'edit', value: iconPaths.edit },
  { label: 'download', value: iconPaths.download },
  { label: 'duplicate', value: iconPaths.duplicate },
  { label: 'delete', value: iconPaths.delete },
  { label: 'caret', value: iconPaths.caret },
  { label: 'externalLink', value: iconPaths.externalLink },
] as const;

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

function repeat(text: string, count: number): string {
  const arr: string[] = [];
  for (let i = 0; i < count; i++) arr.push(text);
  return arr.join('\n');
}

/** @deprecated Use repeat() instead */
const repeatLines = repeat;
/** @deprecated Use repeat() instead */
const repeatBlocks = repeat;

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

export {
  annotationToggleScript,
  annotationToggleUI,
  modulePreloadScript,
  renderApiPanelWrapper,
  API_TABLE_PROPS_HEADER,
  API_TABLE_PROPS_WITH_TYPE_HEADER,
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  CHIP_LABEL_ICON_SVG,
  HEADING_ICON_PATH_OPTIONS,
  renderAllChipLabels,
  repeat,
  repeatLines,
  repeatBlocks,
  MENU_LIST_BOX_PLAIN_ITEMS_3,
  menuListBoxNumberedItems,
  MENU_LIST_BOX_DUMMY_START_ICON_SVG,
  MENU_LIST_BOX_OPENER_ICON,
  menuListItemStartIcon,
  menuListBoxDescriptionItems,
  dadsColHeaderLine,
  dadsColHeaderLines,
  dadsHeaderRow,
  dadsDataCellLines,
  dadsDataRow,
  dadsDataRows,
  dadsRowHeaderRow,
  dadsRowHeaderRows,
  CARD_APPLICATION_STEPS,
  CARD_APPLICATION_STEPS_EXTENDED,
  renderStepNavigationItems,
};
