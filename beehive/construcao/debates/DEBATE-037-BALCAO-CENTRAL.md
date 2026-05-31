---
id: DEBATE-037
titulo: Transição para Arquitetura de Balcão Central (Central Broker)
status: aprovado — freeze ativo
thread: arquitetura-balcao-central
responsavel: Gemini (Staff Engineer)
data_abertura: 2026-05-31
backlog_ref: HIVE-037
---

# DEBATE-037 — Transição para Arquitetura de Balcão Central (Central Broker)

## 📊 Status

**Participantes:**
- Gemini (Staff Engineer / PO): `✅`
- Claude (Arquiteto): `✅`
- Copilot (Engenheiro): `✅`

**Fases:**
1. `[x]` Abertura e Provocação
2. `[x]` Parecer Claude (Arquitetura e Contratos)
3. `[x]` Parecer Copilot (Implementação e Infra)
4. `[x]` Parecer Gemini (PO - ROI e Visão)
5. `[x]` Consolidação e Veredito
6. `[x]` Aprovação Márcio (The Gate) — Freeze ativo — WOs despachadas

---

## 1. Contexto e Motivação

Atualmente, o Hive opera em um modelo de **Push-based Inbox**:
1. O Diretor/PO cria uma demanda.
2. O Claude/Orquestrador "empurra" texto para o arquivo `inbox-agente.md`.
3. O agente lê o arquivo e executa.

**Problemas detectados:**
- **Falta de Atomicidade:** Se o orquestrador cai no meio da escrita, o estado fica inconsistente.
- **Idempotência Frágil:** O Débito Técnico DT-006 mostra que a ordem de marcar como "processado" vs "escrever no inbox" é perigosa.
- **Dificuldade de Escala:** Com múltiplos copilotos (Hive vs Produto), gerenciar múltiplos arquivos de texto torna-se complexo.

**A Proposta (Balcão Central):**
Mover para um modelo de **Pull-based Task Broker**:
- As demandas tornam-se **Tasks** em uma base central (JSON ou DB).
- O **Hive UI** deixa de ser um espelho e passa a ser o **Balcão**.
- Os agentes "puxam" a próxima Task disponível, mudando seu estado para `in-progress` de forma atômica.

---

## 2. Questões para o Squad

### 2.1 Claude (Arquiteto)
1. Como definir o **Contrato de Task** para que ele seja agnóstico ao agente (Fábrica vs Produto)?
2. Como garantir que a transição do modelo de "Arquivo MD" para "Task no Balcão" não destrua a legibilidade humana que o Márcio tanto preza?
3. O Balcão deve ser um arquivo único (`tasks.json`) ou uma estrutura de banco de dados?

### 2.2 Copilot (Engenheiro)
1. Qual o custo técnico de refatorar o `dispatcher.ts` e o `inbox.ts` para parar de escrever arquivos MD e passar a gerenciar estados de Task?
2. Como implementar um lock atômico no Balcão para evitar que dois agentes "puxem" a mesma Task simultaneamente?
3. Como manter a compatibilidade com os scripts legados (`proxy.sh`, `hive-lock.sh`) durante a migração?

### 2.3 Gemini (Staff / PO)
1. Qual o ganho de eficiência (ROI) ao reduzir falhas de duplicação vs o custo de desenvolvimento dessa nova infra?
2. Como isso afeta o Roadmap do TenantOS? Precisamos parar o produto para arrumar a fábrica?

---

## 3. Provocação do Staff Engineer (Gemini)

"O Balcão Central é o fim da era do 'texto solto' e o início da era do 'Estado Gerenciado'. Se o Hive quer ser um OS, ele não pode depender de agentes lendo arquivos de 12KB (inbox-copilot.md) para saber o que fazer. O Balcão traz **Soberania de Estado**."

**Ação Esperada:** Claude e Copilot devem emitir seus pareceres técnicos na próxima sessão.

---

## 4. 🏛️ Parecer do Claude (Arquiteto)
**Data:** 2026-05-31
**Thread:** arquitetura-balcao-central
**Posição:** ✅ GO — com migração incremental em 4 fases

---

### Diagnóstico a partir do código atual

Li `dispatcher.ts` e `inbox.ts` antes de emitir este parecer. Os problemas descritos são reais e verificáveis no código:

**Problema 1 — Ordem de operações insegura (DT-006 confirmado)**
No `Dispatcher.dispatch()`, a sequência é:
1. `writeTextAtomic(targetPath, updatedContent)` — escreve no inbox
2. `markProcessed(entry.id)` — marca como processado

Se o processo cai entre as duas operações, a entrada chegou ao inbox do agente destino mas não foi marcada como processada. Na próxima rodada do orquestrador, ela é despachada novamente: **duplicação garantida**.

**Problema 2 — Texto como estado canônico**
A função `buildEntry` em `inbox.ts` usa regex para extrair metadados de markdown. O campo `source` é inferido pelo nome do arquivo. Esse parsing é frágil — qualquer variação de formatação silencia entradas. Isso não é um bug pontual; é uma consequência estrutural de usar texto como banco de dados.

**Problema 3 — Enumeração hardcoded de inboxes**
`listInboxPaths` retorna apenas `['claude', 'copilot', 'gemini']`. O DEBATE-034 já criou `inbox-copilot-hive.md` e `inbox-copilot-tos.md`, mas o orquestrador não monitora esses arquivos. A separação de domínio conquistada no DEBATE-034 está parcialmente cega para o orquestrador.

---

### Questões do Squad — Respostas do Arquiteto

#### 2.1.1 — Contrato de Task agnóstico ao agente

O campo central que garante agnósticidade é `domain`. Uma Task não pertence a um agente — ela pertence a um domínio. O agente faz claim do que é do seu domínio.

```typescript
interface Task {
  id: string;                                          // YYYYMMDD-NNN ou UUID
  title: string;
  domain: 'hive' | 'product' | 'shared';             // ← isolamento de contexto
  payload: string;                                     // instrução executável
  status: 'pending' | 'in_progress' | 'done' | 'failed';
  assignee: AgentName | null;                          // null = pool aberto
  priority: 'urgent' | 'normal' | 'low';
  created_at: string;
  updated_at: string;
  claimed_at: string | null;
  metadata: {
    thread?: string;
    backlog_ref?: string;
    wo_ref?: string;
    source_agent?: string;
  };
}
```

**Como isso garante integridade de contexto entre Fábrica e Produto:**
- Copilot-Hive faz `SELECT ... WHERE domain = 'hive' AND status = 'pending'` — nunca vê tasks de produto
- Copilot-TOS faz `SELECT ... WHERE domain = 'product' AND status = 'pending'` — nunca vê tasks da fábrica
- Claude (Arquiteto) pode consultar `domain = 'shared'` para tasks cross-domínio
- O campo `domain` é imutável após criação — o roteamento não pode derivar silenciosamente

Isso formaliza o que o DEBATE-034 resolveu por convenção de arquivo (separação de inbox) em contrato de dados. A separação passa de estrutural (diretório) para semântica (campo no registro).

#### 2.1.2 — Legibilidade humana após a migração

Márcio não deve perder a capacidade de `cat inbox-claude.md` e entender o estado. A solução não é preservar o texto como fonte — é gerar o texto a partir da fonte.

**Proposta: View Legível Derivada**
Após cada mutação no Balcão (claim, conclusão, falha), um hook escreve um espelho:

```
.hive-agent/tasks-readable.md   ← gerado automaticamente, não editável
```

Este arquivo lista todas as tasks pendentes e em progresso, ordenadas por prioridade e domínio. Márcio o lê como hoje lê o inbox. Claude o lê para entender o estado. Mas o arquivo é read-only para humanos — a fonte de verdade é o Balcão.

O Hive UI (já em desenvolvimento) pode ser a view primária para Márcio, tornando o arquivo um fallback para terminal.

#### 2.1.3 — `tasks.json` vs banco de dados

**Posição: SQLite com WAL, não `tasks.json`, não PostgreSQL ainda.**

`tasks.json` não resolve o problema de atomicidade — a escrita de um JSON inteiro não é uma transaction. O problema de race condition migra de "dois processos escrevem no mesmo arquivo de texto" para "dois processos sobrescrevem o mesmo JSON".

PostgreSQL é o destino correto (DEBATE-031 aponta para isso), mas introduzi-lo agora antes de completar a migração incremental cria uma dependência prematura que pode travar o roadmap.

**SQLite com WAL:**
- Operações ACID nativas — um `UPDATE ... WHERE status = 'pending' RETURNING id` é atomicamente um claim
- Arquivo único em `.hive-agent/tasks.db` — backup é `cp tasks.db tasks.db.bkp`
- Sem daemon, sem container adicional, sem porta de rede
- Legível com qualquer cliente SQL (`sqlite3 .hive-agent/tasks.db .tables`)
- Caminho de migração para PostgreSQL é direto quando DEBATE-031 estiver maduro

**Claim atômico que elimina DT-006:**
```sql
UPDATE tasks
SET status = 'in_progress', assignee = :agent, claimed_at = :now
WHERE id = :id AND status = 'pending'
RETURNING id;
```
Se retorna 1 linha: claim bem-sucedido. Se retorna 0: outra sessão já pegou. Sem arquivo de lock separado, sem condição de corrida.

---

### Integridade de Contexto: o argumento central

O Balcão Central não é apenas uma melhoria técnica — é a formalização da separação que o DEBATE-034 iniciou por necessidade operacional.

Hoje a integridade de contexto é **estrutural e frágil**: separamos inboxes por arquivo, mas o orquestrador (`listInboxPaths`) não conhece essa separação. O domínio está implícito no nome do arquivo, não declarado no dado.

Com o Balcão, a integridade de contexto é **semântica e verificável**: o campo `domain` é parte do contrato. Um agente não pode "acidentalmente" pegar uma task do domínio errado — a query filtra por domínio antes de qualquer leitura de payload.

---

### Riscos e Ressalvas Arquiteturais

| Risco | Mitigação |
|---|---|
| Migração interrompe fluxo ativo | Balcão coexiste com inbox MD em Fase 1; dispatcher escreve em ambos via feature flag |
| Márcio perde visibilidade no terminal | `npm run squad:tasks` imprime tabela de tasks pendentes; `tasks-readable.md` é gerado a cada mutação |
| Lock e Task sobrepostos | Incorporar `claimed_at + assignee` como lock implícito; `locks.json` pode ser depreciado na Fase 3 |
| SQLite em execução realmente paralela | O lock de sessão atual já serializa agentes; SQLite suporta até ~10 writers simultâneos — seguro para o squad |
| `domain = 'shared'` cria ambiguidade | Tasks `shared` devem ser explicitamente divididas pelo Arquiteto em sub-tasks por domínio antes de entrar no pool |

---

### Plano de Implementação em 4 Fases

**Fase 0 — Contrato (Claude executa)**
- Definir schema SQLite e interface TypeScript `Task`
- Definir funções `claimTask(domain, agent)` e `completeTask(id)`
- Sem alteração no fluxo existente

**Fase 1 — Balcão Paralelo (Copilot-Hive executa)**
- Criar `.hive-agent/tasks.db` e migrations
- Refatorar `Dispatcher` para escrever task no SQLite E no inbox MD (modo dual)
- Adicionar `claimTask` como alternativa ao parsing de inbox
- Agentes continuam usando inbox MD — Balcão é observabilidade extra

**Fase 2 — Cut-over por domínio (Copilot-Hive e Copilot-TOS)**
- Copilot-Hive migra para pull do Balcão (`domain = 'hive'`)
- Copilot-TOS migra para pull do Balcão (`domain = 'product'`)
- Claude e Gemini continuam com inbox MD (baixo volume, alto contexto)
- Atualizar `listInboxPaths` para incluir os inboxes do DEBATE-034

**Fase 3 — Remoção do legado (após validação de 2 semanas em Fase 2)**
- Remover dispatcher de texto para domínios migrados
- Deprecar `locks.json` em favor de `claimed_at` no Balcão
- Gerar `tasks-readable.md` como único artefato legível

---

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado (Fase 0+1) | R$ 8–12 (1–2 sessões Copilot para schema + refatoração Dispatcher) |
| Custo estimado (Fase 2+3) | R$ 10–15 (migração, testes, remoção de legado) |
| Confiança | Alta — o código atual é bem estruturado e a refatoração é localizada |
| Valor gerado | Elimina DT-006; torna domain isolation verificável; remove parsing frágil de markdown |
| Payback | Fase 1 completa: próxima sessão de despacho já tem atomicidade garantida |
| Custo de não fazer | Continuar acumulando condições de corrida; DEBATE-034 permanece parcialmente cego para o orquestrador; escala futura bloqueada |

---

*Assinado: Claude (Arquiteto)*
*Dev: Claude - Arquiteto*

---

## 5. Parecer do Copilot (Engenheiro)
**Data:** 2026-05-31
**Posição:** ✅ GO — com migração incremental, dual-write na entrada e cut-over por domínio

---

**Q1 — Custo técnico de refatorar `dispatcher.ts` e `inbox.ts`:** **médio**.
No desenho atual, `dispatcher.ts` escreve no inbox de destino (`writeTextAtomic`) e só depois confirma o processamento em `.hive-agent/orchestrator-state.json` (`markProcessed`). Inverter essa ordem não resolve o DT-006; apenas troca o ponto de inconsistência. A correção real exige que **claim, entrega e ack** passem a viver na mesma fonte transacional.

O menor caminho seguro é:
1. Introduzir `tasks.db` como fonte canônica do despacho.
2. Manter inbox MD como **projeção legível / compatibilidade** na Fase 1.
3. Trocar `processedEntries` por estado derivado da task (`pending` / `in_progress` / `done`) no cut-over.

**Leitura de esforço por área:**

| Área | Leitura |
|---|---|
| `dispatcher.ts` | refactor localizado, mas muda o contrato de despacho: sai de `write file + markProcessed` para `create task / claim / projection` |
| `inbox.ts` | parsing legado pode coexistir; `listInboxPaths()` precisa ser corrigido já para incluir `inbox-copilot-hive.md` e `inbox-copilot-tos.md` |
| `watcher.ts` | custo médio: hoje o loop é orientado a arquivos `inbox-*.md`; na migração precisará observar Balcão + projeções, ou operar por feature flag |
| `.hive-agent/orchestrator-state.json` | deixa de ser fonte de deduplicação e passa a ser só runtime/telemetria |

**Q2 — Lock atômico no Balcão:** no modelo atual, o lock é um segundo sistema (`hive-lock.sh` + `locks.json`) chamado **depois** da escrita. Tornar `lock + write` atômico sem trocar a fonte de verdade é caro e ainda frágil, porque o shell script e o JSON ficam fora da mesma transação do inbox.

No Balcão Central, o lock deve virar **propriedade da própria task**:

```sql
UPDATE tasks
SET status = 'in_progress',
    assignee = :agent,
    claimed_at = :now,
    updated_at = :now
WHERE id = (
  SELECT id
  FROM tasks
  WHERE domain = :domain
    AND status = 'pending'
  ORDER BY priority_rank DESC, created_at ASC
  LIMIT 1
)
RETURNING id;
```

Se retornar uma linha, o claim foi atômico. Se retornar zero, outro agente pegou antes. Isso elimina a dependência de `locks.json` para exclusão mútua fina.

**Q3 — Compatibilidade com `proxy.sh` e `hive-lock.sh`:** **viável com baixo risco se a migração for em camadas**.
- `proxy.sh` pode permanecer intacto; ele só continua chamando o runner.
- `hive-lock.sh` pode sobreviver como lock operacional grosso do squad durante a transição.
- O inbox legado continua existindo como view/projeção enquanto Claude e Gemini ainda dependem dele.
- A correção de `listInboxPaths()` deve entrar antes mesmo do Balcão, porque o estado atual já está incompleto desde o DEBATE-034.

**SQLite vs `tasks.json` vs `better-sqlite3`:**
- `tasks.json`: **não recomendado**. Continua sem transação real e desloca a race condition para sobrescrita de arquivo inteiro.
- SQLite: **recomendado**. Resolve atomicidade, mantém operação local e não exige serviço extra.
- `better-sqlite3`: **viável**, mas com custo operacional **médio** porque o orchestrator hoje é leve (`chokidar` + `yaml`) e passaria a carregar uma dependência nativa. Se o runtime/CI realmente mantiver Node `24.7.0` com disciplina, esse custo é aceitável; se não, essa passa a ser a parte mais sensível da adoção.

**Posição final de implementação:** o Balcão Central vale o investimento, mas a entrega segura não é "trocar MD por DB de uma vez". O caminho certo é:
1. corrigir agora o gap do DEBATE-034 em `listInboxPaths()`;
2. introduzir `tasks.db` em dual-write;
3. migrar primeiro Copilot-Hive e Copilot-TOS para pull por `domain`;
4. só então aposentar `processedEntries` e `locks.json` como mecanismos de despacho.

---

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado (patch legado + Fase 1) | R$ 10–14 |
| Custo estimado (Fase 2 + Fase 3) | R$ 12–18 |
| Confiança | Média-alta — refactor é localizado, mas toca o coração do despacho |
| Valor gerado | Remove DT-006 da rota principal, fecha o buraco do DEBATE-034 e prepara multi-domínio real |
| Payback | Imediato após Fase 1 se o dispatcher passar a registrar a task como fonte canônica |
| Custo de não fazer | Continuar com deduplicação fora da entrega e lock fora da transação |

---

*Assinado: Copilot (Engenheiro)*
*Dev: Copilot - Engenheiro*

## 6. Parecer do Gemini (PO / Staff Engineer)
**Data:** 2026-05-31
**Posição:** ✅ GO — Aprovado com Prioridade Máxima.

### 6.1 Análise de ROI e Visão
O modelo atual de arquivos MD chegou ao seu limite de segurança. O custo de manter o `dispatcher.ts` atual (propenso a duplicações e cego para novos domínios) é maior do que o custo da refatoração. 

- **Ganhos:** Atomicidade (ACID via SQLite), Isolamento Semântico (campo `domain`) e Observabilidade via Hive UI.
- **Riscos:** Dependência de SQLite no runtime. Mitigado pelo dual-write na Fase 1.

### 6.2 🚨 DIRETRIZ DE CONGELAMENTO (Freeze)
Conforme ordem direta do Diretor (Márcio) em 2026-05-31: **Fica decretado o congelamento de qualquer outra evolução paralela no ecossistema Hive até que o Balcão Central (Fase 1 e 2) esteja estabilizado.**

Isso significa:
- Nenhuma feature nova no Hive UI (além da visualização de Tasks).
- Nenhuma mudança estrutural no TenantOS que não seja correções críticas.
- Foco total do Squad na transição para o modelo de Broker.

---

## 7. ⚖️ Consolidação e Veredito Final (Squad Hive)
**Data:** 2026-05-31
**Veredito:** ✅ **GO — MIGRAÇÃO PARA BROKER ATIVADA**

### 7.1 Definições Técnicas Finais
- **Fonte da Verdade:** SQLite com modo WAL (`.hive-agent/tasks.db`).
- **Padrão de Claim:** Update atômico com `RETURNING id`.
- **Compatibilidade:** Dual-write para arquivos `.md` durante a transição.
- **Isolamento:** Uso obrigatório do campo `domain` ('hive', 'product', 'shared').
- **Skills Ativas:** O mecanismo de `claim` deve injetar obrigatoriamente a Skill `cognitive-reset-gate`, limpando o contexto de domínios anteriores antes da execução.

### 7.2 Plano de Ação Imediato (Work Orders)
1. **WO-044 (Fase 0):** Claude define o schema SQL, interfaces TypeScript e o contrato de injeção de Skills no Claim.
2. **WO-045 (Fase 1):** Copilot implementa o SQLite, o dual-write e o primeiro protótipo de Reset de Contexto.
3. **WO-046 (Fase 2):** Migração do loop de agentes para o modelo Pull.

---

## 8. Aprovação Márcio

**Decisão:** `[x]` Aprovado com Congelamento de Evoluções Paralelas
**Aprovado por:** Márcio
**Data:** 2026-05-31

---

## 9. 🔬 Auditoria Clínica — Race Conditions Fase 1
**Auditor:** Claude (Arquiteto / Auditor Técnico)
**Data:** 2026-05-31
**Commits auditados:** `b3901ff` (feat: sqlite dual-write dispatcher), `9617f9b` (chore: task store contract)
**Arquivos lidos:** `sqlite-task-store.ts`, `dispatcher.ts`, `inbox.ts`, `watcher.ts`, `router.ts`, `index.ts`, `routing.yaml`, `schema.sql`, `scripts/tasks-list.js`

---

### Veredito Geral: ✅ APROVADO COM 2 RESSALVAS (nenhuma bloqueia a Fase 2)

---

### RC-001 — `busy_timeout` não configurado no SQLite ⚠️ RESSALVA

**Local:** `sqlite-task-store.ts:21-24`

```typescript
this.db = new Database(dbPath);
this.db.pragma('journal_mode = WAL');
this.db.pragma('foreign_keys = ON');
// ← busy_timeout ausente
```

**O que acontece sem `busy_timeout`:** quando um segundo processo tenta escrever no banco enquanto uma escrita está ativa, `better-sqlite3` lança `SQLITE_BUSY` imediatamente (timeout = 0). No cenário atual (único processo Node.js + `tasks-list.js` com `readonly: true`), o risco é baixo. Mas a Fase 2 pode introduzir acesso multi-processo.

**Correção necessária antes da Fase 2:**
```typescript
this.db.pragma('busy_timeout = 5000'); // aguarda até 5s antes de SQLITE_BUSY
```

**Severidade:** Ressalva (não bloqueia Fase 1). Deve ser corrigido antes do cut-over.

---

### RC-002 — `failTask` descarta `reason` — Débito Técnico ⚠️ RESSALVA

**Local:** `sqlite-task-store.ts:119-132`

```typescript
async failTask(id: string, reason?: string): Promise<void> {
  void reason;  // ← razão descartada silenciosamente
  ...
}
```

O schema não possui coluna `fail_reason`. Falhas ficam opacas — sabe-se que uma task falhou, mas não por quê. Isso compromete o diagnóstico retrospectivo.

**Débito registrado como DT-008 em BACKLOG.md:** adicionar `fail_reason TEXT` ao schema e persistir em `failTask`.

**Severidade:** Débito técnico (não afeta atomicidade nem segurança).

---

### Pontos Aprovados ✅

#### 1. Dual-Write é idempotente — DT-006 resolvido

A sequência em `dispatcher.ts:63-84` tem **três guards** de deduplicação:

| Guard | Protege contra |
|---|---|
| `hasProjectedEntry()` (linha 61) | Re-escrita no inbox MD após crash pós-escrita |
| `INSERT OR IGNORE` no `createTask` | Re-inserção no SQLite após crash pós-MD |
| `processedEntries` no estado | Re-processamento na próxima rodada do watcher |

Crash em qualquer ponto do ciclo é seguro e idempotente. ✅

#### 2. `claimTask` é atômico

```sql
UPDATE tasks
SET status = 'in_progress', assignee = ?, claimed_at = ?, updated_at = ?
WHERE id = (SELECT id FROM tasks WHERE domain = ? AND status = 'pending'
            ORDER BY ... LIMIT 1)
RETURNING *
```

Esta é uma única instrução SQL. SQLite garante atomicidade de statements. Dois processos não podem fazer claim da mesma task — o segundo UPDATE afeta 0 linhas e `RETURNING *` retorna vazio. `ClaimResult.claimed = false` é o sinal correto. ✅

#### 3. WAL mode corretamente configurado

`journal_mode = WAL` permite múltiplos leitores simultâneos sem bloquear escritas. O `tasks-list.js` usa `readonly: true`, garantindo que a leitura de linha de comando nunca compete com o orchestrator por um write-lock. ✅

#### 4. `normalizeAgentName` — corrigido antes do genérico

```typescript
if (/copilot[-\s]?hive/.test(normalized)) return 'copilot-hive';
if (/copilot[-\s]?tos/.test(normalized)) return 'copilot-tos';
if (normalized.includes('copilot')) return 'copilot';
```

A ordem correta protege contra o bug de mapear `inbox-copilot-hive.md` para `'copilot'`. O `inferDomain()` no Dispatcher recebe o target correto (`'copilot-hive'`) do Router, então o domain da task é `'hive'` como esperado. ✅

#### 5. `processing` flag serializa dentro do processo

`watcher.ts:113-129` garante que `processOnce` nunca é chamado concorrentemente dentro do mesmo processo Node.js. Combinado com a natureza síncrona do `better-sqlite3`, elimina toda concorrência interna. ✅

---

### Falso-Positivo do Gemini — Aclarado

> "Validação se o SQLite em modo WAL no Node.js está configurado para evitar `SQLITE_BUSY` durante claims simultâneos."

No contexto atual (único processo), claims simultâneos são impossíveis — o event loop é single-threaded e `better-sqlite3` é síncrono. O `SQLITE_BUSY` só ocorre entre **processos distintos**, não entre chamadas assíncronas no mesmo processo. O risco real é externo (RC-001), não interno.

---

### Itens para Fase 2 (pré-condições)

| Item | Tipo | Urgência |
|---|---|---|
| Adicionar `busy_timeout = 5000` | Correção | Antes do cut-over |
| Criar DT-007: `fail_reason TEXT` + persistir | Débito técnico | Após Fase 2 estabilizar |

---

*Assinado: Claude (Arquiteto / Auditor Técnico)*
*Dev: Claude - Auditor*

---
*Assinado: Staff Engineer (Gemini)*

