# Usage（HTML）コードブロックの自動折りたたみ（5行以上でDisclosure）

## 目標
- `viewer.html` のデモ内「Usage（HTML）」コードブロックが長い場合（5行以上）、`dads-disclosure` で **デフォルト閉**として表示できるようにする。
- Controls 操作でコードが更新されても、折りたたみ状態が破綻しない。
- 将来の例外対応として opt-out（`data-api-code-collapse="off"`）を用意する。

## 背景
- 現状の Usage（HTML）表示は `src/viewer-api-controls.ts` が HTML スニペットを整形して `<dads-code-block data-api-code>` に反映している。
- デモによっては Usage が長く、プレビューやAPIテーブルの可読性を落とすため、必要時のみ折りたたみたい。

## スコープ
- やること：
  - `bindApiControls()` の Usage 生成結果（文字列）を行数判定し、5行以上なら `dads-disclosure` を動的に挿入して code-block を内包する
  - `data-api-code-collapse="off"` を指定した場合は自動折りたたみを無効化する
  - デモ側共通 import（`src/demos/shared.ts`）に `dads-disclosure` を含め、表示のチラつきを抑える
  - ドキュメント（viewer-api-controls-table）に挙動を追記
  - ユニットテストを追加して挙動を固定する
- やらないこと：
  - `dads-code-block` コンポーネント本体へ新機能追加（viewerの体裁制御として扱う）
  - 各デモ文字列（`src/demos/*`）を個別に手で disclosure で囲う対応

## 前提 / 制約
- 行数は `syncUsageCode()` が生成する snippet（`formatHtmlNodes()` の結果）を `\n` で分割して数える（trim後、空文字は0行扱い）。
- disclosure の挿入は viewer 実行時に行うため、`validate:wc` の静的検証対象（`viewer.html` / `src/demos.ts`）への直接影響は基本ない。
- `dads-disclosure` は `Autoloader` でも遅延ロードされるが、UIの一貫性のため API panel 既定importsに含める。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- Usage（HTML）領域に、条件成立時のみ以下の構造を生成する（例）：
  - `<dads-disclosure data-api-code-disclosure>`（open無し＝閉）
    - `<span slot="summary">コードを表示</span>`
    - `<dads-code-block data-api-code slot="content">...</dads-code-block>`
- 行数が閾値未満なら wrapper を外して従来表示に戻す（冪等に wrap/unwrap）。
- `data-api-code-collapse="off"` を付与した場合は、行数に関わらず wrapper を作らない（既に wrapper があれば外す）。

### その他（Docs/Marketing/Infra など）
- `docs/knowledge/viewer-api-controls-table.md` に「Usageコードブロックは5行以上で自動的にDisclosureに入る」旨と opt-out を追記する。

## 受入基準
- [ ] 生成された Usage snippet が 5行以上のデモで、`dads-disclosure[data-api-code-disclosure]` が現れ、デフォルトで閉じている
- [ ] 5行未満のデモでは disclosure wrapper が生成されず、従来通り code-block が表示される
- [ ] `data-api-code-collapse="off"` が指定されている場合は wrapper が生成されない（既存 wrapper がある場合は解除される）
- [ ] Controls 操作で Usage の内容が更新されても、wrapper の有無が条件に応じて正しく維持/切替される（Copyが壊れない）
- [ ] `src/viewer-api-controls.test.ts` にテストが追加され、`npm run test:run` がパスする
- [ ] `npm run type-check` / `npm run validate:wc` がパスする

## リスク / エッジケース
- デモの markup が例外的に `<dads-code-block>` の配置を変えている場合、wrap/unwrap の DOM 操作が崩れる可能性
  - 対策：`data-api-code` を基準に最小限の差し替えに留め、親要素が無い場合は何もしない
- ユーザーが disclosure を開いた後に snippet が更新されるケース
  - 対策：既存 wrapper の `open` 状態は維持する（新規生成時のみ閉）
- すでに手動で disclosure に入っているケースが将来出る
  - 対策：`closest('[data-api-code-disclosure]')` で二重ラップを防ぐ

## 作業項目（Action items）
1. `src/viewer-api-controls.ts` に行数カウント関数を追加（完了条件: snippet -> lineCount が安定して取れる）
2. `src/viewer-api-controls.ts` に wrap/unwrap helper を追加（完了条件: 冪等に disclosure を生成/解除できる）
3. `syncUsageCode()` で snippet 更新後に helper を呼ぶ（完了条件: 初期表示/Controls更新の両方で発火）
4. `src/demos/shared.ts` の `API_PANEL_BASE_IMPORTS` に `dads-disclosure` を追加（完了条件: viewerで即時に disclosure が定義される）
5. `src/viewer-api-controls.test.ts` に「5行以上で wrapper」「opt-out」「4行で非生成」のテストを追加（完了条件: テストが赤→実装で緑）
6. `docs/knowledge/viewer-api-controls-table.md` に挙動追記（完了条件: ドキュメントに新仕様が明記される）
7. 検証コマンド実行（完了条件: `npm run type-check` / `npm run validate:wc` / `npm run test:run` が全て成功）

## テスト計画
- 自動:
  - `npm run test:run`（`src/viewer-api-controls.test.ts` に新規追加するテストで wrapper 生成を担保）
  - `npm run type-check`
  - `npm run validate:wc`
- 手動:
  - `bun server.ts` → `viewer.html?component=table` / `...=disclosure` で Usage が閉じること、開いて Copy が動くことを確認

## オープンクエスチョン
- 該当なし

