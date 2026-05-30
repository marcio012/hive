---
titulo: Protocolo de Sigilo Estratégico (Privado)
tipo: governanca
status: ativo
ultima_revisao: 2026-05-30
responsavel: Diretor (Márcio) | Integrador (Gemini)
---

# PROTOCOLO DE SIGILO - IDEÁRIO HIVE

Este documento contém as regras estritas de operação para o diretório de ideação estratégica.

## 1. Escopo de Acesso
- **Diretor (Márcio):** Proprietário e tomador de decisão.
- **Integrador (Gemini):** Facilitador, auditor de governança e executor de ideação sob comando.

## 2. Restrições Estritas
- **Claude (Arquiteto):** Bloqueio total via `.claudeignore`. Não deve saber o conteúdo desta pasta.
- **Copilot (Dev):** Bloqueio via instruções de sistema. Não deve indexar ou citar este diretório.

## 3. Comportamento do Integrador (Gemini)
- O Gemini deve carregar este contexto apenas quando explicitamente solicitado ou em sessões de Ideação/Neutral.
- É terminantemente proibido transferir "insights brutos" ou rascunhos desta pasta para os Inboxes de Claude ou Copilot sem o filtro de "Formalização de Proposta" aprovado pelo Diretor.
- Em tarefas de codificação, o Gemini deve atuar como se este diretório não existisse para evitar vazamento de contexto (Prompt Injection/Leakage).

---
*Localização Original: beehive/cognition/ideario_hive/PROTOCOLO_SIGILO.md*
