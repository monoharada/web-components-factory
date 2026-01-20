# ページナビゲーション（Pagination）Web Component 実装 Plan

## 目標
DADSトークン準拠の `dads-page-navigation` を新規追加し、Figmaの Page Navigation（Text / Arrow / Outlined）をアクセシブルに再現できるようにする。

## 背景
- Figmaの「Page Navigation」デザインは、前/次ナビゲーション + （任意の）ステータス表示を複数スタイルで提供している。
- 既存 `packages/components` に該当コンポーネントが無いため、WCAG 2.2 AAを意識した実装を追加したい。

## スコープ
- やること：
  - `dads-page-navigation` コンポーネント新規追加（Text / Arrow / Outlined の3種）
  - Arrowは Size（L/M/S/XS）と Hover 状態を再現
  - Text/Outlined は Default/Hover を再現
  - `nav` セマンティクス、アイコンのみ時のアクセシブルネーム、フォーカス可視（DADS）を満たす
  - `packages/components/index.ts` / `packages/autoload/dads` / `viewer.html` / `src/demos.ts` を更新してデモ表示可能にする
  - `vitest` による基本テスト追加
- やらないこと：
  - ページ番号の羅列（`1 2 3 ...`）や省略表示などの“フルページネーション”は実装しない
  - ルーティング/ページ遷移の責務（SPAのrouter連携等）は持たない

## 前提 / 制約
- デザイン根拠（スクショ確認）:
  - コンポーネント: `15488-1320`（Type=Text/Arrow/Outlined）
  - Building Blocks（Text/Outlined）: `15451-243`
  - Building Blocks（Arrow）: `15459-570`
  - 使用例: `15461-3148`（次のみ + 1/24）, `15488-1818`（前の3件/次の3件）, `15470-3113`（ページ名ラベル例）
- DADSトークンは既存の `applyDADSTokens()` を利用し、色/フォントは `var(--color-primitive-blue-*)` 等で参照する。
- CSSは `::part()` とローカルトークン（`--dads-*`）中心で外部カスタム可能にする（クラス依存を避ける）。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- 新規コンポーネント `dads-page-navigation`
  - 役割: 前/次リンク（または“前/次”コントロール）と、任意のステータス（例 `1/24`）を横並びに配置する
  - 推奨マークアップ（Shadow DOM内）
    - `<nav part="nav" aria-label="…">`
    - `<a part="control prev" rel="prev">…</a>`
    - `<span part="status">…</span>`（必要時のみ表示）
    - `<a part="control next" rel="next">…</a>`
  - アクセシビリティ
    - `nav` に `aria-label`（デフォルト: `ページナビゲーション`、属性で上書き可）
    - Arrow（アイコンのみ）では、視覚的に隠したラベル（visually-hidden）を内包し、SRで「前のページ/次のページ」が読める
    - フォーカスは `applyDADSFocusStyles()` に寄せつつ、コントロールが `:focus-visible` で明確に可視化される
  - API（案）
    - `type="text|arrow|outlined"`（デフォルト `text`）
    - `size="l|m|s|xs"`（Arrowのみ有効、デフォルト `m`）
    - `prev-href` / `next-href`（未指定の場合は該当コントロールを非表示）
    - `prev-label` / `next-label`（デフォルト `前のページ` / `次のページ`。例: `前の3件`/`次の3件` にも対応）
    - ステータス表示は「さまざまな表記」に対応できるよう、以下の優先順位で提供:
      1. `<slot name="status">`（任意の文字列/マークアップ）
      2. `status` 属性（任意文字列）
      3. `current` / `total` 属性（数値） + `status-separator` 属性（デフォルト `'/'`）
    - `hide-status`（強制的にステータス非表示）
  - レイアウト（案）
    - status有り: `prev  status  next` の3点配置（Text/Arrow/Outlined共通）
    - status無し: `prev  next` の2点配置
  - スタイル（FigmaのBuilding Blocksベース）
    - Text: 下線（hoverで背景 `--color-primitive-blue-50`）
    - Outlined: 枠線+角丸8px、hoverで背景色を付与
    - Arrow: 円形、Size別の寸法（L/M=44px、S=34px、XS=24px）と hover の枠色変化
- トークン設計（2層 + ローカルAPI）
  - `page-navigation-tokens.ts` を新設し、セマンティック→ローカル（`--dads-page-navigation-*`）へマッピング
  - `page-navigation-styles.ts` ではプロパティ定義（色/枠/余白/サイズ）を1箇所に寄せ、状態は変数再代入で実装

### その他（Docs/Marketing/Infra など）
- エクスポート/オートロード/デモ導線追加
  - `packages/components/index.ts` に export 追加
  - `packages/autoload/dads/page-navigation.ts` 追加
  - `viewer.html` の importmap と selector に追加
  - `src/demos.ts` に page navigation デモを追加

## 受入基準
- [ ] `dads-page-navigation` が登録でき、Shadow DOMが生成される
- [ ] `type="text|arrow|outlined"` で見た目が切り替わる
- [ ] Arrowタイプでアイコンのみ表示でも、SR向けに前/次が判別できる（アクセシブルネームがある）
- [ ] `prev-href`/`next-href` 未指定時に該当コントロールが表示されない
- [ ] ステータス表示が slot / status属性 / current+total+separator で柔軟に表現できる
- [ ] キーボードTabで前→（status）→次へフォーカス移動でき、`:focus-visible` が明確
- [ ] `npm run test:run` と `npm run type-check` が通る

## 作業項目（Action items）
1. `packages/components/page-navigation/` を作成し雛形追加（完了条件: `index.ts` からクラス/defineが参照可能）
2. `packages/components/page-navigation/page-navigation-tokens.ts` を作成（完了条件: セマンティック→`--dads-page-navigation-*` のマッピングが定義される）
3. `packages/components/page-navigation/page-navigation-styles.ts` を作成（完了条件: Text/Outlined/Arrow の default/hover と Arrow size がCSSで表現できる）
4. `packages/components/page-navigation/page-navigation.ts` を実装（完了条件: 属性変更で href/label/status/type/size が反映される）
5. `packages/components/page-navigation/page-navigation-define.ts` を追加（完了条件: `defineDefaultPageNavigation()` で既定prefix登録できる）
6. `packages/autoload/dads/page-navigation.ts` を追加（完了条件: viewerのautoload経由でロードされる）
7. `packages/components/index.ts` / `viewer.html` / `src/demos.ts` を更新（完了条件: Viewerのセレクタからデモ表示できる）
8. `packages/components/page-navigation/page-navigation.test.ts` を追加（完了条件: 受入基準に対応するユニットテストが通る）
9. 検証コマンド実行（完了条件: `npm run type-check` と `npm run test:run` が成功）

## テスト計画
- `npm run type-check`
- `npm run test:run`
- viewer上で見た目（hover/focus）と、Arrowタイプの読み上げ（visually-hidden）を確認

