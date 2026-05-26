# Handoff Copilot — Status atual do squad (2026-05-23 — milestone Agente de Vendas HML)

## Entregas desta sessão (Claude)

| Item | O quê | Commit |
|---|---|---|
| fix(core) | rootDir=./src no tsconfig para corrigir dist/main.js | f4dce77 |
| fix(core) | excluir pasta prisma do tsconfig.build (TS6059) | d714d8e |
| fix(ci) | script definitivo de migration com recuperação de P3009 | b1b3e7b |
| fix(ci) | CI movido de `develop` → `main` (estava sem rodar) | 5171672 |
| fix(frontend) | landing page como rota raiz, login movido para /login | e9416a1 |
| feat(frontend) | redesign da login page white label + logout `/login` | 1f0cfc1 |
| feat(frontend) | command center `/platform` + atalhos de sinais | 6025b77 |
| feat(platform) | conversao lead → tenant com CTA Criar Brand e credenciais | a157d12 |
| docs(squad) | convenção de branches: `{type}/{issue}-{kebab}` | 5171672 |
| docs(qa) | mapa de jornadas críticas em `docs/qa/jornadas-criticas.md` | — |

---

## Push — resolvido

Chave SSH dedicada criada (`~/.ssh/github_claude`) e adicionada ao GitHub.
Push agora funciona diretamente via terminal pelo Márcio — sem passphrase.

---

## Variáveis de ambiente já preenchidas no servidor HML

Arquivo: `~/wl-envs/core.env` em `hml-jenkins`

| Variável | Status |
|---|---|
| `TWILIO_ACCOUNT_SID` | ✅ preenchida |
| `TWILIO_AUTH_TOKEN` | ✅ preenchida e validada via API |
| `TWILIO_WHATSAPP_FROM` | ✅ `whatsapp:+14155238886` |
| `ANTHROPIC_API_KEY` | ✅ preenchida |
| `APP_URL` | ✅ URL do Cloudflare Tunnel atual |

**Essas vars só entram em efeito após o próximo redeploy.**

---

## Prioridade imediata para o Copilot

### Fila Copilot atualizada pelo Claude

- Arquivo-fonte: `ai/construcao/tasks/FILA_COPILOT.md`
- Issue ativa registrada: nenhuma no momento.
- `#86` foi validada com sucesso (`db:validate`, `check:types`, `build`, `db:seed`) e fechada no GitHub nesta rodada.
- `#80` foi concluida, validada no frontend (`check:types`, `build`), fechada no GitHub e publicada na `main` em `7582127`.
- Ordem operacional atual: aguardando novo alinhamento para o Copilot.

### Debate legado respondido antes de seguir a fila

- Arquivo-fonte: `ai/construcao/tasks/DEBATE_LEGADO_BACKEND.md`
- Estado compartilhado atual: debate **executado**; o Copilot removeu `wl-backend` do deploy alvo, limpou as superfícies legacy do frontend e devolveu a fila para a `#65`.
- Posicao consolidada do Copilot: remover `wl-backend` do deploy, manter `apps/backend/` como referencia, remover superficies legacy quebradas do frontend e migrar o POS como epico proprio no Ciclo 2.
- Issue épica criada para rastrear a migração: `#92` — `[Ciclo 2] Migracao POS -> core`.
- Proximo passo deste debate: manter `#92` no backlog do Ciclo 2; operacionalmente o Copilot aguarda nova issue alinhada.

### Lote #80/#84/#85/#86

- Branch do lote: `feat/84-85-86-80-platform-batch`
- Commit principal: `145cf10`
- Merge no `main`: `f0e9124`
- Situação atual: **publicado no `origin/main`**; deploy HML deve seguir o fluxo automático do repositório.

### Milestone Agente de Vendas HML v1

**P1 — DONE (Claude, commit fd979ae):**

- `#87` ✅ — gate `'qualificado'` corrigido em `qualificacao.service.ts`
- `#89` ✅ — coluna "Qualificados" no pipeline alinhada com gate `'qualificado'`

**Contexto já resolvido:**
- Twilio Sandbox autorizado pelo Márcio ✅
- Webhook URL configurada no Twilio Console ✅
- Nginx atualizado: `/webhook/` → NestJS core ✅
- Fix de gate + pipeline: commit `fd979ae` ✅

**Bloqueio manual em paralelo:** #88 ainda depende de acao do Márcio (push/redeploy HML + webhook no Twilio Console). Enquanto isso, o Copilot segue a fila operacional pela `#65`.

**P2 (após milestone #88):**
- `#90` — aprovação manual no pipeline → dispara WhatsApp ao lead
- `#91` — landing page com textos editáveis pelo platform admin

---

## Board geral

| # | Issue | Agente | Status | Prioridade |
|---|---|---|---|---|
| #81 | Platform Admin: Home Dashboard de Sinais | Copilot | **Done** | P1 |
| #82 | Platform Admin: Lead → Criar Brand | Copilot | **Done** | P1 |
| #83 | Platform Admin: Branding completo + preview | Copilot | **Done** | P1 |
| #87 | fix: gate 'qualified' → 'qualificado' | Claude | **Done main fd979ae** | P1 |
| #88 | Milestone HML v1 — Agente de Vendas e2e | Claude+Márcio | **Bloqueio manual: push/redeploy/webhook** | P1 |
| #89 | Leads WhatsApp visíveis no pipeline global | Claude | **Done main fd979ae** | P1 |
| #84 | Platform Admin: Criar/listar usuários do tenant | Copilot | **Done / issue fechada** | P2 |
| #85 | App Tenant: Feature flags reais dos módulos | Copilot | **Done / issue fechada** | P2 |
| #86 | Seed cenários massa (demo + validação) | Copilot | **Done / issue fechada** | P2 |
| #80 | Landing page responsiva | Copilot | **Done / issue fechada** | P2 |
| #90 | Aprovação manual → notificação WhatsApp | Copilot | **Done / issue fechada** | P2 |
| #91 | Landing page textos editáveis | Copilot | **Todo** | P2 |
| #78 | Frontend Pipeline V2 | Claude | Todo | P1 |
| #65 | Twilio Sandbox + Webhook | Copilot | **Done / issue fechada** | P1 |
| #92 | [Ciclo 2] Migracao POS -> core | Copilot | **Todo** | P2 |
| #79 | Redesign login page | Copilot | **Done** | — |

---

## Decisões arquiteturais tomadas nesta sessão

### Twilio vs Meta Business API
- **Decisão:** Twilio Sandbox para validar agora; plugável para trocar depois.
- **Padrão:** Strategy pattern (NotificationChannel interface) no NestJS.
- **Canais previstos:** Twilio, Meta Business API, Telegram.
- **Issue pendente:** criar issue para NotificationModule com spec da interface.

### Legado Express (apps/backend)
- **Decisão:** manter por ora; migração gradual por módulo para NestJS.
- **Gatilho para migrar:** quando um módulo legado precisar de feature nova.
- **Não quebrar:** Express continua em :5000, NestJS em :3000. Frontend usa ambos.

### Convenção de branches
- Formato: `{type}/{issue-number}-{descricao-em-kebab}`
- Exemplos: `feat/83-branding-preview`, `fix/86-seed-hml`
- Documentado em: `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md`

### Seed (#86)
- **Escopo:** apenas HML. Campos de dossier dos leads (brandName, tagline, cores, coverImageUrl) usados para personalizar os tenants de demo.
- **4 tenants demo:** Mesa Viva (restaurante), Crescer Bem (clínica), Boa Praça (mercearia), Studio Bella Corte (salão).

---

## Twilio Sandbox — próximos passos para o Márcio

1. Acessar [console.twilio.com](https://console.twilio.com) → Messaging → Try it out → Send a WhatsApp message
2. Pegar a keyword do Sandbox (ex: "join cold-river")
3. Enviar essa mensagem do WhatsApp pessoal para `+1 415 523 8886`
4. Após autorização → testar envio via Agente de Vendas

---

## Acesso ao HML

| O que | Como |
|---|---|
| SSH no servidor | `ssh hml-jenkins` |
| URL HML | Verificar no servidor qual tunnel está ativo |
| Platform Admin | `{URL}/platform/login` → `marcio.heleno@gmail.com` |
| Tenant (Mesa Viva) | `{URL}/login` → `admin@fluxopub.com` / `123456` |
| Ver containers | `docker compose -f docker-compose.hml.yml ps` |
| Ver logs | `docker compose -f docker-compose.hml.yml logs -f wl-core` |

---

## Mapa de QA

Documento criado: `docs/qa/jornadas-criticas.md`

Cobre 4 blocos:
- **A** — Platform Admin (login, sinais, pipeline, conversão, branding, módulos)
- **B** — App Tenant PDV (login, dashboard, venda, agenda, fechamento, mesas/cozinha)
- **C** — Agente de Vendas WhatsApp (lead, dossier, aprovação, criação de brand)
- **D** — Infra CI/CD (deploy, migrations, vars de ambiente)

Status atual de todas as jornadas: `pendente` (nenhuma validada ainda — aguarda redeploy com as novas vars).

---

## Contexto técnico (mantido)

### Arquitetura de dois backends

| App | Stack | Porta | Responsabilidade |
|---|---|---|---|
| `apps/backend/` | Express.js legado | 5000 | PDV original — dashboard, fechamento, movimentos, relatórios |
| `apps/core/` | NestJS multi-tenant | 3000 | Tudo novo — auth, clientes, produtos, vendas, agendamentos, platform admin, WhatsApp |

Frontend usa:
- `API_BASE_URL = :5000` → Express (legado)
- `CORE_API_BASE_URL = :3000` → NestJS (novo)

**Regra:** toda feature nova vai no NestJS. O Express só recebe manutenção emergencial.

### Schema atual (2026-05-23)
Modelos: `Tenant`, `Cliente`, `Usuario`, `Produto`, `Venda`, `VendaItem`, `TenantModulo`, `Agendamento`, `ObservacaoSessao`, `Lead`

### Padrões do projeto
- Service: `TenantContext.getRequiredTenantId()` — nunca receber tenantId via parâmetro
- Select: `satisfies Prisma.XSelect` + `GetPayload` para tipagem
- DTOs: `class-validator` com `@IsNotEmpty()` em obrigatórios
- Module: importar `TenantModule` (não `PrismaModule` diretamente)
- Guard: `@Roles('admin', 'vendedor')` no controller
- Platform endpoints: `@PlatformAdmin()` + `@SkipTenant()`

---

## Registro de entrega — #79

**Escopo:** redesign da login page com identidade white label.

- split-screen desktop: painel visual esquerdo + formulário direito
- fallback gradiente `primaryColor → secondaryColor` quando sem `coverImageUrl`
- mobile: só formulário centralizado
- tenant demo fixo `Mesa Viva` quando sem slug dinâmico

---

## Registro de entrega — #81

**Escopo:** dashboard `/platform` como command center de sinais.

- `PlatformHome.tsx` — counters reais + seção "Atenção agora" + atalhos clicáveis
- `routes.tsx` — rota index em `/platform`
- `PlatformLayout.tsx` — item Home no menu lateral
- `PlatformPipeline.tsx` — suporte a query params `gate` e `leadId`
- `PlatformTenants.tsx` — suporte a query param `tenantId` para abrir drawer

---

## Registro de entrega — #82

**Escopo:** conversão direta de lead elegível em tenant com credenciais temporárias.

**Backend:**
- `dto/convert-lead-to-tenant.dto.ts` — DTO com validação de slug
- `platform-leads.controller.ts` — `POST /api/platform/leads/:id/convert-to-tenant`
- `platform-leads.service.ts` — validação + criação transacional tenant + admin + vínculo lead

**Frontend:**
- `api.ts` — cliente `convertLeadToTenant(...)`
- `PlatformPipeline.tsx` — CTA Criar Brand + modal + painel de credenciais + badge

---

## Registro de entrega — #83

**Escopo:** branding completo do tenant com edição no Platform Admin e preview ao vivo do login.

**Backend:**
- `dto/update-platform-tenant.dto.ts` — expansão dos campos de branding opcionais
- `platform-tenant.service.ts` — response/detail/update com todos os campos `branding_*`

**Frontend:**
- `api.ts` — `getPlatformTenant(...)`, `updatePlatformTenant(...)` e tipos completos de branding
- `PlatformTenants.tsx` — abas de Identidade/Módulos/Acesso, formulário completo, preview ao vivo e salvar via PATCH

**Validação executada:**
- `npm --prefix apps/core run check:types`
- `npm --prefix apps/core run build`
- `npm --prefix apps/frontend run check:types`
- `npm --prefix apps/frontend run build`
- `npm run check:types`
- `npm run build`

---

## Registro de entrega — #84

**Escopo:** Platform Admin agora lista e cria usuários do tenant com senha temporária.

**Backend:**
- `dto/create-platform-tenant-usuario.dto.ts` — DTO com validação de nome, e-mail e tipo.
- `platform-tenant.controller.ts` — endpoints `GET/POST /api/platform/tenants/:id/usuarios`.
- `platform-tenant.service.ts` — listagem, criação, hash de senha e retorno da credencial temporária.

**Frontend:**
- `api.ts` — tipos e client para listar/criar usuários do tenant.
- `PlatformTenants.tsx` — aba "Acesso" com lista, modal de criação e painel de senha temporária.

**Validação executada:**
- `npm --prefix apps/core run check:types`
- `npm --prefix apps/core run build`
- `npm --prefix apps/frontend run check:types`
- `npm --prefix apps/frontend run build`
- `npm run check:types`
- `npm run build`

---

## Registro de entrega — #85

**Escopo:** app tenant passa a usar feature flags reais dos módulos ativos para montar o menu.

**Backend:**
- `tenant-branding.service.ts` — resolução dos módulos ativos por tenant autenticado.
- `tenant.controller.ts` — endpoint `GET /api/tenant/modulos`.

**Frontend:**
- `api.ts` — `getTenantModulos()` e tipo de resposta.
- `Layout.tsx` — filtro do menu por módulo ativo e redirecionamento quando a rota atual fica indisponível.

**Validação executada:**
- `npm --prefix apps/core run check:types`
- `npm --prefix apps/core run build`
- `npm --prefix apps/frontend run check:types`
- `npm --prefix apps/frontend run build`
- `npm run check:types`
- `npm run build`

---

## Registro de entrega — #86

**Escopo:** seed HML/demo expandida com cenários realistas, tenants estruturados e leads prontos para demonstração.

**Core:**
- `prisma/seed.ts` — seed idempotente com tenants Mesa Viva, Boa Praça e Studio Bella Corte.
- `prisma/seed.ts` — leads estruturados, clientes, produtos, vendas, agendamentos e observações.
- `prisma/seed.ts` — senha demo padrão `Demo@123`.

**Validação executada:**
- `npm --prefix apps/core run check:types`
- `npm --prefix apps/core run build`
- `cd apps/core && npx prisma migrate deploy --schema ./prisma/schema.prisma`
- `npm --prefix apps/core run db:seed`

---

## Registro de entrega — #80

**Escopo:** Landing pública adaptada para mobile e tablet sem redesign estrutural.

**Frontend:**
- `Landing.tsx` — hook de breakpoint responsivo aplicado às seções principais.
- `Landing.tsx` — navbar com menu hamburguer no mobile.
- `Landing.tsx` — hero, preview/tabs, grids, CTA e footer empilhados/ajustados por viewport.

**Validação executada:**
- `npm --prefix apps/frontend run check:types`
- `npm --prefix apps/frontend run build`
- `npm run check:types`
- `npm run build`

**Publicação:**
- Commit em `main`: `7582127` — `feat(frontend): ajustar landing mobile (#80)`
- Push realizado para `origin/main`

---

## Observações de Risco e Fluxo (Gemini — 2026-05-23)

### Pontos de atenção para Claude e Copilot:
1. **Risco de Sincronia:** Atenção ao `session-state.env` para evitar amnésia operacional entre agentes. Rodar `npm run squad:session:update` é crítico.
2. **Gargalo #88:** O fluxo de desenvolvimento está estacionado aguardando validação de infra (Redeploy HML + Webhook Twilio). Evitar abrir novas frentes complexas antes de validar o Happy Path do Agente de Vendas.
3. **Limpeza de Contexto:** Arquivos efêmeros em `ai/construcao/` precisam de limpeza (ver insight no buffer).
4. **Roteamento:** Manter a tag `#escala-claude` para temas arquiteturais e `#escala-copilot` para contratos fechados, evitando sobreposição de decisões.

