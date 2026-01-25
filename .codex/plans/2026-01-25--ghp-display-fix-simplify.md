# GitHub Pages表示修正（db7a316）レビュー + build-pages.cjs簡素化 + 統合作業

## 目標
- `dist-pages/src/demos.js` の `../packages/...` 参照による 404 を確実に解消したまま、`scripts/build-pages.cjs` の実装を **挙動を変えずに** 読みやすくする
- PR作成 or main統合の手順を確定する（テスト合格を前提）

## 背景
- 修正コミット `db7a316` で、`scripts/build-pages.cjs` に `rewriteImportsForDistPages()` を追加し、トランスパイル後の import を `../packages/<module>/` → `../<module>/` に書き換えることで dist-pages 構造と整合させている
- 現状の実装は「繰り返しキャプチャの仕様」を回避するために再マッチ/カウントをしており、**同じ結果をもっと短く書ける**
- 手元検証（現状）:
  - `npm run claude:quick` は成功
  - `npm run pages:build` 後、`dist-pages/src/demos.js` から `packages/` 文字列が消えており、`../utils/icons.js` を参照している
- 作業ツリーに `package-lock.json` の未コミット差分がある（今回の修正とは無関係に見えるため、PR/マージ前に除去したい）
- ローカル `main` が `origin/main` より遅れている（`main` は別worktreeで checkout 済み）ため、「直接mainにマージ」を選ぶ場合は作業場所/手順の整理が必要

## スコープ
- やること：
  - `scripts/build-pages.cjs` の `rewriteImportsForDistPages()` を同等動作のまま短くする
  - 未コミットの `package-lock.json` 差分を解消（破棄 or 必要なら別途説明して取り扱い）
  - 統合手順（PR or merge）を確定し実行できる状態にする
- やらないこと：
  - dist-pages のディレクトリ構造変更
  - import map / viewer.html 側の仕様変更
  - 依存追加や大規模リファクタ

## 前提 / 制約
- Plan フェーズのため、この返答では **コード変更しない**（承認後に実装）
- 受入基準を満たすまで、`npm run pages:build` と `npm run claude:quick` を再実行して確認する
- 「直接mainにマージ」は、このworkspaceでは `main` が別worktreeで checkout 済みの点を考慮して手順を選ぶ

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 該当なし

### その他（Docs/Marketing/Infra など）
- `scripts/build-pages.cjs`
  - `rewriteImportsForDistPages()` の正規表現を `((?:\\.\\./)+)` のように **繰り返し全体をキャプチャ**する形に変え、再マッチ/カウントを削除して短縮
  - 未使用の `srcPath` 引数を削除（呼び出し側も合わせて調整）
  - （任意）副作用 import（`import '../packages/...';`）も拾えるように、`from ...` だけでなく `import '...'` の形も対象に含める（挙動を壊さない範囲で）

## 受入基準
- [ ] `npm run pages:build` が成功する
- [ ] `dist-pages/src/demos.js` に `packages/` が含まれない（例: `rg "packages/" dist-pages/src/demos.js` が空）
- [ ] `dist-pages/src/demos.js` が `../utils/icons.js` を参照している
- [ ] `npm run claude:quick` が成功する
- [ ] `git status` がクリーン（少なくとも今回と無関係な `package-lock.json` 差分が無い）

## リスク / エッジケース
- 正規表現が「想定外の文字列」を書き換えるリスク（対象を import 文脈に限定して緩和する）
- `import()` のような動的 import を将来使った場合に取りこぼす可能性（必要なら対象拡張）
- `main` が別worktreeで checkout 済みのため、ローカルマージ手順を誤ると意図せず大きな差分/競合を招く

## 作業項目（Action items）
1. 作業ツリーの現状整理（完了条件: `git status` で意図しない差分が把握できている）
2. `package-lock.json` の未コミット差分を除去（完了条件: `package-lock.json` が差分なし、または「必要な差分」として説明できる）
3. `rewriteImportsForDistPages()` を短縮（完了条件: 再マッチ/カウントが消え、同等の置換ができている）
4. `rewriteImportsForDistPages()` の引数を整理（完了条件: 未使用引数が無く、呼び出し側も一致している）
5. `npm run pages:build` で成果物確認（完了条件: 受入基準の `packages/` 非存在と `../utils/icons.js` 参照を満たす）
6. `npm run claude:quick` を再実行（完了条件: type-check + test が成功）
7. 統合方針を選択して実行（完了条件: 下記オプションのいずれかが完了している）
8. 後始末（完了条件: 選択した統合方針に応じてブランチ/作業ツリーが期待状態）

## テスト計画
- `npm run pages:build`
- `rg "packages/" dist-pages/src/demos.js`（出力なし）
- `rg "icons\\.js" dist-pages/src/demos.js`（`../utils/icons.js` を含む）
- `npm run claude:quick`

## オープンクエスチョン
Implementation complete. What would you like to do?

1. Merge back to `main` locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?

