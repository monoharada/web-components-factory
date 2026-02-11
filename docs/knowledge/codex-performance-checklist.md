# Codex 遅延チェックリスト（このリポジトリ向け）

Codex App / CLI が重いときに、まず最小コストで切り分けるための手順です。  
順序は「ログ肥大 → 巨大差分 → 大量untracked → worktree増殖」を前提にしています。

## 1. ワンショット診断

```bash
npm run codex:perf:diagnose
```

主に以下を確認します。

- `codex-tui.log` などのサイズ上位
- `custom-elements.json` のサイズ・更新頻度
- untracked 件数とディレクトリ偏り
- worktree 件数
- `git status` / `git diff` の簡易時間計測

## 2. ログ肥大の対処（最優先）

`~/.codex/log/codex-tui.log` が大きい場合は、まずローテートします。

```bash
npm run codex:perf:rotate-log
```

- 既定閾値は 100MB
- バックアップは `/tmp/codex-log-archive/` に退避
- 退避後に空ファイルを再作成

## 3. 巨大生成物の差分を軽量化

`custom-elements.json` は CI 要件としてコミット運用ですが、テキスト差分展開は重くなりがちです。  
このリポジトリでは `.gitattributes` で `custom-elements.json -diff` を設定済みです。

期待効果:

- 巨大JSONが変更状態でも `git diff` の出力量を抑制
- Codex が差分を読むコストを低減

レビュー時に CEM 差分本文を確認したい場合:

```bash
git diff --text -- custom-elements.json
```

`--text` を付けると `.gitattributes` の `-diff` 設定を一時的に上書きして表示できます。

## 4. Codex ランタイム生成物の untracked 爆発を防ぐ

`.codex/cache` / `.codex/log` / `.codex/sessions` などは `.gitignore` で除外済みです。  
ローカルで生成される大量ファイルが `git status` に出始めたら、まず ignore 漏れを疑ってください。

## 5. worktree 増殖チェック

```bash
git worktree list | wc -l
git worktree list
```

不要な worktree が多い場合、Git メタデータ探索のオーバーヘッド増につながります。  
不要 worktree は手動で整理してください（削除前に必要ブランチの有無を必ず確認）。

## 参考: 実測サンプル（この環境）

- `custom-elements.json` 全行差分化時:
  - `git diff -- custom-elements.json` 平均 `0.0300s`
  - `.gitattributes` 適用後は平均 `0.0100s`（約66%短縮）
- `.codex/cache` に 10万 untracked を作成時:
  - `git status --porcelain --untracked-files=all` 平均 `0.1420s`
  - ignore 適用後は平均 `0.0200s`（約86%短縮）
- `~/.codex/log/codex-tui.log` 556MB:
  - 行走査ベンチ `0.77s`
  - ローテート後 `0.04s`（約95%短縮）
