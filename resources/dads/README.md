# DADS resources（ローカル資材）

このディレクトリは、デジタル庁デザインシステム（DADS）の外部資料をローカルに集約し、実装時にAIエージェント/人間が参照しやすくするためのものです（git管理対象）。

## 何が入る？

- DADS公式サイト（`/dads/components/<slug>/`）のページ（HTML/テキスト/画像/キャプチャ）
- DADS HTML版 Storybook（`/dads/html/`）の docs/story（UI + canvas 画像、iframe HTML）
- 上流リポジトリ `digital-go-jp/design-system-example-components-html` の関連ソーススナップショット（存在する場合）
- 取得の成否/欠損を記録する `manifest.json`（コンポーネント単位）

## ディレクトリ構造（概要）

```
resources/dads/
  index.json
  components/<slug>/
    manifest.json
    docs/{overview,usage,accessibility}/
    storybook/
    upstream/
```

Storybook取得（存在する場合）:
- `components/<slug>/storybook/ui/` … Storybook UI込みのキャプチャ
- `components/<slug>/storybook/canvas/` … `iframe.html`（canvas相当）のキャプチャ
- `components/<slug>/storybook/html/` … `#storybook-root` のHTML（補助）

Figma取得（任意）:
- Figmaの対象 node は **このリポジトリ側から自動探索できない** ため、まず人間がURLを渡して `config.json` を作ります
  - `npm run dads:figma:add -- --component <slug> --url "<figma-url>" [--url "<figma-url>"]`
- `components/<slug>/figma/config.json` を用意し、`FIGMA_ACCESS_TOKEN`（または `FIGMA_TOKEN`）を設定すると `dads:sync` 実行時に画像とnodes情報を保存します
- 保存先:
  - `components/<slug>/figma/images/`
  - `components/<slug>/figma/nodes/index.json`（node一覧 + 抽出条件）
  - `components/<slug>/figma/nodes/<nodeId>.json`（サブセクション単位の利用箇所JSON。巨大になりがちな生の nodes JSON は保存しない）
    - 抽出条件は `figma/config.json` の `extract.instanceNameIncludes` / `extract.excludeNameIncludes` で調整できます（未設定時は slug から推定）
  - `config.json` では node ごとに `export.scale` / `export.format` を上書きできます（例: 大きい合成例だけ `scale: 1`）
  - 大きい `SECTION` を取得した場合、`nodes.json` を使って子 `FRAME` を `config.json` に展開できます（個別キャプチャ用）:
    - `npm run dads:figma:expand -- --component <slug> --from <nodeId>`
    - 追加した node を取得するため、続けて `npm run dads:sync -- --component <slug> --force` を実行します

## 使い方（同期）

```bash
npm run dads:sync -- --component file-upload
```

運用:
- `resources/dads/**` のスナップショットは **常に最新へ更新** します。更新時は `--force` を付けて再取得し、差分をコミットしてください。

再取得（上書き）:

```bash
npm run dads:sync -- --component file-upload --force
```

## 使い方（検証）

```bash
npm run dads:validate -- --component file-upload
```

## コンポーネント分析レポート

- 取得済み資材をもとに、実装前に `docs/knowledge/dads-<slug>-analysis.md` を作成します。
  - 例: `docs/knowledge/dads-file-upload-analysis.md`

## 注意

- DADS側で「提供予定」のリソース（HTML版 Storybook / GitHub 等）は、取得せず **欠損として manifest に記録**します。
- 画像は差分確認に使うため、同期処理では viewport を固定します。
  - `agent-browser` の `set media ... reduced-motion` は環境により失敗する可能性があるため、manifest の `notes` に記録した上で継続します。
- `dads:sync` は上流HTMLリポジトリ取得のために `.context/upstreams/**` をローカルに作成します（キャッシュ用途）。
  - `.context/` はローカル作業用として扱い、gitignore します。
- 上流 `design-system-example-components-html` のスナップショットを同梱する場合、上流の `LICENSE` を同梱します。
  - 例: `components/<slug>/upstream/design-system-example-components-html/LICENSE`
- DADS公式ページのHTML/画像やFigmaエクスポート物を同梱する場合は、利用規約・再配布条件に抵触しないことを確認してください。
  - 参照元URL/取得日時/上流commit 等の根拠は `manifest.json` に残します。
