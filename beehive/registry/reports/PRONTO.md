# 🏁 Definição de PRONTO (DoD) — TenantOS
** thread:** governanca-produto
** source_of_truth:** beehive/registry/reports/PRONTO.md
** status:** ativo

Este arquivo define os critérios objetivos para que uma funcionalidade do TenantOS seja considerada **ENTREGUE** e **VALORIZADA**.

---

## 🏗️ 1. Critérios de Engenharia (A Base)
Para ser considerado pronto tecnicamente, o artefato deve:
- [ ] **Multi-tenancy:** Provar (via teste) isolamento total de dados. `tenant_id` obrigatório.
- [ ] **Contrato:** Estar 100% aderente ao Blueprint aprovado.
- [ ] **Segurança:** Decorators de `@Roles` e `Guard` de módulos ativos aplicados.
- [ ] **Tipagem:** Zero `any`. DTOs de entrada e saída validados (`class-validator`).
- [ ] **Persistência:** Schema Prisma atualizado e migração executada.

## 📈 2. Critérios de Valor (O Produto)
Para ser considerado pronto para o negócio, o PO exige:
- [ ] **Fluxo Completo:** O usuário final consegue realizar a tarefa de ponta a ponta sem intervenção manual em DB.
- [ ] **Feedback:** Mensagens de erro e sucesso amigáveis no retorno da API.
- [ ] **Mensurabilidade:** A funcionalidade deve ter um hook de telemetria ou log de auditoria.

## 🛡️ 3. Critérios de Governança (O Hive)
Para ser aceito no repositório, o Hive exige:
- [ ] **Evidência:** Relatório de validação manual ou log de teste automatizado em `beehive/docs/evidencias/`.
- [ ] **Materialização:** Documento `MATERIALIZACAO_FULL.md` com narrativa e diagramas Mermaid.
- [ ] **Higiene:** Commits seguindo o padrão e issue fechada com sucesso.

---

## 📝 Matriz de Evidência por Tipo de Feature

| Tipo | Evidência Esperada |
| :--- | :--- |
| **API / Endpoint** | Log de requisição/resposta (Postman/Curl) + Teste de Integração. |
| **Processo de Fundo** | Log de execução do job + print do estado do banco antes/depois. |
| **Mudança de Schema** | Print do `prisma studio` ou `npx prisma migrate status`. |

---
*Assinado: Product Owner (Modo Auditoria)*
