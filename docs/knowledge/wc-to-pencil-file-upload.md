# Web Components -> Pencil 変換 PoC（`dads-file-upload`）

`dads-file-upload` を対象に、実レンダリング観測から Pencil 用 `batch_design` operations を生成する手順です。  
手作業の近似ではなく、`capture -> diff -> ops` のパイプラインで品質ゲートを通します。

## 目的

- 対象コンポーネント: `dads-file-upload`（単体）
- 必須状態:
  - `default`
  - `error-required`
  - `disabled`
  - `button-only`
  - `fullscreen-dragover`
- 出力:
  - `capture.json` / state PNG
  - `report.json` / overlay PNG
  - `*.ops`（1行1operation）

## 実行手順

1. 開発サーバー起動
   - `npm run dev`
2. パイプライン実行（capture -> diff -> ops）
   - `npm run design:file-upload:pipeline`
3. Chat UI 差し込み ops を生成
   - `npm run design:file-upload:chat-ops -- --parent-map default=<id>,loading=<id>,error=<id>,empty=<id>`
   - 必要に応じて variant 指定:
   - `--variant-map default=<id>,disabled=<id>,error-required=<id>`

## 生成物

- `tmp/design-sync/file-upload/capture/capture.json`
- `tmp/design-sync/file-upload/capture/states/*.png`
- `tmp/design-sync/file-upload/report/report.json`
- `tmp/design-sync/file-upload/report/overlays/*.png`
- `tmp/design-sync/file-upload/ops/01-create-reusable.ops`
- `tmp/design-sync/file-upload/ops/02-insert-states.ops`
- `tmp/design-sync/file-upload/ops/03-chat-compose-replace.ops`（chat-ops 実行時）

## 差分判定の読み方

- グローバル: `diffRatio <= 0.05`
- 重要領域: `partDiffRatio <= 0.03`
  - 対象 part: `dropzone`, `browse-button`, `error-text`
- baseline 欠損ポリシー:
  - PoC期間（〜2026-02-20）: warning
  - 2026-02-21 以降: fail（終了コード `20`）

`report.json` の `summary` を優先確認します。

- `summary.pass = true`: ゲート通過
- `summary.failedStates`: 閾値超過や欠損で fail した状態
- `summary.missingBaselines`: baseline 未定義/欠損状態

## 失敗時のリカバリ

1. `capture` 失敗（終了コード `10`）
   - サーバー起動確認（`http://localhost:3000/?nosw=1&component=fileUpload`）
   - `customElements` 定義待ちに失敗していないか確認
2. `diff` 失敗（終了コード `20`）
   - `report/overlays/*.png` でどこがズレたか確認
   - `resources/dads/components/file-upload/fidelity/baselines.json` の baseline 画像出典を見直す
   - 重要領域の part bbox 取得漏れがないか `capture.json` を確認
3. `ops` 失敗（終了コード `30`）
   - `*.ops` の構文（1行1operation）を確認
   - 1ファイル25 operation 上限を超えていないか確認

## Pencil 反映手順

1. `01-create-reusable.ops` を `batch_design` に投入して reusable を作成
2. 作成された reusable ID を確認
3. `02-insert-states.ops` の `ref` を必要に応じて置換して投入
4. Chat UI へ差し込む場合は `03-chat-compose-replace.ops` を生成・投入

## ライセンス・出典

- baseline 画像の一次出典は `resources/dads/components/file-upload/docs/**` を使用
- PoC 補完に使う baseline は `baselines.json` の `source` に明記
- 生成成果物（`tmp/design-sync/**`）はコミット対象外運用を前提

