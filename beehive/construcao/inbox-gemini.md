# Inbox do Gemini

Arquivo de entrada para o Gemini. Leia no início de cada sessão.
Entradas concluídas/consumidas → mover para `beehive/registry/archive/inbox/inbox-gemini-historico.md`

---

**Histórico completo:** `beehive/registry/archive/inbox/inbox-gemini-historico.md`

---

---

<!-- novas entradas abaixo — mais recente no topo -->

---

---

### [CLAUDE-2026-05-30-003] WO-043 despachada — Auth Frontend
**De:** Claude (Arquiteto) → Gemini (Engenheiro)
**Data:** 2026-05-30
**tipo:** handoff-executavel
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-043-HIVE-026-B-AUTH-FRONTEND.md
**backlog_ref:** HIVE-026
**thread:** login-landing-hive
**Status:** pendente

WO-043 aprovada por Márcio. Remover `localStorage` demo do `App.tsx`, criar `useAuth` hook com `GET /api/auth/session`, substituir `simulateLogin()` por `POST /api/auth/login` real, capturar credenciais reais do formulário (remover defaultValues hardcoded), exibir erro em credencial inválida. **Dependência:** aguardar WO-042 (backend) antes da validação final. Ver contrato completo na WO.
