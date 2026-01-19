# PR #25 マージ可能品質レビュー＆フォローアップ（.context整理 / CI追加）

## 目標
- PR #25（DADS resource sync flow）が `main` にマージ可能な品質かを判断し、必要なフォローアップを実施する
- `.context/` を「作業用・gitignore前提」に整理し、誤コミットを防ぐ
- PR上で自動チェック（CI）が見える状態にする

## 背景
- PR #25 は `resources/dads/**` への外部資料スナップショット追加と、取得/検証CLI（`dads:sync` / `dads:validate` 等）の導入が中心。
- `dads:sync` は上流スナップショット取得のために `.context/upstreams/**` を利用するが、現状このリポジトリでは `.context/` が一部追跡されており、`git add .` などで誤って上流cloneを取り込むリスクがある。
- GitHub上でPRにCIチェックが表示されていないため、レビュー時に合否が見えにくい。

## スコープ
- やること：
  - `.context/` を gitignore し、既存追跡ファイルは `docs/` 配下へ移動して追跡継続する
  - PRチェックとして `npm run ci` を実行する GitHub Actions を追加する
  - `resources/dads/**` の運用（常に最新へ更新）をREADME等で明示する
- やらないこと：
  - DADSスナップショットの大規模な削減/再構成（LFS導入等）
  - 既存コンポーネント実装の改修

## 前提 / 制約
- `.context/` は Conductor / エージェント協業用の「ローカル作業ディレクトリ（gitignore前提）」として運用する
- `resources/dads/**` スナップショットは **常に最新へ更新** する運用（必要に応じて `dads:sync -- --force`）

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 該当なし

### その他（Docs/Marketing/Infra など）
- `.context/` の追跡解除と、既存 `.context/*.md` の移設（`docs/` 配下へ）
- `.gitignore` に `.context/` を追加
- GitHub Actions（PR / main push）で `npm run ci` を実行する workflow を追加
- `resources/dads/README.md` に「スナップショットは常に最新へ更新」方針と、`.context/upstreams` の一時生成物について明記

## 受入基準
- [ ] `.context/` がgit管理対象から外れ、`dads:sync` 実行後も作業ツリーが不要に汚れない
- [ ] 既存の `.context` 追跡ドキュメントが、追跡対象として適切な場所（`docs/` 配下）へ移動されている
- [ ] PR上で `npm run ci` のチェック結果が確認できる
- [ ] 手元で `npm run ci` と `npm run dads:validate -- --component file-upload` / `step-navigation` が通る

## リスク / エッジケース
- `.context` 配下を追跡しなくなるため、過去の参照を期待する場合は移設先周知が必要
- CI追加により、既存で潜在していた失敗がPRで露呈する可能性（ただし品質向上として受容）

## 作業項目（Action items）
1. `.context` 配下の追跡ファイルを洗い出す（完了条件: 移設対象の一覧が確定）
2. 追跡ファイルを `docs/` 配下へ移動（完了条件: `.context` に追跡ファイルが残らない）
3. `.gitignore` に `.context/` を追加（完了条件: `.context` が untracked で出ない）
4. CI workflow を追加（完了条件: PRにチェックが表示される）
5. `resources/dads/README.md` の運用追記（完了条件: 更新方針/一時生成物の説明がある）
6. 検証（完了条件: `npm run ci` / `dads:validate` が成功）

## テスト計画
- `npm run ci`
- `npm run dads:validate -- --component file-upload`
- `npm run dads:validate -- --component step-navigation`

## オープンクエスチョン
- （回答済み）`.context/` は gitignore し、既存追跡物は `docs/` 配下へ移設する
- （回答済み）`resources/dads/**` は常に最新へ更新する運用

