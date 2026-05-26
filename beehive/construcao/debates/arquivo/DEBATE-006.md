# DEBATE-006 — Operação do board via Claude -> Copilot

**Status:** ✅ aprovado — Fase 1 aprovada pelo Márcio em 2026-05-24
**Aberto em:** 2026-05-24
**Owner:** Márcio (decisão final) + Claude (arquitetura) + Copilot (execução)
**Motivação:** Márcio quer que o Copilot seja o executor oficial do board sem precisar fazer repasse manual entre Claude e Copilot.

## Problema

Hoje, quando a discussão começa no Claude e termina em ação operacional de board, o Márcio pode acabar virando ponte humana:

1. conversa com o Claude sobre prioridade, visão ou direção
2. identifica que a ação real pertence ao board
3. precisa repassar manualmente para o Copilot executar
4. depois precisa consolidar o resultado de volta

Isso gera atrito operacional e quebra a separação ideal de papéis:

- **Claude** decide, qualifica e prioriza
- **Copilot** executa, sincroniza e audita o board

## Proposta

Formalizar o seguinte fluxo:

> **Claude pede -> Copilot executa -> Copilot responde -> Claude consolida para o Márcio**

Sem repasse manual do Márcio entre os dois agentes.

## Princípio central

**Board é responsabilidade operacional do Copilot.**

Então:

- Claude pode analisar, propor prioridade e decidir direção
- Copilot é o executor oficial de board:
  - leitura do board
  - sync entre issue / labels / project
  - mudança de status
  - foco de issue
  - higiene e auditoria do board

## Mecanismo proposto

Usar o inbox já implementado como barramento entre agentes.

### Fluxo fase 1

1. Márcio fala com o Claude
2. Claude reconhece um comando de board
3. Claude escreve uma solicitação curta em `ai/construcao/inbox-copilot.md`
4. Copilot executa a ação no board
5. Copilot responde em `ai/construcao/inbox-claude.md`
6. Claude lê o resultado e devolve a resposta final ao Márcio

## Comandos sugeridos

### Leitura

- `board: visao`
- `board: status`
- `board: inconsistencias`
- `board: proximo-passo`

### Execução

- `board: sync`
- `board: focus #NN`
- `board: done #NN`
- `board: todo #NN`
- `board: review #NN`

### Governança

- `board: hygiene`
- `board: validar`

## Exemplo de delegação

### Claude -> Copilot

```md
### [COPILOT-XXX] Execução de board
**thread:** BOARD-001
**de:** claude
**para:** copilot
**status:** pendente
**data:** YYYY-MM-DD

**Comando:** board: focus #88

**Objetivo:**
Colocar #88 como foco operacional atual e devolver o impacto no board.
```

### Copilot -> Claude

```md
### [CLAUDE-XXX] Resultado de board
**thread:** BOARD-001
**de:** copilot
**para:** claude
**status:** executada
**data:** YYYY-MM-DD

**Resultado:**
- #88 movida para In Progress
- demais itens ativos retornados para Todo
- labels sincronizadas
- sem conflito adicional
```

## Benefícios esperados

- elimina o Márcio como ponte manual entre agentes para board
- reforça a separação de papéis
- centraliza a execução do board em um único agente
- reduz inconsistência operacional
- reaproveita inbox + `flock`, sem criar mecanismo novo agora

## Riscos / pontos de atenção

- Claude precisa reconhecer claramente quando algo é comando de board
- o contrato do comando precisa ser pequeno e padronizado
- board não pode virar tema “misto”, onde Claude executa às vezes e Copilot outras
- se o inbox não for consultado de forma disciplinada, o fluxo volta a depender de repasse manual

## Leitura de proporcionalidade

Esta proposta parece adequada para **Fase 1**:

- sem daemon
- sem watcher
- sem orquestrador dedicado
- só protocolo + inbox + responsabilidade clara

Fase 2, se necessário:

- watcher de inbox
- despacho automático entre agentes
- execução assíncrona mais transparente

## Questões para o Claude

1. Claude concorda que **execução de board** deve ficar centralizada no Copilot?
2. O conjunto de comandos `board:` acima está proporcional ao momento atual ou está amplo demais?
3. A Fase 1 via inbox resolve o problema com complexidade aceitável?
4. Quais guardrails faltam para evitar confusão entre “decisão arquitetural” e “execução operacional de board”?

## Questões para o Copilot

1. O recorte de responsabilidade está claro o suficiente?
2. Quais comandos de board são essenciais no MVP e quais podem esperar?
3. Há algum caso de borda operacional que quebre esse modelo?

## Parecer do Claude — DEBATE-006
**Data:** 2026-05-24
**Posição:** ✅ aprovado com condição

Concordo com o modelo proposto. O Copilot como executor oficial de board é a separação de papéis correta — Claude decide e prioriza, Copilot executa e audita. Eliminar o Márcio como ponte manual é o objetivo certo.

**Respostas às questões:**

1. **Execução centralizada no Copilot?** ✅ Sim. Board tem natureza operacional — leitura de estado, sync de labels, mudança de status. Isso é do Copilot. Claude não deve executar board nem mesmo como exceção; se fizer uma vez, o padrão quebra.

2. **Conjunto de comandos proporcional?** ⚠️ Levemente amplo para Fase 1. Sugiro MVP mínimo viável agora:
   - Leitura: `board: status`, `board: proximo-passo`
   - Execução: `board: focus #NN`, `board: done #NN`, `board: todo #NN`
   - `board: visao`, `board: inconsistencias`, `board: hygiene`, `board: validar` → Fase 2

3. **Fase 1 via inbox resolve?** ✅ Sim, com complexidade aceitável. O inbox já tem `flock`, já tem status cycle, já tem `thread:`. Não precisa de nada novo.

4. **Guardrails para não confundir decisão com execução:**
   - Claude reconhece comando de board quando a ação **não exige julgamento de negócio** — é só estado/sync
   - Se houver ambiguidade (ex: "qual issue priorizar?"), Claude decide primeiro, depois delega execução
   - Claude nunca escreve diretamente no board — sempre via inbox ao Copilot
   - Regra simples: se Claude precisar de um token do GitHub para executar, é do Copilot

**Condição:** MVP de comandos reduzido conforme item 2 antes de formalizar. Fase 2 entra somente após validação do ciclo completo (Claude pede → Copilot executa → Claude consolida) em pelo menos 3 rodadas reais.

**Divergência com outros agentes:** Aguarda parecer do Copilot.

---

## Decisão

**Aprovado pelo Márcio em 2026-05-24.**

1. ✅ Fase 1 aprovada via inbox
2. ✅ Conjunto de comandos reduzido (conforme parecer do Claude):
   - Leitura: `board: status`, `board: proximo-passo`
   - Execução: `board: focus #NN`, `board: done #NN`, `board: todo #NN`
   - Higiene e visão: Fase 2
3. ✅ Board formalmente sob execução do Copilot
4. ✅ Automação mais profunda reservada para Fase 2
