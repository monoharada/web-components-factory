#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Install Codex skills by copying this repo's `.claude/skills/*` into `~/.codex/skills`.

Usage:
  scripts/codex/install-skills.sh [--dry-run] [--force]

Options:
  --dry-run  Print what would be done without changing anything
  --force    Replace existing destinations (even if they are real directories)
USAGE
}

dry_run=false
force=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      dry_run=true
      shift
      ;;
    --force)
      force=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
src_root="${repo_root}/.claude/skills"
codex_home="${CODEX_HOME:-$HOME/.codex}"
dest_root="${codex_home}/skills"

skills=(
  "css-writing-rules"
  "headless-component-design"
  "wcf-ui-builder"
)

if [[ ! -d "$src_root" ]]; then
  echo "Missing source skills directory: $src_root" >&2
  exit 1
fi

mkdir_cmd=(mkdir -p "$dest_root")
if $dry_run; then
  echo "+ ${mkdir_cmd[*]}"
else
  "${mkdir_cmd[@]}"
fi

for skill in "${skills[@]}"; do
  src="${src_root}/${skill}"
  dest="${dest_root}/${skill}"

  if [[ ! -f "${src}/SKILL.md" ]]; then
    echo "Missing SKILL.md: ${src}/SKILL.md" >&2
    exit 1
  fi

  if [[ -L "$dest" ]]; then
    rm_cmd=(rm -f "$dest")
    if $dry_run; then
      echo "+ ${rm_cmd[*]}"
    else
      "${rm_cmd[@]}"
    fi
  elif [[ -e "$dest" ]]; then
    if [[ -f "${dest}/.codex-installed-from" ]]; then
      rm_cmd=(rm -rf "$dest")
      if $dry_run; then
        echo "+ ${rm_cmd[*]}"
      else
        "${rm_cmd[@]}"
      fi
    elif ! $force; then
      echo "Destination exists (not managed by this installer): $dest" >&2
      echo "Re-run with --force to replace it." >&2
      exit 1
    else
      rm_cmd=(rm -rf "$dest")
      if $dry_run; then
        echo "+ ${rm_cmd[*]}"
      else
        "${rm_cmd[@]}"
      fi
    fi
  fi

  copy_cmd=(cp -R "$src" "$dest")
  if $dry_run; then
    echo "+ ${copy_cmd[*]}"
  else
    "${copy_cmd[@]}"
    printf '%s\n' "$src" > "${dest}/.codex-installed-from"
  fi
done

echo "Installed Codex skills:"
for skill in "${skills[@]}"; do
  echo "- ${dest_root}/${skill} (copied from ${src_root}/${skill})"
done
