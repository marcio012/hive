# Aceite Técnico — Protocolo de Rastreio por ID
**ID:** ACEITE-2026-05-28-005
**Tipo:** Implementação
**Gerado por:** Copilot
**Data:** 2026-05-28
**Trigger:** Debate Go
**Thread:** debate-019-rastreio-visibilidade
**Ref. Arquitetural:** DEBATE-019 / CLAUDE-2026-05-28-033
**Status:** ✅ Aprovado pelo Owner e implementado

---

## Resumo Executivo
Separar o backlog do Hive e do TenantOS por namespace formal, criar a diretriz DIR-084 e tornar `backlog_ref` obrigatório no template de handoff.

## Escopo — O que será / foi feito
- [x] Criar `beehive/construcao/BACKLOG-TOS.md` com itens `TOS-NNN`
- [x] Limpar `beehive/construcao/BACKLOG.md` para manter apenas itens `HIVE-NNN`
- [x] Registrar DIR-084 em `beehive/cognition/diretrizes.md`
- [x] Atualizar `beehive/construcao/templates/HANDOFF_EXECUTAVEL_TEMPLATE.md` com `Backlog ref`

---

## Análise Financeira

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ 0,55 |
| Confiança da estimativa | Alta |
| Valor gerado | Ativa rastreio formal entre backlog, handoff, work order e commit em Hive e TenantOS |
| Payback | Imediato — a próxima entrega já nasce rastreável |
| Custo de não fazer | Continuidade do drift entre debates, backlog e commits, sem visibilidade histórica confiável |

---

## Critérios de Aceite
- [x] `BACKLOG-TOS.md` criado com itens `TOS-NNN`
- [x] `BACKLOG.md` contém apenas itens `HIVE-NNN`
- [x] DIR-084 registrada em `diretrizes.md`
- [x] Template atualizado com `Backlog ref`

## Riscos e Ressalvas
- A diretriz entra em arquivo de governança; por isso a rodada precisa de auditoria do Claude antes de qualquer commit
- O backlog legado foi migrado por namespace, mas os commits históricos anteriores não serão retro-normalizados

---

## Aprovação do Owner
**Status:** ✅ Aprovado por Márcio
**Aprovado em:** 2026-05-28
**Observações:**
> Work order liberada explicitamente no inbox do Copilot.
