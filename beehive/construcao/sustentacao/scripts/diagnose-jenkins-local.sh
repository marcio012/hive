#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
OUT_DIR="${ROOT_DIR}/.tmp/sustentacao"
TS="$(date +%Y%m%d-%H%M%S)"
REPORT="${OUT_DIR}/jenkins-diagnose-${TS}.md"

mkdir -p "${OUT_DIR}"

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

collect_recent_build_logs() {
  find "${ROOT_DIR}" -maxdepth 1 -type f -name 'jenkins-build*.txt' -printf '%T@ %p\n' 2>/dev/null \
    | sort -nr \
    | head -n 5 \
    | awk '{ $1=""; sub(/^ /, ""); print }'
}

analyze_log_patterns() {
  local log_file="$1"
  local has_findings="false"

  echo "## Build Log Analysis"
  echo
  echo "- log_file: ${log_file}"
  echo
  echo "### Findings"
  echo

  if grep -Eiq 'insufficient UIDs or GIDs available|potentially insufficient UIDs or GIDs available|lchown .*invalid argument|newuidmap|newgidmap' "${log_file}"; then
    has_findings="true"
    echo "- [alta] Podman rootless com erro de UID/GID (subuid/subgid ou modo rootless mal configurado)."
    echo "  Acao: validar /etc/subuid e /etc/subgid no host Jenkins e executar podman system migrate."
  fi

  if grep -Eiq 'Could not resolve host|Temporary failure in name resolution|Name or service not known|api\.github\.com' "${log_file}"; then
    has_findings="true"
    echo "- [alta] Falha de DNS/rede durante acesso a API externa (ex.: GitHub)."
    echo "  Acao: validar DNS no container/host Jenkins e testar curl https://api.github.com/rate_limit."
  fi

  if grep -Eiq 'permission denied|denied: requested access|unauthorized: authentication required|401|403|docker login|not authorized' "${log_file}"; then
    has_findings="true"
    echo "- [media] Possivel erro de autenticacao/credencial (Docker Hub, GitHub status ou SSH)."
    echo "  Acao: revisar credentialsId do job e testar login manual com as mesmas credenciais."
  fi

  if grep -Eiq 'address already in use|bind: address already in use|rootlessport|listen tcp .*:8080' "${log_file}"; then
    has_findings="true"
    echo "- [media] Conflito de porta no host/container (frequente em 8080)."
    echo "  Acao: liberar porta ocupada e reiniciar servico socket/runtime de container."
  fi

  if grep -Eiq 'No such property|MissingPropertyException|No such credential|credentials .* not found' "${log_file}"; then
    has_findings="true"
    echo "- [media] Pipeline/credencial ausente no Jenkins (parametro ou secret inexistente)."
    echo "  Acao: conferir nomes de parametros e IDs de credenciais no job."
  fi

  if [ "${has_findings}" = "false" ]; then
    echo "- Nenhum padrao conhecido encontrado automaticamente."
    echo "  Acao: revisar trecho final do log e validar mudancas recentes no Jenkinsfile/infra do agente."
  fi

  echo
  echo "### Tail (ultimas 80 linhas)"
  echo
  echo '```text'
  tail -n 80 "${log_file}" || true
  echo '```'
}

{
  echo "# Jenkins Local Diagnostic"
  echo
  echo "- timestamp: ${TS}"
  echo "- host: $(hostname)"
  echo "- user: $(id -un)"
  echo "- cwd: ${ROOT_DIR}"
  echo "- branch: $(git -C "${ROOT_DIR}" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
  echo "- commit: $(git -C "${ROOT_DIR}" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  echo
  echo "## Tooling"
  echo
  echo "| Tool | Status | Version |"
  echo "| --- | --- | --- |"
  for tool in node npm podman podman-compose ssh sshpass curl jq; do
    if has_cmd "${tool}"; then
      ver="$(${tool} --version 2>/dev/null | head -n 1 | tr '|' '/' || true)"
      echo "| ${tool} | ok | ${ver:-n/a} |"
    else
      echo "| ${tool} | missing | n/a |"
    fi
  done
  echo

  echo "## Lockfiles"
  echo
  for lf in apps/backend/package-lock.json apps/frontend/package-lock.json; do
    if [[ -f "${ROOT_DIR}/${lf}" ]]; then
      echo "- ok: ${lf}"
    else
      echo "- missing: ${lf}"
    fi
  done
  echo

  echo "## Podman rootless checks"
  echo
  if has_cmd podman; then
    rootless="$(podman info --format '{{.Host.Security.Rootless}}' 2>/dev/null || echo unknown)"
    echo "- podman_rootless: ${rootless}"

    if [[ "${rootless}" == "true" ]]; then
      user_name="$(id -un)"
      subuid="$(grep -m1 "^${user_name}:" /etc/subuid 2>/dev/null || true)"
      subgid="$(grep -m1 "^${user_name}:" /etc/subgid 2>/dev/null || true)"
      echo "- subuid: ${subuid:-missing}"
      echo "- subgid: ${subgid:-missing}"
    fi
  else
    echo "- podman nao encontrado"
  fi
  echo

  echo "## Jenkinsfile defaults relevantes"
  echo
  awk '/booleanParam\(name: '\''PUSH_DOCKERHUB'\''/{print "- " $0}' "${ROOT_DIR}/Jenkinsfile" || true
  awk '/booleanParam\(name: '\''DEPLOY_REMOTE_SERVER'\''/{print "- " $0}' "${ROOT_DIR}/Jenkinsfile" || true
  awk '/booleanParam\(name: '\''DEPLOY_HML_LOCAL'\''/{print "- " $0}' "${ROOT_DIR}/Jenkinsfile" || true
  echo

  echo "## CI parity quick check"
  echo
  if npm -C "${ROOT_DIR}" run -s ci:backend:test >/dev/null 2>&1 && npm -C "${ROOT_DIR}" run -s ci:frontend:test >/dev/null 2>&1; then
    echo "- status: ok (testes basicos backend/frontend executados)"
  else
    echo "- status: falhou (verificar ambiente npm/apps)"
  fi
  echo

  echo "## Conclusao automatica"
  echo
  echo "Se Actions passa e Jenkins falha, o ponto de divergencia normalmente esta nos estagios de push/deploy do Jenkins (credenciais e infraestrutura do host)."

  mapfile -t recent_logs < <(collect_recent_build_logs)

  echo
  echo "## Logs Jenkins recentes"
  echo
  if [ "${#recent_logs[@]}" -eq 0 ]; then
    echo "- Nenhum arquivo jenkins-build*.txt encontrado na raiz do repositorio."
    echo "- Para analise automatica de erro, salve o log do build na raiz com esse padrao de nome."
  else
    idx=1
    for log_path in "${recent_logs[@]}"; do
      echo "- [${idx}] ${log_path}"
      idx=$((idx + 1))
    done
    echo
    analyze_log_patterns "${recent_logs[0]}"
  fi
} > "${REPORT}"

echo "Relatorio gerado em: ${REPORT}"
