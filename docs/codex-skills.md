# Codex Skills（`.claude/skills` を正にする）

このリポジトリでは `.claude/skills/*` を **単一の正（source of truth）** として扱います。

Codex でも同じガイドラインを参照できるように、`~/.codex/skills` にコピーして **Codex Skills としてインストール**します。

## セットアップ（推奨）

```bash
npm run codex:install-skills
```

レジストリ整合チェック:

```bash
npm run skills:check
```

Skill 一覧は `registry/skills-registry.json` を機械可読の入口として扱います。

### 何が起きるか

`registry/skills-registry.json` のうち、`clients` に `codex` を含み、`status: "active"` の Skill を `~/.codex/skills/` にコピーします（現状は次の 8 Skill）。

- `<repo>/.claude/skills/css-writing-rules`
- `<repo>/.claude/skills/component-design-study`
- `<repo>/.claude/skills/headless-component-design`
- `<repo>/.claude/skills/wcf-ui-builder`
- `<repo>/.claude/skills/wcf-discovery`
- `<repo>/.claude/skills/wcf-install`
- `<repo>/.claude/skills/wcf-compose`
- `<repo>/.claude/skills/wcf-validate`

## 確認方法

```bash
ls -la ~/.codex/skills/css-writing-rules
ls -la ~/.codex/skills/component-design-study
ls -la ~/.codex/skills/headless-component-design
ls -la ~/.codex/skills/wcf-ui-builder
ls -la ~/.codex/skills/wcf-discovery
ls -la ~/.codex/skills/wcf-install
ls -la ~/.codex/skills/wcf-compose
ls -la ~/.codex/skills/wcf-validate
```

## WCF Skills Pack の使い方

- 入口: `wcf-ui-builder`
- 段階実行: `wcf-discovery` → `wcf-install` → `wcf-compose` → `wcf-validate`
- 詳細ガイド: `docs/knowledge/wcf-skills-pack.md`

## オプション

```bash
# 計画のみ表示（変更なし）
npm run codex:install-skills -- --dry-run

# managed marker を持つ未登録Skillを削除
npm run codex:install-skills -- --prune-managed

# deprecated を含める
npm run codex:install-skills -- --include-deprecated
```

## うまくいかないとき

- **workspace が変わった**
  - コピー方式のため壊れません（ただし `.claude/skills` を更新したら再インストールしてください）
- **同名ディレクトリが既に存在して失敗する**
  - `scripts/codex/install-skills.sh --force` を実行してください（既存を置換）
- **管理下ディレクトリの掃除もしたい**
  - `scripts/codex/install-skills.sh --prune-managed` を実行してください（`.codex-installed-from` がある管理対象だけ削除）
- **deprecated Skill も含めて検証したい**
  - `scripts/codex/install-skills.sh --include-deprecated` を実行してください（既定は除外）

## 品質ゲート（推奨）

```bash
npm run validate:wc
npm run agents:pre-pr
npm run agents:verify
```

## アンインストール（必要な場合）

```bash
rm ~/.codex/skills/css-writing-rules
rm ~/.codex/skills/component-design-study
rm ~/.codex/skills/headless-component-design
rm ~/.codex/skills/wcf-ui-builder
rm ~/.codex/skills/wcf-discovery
rm ~/.codex/skills/wcf-install
rm ~/.codex/skills/wcf-compose
rm ~/.codex/skills/wcf-validate
```
