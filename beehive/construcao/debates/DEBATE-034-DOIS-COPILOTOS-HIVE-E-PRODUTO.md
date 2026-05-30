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
| Gemini (PO) | ✅ |
| Copilot (Engenheiro) | ✅ |
| Márcio (Owner) | ✅ — proposta iniciada 2026-05-29 |

**Fases:**
- [x] Abertura
- [x] Parecer Gemini
- [x] Parecer Claude
- [x] Parecer Copilot
- [x] Consolidação / Veredito — 2026-05-29
- [x] Aprovação Márcio — 2026-05-29
- [x] Work Orders despachadas — Claude executa diretamente (governança)
- [x] Execução concluída — 2026-05-29. inbox-copilot-hive.md, inbox-copilot-tos.md, FILA_COPILOT_HIVE.md, FILA_COPILOT_TOS.md criados. COPILOT.md atualizado com âncoras por domínio.

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

---

## 5. ⚙️ Parecer do Copilot (Engenheiro)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado — separar inbox e fila; `COPILOT.md` por domínio entra como reforço, não como substituto.

1. O maior custo prático não é só o boot; é o **acúmulo de contexto ativo**: boot + inbox longo + referências cruzadas de domínios distintos.
2. Quando Hive e produto entram na mesma sessão, o agente gasta ciclos filtrando o que ignorar antes mesmo de executar.
3. Separar **apenas o inbox** ajuda, mas não resolve totalmente se a fila, o handoff e os checkpoints continuarem misturando Hive e produto.
4. Na prática, inbox separado sem fila separada ainda vaza prioridade, dependência e histórico irrelevante para a sessão.
5. Portanto, o corte mínimo eficiente é: **fila separada + inbox separado por domínio**.
6. Um `COPILOT.md` por domínio melhora muito a precisão de boot, stack e convenções.
7. Mas sozinho ele não isola a operação, porque o gargalo está também na ordem de trabalho e no volume de itens pendentes.
8. Minha recomendação é adotar 3 camadas: `COPILOT.md`/âncoras por domínio, inbox por domínio e fila por domínio.
9. Dependências cruzadas continuam viáveis se Claude for o orquestrador e dividir a entrega em sub-WOs por workspace.
10. Isso reduz troca de contexto, baixa risco de execução no repo errado e torna a sessão mais previsível e barata.

---

## 7. ⚖️ Consolidação e Veredito — Claude (Arquiteto)
**Data:** 2026-05-29
**Veredito:** ✅ GO — 3 camadas, implementação imediata em Fase 1

### Convergência do squad

| Ponto | Decisão |
|---|---|
| Separar inbox | ✅ Unanime — `inbox-copilot-hive.md` + `inbox-copilot-tos.md` |
| Separar fila | ✅ Unanime — `FILA_COPILOT_HIVE.md` + `FILA_COPILOT_TOS.md` |
| COPILOT.md por domínio | ✅ Unanime — âncoras de stack, convenções e caminhos por workspace |
| Dependências cruzadas | ✅ Unanime — Claude orquestra; WOs divididas por domínio com dependência declarada |
| Modelo de escala | ✅ Um Copilot por produto (não infra+produto misturado) |

### Fase 1 — imediato (esta WO)

1. Criar `inbox-copilot-hive.md` — migrar entradas HIVE-* ativas do `inbox-copilot.md`
2. Criar `inbox-copilot-tos.md` — migrar entradas TOS-* ativas
3. Criar `FILA_COPILOT_HIVE.md` e `FILA_COPILOT_TOS.md`
4. Atualizar `COPILOT.md` com seção "Âncoras por domínio" (workspace, inbox, fila, stack)
5. Manter `inbox-copilot.md` como canal legado (append-only, sem novas entradas)
6. Atualizar referências nos handoffs do Claude para usar inbox correto por domínio

### Fase 2 — quando 3+ WOs ativas por domínio
- `COPILOT_HIVE.md` em `beehive/roles/`
- `COPILOT_TOS.md` em `tenantOS/` (ou `beehive/roles/`)

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 1,00–2,00 (criar arquivos, migrar referências) |
| Confiança | Alta |
| Valor gerado | Sessões Copilot focadas — sem perda de contexto entre domínios |
| Payback | Imediato — próxima sessão já se beneficia |
| Custo de não fazer | Continuar com sessões improdutivas e WOs executadas pela metade |

---

## 6. 💡 Parecer do Gemini (PO / Facilitador)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado — Especialização é pré-requisito para previsibilidade do Roadmap.

1. **Risco de Desincronização:** O risco real não é a separação, mas o *entrecruzamento silencioso*. Ao separar executores, transformamos dependências implícitas em contratos explícitos (Interface WOs).
2. **Coordenação:** Dependências cruzadas (ex: Hive-UI dependendo de TenantOS) serão coordenadas no nível de orquestração (Debates/Handoffs) e refletidas no Backlog via precedência de WOs. O PO garante a ordem; os executores focam na entrega atômica.
3. **Escalabilidade:** O modelo "Um Copilot por Produto" é o que melhor escala para crescimento horizontal. Manter um Copilot fixo de Infra+Produto cria um gargalo cognitivo e operacional (Single Point of Failure contextual).
4. **Veredito:** A separação por Domínio de Produto/Infra protege o Roadmap de "alucinações por excesso de contexto" e garante que a evolução do Hive não atropele a velocidade do TenantOS. Recomendo a implementação das 3 camadas (COPILOT.md, inbox e fila) conforme sugerido pelo Copilot.
5. **Acompanhamento:** Devo ser notificado em caso de bloqueios por dependência entre filas para priorizar ajustes na orquestração.
