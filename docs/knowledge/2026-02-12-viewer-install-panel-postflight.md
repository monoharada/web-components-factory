# Frontend Implementation Learnings

## Context
- Feature or PR: Viewer install panel readability and install command guidance
- Date: 2026-02-12
- Scope:
  - `viewer.html` の Install パネル表示調整
  - `src/viewer-install-panel.ts` の install 表示ロジック更新
  - `src/viewer-install-panel.test.ts` と `tests/pages-build-viewer.test.ts` の検証強化

## What Worked
- `dads-description-list` を使うことで、メタ情報（`--dir` / `--prefix`）の意味付けが明確になった。
- install コマンドを npm 1本に統一し、導入手順の判断コストを下げられた。
- `resolveComponentId` と manifest 抽出の分岐テストを増やした結果、coverage の微小低下を回避できた。

## What Blocked Progress
- full coverage 比較で `lines/statements/branches` が `-0.1pp` を超えて一度 FAIL になった。
- 低下要因は新規ファイル `src/viewer-install-panel.ts` の未カバー分岐だった。

## Root Causes
- `-validation/-fidelity` のフォールバック分岐と `extractInstallComponentIdsFromManifest` の異常系/走査系が初回テストで不足していた。
- UI調整中心の変更でも、新規ロジック追加時は branch coverage が落ちやすい。

## New Rules
- Rule:
  - Viewer 用の新規ヘルパーを追加したら、正常系だけでなく「フォールバック分岐」と「不正入力系」を同時にテスト追加する。
- Rationale:
  - postflight の `0.1pp` 非劣化ゲートで、軽微な不足でも FAIL しうるため。
- Example:
  - `resolveComponentId` に対して `-validation/-fidelity` の除去ケースと `null` 返却ケースを追加。
  - `extractInstallComponentIdsFromManifest` に対して `null` / 型不一致 / 空文字ID を追加。

## Next Time Checklist
- [ ] 新規 helper 追加時に、`return null` / fallback / invalid input を最初からテスト化する
- [ ] full coverage 比較を実装終盤ではなく中盤に1回走らせる
- [ ] Viewer の説明文は 1 行連結にせず、構造化コンポーネント（例: `dads-description-list`）を優先する
