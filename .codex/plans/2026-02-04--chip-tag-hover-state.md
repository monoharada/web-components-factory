# チップタグ hover/active 挙動修正 Plan（removeはボタンのみ）

## 目標
- `action="remove"` 時は **削除ボタンのみ** hover/active が反映される
- `hover=1000 / active=1200` の色指定を正しく反映する
- `action="none"` 時は従来通り **チップ本体が hover/active** になる

## 背景
- 現状 `:host(:hover)` / `:host(:active)` が常に発火し、`action="remove"` でも本体の色が変わってしまう
- デザインでは **remove ボタンのみ**が hover/active 対象

## スコープ
- やること：
- `action="remove"` の hover/active を `[part="action"]` のみに限定
- `action="none"` の hover/active はチップ本体に限定
- hover/active 色を **1000/1200** に調整
- やらないこと：
- コンポーネントAPI変更
- レイアウト構造の変更

## 前提 / 制約
- `action="none"` の本体 hover/active は **残す**
- 色は DADS トークンで再代入（ハードコード禁止）
- CSSは `css-writing-rules` に準拠

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `packages/components/chip-tag/chip-tag-tokens.ts`
  - `--chip-tag-text-color-hover` を **blue-1000** に
  - `--chip-tag-text-color-active` を **blue-1200** に
  - `--chip-tag-action-background-hover` / `--chip-tag-action-background-active` を **1000/1200** に
- `packages/components/chip-tag/chip-tag-styles.ts`
  - `:host(:hover)` / `:host(:active)` を削除
  - `:host([action="none"]:hover)` / `:host([action="none"]:active)` で **本体のテキスト色のみ**再代入
  - `:host([action="remove"]) [part="action"]:hover` / `:active` で **ボタンの背景/アイコン色のみ**再代入

### その他（Docs/Marketing/Infra など）
該当なし

## 受入基準
- [ ] `action="remove"` の場合、本体テキスト色は hover/active で変わらない
- [ ] `action="remove"` の場合、削除ボタンのみ hover/active で色が変わる
- [ ] hover は 1000、active は 1200 の色になっている
- [ ] `action="none"` の場合、本体が hover/active で色変化する

## リスク / エッジケース
- `:host(:hover)` 削除により、`action="none"` 側の hover が抜ける可能性（専用セレクタで補完）
- 既存の token 再代入の影響範囲が広いため、再代入先を限定しないと副作用が出る

## 作業項目（Action items）
1. `chip-tag-tokens.ts` の hover/active トークンを 1000/1200 に変更（完了条件: hover/active のセマンティックが更新）
2. `chip-tag-styles.ts` の `:host(:hover)` / `:host(:active)` を削除（完了条件: 旧セレクタが消える）
3. `action="none"` 専用の hover/active 再代入を追加（完了条件: 本体 hover が維持）
4. `action="remove"` 時の `[part="action"]` hover/active 再代入を追加（完了条件: ボタンのみ変化）
5. 目視確認（hover/active の対象と色が意図通り）（完了条件: スクショ一致）
6. 必要なら簡易テストを追加（CSS再代入の存在確認）（完了条件: テストが通る）

## テスト計画
- 手動確認: `http://localhost:3000/?component=chipTag`
- 可能なら `npm run test:run -- packages/components/chip-tag/chip-tag.test.ts`

## オープンクエスチョン
該当なし
