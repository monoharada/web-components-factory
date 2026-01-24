# Web Components コンポーネント雛形（追加手順）

**タグ**: #webcomponents #css #architecture #accessibility #testing

このリポジトリで新しいコンポーネントを追加する時の「最小の型」をまとめます。  
（DADS準拠・トークン設計・a11y注釈・viewerデモ・E2Eまでを含む）

---

## 1. 追加するファイル（最小構成）

### `packages/components/<component>/`

- `<component>.ts`：本体（template/styles/attributes/behavior）
- `<component>-tokens.ts`：トークン（semantic → local `--dads-*`）
- `<component>-styles.ts`：スタイル（`part` + CSS vars）
- `<component>-define.ts`：define関数（依存コンポーネントもここで定義）
- `index.ts`：export集約
- `<component>.test.ts`：Vitest（基本操作/イベント/ARIA など）
- `<component>.stories.ts`：Storybook（必要な場合）

### `packages/autoload/dads/<component>.ts`

Autoloader用アダプタ（importされるとdefineされる）。

### `src/demos.ts` + `viewer.html`

viewerで確認するためのデモ定義とセレクタ追加。

---

## 2. コンポーネント本体（雛形）

### 本体（例）

```ts
import { html, css, PropertyAttr, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { componentTokens } from './component-tokens.js';
import { componentStyles } from './component-styles.js';

export class DadsComponent extends TypographyWebComponent {
  static definition = {
    name: 'dads-component',
    template: html`
      <div part="base">
        <slot></slot>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), componentTokens, componentStyles], 'minimal'),
    attributes: [
      PropertyAttr('variant'),
      BooleanAttr('disabled'),
    ],
  };

  declare variant: string | null;
  declare disabled: boolean;
}
```

**ポイント**
- Shadow DOM内のスタイリングAPIは **`part` と CSS vars**（クラスに依存しない）。
- 状態は **属性** で表す（例: `[open]` / `[disabled]` / `[variant="..."]`）。
- `withReset([...], 'minimal')` の並びは、基本的に  
  `DADS tokens → spacing → component tokens → component styles` を踏襲。

---

## 3. トークン設計（semantic → local）

### 3層（実装は2ファイルでもOK）

```
Primitive（グローバル） → Semantic（意味） → Local（--dads-* API） → CSS properties
```

### tokensファイル（例）

```ts
import { css } from '../../core/web-components.js';

const semantic = `
  :host {
    --component-bg: var(--color-neutral-white, #fff);
  }
`;

const local = `
  :host {
    --dads-component-background: var(--component-bg);
  }
`;

export const componentTokens = css`
  ${semantic}
  ${local}
`;
```

**ポイント**
- `--dads-*` が「外部に公開するAPI」。
- CSSプロパティ（`background-color`等）へのマッピングは **1箇所に集約**し、状態差分は **変数の再代入**で表現する（重複定義しない）。
- 詳細は `docs/css-variable-pattern.md` / `css-writing-rules` を参照。

---

## 4. define関数（依存もここで）

```ts
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig, getPrefix } from '../../config.js';
import { DadsComponent } from './component.js';

export function defineComponent(prefix?: string, registry?: CustomElementRegistry): void {
  const effectivePrefix = prefix ?? getPrefix();
  const effectiveRegistry = registry ?? getConfig().registry;

  // dependencies（例）
  // defineOther(effectivePrefix, effectiveRegistry);

  const name = `${effectivePrefix}-component`;
  if (effectiveRegistry.get(name)) return;

  const def = { ...DadsComponent.definition, name, registry: effectiveRegistry };
  WebComponentDefinition.compose(DadsComponent, def).define(effectiveRegistry);
}

export function defineDefaultComponent(): void {
  defineComponent();
}
```

---

## 5. Autoloaderアダプタ

`packages/autoload/dads/<component>.ts`

```ts
import { DadsComponent, defineComponent } from '../../components/component/index.js';

defineComponent();

export default DadsComponent;
```

**ポイント**
- `viewer.html` の importmap は `dads-xxx`（モジュール名）→ `/@components/dads/xxx.js` を解決し、  
  `server.ts` が `/@components/` を `packages/autoload/` にマップして配信する。

---

## 6. a11yAnnotations（categories + callouts）

### 追加方針
- `categories` は「仕様メモ」（パネルに出る）
- `callouts` は「コールアウト」（画面上のマーカー）
- **インタラクティブなコンポーネントは callout を最低1つ**用意するとデモ/レビューがやりやすい

### calloutの例（shadow内partをターゲット）

```ts
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

static readonly a11yAnnotations: A11yAnnotations = {
  version: 1,
  summary: '...',
  categories: { semantics: ['...'], keyboard: ['...'] },
  callouts: [
    {
      id: 'trigger',
      title: 'trigger',
      description: '...',
      target: { scope: 'shadow', selector: '[part=\"trigger\"]' },
      placement: 'top-left',
    },
  ],
};
```

**注意**
- `a11y-annotate` はターゲット要素の `constructor.a11yAnnotations` を読み取るため、viewerデモでは **targetのimport/defineが先**になるようにする（import順でレースが起きうる）。
- デモ実装パターンは `docs/knowledge/a11y-annotate-demo-patterns.md` を参照。

---

## 7. viewerデモ（人間向け / Fidelity分離）

### 基本方針
- 人間向け: `<componentName>`
- E2E/Figma向け（ID安定性最優先）: `<componentName>Fidelity`

### `src/demos.ts` の追加ポイント
- Overview / A11y / API Controls / Examples の章立て（推奨）
- `data-api-target` + `data-api-attr|prop|css-var` でライブ編集可能にする

### `viewer.html` のセレクタ

```html
<option value="componentName">Component Name</option>
<option value="componentNameFidelity">Component Name (Fidelity)</option>
```

---

## 8. API Controls（CSS vars含む）

- `src/viewer-api-controls.ts` が `data-api-css-var` をサポートする
- CSS varsを「API」として見せるなら、**入力UIに `data-api-css-var` を必ず付ける**

関連: `docs/knowledge/viewer-api-controls-table.md`

---

## 9. テスト（unit / e2e）

### unit（Vitest）
- `tests/setup` の `renderWebComponent` / `waitForCustomElement` を使う
- 最低限: open/close、ARIA更新、イベント発火、フォーカス挙動

### e2e（Playwright）
- `e2e-evidence/` に Fidelityテストを置く（viewerの `component=...Fidelity` を参照）
- Figma overlay等の外部依存は **存在チェックしてskip** できるようにする

---

## 10. 最終チェックリスト

- [ ] `part` がスタイリングAPIになっている（クラス依存しない）
- [ ] 状態は属性で表現している（状態クラスを作らない）
- [ ] `--dads-*` のlocal tokensが揃っている（外部override可能）
- [ ] a11yAnnotations（categories）を記載している
- [ ] calloutが最低1つある（インタラクティブ要素）
- [ ] viewerデモが `componentName` / `componentNameFidelity` に分離されている
- [ ] CSS vars が `data-api-css-var` で編集できる
- [ ] unit / e2e が最小限揃っている

---

## 関連ドキュメント

- `docs/knowledge/a11y-annotate-demo-patterns.md`
- `docs/knowledge/viewer-api-controls-table.md`
- `docs/knowledge/e2e-evidence-guide.md`
- `docs/css-variable-pattern.md`
- `docs/showcase-template.md`

