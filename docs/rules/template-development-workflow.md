# テンプレート開発ワークフロー（DADS強制 + Gap自動エスカレーション）

このドキュメントは、テンプレート制作依頼を DADS 準拠で行い、欠落要素を自動検知・欠損記録する運用ルールです。

## 1) コーディング前提

- テンプレート作成は `dads-*` コンポーネントを前提に行う。
- 必要なら `.codex/prompts/create-dads-template-page.md` をベースプロンプトとして使用する。
- 出力は `## 1) 生成HTML / ## 2) 変更内容 / ## 3) テンプレート不足ギャップ` の3見出しを基本構成にする。

## 2) バリデーション

### 2.1 テンプレート全体検証

```bash
npm run validate:templates
```

は `node scripts/dads-template/cli.js validate templates --mode full` を呼び、以下を通す。

- `patterns:check`
- `vendor:check`
- `wcf:docs:check`
- `validate:wc`

### 2.2 クイック検証

```bash
npm run validate:templates:quick
```

は以下のみ実行する。

- `patterns:check`
- `validate:wc`

## 3) Gap収集

```bash
npm run templates:gaps:collect
# 出力: tmp/template-gaps.json
```

既定は `collect gaps --scope all --out tmp/template-gaps.json`。  
`scope` は `patterns|viewer|all`。  
`patterns` は `registry/pattern-registry.json` の `patterns[*].html` を検証。  
`viewer` は `wc.config.js` の `include` を検証。

### Gap分類ルール

- `unknownElement` → `component-gap`
- `unknownAttribute` / `forbiddenAttribute` → `api-gap`
- それ以外の診断 → `expression-gap`
- `--mark-expression-gap <gapId>` 指定時は対象IDを `expression-gap` として上書き

## 4) 起票（ローカルのみ）

### 4.1 ドライラン

```bash
npm run templates:gaps:dry-run
```

`templates:gaps:collect` → `escalate gaps` で起票予定を出す。  
GitHub API 呼び出しは実行しない。

### 4.2 実起票

```bash
npm run templates:gaps:create
```

`--create` を付けて `gh auth status` を検査し、ローカル認証済み時のみ作成する。  
重複起票防止キーは `type:scope:proposedComponentId`（`dedupeKey`）を使う。

### Issue フォーマット

- タイトル: `[template-gap][{type}][{scope}][{proposedComponentId}] {title}`
- dedupeKey を本文に必須明記
- ラベル: `enhancement` のみ
- `expression-gap` は `proposedComponentId` を `expr:<slug>` 形式（`slug` は英数ハイフン）

### エラーハンドリング

- `status=failed` が1件以上あると `0` 以外で終了。
- `--create` 時のみ `status=failed` 件数分の `tmp/template-gaps.retry.json` を出力。
- 重複検知時は `skipped-existing` として新規作成しない。

## 5) エラーレスポンス規約

- `INPUT_INVALID`
- `VALIDATION_FAILED`
- `GH_AUTH_REQUIRED`
- `ISSUE_CREATE_FAILED`
- `INTERNAL_ERROR`

## 6) 参照

- エスカレーションissueテンプレート: `.github/ISSUE_TEMPLATE/dads-template-gap.yml`
- テンプレートgap収集 CLI: `scripts/dads-template/cli.js`

## 7) GovUI Pattern Issue 標準（#106 系）

GovUI テンプレート（`gov-*`）の Issue を新規作成・更新するときは、以下を必須項目として固定する。

### 7.1 必須セクション

- 背景（調査反映）
- 目的
- 非ゴール
- 想定URL
- 依存関係（先行/後続）
- 実装対象ファイル（絶対パス）
- 利用コンポーネント（想定）
- UI要件（必須セクション順）
- API/状態/バリデーション契約
- アクセシビリティ要件
- 実装制約（#104準拠）
- 検証コマンド
- 受け入れ条件（挙動ベース）
- 参考（一次情報URL）

### 7.2 共通固定値

- 認証方式（初期対象）: `municipal | e-gov | myna`
- 申請状態辞書（共通）:
  `draft, in_progress, submitted, under_review, needs_fix, needs_resubmission, failed, completed, rejected, withdrawn, expired`
- Pattern Issue の最低検証コマンド:
  - `npm run patterns:check`
  - `npm run validate:wc`
  - `npm run validate:templates:quick`
  - `npm run templates:gaps:dry-run`

### 7.3 運用メモ

- 本文が短い場合は「実装者が迷わない粒度」になるまで具体化してから着手する。
- 複数 Pattern を同時に更新した場合は、状態辞書と認証方式の整合を横断確認する。
