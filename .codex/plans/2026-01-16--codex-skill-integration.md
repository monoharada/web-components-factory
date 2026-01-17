# Codexで `.claude/skills/*` を参照できるようにする（CSS / Headless）

## 目標
- Codex CLI 実行時に `.claude/skills/css-writing-rules` と `.claude/skills/headless-component-design` を **Codex側のSkillsとして参照可能**にし、コーディングルール逸脱を減らす。

## 背景
- `.claude/skills/*` にルールがあるが、Codex の Skill 検出対象は `~/.codex/skills` のため、そのままだと Codex が参照しない。
- `.claude/skills` を単一の正（source of truth）として維持したい。

## スコープ
- やること：
  - `~/.codex/skills` にコピーして Codex から見えるようにする
  - いつでも再現できるように repo 側にインストール手順・コマンドを用意する
  - Codex が参照する導線（AGENTS.md / Docs）を追加する
- やらないこと：
  - 既存コンポーネント実装の追加・改修
  - `.claude/skills` の内容変更（この作業では参照導線の整備のみ）

## 前提 / 制約
- `~/.codex/skills` に配置されたディレクトリ（`*/SKILL.md`）が Codex Skills として利用される。
- `.claude/skills` の更新を反映するには、再インストール（コピーのやり直し）が必要。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 該当なし

### その他（Docs/Marketing/Infra など）
- `scripts/` に `codex skills install` 相当のスクリプトを追加（コピー方式）
- `package.json` に `codex:install-skills` を追加
- `docs/` にセットアップ手順を追加
- ルート `AGENTS.md` を追加し、Codex が常に `.claude/skills/*` を参照するよう指示

## 受入基準
- [ ] `~/.codex/skills/css-writing-rules` と `~/.codex/skills/headless-component-design` がコピーで作成される
- [ ] `npm run codex:install-skills` で再インストールできる
- [ ] docs に手順があり、チームが迷わない
- [ ] ルート `AGENTS.md` に参照導線が明記されている

## リスク / エッジケース
- workspace の移動/削除で壊れない（コピー）。ただし `.claude/skills` を更新したら再インストールが必要。
- 既に同名の skill が `~/.codex/skills` にある場合の衝突 → その場合は上書きせず警告して終了（force オプションで上書き可能）

## 作業項目（Action items）
1. `~/.codex/skills` の現状確認（完了条件: 既存 skill と衝突しないことを把握）
2. インストールスクリプト実装（完了条件: コピーの作成/更新ができる）
3. npm script 追加（完了条件: `npm run codex:install-skills` で実行できる）
4. Docs 追加（完了条件: 手順と注意点が記載されている）
5. ルート `AGENTS.md` 追加（完了条件: Codex が参照すべき skill が明確）
6. 動作確認（完了条件: コピーが作成され、Codex が skill を検出できる）

## テスト計画
- `npm run codex:install-skills` 実行後に `ls -la ~/.codex/skills/{css-writing-rules,headless-component-design}` でコピーを確認
- `codex exec` で両スキルの要点を答えられることを確認（例: Critical Rules / 3層トークン構造）

## オープンクエスチョン
- 詰まる場合のみ。今回はなし。
