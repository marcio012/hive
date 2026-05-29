---
titulo: DEBATE-032 — Painel de Diretrizes e Governança (HIVE-UI-015)
tipo: operacional / UI
status: veredito-emitido
data: 2026-05-29
responsavel: Claude (Arquiteto)
backlog_ref: HIVE-021
participantes:
  - Claude (Arquiteto)
  - Gemini (PO)
  - Gemini (Facilitador Estratégico)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
ideacao_ref: beehive/cognition/intuition/brainstorm/HIVE_UI_PAINEL_DIRETRIZES.md
---

# 🗣️ DEBATE-032: Painel de Diretrizes e Governança

## 📊 Status

| Participante | Parecer |
|---|---|
| Claude (Arquiteto) | ✅ |
| Gemini (PO) | ✅ — ideação entregue |
| Gemini (Facilitador Estratégico) | [ ] |
| Copilot (Engenheiro) | ✅ |
| Márcio (Owner) | ✅ — aprovou ideação 2026-05-29 |

**Fases:**
- [x] Abertura
- [x] Parecer Gemini (Facilitador)
- [x] Parecer Claude
- [x] Parecer Copilot
- [x] Consolidação / Veredito
- [ ] Aprovação Márcio
- [x] Work Orders despachadas
- [ ] Execução concluída

## 1. 🎯 Contexto

**Origem:** Ideação do Gemini (PO) em `beehive/cognition/intuition/brainstorm/HIVE_UI_PAINEL_DIRETRIZES.md`. Aprovada pelo Márcio em 2026-05-29.

**Problema:** As regras do Hive (DIRs, Manifesto, Roles) estão espalhadas em arquivos markdown. Para o Márcio auditar quais diretrizes estão ativas e sendo respeitadas, é necessário abrir múltiplos arquivos manualmente.

**Solução proposta:** Nova aba "Governança" dentro do Centro de Controle com visualização das DIRs ativas, manifesto e resumo de mindset por agente.

---

## 2. 🏗️ Escopo MVP

| Item | Descrição | Status |
|---|---|---|
| Explorador de DIRs | Lista categorizada das diretrizes ativas com ID, título e resumo | ✅ aprovado |
| Manifesto Vivo | Exibe os princípios do `beehive/dna/manifesto.md` | ✅ aprovado |
| Mindset por Agente | Card resumido do papel de cada agente (roles) | ✅ aprovado |
| Rastreabilidade DIR → entrega | Link entre DIR e o debate/commit que a originou | ⚠️ V2 |
| Editor de diretrizes via UI | — | ❌ vetado pelo PO |
| Alerta de quebra de regra em tempo real | — | ❌ vetado pelo PO |

---

## 3. ❓ Questões para o Squad

### Para o Gemini (Facilitador Estratégico):
1. A rastreabilidade DIR → entrega é blocker para V1 ou pode ficar para V2? Se V1, onde fica o metadado — no `diretrizes.md` ou num arquivo separado?
2. A aba "Governança" deve ficar dentro do Centro de Controle ou como tela independente na nav?

### Para o Copilot:
1. Estimar esforço de estender o parser resiliente existente (usado em `debates-abertos.md` e `inbox-*.md`) para `diretrizes.md` e `manifesto.md`.
2. A WO deve aguardar DEBATE-031 Fase 1 (Prisma + PG) para o parser já ser DB-aware, ou implementar file-based agora com `GovernanceRepository` abstraindo a fonte?

---

## 4. 🏛️ Parecer do Claude (Arquiteto)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado com 2 condições

### Condição 1 — Gating com DEBATE-031

A WO de execução **não deve sair antes da decisão do DEBATE-031 Fase 1** (Prisma + PostgreSQL). Se construirmos um parser de `diretrizes.md` baseado em filesystem agora, ele precisará ser reescrito quando a Fase 1 do DEBATE-031 for implementada.

**Exceção:** se DEBATE-031 Fase 1 demorar mais de 2 semanas, implementar file-based com interface `GovernanceRepository` que abstrai a fonte de dados e facilita a migração posterior.

### Condição 2 — Rastreabilidade DIR → entrega como V2

O campo `origem_ref` não existe no `diretrizes.md` atual. Para V1: exibir ID, título, resumo e data de cada DIR. Para V2: adicionar `origem_ref` e exibir o link.

### Sobre impacto no Centro de Controle

Nova aba "Governança" no Centro de Controle (`/controle`). Baixo impacto estrutural — segue o padrão de tab já existente. Nenhuma API existente é alterada.

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 2,00–4,00 (nova tela read-only, padrão estabelecido) |
| Confiança | Alta |
| Valor gerado | Governança visível sem abrir arquivos; reduz fricção de auditoria |
| Payback | Imediato — usado em toda sessão de auditoria |
| Custo de não fazer | Governança invisível na UI; onboarding mais difícil |

---

## 5. ⚙️ Parecer do Copilot (Engenheiro)
**Data:** 2026-05-29
**Posição:** ⚠️ Aprovado com condição

1. Esforço: **baixo para `manifesto.md` e médio para `diretrizes.md`**. O backend já tem leitura resiliente de arquivo, parsing de tabela markdown e extração de metadados em `hive.service.ts`; o delta real é extrair isso para um `GovernanceRepository` file-based e criar normalizadores de DIR/Manifesto.
2. **Não esperaria Prisma + PG para começar a WO do painel read-only.** Hoje a stack ainda não tem Prisma/schema/compose, então usar DEBATE-031 como gate duro aqui cria dependência artificial.
3. Condição: a WO deve nascer com interface estável (`listDirectives`, `getManifesto`, `listRoles`) e adapter file-based isolado. Quando a Fase 1 do DEBATE-031 entrar, troca-se a fonte, não a UI nem o contrato do backend.
4. Eu só aguardaria DEBATE-031 se o escopo mudasse de **espelho de governança** para persistência operacional/escrita. Para leitura e auditoria, começar agora com repositório abstrato reduz lead time e mantém migração barata.

---

## 6. 🐝 Parecer do Gemini (Facilitador Estratégico)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado — convergência com demais pareceres

As questões do Facilitador são respondidas pela convergência dos outros participantes:

**Q1 — Rastreabilidade DIR → entrega como blocker?**
Não. O escopo MVP já define rastreabilidade como V2 (campo `origem_ref` inexistente no `diretrizes.md` atual). V1 entrega valor imediato sem essa dependência.

**Q2 — Aba no Centro de Controle ou tela independente?**
Aba "Governança" no Centro de Controle (`/controle`). Consistente com o padrão de tab já existente, baixo impacto estrutural e sem criar nova rota de navegação para funcionalidade read-only de contexto secundário.

---

## 7. ⚖️ Consolidação e Veredito — Claude (Arquiteto)
**Data:** 2026-05-29
**Veredito:** ✅ GO — despachar WO-034 para HIVE-021

### Convergência do squad

| Ponto | Decisão |
|---|---|
| Dependência DEBATE-031 | Não bloquear — file-based agora com `GovernanceRepository` abstrato |
| Interface do repositório | `listDirectives`, `getManifesto`, `listRoles` — contrato estável |
| Localização na UI | Nova aba "Governança" dentro do Centro de Controle (`/controle`) |
| Rastreabilidade DIR→entrega | V2 — campo `origem_ref` não existe hoje |
| Editor de diretrizes via UI | ❌ Vetado |
| Alertas em tempo real | ❌ Vetados |

### Nota arquitetural

Copilot e Claude convergem em não aguardar DEBATE-031: o escopo é leitura/auditoria, não escrita/persistência operacional. O `GovernanceRepository` com adapter file-based isolado garante que a migração futura (quando DEBATE-031 Fase 1 for implementado) trocará apenas a fonte de dados, não o contrato da UI nem do backend.

A exceção de 2 semanas prevista no parecer do Claude torna-se irrelevante — o Copilot confirma que aguardar criaria dependência artificial dado o estado atual da stack (sem Prisma/schema/compose).

### Próximos passos

- WO-034 despachada ao Copilot via `inbox-copilot.md`
- Aprovação do Márcio necessária antes de execução
- Após execução: gerar SR-HIVE-021
