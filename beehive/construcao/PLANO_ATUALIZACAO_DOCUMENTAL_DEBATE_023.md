---
titulo: Plano de Atualizacao Documental do DEBATE-023
tipo: governanca / documentacao / rollout
status: rascunho
data: 2026-05-28
responsavel: Copilot (Executor)
backlog_ref: HIVE-011
source_of_truth: DEBATE-023
---

# Plano de Atualização Documental do DEBATE-023

> **Objetivo:** definir quais documentos do Hive devem ser atualizados quando a regra de “próximo passo explícito” sair de debate para implementação, reduzindo drift e garantindo consistência entre agentes e documentação de usuário.

---

## 1. Princípio de rollout

A implementação **não deve começar pelos prompts isolados**.

A ordem correta é:
1. consolidar a decisão no debate;
2. promover os artefatos de apoio para referência normativa;
3. atualizar documentos operacionais por agente;
4. atualizar documentação de usuário e de fluxo;
5. executar o teste sistêmico com evidências.

---

## 2. Fontes normativas já prontas

Estes artefatos já existem e devem ser tratados como base do rollout:

| Documento | Papel no rollout |
|---|---|
| `beehive/construcao/debates/DEBATE-023-PROXIMO-PASSO-EXPLICITO-NO-ENCERRAMENTO-DOS-AGENTES.md` | decisão-mãe |
| `beehive/construcao/MATRIZ_INTERACOES_SISTEMICAS_HIVE.md` | escopo das interações |
| `beehive/construcao/MATRIZ_TESTE_SISTEMICO_INTERACOES_HIVE.md` | protocolo de validação |
| `beehive/construcao/ESTADOS_INTERACOES_SISTEMICAS_HIVE.md` | estados e transições |
| `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md` | contrato de saída |

---

## 3. Documentos candidatos à atualização

### 3.1 Operação por agente

| Documento | Motivo |
|---|---|
| `beehive/.copilot/COPILOT.md` | precisa formalizar o padrão no comportamento do Copilot |
| `beehive/.claude/CLAUDE.md` | precisa refletir o padrão no encerramento e handoff |
| `beehive/.gemini/GEMINI.md` | precisa refletir o padrão no boot/menu e fluxos do Gemini |
| `beehive/.copilot/PROMPT_CONTEXTO.md` | precisa alinhar comandos como `status` e fechamento operacional |
| `beehive/.gemini/PROMPT_CONTEXTO.md` | precisa alinhar contexto operacional e próximo passo |

### 3.2 Documentação de fluxo e engenharia

| Documento | Motivo |
|---|---|
| `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md` | já fala em `status` com próximo passo; precisa virar regra explícita |
| `beehive/docs/SPEC_ORQUESTRACAO_AGENTES.md` | separa estado compartilhado e mensagens; deve absorver o novo contrato |
| `beehive/docs/FLUXO_CARTUCHOS.md` | precisa refletir saídas operacionais por fluxo |
| `beehive/docs/HIVE_DOC.md` | visão consolidada deve mencionar o padrão transversal |
| `beehive/docs/engenharia/FLUXO_ORQUESTRACAO.md` | precisa corrigir drift e incorporar o padrão |
| `beehive/docs/THE_GATE_PROTOCOL.md` | deve explicitar saída esperada em aprovação |

### 3.3 Documentação de usuário

| Documento | Motivo |
|---|---|
| `beehive/docs/GUIA_DO_DONO.md` | precisa mostrar ao Márcio como ler a nova saída |
| `beehive/docs/PROCESSO_SIMPLIFICADO.md` | deve refletir o próximo passo explícito na operação |
| `beehive/docs/OPERACAO_SQUAD_USUARIO_COPILOT_CLAUDE.md` | precisa mostrar exemplos de encerramento operacional |

---

## 4. Ondas de atualização

### Onda 1 — Normatização

**Objetivo:** sair do debate para uma especificação clara.

**Escopo:**
- consolidar veredito final no `DEBATE-023`;
- fixar os artefatos de apoio como referência do rollout;
- registrar qual documento vira fonte normativa principal.

**Saída esperada:**
- decisão fechada;
- escopo obrigatório definido;
- exceções aprovadas.

### Onda 2 — Prompts e operação por agente

**Objetivo:** fazer cada agente obedecer ao mesmo contrato.

**Escopo:**
- `.copilot/COPILOT.md`
- `.claude/CLAUDE.md`
- `.gemini/GEMINI.md`
- prompts de contexto associados

**Saída esperada:**
- cada agente sabe quando aplicar;
- cada agente sabe como encerrar;
- não há divergência de interpretação.

### Onda 3 — Docs de fluxo e engenharia

**Objetivo:** remover drift entre processo real e documentação técnica.

**Escopo:**
- protocolos de comandos
- orquestração
- cartuchos
- The Gate

**Saída esperada:**
- fluxos documentados com o novo padrão;
- referências antigas corrigidas;
- linguagem coerente entre os documentos.

### Onda 4 — Docs de usuário

**Objetivo:** garantir legibilidade operacional do lado do Márcio.

**Escopo:**
- guia do dono
- processo simplificado
- operação do squad

**Saída esperada:**
- o usuário entende o que esperar na saída;
- o próximo passo explícito vira comportamento observável também na documentação de uso.

### Onda 5 — Teste sistêmico e evidências

**Objetivo:** provar que o rollout não quebrou os fluxos.

**Escopo:**
- executar a matriz `MATRIZ_TESTE_SISTEMICO_INTERACOES_HIVE.md`
- coletar evidências por papel e por interação

**Saída esperada:**
- evidências completas;
- falhas registradas;
- liberação ou bloqueio do rollout.

---

## 5. Critérios de priorização

Atualizar primeiro os documentos que:
1. definem comportamento do agente;
2. descrevem comandos operacionais;
3. já apresentam drift conhecido;
4. são referência direta para o Márcio operar o sistema.

---

## 6. Riscos a evitar

1. **Atualizar prompts sem atualizar docs de referência**  
   gera comportamento novo sem documentação coerente.

2. **Atualizar docs de usuário antes da operação real**  
   gera expectativa que ainda não existe no sistema.

3. **Aplicar o padrão de forma desigual por agente**  
   piora a UX em vez de padronizar.

4. **Não corrigir drift pré-existente junto do rollout**  
   perpetua inconsistências, principalmente em `FLUXO_ORQUESTRACAO.md`.

---

## 7. Critério de conclusão

O rollout documental só termina quando:

1. o debate estiver consolidado;
2. os docs por agente estiverem alinhados;
3. os docs de fluxo estiverem sem drift crítico conhecido;
4. os docs de usuário refletirem o comportamento real;
5. o teste sistêmico estiver aprovado com evidências.

