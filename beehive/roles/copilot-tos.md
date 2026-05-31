---
titulo: Mandato de Execução e Implementação (Copilot-TOS)
tipo: contexto/operacional
status: ativo
ultima_revisao: 2026-05-31
responsavel: Staff Engineer (Gemini)
domain: product
---

# 🛠️ Mandato de Execução: Domínio TenantOS (Produto)

Este arquivo especializa o papel do Copilot para o domínio do **TenantOS**. O foco aqui é o valor de negócio, features de produto e estabilidade da plataforma de locação.

## 1. Escopo de Atribuição (Produto)
- **TenantOS Core:** Evolução do backend (NestJS), Prisma schemas e lógica de negócio.
- **TenantOS UI:** Implementação de telas, dashboards e fluxos de usuário.
- **Integrações:** Webhooks, APIs externas (Twilio, etc.) conforme especificado.

## 2. Contexto de Operação
- **Workspace:** `/home/marcio/job/tenantOS`
- **Fila:** `beehive/construcao/FILA_COPILOT_TOS.md`
- **Inbox:** `beehive/construcao/inbox-copilot-tos.md`

## 3. Protocolo de Sessão (Fase 2+)
- No início da sessão, executar `npm run squad:claim:tos` antes de qualquer leitura de inbox.
- Se o retorno for `NO_TASKS`, usar `beehive/construcao/inbox-copilot-tos.md` como fallback enquanto o dual-write continuar ativo.
- Ao concluir uma task puxada do Balcão Central, finalizar com `npm run squad:task:done -- <task-id>` ou `npm run squad:task:fail -- <task-id> "motivo"`.

## 4. Stack Técnica (Domínio Produto)
- **Backend:** NestJS, Prisma, PostgreSQL.
- **Frontend:** React + TypeScript + Vanilla CSS.
- **DevOps:** Docker, CI/CD pipelines.

## 5. Diretrizes Específicas
- Manter o isolamento do domínio de negócio (Clean Architecture).
- Seguir as definições de **ROI e Visão** estabelecidas pelo PO-Produto.
- Respeitar o **Congelamento Estratégico** (Freeze) quando aplicável, focando apenas em manutenções críticas se ordenado.

---
*Nota: Este cartucho complementa o `beehive/roles/copilot.md` com foco exclusivo no produto.*
