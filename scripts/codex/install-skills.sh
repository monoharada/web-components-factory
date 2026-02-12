#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Install Codex skills by copying this repo's `.claude/skills/*` into `~/.codex/skills`.

Usage:
  scripts/codex/install-skills.sh [--dry-run] [--force] [--include-deprecated] [--prune-managed]

Options:
  --dry-run            Print what would be done without changing anything
  --force              Replace existing destinations (even if they are real directories)
  --include-deprecated Include skills marked as deprecated in skills registry
  --prune-managed      Remove managed skill directories not present in selected registry output
USAGE
}

dry_run=false
force=false
include_deprecated=false
prune_managed=false

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
    --include-deprecated)
      include_deprecated=true
      shift
      ;;
    --prune-managed)
      prune_managed=true
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
registry_path="${repo_root}/registry/skills-registry.json"

list_cmd=(
  node
  "${repo_root}/scripts/codex/list-skills-from-registry.mjs"
  --client codex
  --format plain
  --registry "${registry_path}"
  --repo-root "${repo_root}"
)
if $include_deprecated; then
  list_cmd+=(--include-deprecated)
fi

skills=()
while IFS= read -r skill_line; do
  [[ -n "${skill_line}" ]] || continue
  skills+=("${skill_line}")
done < <("${list_cmd[@]}")

if [[ ${#skills[@]} -eq 0 ]]; then
  echo "No installable skills found for client=codex. Check: ${registry_path}" >&2
  exit 1
fi

if [[ ! -d "$src_root" ]]; then
  echo "Missing source skills directory: $src_root" >&2
  exit 1
fi

is_selected_skill() {
  local needle="$1"
  local candidate
  for candidate in "${skills[@]}"; do
    if [[ "${candidate}" == "${needle}" ]]; then
      return 0
    fi
  done
  return 1
}

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

if $prune_managed; then
  shopt -s nullglob
  for existing in "${dest_root}"/*; do
    [[ -d "${existing}" ]] || continue

    existing_skill="$(basename "${existing}")"
    if is_selected_skill "${existing_skill}"; then
      continue
    fi

    marker_file="${existing}/.codex-installed-from"
    if [[ ! -f "${marker_file}" ]]; then
      continue
    fi

    marker_src="$(head -n 1 "${marker_file}" || true)"
    if [[ "${marker_src}" != "${src_root}/"* ]]; then
      continue
    fi

    prune_cmd=(rm -rf "${existing}")
    if $dry_run; then
      echo "+ ${prune_cmd[*]}"
    else
      "${prune_cmd[@]}"
    fi
  done
  shopt -u nullglob
fi

echo "Installed Codex skills:"
for skill in "${skills[@]}"; do
  echo "- ${dest_root}/${skill} (copied from ${src_root}/${skill})"
done
