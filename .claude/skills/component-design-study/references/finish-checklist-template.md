# Finish Checklist Template

Step9-10 の完了判定テンプレート。

## Step9: Finish Work

目的:
- 本番マージ可能な状態へ仕上げる

成果物:
- `finish_checklist`
- `release_readiness`

### Checklist (Template)

```md
- [ ] 命名規則に準拠（component/state）
- [ ] Step3 の状態一覧と実装対象状態が一致
- [ ] Step4-6 の判断ログが参照可能
- [ ] 必須A11y条件（AA）が欠落なく定義済み
- [ ] 主要フローの検証結果が記録済み
- [ ] 作例リンクが更新されている
```

### Release Readiness (Template)

```json
{
  "release_readiness": [
    { "item": "naming", "status": "pass", "note": "" },
    { "item": "state_coverage", "status": "pass", "note": "" },
    { "item": "aa_definition", "status": "pass", "note": "required items 100% defined" },
    { "item": "docs_linkage", "status": "pass", "note": "" }
  ]
}
```

## Step10: Template Packaging

目的:
- コンポーネント利用をテンプレート画面へ再利用可能な形にする

成果物:
- `usage_patterns`
- `replaceability_scope`
- `handoff`

### Usage Pattern Template

```json
{
  "usage_patterns": [
    {
      "template_name": "example-signup-screen",
      "purpose": "新規登録の本人確認",
      "preconditions": ["メール送信導線あり"],
      "required_states": ["idle", "error", "success"]
    }
  ]
}
```

### Replaceability Scope Template

```json
{
  "replaceability_scope": [
    {
      "token_or_part": "label_text",
      "replaceable": true,
      "constraints": ["意味を変えない", "AA要件を損なわない"]
    }
  ]
}
```

### Handoff Template

```md
## Handoff
- 対象: [component / template]
- 依存条件: [...]
- 既知の制約: [...]
- 変更時の再検証手順: [...]
```

## Exit Conditions

- Step9 と Step10 の成果物が相互参照できる
- テンプレート側で差し替え可能範囲が明文化されている
- A11y 要件を崩さず転用可能である
