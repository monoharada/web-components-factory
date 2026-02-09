# Issue #77 対応計画: `dads-utility-link` に `slot="tail-icon"` を追加

- 承認日時: 2026-02-09
- 承認フレーズ: PLEASE IMPLEMENT THIS PLAN

## サマリー
- 目的は、`dads-utility-link` で任意の末尾アイコンを公開APIとして指定可能にすることです。
- 表示優先順位は確定済みで、`slot="tail-icon"` がある場合はそれを表示し、自動アイコン（`target="_blank"` / `download`）はフォールバック扱いにします。
- 後方互換として、`slot="tail-icon"` がない既存利用では現在の自動表示挙動を維持します。
- 適用ガイドラインは `css-writing-rules` と `headless-component-design`（part/slot設計・トークン設計・状態属性運用）です。

## 実装対象
1. `packages/components/utility-link/utility-link.ts`
2. `packages/components/utility-link/utility-link-styles.ts`
3. `packages/components/utility-link/utility-link.test.ts`
4. `src/demos/showcase-navigation.ts`
5. `src/demos/showcase-navigation.test.ts`
6. `docs/knowledge/a11y-annotations.json`
7. `custom-elements.json`

## 検証コマンド
- `npm ci`
- `npm run test:run -- packages/components/utility-link/utility-link.test.ts src/demos/showcase-navigation.test.ts`
- `npm run validate:wc`
- `npm run cem:analyze`
- `npm run agents:verify`
