# Work Order: CORE-002 & CORE-004 — Tenant & Module Guard

## 🎯 Objetivo
Garantir o isolamento total de dados e implementar o sistema "Plug & Play" de módulos.

## 🛠️ Especificação Técnica
- **Guard:** `TenantGuard` (Global ou via `@UseGuards`).
- **Lógica de Interceptação:**
  1. Extrai `tenantId` do JWT (proveniente do CORE-001).
  2. Verifica se o `tenantId` é válido e ativo no DB.
  3. **Plug & Play:** Lê de `TenantModulo` se o módulo da rota atual (ex: 'vendas') está ativado para este tenant.
- **Injeção de Contexto:** Adicionar o tenant validado ao objeto `request` para uso posterior nos Services.
- **Resposta:** Erro 403 Forbidden se o módulo estiver desligado ou o tenant for inválido.

## ✅ Critérios de Aceite
- [ ] Requests para rotas de módulos desativados são bloqueadas.
- [ ] `req.user.tenantId` está disponível em todos os controllers protegidos.
- [ ] Mudança no DB (desligar módulo) reflete instantaneamente no acesso da API.
