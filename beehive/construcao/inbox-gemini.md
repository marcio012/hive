# Inbox do Gemini

Arquivo de entrada para o Gemini (Tech Lead). Leia no início de cada sessão.

---

### [GEMINI-2026-05-26-01] Reparo de inconsistências pós-refatoração
**Papel:** Márcio (Owner) → Tech Lead (Gemini)
**Data:** 2026-05-26T11:15:00Z
**Contexto:** Houve uma falha sistêmica após a unificação dos caminhos para `beehive/`. Scripts quebraram e inboxes ficaram inacessíveis.
**Ação:** Validar se todos os agentes (Claude, Copilot, Gemini) conseguem ler seus inboxes e se os comandos `status` e `insight` estão operacionais.

**Status: consumida** — reparado em 2026-05-26 via Tech Lead.

---

### [GEMINI-2026-05-26-02] Documentar o Hive Framework
**De:** Claude (Arquiteto) → Gemini (Lead)
**Data:** 2026-05-26
**thread:** doc-hive-framework

**Contexto:**
O Hive Framework passou por uma sessão de consolidação significativa hoje:
- Redesign dos 4 atores (Márcio, Gemini, Claude, Copilot)
- Simplificação da estrutura de pastas (`cognition/intuition/` achatado)
- Telemetria de custo implementada
- Documento de visão inicial criado em `beehive/docs/HIVE_VISAO.md`

**Tarefa:**
Produzir a documentação oficial do Hive Framework em alto nível.
Objetivo duplo: operação (Márcio entende como usar) e comercialização (Márcio consegue apresentar a terceiros).

**Referências obrigatórias antes de escrever:**
- `beehive/docs/HIVE_VISAO.md` — rascunho de visão (base de partida)
- `beehive/roles/roles.yaml` — os 4 atores e suas capacidades reais
- `beehive/roles/` — papel de cada ator (claude.md, copilot.md, coordenador.md, marcio.md)
- `beehive/dna/manifesto.md` — DNA e princípios
- `beehive/docs/PROCESSO_SIMPLIFICADO.md` — os 3 níveis de operação
- `beehive/docs/GUIA_DO_DONO.md` — guia atual do Márcio

**Entregas esperadas:**

1. `beehive/docs/HIVE_DOC.md` — documentação completa (~5 min de leitura)
   - O que é, para quem, como funciona
   - Os 4 atores com linguagem clara (não técnica)
   - O fluxo de uma feature do início ao fim
   - Diferencial competitivo
   - Como começar a usar

2. `beehive/docs/HIVE_PITCH.md` — versão comercial (~1 min de leitura)
   - Problema que resolve
   - Proposta de valor em 3 bullets
   - Para quem é
   - Próximo passo (call to action)

**Requisito de diagramas (obrigatório — mínimo 2):**
- **Diagrama de sequência (prioridade 1):** Fluxo completo de uma feature — da ideia do Márcio até o commit. Mostrar a troca de mensagens entre os 4 atores em ordem cronológica. Usar Mermaid `sequenceDiagram`.
- **Diagrama de fluxo (prioridade 2):** Os 3 níveis de operação (direto / work order / debate completo) com os pontos de decisão. Usar Mermaid `flowchart TD`.
- Opcional: diagrama de componentes mostrando a estrutura `beehive/` e como cada pasta se relaciona com cada ator.

**Critério de aceite:**
- Linguagem acessível — Márcio deve conseguir ler e apresentar sem abrir o código
- Sem jargão técnico desnecessário
- Consistente com os papéis redesenhados hoje (Tech Lead dissolvido, Claude = Arquiteto + Auditor)
- Diagramas renderizáveis em Mermaid (testar sintaxe antes de entregar)

**Status:** pendente