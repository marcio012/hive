---
name: project-hive020-dispatch-ui
description: HIVE-020 — Dispatch de agentes via UI: V1 é somente para Márcio
metadata:
  type: project
---

HIVE-020 (Dispatch de Agentes via UI) deve começar com escopo restrito a Márcio como único operador.

**Why:** Resolver dispatch autônomo para Copilot/Gemini é complexo (IDE dependency, sem API direta). V1 resolve o caso real imediato: Márcio aciona agentes pelo cockpit sem trocar de janela.

**How to apply:** Ao debater ou especificar HIVE-020, não escalar para dispatch autônomo multi-agente. V1 = Márcio clica → sistema cria inbox entry + chama API onde disponível (Claude: Anthropic API; Gemini: Gemini API) → resposta aparece na tela. Copilot fica para V2.
