# Codex Skills（`.claude/skills` を正にする）

このリポジトリでは `.claude/skills/*` を **単一の正（source of truth）** として扱います。

Codex でも同じガイドラインを参照できるように、`~/.codex/skills` にコピーして **Codex Skills としてインストール**します。

## セットアップ（推奨）

```bash
npm run codex:install-skills
```

### 何が起きるか

次の 7 Skill を `~/.codex/skills/` にコピーします。

- `<repo>/.claude/skills/css-writing-rules`
- `<repo>/.claude/skills/headless-component-design`
- `<repo>/.claude/skills/wcf-ui-builder`
- `<repo>/.claude/skills/wcf-discovery`
- `<repo>/.claude/skills/wcf-install`
- `<repo>/.claude/skills/wcf-compose`
- `<repo>/.claude/skills/wcf-validate`

## 確認方法

```bash
ls -la ~/.codex/skills/css-writing-rules
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

## うまくいかないとき

- **workspace が変わった**
  - コピー方式のため壊れません（ただし `.claude/skills` を更新したら再インストールしてください）
- **同名ディレクトリが既に存在して失敗する**
  - `scripts/codex/install-skills.sh --force` を実行してください（既存を置換）

## 品質ゲート（推奨）

```bash
npm run validate:wc
npm run agents:pre-pr
npm run agents:verify
```

## アンインストール（必要な場合）

```bash
rm ~/.codex/skills/css-writing-rules
rm ~/.codex/skills/headless-component-design
rm ~/.codex/skills/wcf-ui-builder
rm ~/.codex/skills/wcf-discovery
rm ~/.codex/skills/wcf-install
rm ~/.codex/skills/wcf-compose
rm ~/.codex/skills/wcf-validate
```
