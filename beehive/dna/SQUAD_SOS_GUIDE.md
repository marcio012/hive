# 🆘 Guia S.O.S: Soberania do Owner (Manual de Resgate)

Este manual contém as instruções de "baixo nível" para o Márcio intervir manualmente no sistema caso as IAs ou os scripts do Hive OS travem. **Use com autoridade.**

---

## 🔒 1. Problemas de Bloqueio (Locks)
*   **Sintoma:** Um agente (Claude/Copilot) diz que não pode trabalhar porque "outro agente tem o lock", mas você sabe que ninguém está trabalhando.
*   **Diagnóstico:** Arquivo `.lock` ficou órfão devido a uma queda de conexão ou erro de script.
*   **Ação de Resgate:**
    ```bash
    # Limpa todos os locks manualmente
    rm .hive-agent/*.lock
    ```

## 🧠 2. Problemas de Memória (Amnésia ou Confusão)
*   **Sintoma:** A IA está insistindo em uma tarefa que já acabou ou está misturando projetos.
*   **Ação de Resgate (Soft Reset):**
    Edite o arquivo `.hive-agent/session-state.env` e mude `ACTIVE_ISSUE` para `"null"`.
*   **Ação de Resgate (Hard Reset):**
    ```bash
    # Limpa o estado da sessão atual (força recarregamento no próximo boot)
    rm .hive-agent/session-state.env
    ```

## 📡 3. Erros de Sincronia (Kernel vs Obra)
*   **Sintoma:** O comando `npm run hive:check` (Sentinel) falha persistentemente em "Sincronia de Kernel".
*   **Ação de Resgate:**
    Abra `beehive/config/config.env` e verifique se `SQUAD_ACTIVE_ISSUE` é o mesmo valor que aparece no seu dashboard ou no arquivo `.hive-agent/session-state.env`. Corrija manualmente para `"null"` se não houver tarefa ativa.

## 🛠️ 4. Scripts "Mortos" (Sem Permissão)
*   **Sintoma:** Você tenta rodar um comando `npm run hive:...` e recebe "Permission Denied".
*   **Ação de Resgate:**
    ```bash
    # Devolve o poder de execução aos binários
    chmod +x beehive/bin/*.sh
    ```

## 🌍 5. Portabilidade (Novo Projeto)
*   **Sintoma:** Você quer levar o Hive para uma pasta de projeto totalmente nova.
*   **Ação de Resgate:**
    1. Copie a pasta `beehive/`, `package.json` e `GEMINI.md` para a raiz do novo projeto.
    2. Rode `npm run hive:health` para validar a instalação.
    3. Atualize o `beehive/config/config.env` com o nome do novo repositório.

---
*Assinado: Hive OS Kernel (Modo Soberania)*
