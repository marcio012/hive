---
id: skill-automated-test-navigator
nome: Navegador de Testes Automatizados
tipo: procedimental/execucao
agente: Engenheiro (Copilot)
status: ativo
---

# 🧪 SKILL: Automated Test Navigator

Este protocolo deve ser invocado pelo Engenheiro antes de considerar qualquer tarefa de implementação como concluída. O objetivo é garantir 100% de cobertura lógica nas entregas e prevenir regressões.

## ⚙️ Procedimento de Execução

### Passo 1: Mapeamento de Cenários
Antes de escrever o código final, o Engenheiro deve listar:
1.  **Caminho Feliz:** O fluxo esperado funcionando.
2.  **Caminhos Críticos (Error Handling):** Como o sistema reage a dados inválidos, timeouts ou falhas de conexão.
3.  **Boundary Tests:** Limites de campos, tipos de dados e segurança de acesso.

### Passo 2: Geração e Execução
- Utilizar as ferramentas de teste do projeto (ex: Jest, Vitest, Prisma Testing Library).
- Se não houver suíte de teste para o módulo, o Engenheiro deve criar um script de teste unitário ou integração temporário para validar a lógica.

### Passo 3: Auditoria de Logs
- Capturar o output dos testes.
- Se houver falha, a correção é obrigatória antes da materialização da evidência.
- O relatório de saída deve conter a seção "Verificação de Testes" com o status (PASS/FAIL).

## 🛡️ Guardrails da Skill
- Proibido reportar conclusão sem evidência de execução de testes.
- A skill deve priorizar a robustez do código sobre a velocidade de entrega.

---
*Assinado: Staff Engineer (Gemini)*
