# Discovery de Produto — HIVE-UI-015 (Painel de Diretrizes)
** thread:** hive-ui-diretrizes-discovery
** status:** ideacao-po
** data:** 2026-05-29
** responsavel:** Gemini (PO)

## 1. O Filtro de Propósito (Por que construir?)
Atualmente, as "regras do jogo" (DIRs, Manifesto, Roles) estão espalhadas em arquivos Markdown. Para o Márcio (Owner), é difícil ter a certeza em tempo real de quais diretrizes estão ativas e sendo respeitadas sem abrir 10 arquivos diferentes.

**Valor de Negócio Principal:**
- **Transparência Operacional:** O humano entende instantaneamente os "limites éticos e técnicos" de cada agente.
- **Redução de Fricção de Auditoria:** Facilita a validação se um erro (DEBATE-027) foi uma quebra de diretriz ou um gap de regra.
- **Alinhamento de Squad:** Garante que a "Cultura Hive" seja visual e não apenas textual.

---

## 2. MVP — "O Espelho da Governança"
Para este módulo na Hive UI, o PO define como essencial:

1.  **Explorador de Diretrizes:** Visualização categorizada das DIRs (Prevenção, Detecção, Recuperação).
2.  **Manifesto Vivo:** Destaque para os princípios do `beehive/dna/manifesto.md`.
3.  **Status de Rastreabilidade:** Link entre a diretriz e a entrega que a originou (ex: "DIR-089 nasceu do DEBATE-027").
4.  **Resumo de "Mindset" por Agente:** O que o PO pode fazer vs o que o Arquiteto pode fazer (visualização das Roles).

**Vetos do PO para esta fase:**
- Editor de diretrizes via UI (as regras devem permanecer no Git para rastreabilidade de código).
- Sistema de alerta de "quebra de regra" em tempo real (muito complexo para agora; o `Safe Stop` técnico já cuida disso).

---

## 3. Análise de Escala (ROI)
Este painel não é apenas "documentação bonita". Ele é o **Manual do Proprietário** do Hive OS. 
- **ROI:** Economiza o tempo do Márcio em sessões de discovery, pois ele não precisa explicar a regra para a IA; a regra está lá, espelhada.
- **Diferencial:** Transforma o repositório de uma "pasta de scripts" em um "Ecossistema Inteligente Governado".

---

## 4. Onde isso se encaixa?
Este deve ser um módulo dentro da **Centro de Controle** da Hive UI. Não é uma aplicação nova, é uma nova aba de "Governança".

---
**Estado atual:**    ideacao concluida — arquivo em `beehive/cognition/intuition/brainstorm/HIVE_UI_PAINEL_DIRETRIZES.md`
**Proximo passo:**   Marcio valida e decide se leva ao Claude para debate
**Acao esperada:**   leia o arquivo e confirme se quer seguir para debate formal
