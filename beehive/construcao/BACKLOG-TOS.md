# Backlog do Produto — TenantOS
> Gerenciado pelo PO (Márcio). Uma linha por demanda.
> Para itens do Hive Framework: `beehive/construcao/BACKLOG.md`

## 🔴 Alta prioridade
- [x] TOS-015 — Gestão de Agenda (Módulo Serviços) (2026-05-29) — ✅ 3049a54 + 56123f1 + 15b84f1
- [x] TOS-019 — Clientes Demo para Apresentação (DEBATE-022 aprovado — Entregue em 2026-05-28 via commit 99ae307)

## 🟡 Média prioridade
- [ ] TOS-012 — Módulo de Usuários e Permissões (Roles)
- [ ] TOS-014 — Frente de Vendas (PDV) Lite
- [/] TOS-017 — Saneamento e taxonomia da documentação do TenantOS (Plano aprovado)

## ✅ Concluído
- [x] TOS-018 — Painel Operacional do Dia (Dashboard) (2026-05-28 via commit c609d5b)
- [x] TOS-011 — Gestão de Tenants (Central de Comando) (2026-05-28)
- [x] TOS-016 — Controle de Estoque Transacional (Gap Auditoria) (2026-05-28)
- [x] TOS-013 — Branding Dinâmico White Label (Onda 1: commit b151437; Onda 2: commit ef5532d — 2026-05-29)

## 🔧 Débito Técnico
- **DT-003** — `coreAuthedRequest` duplica lógica de `coreRequest` em `frontend/src/app/api.ts` (tenantOS). Consolidar num único helper com token opcional. Registrado em: TOS-013 Onda 2 (ef5532d). Impacto: baixo — risco de divergência se uma função for atualizada sem a outra.
