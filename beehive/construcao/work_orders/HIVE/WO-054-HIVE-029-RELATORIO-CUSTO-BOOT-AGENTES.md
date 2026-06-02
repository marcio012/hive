---
id: WO-054
titulo: Relatório de Custo de Boot por Agente (Visão Humana)
backlog_ref: HIVE-029
executor: Copilot
executor_role: engenheiro
auditor: Claude
auditor_role: arquiteto
status: pendente
data: 2026-06-01
workspace_hive: /home/marcio/job/hive
cwd_exec: /home/marcio/job/hive
---

# WO-054 — Relatório de Custo de Boot por Agente

## Objetivo
Criar documento humano-legível com a análise de consumo de tokens no boot de cada agente/papel do squad. O documento serve de base para decisões de otimização.

## Saída esperada
`beehive/registry/reports/CUSTO_BOOT_AGENTES.md`

## Dados coletados pelo Arquiteto (não recoletar)

### Palavras por arquivo (medido via `wc -w`)

| Arquivo | Palavras |
|---|---|
| beehive/.claude/CLAUDE.md | 741 |
| beehive/.claude/CLAUDE_REF.md | 677 |
| beehive/.copilot/COPILOT.md | 442 |
| beehive/.copilot/COPILOT_REF.md | 407 |
| beehive/cognition/CORE_GUARDS.md | 372 |
| beehive/dna/manifesto.md | 336 |
| beehive/construcao/BACKLOG.md (head 80) | 824 |
| beehive/construcao/BACKLOG-TOS.md | 196 |
| beehive/construcao/debates-abertos.md (head 60) | 549 |
| beehive/roles/roles.yaml | 566 |
| beehive/roles/po-hive.md | 349 |
| beehive/roles/po-produto.md | 411 |
| GEMINI.md (raiz) | 270 |
| beehive/construcao/FILA_COPILOT_HIVE.md | 164 |
| beehive/construcao/FILA_COPILOT_TOS.md | 85 |
| beehive/construcao/inbox-copilot-hive.md | 1.298 |
| beehive/construcao/inbox-copilot-tos.md | 76 |
| beehive/construcao/inbox-claude.md | 21 |

### Estimativa de tokens (1 token ≈ 0,70 palavras PT-BR)

### Composição de boot por agente/papel

**Claude (Arquiteto/Auditor):**
CLAUDE.md + CLAUDE_REF.md + CORE_GUARDS.md + BACKLOG.md + debates-abertos.md + manifesto.md + roles.yaml + inbox-claude.md
→ ~4.086 palavras → ~5.836 tokens

**Copilot-Hive:**
COPILOT.md + COPILOT_REF.md + CORE_GUARDS.md + FILA_COPILOT_HIVE.md + inbox-copilot-hive.md + BACKLOG.md + debates-abertos.md
→ ~4.056 palavras → ~5.794 tokens

**Copilot-TOS:**
COPILOT.md + COPILOT_REF.md + CORE_GUARDS.md + FILA_COPILOT_TOS.md + inbox-copilot-tos.md + BACKLOG-TOS.md + debates-abertos.md
→ ~2.127 palavras → ~3.039 tokens

**Gemini — papel PO-Hive:**
GEMINI.md + CORE_GUARDS.md + po-hive.md + manifesto.md + BACKLOG.md + debates-abertos.md
→ ~2.700 palavras → ~3.857 tokens

**Gemini — papel PO-Produto:**
GEMINI.md + CORE_GUARDS.md + po-produto.md + manifesto.md + BACKLOG-TOS.md + debates-abertos.md
→ ~2.134 palavras → ~3.049 tokens

### Gargalos identificados

1. **inbox-copilot-hive.md: 1.298 palavras** — só 2 entradas pendentes; o restante são entradas consumidas não arquivadas. Limpeza resolve.
2. **BACKLOG.md: 824 palavras** — carregado por Claude, Copilot-Hive e Gemini PO-Hive. Splitting em ativo/arquivo economizaria ~500 tokens em 3 agentes.
3. **CLAUDE.md + CLAUDE_REF.md: 1.418 palavras combinados** — peso fixo de governança do Claude.

## O que o Copilot deve fazer

1. Criar `beehive/registry/reports/CUSTO_BOOT_AGENTES.md` com:
   - Tabela visual de tokens por agente (dos dados acima)
   - Seção "Gargalos" com os 3 pontos identificados
   - Seção "Otimizações sugeridas" com esforço e ganho estimado para cada
   - Linguagem acessível para o Diretor (não técnica — visão humana)
   - Análise financeira: custo estimado em R$ por sessão boot (referência: ~R$ 0,01 a cada 1.000 tokens input do Gemini 2.5 Pro)

2. Arquivar entradas consumidas do `inbox-copilot-hive.md` → `beehive/registry/archive/inbox/inbox-copilot-hive-historico.md`
   - Manter apenas as 2 entradas `status: pendente`
   - Isso resolve o maior gargalo imediatamente

## Critérios de aceite
- [ ] `beehive/registry/reports/CUSTO_BOOT_AGENTES.md` criado e legível para humano
- [ ] `inbox-copilot-hive.md` com apenas entradas pendentes (consumidas arquivadas)
- [ ] Nenhuma alteração em arquivos de governança (CLAUDE.md, CORE_GUARDS.md, etc.)
