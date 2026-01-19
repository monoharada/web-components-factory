# PR #25: DADSリソース同期フローの堅牢化（LICENSE同梱 / validate厳密化 / Storybook欠落の可視化 / 画面安定化）

## 目標
- 上流スナップショット同梱時にライセンス要件（LICENSE同梱）を満たす
- `dads:validate` が「manifestのパス欠落」を取りこぼさない（空文字→ディレクトリを見て通る、を潰す）
- Storybookの取得失敗が manifest 上で欠落せず、検証で検知できる
- `agent-browser set media ...` 失敗による `manifest.notes` ノイズを抑えつつ、スクショを安定化する

## 背景
- 現状 `dads:validate` は `files.xxx` 未設定でも `path.join(..., '')` がディレクトリを指して通ってしまう可能性がある（検知漏れ）
- Storybook canvas の wait 失敗時に entry が `manifest.storybook.entries` から落ちる（欠落が見えない）
- 上流 `design-system-example-components-html` をスナップショット同梱しているが、LICENSEがコピー先に無い（同梱要件）
- 現行の `agent-browser set media` が環境によって失敗し、巨大なエラーが `manifest.notes` に残る

## スコープ
- やること：
  - `scripts/dads/sync.cjs` の upstream LICENSE 同梱対応
  - `scripts/dads/sync.cjs` の Storybook entry 記録方式を「欠落しない」形式に変更（status/errorを残す）
  - `scripts/dads/sync.cjs` のスクショ安定化を `set media` 依存から「CSS注入（animation/transition無効）」へフォールバック
  - `scripts/dads/validate.cjs` の厳密化（manifestパス未設定/空文字をエラーにする、Storybookのentry欠落を検知できる形に）
  - ドキュメントに「上流LICENSE同梱」「再配布/利用条件の注意」を追記
  - 既存スナップショット（少なくとも step-navigation / file-upload）へ LICENSE をバックフィルし、validateが通る状態に揃える
- やらないこと：
  - コンポーネント本体（`packages/components/*`）の実装/改修
  - 取得物のCI自動更新、Git LFS導入などの運用拡張

## 前提 / 制約
- `FIGMA_ACCESS_TOKEN` 未設定環境でも `dads:sync` 再実行で既存Figma資材を“劣化させない”配慮が必要
- `agent-browser set media` が失敗する環境を想定し、同等目的（動き抑制）は別手段（CSS注入）で行う
- DADS公式HTML/画像、Figmaエクスポート物の同梱可否はプロジェクト側判断なので、注意喚起と根拠（URL/取得日時/上流commit）は残す

## 変更内容（案）
### データ / バックエンド
- `scripts/dads/sync.cjs`
  - upstream: `LICENSE` を `resources/dads/components/<slug>/upstream/design-system-example-components-html/` 配下へコピー
  - storybook: entry単位で `status: ok|error` と `error` を保持し、失敗しても entries から消さない
  - screenshot安定化: ページ遷移後に `eval` で「disable animation/transition」CSSを注入（`set media` は成功時のみ、失敗時は短いnote＋CSSで継続）
  - figma: トークン未設定時に既存 `manifest.figma.status=ok` を保持できるようにする（再実行で“skipped化”しない）
- `scripts/dads/validate.cjs`
  - `files.html/text/screenshot` 等の「manifest上の相対パスが空/未設定」を明確にエラー化
  - storybook entry の `status` を解釈し、`ok` 以外（または必要ファイル欠落）を検知できるようにする
  - upstream: LICENSE の存在チェックを追加

### UI / UX
- 該当なし

### その他（Docs/Marketing/Infra など）
- `resources/dads/README.md` に「ライセンス/利用条件の注意」「upstreamはLICENSE同梱」の明記を追加
- `docs/adr/ADR-003-dads-resource-sync-flow.md` に upstream LICENSE 同梱の方針追記（決定事項として）

## 受入基準
- [ ] 上流スナップショットを同梱するコンポーネントで `.../upstream/design-system-example-components-html/LICENSE` が存在する
- [ ] `npm run dads:validate -- --component step-navigation` が「manifestパス欠落」を取りこぼさない（空文字でディレクトリ判定して通る挙動がない）
- [ ] Storybook取得失敗が起きても `manifest.storybook.entries` から該当entryが消えず、status/errorで追跡できる
- [ ] `agent-browser set media` 失敗時に `manifest.notes` が巨大ログで汚れず、代替（CSS注入）でスクショが取得できる
- [ ] ドキュメントに「LICENSE同梱」「再配布/利用条件の注意」が追記されている

## リスク / エッジケース
- validate厳密化により、これまで“通っていた”不完全なmanifestが落ちる（意図した挙動）
- Storybookの一時的な読み込み失敗で `dads:validate` が落ちやすくなる可能性（ただし欠落を確実に検知できる）
- 既存生成物（特にFigma）を再生成できない環境で `dads:sync` を回すと情報が欠けるリスク（保持ロジックが必要）

## 作業項目（Action items）
1. validateの「必須ファイル」と「ok判定」の仕様を確定（完了条件: 失敗/警告の線引きが決まる）
2. `scripts/dads/validate.cjs` を厳密化（完了条件: 空/未設定パスが必ずエラーになる）
3. `scripts/dads/sync.cjs` の upstream LICENSE 同梱を追加（完了条件: 生成先にLICENSEが配置される）
4. `scripts/dads/sync.cjs` の Storybook entry を欠落しない形式へ変更（完了条件: 失敗時もentriesに残る）
5. `scripts/dads/sync.cjs` に CSS注入フォールバックを実装（完了条件: `set media` 失敗でも安定化が効く）
6. `scripts/dads/sync.cjs` の figma “skipped化”防止（完了条件: トークン無し再実行で既存figmaセクションが保持される）
7. 既存 `resources/dads/components/*/upstream/...` に LICENSE をバックフィル（完了条件: validateが通る＆PR差分にLICENSEが含まれる）
8. docs更新（`resources/dads/README.md`, `docs/adr/ADR-003...`）（完了条件: 注意点/方針が明記される）
9. 検証実行（完了条件: `npm run ci` と `npm run dads:validate -- --component file-upload`/`step-navigation` が成功）

## テスト計画
- `npm run ci`
- `npm run dads:validate -- --component file-upload`
- `npm run dads:validate -- --component step-navigation`
- （任意）`npm run dads:sync -- --component step-navigation` をトークン無しで再実行し、figma情報が保持されることを確認

## オープンクエスチョン
- Storybookの一部entryが取得失敗した場合、`dads:validate` は失敗（exit 1）とする（おすすめを採用）。

