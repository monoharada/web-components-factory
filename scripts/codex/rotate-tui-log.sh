#!/usr/bin/env bash
set -euo pipefail

threshold_mb=200

usage() {
  echo "usage: $0 [--threshold-mb <number>]" >&2
}

die() {
  echo "$1" >&2
  exit 1
}

get_file_size_bytes() {
  local path="$1"
  local size
  size="$(stat -f%z "$path" 2>/dev/null || true)"
  if [[ "$size" =~ ^[0-9]+$ ]]; then
    echo "$size"
    return 0
  fi

  size="$(stat -c%s "$path" 2>/dev/null || true)"
  if [[ "$size" =~ ^[0-9]+$ ]]; then
    echo "$size"
    return 0
  fi

  return 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --threshold-mb)
      [[ $# -ge 2 ]] || die "missing value for --threshold-mb"
      threshold_mb="$2"
      shift 2
      ;;
    *)
      usage
      die "unknown option: $1"
      ;;
  esac
done

if ! [[ "$threshold_mb" =~ ^[0-9]+$ ]]; then
  die "threshold must be an integer MB value"
fi

codex_home="${CODEX_HOME:-$HOME/.codex}"
log_path="$codex_home/log/codex-tui.log"
archive_dir="/tmp/codex-log-archive"

if [[ ! -f "$log_path" ]]; then
  echo "skip: log file not found ($log_path)"
  exit 0
fi

size_bytes="$(get_file_size_bytes "$log_path")" || die "failed to get file size: $log_path"
threshold_bytes=$((threshold_mb * 1024 * 1024))

echo "log_path=$log_path"
echo "current_bytes=$size_bytes"
echo "threshold_bytes=$threshold_bytes"

if (( size_bytes < threshold_bytes )); then
  echo "skip: below threshold"
  exit 0
fi

timestamp="$(date +%Y%m%d-%H%M%S)"
backup_path="$archive_dir/codex-tui.$timestamp.log.bak"

mkdir -p "$archive_dir"
mv "$log_path" "$backup_path"
: > "$log_path"
chmod 600 "$log_path" || true

echo "rotated_to=$backup_path"
new_bytes="$(get_file_size_bytes "$log_path")" || die "failed to get file size: $log_path"
echo "new_bytes=$new_bytes"
