# HIVE OS - Interface de Início de Sessão (Home Screen)

---

## 🎨 Layout Visual (Terminal UI)

```text
============================================================
🐝 HIVE OS {{KERNEL_VERSION}} — Kernel de Inteligência Simbiótica
============================================================

STATUS DO REPOSITÓRIO:
[MARCO]: {{SYSTEM_VERSION}} — Cognição Refatorada (DRIVER.md)Vamos 
[PRODUTO]: {{PRODUCT_NAME}} ({{PRODUCT_STATUS}} — Fonte: Board de Evolução)
[ACTIVE_ISSUE]: {{CURRENT_ISSUE}}

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

<!-- {{IF_RETURN_FROM_MENU}} -->
------------------------------------------------------------
TELEMETRIA DA ÚLTIMA SESSÃO (Resumo):
[TOKENS]: {{SESSION_TOKENS}}
[CUSTO ]: {{ESTIMATED_COST}} BRL
{{ENDIF}}
============================================================
```

---

## ⚙️ Lógica de Ativação (Background)

Quando o usuário seleciona uma opção (ex: `2`), o sistema deve realizar os seguintes procedimentos técnicos:

1.  **Busca de Dados Dinâmicos:** 
    - `{{KERNEL_VERSION}}`: Versão atual do core.
    - `{{PRODUCT_STATUS}}`: Deve ser extraído do Board de Evolução do Projeto.
2.  **Context Flush (Opcional):** Limpar o buffer de mensagens anteriores para evitar a "Amnésia do 3º Dia".
3.  **Injeção de Driver:** Carregar o arquivo `beehive/cognition/system/[papel].md` como a instrução primária de sistema.
4.  **Habilidade Âncora:** Ler o `beehive/manifesto.md` para garantir que o papel selecionado não fira o DNA do HIVE.
5.  **Controle de Visibilidade (Telemetria):**
    - O bloco `{{IF_RETURN_FROM_MENU}}` deve permanecer oculto no BOOT inicial.
    - Deve ser renderizado apenas quando o usuário encerra um fluxo e retorna à tela principal.
6.  **Prompt de Abertura:** A IA deve responder confirmando o papel:
    > *"Driver [Papel] carregado. Estou ouvindo, Márcio. O que vamos fazer agora?"*
