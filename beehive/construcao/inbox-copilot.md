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

<!-- novas entradas abaixo — mais recente no topo -->

### [CLAUDE-2026-05-28-051] Work Order — DIR-085 Onda 4: docs de usuário
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** executada — ✅ Aprovado em 2026-05-28; commitar. Rollout DIR-085 concluído.
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

Continuação do rollout DIR-085. Esta WO executa a **Onda 4** do PLANO_ATUALIZACAO_DOCUMENTAL_DEBATE_023.md.

**Executar somente após Onda 3 (WO-050) auditada e commitada.**

**Leia antes de executar:**
- `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
- Cada arquivo-alvo antes de editar

---

## Princípio de edição

Estes são documentos voltados ao Márcio como usuário operador. O objetivo é que ele entenda o que esperar na saída dos agentes após o rollout DIR-085.

Para cada arquivo: localizar seções que descrevem "como o Márcio interage com o squad" ou "o que o agente responde". Adicionar explicação de que a saída operacional agora encerra com Estado atual / Próximo passo / Ação esperada.

---

## Arquivos-alvo

### `beehive/docs/GUIA_DO_DONO.md`

Localizar a seção que descreve como operar o squad (boot, inbox, comandos). Adicionar parágrafo ou nota:

```
**Saída operacional padronizada (DIR-085):**
Ao final de qualquer interação operacional — inbox, status, checkpoint, aprovação, handoff — o agente ativo encerrará com três campos explícitos:
- **Estado atual:** o que acabou de acontecer
- **Próximo passo:** o que vem agora
- **Ação esperada:** o que você deve fazer

Você não precisa inferir o próximo passo — ele estará sempre explícito.
```

### `beehive/docs/PROCESSO_SIMPLIFICADO.md`

Localizar a seção que descreve o ciclo operacional (rodada, fluxo, aprovação). Adicionar ao final da descrição do ciclo:

```
> A saída de cada etapa operacional segue o padrão DIR-085: Estado atual → Próximo passo → Ação esperada.
```

### `beehive/docs/OPERACAO_SQUAD_USUARIO_COPILOT_CLAUDE.md`

Localizar seções que descrevem o que o Copilot e o Claude respondem. Para cada agente, adicionar exemplo canônico de encerramento com DIR-085, usando os exemplos de `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md` seção 8 como referência.

**Se algum arquivo não existir:** registrar no retorno, não criar.

---

## Critérios de aceite

- [ ] `GUIA_DO_DONO.md`: parágrafo sobre DIR-085 adicionado na seção operacional
- [ ] `PROCESSO_SIMPLIFICADO.md`: nota DIR-085 adicionada ao ciclo
- [ ] `OPERACAO_SQUAD_USUARIO_COPILOT_CLAUDE.md`: exemplos de encerramento adicionados (se arquivo existir)
- [ ] Nenhuma reescrita de seção — apenas adições

## Ponto de parada

Reportar ao Claude via `inbox-claude.md` com lista de arquivos alterados + diff resumido antes de commitar.

---

### [CLAUDE-2026-05-28-050] Work Order — DIR-085 Onda 3: docs de fluxo e engenharia
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** executada — ✅ Aprovado com ressalva menor em 2026-05-28; commitar e seguir para Onda 4 (WO-051)
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

Continuação do rollout DIR-085. Esta WO executa a **Onda 3** do PLANO_ATUALIZACAO_DOCUMENTAL_DEBATE_023.md.

**Executar somente após Onda 2 (WO-049) auditada e commitada.**

**Leia antes de executar:**
- `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
- Cada arquivo-alvo antes de editar

---

## Princípio de edição

Para cada arquivo: localizar seções que descrevem interações operacionais (status, checkpoint, handoff, plano de voo, aprovação, boot). Onde a seção define um formato de saída **sem** referência a DIR-085, adicionar ao final da seção:

```
> **DIR-085:** esta interação é operacional — a saída deve incluir Estado atual, Próximo passo e Ação esperada. Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

Se a seção já tiver campos equivalentes implicitamente, apenas adicionar a referência.

---

## Arquivos-alvo

| Arquivo | O que buscar |
|---|---|
| `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md` | comandos `status`, `checkpoint`, `inbox` — adicionar nota DIR-085 ao formato de saída |
| `beehive/docs/THE_GATE_PROTOCOL.md` | seção de saída/aprovação do gate — adicionar referência DIR-085 |
| `beehive/docs/FLUXO_CARTUCHOS.md` | seções de encerramento de cartucho — adicionar referência DIR-085 |
| `beehive/docs/HIVE_DOC.md` | visão consolidada — adicionar parágrafo sobre DIR-085 como padrão transversal |
| `beehive/docs/SPEC_ORQUESTRACAO_AGENTES.md` | seções de handoff e status entre agentes — referenciar DIR-085 |
| `beehive/docs/engenharia/FLUXO_ORQUESTRACAO.md` | seções que descrevem saída de cada agente — referenciar DIR-085 |

**Se algum arquivo não existir:** registrar no retorno, não criar.

---

## Critérios de aceite

- [ ] Cada arquivo existente tem referência a DIR-085 onde descreve interações operacionais
- [ ] Nenhuma seção existente foi reescrita — apenas anotação/referência adicionada
- [ ] Arquivos não existentes listados no retorno sem erro de execução

## Ponto de parada

Reportar ao Claude via `inbox-claude.md` com lista de arquivos alterados + diff resumido antes de commitar.

---

### [CLAUDE-2026-05-28-049] Work Order — DIR-085 Onda 2: cartuchos dos agentes
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** pendente
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

DEBATE-023 aprovado. DIR-085 formalizada. PADRAO_SAIDA_OPERACIONAL_HIVE.md está `ativo`.
Ondas 0 e 1 concluídas. Esta WO executa a **Onda 2** do PLANO_ATUALIZACAO_DOCUMENTAL_DEBATE_023.md:
injetar DIR-085 nos cartuchos operacionais de todos os agentes.

**Leia antes de executar:**
- `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md` — contrato de saída
- Cada arquivo-alvo antes de editar

---

## Edições por arquivo

### 1. `beehive/.claude/CLAUDE.md`

**Edição 1a — seção `## Inicio de sessao`**

Localizar o bloco de formato de saída do inbox:
```
- Formato de saida:
  ```
  ## Inbox — pendentes
  - [CLAUDE-NNN] assunto (de: agente, data)
  ```
```

Adicionar imediatamente após o bloco acima:
```
Encerrar o inbox com bloco DIR-085:
  ```
  Estado atual:    [N] pendentes — [resumo em 1 linha]
  Próximo passo:   [item ou frente a priorizar]
  Ação esperada:   diga o número/frente a atacar
  ```
```

**Edição 1b — seção `## Padrao de saida por rodada`**

Substituir o bloco atual inteiro:
```
## Padrao de saida por rodada
- Decisao: o que foi aprovado.
- Execucao: quem faz o que.
- Evidencia: onde ficou registrado.
- Proximo passo: qual item entra em seguida.
```

Por:
```
## Padrao de saida por rodada (DIR-085)

Ao encerrar debates, pareceres, auditorias e handoffs:
- **Estado atual:** o que foi decidido ou o que está pronto
- **Próximo passo:** o que entra em seguida no fluxo
- **Ação esperada:** o que o Márcio ou próximo agente deve fazer
- **Motivo:** somente em falha/bloqueio — causa específica, nunca genérico

Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

---

### 2. `beehive/.copilot/COPILOT.md`

**Edição 2a — seção `## Comandos de Chat`**

Localizar a tabela de comandos. Após a tabela (antes de `## Inicio de sessao`), adicionar nova seção:

```
## Padrão de Saída Operacional (DIR-085)

Ao encerrar `status`, `checkpoint` ou entrega para auditoria, incluir:

```
Estado atual:    [o que foi feito / o que falhou]
Próximo passo:   [o que vem agora no fluxo]
Ação esperada:   [o que o Márcio ou Claude deve fazer]
```

Em falha ou bloqueio, adicionar campo `Motivo` com causa específica.
Não aplicar em confirmações curtas ou respostas informativas.
Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

---

### 3. `beehive/.gemini/GEMINI.md`

**Edição 3a — após seção `## Atualização de sessão`**

Adicionar nova seção antes de `## Gestão de Tokens`:

```
## Padrão de Saída Operacional (DIR-085)

Toda interação operacional deve encerrar com:

```
Estado atual:    [o que foi concluído / o que está em aberto]
Próximo passo:   [o que vem agora]
Ação esperada:   [o que o Márcio deve fazer]
```

Aplica-se a: boot/menu, plano de voo, encerramento de cartucho, checkpoint, pedido de aprovação.
Não aplica-se a: perguntas informativas, confirmações curtas, análises conceituais.
Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

---

### 4. `beehive/roles/coordenador.md`

**Edição 4a — Passo 2 do Ritual de Abertura**

Localizar o template do Plano de Voo dentro do bloco de código:
```
Para iniciar: diga o número do item ou "ok" para o item 1.
Para reordenar: diga a nova ordem.
Para pular: diga "skip <número>".
```

Substituir essas 3 linhas por:
```
Estado atual:    [N] pendências detectadas.
Próximo passo:   item 1 sugerido — [AGENTE] → [TAREFA]
Ação esperada:   diga o número do item, "ok" para o item 1, ou reordene.
```

---

### 5. `beehive/roles/po.md`

**Edição 5a — Modo Discovery, seção `### Passo 3 — Onde escrever` (ou ao final da saída do Discovery)**

Localizar a descrição do fluxo de saída do Discovery (seção `O que pode escrever / Modo Discovery`). Após a linha:
```
2. Márcio lê o arquivo diretamente e valida com o Claude:
```

Adicionar bloco antes do item 3:

```
**Encerramento DIR-085 (Modo Discovery):**
Ao concluir a ideação, encerrar com:
```
Estado atual:    ideação concluída — arquivo em `beehive/cognition/intuition/brainstorm/[arquivo]`
Próximo passo:   Márcio valida e decide se leva ao Claude para debate
Ação esperada:   leia o arquivo e confirme se quer seguir para debate formal
```
```

**Edição 5b — Modo Auditoria, formato de saída (`### Passo 2 — Relatório de Gaps`)**

Após o bloco de formato `📋 Auditoria PO`, antes do `### Passo 3`, adicionar:

```
**Encerramento DIR-085 (Modo Auditoria):**
```
Estado atual:    auditoria concluída — [N] gaps / [N] entregas sem gap
Próximo passo:   gaps de produto → AUDIT_PO_LOG.md; gaps técnicos → Claude
Ação esperada:   confirme o roteamento dos gaps ou peça revisão
```
```

---

### 6. `beehive/roles/projetista.md`

**Edição 6a — após seção `## 5. Gatilhos de Ação`**

Adicionar nova seção antes de `## 6. Qualidades`:

```
## 5.1 Encerramento de Sessão (DIR-085)

Ao concluir um esboço ou design session:

```
Estado atual:    esboço concluído — arquivo em `beehive/docs/materializacao/` ou `beehive/construcao/`
Próximo passo:   Claude valida o esboço e transforma em Blueprint técnico
Ação esperada:   leve o esboço ao Claude para revisão — não enviar direto ao Copilot
```
```

---

## Critérios de aceite

- [ ] `beehive/.claude/CLAUDE.md`: inbox encerra com bloco DIR-085 + "Padrao de saida" atualizado
- [ ] `beehive/.copilot/COPILOT.md`: seção DIR-085 adicionada após tabela de comandos
- [ ] `beehive/.gemini/GEMINI.md`: seção DIR-085 adicionada
- [ ] `beehive/roles/coordenador.md`: Plano de Voo encerra com campos Estado/Próximo/Ação
- [ ] `beehive/roles/po.md`: Discovery e Auditoria encerram com DIR-085
- [ ] `beehive/roles/projetista.md`: seção 5.1 adicionada
- [ ] Nenhuma outra seção alterada além das especificadas

## Restrições

- **NÃO** reescrever seções existentes além do especificado
- **NÃO** alterar nenhum outro arquivo
- Todos os 6 arquivos são lock de governança → **não commitar sem parecer do Claude**

## Ponto de parada

Reportar ao Claude via `inbox-claude.md` com diff de cada arquivo antes de commitar.

---

### [CLAUDE-2026-05-28-048] Handoff Executável — TenantGuard DB Validation (CORE-002 delta)

**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**Thread:** core-tenant-guard
**Backlog ref:** CORE-002
**Spec canônica:** `beehive/construcao/work_orders/CORE-FOUNDATION/CORE-002-GUARD.md`
**Status:** pendente

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS/backend
```

---

## Contexto

A infraestrutura de CORE-002 já existe: `TenantMiddleware`, `TenantContext`, `TenantGuard`, `ModuleGuard` e os decoradores `@SkipTenant()` / `@Modulo()` estão implementados e registrados como `APP_GUARD` global.

**Gap:** o `TenantGuard` (`src/tenant/tenant.guard.ts`) só verifica se `tenantId` está presente no `AsyncLocalStorage`. Ele **não consulta o banco** — um tenant suspenso (`ativo: false`) continua operando até o token expirar.

O modelo `Tenant` já tem o campo `ativo: Boolean @default(true)`.

---

## O que implementar (único delta)

### Arquivo a modificar: `src/tenant/tenant.guard.ts`

1. Injetar `PrismaService` no construtor do `TenantGuard`.
2. Tornar `canActivate` assíncrono (`async canActivate(...): Promise<boolean>`).
3. Após verificar que `tenantId` está presente, consultar:
   ```ts
   const tenant = await this.prisma.tenant.findUnique({
     where: { id: tenantId },
     select: { ativo: true },
   });
   ```
4. Se `!tenant` ou `!tenant.ativo` → lançar `ForbiddenException('Tenant inativo ou inexistente')`.
5. Se ok → `return true`.

### Arquivo a modificar: `src/tenant/tenant.guard.spec.ts`

Adicionar dois casos de teste:
- Tenant não encontrado no DB → `ForbiddenException`.
- Tenant com `ativo: false` → `ForbiddenException`.

Os testes existentes (ausência de tenantId → 401, `@SkipTenant()` → bypass) devem continuar passando.

---

## Restrições

- **NÃO** modificar `TenantContext`, `TenantMiddleware`, `ModuleGuard` nem nenhum outro arquivo fora dos dois acima.
- **NÃO** alterar a lógica do `@SkipTenant()` — rotas públicas permanecem isentas.
- Se o `PrismaModule` não estiver importado no `TenantModule`, adicionar a importação.

---

## Análise Financeira (DIR-080)

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ 5,00 (delta pequeno, 2 arquivos) |
| Confiança | Alta |
| Valor gerado | Tenant suspenso não acessa API — isolamento real, não só de contexto |
| Payback | Imediato — fecha gap de segurança de CORE-002 |
| Custo de não fazer | Tenant suspenso com token válido opera livremente até expirar |

---

## Critérios de aceite

- [ ] `npm run check:types` → OK
- [ ] `npm run build` → OK
- [ ] `npm test -- --runInBand` → todos os testes passam (incluindo os 2 novos)
- [ ] Tenant com `ativo: false` retorna 403 nas rotas protegidas

---

## Ponto de parada

Após concluir, retornar ao Claude via `inbox-claude.md` com:
- Diff dos arquivos modificados
- Resultado dos testes
- Commit hash

---

### [CLAUDE-2026-05-28-047] Handoff Executável — Hive Web UI MVP (HIVE-UI-001)

**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**Thread:** hive-web-ui-mvp
**Backlog ref:** HIVE-UI-001
**Debate ref:** DEBATE-024
**Spec canônica:** `beehive/construcao/work_orders/HIVE-UI/HIVE-UI-001-MVP.md`
**Blueprint:** `beehive/construcao/blueprints/BLUEPRINT_HIVE_WEB_UI.md`
**Status:** pendente
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

---

## Missão

Criar `apps/hive-ui/` no repositório `hive` — backend NestJS (porta 3001) + frontend React/Vite (porta 5174) que exibe em tempo real o estado operacional do Hive.

**Leia a spec completa antes de iniciar:**
- WO: `beehive/construcao/work_orders/HIVE-UI/HIVE-UI-001-MVP.md`
- Blueprint técnico: `beehive/construcao/blueprints/BLUEPRINT_HIVE_WEB_UI.md`

---

## Critérios de Aceite (resumo)

| # | Critério |
|---|---------|
| AC-01 | `GET /api/hive/state` retorna JSON com `locks`, `session`, `inboxCounts`, `brainstorm` |
| AC-02 | Frontend carrega em `http://localhost:5174` sem erros de console |
| AC-03 | Mapa da Fábrica: lock ativo + inbox counts + active item corretos |
| AC-04 | Funil de Intenção: lista arquivos de brainstorm com título e status |
| AC-05 | Modificar arquivo em `beehive/` → Mapa atualiza em até 1s sem F5 |
| AC-06 | Indicador WebSocket verde quando conectado |
| AC-07 | `npm run hive:ui` na raiz sobe backend + frontend |

---

## Restrições

- **NÃO** modificar nenhum arquivo em `beehive/`
- **NÃO** criar endpoints de escrita
- Não commitar sem aprovação do Claude

---

## Ponto de Parada

Ao concluir, reportar ao Claude via `inbox-claude.md` com confirmação de cada AC e arquivos criados.
