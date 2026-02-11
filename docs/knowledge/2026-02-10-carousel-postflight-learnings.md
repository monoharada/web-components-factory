# Frontend Implementation Learnings

## Context
- Feature or PR: `dads-carousel` 新規実装（items/slot Hybrid API、Splide準拠イベント拡張、viewerデモ追加）
- Date: 2026-02-10
- Scope: コンポーネント本体、autoload、公開エクスポート、デモ、a11y注釈、CEM/registry生成物

## What Worked
- `dads-carousel-change`（ユーザー操作のみ）を維持しつつ、`dads-carousel-index-change` で API/属性変更も一元監視できた。
- `renderSeq` ガードと `min-block-size` ロックで、画像切替中の高さ崩れを抑制できた。
- `showcase-navigation` に「写真データ準備」セクションを置くことで、`items` 入力の実運用導線が明確になった。

## What Blocked Progress
- `agents:verify` は生成物差分（`custom-elements.json`, `registry/install-registry.json`）がある作業中状態では必ず停止する。
- coverage比較時、base側で `pages-build-viewer` テストが既定 5000ms だとタイムアウトしうる。

## Root Causes
- このリポジトリのガードは「生成物差分ゼロ（対HEAD）」前提で、未コミットの生成物更新を FAIL と判定する仕様。
- coverage測定は全テスト実行のため、環境負荷で一部E2E寄りテストが既定タイムアウトに近づく。

## New Rules
- Rule: coverage比較（base/HEAD）は両方とも `--testTimeout=20000` を明示して実行する。
- Rationale: 一時的な環境揺らぎで base だけ失敗する誤判定を防ぐため。
- Example: `npm run test:coverage -- --testTimeout=20000`

## Next Time Checklist
- [ ] `npm run cem:analyze` と `npm run registry:generate` を先に実行して生成物差分を確定する
- [ ] coverage比較は base/HEAD とも同一オプションで取得する
- [ ] `agents:verify` の FAIL が生成物ガード由来かどうかを最初に切り分ける
