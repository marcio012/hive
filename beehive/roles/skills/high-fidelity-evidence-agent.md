---
id: skill-high-fidelity-evidence-agent
nome: Agente de Evidência de Alta Fidelidade
tipo: procedimental/documentacao
agente: Engenheiro (Copilot)
status: ativo
---

# 📸 SKILL: High-Fidelity Evidence Agent

Este protocolo deve ser invocado pelo Engenheiro ao finalizar qualquer tarefa técnica. O objetivo é gerar provas irrefutáveis de funcionamento que permitam ao Arquiteto e ao Diretor validar a entrega sem precisar rodar o código localmente.

## ⚙️ Procedimento de Execução

### Passo 1: Captura de Contexto de Execução
O Engenheiro deve registrar:
1.  **Command Logs:** Lista exata de comandos executados no terminal (ex: `npm run test`, `prisma migrate`).
2.  **Raw Outputs:** Capturar o output completo (stdout/stderr) de suítes de teste e builds.

### Passo 2: Documentação de Artefatos
Criar ou atualizar arquivos em `docs/evidencias/` contendo:
- Diffs significativos de código.
- Logs de sucesso com timestamps.
- Screenshots de logs ou terminais quando possível.

### Passo 3: Materialização do Aceite Técnico (`ACEITE-NNN`)
Gerar o relatório técnico cruzando a Work Order original com as evidências capturadas.

## 🛡️ Guardrails da Skill
- Proibido considerar uma tarefa concluída sem a materialização do arquivo de evidência.
- As evidências devem ser "High-Fidelity": cruas, sem filtros ou resumos que omitam erros.

---
*Assinado: Staff Engineer (Gemini)*
