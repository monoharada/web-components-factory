# 実装計画: Notification Banner 再表示導線 + Mobile Mock（Half）

## 1. 概要
- 目的は3点です。
1. `dads-notification-banner` に「閉じた後に再表示できる導線」を追加する。
2. モバイル作例を見やすくする `dads-mobile-mock`（Half想定）を新規カスタムエレメントとして追加する。
3. 通知バナーのモバイル作例を「モック内は1件表示」「全体レイアウトは最大2列」に固定する。
- 既存コード規約は `css-writing-rules` と `headless-component-design` に合わせます。
- 既存互換性のため、現在の閉じる挙動（閉じると非表示）をデフォルトで維持します。

## 2. 変更する公開API / 型 / インターフェース
1. `dads-notification-banner`（既存拡張）
- 新規属性: `dismiss-mode="hide|collapse"`（デフォルト: `hide`）
- 新規属性: `restore-label`（デフォルト: `再表示`）
- 新規イベント: `dads-notification-banner-restore`
- 新規 part: `restore`, `restore-button`, `restore-text`
- 挙動定義:
  - `dismiss-mode="hide"`: 現状維持（`hidden` + `data-dismissed`）
  - `dismiss-mode="collapse"`: 本体を消さず折りたたみ状態にし、`restore-button` で復帰可能
2. `dads-mobile-mock`（新規）
- 用途: モバイル作例の見せ枠（今回は Half 用）
- 属性: `label`（任意）
- slot: default（中に通知バナー1件を置く）
- part: `frame`, `viewport`, `label`
- CSS変数（最低限）: `--dads-mobile-mock-width`（初期値 `360px`）, `--dads-mobile-mock-radius`, `--dads-mobile-mock-padding`

## 3. 実装対象ファイル
1. 既存通知バナー拡張
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/notification-banner/notification-banner.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/notification-banner/notification-banner-styles.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/notification-banner/notification-banner-tokens.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/notification-banner/notification-banner.test.ts`
2. 新規モバイルモック追加
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/mobile-mock/mobile-mock.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/mobile-mock/mobile-mock-styles.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/mobile-mock/mobile-mock-tokens.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/mobile-mock/mobile-mock-define.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/mobile-mock/index.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/mobile-mock/mobile-mock.test.ts`
3. 接続・公開・デモ
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/components/index.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/packages/autoload/dads/mobile-mock.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/src/demos/showcase-components.ts`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/viewer.html`
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/custom-elements.json`（再生成）
- `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/registry/install-registry.json`（再生成）

## 4. 実装手順（決定済み）
1. 承認済みPlanを保存
- 保存先: `/Users/reiharada/.codex/worktrees/ee0a/web-components-factory/docs/plans/feature-20260208-notification-banner-reopen-mobile-mock.md`
2. `dads-notification-banner` に `dismiss-mode="collapse"` と復帰UIを追加
3. `dads-mobile-mock` を新規追加（Half前提の既定幅360px）
4. モバイル作例を `dads-mobile-mock` でラップ
- モック内部は1バナーのみ
- 作例全体グリッドは `repeat(2, minmax(0, 1fr))` で最大2列固定
5. closeボタンとdense作例を再調整
- `compact close` でも確実にクリック可能な当たり判定を維持
- ボタン色（success/error/warning/info-1/info-2）を全パターンで確認
6. CEM/registry/契約チェックを実行して整合性を確保

## 5. テストケース / 検証シナリオ
1. `dismiss-mode="hide"` で従来どおり閉じると非表示になる
2. `dismiss-mode="collapse"` で閉じると折りたたみ表示になり `hidden` にならない
3. 折りたたみ状態で再表示ボタン押下時に元のバナーへ復帰する
4. `dads-notification-banner-restore` が発火する
5. `dense + close-style="compact"` でも close/restore が動作する
6. 各 `type` の action ボタン色が期待どおり（solid/outlined）
7. `dads-mobile-mock` が slot コンテンツを正しく表示し、幅が既定360pxで崩れない
8. モバイル作例セクションが3列にならず最大2列で固定される

## 6. 実行コマンド
1. `npm run cem:analyze`
2. `npm run contracts:check`
3. `npm run registry:check`
4. `npm run validate:wc`
5. `npm run test:run`
6. `npm run agents:verify`

## 7. 前提・デフォルト（今回固定）
1. 「Mockハーフ」は Figma モバイル基準幅 `360px` を採用
2. モバイル作例は「モック内1件表示」、外側レイアウトは「最大2列」
3. フルモック（Mock全部）は今回はスコープ外
4. 既存 `dismissible` のデフォルト挙動は互換維持（`dismiss-mode="hide"`）
5. 通知の再表示状態の永続化（localStorage/サーバー保存）は今回は実施しない
