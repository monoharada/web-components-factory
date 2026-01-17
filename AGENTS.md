# Agent instructions

## 必ず参照するガイドライン（Source of Truth）

このリポジトリでは、実装ガイドラインの正は `.claude/skills/*` です。

- `.claude/skills/css-writing-rules/SKILL.md`
- `.claude/skills/headless-component-design/SKILL.md`

## Codex での参照（推奨）

Codex の Skills は `~/.codex/skills` を参照するため、初回のみ以下を実行してコピーをインストールしてください。

- `npm run codex:install-skills`

手順の詳細は `docs/codex-skills.md` を参照してください。

## 運用ルール

- CSS/トークン設計/セレクタ設計の変更は `css-writing-rules` を最優先で適用する
- コンポーネントAPI設計（part/override/3層トークン等）は `headless-component-design` を適用する
- `.claude/skills` の内容を勝手にコピーして別ファイルに二重管理しない（必要なら `.claude/skills` を更新する）
