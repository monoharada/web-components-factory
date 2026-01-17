# dads-radio のスタイリング是正（BEMクラス削除 / Token 3層化 / フォールバック整理）

## 目標
- `dads-radio` の Shadow DOM 内 BEMクラスを削除し、`part` を唯一のスタイリングAPIにする
- スタイリングを **Primitive → Semantic → Local → Properties** の流れに厳密化する
- フォールバック値を原則削除し、**アクセシビリティ上の最低保証（例: 44pxタップ領域）** に限り残す/担保する

## 背景
- `packages/components/radio/radio.ts` は `part` で完結している一方、BEMクラス（`class="dads-radio__*"`）が残っている
- `packages/components/radio/radio-styles.ts` は `--color-primitive-*` 等への直参照や、`var(--spacing-*, fallback)` が多く、token設計の責務が混在している
- `--spacing-*` は `applySpacingTokens()`（`packages/styles/spacing-tokens.ts`）で提供されるため、コンポーネント側でフォールバックに頼るより「Primitiveとして注入→Semantic/Local化」が筋が良い

## スコープ
- やること：
  - `dads-radio` のテンプレートから BEMクラス属性を削除
  - `radio` 用の **semantic/local tokens** を新設し、`radio-styles` は **local tokensのみ** を使う構造に整理
  - `applySpacingTokens()` を `dads-radio` に導入し、spacing系フォールバックを基本撤廃
  - 44pxタップ領域など、アクセシビリティ上の最低保証が必要な箇所のみ担保（例: `size="lg"` のターゲットサイズを 44px 未満にしない）
  - `:has()` は合理的用途（パディング付与/hover連動）として維持
- やらないこと：
  - `dads-radio` のDOM構造・挙動（グループ排他/バリデーション等）の仕様変更
  - `dads-checkbox` など他コンポーネントへの波及リファクタ（今回は対象外）
  - DADSデザインからの見た目変更（意図しない差分を出さない）

## 前提 / 制約
- `dads-radio` の styles は `withReset([...], 'minimal')` の順序に従い、`applyDADSTokens()` / `applySpacingTokens()` を Primitive として前段に置く
- `radio-styles.ts` では `--color-primitive-*` / `--spacing-*` 等を直接参照せず、`--dads-radio-*`（Local）経由に寄せる
- `:has()` 非対応環境では hover/padding が効かない可能性があるが、今回は対応範囲に含めない（合理性優先）

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `packages/components/radio/radio.ts` の `class="dads-radio*"` を削除（見た目変更なし）
- `packages/components/radio/radio-tokens.ts`（新規）を追加し、Primitive（DADS色/spacing）→ radio semantic → radio local のマッピングを定義
- `packages/components/radio/radio-styles.ts` を、Local tokenからプロパティへマッピングする責務に寄せる（状態差分は変数再代入で管理）
- フォールバックは原則削除し、タップ領域など最低保証が必要な箇所のみ担保（例: `size="lg"` のターゲットサイズを 44px 未満にしない）

### その他（Docs/Marketing/Infra など）
- 該当なし

## 受入基準
- [ ] `packages/components/radio/radio.ts` から Shadow DOM 内のBEMクラス属性が削除されている
- [ ] `packages/components/radio/radio-tokens.ts` が追加され、semantic/local tokens が定義されている
- [ ] `packages/components/radio/radio.ts` の `styles` に `applySpacingTokens()` と `radioTokens` が追加され、順序が `applyDADSTokens()` → `applySpacingTokens()` → `radioTokens` → `radioStyles` になっている
- [ ] `packages/components/radio/radio-styles.ts` の値参照が local token（`--dads-radio-*`）中心になり、不要な `var(..., fallback)` が削除されている
- [ ] 44pxタップ領域などアクセシビリティ上必要な最低保証が担保されている（縮小設定でも 44px を割らない）
- [ ] `npm run ci` が成功する

## リスク / エッジケース
- `applySpacingTokens()` 導入で、従来フォールバック値と実トークン値がズレていた場合に見た目が微妙に変わる可能性
- `:has()` 依存箇所（padding/hover）が、非対応環境で無効になる
- 新しい `--dads-radio-*` token 体系の導入により、将来的なカスタマイズAPIが増える（ただし `--_` 系の非公開変数よりは健全）

## 作業項目（Action items）
1. `packages/components/radio/radio.ts` の `class="dads-radio*"` を削除（完了条件: `class=` が消え、既存テストが影響しない）
2. `packages/components/radio/radio-tokens.ts` を追加（完了条件: semantic/local tokens が定義され、Primitive参照はここに集約される）
3. `packages/components/radio/radio.ts` の `styles` に `applySpacingTokens()` と `radioTokens` を追加（完了条件: styles順序が確定し、spacingフォールバック不要になる）
4. `packages/components/radio/radio-styles.ts` を local token ベースへリファクタ（完了条件: プロパティは一度だけ、状態は変数再代入で管理）
5. フォールバック削除と最低保証（44px等）を反映（完了条件: `var(--*, fallback)` が原則消え、必要箇所のみ担保される）
6. `npm run ci` を実行（完了条件: CIが成功）
7. Viewer/Storybookで目視確認（完了条件: sm/md/lg、hover/focus/error/disabled の見た目が崩れていない）

## テスト計画
- `npm run ci`
- 手動: `bun server.ts` → `viewer.html` で `dads-radio` の sm/md/lg と hover/focus/error/disabled を確認

## オープンクエスチョン
- なし（44px最低保証は `size="lg"` を対象に担保する前提で進める）

