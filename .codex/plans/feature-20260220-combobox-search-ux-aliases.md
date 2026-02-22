# 実装計画: Combobox 検索体験改善（再入力連結防止 + data-search）

## 概要
- **作成日**: 2026-02-20
- **作成者**: Codex
- **ステータス**: Approved
- **優先度**: High
- **見積もり工数**: 3h

## 背景と目的
- 現状の `dads-combobox`（single）では、選択ラベル表示中に再入力開始すると、表示ラベルと入力文字が連結されて絞り込みが失敗する。
- 利用者の入力負荷を下げるため、候補ごとに検索別名（ひらがな/略称など）を宣言可能にする。

## 確定事項
1. 一括JSON属性は採用しない。
2. ローマ字変換の内蔵自動変換は採用しない（予測可能性と説明可能性を優先）。
3. 検索拡張は `option[data-search]`（JSON配列文字列）で明示供給する。
4. 既存拘束条件（close時queryクリア / single未確定離脱で既存選択復帰 / DADS準拠）を維持する。

## ゴールと成功条件
- [ ] single選択表示中の再入力開始でqueryが連結されない。
- [ ] `option[data-search]` によるひらがな/別名一致が可能。
- [ ] 既存テスト + 追加テストが通過。
- [ ] `validate:wc` / `cem:analyze` / `test:run` / `type-check` の実行可能状態。

## 実装方針
1. Red
   - 連結バグ再現テストを追加。
   - `data-search` 一致テストを追加。
2. Green
   - 入力処理で「閉状態 + single + 選択表示中」の再入力を新規queryとして扱う。
   - option拡張: `data-search` を parse して検索インデックスへ統合。
3. Refactor
   - 検索正規化と alias parse をprivate helperへ整理。

## テスト計画
- `packages/components/combobox/combobox.test.ts` を対象に追加2ケースを通す。
- 回帰として既存ケース（close時clear/single復帰/multiple挙動）を維持。

## 更新履歴
- 2026-02-20: 初版作成（ユーザー承認済み方針を反映）
