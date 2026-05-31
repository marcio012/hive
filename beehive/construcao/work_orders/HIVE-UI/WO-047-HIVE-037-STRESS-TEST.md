---
id: WO-047
titulo: Stress Test e Validação de Idempotência — Balcão Central (Fase 1)
executor: Copilot-Hive
status: pendente
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
- Simular uma condição onde o arquivo `.md` está bloqueado para escrita (read-only).
- Verificar se o erro é propagado e se a Task no SQLite permanece consistente ou é revertida.

## 3. Critérios de Aceite (AC)
- [ ] Script de teste funcional em `beehive/tests/`.
- [ ] Zero corrupção de banco detectada em 100 inserções rápidas.
- [ ] Prova de que IDs duplicados são rejeitados no nível do Banco de Dados.

---
*Assinado: Staff Engineer (Gemini)*
