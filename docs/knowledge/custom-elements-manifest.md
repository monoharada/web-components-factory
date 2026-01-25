# Custom Elements Manifest（`custom-elements.json`）

このリポジトリでは、Web Components の “単一の真実” として **Custom Elements Manifest（CEM）** を `custom-elements.json` として管理します。

## 置き場所 / 運用

- `custom-elements.json` は **repo root** に置き、**コミット運用**します（差分レビュー可能にするため）。
- `package.json` の `"customElements": "custom-elements.json"` を source of truth として維持します。

## 生成

```bash
npm run cem:analyze
```

- 設定は `custom-elements-manifest.config.js` にあります。
- `@custom-elements-manifest/analyzer` は現状 `schemaVersion: "1.0.0"` を出力するため、config 内の plugin で `2.1.0` に上書きしています（cem-validator などのツール側の前提に合わせるため）。
- `custom-elements.json` の差分を安定させるため、`cem-sorter` を plugin として噛ませています。

## CEM にタグが出ないとき（よくある原因）

- `tagName` を推論できない定義方式の場合があります（この repo は独自の基盤クラス + `static definition` パターン）。
- 原則として、各コンポーネントの JSDoc に `@customElement` / `@tagname`（または等価な情報）を揃えることで CEM 抽出の成功率が上がります。

## prefix 戦略（canonical は `dads-*`）

- CEM は **デフォルト prefix の `dads-*` を canonical** として生成します。
- prefix を変えて運用する利用者向けに、tagName を置換した manifest を生成できます：

```bash
npm run cem:prefix -- --prefix my-ui
```

デフォルトでは `custom-elements.my-ui.json` を生成します（`--out` で出力先指定も可能）。

### エディタ補完（tagFormatter）

prefix を変更する場合、エディタ側の Web Components Language Server 等に **tagFormatter（タグ名の書き換え）** が用意されていることがあります。

- 例（概念）: `dads-foo` を補完するときに自動で `my-ui-foo` に変換する
- 実装は各エディタ/拡張の仕様に依存するため、利用する language server のドキュメントを参照してください。
