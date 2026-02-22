# STEP09 Implement Templates Plan（承認済み）

- Date: 2026-02-19
- Status: APPROVED
- Scope: STEP08仕様に基づく municipal 5ページテンプレート実装（top/contact/service/hub/article）

## 実装方針
1. 既存配置規約に合わせる
- 実装導線は `src/demos/*.ts` + `src/demos.ts` + `viewer.html` を使用
- テンプレート本体は `src/templates/municipal.ts` に集約

2. 5ページテンプレートを実装
- `top/contact/service/hub/article` の `render*Template()` を実装
- STEP08 の MUST / SHOULD / Variant を反映
- 既存DSプリミティブのみ使用
- `data-dads-typeset` をテンプレートルートに付与
- 状態は属性ベース（`[open]`, `[aria-expanded]`, `[current]`, `[error]`）
- 色/余白/フォントはトークンのみ使用

3. デモ導線を最小更新
- `src/demos/municipal-templates.ts` を追加
- `src/demos.ts` に登録
- `viewer.html` に1エントリ追加
- 各ページで主要Variantを最低1つ表示

4. 最小テスト追加
- `src/demos/municipal-templates.test.ts` を追加
- 5ページ表示、主要Variant、`data-dads-typeset` 契約を検証

5. Gate G09 検証
- `npm run validate:wc`
- `npm run test:run`
- `npm run agents:verify`
- 失敗時は実装起因/既存起因を切り分け、証跡付きで報告
