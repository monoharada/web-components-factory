# DADSリソース取得フロー（事前調査・ローカル資材化 / file-upload）

## 目標
- DADSコンポーネント実装前に、必要な外部資料（ドキュメント/画像/Storybookキャプチャ/関連ソース）を **ローカルに集約してgit管理** できる仕組みを用意する
- 以後は「対象コンポーネントを指定して同期」→「AIエージェントがローカル資材を参照して計画/実装」の流れを定着させる
- 取得済み資材をもとに **コンポーネント分析レポート** を作成できる状態にする

## 背景
- 実装中に何度もWeb参照を繰り返すと、抜け漏れ/解釈違い/参照元の揺れが起きやすい
- スクリーンショット等の視覚的根拠（差分確認）を残しておくと、実装の精度とレビュー効率が上がる

## スコープ
- やること：
  - DADS公式サイトの対象コンポーネントページ（概要/使い方/アクセシビリティが存在する場合）の **テキスト抽出 + 画像取得 + ページキャプチャ**
  - DADS HTML版 Storybook（`https://design.digital.go.jp/dads/html/`）の **対象コンポーネントに紐づく docs/story の全キャプチャ**
    - 画像は **UI + canvas（iframe）両方** を取得する
    - 可能な範囲で iframe の `#storybook-root` HTML を保存する（HTMLコードスニペットの代替/補助）
  - `digital-go-jp/design-system-example-components-html` の **対象コンポーネント関連ソース** のスナップショット取得（存在しない場合は欠損として記録）
  - 取得物の配置ルール、更新方法、検証方法をドキュメント化
  - 取得済み資材をもとに、対象コンポーネントの分析レポートを作成
- やらないこと：
  - コンポーネント本体（`packages/components/*`）の実装/改修
  - DADS全コンポーネントの一括取得をデフォルト化（対象指定ベースにする）
  - 取得物をCIで自動更新（まずは手動運用で固める）

## 前提 / 制約
- 画像取得は `agent-browser` を使用する（グローバルインストール済み想定）
- 同期実行時はネットワーク必須（オフライン利用は「取得済み資材の参照」のみ）
- DADS側でHTML版のリソースが「提供予定」のコンポーネントがあるため、**存在チェックして欠損を記録**する
- 画像をgit同梱するため、リポジトリ肥大化の運用を決める（当面は対象1コンポーネント単位で運用）
- ライセンス/利用規約に抵触しないことを確認し、参照元URL・取得日時・上流commitを必ず記録する
- 初回対象コンポーネントは `file-upload`（ファイルアップロード／ドロップエリア）

## 変更内容（案）
### データ / バックエンド
- `resources/dads/`（git管理）を新設し、以下を集約
  - `resources/dads/components/<slug>/docs/`（ページ別テキスト、ページHTML、画像、ページキャプチャ）
  - `resources/dads/components/<slug>/storybook/`（docs/storyのキャプチャ、iframe由来HTML、story一覧）
  - `resources/dads/upstream/`（上流スナップショット＋commit情報）
  - `resources/dads/index.json`（全体索引、最終取得日時、各コンポーネントの資材有無）
- `scripts/` 配下に同期CLIを追加（例：`npm run dads:sync -- --component file-upload`）
  - DADS公式ドキュメント（overview/usage/accessibility）を巡回→保存
  - DADS HTML版 Storybook の `index.json` を解析して対象エントリを列挙→ UI/canvas キャプチャ + HTML保存
  - 上流repoは `.context` に一時clone→必要ディレクトリを `resources/` にコピー（最終commitを記録）
### UI / UX
- 該当なし
### その他（Docs/Marketing/Infra など）
- `resources/dads/README.md` に運用（取得/更新/参照/差分確認）を記載
- 各コンポーネントに `manifest.json`（取得元URL、取得日時、取得成否、保存ファイル対応表）を生成
- `docs/` 配下にコンポーネント分析レポートを保存（例：`docs/knowledge/dads-file-upload-analysis.md`）

## 受入基準
- [ ] `resources/dads/` 配下に「どこに何があるか」が分かる索引（`README.md` と `index.json`）がある
- [ ] `npm run dads:sync -- --component file-upload` で以下が揃う（存在するものは必ず、存在しないものは欠損として記録）
  - [ ] DADSドキュメント（概要/使い方/アクセシビリティ）のテキスト/HTML
  - [ ] 同ページ内のコンポーネント画像取得、またはページキャプチャ
  - [ ] DADS HTML版 Storybook の docs/story キャプチャ（UI + canvas）、もしくは「提供予定」の記録
  - [ ] 可能な範囲で iframe の `#storybook-root` HTML保存
  - [ ] 上流ソースコード（対象コンポーネント関連）と上流commitの記録、もしくは「未実装/不存在」の記録
- [ ] 取得結果は `.context` ではなく **git管理対象** に入っている
- [ ] 再実行で不要な上書きが起きにくい（必要なら`--force`で明示的に再取得できる）
- [ ] 取得済み資材をもとに `docs/knowledge/dads-file-upload-analysis.md` が作成されている

## リスク / エッジケース
- DADSサイト/Storybookの構造変更でセレクタやURL規則が壊れる
- Story数が多いコンポーネントで取得時間が長くなる、あるいはレート制限に当たる
- 日本語ID（例：`components-アコーディオン--docs`）のファイル名安全性→ **manifestでIDとファイル名の対応を保持**する
- スクリーンショットが環境差で揺れる→ viewport固定・待機条件・アニメーション無効化が必要
- ライセンス/再配布条件の不明点（画像/ドキュメントの同梱）

## 作業項目（Action items）
1. `resources/dads/` のディレクトリ設計と命名規則を確定（完了条件: 例示ツリーと`manifest/index`仕様が決まる）
2. DADSドキュメント取得（HTML/テキスト/画像/キャプチャ）の同期処理を実装（完了条件: overview/usage/accessibilityの存在チェック+保存ができる）
3. Storybook `index.json` 解析→対象docs/story列挙を実装（完了条件: `./src/components/<name>/` で安定フィルタできる）
4. `agent-browser` による UI + canvas キャプチャ取得を実装（完了条件: 取得物が所定パスに保存される）
5. HTMLスニペット保存（iframe `#storybook-root`）を実装（完了条件: 対象エントリのHTMLが保存される）
6. 上流ソーススナップショット取得を実装（完了条件: 上流commitが記録され、対象コンポーネント関連ソースが同梱される/不存在が記録される）
7. `file-upload` を対象に同期を実行して資材を生成（完了条件: `resources/dads/components/file-upload/` に一式が揃う/欠損が記録される）
8. `file-upload` の分析レポートを作成（完了条件: `docs/knowledge/dads-file-upload-analysis.md` がレビュー可能な粒度で埋まる）
9. `validate` と運用ドキュメントを追加（完了条件: 取得漏れ検知と参照/更新手順がREADMEにまとまる）

## テスト計画
- `npm run dads:sync -- --component file-upload` を実行し、docs が揃うこと・storybook/source が欠損として記録されることを確認
- 同コマンドを再実行し、意図しない大量差分が出ないことを確認（必要なら`--force`の挙動も確認）
- `npm run dads:validate -- --component file-upload` 等で不足項目（404/取得失敗/ファイル欠損）が明確に出ることを確認
- 取得したページキャプチャを確認し、実装時の参照に耐える解像度/範囲になっていることを確認

## オープンクエスチョン
（詰まるときだけ最大2つ）
