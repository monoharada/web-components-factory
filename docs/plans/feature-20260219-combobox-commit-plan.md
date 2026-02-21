# 実装計画: Combobox Commit Plan（準備用）

## 概要
- **作成日**: 2026-02-19
- **作成者**: Codex
- **目的**: `dads-combobox` 実装時のコミット粒度を先に固定し、レビュー性とロールバック容易性を確保する

## コミット方針
1. 1コミット1意図（仕様・実装・テスト・docsを必要最小で束ねる）
2. 挙動変更と純粋リファクタを分離する
3. 生成物（`custom-elements.json` など）は原因変更と同一コミットに含める

## 推奨コミット分割（実装時）

### Commit 1: API契約と骨格
- 対象:
  - `packages/components/combobox/*`（骨格）
  - `packages/autoload/*`（必要時）
  - 最小ドキュメント
- メッセージ案:
  - `feat(combobox): add dads-combobox skeleton and API contract`

### Commit 2: 状態機械と主要操作
- 対象:
  - `packages/components/combobox/*`（状態遷移、commit/cancel/restore）
  - 単体テスト
- メッセージ案:
  - `feat(combobox): implement state transitions with restore-on-cancel`

### Commit 3: UI・スタイル・DADS整合
- 対象:
  - combobox styles/tokens
  - single/multiple 表示差分
- メッセージ案:
  - `feat(combobox): align visual states with DADS study`

### Commit 4: a11yと検証修正
- 対象:
  - ARIA/キーボード修正
  - a11yテスト・回帰修正
- メッセージ案:
  - `fix(combobox): improve a11y interactions and keyboard behavior`

### Commit 5: CEM/ドキュメント最終同期
- 対象:
  - `custom-elements.json`
  - `src/demos.ts`, `viewer.html`（必要時）
  - docs更新
- メッセージ案:
  - `docs(combobox): sync demos and API docs for handoff`

## PR前チェックリスト
- [ ] `npm run validate:wc`
- [ ] `npm run cem:analyze`
- [ ] `npm run test:run`
- [ ] `npm run type-check`
- [ ] `npm run agents:pre-pr`
- [ ] `npm run agents:verify`
- [ ] `custom-elements.json` 差分が必要変更と同一PRに含まれている

## PR本文テンプレート（実装時）
```markdown
## Summary
- implement `dads-combobox` phase 1
- enforce clear-on-close and restore-on-cancel(single)
- keep DADS alignment for states and form behavior

## Changes
- [ ] API contract / component skeleton
- [ ] state transitions
- [ ] visual states and tokens
- [ ] a11y fixes
- [ ] docs and demos

## Validation
- [ ] npm run validate:wc
- [ ] npm run cem:analyze
- [ ] npm run test:run
- [ ] npm run type-check
- [ ] npm run agents:verify

## Risks
- screen reader behavior variance across environments
- keyboard interactions in edge-case focus transitions
```

## 更新履歴
- 2026-02-19: 初版作成
