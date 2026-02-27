# AI Consumption Guide（CEM-first）

この repo では、AI（Codex / Claude Code 等）がコンポーネントの「一覧・API・使い方・インストール手順」を安定して理解できるよう、**CEM（`custom-elements.json`）を単一の真実**として運用します。

## 1) AI はまず CEM を読む

推奨フロー：
1. `custom-elements.json` を読む（tagName / attributes / slots / events / cssParts）
2. `decl.custom.install` を読む（componentId / deps / define / source）
3. 必要なら MCP を使って “install recipe + snippet” を取得する

## 2) `decl.custom.install`（vendor install / recipe）

`tagName` が `dads-*` の custom element declarations には、CEM 生成時に次が注入されます：
- `decl.custom.componentId`
- `decl.custom.install`
  - `id` / `tags` / `define` / `call` / `deps` / `source.componentDir`

この情報だけで、AI は「どのコンポーネントを追加すべきか」「依存関係は何か」「どこから持ってくるか」を決定できます。

## 2.1) 軽量レジストリ（AI/CLI向け）

`custom-elements.json` は情報量が多いため、AI/CLI が「何を入れればよいか（deps/define/call/source/tags）」だけを高速に取得できるように、`registry/install-registry.json` を提供します。

- 生成元: `custom-elements.json`（`decl.custom.install` から抽出）
- 生成: `npm run registry:generate`
- チェック: `npm run registry:check`（CIで強制）
- 公開: `registry/install-registry.json` はコミット運用（`raw.githubusercontent.com` / jsDelivr 等で取得可能）
  - 例：`https://raw.githubusercontent.com/<owner>/<repo>/<ref>/registry/install-registry.json`

### 何が入っているか

- `components[componentId] = { id, tags, define, call, deps, source }`
- `tags[tagName] = componentId`

AI はまずこの軽量レジストリで “必要な部品の集合” を決め、詳細が必要になったときだけ `custom-elements.json` を参照します。

## 2.2) UI パターン（画面/レイアウトのレシピ）

コンポーネント単体に加えて、画面/レイアウトの “組み方” を AI が再利用できるように、`registry/pattern-registry.json` に **UI パターン（レシピ）**を持ちます。

- 取得: MCP `list_patterns` / `get_pattern_recipe`
- インストール: recipe の `components[]` を `wcf add ...` に渡す

## 3) MCP（Design System MCP）

起動：
```bash
npm run mcp:design-system
```

### 代表的な tools
- `list_components({ prefix? })`
  - コンポーネント一覧
- `get_component_api({ tagName?, className?, prefix? })`
  - API（attributes/slots/events/cssParts）
- `generate_usage_snippet({ component, prefix? })`
  - 最小の usage snippet
- `get_install_recipe({ component, prefix? })`
  - install recipe（componentId / deps / define / usageSnippet）
- `get_accessibility_docs({ component?, topic?, wcagLevel?, maxResults?, prefix? })`
  - コンポーネントの A11y チェックリストとガイドライン要点（topic=all では両ソース混在）
- `validate_markup({ html, prefix? })`
  - HTML 断片の検証（unknownElement=error, unknownAttribute=warning, forbiddenAttribute/tokenMisuse/accessibilityMisuse=warning）

## 4) 新規コンポーネント追加時の注意

新規コンポーネントは `docs/rules/new-component-dod.md` に従い、少なくとも以下を満たしてください：
- `npm run cem:analyze` 後、`decl.custom.install` が注入されている
- `npm run contracts:check` がパスする
- `npm run validate:wc` がパスする

## 5) テンプレート制作（DADS強制）と不足検知

- 依頼プロンプト（ベース）：`.codex/prompts/create-dads-template-page.md`
- 運用手順：`docs/rules/template-development-workflow.md`

### 主要コマンド

- `npm run validate:templates:quick`  
  `patterns:check` と `validate:wc` だけを実行する
- `npm run validate:templates`  
  `patterns:check` / `vendor:check` / `wcf:docs:check` / `validate:wc`
- `npm run templates:gaps:collect`  
  `collect gaps --scope all --out tmp/template-gaps.json`
- `npm run templates:gaps:dry-run`  
  起票計画を作成（作成自体はしない）
- `npm run templates:gaps:create`  
  ローカル `gh auth` が通る場合のみ Issue を作成

## 6) Issueテンプレート

不足起票テンプレートは `.github/ISSUE_TEMPLATE/dads-template-gap.yml` です。  
ラベルは `enhancement` のみで起票します。

## 7) GovUI Pattern Issue の引き継ぎルール

GovUI テンプレート群（`gov-*`）を AI に実装させる場合、Issue 本文の情報密度がそのまま実装品質に影響します。
`#106` 配下の Pattern Issue（`#112` から `#126`）は、次の共通契約を前提に扱ってください。

- 認証方式の列挙値は `municipal | e-gov | myna` で統一する。
- 申請状態辞書は次を共通語彙として再利用する。  
  `draft, in_progress, submitted, under_review, needs_fix, needs_resubmission, failed, completed, rejected, withdrawn, expired`
- Pattern Issue には「UI要件（セクション順）」「API/状態契約」「a11y要件」「受け入れ条件（挙動）」を必ず含める。
- 実装前の最小検証は `patterns:check` / `validate:wc` / `validate:templates:quick` / `templates:gaps:dry-run` を使う。

この契約は、テンプレートの再現性と cross-pattern 整合を維持するための運用上の Source of Truth とする。
