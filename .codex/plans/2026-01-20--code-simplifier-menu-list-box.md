# Code Simplifier: Menu List / Menu List Box 差分整理（preview）

## 目標
- 追加された `dads-menu-list` / `dads-menu-list-box` とデモ周りの差分を、**挙動を変えずに**読みやすく・小さく整える。
- 既存のユーティリティ/慣習（例：`packages/utils/*`、他コンポーネントの実装パターン）に寄せ、重複を増やさない。

## 背景
- `packages/components/menu-list*` / `menu-list-box*` の新規追加と、`src/demos.ts` / `viewer.html` への追加が入っている。
- `code-simplifier` のガードレール（10ファイル超・変更規模大）に該当するため **preview** 扱いで提案のみ行う。
- `plan-mode` と `code-simplifier` skill を読み、両者の手順に沿って Plan を作成する。

## スコープ
- やること：
  - 対象ファイル（git差分 + untracked）のうち、主に `.ts/.html` を**無挙動変更で**リファクタ/重複削減。
  - 既存ユーティリティの採用（例：`packages/utils/dom.ts` の `hasSlotContent` 等、同等挙動が担保できる範囲）。
  - `src/demos.ts` のメニュー系デモの重複（SVG/反復）を helper/定数で圧縮。
- やらないこと：
  - 公開API/外部仕様変更（属性名、イベント名、slot/part構造の変更、トークン設計の転換）。
  - 依存追加、ビルド/設定/ロックファイル更新、広域リネーム。
  - CSS設計方針の変更（トークン体系や `:host/::part/::slotted` の大改修）。

## 前提 / 制約
- 対象（現状の変更/追加）:
  - 変更: `packages/components/index.ts`, `src/demos.ts`, `viewer.html`
  - 追加: `packages/components/menu-list/**`, `packages/components/menu-list-box/**`, `packages/autoload/dads/menu-list*.ts`
- `src` は `npm run format`（prettier対象）なので、`src/demos.ts` を触る場合は整形も合わせる。
- テスト/型チェックがあるため、最終的に `npm run type-check` と `npm test` で確認する。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `packages/components/menu-list/menu-list.ts`
  - `definition.template` と `#createTemplate()` で重複している inner markup（start/label/tail/end icon など）を **1箇所に集約**して差分を縮小（DOM構造は維持）。
  - private helper（slot content判定/アイコン表示切替/子listのslotting）を読みやすく整形（処理順と条件分岐の簡素化）。
- `packages/components/menu-list-box/menu-list-box.ts`
  - 既存実装パターン（calendar/date-picker等）に合わせ、イベント購読ヘルパー/解除処理を局所化して読みやすくする。
  - opener icon 判定は、挙動差が出ない範囲で `hasSlotContent` 等の既存ヘルパー採用を検討（fallback無しslotのみ）。
- `src/demos.ts`
  - `menuList` / `menuListBox` デモの重複SVG・反復アイテムを定数/生成関数化（例：既存 `CHIP_LABEL_ICON_SVG` の再利用、`repeatBlocks()` の活用）して行数を圧縮。
  - デモ用 `id`/`data-*`/スクリプト依存は保持（DOM参照が壊れないことを優先）。

### その他（Docs/Marketing/Infra など）
- 該当なし（※Plan保存は実装フェーズ開始時に `.codex/plans/` へ実施）

## 受入基準
- [ ] `dads-menu-list` / `dads-menu-list-item` の DOM/属性/イベント挙動が変わらない（テストが同等に通る）。
- [ ] `dads-menu-list-box` の open/close、フォーカス移動、`menuitemselect` 発火が変わらない（テストが同等に通る）。
- [ ] `src/demos.ts` の `menuList` / `menuListBox` デモが表示・動作し、デモ内スクリプト（status更新/ current同期）が動く。
- [ ] `viewer.html` の component mapping と demo selector から新デモが開ける。
- [ ] `npm run type-check` と `npm test` が成功する。
- [ ] 依存追加/設定変更/ロックファイル更新なし。

## リスク / エッジケース
- テンプレート重複の集約で、微小なDOM差分（属性順/改行等）が入る可能性（意図せず `textContent` 由来の値に影響しないよう注意）。
- slot content 判定のヘルパー統一は、fallback node 取り扱い差で挙動が変わり得る（`menu-list-item` の tail/end icon は特に慎重）。
- デモ文字列生成の抽象化で、`id`/`data-*` の付け忘れや script の参照先がずれるリスク。

## 作業項目（Action items）
1. Plan を `.codex/plans/2026-01-20--code-simplifier-menu-list-box.md` 等で保存（完了条件: 承認済みPlanがファイル化されている）
2. 対象ファイルを確定（git差分 + untracked）し、触る順序を決める（完了条件: 対象ファイル一覧がPlanに反映されている）
3. `packages/components/menu-list/menu-list.ts` の重複テンプレート/定数化を実施（完了条件: inner markup が1箇所管理になり、挙動差分なし）
4. `packages/components/menu-list-box/menu-list-box.ts` の購読/slot判定まわりを既存流儀に寄せて簡素化（完了条件: コード行数/重複が減り、挙動差分なし）
5. `src/demos.ts` の `menuList` / `menuListBox` デモを helper/定数で圧縮（完了条件: デモHTMLの意味が同じまま重複が減っている）
6. 必要最小限で `viewer.html` の追加分を整える（完了条件: mapping/selector/import list が読みやすく、挙動差分なし）
7. `npm run format`（srcのみ）を実行（完了条件: `src/demos.ts` がprettier整形済み）
8. `npm run type-check` と `npm test` を実行（完了条件: 両方成功）
9. 目視スモーク（viewerで menuList/menuListBox を開く）用の確認手順をまとめる（完了条件: 手順が簡潔に記録され、再現可能）

## テスト計画
- `npm run type-check`
- `npm test`
-（必要なら）viewerで `Menu List` / `Menu List Box` デモを開き、open/close と選択イベント（status更新）を目視確認

## オープンクエスチョン
- （該当なし）

