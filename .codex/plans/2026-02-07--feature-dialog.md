# 2026-02-07 -- dads-dialog 実装計画（承認済み）

## 目的
DADS v2 に未実装のモーダル相当を、このリポジトリの既存トンマナ（token/part/define/autoload/CEM）に合わせて `dads-dialog` として追加する。

## 要件
- `commandfor` でモーダルを起動/終了できること
- 開閉前後イベントを取得可能にすること
- 閉じるボタンはオプション
- light dismiss なし
- フォーカストラップ実装
- APG準拠のアクセシブルな実装
- 視覚境界は影（shadow）ではなく罫線、境界コントラスト 3:1 以上
- backdrop 色は `--color-neutral-opacity-gray-100` をセマンティック→ローカル（`--dads-*`）で再代入

## 実装スコープ
1. `packages/components/dialog/*` 新規追加
2. `packages/autoload/dads/dialog.ts` 追加
3. `packages/components/index.ts` へ export 追加
4. `src/demos` と `viewer.html` へ dialog デモ導線追加
5. CEM/registry/validate/test/type-check 実行

## 検証コマンド
- `npm run cem:analyze`
- `npm run contracts:check`
- `npm run registry:generate && npm run registry:check`
- `npm run validate:wc`
- `npm run test:run`
- `npm run type-check`
