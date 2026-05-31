---
id: skill-sovereign-commit-protocol
nome: Protocolo de Commit Soberano
tipo: procedimental/seguranca
agente: Todos os Agentes
status: ativo
---

# 🛡️ SKILL: Sovereign Commit Protocol

Este protocolo define a regra de ouro para a persistência de código no ecossistema Hive. O objetivo é garantir auditoria humana total e rastreabilidade absoluta de cada alteração no repositório.

## ⚙️ Procedimento de Execução

### Passo 1: Formatação da Mensagem
Toda mensagem de commit deve seguir rigorosamente o padrão **Conventional Commits**:
- `feat(...)`: Nova funcionalidade.
- `refactor(...)`: Alteração de código sem mudança de comportamento.
- `docs(...)`: Alterações apenas em documentação.
- `fix(...)`: Correção de bug.
- `chore(...)`: Manutenção de build/scripts.

### Passo 2: Bloco de Assinatura Obrigatório
O corpo do commit deve conter obrigatoriamente as assinaturas de responsabilidade:
```text
[Mensagem Curta]

[Descrição detalhada se necessário]

Approved by: Márcio
Dev: [Nome do Agente] - [Papel Ativo]
```
*Nota: O commit será rejeitado pelos githooks se a linha "Approved by: Márcio" estiver ausente.*

### Passo 3: Rastreabilidade de Backlog
Incluir a referência ao ID da tarefa quando aplicável (ex: `Ref: HIVE-001` ou `TOS-012`).

### Passo 4: Limite de Autoridade (Push Lock)
- **Git Commit:** Permitido apenas localmente e sob autorização direta.
- **Git Push:** TERMINANTEMENTE PROIBIDO. O envio para o repositório remoto (GitHub) é soberania exclusiva do Diretor (Márcio).

## 🛡️ Guardrails da Skill
- Proibido o uso de `--no-verify` para burlar githooks.
- Proibido commits genéricos (ex: "ajustes", "update").
- A skill deve priorizar a clareza do histórico sobre a velocidade da persistência.

---
*Assinado: Staff Engineer (Gemini)*
