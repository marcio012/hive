# Backlog do Produto — Hive Framework
> Gerenciado pelo PO (Márcio). Uma linha por demanda.
> Para abrir nova demanda: `npm run po:demand`
> Para itens do TenantOS: `beehive/construcao/BACKLOG-TOS.md`

## 🔴 Alta prioridade

## 🟡 Média prioridade

## 🔧 Débito Técnico
- **DT-004** — `CentroDeControle.tsx` (~450 linhas) — extrair sub-componentes (DispatchModal, LockPanel, ConfigPanel) em componentes separados. Registrado em: HIVE-UI-003 (auditoria 2026-05-29). Impacto: baixo — manutenibilidade futura.
- **DT-005** — `scripts/inbox-utils.js` é CommonJS puro — quando o Orchestrator Core (pós-DEBATE-026) for implementado, promover para módulo TypeScript compartilhado (`hive.service` ou `lib/inbox`) e expor lint/validação via API do backend para o Hive UI consumir em tempo real. O hook de pre-commit mantém valor como defesa em profundidade independente da UI. Registrado em: WO-025-B (auditoria 2026-05-29). Impacto: baixo — sem urgência até o orquestrador existir.
- **DT-006** — `dispatcher.ts`: `markProcessed` é chamado após `writeTextAtomic` (ordem invertida em relação ao contrato da WO). A WO pedia marcar como processado ANTES de escrever para idempotência total. Janela de crash mínima mas real. Registrado em: WO-026-A (auditoria 2026-05-29). Impacto: baixo — corrigir em onda futura do Orchestrator.
- **DT-007** — `routing.yaml`: campo `agent_livre: copilot` é decorativo — `router.ts` não o verifica. A lógica de lock livre está em `dispatcher.ts`, o que é funcionalmente correto mas cria semântica enganosa no YAML. Registrado em: WO-026-A (auditoria 2026-05-29). Impacto: baixo — documentar ou remover o campo na próxima revisão do routing.

## 🟡 Média prioridade
- [x] HIVE-015 — Telemetria E1: tela tokens por agente (Claude X, Copilot Y, Gemini Z) (2026-05-29) — ✅ 22bdb51
- [x] HIVE-016 — Telemetria E2: interações por tipo com tag no lock acquire (2026-05-29) — ✅ f52078f
- [ ] HIVE-017 — Centro de Controle: componentização (WO-031) — WO-030 commitada (7d8aff9), aguarda execução da WO-031
- [x] HIVE-018 — Centro de Controle V2 (2026-05-29) — ✅ 7d8aff9 (retroativo — WO-030)
- [ ] HIVE-019 — Lock System: Márcio como agente ativo (DIR-092) — WO pendente
- [ ] HIVE-020 — Dispatch de Agentes via UI (V1: somente Márcio) — debate pendente
- [x] HIVE-021 — Painel de Diretrizes e Governança na UI (2026-05-29) — ✅ 3e653c6
- [x] HIVE-014 — Eficiência do Squad no Hive UI (Seção 03 Mapa + tela Telemetria) (2026-05-29) — ✅ bd782fa
- [x] HIVE-022 — Centro de Controle: esteira visual por processo (pipeline Kanban) (2026-05-30) — ✅ aead0db
- [x] HIVE-023 — Gate View: inbox-marcio.md + painel The Gate no Hive UI (2026-05-29) — ✅ 9138908
- [x] HIVE-024 — Dois Copilotos: separar executor Hive vs. Produto — DEBATE-034 concluído (2026-05-29) — ✅ 8b94926
- [ ] HIVE-005 — Onboarding automatizado para novo operador

## ✅ Concluído
- [x] HIVE-012 — Política de Higiene de Inbox (DEBATE-025) (2026-05-29) — ✅ 8db27c6 + 81773c0
- [x] HIVE-013 — Orquestrador Híbrido V1 (DEBATE-026) (2026-05-29) — ✅ 53abf8f + 3f5ec9d
- [x] HIVE-001 — Redesign dos 4 atores do squad (2026-05-26)
- [x] HIVE-002 — Documentação oficial do Hive (2026-05-26)
- [x] HIVE-004 — Empacotar framework para outros repositórios (DEBATE-018) (2026-05-28)
- [x] HIVE-003 — Status report por entrega (DIR-086) (2026-05-28)
- [x] HIVE-011 — Regra global de próximo passo explícito no encerramento dos agentes (DEBATE-023) (2026-05-28)
- [x] HIVE-006 — Telemetria de custo por agente (2026-05-26)
- [x] HIVE-007 — Simplificação da estrutura de pastas (2026-05-26)
- [x] HIVE-008 — Milestone: Morte do Legado (Auth + Vendas + Cleanup) (2026-05-26)
- [x] HIVE-009 — Implementação de Módulos Plugáveis (DEBATE-014) (2026-05-27)
- [x] HIVE-010 — Sistema de Backlog e Real Locks (COPILOT-014) (2026-05-27)
