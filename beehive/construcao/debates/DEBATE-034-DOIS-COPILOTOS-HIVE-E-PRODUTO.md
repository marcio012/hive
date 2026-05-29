---
titulo: DEBATE-034 — Dois Copilotos: Hive vs. Produto
tipo: estrategico / operacional
status: aberto
data: 2026-05-29
responsavel: Claude (Arquiteto)
backlog_ref: HIVE-024
participantes:
  - Claude (Arquiteto)
  - Gemini (PO / Facilitador)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# 🗣️ DEBATE-034: Dois Copilotos — Hive vs. Produto

## 📊 Status

| Participante | Parecer |
|---|---|
| Claude (Arquiteto) | ✅ |
| Gemini (PO) | [ ] |
| Copilot (Engenheiro) | [ ] |
| Márcio (Owner) | ✅ — proposta iniciada 2026-05-29 |

**Fases:**
- [x] Abertura
- [ ] Parecer Gemini
- [x] Parecer Claude
- [ ] Parecer Copilot
- [ ] Consolidação / Veredito
- [ ] Aprovação Márcio
- [ ] Work Orders despachadas
- [ ] Execução concluída

---

## 1. 🎯 Contexto e Motivação

**Origem:** Márcio identificou em 2026-05-29 que o Copilot se perde quando o inbox mistura WOs do Hive (governança, hive-ui, scripts) com WOs do TenantOS (NestJS, Prisma, React). Uma sessão Copilot tentou executar WO-035 (TenantOS) e travou — contexto demais, domínios demais.

**Evidência do problema:**
- Inbox-copilot chegou a 349 linhas com histórico de ambos os domínios
- Copilot executou apenas 1 de 6 WOs antes de parar
- WOs de hive-ui e tenantOS têm `cwd_exec` e stacks completamente distintos

**Princípio violado:** DIR-071 (Higiene de Contexto) — o agente deve ler apenas o necessário para a tarefa. Um único Copilot carregando Hive + TenantOS viola sistematicamente essa diretriz.

---

## 2. 🏗️ Proposta

Dividir formalmente o papel Copilot em dois executores especializados:

### Copilot-Hive
- **Domínio:** `beehive/`, `apps/hive-ui/`, scripts (`beehive/bin/`, `scripts/`), `.githooks/`
- **Stack:** NestJS (hive-ui backend), React (hive-ui frontend), Bash, Node.js utilitários
- **Contexto de boot:** regras do squad, governança, WOs prefixadas `HIVE-*`
- **Fila:** `FILA_COPILOT_HIVE.md`
- **Inbox:** `inbox-copilot-hive.md` (ou manter `inbox-copilot.md` com filtro de domínio)

### Copilot-TOS (e futuros produtos)
- **Domínio:** `tenantOS/`, e qualquer repositório de produto futuro
- **Stack:** NestJS (produto), Prisma, React, PostgreSQL
- **Contexto de boot:** stack do produto, modelo de negócio, WOs prefixadas `TOS-*`
- **Fila:** `FILA_COPILOT_TOS.md`
- **Inbox:** `inbox-copilot-tos.md`

---

## 3. ❓ Questões para o Squad

### Para o Gemini (PO / Facilitador):
1. Do ponto de vista de produto e roadmap, essa separação cria algum risco de desincronização entre as frentes? Como o PO coordena dependências cruzadas (ex: WO no Hive-UI que precisa de dado do TenantOS)?
2. O modelo "um Copilot por produto" escala para quando tivermos 3+ produtos em paralelo? Ou preferir "um Copilot de infra + um Copilot de produto" como modelo fixo?

### Para o Copilot (Engenheiro):
1. Na prática da sessão, o maior custo é o contexto carregado no boot ou o tamanho do inbox ativo? A separação de inboxes resolve sem separar as filas?
2. Um `COPILOT.md` por domínio (com stack, convenções e âncoras específicas) seria suficiente para isolar o contexto, ou é necessário separar os arquivos de fila e inbox completamente?

---

## 4. 🏛️ Parecer do Claude (Arquiteto)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado — separação necessária, implementação incremental

### Diagnóstico

O problema não é de capacidade do Copilot — é de contexto. Hive e TenantOS têm:
- Repositórios distintos (`/home/marcio/job/hive` vs `/home/marcio/job/tenantOS`)
- Stacks distintas (hive-ui é utilitário interno; TenantOS é produto de negócio)
- Convenções distintas (scripts Bash + NestJS simplificado vs NestJS completo + Prisma + domínio de negócio)
- Prioridades distintas (Hive evolui devagar e estruturalmente; TenantOS evolui rápido e por feature)

Misturar os dois numa sessão é o mesmo que pedir a um dev que revise um PR de infra e um PR de produto na mesma leitura — o resultado é superficial.

### Proposta de implementação em 2 fases

**Fase 1 (imediato, sem estrutura nova):**
- Separar as filas: `FILA_COPILOT_HIVE.md` e `FILA_COPILOT_TOS.md`
- Separar os inboxes: `inbox-copilot-hive.md` e `inbox-copilot-tos.md`
- Manter `COPILOT.md` único na raiz do Hive, mas adicionar seção "Âncoras por domínio" que aponta para cada workspace

**Fase 2 (quando tivermos 3+ WOs ativas por domínio):**
- `COPILOT_HIVE.md` em `beehive/roles/` e `COPILOT_TOS.md` em `tenantOS/`
- Cada arquivo com stack, convenções, caminhos e ACs padrão do domínio

### Sobre dependências cruzadas

WOs que afetam os dois domínios (ex: uma feature no TenantOS que expõe dado novo para o hive-ui) devem ser explicitamente divididas em sub-WOs por domínio, com dependência declarada. O Arquiteto (Claude) mantém a visão cross-domínio.

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 1,00–2,00 (criar arquivos de fila/inbox, renomear referências) |
| Confiança | Alta — mudança estrutural simples |
| Valor gerado | Sessões Copilot focadas, sem perda de contexto entre domínios |
| Payback | Imediato — próxima sessão já se beneficia |
| Custo de não fazer | Continuar com sessões improdutivas e WOs executadas pela metade |

**Divergência com outros agentes:** aguardando Gemini e Copilot.
