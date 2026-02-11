#!/usr/bin/env bash
set -euo pipefail

runs="${1:-5}"

if ! command -v git >/dev/null 2>&1; then
  echo "git が見つかりません" >&2
  exit 1
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

print_section() {
  echo "== $1 =="
}

run_cmd() {
  local cmd="$1"
  echo "\$ $cmd"
  sh -c "$cmd"
  echo
}

run_cmd_nonfatal() {
  local cmd="$1"
  echo "\$ $cmd"
  sh -c "$cmd" || true
  echo
}

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

print_section "A) Repository State"
run_cmd 'git status --porcelain'
run_cmd 'git diff --stat'
run_cmd_nonfatal 'git ls-files -v | head'
run_cmd 'git rev-parse --show-toplevel'
run_cmd 'git status --porcelain | wc -l'
run_cmd 'git ls-files --others --exclude-standard | wc -l'

print_section "B) Top 20 Large Files"
run_cmd_nonfatal 'find . -maxdepth 6 -type f -print0 | xargs -0 ls -ln 2>/dev/null | sort -nrk5 | head -n 20'

if [[ -f custom-elements.json ]]; then
  print_section "C) custom-elements.json"
  run_cmd 'ls -lh custom-elements.json'
  run_cmd 'wc -c custom-elements.json'
  run_cmd 'wc -l custom-elements.json'
  run_cmd 'git log -n 5 --date=iso --pretty=format:"%h %ad %an %s" -- custom-elements.json'
fi

print_section "D) Untracked Breakdown"
untracked_count="$(git ls-files --others --exclude-standard | wc -l | tr -d ' ')"
echo "untracked_count=$untracked_count"
if [[ "$untracked_count" -gt 0 ]]; then
  run_cmd_nonfatal "git ls-files --others --exclude-standard | awk -F/ '{print \\$1}' | sort | uniq -c | sort -nr | head -n 20"
else
  echo
fi

print_section "E) Codex Logs (Top by size)"
run_cmd_nonfatal "find \"\$HOME\" -maxdepth 6 \\( -name '*codex*log*' -o -name 'codex-tui.log' \\) -type f 2>/dev/null | xargs -I{} ls -ln {} 2>/dev/null | sort -nrk5 | head -n 20"

print_section "F) Worktree State"
run_cmd 'git worktree list'
run_cmd 'git worktree list | wc -l'

print_section "Quick Benchmarks"
echo "git status --porcelain: $(measure_avg_sec 'git status --porcelain')"
echo "git status --porcelain --untracked-files=all: $(measure_avg_sec 'git status --porcelain --untracked-files=all')"
echo "git diff -- custom-elements.json: $(measure_avg_sec 'git diff -- custom-elements.json')"
