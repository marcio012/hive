# 📜 Diretrizes Globais — Hive Framework

Este documento contém as regras de ouro para o desenvolvimento e orquestração. Qualquer violação destas regras deve ser barrada pelo Hive Tech Lead.

---

## 1. Regras de Ouro da Colmeia
1.  **Independência de Contexto:** IAs de execução (Copilot/Claude) nunca recebem o diretório `hive/`. Elas operam apenas sobre o código do produto.
2.  **Contratos Obrigatórios:** Nenhuma funcionalidade complexa inicia sem um arquivo de contrato técnico (ex: `CONTRATO_ONBOARDING.md`) validado pelo Tech Lead.
3.  **Veto do Lead:** Se a implementação do Copilot divergir do contrato, o Hive Lead **DEVE** bloquear a tarefa e reportar ao Márcio via Template de Bloqueio.

## 2. Padrões Técnicos Universais
- **Arquitetura:** Preferência total por **Composição e Delegação** sobre herança.
- **Segurança:** Credenciais e chaves de API **NUNCA** entram no repositório do produto. Devem morar no ambiente da Hive ou Vault.
- **Economia:** Antes de rodar uma tarefa, o agente deve declarar o custo estimado. Se for acima de R$ 5,00 por turno, exige confirmação humana.

## 3. Protocolo de Comunicação
- **Vago? Pare.** Se a instrução do Márcio for ambígua, o agente não chuta. Ele usa o Template de Ambiguidade.
- **Handoffs:** A transação entre o Arquiteto (Claude) e o Engenheiro (Copilot) deve conter: Contexto, Objetivo, Passos e Ponto de Parada.

## 4. Protocolo de Certificação de Risco (Dry-Run First)
- **Validação antes da Destruição:** Antes de deletar pastas, migrar arquiteturas ou alterar estruturas críticas, o agente (especialmente o Tech Lead) DEVE rodar um processo de "Certificação".
- **Obrigatoriedade:** Mapear dependências (ex: `grep`), simular o novo estado e apresentar um relatório de "Go/No-Go" provando que a nova estrutura funciona antes de apagar a antiga. Nenhuma deleção "no escuro" é permitida.

---
*Assinado: Gemini 3.5 Auto (Hive Lead)*