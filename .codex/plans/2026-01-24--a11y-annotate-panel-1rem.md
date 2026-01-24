# a11y-annotate：注釈パネル内テキストを最小1remへ（トークン化）

## 目標
アクセシビリティ注釈（`a11y-annotate`）の右側パネル内で表示される「注釈一覧（番号・見出し・説明・スナップショット）」および「各カテゴリ説明（見出し・本文/箇条書き）」など、スクショ範囲の**小さすぎるテキスト全体**を DADS の最小 font-size（`1rem`相当）に寄せ、`font-size` をトークン参照に統一する。

## 背景
- 添付スクショの `a11y-annotate` パネル内（注釈一覧〜カテゴリ説明〜スナップショット）で、本文・説明・コード等が小さく可読性が低い。
- 本リポジトリには `--font-size-16: 1rem` のデザイントークンが存在する（`packages/styles/design-tokens/index.ts`）。
- `a11y-annotate` はコンポーネント内スタイル（`packages/components/annotate/annotate.ts`）でパネルの文字サイズを `px` 指定しているため、ここを直すのが最短。

## スコープ
- やること：
  - `a11y-annotate` パネル内の「小さいテキスト」全体を **最小1rem** にする（スクショ範囲を対象）。
  - `font-size: 12px/11px/14px` 等の直書きを、`--font-size-16` などのトークン参照（＋必要ならローカルトークン経由）に置換する。
  - 文字サイズ増で固定サイズのUI（番号丸、バッジ等）が詰まる場合は、サイズ/余白も最小限調整して崩れを防ぐ。
- やらないこと：
  - `dads-table` 本体の本文サイズ変更（今回のスクショ範囲外のため）。
  - タイポグラフィトークン体系の大規模改修（新規トークン大量追加など）。

## 前提 / 制約
- 変更は `a11y-annotate` の表示（ドキュメンテーション用途）に限定し、他コンポーネントのAPI/DOM構造は変えない。
- 最小文字サイズは `var(--font-size-16, 1rem)` を基準にする（DADS最小に寄せる）。
- `css-writing-rules` に従い、`!important` なし・トークン優先・変数マッピングは集約する。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
対象（スクショ範囲の「小さい部分すべて」）を `packages/components/annotate/annotate.ts` のCSSで引き上げる。

- まずローカルトークンを追加して集約（例）
  - `--a11y-annotate-font-size: var(--font-size-16, 1rem);`
  - `--a11y-annotate-font-size-heading: var(--font-size-16, 1rem);`（必要なら `--font-size-17` 等も検討。ただし最小は1rem）
  - `--a11y-annotate-line-height: var(--line-height-150, 1.5);` など
- 置換対象（すべて 1rem 以上に）
  - パネルヘッダー：`[part="panel-title"]` / `[part="panel-subtitle"]`
  - パネル内セクション：`section > h3` / `section > p` / `section > ul`
  - 注釈一覧：`.callout-number` / `.callout-title` / `.callout-desc`
  - スナップショット：`.snapshot` / `.snapshot code`
  - バッジ：`.badge`
- 付随調整（必要時）
  - `.callout-number` の丸（固定 `22px`）や `.callout-tag-number`（固定 `20px`）が文字サイズ増で窮屈なら、`min-width/height` と `padding` をトークンで増やしてクリップを防ぐ。
  - 行間・余白は可読性を維持しつつ最小限に調整（崩れ防止が目的）。

### その他（Docs/Marketing/Infra など）
該当なし（必要なら `docs/accessibility-annotations.md` に「パネル本文は最小1rem」程度を追記）

## 受入基準
- [ ] 添付スクショ範囲のパネル内テキスト（注釈一覧の見出し/説明/スナップショット、カテゴリ説明の見出し/本文/箇条書き、バッジ等）が **1rem相当以上**で表示される
- [ ] `font-size` はトークン参照（`var(--font-size-16, 1rem)` 等、またはローカルトークン経由）になっている
- [ ] 文字サイズ増によるクリップ/重なり/崩れ（番号丸、バッジ、スナップショット枠など）が実用上問題ない
- [ ] `npm run test:run` が通る

## リスク / エッジケース
- 文字サイズを上げると、番号丸・バッジ・スナップショット枠などの固定サイズ要素が詰まり、クリップする可能性
- パネル内の情報量が増えて折返しが増えることで、スクロール量が増える可能性（許容範囲の判断が必要）
- コールアウト（左側オーバーレイ）も同系統のサイズ指定があり、意図せず影響が出る可能性（パネル範囲に限定して調整する）

## 作業項目（Action items）
1. 対象CSSの洗い出し（完了条件: `packages/components/annotate/annotate.ts` 内の該当セレクタ一覧を確定）
2. トークン設計（完了条件: `--a11y-annotate-*` ローカルトークンと参照先（`--font-size-16` 等）を確定）
3. パネル内font-size置換（完了条件: スクショ範囲の `px` 指定がトークン参照に置換済み）
4. 固定サイズ要素の調整（完了条件: 番号丸/バッジ/スナップショットでクリップが起きない）
5. 目視確認（完了条件: `npm run dev` で viewer を開き、対象パネルの可読性と崩れ無しを確認）
6. 自動テスト（完了条件: `npm run test:run` が成功）
7. 必要ならドキュメント追記（完了条件: 追記が必要な場合のみ、最小限の追記で完了）

## テスト計画
- 手動: `npm run dev` → viewerで `a11y-annotate` 表示（例: textarea demo）を開き、スクショ範囲のパネル内テキストが 1rem 相当以上で読めること＋クリップ無しを確認
- 自動: `npm run test:run`

## オープンクエスチョン
該当なし

