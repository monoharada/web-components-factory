# 実装計画: Issue #74 `href` 安全化ロジックの共通化（`global-menu` / `utility-link`）

## 要約
- `href` 安全化判定を共通ユーティリティへ集約し、2コンポーネントの重複実装を解消します。
- 許可ルールは **Issue本文準拠** で固定します。  
  許可: `#`, `/`, `./`, `../`, `http/https`, `mailto`, `tel`
- `utility-link` の現行テストにある `docs/page`, `page.html`, `?q=1` は不許可へ合わせて更新します。

## 公開API/インターフェースへの変更
- カスタム要素の公開API（属性・イベント・slot・part）に変更はありません。
- 追加するのは内部実装用ユーティリティのみです。  
  追加: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/packages/utils/safe-href.ts`（`isSafeHref(href: string): boolean`）

## 実装手順（決定済み）
1. 承認後、計画を保存します。  
保存先: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/.codex/plans/2026-02-09--issue74-href-safe-util.md`
2. 共通ユーティリティを新規作成します。  
対象: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/packages/utils/safe-href.ts`  
内容: 許可ルールを1関数に集約し、空文字・不正スキームは `false` を返す実装に固定。
3. 共通ユーティリティの単体テストを追加します。  
対象: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/packages/utils/safe-href.test.ts`
4. `global-menu` からローカル `isSafeHref` を削除し、共通関数を利用します。  
対象: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/packages/components/global-menu/global-menu.ts`
5. `utility-link` からローカル `isSafeHref` を削除し、共通関数を利用します。  
対象: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/packages/components/utility-link/utility-link.ts`
6. コンポーネントテストを方針に合わせて更新します。  
対象: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/packages/components/utility-link/utility-link.test.ts`  
対象: `/Users/reiharada/.codex/worktrees/7fb1/web-components-factory/packages/components/global-menu/global-menu.test.ts`（必要最小限の追記のみ）

## テストケース・シナリオ
- 共通ユーティリティ（許可）  
`#`, `/path`, `./relative`, `../parent`, `https://example.com`, `http://example.com`, `mailto:hello@example.com`, `tel:+81-90-0000-0000`
- 共通ユーティリティ（拒否）  
`javascript:alert(1)`, `data:text/html;base64,...`, `ftp://example.com`, `?q=1`, `docs/page`, `page.html`, `''`, `'   '`
- `global-menu`  
不正URLが `#` にフォールバックし、既存の `target/rel/download` 同期に影響がないこと。
- `utility-link`  
不正URLが `#` にフォールバックし、tail icon 表示ロジック（`target="_blank"` / `download` 優先）に影響がないこと。

## 検証コマンド
- 前提: `node_modules` が未導入のため、実装フェーズで `npm ci` を先に実行
- `npm run test:run -- packages/utils/safe-href.test.ts packages/components/global-menu/global-menu.test.ts packages/components/utility-link/utility-link.test.ts`
- `npm run test:run`
- `npm run validate:wc`（Issue DoD準拠の確認）

## 前提・デフォルト
- 方針は「Issue本文準拠」を採用済みです。
- スコープは Issue #74 の記載どおり `global-menu` / `utility-link` + 共通ユーティリティ + 関連テストのみです。
- `menu-list` 側の同種ロジックは今回の非スコープとし、必要なら別Issueで追跡します。
- 実装開始条件は `APPROVE PLAN` です。
