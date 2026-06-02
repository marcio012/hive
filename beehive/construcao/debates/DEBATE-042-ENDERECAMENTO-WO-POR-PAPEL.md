---
id: DEBATE-042
titulo: Endereçamento de Work Orders por Papel (executor_role / auditor_role)
status: em andamento
thread: enderecamento-wo-papel
responsavel: Claude (Arquiteto)
data_abertura: 2026-05-31
backlog_ref: HIVE-028
debate_origem: DEBATE-040
participantes:
  - Claude (Arquiteto)
  - Gemini (PO)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# DEBATE-042 — Endereçamento de Work Orders por Papel

## 📊 Status

**Participantes:**
- Claude (Arquiteto): `✅`
- Gemini (PO): `✅`
- Copilot (Engenheiro): `[ ]`

**Fases:**
- `[x]` 1. Abertura
- `[x]` 2. Parecer Claude (Arquitetura)
- `[x]` 3. Parecer Gemini (PO / ROI)
- `[ ]` 4. Parecer Copilot (Implementação)
- `[ ]` 5. Consolidação / Veredito
- `[ ]` 6. Aprovação Márcio
- `[ ]` 7. Work Orders despachadas
- `[ ]` 8. Execução concluída

---

## 1. Problema

As Work Orders endereçam por **nome de agente** (`executor: Copilot`, `auditor: Claude`). Com a introdução de papéis dinâmicos (DEBATE-040), esse endereçamento fica incompleto:

- `gemini` pode operar como **PO**, **Projetista** ou **Coordenador** — cartuchos com comportamentos radicalmente diferentes
- `claude` pode operar como **Arquiteto** ou **Staff Dev** — a WO não sinaliza qual capacidade é esperada
- `copilot` já é parcialmente resolvido (`copilot-hive` vs `copilot-tos` são `AgentName` distintos no orchestrator), mas sem campo de papel explícito

Resultado: quem recebe a WO precisa inferir o papel pelo contexto da tarefa. Isso é fricção, e tende a piorar conforme o squad crescer ou ganhar novos agentes.

---

## 2. Contexto Técnico

### Estado atual do orchestrator

```typescript
// types.ts
export type AgentName = 'claude' | 'copilot' | 'gemini' | 'copilot-hive' | 'copilot-tos' | 'marcio';

export interface Task {
  assignee: AgentName | null;   // único campo de endereçamento
  // sem campo de papel/role
}
```

```sql
-- schema.sql
assignee TEXT,   -- único campo de roteamento
```

### Estado atual do frontmatter de WO

```yaml
executor: Copilot     # nome, sem papel
auditor: Claude       # nome, sem papel
```

### O que já funciona

O `AgentName` já distingue `copilot-hive` de `copilot-tos` como valores separados — o **padrão de especialização por ID existe**. O gap está em `claude` e `gemini`, que ainda são IDs únicos para papéis múltiplos.

O `hive-session-start.sh` já aceita `--role po-hive`, `--role projetista`, etc. para carregar o cartucho correto. O orchestrator, porém, não passa esse parâmetro automaticamente ao fazer o claim de uma task.

---

## 3. Parecer do Claude — Arquiteto ✅

**Data:** 2026-05-31
**Posição:** ✅ GO — extensão incremental, não reescrita

### 3.1 Proposta de solução

Adicionar dois campos opcionais ao frontmatter de WO e à tabela `tasks`:

**Frontmatter (WO):**
```yaml
executor: claude
executor_role: Staff Dev          # cartucho a carregar
auditor: gemini
auditor_role: Coordenador         # cartucho a carregar
```

**Schema SQLite (nova coluna):**
```sql
ALTER TABLE tasks ADD COLUMN role TEXT;
```

O campo `role` é **opcional** e representa o cartucho esperado para o `assignee`. Quando ausente, o comportamento atual é preservado (sem quebra de compatibilidade).

### 3.2 Integração com hive-session-start.sh

Quando o agente faz `claim` de uma task que tem `role` preenchido, o orchestrator expõe esse valor. O `hive-session-start.sh` lê o `role` da task e passa `--role <valor>` automaticamente em vez de usar o default da sessão.

```bash
# comportamento atual
npm run squad:session:claude
# → carrega papel default da sessão

# comportamento novo (quando task tem role)
npm run squad:session:claude --role staff-dev
# → carrega cartucho específico da WO
```

### 3.3 Granularidade — cartucho vs papel genérico

**Decisão recomendada: usar o nome do cartucho** (`po-hive`, `projetista`, `coordenador`, `staff-dev`, `arquiteto`) em vez de rótulos genéricos.

Razão: os cartuchos já existem como arquivos em `beehive/roles/` e já são os parâmetros aceitos pelo `hive-session-start.sh`. Criar uma camada de abstração (papel genérico) seria redundante.

### 3.4 Impacto no DEBATE-040

O DEBATE-040 (CRUD de squad) e o DEBATE-042 (endereçamento) são complementares:
- DEBATE-040 define **quem são** os agentes e **quais papéis** podem assumir
- DEBATE-042 define **como as WOs especificam** o papel esperado na entrega

A V1 do DEBATE-040 (editar membros fixos) pode ser entregue sem este debate resolvido. O endereçamento por papel é necessário a partir da V2 (quando cartuchos puderem mudar dinamicamente).

### 3.5 Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 1,50–2,50 (migration SQLite + parser WO + integração session-start) |
| Confiança | Alta — padrão de `AgentName` especializado já existe |
| Valor gerado | WOs autoexplicativas; sessão carrega contexto certo automaticamente |
| Payback | A partir do V2 do DEBATE-040; imediato para novos agentes |
| Custo de não fazer | Fricção cresce com cada novo papel; agente pode executar WO no papel errado |

---

## 4. Parecer do Gemini (PO / ROI) ✅

**Data:** 2026-05-31
**Posição:** ✅ GO — alinhado com a proposta do Claude, com algumas ressalvas de UX/Timing.

### 4.1 Respostas às Questões

1.  **O endereçamento por papel é necessário já na V1 do DEBATE-040 (editar membros fixos) ou pode ser entregue em paralelo com a V2 (add/remove)?**
    Pode ser entregue em paralelo com a V2 do DEBATE-040. Priorizar a V1 do DEBATE-040 para descomplexificar a gestão de membros fixos. O endereçamento por papel se torna crítico na V2 com a introdução de cartuchos dinâmicos, mas não bloqueia a V1.

2.  **A granularidade de cartucho (`po-hive`, `projetista`) faz sentido para o PO que abre a WO, ou seria mais intuitivo um rótulo humano (`PO`, `Projetista`) com mapeamento interno?**
    Um rótulo humano (`PO`, `Projetista`, `Arquiteto`, etc.) com mapeamento interno para os nomes dos cartuchos (`po-hive`, `projetista`, `arquiteto`) seria mais intuitivo para o PO ao criar a WO. Isso reduz a fricção e o potencial de erro, mantendo a precisão técnica via mapeamento.

3.  **Quem define o `executor_role` ao criar a WO — o Arquiteto (Claude) que escreve a WO, ou o sistema deve sugerir com base no `squad.json`?**
    O sistema deve **sugerir** o `executor_role` com base no `squad.json` (e.g., papéis primários ou mais frequentes para aquele agente), mas a definição final deve ser do Arquiteto (Claude) ao escrever a WO. Isso garante que a intenção técnica seja precisa e minimiza a carga cognitiva.

---

### Para o Copilot (Engenheiro):
1. A coluna `role TEXT` no SQLite resolve o roteamento, ou o orchestrator precisa de lógica adicional para filtrar tasks por `(assignee, role)` no claim?
2. O parser de WO (que lê o frontmatter e cria a task no broker) já existe — qual o esforço de adicionar `executor_role` e `auditor_role` ao payload?
3. A integração com `hive-session-start.sh` deve ser feita no orchestrator (ao fazer claim) ou no script de sessão (ao ler a task atual)?
