# Webfontなしフォントスタック対応プラン（改訂）

## 目標
- Web Font の読み込みを全廃する
- フォントスタックを以下に統一する
  - `body` 系: `'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif`
  - `code` 系: `'Noto Sans Mono', monospace`

## 背景
- 現状は Google Fonts CDN 読み込みと Noto Sans JP 自動適用ロジックが存在
- 要件は「Webfontなし」「上記スタックに揃うこと」

## スコープ
- やること：
  - Google Fonts への preconnect/link を削除
  - Noto Sans JP の Web Font ロード処理を無効化
  - タイポグラフィ/トークンのスタックを指定順に更新
  - ドキュメントの説明をWebfontなし前提に修正
  - 必要に応じて CEM 再生成
- やらないこと：
  - UI/レイアウト/見た目の再設計
  - コンポーネントAPIやCSS構造の変更

## 前提 / 制約
- Noto Sans JP / Noto Sans Mono は端末に無ければフォールバックする
- macOSの英字はシステムフォント任せ（-apple-system/BlinkMacSystemFont）
- 既存の fonts-loading / fonts-loaded クラス運用は意味が薄くなる可能性

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `packages/styles/design-tokens/index.ts` の `--font-family-sans` を
  `'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif` に変更
- `packages/styles/design-tokens/typography-tokens.ts` の `--font-family-sans` を同様に変更
- `packages/core/typography/base-typography-styles.ts` の
  `--system-font-stack` / `--base-font-family` を上記に合わせて整理
- `packages/core/typography/font-loader.ts` の Web Font 読み込み処理を no-op 化（link/preconnect/Font Loading API を使わない）
- `viewer.html` の Google Fonts link/preconnect を削除し、`body` の font-family を指定順に更新

### その他（Docs/Marketing/Infra など）
- `docs/typography-system.md` の「Google Fonts CDN」前提の説明を削除/修正
- `e2e-evidence/menu-list-box.fidelity.spec.ts` のコメントや診断説明を現状に合わせて調整（必要なら）
- CEM の差分が出る場合は `npm run cem:analyze`

## 受入基準
- [ ] Google Fonts への `<link>`/`preconnect` が実行経路に存在しない
- [ ] `--font-family-sans` と基底フォントが指定順に統一されている
- [ ] `code` フォントが `'Noto Sans Mono', monospace` になっている
- [ ] ドキュメントの説明が Webfont なし前提に更新されている
- [ ] CEM 差分があれば反映されている

## リスク / エッジケース
- Noto Sans JP/Mono が未インストールの環境では表示差分が出る
- `fonts-loading`/`fonts-loaded` 系の状態管理が意味を持たなくなり、テスト前提が変わる可能性

## 作業項目（Action items）
1. 対象ファイル一覧を確定（完了条件: 変更対象が明文化）
2. トークン/ベーススタイルのフォントスタックを更新（完了条件: 指定順になっている）
3. Web Font ローダーを無効化（完了条件: link/preconnect/Font Loading API が実行されない）
4. viewer の font 指定と link を更新（完了条件: HTML から Webfont が消えている）
5. ドキュメント修正（完了条件: Webfont 前提の記述が消えている）
6. 必要ならテスト/診断更新（完了条件: 記述の齟齬がない）
7. CEM 再生成と差分確認（完了条件: 差分を確認済み）

## テスト計画
- `npm run cem:analyze`
- `npm run validate:wc`（必要に応じて）
- `npm run ci`（可能なら）

## オープンクエスチョン
- なし
