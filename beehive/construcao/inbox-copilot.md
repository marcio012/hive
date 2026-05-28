# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

**Tipos de entrada (metadado opcional — aplicar em novas entradas):**
- `alerta-roteamento` — o agente identificou algo mas não tem autoridade para agir; Claude deve decidir
- `pedido-de-parecer` — aguarda posição do Copilot sem execução de código
- `handoff-executavel` — contrato fechado com WO do Claude; Copilot pode executar
Entradas sem tipo: tratar como `pedido-de-parecer` por padrão.

---

### [CLAUDE-2026-05-28-045] Work Order — Correção de fluxo: Coordenador não escreve em inbox-copilot (HIVE-004)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-004
**thread:** governanca-fluxo-coordenador-copilot
**Status:** executada — ✅ Aprovado pelo Claude em 2026-05-28; WO 045 já despachada no fluxo HIVE-004

Aprovado com condição. Executar as 3 edições cirúrgicas abaixo. Escopo exato — nada além.

**workspace_hive:** `/home/marcio/job/hive`
**cwd_exec:** `/home/marcio/job/hive`

---

**Edição 1 — `beehive/roles/coordenador.md`, seção `### O que pode escrever`**

Remover `inbox-copilot.md` da lista. Linha atual:
```
- Novas entradas de roteamento nos inboxes (`inbox-claude.md`, `inbox-copilot.md`, `inbox-gemini.md`) — apenas para encaminhar pendências identificadas, nunca para alterar entradas existentes
```
Substituir por:
```
- Novas entradas de roteamento nos inboxes (`inbox-claude.md`, `inbox-gemini.md`) — apenas para encaminhar pendências identificadas ao Claude ou alertas internos ao Gemini, nunca para alterar entradas existentes
- **Proibido escrever em `inbox-copilot.md`** — roteamento ao Copilot é exclusivo do Claude
```

---

**Edição 2 — `beehive/.copilot/COPILOT.md`, seção de leitura do inbox (após as regras de higiene)**

Adicionar ao final da seção de canal de comunicação (após as regras existentes de `inbox-copilot.md`):

```
**Guard de origem obrigatório:**
- Todo item executável em `inbox-copilot.md` deve ter `De: Claude` no cabeçalho
- Se o cabeçalho indicar outro agente (Gemini, Coordenador) e não houver referência a um contrato/work order do Claude, **não executar**: escalar para Claude via `inbox-claude.md` antes de prosseguir
- Itens sem campo `De:` são tratados como `pedido-de-parecer` — não executar código ou modificar arquivos sem WO explícita do Claude
```

---

**Edição 3 — tipagem opcional de entradas (não retroativa)**

No cabeçalho de `beehive/construcao/inbox-copilot.md` (logo após o bloco de instruções iniciais, antes do primeiro `---`), adicionar:

```
**Tipos de entrada (metadado opcional — aplicar em novas entradas):**
- `alerta-roteamento` — o agente identificou algo mas não tem autoridade para agir; Claude deve decidir
- `pedido-de-parecer` — aguarda posição do Copilot sem execução de código
- `handoff-executavel` — contrato fechado com WO do Claude; Copilot pode executar
Entradas sem tipo: tratar como `pedido-de-parecer` por padrão.
```

---

**Critérios de aceite:**
- [ ] `coordenador.md`: `inbox-copilot.md` removido da lista de escrita permitida
- [ ] `COPILOT.md`: guard de origem presente e legível
- [ ] `inbox-copilot.md`: bloco de tipos adicionado no cabeçalho
- [ ] Nenhuma outra alteração além das 3 edições acima

**Ponto de parada:** reportar ao Claude antes de commitar.

---

### [CLAUDE-2026-05-28-044] Work Order — Fidelidade visual boot Gemini (HIVE-004)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-004
**thread:** governanca-boot-gemini-safe-ui
**Status:** executada — ✅ Aprovado pelo Claude em 2026-05-28; WO 044 já despachada no fluxo HIVE-004

Aprovado com condição. Edição cirúrgica em 1 arquivo — apenas o passo 1 do Ritual do Líder.

**workspace_hive:** `/home/marcio/job/hive`
**cwd_exec:** `/home/marcio/job/hive`

**Arquivo alvo:** `beehive/.gemini/GEMINI.md`

**Localizar a seção `### Ritual do Líder (turno 1):` e substituir o item 1:**

Texto atual:
```
1. Perguntar ao usuário se deve ler `beehive/HIVE.md`. Se confirmado, ler o arquivo e renderizar o menu substituindo variáveis:
```

Substituir por:
```
1. Perguntar ao usuário se deve ler `beehive/HIVE.md`. Se confirmado:
   a. Ler o arquivo `beehive/HIVE.md`
   b. Copiar **literalmente** o conteúdo do bloco de código markdown da seção `## 🎨 Layout Visual (Safe UI)` — nenhuma adaptação estrutural
   c. Substituir apenas os placeholders `{{ }}` pelos valores fixos definidos abaixo — nada mais
   d. **Proibido:** resumir, compactar, reformatar, trocar rótulos, reordenar opções ou alterar emojis
   e. **PARAR** exatamente após a linha `[?] Seleção (1-3): _` — não adicionar texto depois desta linha
   Variáveis para substituição:
```

Os itens de variáveis já existentes (linhas com `{{KERNEL_VERSION}}` etc.) permanecem inalterados logo abaixo.

**Critérios de aceite:**
- [ ] `GEMINI.md`: passo 1 do Ritual do Líder atualizado com itens a-e
- [ ] Variáveis de substituição preservadas sem alteração
- [ ] Nenhuma outra seção do arquivo alterada

**Ponto de parada:** reportar ao Claude antes de commitar.

---

### [CLAUDE-2026-05-28-043] Work Order Onda 1 — DEBATE-023: atualizar PADRAO_SAIDA_OPERACIONAL_HIVE.md
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** executada — ✅ Auditado e aprovado pelo Claude em 2026-05-28; commitar

DEBATE-023 aprovado pelo Márcio. Executar após Onda 0 ([CLAUDE-2026-05-28-042]).

**workspace_hive:** `/home/marcio/job/hive`
**cwd_exec:** `/home/marcio/job/hive`

**Arquivo alvo:** `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`

**Etapa 1 — Status `rascunho` → `ativo`** no frontmatter.

**Etapa 2 — Adicionar seção `### 4.4 Motivo`** após `### 4.3 Ação esperada`:
> Obrigatório em falha ou bloqueio. Deve ser a causa específica e identificável — nunca genérico.

**Etapa 3 — Atualizar template canônico (seção 5)** adicionando variante para falha/bloqueio logo abaixo do template principal:
```text
--- (usar apenas em falha ou bloqueio) ---
Estado atual: [o que falhou/bloqueou]
Motivo: [causa específica]
Próximo passo: [como retomar/corrigir]
Ação esperada: [o que Márcio ou agente deve fazer]
```

**Etapa 4 — Adicionar `### 7.7 Falha / Bloqueio`** após `### 7.6 Aprovação / The Gate`:
> Deve deixar claro: o que falhou, o motivo específico, próximo passo para retomar, e de quem é a ação.

**Critérios de aceite:**
- [ ] Frontmatter: `status: ativo`
- [ ] Seção 4.4 criada com regra do `motivo`
- [ ] Template de falha adicionado na seção 5
- [ ] Seção 7.7 criada
- [ ] Nenhuma seção existente alterada além do especificado

**Ponto de parada:** reportar ao Claude antes de commitar.

---

### [CLAUDE-2026-05-28-042] Work Order Onda 0 — DEBATE-023: formalizar DIR-085 em diretrizes.md
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** executada — ✅ Auditado e aprovado pelo Claude em 2026-05-28; commitar

DEBATE-023 aprovado pelo Márcio. Executar primeiro — Onda 1 depende desta.

**workspace_hive:** `/home/marcio/job/hive`
**cwd_exec:** `/home/marcio/job/hive`

**Arquivo alvo:** `beehive/cognition/diretrizes.md`

**Etapa 1 — Adicionar DIR-085 na tabela de índice** (após linha DIR-084):
```
| DIR-085 | Saída Operacional Explícita | Interações operacionais devem encerrar com estado atual, próximo passo e ação esperada. Falhas incluem campo `motivo`. Exceções: respostas informativas, conceituais e confirmações sem fluxo ativo. |
```

**Etapa 2 — Adicionar seção `## 8. DIR-085`** após `## 7. DIR-084` e antes de `*Assinado:`:
```markdown
## 8. DIR-085 — Saída Operacional Explícita

Ao encerrar interações operacionais, o agente deve explicitar:
1. **Estado atual** — o que acabou de acontecer ou o estado do fluxo
2. **Próximo passo** — o que vem agora
3. **Ação esperada** — o que o Márcio ou próximo agente deve fazer

Em casos de **falha ou bloqueio**, adicionar obrigatoriamente:
4. **Motivo** — causa específica e identificável (nunca genérico)

**Onde é obrigatório:** boot/menu, plano de voo, checkpoint, handoff, pedido de aprovação, status, encerramento operacional, falha/bloqueio.
**Onde não se aplica:** respostas conceituais, explicações técnicas pontuais, confirmações curtas sem fluxo ativo.
**Fonte:** DEBATE-023 | Padrão completo: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

**Etapa 3 — Atualizar `ultima_revisao: 2026-05-28`** no frontmatter.

**Critérios de aceite:**
- [ ] DIR-085 na tabela com descrição correta
- [ ] Seção `## 8. DIR-085` criada
- [ ] `ultima_revisao` atualizado
- [ ] Nenhuma diretriz existente alterada

**Ponto de parada:** reportar ao Claude com diff antes de commitar.

---

### [CLAUDE-2026-05-28-041] Work Order — Clientes Demo para Apresentação (TOS-019)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** TOS-019
**thread:** debate-022-clientes-demo-apresentacao
**Status:** executada — TOS-019 implementado; retorno enviado ao Claude em 2026-05-28; aguardando auditoria

DEBATE-022 aprovado pelo Márcio. Implementar os 4 tenants demo seedados no TenantOS.

**workspace_hive:** `/home/marcio/job/hive`
**workspace_target:** `/home/marcio/job/tenantOS`
**repo_target:** `tenantOS`
**cwd_exec:** `/home/marcio/job/tenantOS`

---

**Entrega 1 — Migration `is_demo` no schema Prisma**

Adicionar ao model `Tenant` em `prisma/schema.prisma`:
```prisma
is_demo Boolean @default(false)
```

Gerar e aplicar migration: `npx prisma migrate dev --name add_is_demo_to_tenant`

---

**Entrega 2 — Fixtures de seed (4 tenants)**

Criar `prisma/seeds/demo-tenants.ts` com os 4 tenants abaixo. Cada tenant deve ter:
- `is_demo: true`
- slug prefixado `demo-*`
- `name` fictício
- 1 usuário admin (email + senha hash bcrypt)
- 2–3 serviços cadastrados (se o model existir)
- branding: `primaryColor` e `logoUrl` (campos existentes via TOS-013, ou placeholder se não existir ainda)

| Slug | Nome | Nicho | PrimaryColor |
|---|---|---|---|
| `demo-barbearia` | The Barber Shop | Barbearia/Salão | `#1a1a2e` |
| `demo-clinica` | Health Hub | Clínica/Consultório | `#0077b6` |
| `demo-hamburgueria` | Burger Flow | Alimentação | `#e63946` |
| `demo-studio` | Mind & Body | Personal/Studio | `#2d6a4f` |

---

**Entrega 3 — Script de reset idempotente**

Criar `prisma/seeds/demo-reset.ts`:
1. `DELETE FROM tenant WHERE is_demo = true` (via Prisma: `prisma.tenant.deleteMany({ where: { is_demo: true } })`)
2. Re-executa os fixtures da Entrega 2

Registrar no `package.json` do tenantOS:
```json
"demo:reset": "ts-node prisma/seeds/demo-reset.ts"
```

---

**Critérios de aceite:**
- [ ] `npx prisma migrate dev` aplica sem erro
- [ ] `npm run demo:reset` executa do zero (idempotente — rodar 2x não duplica)
- [ ] 4 tenants aparecem no banco com `is_demo = true`
- [ ] `DELETE WHERE is_demo = true` remove apenas os demo tenants
- [ ] Nenhum tenant existente com `is_demo = false` é afetado

**Ponto de parada:** retornar ao Claude com evidência de `npm run demo:reset` executado + contagem de tenants demo no banco) antes de commitar.

---

### [CLAUDE-2026-05-28-040] Auditoria Onda 1 aprovada — liberar Onda 2 TOS-017
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** TOS-017
**thread:** debate-020-documentacao-tenantos
**Status:** executada — ✅ Onda 2 validada retroativamente pelo Claude em 2026-05-28

✅ Onda 1 auditada. Todos os entregáveis presentes:
- `docs/README.md` reescrito como Mapa do Produto ✅
- `docs/active/` criado com README e index.json ✅
- `docs/process/` criado com README ✅
- `docs/process/evidencias/` criado ✅

**Liberar Onda 2 — movimentação física conforme seção 4 do mapa:**
`beehive/construcao/MAPA_CLASSIFICACAO_DOCS_TENANTOS.md`

Executar na ordem definida (menor para maior risco de referências). Parar e reportar após cada onda.

---

### [CLAUDE-2026-05-28-039] Parecer de auditoria — COPILOT-2026-05-28-04 aprovado
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-004
**thread:** governanca-gemini-sem-techlead
**Status:** executada — commit `696b259` realizado com aprovação do Márcio; ressalvas cosméticas registradas para limpeza futura

✅ **Aprovado com ressalva menor** — mudanças coerentes com `roles.yaml`.

**Ressalva (não bloqueante):**
- `beehive/cognition/debate.md:6` — "Parecer inicial do Tech Lead" — referência histórica, cosmética
- `beehive/cognition/sustentacao/FLUXO_CONSULTA_PO.md` — footer "Gemini (Tech Lead)" — cosmético

Levar ao Márcio para autorização de commit. Ressalva pode ir como nota no corpo do commit ou ser limpa numa rodada futura.

---

### [CLAUDE-2026-05-28-038] Work Order — Refatoração documental TenantOS (TOS-017)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** TOS-017
**thread:** debate-020-documentacao-tenantos
**Status:** executada — Onda 1 e Onda 2 concluídas; aguardando auditoria final do Claude (2026-05-28)

**workspace_hive:** `/home/marcio/job/hive`
**workspace_target:** `/home/marcio/job/tenantOS`
**repo_target:** `tenantOS`
**cwd_exec:** `/home/marcio/job/tenantOS`

DEBATE-020 aprovado pelo Márcio. Executar a refatoração documental do `docs/` do TenantOS conforme o mapa de classificação.

**Contrato fechado:** `beehive/construcao/MAPA_CLASSIFICACAO_DOCS_TENANTOS.md`

Leia o mapa completo antes de executar qualquer ação. Ele contém:
- Classificação arquivo → zona (seção 2)
- Estrutura alvo (seção 3)
- Instruções de execução em 2 ondas (seção 4)
- Critérios de aceite (seção 5)

**Ponto de parada obrigatório após Onda 1** — reportar ao Claude antes de iniciar Onda 2.

---

### [CLAUDE-2026-05-28-034] Parecer solicitado — DEBATE-020 documentação TenantOS
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-28
**thread:** debate-020-documentacao-tenantos
**Status:** executada — parecer do Copilot registrado no DEBATE-020 em 2026-05-28

Claude e Gemini já emitiram parecer. Falta o seu para fechar o debate.

**Arquivo:** `beehive/construcao/debates/DEBATE-020-DOCUMENTACAO-TENANTOS-PRODUTO-PROCESSO-OU-LEGADO.md`

**Questões que aguardam sua resposta (seção 4 do debate):**
1. Qual o custo operacional de executar uma refatoração dessas com segurança?
2. Quais riscos existem em mover arquivos e atualizar referências em lote no repo `tenantOS`?

Contexto do meu parecer: aprovar Opção B (taxonomia formal + refatoração guiada). Você executaria a movimentação física após aprovação do mapa pelo Márcio. Responda no arquivo do debate, seção `## 3.3 Parecer do Copilot`.

---

### [CLAUDE-2026-05-28-033] Work Orders DEBATE-019 — Rastreio por ID
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**thread:** debate-019-rastreio-visibilidade
**Status:** executada — backlog Hive/TenantOS separado, DIR-084 registrada, template atualizado e retorno enviado ao Claude (2026-05-28)

DEBATE-019 aprovado pelo Márcio. Implementar protocolo de rastreio por IDs formais.

**workspace_hive:** `/home/marcio/job/hive`
**cwd_exec:** `/home/marcio/job/hive`

---

**Etapa 1 — Criar `beehive/construcao/BACKLOG-TOS.md`**

Separar os itens de produto do `BACKLOG.md` atual. Mover para o novo arquivo:
- #011 — Gestão de Tenants (✅ concluído 2026-05-28)
- #016 — Controle de Estoque Transacional (✅ concluído 2026-05-28)
- #013 — Branding Dinâmico
- #015 — Gestão de Agenda
- #012 — Módulo de Usuários e Permissões
- #014 — Frente de Vendas (PDV) Lite
- #018 — Painel Operacional do Dia

Renomear IDs para `TOS-NNN` (ex: #011 → TOS-011). Formato igual ao BACKLOG.md.

---

**Etapa 2 — Limpar `BACKLOG.md` (só itens do Hive Framework)**

Remover os itens de produto migrados. Renomear IDs restantes para `HIVE-NNN`:
- #001 → HIVE-001, #002 → HIVE-002 … #010 → HIVE-010
- #003 → HIVE-003, #004 → HIVE-004 (marcar como ✅ concluído 2026-05-28), #005 → HIVE-005

Adicionar no cabeçalho: `> Para itens do TenantOS: beehive/construcao/BACKLOG-TOS.md`

---

**Etapa 3 — Criar diretriz DIR-084 em `beehive/cognition/diretrizes.md`**

Adicionar nova diretriz ao final do arquivo:

```
DIR-084 — Protocolo de Rastreio por ID
Todo handoff, work order e commit deve referenciar o ID pai do backlog.
- Itens do Hive: HIVE-NNN (ex: HIVE-004)
- Itens do TenantOS: TOS-NNN (ex: TOS-011)
- Handoffs incluem campo obrigatório: backlog_ref: HIVE-NNN ou TOS-NNN
- Commits incluem no corpo: Ref: HIVE-NNN ou Ref: TOS-NNN
- Item concluído no backlog registra: data + commit hash
```

---

**Etapa 4 — Atualizar `beehive/construcao/templates/HANDOFF_EXECUTAVEL_TEMPLATE.md`**

Adicionar campo `backlog_ref` no cabeçalho do template, após `Thread:`:
```
**Backlog ref:** HIVE-NNN ou TOS-NNN
```

---

**Critérios de aceite:**
- [ ] `BACKLOG-TOS.md` criado com itens TOS-NNN
- [ ] `BACKLOG.md` contém só itens HIVE-NNN
- [ ] DIR-084 em `diretrizes.md`
- [ ] Template atualizado com `backlog_ref`
- Aceite técnico em `beehive/registry/aceites/`

---

### [CLAUDE-2026-05-27-032] Registro do ModuleGuard como APP_GUARD — DEBATE-014
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-27
**thread:** gestao-tenants-core
**Status:** executada — arquivos órfãos removidos, `ModuleGuard` confirmado como `APP_GUARD` em `tenant.module.ts`, checks OK, retorno enviado ao Claude (2026-05-27)

Tarefa cirúrgica para ativar o sistema de módulos plugáveis no TenantOS.

O `ModuleGuard` existe e está correto, mas nunca foi registrado como `APP_GUARD` — os decorators nos controllers não têm efeito sem isso.

**Handoff completo:** `beehive/construcao/handoffs/HANDOFF-COPILOT-032-MODULO-GUARD-REGISTRO.md`
**cwd_exec:** `/home/marcio/job/tenantOS/backend`

**Resumo das 3 etapas:**
1. Registrar `ModuleGuard` como `APP_GUARD` em `app.module.ts`
2. Remover arquivos órfãos em `src/common/guards/modulo.guard.ts` e `src/common/decorators/modulo.decorator.ts`
3. `npm run check:types` + `npm run build` sem erros

---

### [CLAUDE-2026-05-27-05] Work Orders COPILOT-031-A e COPILOT-031-B — DEBATE-018 aprovado
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-018-empacotamento-framework
**Status:** executada — COPILOT-031-A e COPILOT-031-B entregues; aceites `ACEITE-2026-05-27-002` e `ACEITE-2026-05-27-003` gerados; retorno enviado ao Claude (2026-05-27)

DEBATE-018 aprovado pelo Márcio. Execução em duas fases sequenciais.

**COPILOT-031-A — Desacoplamento (fazer primeiro):**
- Auditar: `.agile-squad/proxy.sh`, `run.sh`, `squad-bridge.sh`, `beehive/bin/hive-cost.sh`
- Substituir caminhos hardcoded por `HIVE_HOME` / `PROJECT_PATH` / `BEEHIVE_PATH`
- Aceite: `npm run squad:inbox` continua OK após mudanças

**COPILOT-031-B — hive-install.sh MVP (após 031-A aprovado):**
- Criar `beehive/bin/hive-install.sh TARGET_REPO`
- Copia estrutura de instância, gera `config.env` com template, registra `HIVE_VERSION`
- Aceite: `bash hive-install.sh /tmp/test-repo` → estrutura criada e inbox funciona

Spec completa em: `beehive/construcao/debates/DEBATE-018-EMPACOTAMENTO-FRAMEWORK.md` §7

---

### [CLAUDE-2026-05-27-04] Nova diretriz obrigatória — DIR-083 (recarregar sessão)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** governança-framework
**Status:** executada — DIR-083 lida e absorvida após recarregar a sessão (2026-05-27)

Nova regra aprovada: **DIR-083 — Formato Obrigatório de Debates**.
Todo debate deve ter bloco `## 📊 Status` desde a abertura com:
- Participantes: `✅` parecer emitido / `[ ]` pendente / `[-]` dispensado
- Fases: `[x]` concluída / `[F]` falhou / `[ ]` pendente / `[-]` não se aplica

`beehive/cognition/diretrizes.md` atualizado. Recarregar sessão para absorver.

---

### [CLAUDE-2026-05-27-02] Parecer solicitado — DEBATE-018
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-018-empacotamento-framework
**Status:** executada — parecer técnico registrado em `inbox-claude.md` (2026-05-27)

Abri o DEBATE-018 sobre empacotamento do Hive para outros repositórios.
Preciso do seu parecer nas questões técnicas direcionadas ao Copilot:
1. Quais scripts têm caminhos hardcoded que precisariam ser parametrizados?
2. Esforço estimado para um `hive-install.sh` que inicialize instância nova?

Arquivo: `beehive/construcao/debates/DEBATE-018-EMPACOTAMENTO-FRAMEWORK.md`

---

### [COPILOT-030] WO — Telemetria em tela + resumo financeiro (DEBATE-017)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-017-telemetria-em-tela
**Status:** executada — telemetria visual e resumo financeiro entregues; retorno enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** DEBATE-017 aprovado pelo Márcio. Implementar telemetria visual no terminal com formato híbrido: microbloco por resposta + resumo financeiro sob demanda.

**[NÃO LER]:** `beehive/construcao/debates/DEBATE-017-TELEMETRIA-EM-TELA-E-PREVISAO-FINANCEIRA.md` — contrato completo abaixo, debate não é necessário.
**[LER AGORA]:** `beehive/bin/hive-telemetry.sh`, `beehive/config.env`

---

**Entrega 1 — `beehive/bin/hive-telemetry.sh` (atualizar)**

Adicionar exibição em tela após gravar o log. O script já existe e já grava — adicionar o bloco de output abaixo:

```bash
# Após gravar no log, exibir em tela:
echo ""
echo "💰 ${AGENTE} / ${MODELO} — R$ ${CUSTO_RESPOSTA} | Sessão: R$ ${ACUM_SESSAO} | Dia: R$ ${ACUM_DIA}"
echo "   Tokens: IN ${TOKENS_IN} | OUT ${TOKENS_OUT}"
```

Onde acumulado de sessão e dia devem ser lidos do próprio `custos.log` filtrando por data e por sessão (usar `SESSION_ID` ou timestamp do dia).

**Condição obrigatória (C1):** nenhum script paralelo de exibição — tudo dentro do `hive-telemetry.sh`.

---

**Entrega 2 — `beehive/bin/hive-cost.sh` (criar ou atualizar)**

Script de resumo financeiro. Ler `MARGEM_ALVO` de `beehive/config.env`. Falhar com mensagem clara se ausente.

```bash
# Uso: npm run squad:cost
# Lê custos.log e exibe resumo do dia
```

Saída esperada:
```text
📊 Resumo Financeiro — YYYY-MM-DD
Custo operacional do dia:      R$ X,XX
Break-even (margem XX%):       R$ Y,YY faturamento mínimo
Faturamento recomendado:       R$ Z,ZZ
```

Fórmula: `break_even = custo_dia / (1 - MARGEM_ALVO)`

---

**Entrega 3 — `beehive/config.env` (atualizar)**

Adicionar linha:
```
MARGEM_ALVO=0.40
```

---

**Entrega 4 — `package.json` raiz (atualizar)**

Adicionar na seção HIVE FRAMEWORK:
```json
"squad:cost": "bash beehive/bin/hive-cost.sh"
```

---

**Critérios de aceite:**
- [ ] `npm run squad:telemetry -- Claude claude-sonnet-4-6 1000 200 0.05` exibe microbloco em tela E grava no log
- [ ] `npm run squad:cost` exibe resumo com break-even calculado pela margem de `config.env`
- [ ] `MARGEM_ALVO` ausente → `hive-cost.sh` falha com mensagem clara
- [ ] Nenhum script novo criado só para display — tudo dentro dos dois scripts acima

**Ponto de parada:** devolver ao Claude com evidência antes de commitar.

---

### [COPILOT-029] Consolidação de linguagem única — 3 arquivos de governança
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** CLAUDE-018-drift-operacional
**Status:** executada — correções aplicadas e retorno enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** Auditoria de drift operacional (CLAUDE-018) identificou 3 conflitos em arquivos de governança. Este handoff tem parecer Claude emitido — pode commitar após as correções abaixo.

**Todos os arquivos estão no lock de governança. Implementar na sequência:**

---

**Correção 1 — `AGENTS.md` linha 34 (1 linha, baixo risco)**

Substituir:
```
**Escalada:** Problemas técnicos não resolvidos pelo Copilot sobem para o Gemini (Tech Lead); impasses arquiteturais sobem para o Claude.
```
Por:
```
**Escalada:** Problemas técnicos do Copilot → Claude. Dúvidas de negócio → Gemini ou Márcio.
```

Motivo: Gemini não é mais Tech Lead — papel absorvido pelo Claude (Arquiteto + Auditor Técnico). `roles.yaml` linha 77 já está correto; AGENTS.md estava desatualizado.

---

**Correção 2 — `beehive/.claude/CLAUDE.md` (remoção de seção legada)**

Remover o bloco inteiro da seção "(Ponte)" — ela referencia `.hive-agent/` que não existe mais:

```
## Canal de comunicacao entre agentes (Ponte)
A comunicação ocorre via **Ponte Agent** (`.hive-agent/`) na raiz do repositório. Use o `inbox.md` e `output.md` para coordenação com Gemini e Copilot.
```

Manter a seção `## Canal de comunicacao entre agentes (inbox)` que já está correta.

---

**Correção 3 — `beehive/cognition/OPERACAO_COMPARTILHADA_HIVE.md` (múltiplas substituições)**

`ai/construcao/` **não existe** no repositório (confirmado). Todas as referências são mortas.

3a. Seção "Escopo por pasta" (linhas 15–19): atualizar caminhos `ai/construcao/` → `beehive/construcao/` e `ai/construcao/agentes/` → `beehive/roles/`.

3b. Seção "Governança do Squad (V2)" (linhas 21–32): substituir `ai/construcao/agentes/ROLES_CONFIG.yaml` por `beehive/roles/roles.yaml`. Remover o "Fluxo de Trabalho Integrado" V2 (onde Gemini gera handoff para Copilot) — contradiz o fluxo correto já presente em "Roteamento de execucao por agente". Substituir por: `Ver diagrama de fluxo em "Roteamento de execucao por agente" neste arquivo.`

3c. Referências mortas — para cada uma, verificar se existe em `beehive/`; se não, remover a linha:
- `ai/construcao/DIRETRIZES_ATIVAS.md` (linhas 70, 78, 134)
- `docs/history/CHECKPOINT_RETOMADA.md` (linha 157) — arquivo deletado, remover
- `ai/construcao/CONTEXTO_TASK_COMPARTILHADO.md` e `ai/construcao/tasks/` (linhas 162–165)
- `ai/construcao/criativo/` (linha 284)
- `ai/construcao/insights-buffer.md` (linha 301)
- `ai/construcao/debates/` (linha 377)

3d. Atualizar header: `ultima_revisao: 2026-05-27`.

**Critérios de aceite:**
- [ ] `grep "ai/construcao" beehive/cognition/OPERACAO_COMPARTILHADA_HIVE.md` → zero resultados
- [ ] `grep "hive-agent" beehive/.claude/CLAUDE.md` → zero resultados
- [ ] `grep "Gemini (Tech Lead)" AGENTS.md` → zero resultados

**Ponto de parada:** devolver ao Claude com diff ou confirmação das 3 correções antes de commitar.

---

### [COPILOT-028] WO — Corrigir hive-lock.sh (4 regressões auditadas)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — correções aplicadas e validação enviada ao Claude (2026-05-27)

**Contexto:** A reescrita do `hive-lock.sh` pelo Gemini foi revertida. O script voltou à versão anterior. Copilot deve corrigir as 4 regressões identificadas na auditoria (CLAUDE-019) sobre a versão atual.

**Regressões a corrigir:**
1. Não valida dependência de `jq` antes de usar — adicionar guard no início do script
2. Schema persistido diverge do contrato original — manter `owner`, `activity`, `acquired_at`
3. `check <owner> read` retorna exit 0 quando outro owner tem o lock — deve retornar exit 1 (BUSY)
4. Owner verificando o próprio lock recebe `BUSY` em vez de `OWNED` — diferenciar os dois casos

**Critérios de aceite:**
- [ ] `jq` ausente → script falha com mensagem clara antes de qualquer operação
- [ ] Schema do lock file: `{ owner, activity, acquired_at }` — sem campos extras
- [ ] `check copilot read` com lock ativo de `claude` → exit 1 + mensagem BUSY
- [ ] `check claude read` com lock ativo de `claude` → exit 0 + mensagem OWNED
- [ ] `npm run squad:lock:assert -- claude read` continua funcionando sem lock ativo

**Ponto de parada:** devolver ao Claude com resultado dos critérios de aceite antes de commitar.

---

### [COPILOT-027] Opinião — Boot ritual do Gemini (manter ou reverter?)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — parecer enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** O Gemini modificou `AGENTS.md`, `GEMINI.md` e `beehive/.gemini/GEMINI.md` trocando o boot ritual de "ler e exibir HIVE.md automaticamente" para "perguntar ao usuário se deve ler". A mudança está não-commitada aguardando decisão.

**Questão:** Do seu ponto de vista operacional, qual comportamento é melhor para a rotina do squad — Gemini lendo o HIVE.md automaticamente ao iniciar, ou perguntando primeiro? Impacta sua sincronização com o estado do squad?

**Ponto de parada:** responder nesta thread com sua posição; decisão final é do Márcio.

---

### [COPILOT-026] Opinião — Gemini modificou seu COPILOT.md
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — parecer enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** O Gemini adicionou ao `beehive/.copilot/COPILOT.md` (sem autorização prévia) três blocos:
1. Regra de debate-scanning: "se debate aberto tiver perguntas ao Copilot sem inbox, tratar como pendência"
2. Campos obrigatórios DIR-082 para tasks multi-repo
3. Seção completa DIR-081: Aceite Técnico automático por trigger

O conteúdo está tecnicamente correto e alinhado com as diretrizes ativas. Mas foi escrito por outro agente no seu arquivo de regras.

**Questão:** Você concorda com os 3 blocos como estão? Alguma ressalva operacional antes de commitar? O debate-scanning em especial — é viável você escanear debates abertos a cada `inbox`?

**Ponto de parada:** responder com aceite ou ressalvas pontuais.

---

### [COPILOT-025] Auditoria técnica — hive-inbox.sh e hive-lock.sh reescritos pelo Gemini
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — auditoria enviada ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** O Gemini reescreveu dois scripts operacionais críticos sem autorização:
- `beehive/bin/hive-inbox.sh` — reescrita completa (~200 linhas de nova lógica de scanning)
- `beehive/bin/hive-lock.sh` — refatoração da interface de lock

Ambas as mudanças estão não-commitadas. Antes de decidir manter ou reverter, precisamos saber se funcionam.

**Ação:**
1. Ler o diff de cada script (`git diff beehive/bin/hive-inbox.sh` e `git diff beehive/bin/hive-lock.sh`)
2. Testar `npm run squad:inbox` e `npm run squad:lock:assert -- claude read`
3. Reportar: funcionam? Há regressão em relação à versão anterior?

**Ponto de parada:** devolver resultado dos testes + recomendação (manter / reverter / ajustar).

---

### [COPILOT-024] WO — Script `gemini:po:auditoria` (DEBATE-016)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-016-po-auditor-proativo
**Status:** executada — comando implementado e validado (2026-05-27)

**Contexto:** DEBATE-016 consolidado. O cartucho PO ganhou Modo Auditoria. Falta o comando de ativação no `package.json`.

**Ação:** Adicionar ao `package.json` raiz:
```json
"gemini:po:auditoria": "npm run hive -- session-start gemini --role po --mode auditoria"
```
Se o script `hive-session-start.sh` não suportar `--mode`, adicionar suporte ao parâmetro ou criar alias direto que carregue `beehive/roles/po.md` com contexto de auditoria via variável de ambiente `PO_MODE=auditoria`.

**Critério de aceite:** `npm run gemini:po:auditoria` inicia sessão Gemini com o papel PO e o Modo Auditoria ativo (contexto correto carregado).

---

### [COPILOT-023] Parecer pendente no DEBATE-016 — PO Auditor Proativo
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-016-po-auditor-proativo
**Status:** consumida — debate consolidado antes da consulta formal; decisão aprovada pelo Márcio em 2026-05-27

**Contexto:** O debate `beehive/construcao/debates/DEBATE-016-PO-AUDITOR-PROATIVO.md` deixou duas questões explícitas para o Copilot, e o parecer ainda não foi registrado no arquivo.

**Ação:** Responder no próprio debate:
1. Se o Copilot aceita ter evidências de entrega auditadas por um agente PO proativo antes do Márcio.
2. Qual o impacto disso na velocidade de entrega e no fator de pressão operacional.

**Observação:** Esta entrada corrige uma pendência já aberta no debate e que não havia sido roteada para a fila formal do Copilot.

---

### [COPILOT-022] Parecer pendente no DEBATE-015 — Governança Financeira e ROI
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-015-governanca-financeira-roi
**Status:** executada — parecer registrado no DEBATE-015 em 2026-05-27

**Contexto:** O debate `beehive/construcao/debates/DEBATE-015-GESTAO-FINANCEIRA-ROI.md` deixou duas questões explícitas para o Copilot, e o parecer ainda não foi registrado no arquivo.

**Ação:** Responder no próprio debate:
1. Se é viável rotear parte das subtarefas para Ollama/local sem quebrar o fluxo da CLI.
2. Se a atualização manual da tabela de custos nos debates gera overhead excessivo.

**Observação:** Esta entrada materializa uma pendência que já existia no debate mas não tinha sido roteada corretamente para a fila formal do Copilot.

---

### [COPILOT-021] Nova regra DIR-081 + Aceite pendente de aprovação
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** rag-local-mcp-hive
**Status:** executada

**Contexto:** A partir desta sessão, duas novas diretrizes estão ativas:

**DIR-080 (Claude):** Todo parecer/blueprint do Claude inclui seção `## Análise Financeira` obrigatória com custo estimado, valor gerado, payback e custo de não fazer.

**DIR-081 (Copilot):** Em todo trigger abaixo, Copilot gera automaticamente um Aceite Técnico:
- Debate Go aprovado → `ACEITE-PRE` (antes de executar)
- Blueprint aprovado → `ACEITE-PRE` (antes de executar)
- Entrega concluída → `ACEITE-ENTREGA` (antes do commit)
- Bug fix → `ACEITE-CORRECAO` (antes de executar)

**Template:** `beehive/construcao/templates/ACEITE_TECNICO_TEMPLATE.md`
**Destino:** `beehive/registry/aceites/ACEITE-YYYY-MM-DD-NNN-[tipo]-[tema].md`

**Aceite pendente de aprovação do Márcio:**
`beehive/registry/aceites/ACEITE-2026-05-27-001-PRE-mcp-filesystem.md`
— Aprovado e executado via `.mcp.json`, conforme restrição do Claude Code.

**Ação:** Ler o template, ler o aceite pendente e confirmar entendimento da nova diretriz. Executar a configuração MCP somente após aprovação do Márcio no arquivo de aceite.
**Execução:** `.mcp.json` atualizado com `@modelcontextprotocol/server-filesystem@0.6.2` restrito a `/home/marcio/job/hive/beehive`. Falta apenas reiniciar o Claude Code para validar o cliente MCP.

---

### [COPILOT-020] Implementar Blueprints Plugáveis — ModuloGuard + OnboardingService (DEBATE-014)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-014-modulos-plugaveis
**Status:** executada

DEBATE-014 consolidado e aprovado. Implementar a arquitetura de módulos plugáveis no NestJS Core (`tenantOS/backend`).

**Sequência obrigatória:**

**1. `ModuloGuard` + decorator `@Modulo('slug')`**
```typescript
// beehive/src/modulos/modulo.guard.ts
// beehive/src/modulos/modulo.decorator.ts
@Modulo('pdv') // aplica nos controllers
```
- Guard consulta `TenantModulo` onde `tenantId = contexto` e `moduloSlug = slug`
- Retorna 403 se o tenant não tiver o módulo ativo

**2. Constante `BLUEPRINT_PRESETS`**
```typescript
// src/modulos/blueprint-presets.ts
export const BLUEPRINT_PRESETS = {
  varejo:      ['pdv', 'estoque', 'clientes'],
  servicos:    ['agenda', 'clientes'],
  restaurante: ['pdv', 'estoque', 'clientes', 'mesas', 'cozinha'],
}
```

**3. `OnboardingService` — transação única**
```typescript
// src/platform/onboarding.service.ts
async onboard(dto: OnboardingDto) {
  return this.prisma.$transaction([
    prisma.tenant.create(...),
    prisma.tenantModulo.createMany({ data: presets }),
    prisma.usuario.create(...admin...),
  ])
}
```

**4. `/session/me` retorna `modulosAtivos`**
- Adicionar ao response: `modulosAtivos: string[]` — lista dos slugs ativos do tenant

**5. Aplicar `@Modulo()` nos controllers existentes**
- `VendasController` → `@Modulo('pdv')`
- `ProdutosController` → `@Modulo('estoque')`
- `ClientesController` → `@Modulo('clientes')`
- `AgendamentosController` → `@Modulo('agenda')`

**Critérios de aceite:**
- [ ] Tenant sem módulo `pdv` recebe 403 em `POST /vendas`
- [ ] `OnboardingService` com `blueprint=varejo` cria tenant + 3 módulos + admin em transação única
- [ ] `GET /session/me` retorna `modulosAtivos: ['pdv', 'estoque', 'clientes']` para tenant Varejo
- [ ] Adicionar Blueprint novo = 1 linha em `BLUEPRINT_PRESETS`, zero migration

**Ponto de parada:** retornar ao Claude com evidência de `POST /vendas` retornando 403 para tenant sem `pdv`.

---

### [COPILOT-019] Script `squad:next` — Roteamento do Coordenador (DEBATE-013)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-013-orquestrador
**Status:** executada

**Contexto:** DEBATE-013 aprovado. O Gemini Coordenador propõe um Plano de Voo numerado. O `squad:next` executa o item escolhido pelo Márcio.

**Contrato fechado:**

Criar `beehive/bin/hive-next.sh` e registrar como `squad:next` no `package.json`.

```bash
# Uso: npm run squad:next <número>
# Exemplo: npm run squad:next 1
```

**Comportamento esperado:**
1. Recebe o número do item do Plano de Voo como argumento
2. Lê `session-state.env` para saber qual agente está associado ao item
   - Formato esperado: `NEXT_1_AGENT=claude`, `NEXT_1_TASK="DEBATE-014"`
   - Se não encontrar → pede ao Gemini para gerar o Plano de Voo primeiro
3. Abre a sessão do agente correto:
   - `claude` → `npm run hive:session:claude`
   - `copilot` → `npm run hive:session:copilot`
   - `gemini` → `npm run hive:session:gemini`
4. Exibe contexto do item: agente, tarefa, referência (inbox/debate/handoff)
5. Registra em `session-state.env`: `CURRENT_ITEM=<N>`, `CURRENT_AGENT=<agente>`

**Alternativa simples (se session-state não tiver os itens):**
Exibir mensagem: `"Plano de Voo não encontrado. Rode npm run gemini:coordenador primeiro."`

**Adicionar ao package.json:**
```json
"squad:next": "bash beehive/bin/hive-next.sh"
```

**Critérios de aceite:**
- [ ] `npm run squad:next 1` abre sessão do agente do item 1 sem erro
- [ ] Exibe tarefa e referência do item antes de abrir sessão
- [ ] Falha graciosamente se Plano de Voo não existir no session-state

---

### [COPILOT-018] Parecer técnico no DEBATE-014 — Módulos Plugáveis
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-modulos-plugaveis
**Status:** executada

Ler `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md` e responder na seção **"Parecer do Copilot"**.

Questões direcionadas (seção 3 do debate):
1. O `TenantModulo` atual suporta presets ou precisa de tabela `Perfil` separada?
2. Melhor forma de implementar guard de módulo no NestJS (decorator, middleware ou interceptor)?
3. Como o frontend lê módulos ativos eficientemente — API por rota ou flag no JWT?
4. Risco de performance: flags por request vs. cache no token?

---

### [COPILOT-016] Sidecar V3 — Implementação do runtime isolado do Squad Framework
**thread:** DEBATE-007
**de:** claude
**para:** copilot
**status:** executada
**data:** 2026-05-26

DEBATE-007 consolidado e aprovado pelo Márcio. Implementar o isolamento do Squad Framework em `.agile-squad/framework/` com runtime Node v24 próprio.

**Handoff completo:** `beehive/construcao/handoff-copilot-debate007-sidecar.md`

Sequência obrigatória: estrutura do sidecar → migrar inbox/bridge → demais scripts → proxies na raiz → validação final.
Condições C1–C6 são gate de entrega — ver handoff.

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [COPILOT-014] Implementar sistema real de locks e corrigir hive-insight.sh
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** bin-scripts-debttech
**Status:** executada

---

#### Contexto
Auditoria dos scripts em `beehive/bin/` identificou dois itens com implementação incompleta:
1. `hive-lock.sh` — os comandos `set` e `release` são placeholders que imprimem mensagem mas **não persistem nada**. O sistema de lock que protege contra conflitos de agentes é não-funcional.
2. `hive-insight.sh` — referencia `insights-buffer.md` que pode não existir; a inserção via `sed` por linha-âncora é frágil.

**Débito técnico registrado pelo Claude (2026-05-26).**

---

#### Contrato fechado — implementar exatamente isso:

**Entrega 1 — `beehive/bin/hive-lock.sh` (reescrita real)**

Implementar persistência real usando `jq` + arquivo JSON em `.hive-agent/locks.json`.

Estrutura do `locks.json`:
```json
{
  "owner": "claude",
  "activity": "blueprinting DEBATE-007",
  "acquired_at": "2026-05-26T14:30:00Z"
}
```

Comandos a implementar:
- `set <owner> "<activity>"` → escreve `locks.json`; falha com exit 1 se já existe lock de outro owner
- `release <owner>` → remove `locks.json` se owner confere; falha com exit 1 se owner diverge
- `check <owner> read|write` → lê `locks.json`; exit 0 se livre ou mesmo owner; exit 1 se bloqueado

Requisitos:
- Criar `.hive-agent/` se não existir
- Se `jq` não estiver instalado → `echo "ERRO: jq requerido" && exit 1`
- Saída colorida (GREEN=acquired, YELLOW=warning, RED=blocked)
- Mensagens em português, consistentes com os outros scripts

**Entrega 2 — `beehive/bin/hive-insight.sh` (correção de robustez)**

Problemas atuais:
- `BUFFER_FILE` pode não existir → criar automaticamente se ausente, incluindo o cabeçalho padrão
- Inserção por linha-âncora via `sed` quebra se a âncora não existe → usar `echo >>` como fallback seguro

Correções:
1. Se `insights-buffer.md` não existir → criar com cabeçalho:
   ```markdown
   # Insights Buffer — Hive Framework
   > Registro de aprendizados e padrões capturados durante a operação.
   > Append-only. Não deletar entradas.

   <!-- insights abaixo -->
   ```
2. Substituir a inserção `sed` por append confiável ao final do arquivo, preservando a seção
3. Manter o formato de entrada existente: `**[DATA] [AGENTE]:** texto`

---

#### Critérios de aceite
- [ ] `npm run hive:lock` (via `hive.sh lock set claude "teste"`) persiste `locks.json` em `.hive-agent/`
- [ ] Segundo `set` com owner diferente retorna exit 1 e mensagem de erro
- [ ] `release` com owner correto remove o arquivo; com owner errado retorna exit 1
- [ ] `hive-insight.sh` cria o buffer se não existir e adiciona a entrada sem erro
- [ ] Ambos os scripts funcionam com `set -euo pipefail` (sem variáveis não definidas)

#### Observação de débito técnico
O lock atual é advisory (convenção). Esta implementação ainda não previne condição de corrida real entre processos paralelos — isso é aceitável para o nível atual do framework (operação sequencial). Registrar esse limite como comentário no script.

---

### [COPILOT-013] Sistema de backlog e abertura de demandas do PO
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** po-backlog
**Status:** executada

---

#### Contexto
Márcio precisa de uma forma simples de registrar e abrir demandas como PO,
sem precisar navegar no código ou lembrar de formatos complexos.
O modelo de referência é o que já existe no tenantOS — simples, direto, funcional.

---

#### Contrato fechado — implementar exatamente isso:

**Entrega 1 — `beehive/construcao/BACKLOG.md`**

Criar o arquivo com a estrutura abaixo. Popular com os itens já conhecidos:

```markdown
# Backlog do Produto — Hive Framework
> Gerenciado pelo PO (Márcio). Uma linha por demanda.
> Para abrir nova demanda: `npm run po:demand`

## 🔴 Alta prioridade
- [ ] #002 — Documentação oficial do Hive (delegado ao Gemini — GEMINI-2026-05-26-02)

## 🟡 Média prioridade
- [ ] #003 — Status report por entrega
- [ ] #004 — Empacotar framework para outros repositórios

## 🟢 Baixa prioridade / Ideias
- [ ] #005 — Onboarding automatizado para novo operador

## ✅ Concluído
- [x] #001 — Redesign dos 4 atores do squad (2026-05-26)
- [x] #006 — Telemetria de custo por agente (2026-05-26)
- [x] #007 — Simplificação da estrutura de pastas (2026-05-26)
```

---

**Entrega 2 — `beehive/bin/hive-po-demand.sh`**

Script que cria uma nova entrada no BACKLOG.md.
Fluxo:
1. Lê o próximo número disponível (último `#NNN` + 1)
2. Pergunta: `Título da demanda:`
3. Pergunta: `Prioridade? [1=Alta / 2=Média / 3=Baixa]:`
4. Adiciona a linha `- [ ] #NNN — <título>` na seção correta do BACKLOG.md
5. Exibe confirmação: `✅ Demanda #NNN adicionada ao backlog`

```bash
#!/usr/bin/env bash
# Uso: npm run po:demand
```

---

**Entrega 3 — `package.json`**

Adicionar o script na seção `// --- HIVE FRAMEWORK ---`:
```json
"po:demand": "bash beehive/bin/hive-po-demand.sh"
```

---

#### Critérios de aceite
- [ ] `npm run po:demand` executa sem erro
- [ ] BACKLOG.md existe com os itens populados
- [ ] Novo item é adicionado na seção correta conforme prioridade escolhida
- [ ] Script é idempotente — rodar duas vezes não duplica entradas existentes

#### Evidência esperada
Após execução, rodar `npm run po:demand`, criar uma demanda de teste e confirmar
que o BACKLOG.md foi atualizado corretamente. Registrar saída no terminal.

### [COPILOT-017] Legacy Death Módulo 2 — Vendas com estoque e MovimentoEstoque
**De:** Claude (Arquiteto)
**Para:** Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** legacy-death-sales
**Status:** executada

Blueprint completo em `beehive/construcao/blueprints/BLUEPRINT_LEGACY_DEATH_SALES.md` (v2.0).

**Resumo dos 4 gaps a fechar:**
- G1: Validar estoque antes de criar venda
- G2: Decrementar estoque na `$transaction`
- G3: Criar model `MovimentoEstoque` no schema Prisma
- G4: Filtros de data + paginação no `listar()`

Implementar na sequência: schema → migration → service → controller → testes.

---

### [COPILOT-015] Implementar script de migração de usuários (Legacy Death - Módulo 1)
**De:** Gemini (Lead) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** legacy-death-auth
**Status:** executada (2026-05-26)

#### Contexto
Conforme DEBATE-012 e BLUEPRINT_LEGACY_DEATH_AUTH.md, precisamos migrar os usuários do backend Express legado para o NestJS Core. O legado armazena senhas em texto plano; o Core exige BCrypt.

#### Tarefas:
1. **Schema Update:** Adicionar `legacy_id Int? @unique` ao model `Usuario` no `../tenantOS/backend/prisma/schema.prisma`.
2. **Script de Migração:** Criar `../tenantOS/backend/scripts/migrate-legacy-users.ts`.
   - O script deve ler usuários do banco legado (usar o Prisma Client do legado ou query direta se preferir).
   - Para cada usuário:
     - Gerar hash BCrypt da senha.
     - Criar no Core associado ao `tenant_id` de um tenant padrão (ex: 'default' ou 'matriz').
     - Mapear `tipo` (legado) para `role` (core).
3. **Trigger:** Adicionar `"db:migrate:legacy-users": "ts-node scripts/migrate-legacy-users.ts"` ao package.json do core.

#### Critérios de Aceite:
- [ ] `npm run db:migrate:legacy-users` executa sem erros.
- [ ] Usuários aparecem no banco do Core com senhas hasheadas.
- [ ] Login via `POST /auth/login` no Core funciona para um usuário migrado.

---

### [GEMINI-2026-05-28-04] Alerta de Roteamento — Reordenação de Fila (CORE-FOUNDATION)
**De:** Gemini (Coordenador) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** CORE-001, CORE-002, CORE-003
**thread:** reordenacao-fila-core
**Status:** consumida — fila lida; guard aplicado; escalado ao Claude aguardando WO oficial

**Tipo:** alerta-roteamento

**Contexto:**
Conforme aprovado pelo Márcio, a fila de execução foi reordenada para priorizar a fundação do Core (NestJS). A Issue #78 (Agente de Vendas) permanece bloqueada aguardando validação manual da Issue #88.

**Sua ação:**
1. Ler a nova fila em `beehive/construcao/tasks/FILA_COPILOT.md`.
2. Aguardar o Work Order oficial do Claude para a tarefa `CORE-001` (Auth Identity Service) antes de iniciar a execução.
3. Se o WO já existir ou quando for emitido, proceder com a reserva de lock (`npm run squad:lock:acquire`).

---

### [CLAUDE-2026-05-28-046] Handoff Executável — Auth Identity Service (CORE-001)

**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**Thread:** core-auth-identity-service
**Backlog ref:** CORE-001
**Debate/Blueprint de origem:** `beehive/construcao/blueprints/BLUEPRINT_INTEROP_CORE.md`
**Status do debate:** Consolidado e aprovado pelo Márcio
**Status:** pendente
**Spec canônica:** `beehive/construcao/work_orders/CORE-FOUNDATION/CORE-001-AUTH.md`
**Aprovado por:** Márcio (2026-05-28)

---

## Destino Operacional (DIR-082 — obrigatório em handoffs multi-repo)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS/backend
```

> ⚠️ Handoff sem este bloco está incompleto e não deve ser executado pelo Copilot.

---

## Contexto

Implementar o AuthModule central no novo Core NestJS. Este módulo será a base da identidade do sistema, utilizando Passport-JWT para autenticação e BcryptService para segurança de credenciais.

---

## Sequência de implementação (obrigatória — nesta ordem)

### Etapa 1 — Criação de Módulo e Serviços
- Criar `AuthModule`, `AuthService` e `BcryptService`.
- Implementar lógica de validação de usuário e geração de token JWT.

### Etapa 2 — Configuração de Estratégia JWT
- Configurar `JwtStrategy` e `JwtAuthGuard`.
- Registrar segredo e tempo de expiração via variáveis de ambiente.

### Etapa 3 — Decoradores de Segurança
- Criar decorator `@Public` para rotas que não exigem autenticação.
- Criar decorator `@Roles` para controle de acesso baseado em papéis.

### Etapa 4 — Validação final
- Validar que rotas protegidas retornam 401 sem token.
- Validar que rotas `@Public` são acessíveis livremente.

---

## Análise Financeira (DIR-080 — obrigatório)

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ 15,00 (tokens estimados + horas Copilot) |
| Confiança da estimativa | Alta |
| Valor gerado | Fundação de segurança robusta para todo o sistema Core. |
| Payback | Imediato (pré-requisito para todas as rotas protegidas) |
| Custo de não fazer | Risco de segurança e impossibilidade de avançar no Core. |

---

## Condições obrigatórias (C1–CN)

| # | Regra | Verificação |
|---|-------|-------------|
| C1 | Uso de BCrypt para senhas | Verificar injeção do BcryptService |
| C2 | Estratégia JWT Passport | Verificar herança de PassportStrategy |

---

## Restrições

- **NÃO** tocar no código legado, apenas no novo Core NestJS.
- Parar e retornar ao Claude se encontrar divergências no schema de usuário.

### 🔒 Checklist de governança (verificar antes do commit)

Se qualquer arquivo abaixo aparecer no diff deste handoff, **não commitar sem parecer explícito do Claude**:

- [ ] `AGENTS.md` / `GEMINI.md` / `beehive/.gemini/GEMINI.md`
- [ ] `beehive/.claude/CLAUDE.md` / `beehive/.copilot/COPILOT.md`
- [ ] `beehive/cognition/diretrizes.md` / `beehive/cognition/OPERACAO_COMPARTILHADA_HIVE.md`
- [ ] `beehive/roles/*.md`
- [ ] `beehive/bin/*.sh`

Se algum estiver marcado: abrir entrada em `inbox-claude.md` com o diff antes de prosseguir.

---

## Critérios de aceite

- [ ] AuthModule registrado no AppModule
- [ ] Login gerando JWT válido
- [ ] Guard global protegendo rotas não-públicas

---

## Ponto de parada

Após concluir, retornar ao Claude com:
- Resultado do login via Insomnia/Curl
- Estrutura de arquivos criada
- Qualquer exceção encontrada nas condições C1–CN

