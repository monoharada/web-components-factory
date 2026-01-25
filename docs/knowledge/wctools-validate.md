# Web Components 検証（`validate:wc` / `wc.config.js`）

この repo では `custom-elements.json`（CEM）を根拠に、viewer / demos のマークアップに対して **unknown element / unknown attribute** を検出します。

## 実行

```bash
npm run validate:wc
```

## 設定（`wc.config.js`）

- `manifestSrc`: 参照する CEM のパス（デフォルトは `./custom-elements.json`）
- `include`: 検証対象ファイル（現状は `viewer.html`, `src/demos.ts`）
- `exclude`: 除外パターン（`node_modules/**` など）
- `diagnosticSeverity`:
  - `unknownElement`: `error`
  - `unknownAttribute`: `warning`

## 実装メモ

現状は `scripts/wc/validate.mjs` による **軽量な内製バリデータ** を使っています。

- 背景: upstream の `@wc-toolkit/wctools` が npm 上でビルド成果物なしで公開されている状態があり、`wctools validate` を安定して CI/ローカルに組み込めないため
- 目標: 将来的に upstream の修正が入ったら、`wctools validate`（または programmatic API）へ段階的に移行する

## 制約 / 注意点

- 依存を増やさないため、完全な HTML パーサではなく正規表現ベースの検証です（テンプレート文字列や特殊ケースはすり抜ける可能性があります）
- glob 展開は未対応です（`include` は明示的なファイルパスを指定してください）

## 直し方（検知されたとき）

1. まず `custom-elements.json` が最新か確認: `npm run cem:analyze`
2. 属性が unknown なら:
   - コンポーネント側の JSDoc に `@attr` が不足していないか確認
   - もしくは（非推奨/内部用なら）demos 側で使用を見直す

