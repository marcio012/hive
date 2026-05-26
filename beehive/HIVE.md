# HIVE OS - Interface de Início de Sessão (Home Screen)

> **Caminho Sugerido:** `ai/cognition/system/welcome.md`
> **Propósito:** Esta é a "Tela de Boas-vindas" que o script de bootstrap deve exibir ao iniciar o HIVE. Ela serve para contextualizar o usuário e forçar a escolha do papel especializado.

---

## 🎨 Layout Visual (Terminal UI)

```text
============================================================
🐝 HIVE OS v1.0 — Kernel de Inteligência Simbiótica
============================================================

STATUS DO REPOSITÓRIO:
[MARCO]: v1.1.0 - Cognição Refatorada (DRIVER.md)
[PRODUTO]: TenantOS (Em modelagem de Ciclo 2)
[ACTIVE_ISSUE]: #97 Onboarding Full (Bloqueado)

------------------------------------------------------------
SELECIONE O CARTUCHO DE INTELIGÊNCIA:
------------------------------------------------------------

1) 🧠 PRODUCT OWNER (Guardião do Valor)
   - Uso: Prospecção, alinhamento de DNA, visão de negócio.
   - Gatilho: `client:connect`, `hive:manifesto`.

2) 📐 PROJETISTA (Arquiteto de Produto)
   - Uso: Brainstorming ativo, desenho de fluxos, Blueprints.
   - Gatilho: `brainstorm:ativa`, `design:fluxo`.

3) 🛡️ TECH LEAD (Auditor Clínico)
   - Uso: Code Review, The Gate, Auditoria, Infraestrutura.
   - Gatilho: `squad:review`, `squad:gate`.

0) 🚪 SAIR

------------------------------------------------------------
[?] Seleção (1-3): _
```

---

## ⚙️ Lógica de Ativação (Background)

Quando o usuário seleciona uma opção (ex: `2`), o sistema deve realizar os seguintes procedimentos técnicos:

1.  **Context Flush (Opcional):** Limpar o buffer de mensagens anteriores para evitar a "Amnésia do 3º Dia".
2.  **Injeção de Driver:** Carregar o arquivo `ai/cognition/system/[papel].md` como a instrução primária de sistema.
3.  **Habilidade Âncora:** Ler o `ai/manifesto.md` para garantir que o papel selecionado não fira o DNA do HIVE.
4.  **Prompt de Abertura:** A IA deve responder confirmando o papel:
    > *"Driver [Projetista] carregado. Estou ouvindo, Márcio. O que vamos desenhar hoje?"*

---
**Pergunta para o Márcio:**
Faz sentido esse layout ser a primeira coisa que você vê ao abrir o terminal? Quer adicionar algum campo de "Telemetria" (ex: custo da última sessão, tokens usados) nessa tela inicial?
