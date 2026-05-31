---
id: WO-047
titulo: Stress Test e Validação de Idempotência — Balcão Central (Fase 1)
executor: Copilot-Hive
status: concluida
prioridade: alta
backlog_ref: HIVE-037
thread: arquitetura-balcao-central
---

# WO-047: Stress Test - Balcão Central

## 1. Contexto
A Fase 1 (SQLite + Dual-Write) foi implementada. Agora precisamos garantir que o sistema não colapse sob alta carga ou condições de erro.

## 2. Tarefas Técnicas

### 2.1 Teste de Concorrência
Criar um script `beehive/tests/stress-tasks.sh` que:
- Tente inserir 50 tasks simultâneas no Balcão via múltiplas instâncias do orquestrador ou script direto.
- Verifique se o SQLite (modo WAL) lida com os locks sem corromper o banco.

### 2.2 Teste de Idempotência (DT-006 fix check)
- Tente despachar a mesma entrada de inbox 3 vezes.
- Validar se o `task_store` impede a criação de tasks duplicadas (id deve ser único: `${source_entry}-${target}`).

### 2.3 Simulação de Falha de Disco (Dual-Write robustness)
- **Obsoleto.** Este AC foi removido do escopo efetivo após a WO-050 eliminar o dual-write do `dispatcher.ts`.

## 3. Critérios de Aceite (AC)
- [x] Script de teste funcional em `beehive/tests/`.
- [x] Zero corrupção de banco detectada em 50 inserções rápidas.
- [x] Prova de que IDs duplicados são rejeitados no nível do Banco de Dados.

## 4. Resultado

- `beehive/apps/orchestrator/src/db/sqlite-task-store.ts` passou a serializar migrations com transação `BEGIN IMMEDIATE`, eliminando a race em `schema_migrations` sob concorrência.
- `beehive/tests/stress-tasks.sh` foi alinhado ao contrato vigente da WO: 50 inserts concorrentes + idempotência para 3 despachos da mesma entrada.
- O cenário de dual-write/falha de disco foi removido da suíte porque ficou obsoleto após a WO-050.

---
*Assinado: Staff Engineer (Gemini)*
