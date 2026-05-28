#!/usr/bin/env bash

resolve_hive_paths() {
  local fallback_root="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
  local raw_hive_home="${HIVE_HOME:-$fallback_root}"
  local raw_project_path="${PROJECT_PATH:-$fallback_root}"

  if [[ "$raw_hive_home" != "/" ]]; then
    raw_hive_home="${raw_hive_home%/}"
  fi

  if [[ "$raw_project_path" != "/" ]]; then
    raw_project_path="${raw_project_path%/}"
  fi

  if [[ -d "$raw_hive_home/beehive/bin" ]]; then
    export HIVE_HOME="$raw_hive_home"
    export BEEHIVE_PATH="$raw_hive_home/beehive"
  elif [[ -d "$raw_hive_home/bin" && "$(basename "$raw_hive_home")" == "beehive" ]]; then
    export BEEHIVE_PATH="$raw_hive_home"
    export HIVE_HOME="$(dirname "$raw_hive_home")"
  elif [[ -d "$fallback_root/beehive/bin" ]]; then
    export HIVE_HOME="$fallback_root"
    export BEEHIVE_PATH="$fallback_root/beehive"
  else
    echo "Erro: não foi possível localizar o core do Hive a partir de HIVE_HOME=${raw_hive_home}" >&2
    return 1
  fi

  export PROJECT_PATH="$raw_project_path"
  export HIVE_ROLES="${HIVE_ROLES:-$BEEHIVE_PATH/roles/roles.yaml}"
}
