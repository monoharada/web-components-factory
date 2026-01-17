# Codex Skills（`.claude/skills` を正にする）

このリポジトリでは `.claude/skills/*` を **単一の正（source of truth）** として扱います。

Codex でも同じガイドラインを参照できるように、`~/.codex/skills` にコピーして **Codex Skills としてインストール**します。

## セットアップ（推奨）

```bash
npm run codex:install-skills
```

### 何が起きるか

- `<repo>/.claude/skills/css-writing-rules` を `~/.codex/skills/css-writing-rules` にコピー
- `<repo>/.claude/skills/headless-component-design` を `~/.codex/skills/headless-component-design` にコピー

## 確認方法

```bash
ls -la ~/.codex/skills/css-writing-rules
ls -la ~/.codex/skills/headless-component-design
```

## うまくいかないとき

- **Conductor の workspace が変わった**
  - コピー方式のため壊れません（ただし `.claude/skills` を更新したら再度インストールしてください）
- **同名のディレクトリが既に存在していて失敗する**
  - `scripts/codex/install-skills.sh --force` を実行してください（既存を置換）

## アンインストール（必要な場合）

```bash
rm ~/.codex/skills/css-writing-rules
rm ~/.codex/skills/headless-component-design
```
