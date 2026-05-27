---
id: DIR-082
titulo: Workspaces Explícitos para Execução Multi-repo
status: ativo
data: 2026-05-27
owners:
  - Márcio
  - Gemini (Lead)
escopo: operacional
---

# DIR-082: Workspaces Explícitos

## Problema
Quando uma task do Hive referencia um produto externo (ex: `tenantOS/backend`) sem declarar o caminho real de execução, o agente precisa procurar o repositório alvo no filesystem. Isso aumenta risco de operar no diretório errado, gera scans desnecessários e polui a execução com falsos erros de permissão.

## Regra
Todo handoff, contrato, blueprint executável ou roteamento que aponte para outro repositório deve declarar explicitamente:

- `workspace_hive`: caminho do framework/orquestrador
- `workspace_target`: caminho do produto alvo
- `repo_target`: nome lógico do repositório alvo
- `cwd_exec`: diretório exato onde a execução deve começar

## Aplicação

### Claude
- Não enviar handoff executável sem os 4 campos quando a entrega sair do repositório Hive.
- Se o destino tiver múltiplos módulos, apontar `cwd_exec` para o módulo exato (`backend`, `frontend`, etc).

### Gemini
- Ao rotear tarefa ou montar Plano de Voo, incluir o workspace alvo e o diretório de execução.
- Não pedir "ir para o próximo" em repositório externo sem informar o destino operacional.

### Copilot
- Se receber task multi-repo sem os campos obrigatórios, bloquear a execução e escalar.
- Não fazer descoberta ampla do repositório alvo como mecanismo padrão de operação.

## Objetivo
Garantir que o squad opere com destino explícito, reduzindo erro operacional e eliminando ambiguidade entre framework e produto.
