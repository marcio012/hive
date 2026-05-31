---
id: WO-049
titulo: Fix normalizeAgentName — source 'marcio' não reconhecido em inbox.ts
executor: Copilot-Hive
status: pendente
prioridade: normal
backlog_ref: null
thread: arquitetura-balcao-central
---

# WO-049: Fix `normalizeAgentName` — source 'marcio' ausente

## 1. Contexto

`normalizeAgentName` em `beehive/apps/orchestrator/src/inbox.ts` converte nomes de arquivo
em `AgentName`. O type inclui `'marcio'` mas a função não tem case para ele, causando
fallback para `'claude'`. Resultado: entradas em `inbox-marcio.md` ficam com `source: 'claude'`
e a regra de routing 8 (`source: marcio + tipo: handoff-executavel → dispatch_to_copilot`)
nunca dispara.

Descoberto ao processar GEMINI-2026-05-31-999 (Auditoria Claude 2026-05-31).

## 2. Tarefas Técnicas

### 2.1 `inbox.ts` — adicionar case 'marcio'

Em `normalizeAgentName` (linha ~33), antes do `return null` final, adicionar:

```typescript
if (normalized.includes('marcio')) {
  return 'marcio';
}
```

### 2.2 Verificar cobertura dos 6 agentes

Confirmar que `normalizeAgentName` cobre todos os valores de `AgentName`:
`'claude' | 'copilot' | 'gemini' | 'copilot-hive' | 'copilot-tos' | 'marcio'`

Se algum outro estiver faltando, corrigir no mesmo commit.

### 2.3 Teste manual

Após o fix, rodar o orchestrator com uma entrada `tipo: handoff-executavel` em
`inbox-marcio.md` e confirmar que `source` é `'marcio'` no log e que a entrada
é despachada para `inbox-copilot.md` via regra 8.

## 3. Critérios de Aceite

- [ ] `normalizeAgentName('inbox-marcio.md')` retorna `'marcio'` (não `null`)
- [ ] Todos os 6 valores de `AgentName` cobertos na função
- [ ] `check:types` verde
- [ ] Teste manual confirma despacho via regra 8

## 4. Escopo Negativo

- Não alterar `routing.yaml`
- Não alterar `router.ts`
- Não alterar o tipo `AgentName`

---
*Redigido por: Claude (Arquiteto) — 2026-05-31*
