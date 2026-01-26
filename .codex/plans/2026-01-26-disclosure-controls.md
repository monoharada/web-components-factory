# Disclosure：API / Controls 拡張Plan（承認済み）

承認: 2026-01-26（Props / Attrs を増やし、文言編集 + back-link の表示/非表示を試せるようにする）

## 目標
- Disclosure の `Props / Attrs` を増やし、**summary/content/back-link のテキストをライブ編集**できるようにする
- **back-link を外せる（=空文字で非表示にできる）**ことを Controls から試せるようにする
- Reset で全てデフォルトに戻る

## 背景
- 現状 `open` と CSS vars は Controls で変更できるが、スロット内容（summary/content/back-link）はテーブルから編集できない

## スコープ
- やること：
  - `src/demos.ts` の Disclosure デモの `Props / Attrs` 行を追加（summary/content/back-link を編集可能に）
  - `src/viewer-api-controls.ts` を拡張して、**コントロール単位で “反映先要素” を指定**できるようにする（スロット文言を安全に更新するため）
  - 必要なテスト追加（`src/viewer-api-controls.test.ts`）
  - 必要なら docs 追記（`docs/knowledge/viewer-api-controls-table.md`）
- やらないこと：
  - `dads-disclosure` 自体の公開 API（属性/プロパティ）追加（今回はスロット運用のまま）
  - back-link を DOM から「要素ごと」差し替える（今回は **空文字=非表示**で試す）

## 前提 / 制約
- `bindApiControls()` の互換性は維持（既存デモが壊れない）
- back-link は `slot="back-link"` が **空文字**なら非表示（現実装どおり）

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- Disclosure デモの `Props / Attrs` に以下を追加
  - `summaryText`（slot="summary" の textContent）
  - `contentLeadText` / `contentBodyText`（slot="content" 内の特定ノードの textContent）
  - `backLinkText`（slot="back-link" の textContent。空文字で非表示になるので「外せるか」を試せる）

### その他（Docs/Marketing/Infra など）
- `src/viewer-api-controls.ts`：各 control 要素に `data-api-target-selector="..."` があれば、その要素へ反映（なければ従来どおり panel の target へ反映）

## 受入基準
- [ ] Disclosure の `Props / Attrs` で summary/content/back-link の文言が即時反映される
- [ ] back-link は Controls で空文字にすると非表示になる（戻すと再表示）
- [ ] Reset で open/文言/CSS vars がデフォルトに戻る
- [ ] `npm run test:run` がパス
- [ ] `npm run validate:wc` がパス
- [ ] `npm run ci` がパス

## リスク / エッジケース
- `bindApiControls()` の変更で既存デモへ影響 → 後方互換・テスト追加で担保
- セレクタが見つからない場合の挙動 → 何もしない（既存デモを壊さない）

## 作業項目（Action items）
1. `viewer-api-controls` の新仕様テストを追加（完了条件: 追加テストがREDで落ちる）
2. `bindApiControls()` に control 単位 target 対応を実装（完了条件: 追加テストがGREENになる）
3. Disclosure デモの Preview に編集対象ノードの目印を追加（完了条件: selector で一意に取れる）
4. Disclosure の `Props / Attrs` に文言系の行を追加（完了条件: ライブ編集できる）
5. Reset で文言も戻ることを確認（完了条件: 期待どおり戻る）
6. `validate:wc` / `test:run` / `ci` 実行（完了条件: 全てパス）

## テスト計画
- `npm run test:run`
- `npm run validate:wc`
- `npm run ci`
- `viewer.html` で Disclosure を開き、Controls で文言/空文字/Reset を一通り確認

## オープンクエスチョン
- 該当なし

