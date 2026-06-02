---
id: WO-056
titulo: Relatório de Custo por Papel Dinâmico (Visão Humana)
backlog_ref: HIVE-029
executor: Copilot
executor_role: documentador
auditor: Claude
auditor_role: arquiteto
status: pendente
data: 2026-06-01
workspace_hive: /home/marcio/job/hive
cwd_exec: /home/marcio/job/hive
---

# WO-056 — Relatório de Custo por Papel Dinâmico

## Objetivo
Criar documento humano-legível com o custo estimado de cada papel do catálogo dinâmico,
seguindo o mesmo padrão de `beehive/registry/reports/CUSTO_BOOT_AGENTES.md`.

## Saída esperada
`beehive/registry/reports/CUSTO_PAPEIS_DINAMICOS.md`

---

## Dados coletados pelo Arquiteto (não recoletar)

### Referência de custo
~R$ 0,01 por 1.000 tokens de input
Conversão: 1 token ≈ 0,70 palavras (PT-BR)

### Base de boot por agente (custo fixo — sem papel)

| Agente | Arquivo principal | Palavras | Tokens est. | Custo base |
|---|---|---|---|---|
| Gemini (neutro) | GEMINI.md | 238 | ~340 | ~R$ 0,003 |
| Copilot | COPILOT.md | 442 | ~631 | ~R$ 0,006 |
| Claude | CLAUDE.md | 771 | ~1.101 | ~R$ 0,011 |

> Nota: Claude carrega adicionalmente CORE_GUARDS.md (372 palavras, ~531 tokens) e âncoras
> (BACKLOG.md ~297 palavras, debates-abertos.md ~549 palavras). Custo real Claude com âncoras: ~3.857 tokens (~R$ 0,039).
> Para os papéis, o custo base relevante é o do AGENTE que assume o papel.

### Custo adicional por papel injetado (delta sobre o base)

| Papel | Arquivo | Palavras | Tokens est. | Custo adicional |
|---|---|---|---|---|
| dev | roles/dev.md | 192 | ~274 | ~R$ 0,003 |
| conselheiro | roles/conselheiro.md | 213 | ~304 | ~R$ 0,003 |
| documentador | roles/documentador.md | 290 | ~414 | ~R$ 0,004 |
| qa | roles/qa.md | 299 | ~427 | ~R$ 0,004 |
| arquiteto | roles/claude.md | 348 | ~497 | ~R$ 0,005 |
| code-review | roles/code-review.md | 334 | ~477 | ~R$ 0,005 |
| po-hive | roles/po-hive.md | 349 | ~499 | ~R$ 0,005 |
| po-produto | roles/po-produto.md | 411 | ~587 | ~R$ 0,006 |

### Custo total por combinação agente + papel

| Combinação | Tokens base | + Papel | Total tokens | Custo total |
|---|---|---|---|---|
| Gemini neutro | 340 | — | 340 | ~R$ 0,003 |
| Gemini + dev | 340 | 274 | 614 | ~R$ 0,006 |
| Gemini + conselheiro | 340 | 304 | 644 | ~R$ 0,006 |
| Gemini + documentador | 340 | 414 | 754 | ~R$ 0,008 |
| Gemini + qa | 340 | 427 | 767 | ~R$ 0,008 |
| Gemini + code-review | 340 | 477 | 817 | ~R$ 0,008 |
| Gemini + po-hive | 340 | 499 | 839 | ~R$ 0,008 |
| Gemini + po-produto | 340 | 587 | 927 | ~R$ 0,009 |
| Copilot + dev | 631 | 274 | 905 | ~R$ 0,009 |
| Copilot + qa | 631 | 427 | 1.058 | ~R$ 0,011 |
| Copilot + code-review | 631 | 477 | 1.108 | ~R$ 0,011 |
| Claude + code-review | 3.857* | 477 | 4.334 | ~R$ 0,043 |
| Claude + qa | 3.857* | 427 | 4.284 | ~R$ 0,043 |

*Claude com âncoras completas

### Observações para o documento

1. **Gemini neutro é o mais barato de todos** — 340 tokens, ideal para triagens rápidas
2. **Papéis leves (dev, conselheiro)** custam menos de R$ 0,003 adicionais — negligível
3. **Papéis pesados (po-produto, code-review)** são mais ricos em expertise — o custo maior é justificado pela profundidade
4. **Claude + qualquer papel** sempre tem custo maior por causa das âncoras de governança — usar Claude para papéis onde a profundidade de contexto agrega (arquitetura, auditoria)
5. **Melhor custo-benefício para tasks pontuais:** Gemini + papel leve (dev/conselheiro) — ~R$ 0,006 por sessão
6. **Quando subir para Claude:** quando a tarefa exige contexto acumulado de governança ou decisão arquitetural

---

## O que o Copilot deve fazer

1. Criar `beehive/registry/reports/CUSTO_PAPEIS_DINAMICOS.md` com:
   - Resumo executivo em linguagem acessível para Márcio (não técnica)
   - Tabela visual de custo por papel (dos dados acima)
   - Tabela de combinações agente + papel com custo total
   - Seção "Quando usar cada papel" — orientação prática
   - Seção "Qual agente para cada função" — baseada no custo-benefício
   - Análise financeira (mesmo padrão do relatório anterior)
   - **Atenção:** escrever com acentuação correta em português

2. Seguir o mesmo estilo do `beehive/registry/reports/CUSTO_BOOT_AGENTES.md`

## Critérios de aceite
- [ ] `CUSTO_PAPEIS_DINAMICOS.md` criado com acentuação correta
- [ ] Linguagem humana — sem jargão técnico desnecessário
- [ ] Tabelas legíveis e alinhadas
- [ ] Seção prática "quando usar" presente
- [ ] Nenhuma alteração em arquivos de governança
