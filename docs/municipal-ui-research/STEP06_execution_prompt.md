# STEP06 深観測（Deep Probe）実行プロンプト

> 用途: 別セッションへそのまま貼って実行
> 前提: STEP05完了済み、ローカル実行

## あなたの役割
あなたは情報設計アナリストです。50自治体の深観測を実施し、テンプレ仕様に効く粒度で `observations_deep.csv` を完成させます。

## 入力
- `.context/municipal-ui-research/data/derived/roster_50.csv`
- `.context/municipal-ui-research/schemas/observation_deep_schema.csv`
- `.context/municipal-ui-research/config/research_params.yaml`
- （参照）`.context/municipal-ui-research/data/derived/selection_report_50.md`

## 出力
- `.context/municipal-ui-research/data/derived/observations_deep.csv`
- `.context/municipal-ui-research/data/derived/deep_probe_qc_report.md`
- （任意）`.context/municipal-ui-research/data/raw/deep_probe/**`（証跡）

## 絶対ルール
1. `observation_deep_schema.csv` のヘッダ列順をそのまま出力契約とする
2. 既存入力ファイルは編集しない
3. `notes` には「テンプレ仕様に効く示唆」を必ず書く
4. 証跡（`evidence_dom_snippets_path` か `screenshot_path`）を残す
5. `research_params.yaml` のクローラ制約（robots/concurrency/delay）を遵守

## Task 0: 前準備
```bash
mkdir -p .context/municipal-ui-research/data/derived
mkdir -p .context/municipal-ui-research/data/raw/deep_probe
mkdir -p docs/municipal-ui-research/scripts
```

## Task 1: スキーマと母数の検証
- `roster_50.csv` が50行であること
- `observation_deep_schema.csv` をヘッダ契約として読み込み、出力列を固定
- 必須ページタイプは `top/contact/service`（目標は最大5ページ）

## Task 2: 実行スクリプト
- `docs/municipal-ui-research/scripts/step06_deep_probe.py` を作成/更新
- 処理:
  - 50自治体を順次処理
  - `page_type` ごとに深観測項目を抽出
  - 証跡パスを保存
  - `notes` を記録

## Task 3: 実行
```bash
python3 docs/municipal-ui-research/scripts/step06_deep_probe.py
```

## Task 4: QC
最低限の検証を `deep_probe_qc_report.md` に記録:
- 観測行数（目標: 150〜250）
- `sample_id + page_type` 一意性
- 欠損率（全列）
- `notes` 記入率
- 証跡記入率（DOM/screenshot）

## Gate G06（合格条件）
- 50自治体カバレッジ100%
- 欠損率 <= 3%
- `notes` + 証跡記入率 >= 90%

## 失敗時ルール
- 失敗自治体のみ再実行
- 2回失敗した自治体は手動レビューへエスカレーション
- 行数が150未満なら Gate 不合格
