#!/usr/bin/env bash
set -euo pipefail

runs="${1:-5}"

if ! command -v git >/dev/null 2>&1; then
  echo "git が見つかりません" >&2
  exit 1
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

measure_avg_sec() {
  local cmd="$1"
  local tmp_dir
  tmp_dir="$(mktemp -d)"
  local i
  for i in $(seq 1 "$runs"); do
    /usr/bin/time -p sh -c "$cmd" >/dev/null 2>"$tmp_dir/$i"
    awk '/^real /{print $2}' "$tmp_dir/$i"
  done | awk '{sum+=$1; if(NR==1||$1<min)min=$1; if($1>max)max=$1} END{printf "runs=%d avg=%.4fs min=%.4fs max=%.4fs\n", NR, sum/NR, min, max}'
  rm -rf "$tmp_dir"
}

echo "== A) Repository State =="
echo '$ git status --porcelain'
git status --porcelain
echo
echo '$ git diff --stat'
git diff --stat
echo
echo '$ git ls-files -v | head'
git ls-files -v | head || true
echo
echo '$ git rev-parse --show-toplevel'
git rev-parse --show-toplevel
echo
echo '$ git status --porcelain | wc -l'
git status --porcelain | wc -l
echo '$ git ls-files --others --exclude-standard | wc -l'
git ls-files --others --exclude-standard | wc -l
echo

echo "== B) Top 20 Large Files =="
echo '$ find . -maxdepth 6 -type f -print0 | xargs -0 ls -ln | sort -nrk5 | head -n 20'
find . -maxdepth 6 -type f -print0 | xargs -0 ls -ln 2>/dev/null | sort -nrk5 | head -n 20 || true
echo

if [[ -f custom-elements.json ]]; then
  echo "== C) custom-elements.json =="
  echo '$ ls -lh custom-elements.json'
  ls -lh custom-elements.json
  echo '$ wc -c custom-elements.json'
  wc -c custom-elements.json
  echo '$ wc -l custom-elements.json'
  wc -l custom-elements.json
  echo '$ git log -n 5 --date=iso --pretty=format:"%h %ad %an %s" -- custom-elements.json'
  git log -n 5 --date=iso --pretty=format:'%h %ad %an %s' -- custom-elements.json
  echo
fi

echo "== D) Untracked Breakdown =="
untracked_count="$(git ls-files --others --exclude-standard | wc -l | tr -d ' ')"
echo "untracked_count=$untracked_count"
if [[ "$untracked_count" -gt 0 ]]; then
  git ls-files --others --exclude-standard | awk -F/ '{print $1}' | sort | uniq -c | sort -nr | head -n 20 || true
fi
echo

echo "== E) Codex Logs (Top by size) =="
echo '$ find "$HOME" -maxdepth 6 \( -name "*codex*log*" -o -name "codex-tui.log" \) -type f'
find "$HOME" -maxdepth 6 \( -name '*codex*log*' -o -name 'codex-tui.log' \) -type f 2>/dev/null \
  | xargs -I{} ls -ln {} 2>/dev/null | sort -nrk5 | head -n 20 || true
echo

echo "== F) Worktree State =="
echo '$ git worktree list'
git worktree list
echo '$ git worktree list | wc -l'
git worktree list | wc -l
echo

echo "== Quick Benchmarks =="
echo "git status --porcelain: $(measure_avg_sec 'git status --porcelain')"
echo "git status --porcelain --untracked-files=all: $(measure_avg_sec 'git status --porcelain --untracked-files=all')"
echo "git diff -- custom-elements.json: $(measure_avg_sec 'git diff -- custom-elements.json')"
