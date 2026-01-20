# Step Navigation a11y 改善（ナビ/進捗両対応＋動的status）

## 目標
ステップナビゲーションを「遷移できるナビ（link/button）」と「進捗表示のみ（非インタラクティブ）」の両主用途で、WCAG 2.2 的に破綻しないセマンティクス・通知・フォーカス表現にする。

## 背景
- 現状はShadow内で常に`<nav>`を生成しているため、利用側が`aria-label`/`aria-labelledby`で「ナビの名前」を付けられない（`packages/components/step-navigation/step-navigation.ts:56`）。
- `slot="status"`はvisually-hiddenで提供されるが、動的更新を読み上げるための`aria-live`等は未提供（`packages/components/step-navigation/step-navigation.ts:58`）。
- diff lint（/dev/null相当）では`outline: 0`が検出（`packages/components/step-navigation/step-navigation-styles.ts:138`）。代替として番号側にfocus ringはある（`packages/components/step-navigation/step-navigation-styles.ts:204`）。
- 上流HTML版は「link時にNAV+aria-label、非link時はDIV」という出し分けをしている（`resources/dads/components/step-navigation/upstream/design-system-example-components-html/src/components/step-navigation/step-navigation.stories.ts:66`）。

## スコープ
- やること：
  - navの名前付け（ラベル経路）をコンポーネントAPIとして提供
  - statusの動的更新（必要な場合）の読み上げ手段を提供
  - 非インタラクティブ用途のセマンティクス（navigation扱いにしない等）を整理
  - デモ/テストを更新して運用例を固定
- やらないこと：
  - 見た目の大幅変更、トークン全面見直し
  - 画面全体要件（ページタイトル/言語/スキップリンク等）の保証

## 前提 / 制約
- MPA推奨だが、業務要件でSPA的にstatusが更新されることがある。
- 利用側の文言（各ステップタイトルの一意性等）に依存する達成基準がある（2.4.4等）。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- **ナビの名前（2.4.6/4.1.2）**
  - `dads-step-navigation`のホストに指定された`aria-label`/`aria-labelledby`を、Shadow内の`<nav>`へ反映する（ユーザー合意済み）。
- **statusの動的更新（4.1.3）**
  - `slot="status"`のラッパーに、任意で`aria-live`/`aria-atomic`を付与できるオプションを追加する。
  - デフォルトは`off`（ユーザー合意済み）。
- **非インタラクティブ用途のセマンティクス**
  - 「子に`href`も`interaction="button"`も無い」場合は、Shadow内`nav`のroleを`group`等に切り替え、navigationランドマークとして露出しない。
- **運用ガイド（デモ）**
  - `src/demos.ts`に、(1) navラベル指定、(2) status-live指定、(3) 非インタラクティブ用途、を追記。

### その他（Docs/Marketing/Infra など）
該当なし

## 受入基準
- [ ] 利用側が指定したラベルで、支援技術がステップナビを識別できる（`packages/components/step-navigation/step-navigation.ts:56`起点の課題が解消）。
- [ ] `status-live`等を有効化したとき、status更新がステータスメッセージとして読み上げられる（4.1.3相当）。
- [ ] 非インタラクティブ用途で“navigation”として過剰に露出しない。
- [ ] フォーカス表示は維持され、`outline:0`でも代替リングが視認できる（`packages/components/step-navigation/step-navigation-styles.ts:138`と整合）。
- [ ] 既存のキーボード操作（link/role=button）は回帰しない（`packages/components/step-navigation/step-navigation.test.ts`が通る）。

## リスク / エッジケース
- `aria-*`をホストからShadowへ反映すると、開発者ツール上は「nav側に付与される」ため、意図しない重複（ホスト+nav）に見える可能性がある。
- `aria-live`をデフォルトONにすると初回描画でも読み上げが走り、ノイズになる可能性があるためデフォルトは`off`。
- “ナビか進捗か”の自動判定（子要素探索）が、動的スロット差し替えで追従漏れする可能性がある。

## 作業項目（Action items）
1. navラベルの反映方式を実装（完了条件: ホストの`aria-label`/`aria-labelledby`がShadow内`nav`に反映される）
2. `status-live`等のオプションを設計・実装（完了条件: ON時のみlive regionになる）
3. 非インタラクティブ時のrole切替を実装（完了条件: “navigation”露出が制御できる）
4. デモを更新し推奨マークアップ例を追加（完了条件: `src/demos.ts`で3パターン確認できる）
5. vitestを追加/更新（完了条件: ラベル反映・live region・role切替をテストで担保）
6. a11y diff lintを再実行（完了条件: 新規の危険シグナルが増えていない）

## テスト計画
- vitestで`packages/components/step-navigation/step-navigation.test.ts`を中心に確認
- 手動: VoiceOverで「(ラベル付き)ナビ領域として認識」「status更新がpoliteで通知」を確認（status-live有効時）

## オープンクエスチョン
解消済み（ユーザー回答: 2026-01-20）
