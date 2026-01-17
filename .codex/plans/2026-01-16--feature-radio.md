# ラジオボタン（`dads-radio`）追加 Plan

## Context
- DADS（デジタル庁デザインシステム）HTML版の Radio を、このリポジトリの Web Components として提供したい
- 公式スタイルは `digital-go-jp/design-system-example-components-html` の `src/components/radio/radio.css` を一次ソースとして移植する
- Shadow DOM だとネイティブの radio グルーピング（同一 `name` の排他）が効かないため、`dads-radio` 側で排他制御・キーボード移動を補完する
- 他コンポーネント同様、Form-Associated Custom Element + `a11yAnnotations` 付きで提供し、Viewer/Storybook/Tests まで揃える

## Scope
- やること
  - `packages/components/radio/` を追加して `dads-radio` を実装
  - DADS HTML版 `radio.css` 相当を Shadow DOM 向けに移植（+ 本repo流の `requirement`/`error-text` 表示を追加）
  - `name` 属性で同一グループを判定し、選択時に同グループの他 `dads-radio` を解除（排他）
  - キーボード操作（↑↓←→）で同グループ内を移動・選択（ネイティブ相当の体験を補完）
  - `required` + `auto-validate` で submit 時に必須バリデーション（未選択なら送信阻止）
    - 見た目はグループ全体を赤系（各 input の `aria-invalid`）にしつつ、エラー文は先頭要素に1つだけ表示（ノイズ抑制）
  - `packages/autoload/dads/radio.ts` を追加し Import Maps（Viewer）で解決できるようにする
  - `viewer.html` + `src/demos.ts` にデモ追加
  - Storybook と Vitest を最小限追加（stories/tests）
- やらないこと
  - `dads-radio-group` 等の新規コンポーネント追加
  - `dads-fieldset` 側にグループ用エラー表示機能を追加（今回は `dads-radio` 単体で完結）

## Spec（予定）
- Tag: `dads-radio`
- Attributes
  - `label`（string）
  - `size`（`sm | md | lg`、default: `sm`）
  - `checked`（boolean、**属性はデフォルト値として扱う**）
  - `disabled`（boolean）
  - `required`（boolean）
  - `auto-validate`（boolean）
  - `error` / `error-text`（手動エラー表示）
  - `name`（string、グループ判定・フォーム送信キー）
  - `value`（string、default: `"on"`）
  - `aria-label` / `aria-labelledby` / `aria-describedby`
- Slots
  - `required-error`（必須エラー文の差し替え用・hidden）
- CSS Parts
  - `base` / `radio` / `input` / `label` / `requirement` / `error-text`
- Events
  - `dads-change`（`detail: { checked: boolean; value: string }`）

## Action items
1. `packages/components/radio/`（`radio.ts`/`radio-styles.ts`/`radio-define.ts`/`index.ts`）追加
2. `dads-radio` の排他制御・Arrowキー移動・requiredバリデーション・`a11yAnnotations` を実装
3. `packages/autoload/dads/radio.ts` 追加
4. `packages/components/index.ts` と `viewer.html`（importmap + selector）更新
5. `src/demos.ts` に Radio デモ（単体/グループ/required検証）追加
6. `packages/components/radio/radio.stories.ts` と `packages/components/radio/radio.test.ts` 追加

## Test plan
- `npm run type-check`
- `npm run test:run`
- `bun server.ts` → `viewer.html` で Radio デモの表示・クリック・Arrowキー・required submit の挙動確認

