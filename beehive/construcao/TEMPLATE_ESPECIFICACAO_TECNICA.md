# Template: Especificação Técnica / Blueprint de Execução

> **Propósito:** Documento formal que serve como "Contrato de Verdade" para a implementação. Quando o Gemini, Claude ou Copilot leem este arquivo, eles devem saber exatamente O QUE fazer, QUAIS as regras e COMO validar.
> **Status:** [rascunho | aprovado | em_execucao | concluido]
> **ID da Issue:** #NNN

---

## 1. Objetivo (O QUE)
*Descrição clara e direta do que precisa ser construído ou alterado.*
- [Ex: Criar um serviço de auditoria de logs para o TenantOS]

## 2. Contexto e Motivação (POR QUE)
*Breve explicação do motivo desta mudança para alinhar o entendimento técnico.*
- [Ex: Atualmente não temos rastreabilidade de quem alterou as configurações do Tenant.]

## 3. Contrato Técnico (COMO)
*Aqui residem as regras de código. Defina tipos, caminhos, métodos e fluxos.*

### 3.1 Estrutura de Arquivos
- `path/to/file.ts`: [Breve descrição da responsabilidade]

### 3.2 Definição de Interface / DTO
```typescript
interface Exemplo {
  id: string;
  status: 'ativo' | 'inativo';
}
```

### 3.3 Regras de Negócio (Guardrails)
1. [Regra 1: Ex: Somente usuários com role 'admin' podem acessar.]
2. [Regra 2: Ex: O log deve ser persistido em uma tabela separada por Tenant.]

## 4. Critérios de Aceite (DONE)
*O que define que a tarefa foi concluída com sucesso?*
- [ ] [Critério 1: Testes unitários com 100% de cobertura no Service.]
- [ ] [Critério 2: Endpoint documentado no Swagger.]
- [ ] [Critério 3: Evidência de execução gerada em docs/evidencias/.]

## 5. Restrições e Proibições (NÃO FAZER)
- [Proibição 1: Não alterar o schema do banco de dados sem passar pelo Claude.]
- [Proibição 2: Não usar bibliotecas externas novas sem aprovação.]

---

## 6. Canal de Escala
- **Dúvida de Lógica:** Gemini (Lead)
- **Mudança de Arquitetura:** Claude (Arquiteto)
- **Erro de Implementação:** Copilot (Engenheiro)
