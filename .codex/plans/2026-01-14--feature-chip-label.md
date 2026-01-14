# チップラベル（`dads-chip-label`）追加

## Context
- DADS HTML版（PR-95 Storybook）にある「チップラベル」を、このリポジトリの Web Components として提供したい
- `viewer.html`（Autoloader + Import Maps）で閲覧できるようにしたい
- 他コンポーネントと同様に a11y-annotate 用のアクセシビリティ注釈（`a11yAnnotations`）を付与したい

## Scope
- やること
  - `packages/components/chip-label/` を追加し `dads-chip-label` を実装
  - DADS HTML版の `chip-label.css` 相当を Shadow DOM 向けに移植
  - `variant` / `color` 属性で見た目を切り替え（デフォルト値あり）
  - `slot="icon"`（任意）を提供し、アイコン有無で余計な余白が出ないこと
  - 任意色上書き（`--_non-text` / `--_bg` / `--_text` / `--_text-dark`）をサポート
  - `a11yAnnotations` を追加し、`a11y-annotate` でコールアウト表示できる
  - `viewer.html` + `src/demos.ts` を更新し、Viewerで閲覧可能にする
  - Storybook と Vitest に最小限の追加（stories/tests）
- やらないこと
  - 既存コンポーネントの大規模な設計変更
  - DADS仕様を超える独自機能追加（サイズ等）

## Spec（予定）
- Tag: `dads-chip-label`
- Attributes
  - `variant`: `text | outline | filled-outline | fill`（default: `text`）
  - `color`: `gray | blue | light-blue | cyan | green | lime | yellow | orange | red | magenta | purple`（default: `gray`）
- Slots
  - `icon`（任意）
  - default（ラベル文字列）
- CSS Parts
  - `base` / `icon` / `label`
- Custom properties（上書き用）
  - `--_non-text` / `--_bg` / `--_text` / `--_text-dark`

## Action items
1. コンポーネント本体（template + styles + defaults）を追加
2. `defineChipLabel()` / `defineDefaultChipLabel()` を追加
3. `packages/autoload/dads/chip-label.ts` を追加し Import Maps で解決できるようにする
4. `viewer.html` の importmap / selector / preload を更新し、`src/demos.ts` にデモを追加
5. Storybook の `chip-label.stories.ts` を追加
6. Vitest の `chip-label.test.ts` を追加

## Test plan
- `npm run type-check`
- `npm run test:run`
- `bun server.ts`（または既存の手順）で `viewer.html` を開き Chip Label を表示できること

