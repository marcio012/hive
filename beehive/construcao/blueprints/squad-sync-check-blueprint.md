---
titulo: Blueprint — script squad:sync:check
tipo: especificacao
status: aguardando-implementacao
ultima_revisao: 2026-05-21
responsavel: Claude - Arquiteto
executor: Copilot - Dev
---

# squad:sync:check — especificacao para implementacao

## Objetivo

Validar que todos os arquivos de agente ativos no fluxo estao sincronizados com as secoes-chave de comportamento operacional. Detecta arquivos desatualizados sem aplicar nada automaticamente.

## Problema que resolve

Toda mudanca de comportamento aprovada pelo Márcio precisa ser propagada para todos os agentes (DIR-035). Sem validacao, fica dependente de checagem manual — ja que a propagacao ocorreu de forma incompleta nesta sessao (Copilot foi atualizado depois de Claude).

## Escopo do script

### Arquivo: `scripts/local/squad-sync-check.sh`

### Entrada esperada
Nenhuma. O script le os arquivos de agente diretamente.

### Arquivos inspecionados

| Arquivo | Agente |
|---|---|
| `.claude/CLAUDE.md` | Claude |
| `.copilot/COPILOT.md` | Copilot |
| `.gemini/GEMINI.md` | Gemini (se existir) |

### Secoes-chave a verificar em cada arquivo de agente

O script deve checar se cada um dos blocos abaixo esta presente no arquivo:

1. `## Squad atual` — composicao do squad com os 4 membros
2. `## Camada auxiliar Gemini` — regras de delegacao para o Gemini
3. Referencia a `OPERACAO_COMPARTILHADA_SQUAD.md` — nao pode conter `OPERACAO_COMPARTILHADA_TRIO.md`

### Saida esperada

```
[squad:sync:check] Verificando sincronizacao dos agentes...

.claude/CLAUDE.md
  [OK] ## Squad atual
  [OK] ## Camada auxiliar Gemini
  [OK] referencia a OPERACAO_COMPARTILHADA_SQUAD.md

.copilot/COPILOT.md
  [OK] ## Squad atual
  [OK] ## Camada auxiliar Gemini
  [OK] referencia a OPERACAO_COMPARTILHADA_SQUAD.md

.gemini/GEMINI.md
  [OK] ## Squad atual
  [OK] ## Camada auxiliar Gemini
  [OK] referencia a OPERACAO_COMPARTILHADA_SQUAD.md

[squad:sync:check] Todos os agentes sincronizados.
```

Se algum item falhar:

```
.copilot/COPILOT.md
  [FAIL] ## Squad atual — secao ausente
  [OK]   ## Camada auxiliar Gemini
  [OK]   referencia a OPERACAO_COMPARTILHADA_SQUAD.md

[squad:sync:check] 1 arquivo fora de sincronizacao. Propagar antes de fechar o lock.
```

### Codigo de saida

- `0` — tudo sincronizado
- `1` — ao menos um arquivo fora de sincronizacao

## Entrada no package.json

```json
"squad:sync:check": "bash ./scripts/local/squad-sync-check.sh"
```

## Criterio de aceite

1. Script retorna `0` com saida limpa quando todos os agentes tem as secoes esperadas.
2. Script retorna `1` e lista os itens ausentes quando algum agente esta desatualizado.
3. Script nao falha se `.gemini/GEMINI.md` nao existir — apenas pula com aviso `[SKIP] .gemini/GEMINI.md nao encontrado`.
4. `npm run squad:sync:check` funciona a partir da raiz do repositorio.

## Diretriz relacionada

- DIR-035 — Propagacao obrigatoria de mudancas de comportamento para todos os agentes
