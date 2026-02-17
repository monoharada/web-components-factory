## Contract (Invariants)

- C-01: Product code non-implementation
  - Rule: この作業では Skill/Docs/Registry/Test 以外のプロダクト実装コードを変更しない。
  - Verification: 変更ファイルが `.claude/skills/`, `docs/`, `registry/`, `tests/`, `.codex/plans/` に限定される。

- C-02: Source of truth continuity
  - Rule: Skill 本体の正は `.claude/skills/component-design-study/` とし、重複管理を作らない。
  - Verification: 新規内容は同ディレクトリ配下に集約され、外部コピーを直接編集しない。

- C-03: Output contract compatibility
  - Rule: 出力は「人間向け要約 + 機械可読JSON」の2部構成を維持する。
  - Verification: `SKILL.md` の `出力契約` に2部構成が明示されている。

- C-04: Full-step schema determinism
  - Rule: JSON schema で Step 1〜10 の artifacts キーをすべて定義し、本文のStep定義と矛盾しない。
  - Verification: Stepごとの artifacts キー一覧を照合し、不一致がないことをレビューで確認する。

- C-05: Non-linear execution model
  - Rule: Step分解は説明モデルであり、実務は並行実行・差し戻し前提であることを明文化する。
  - Verification: `実行モデル` セクションに並行原則・差し戻しポリシー・フィードバックループを記載する。

- C-06: Deterministic gate/error triggering
  - Rule: `evidence_gates` と失敗コードに if-then の発火条件を付与し、`evidence_gates` は reason 付き形式（`gate`, `passed`, `reason`）で出力する。
  - Verification: 各ゲート/失敗コードに「条件」「出力状態」が記載され、ゲート出力の reason が空でないことを確認する。

- C-07: Progressive disclosure structure
  - Rule: `SKILL.md` は Quick Reference + Decision Tree + Core Workflow を中心にし、詳細は `references/` に分離する。
  - Verification: `references/` 配下の参照ファイルが実在し、`SKILL.md` から到達可能である。

- C-08: Auditability and reproducibility
  - Rule: few-shot 出力例を最低3パターン持ち、同じ入力から同じ判定に到達できる形にする。
  - Verification: Step2完了時/Step5比較時/Step8差し戻し時の3例が記載されている。

- C-09: Repository consistency
  - Rule: Skill追加に伴う docs/registry/tests の整合を維持する。
  - Verification: `npm run skills:check` が成功し、ドキュメント記載件数が実数と一致する。

- C-10: Goal guardrail
  - Rule: 成果物は WCAG 2.2 AA を最低ラインとして扱い、A11y違反は失敗定義に従って見直す。
  - Verification: Goal/Scope/Plan 内でAA必須項目と失敗条件が一貫して参照されている。
