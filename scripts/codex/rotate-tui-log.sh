#!/usr/bin/env bash
set -euo pipefail

threshold_mb=200

while [[ $# -gt 0 ]]; do
  case "$1" in
    --threshold-mb)
      threshold_mb="${2:-}"
      shift 2
      ;;
    *)
      echo "unknown option: $1" >&2
      echo "usage: $0 [--threshold-mb <number>]" >&2
      exit 1
      ;;
  esac
done

if ! [[ "$threshold_mb" =~ ^[0-9]+$ ]]; then
  echo "threshold must be an integer MB value" >&2
  exit 1
fi

codex_home="${CODEX_HOME:-$HOME/.codex}"
log_path="$codex_home/log/codex-tui.log"
archive_dir="/tmp/codex-log-archive"

if [[ ! -f "$log_path" ]]; then
  echo "skip: log file not found ($log_path)"
  exit 0
fi

size_bytes="$(stat -f%z "$log_path")"
threshold_bytes=$((threshold_mb * 1024 * 1024))

echo "log_path=$log_path"
echo "current_bytes=$size_bytes"
echo "threshold_bytes=$threshold_bytes"

if (( size_bytes < threshold_bytes )); then
  echo "skip: below threshold"
  exit 0
fi

mkdir -p "$archive_dir"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_path="$archive_dir/codex-tui.$timestamp.log.bak"

mv "$log_path" "$backup_path"
: > "$log_path"
chmod 600 "$log_path" || true

echo "rotated_to=$backup_path"
echo "new_bytes=$(stat -f%z "$log_path")"
