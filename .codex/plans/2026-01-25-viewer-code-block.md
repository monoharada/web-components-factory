# viewer.html：HTMLコードブロック（Web Component）PoC + CI必須化

## 目標
- `viewer.html` のコンポーネント説明ページで「HTMLの使用例コード」を表示・コピーできるコードブロック用Web Componentを用意する
- まずは既存の1ページでPoC実装し、次回以降の新規コンポーネント追加時は “説明ページにコードブロック投入” をCIで必須化する

## スコープ
- やること：
  - HTML表示/コピー用のWeb Component（例: `wc-code-block`）を追加
  - Autoloaderアダプタ（`packages/autoload/meta/`）＋ `viewer.html` importmap へ登録
  - 既存の1コンポーネントページ（PoC）に組み込み
  - 次回以降の新規デモ追加でコードブロック必須をCIで検出（既存ページは当面“既存扱い”で除外しつつ、将来 tighten 可能な設計）
  - DoD/テンプレ/雛形ドキュメントへ「Usage code 必須」を明文化
- やらないこと：
  - 外部依存（Prism/Shiki等）によるシンタックスハイライト導入
  - TS実装ソースの表示（HTMLのみ）
  - 新規HTMLファイル追加（DoDで禁止）

## 実装方針（概要）
- `wc-code-block` は `<template>` 子要素の `innerHTML` を取り出し、dedent後に `pre > code` へ `textContent` として表示する
- Copyは `navigator.clipboard.writeText` を優先し、失敗時は `document.execCommand('copy')` フォールバックを用意する
- Copy結果は aria-live で通知する

## CI必須化（新規デモのみ）
- `src/demos.ts` の `export const demos = { ... }` のキー一覧を抽出し、baseline（導入時点のキー一覧）に存在しない “新規キー” を検出する
- 新規キー（ただし `*Fidelity` / `empty` は除外）のデモ本文には `<wc-code-block` を含めることを要求する
- baselineは `scripts/wc/demo-keys-baseline.json` としてリポジトリに固定化する

## 受入基準
- `wc-code-block` がCEMに登録され、`validate:wc` がパスする
- PoCページでコード表示とCopyが動作する
- CIで新規デモキーに対する必須チェックが動作する（既存キーは落ちない）
- `npm run ci` がパスする

