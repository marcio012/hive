# Discovery de Produto — HIVE OS: A Interface Unificada
** thread:** hive-ui-discovery
** status:** em-ideacao
** data:** 2026-05-28
** responsavel:** Gemini (PO)

## 1. O "Todo": O HIVE como Organismo
A interface do HIVE não deve ser apenas um menu de ferramentas, mas um **Dashboard de Fluxo de Valor**. Ela deve refletir o estado da "Fábrica" em tempo real, mostrando onde a ideia está e qual agente está operando sobre ela.

### 📐 Arquitetura da Interface (As 4 Zonas)

#### A. Zona de Intenção (Onde as ideias nascem)
- **Input:** Campo de "Brainstorm Livre".
- **Visual:** Um funil que filtra o "ruído" (conversa) para o "sinal" (Insight/Refinamento).
- **Estado:** Reflete o `insights-buffer.md` e o `RESUMO_INTENCAO.md`.
- **Agente:** Gemini (PO) em modo escuta.

#### B. Zona de Fábrica (Onde a obra acontece)
- **Visual:** A representação física dos **Canos (Pipes)** definidos na Topologia.
- **Destaque:** Qual agente está com o **LOCK** agora? (Claude no Debate? Copilot na Construção?).
- **Métricas:** Custo em tokens da task atual vs. Estimativa (ROI).
- **Regras do Agente:** Um "Painel de Consciência" que mostra quais diretrizes (DIR) estão ativas para aquele agente naquele momento.

#### C. Zona de Governança (Onde o rigor é aplicado)
- **O Gate:** Um semáforo visual (Verde/Amarelo/Vermelho) baseado no `hive-check`.
- **Auditoria:** Lista de gaps encontrados pelo PO e Auditor Técnico (Claude).
- **Decisão:** Botão de "Afirmação Final" para o Márcio (O único botão que faz commit).

#### D. Zona de Produto (Onde a entrega brilha)
- **Materialização:** Espelho do `MATERIALIZACAO_FULL.md`.
- **Visão Dual:** Diagramas técnicos (Mermaid) ao lado de narrativas humanas.
- **Histórico:** Timeline de entregas por ID (`TOS-NNN`).

---

## 2. Reflexo das Regras por Agente
Cada agente terá sua "Janela de Atuação" na interface:

- **Gemini (Lead):** Visualização de Inboxes e Handoffs.
- **Claude (Arquiteto):** Painel de Debates ativos e Blueprints em revisão.
- **Copilot (Engenheiro):** Status de build, testes e progresso da Work Order.

---

## 3. A "Bússola de Sessão" (Home Screen)
A abertura (Safe UI) evolui de um simples menu para uma **Triagem Cognitiva**:
- "O que você quer fazer?" -> O sistema sugere o Cartucho e já pré-carrega o contexto necessário (DNA + Task Pack), evitando a amnésia.

---

## 4. Próximos Passos (A Quebra)
1. **Mapear a "Máquina de Estados":** Quais são os estados visuais de cada cano?
2. **Definir a "Narrativa de Custo":** Como mostrar o custo financeiro de forma que não gere paralisia, mas sim consciência?
3. **Prototipagem de Baixa Fidelidade:** Desenhar o layout em Markdown/Mermaid para validação do Márcio.

---
**ESTADO ATUAL:** Visão Macro do "Todo" mapeada.
**PRÓXIMO PASSO:** Detalhamento da Zona de Fábrica (Canos e Agentes).
**AÇÃO ESPERADA:** Márcio deve validar se esta divisão em 4 Zonas reflete o "Todo" que ele imagina.
