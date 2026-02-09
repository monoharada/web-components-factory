# DADS準拠グローバルメニュー実装計画（menu-list-box連携・Desktop専用）

- 承認日時: 2026-02-09
- 承認フレーズ: APPROVE PLAN

## 要約
- 新規に `dads-global-menu` / `dads-global-menu-item` を追加する。
- サブメニューは `dads-menu-list-box` を合成利用し、自動連携APIを追加する。
- 動作仕様はクリック中心、単一オープン、Desktopのみ、親はボタン扱いで固定する。

## 実装スコープ
1. `packages/components/global-menu/*` の新規作成（component/tokens/styles/define/index/test）
2. `packages/components/menu-list-box/*` の拡張（`opener-hidden` + `setFocusReturnTarget`）
3. `packages/autoload/dads/global-menu.ts` / `global-menu-item.ts` 追加
4. `packages/components/index.ts` export 追加
5. `src/demos/showcase-navigation.ts` に globalMenu デモ追加
6. `viewer.html` に importmap / selector / preload 追加
7. 生成物更新（`custom-elements.json`, `registry/install-registry.json`）

## 仕様固定値
- サブメニュー操作: クリック中心
- menu-list-box連携: 自動連携API
- 対象: Desktopのみ
- 開閉ルール: 単一オープン
- 親項目: ボタン（遷移しない）
- 先頭アイコンAPI: slot

## 実装後検証
- `npm run test:run -- packages/components/menu-list-box/menu-list-box.test.ts packages/components/global-menu/global-menu.test.ts`
- `npm run validate:wc`
- `npm run cem:analyze`
- `npm run contracts:check`
- `npm run registry:generate`
- `npm run registry:check`
- `npm run agents:verify`
