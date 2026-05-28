---
id: MAPA-TOS-017
titulo: Mapa de Classificação — docs/ TenantOS
backlog_ref: TOS-017
thread: debate-020-documentacao-tenantos
status: aguardando-aprovacao-marcio
data: 2026-05-28
responsavel: Claude (Arquiteto)
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target: tenantOS
cwd_exec: /home/marcio/job/tenantOS
---

# Mapa de Classificação — `docs/` TenantOS

> Este mapa é o contrato entre Claude e Copilot.
> **Copilot não move nenhum arquivo antes da aprovação do Márcio.**
> Após aprovação, executar em 2 ondas conforme instruções na seção 3.

---

## 1. Taxonomia (resumo)

| Zona | Critério | Quem pode ler |
|---|---|---|
| **LIVE** | Reflete código commitado em main; verdade operacional | Todos os agentes |
| **ACTIVE** | Planejamento corrente de produto; pode mudar a cada sprint | Gemini PO, Márcio |
| **PROCESS** | Memória de como o squad trabalhou; não é verdade do produto | Só sob demanda explícita |
| **COLD** | Legado explícito; congelado | Só sob demanda explícita |

---

## 2. Mapa arquivo → zona

### 2.1 Raiz de `docs/`

| Arquivo | Zona | Ação | Justificativa |
|---|---|---|---|
| `docs/README.md` | **LIVE** | Reescrever como "Mapa do Produto" (Onda 1) | Deve ser a âncora de navegação — hoje está vazio de intenção |
| `docs/CONCEITO_ARQUITETURAL_WHITE_LABEL.md` | **LIVE** | Mover para `docs/schema/` | Visão arquitetural — pertence à zona de verdade técnica |

### 2.2 `docs/adr/` — Architecture Decision Records

| Arquivo | Zona | Ação |
|---|---|---|
| `adr/ADR-0001-organizacao-repositorio.md` | **LIVE** | Manter |
| `adr/ADR-0002-migracao-apps-packages.md` | **LIVE** | Manter |
| `adr/ADR-0003-separacao-ci-cd-hml-prod.md` | **LIVE** | Manter |
| `adr/ADR-0004-redesenho-core-multi-tenant.md` | **LIVE** | Manter |

### 2.3 `docs/schema/`

| Arquivo | Zona | Ação | Justificativa |
|---|---|---|---|
| `schema/README.md` | **LIVE** | Manter | Índice da zona técnica |
| `schema/ARQUITETURA_ALVO_MULTI_TENANT.md` | **LIVE** | Manter | Arquitetura vigente |
| `schema/MODELAGEM_ATUAL_BACKEND.md` | **LIVE** | Manter | Schema atual do backend |
| `schema/AVALIACAO_FRAMEWORK_CORE_MULTI_TENANT.md` | **LIVE** | Manter | Análise que embasou ADR-0004 |
| `schema/BRANDING_VISUAL_TENANT_MVP.md` | **ACTIVE** | Mover para `docs/active/` | Status "proposto" — TOS-013 ainda em execução |
| `schema/CAPTACAO_VISUAL_CLIENTE_V1.md` | **ACTIVE** | Mover para `docs/active/` | Proposta de produto ainda em avaliação |
| `schema/BACKLOG_INICIAL_CORE_MULTI_TENANT.md` | **PROCESS** | Mover para `docs/process/` | Supersedido por `BACKLOG-TOS.md` no Hive |

### 2.4 `docs/runbooks/`

| Arquivo | Zona | Ação |
|---|---|---|
| `runbooks/deploy-hml.md` | **LIVE** | Manter |
| `runbooks/exemplo-evidencia-teste-manual.md` | **LIVE** | Manter |
| `runbooks/fluxo-fechamento-vendas-estoque-perdas.md` | **LIVE** | Manter |
| `runbooks/guia-seeds.md` | **LIVE** | Manter |
| `runbooks/hml-login.md` | **LIVE** | Manter |
| `runbooks/jenkins-github-credenciais-ci.md` | **LIVE** | Manter |
| `runbooks/migracao-apps-packages.md` | **LIVE** | Manter |
| `runbooks/podman-limpeza-local.md` | **LIVE** | Manter |
| `runbooks/protocolo-triagem-bug.md` | **LIVE** | Manter |
| `runbooks/regra-negocio-fechamento-caixa.md` | **LIVE** | Manter |
| `runbooks/release-gates.md` | **LIVE** | Manter |
| `runbooks/template-evidencia-jenkins-gates.md` | **LIVE** | Manter |
| `runbooks/template-evidencia-teste-manual.md` | **LIVE** | Manter |
| `runbooks/teste-manual-fluxo-via-tela.md` | **LIVE** | Manter |

### 2.5 `docs/infra/` e `docs/qa/`

| Arquivo | Zona | Ação |
|---|---|---|
| `infra/ambiente-dev-e-self-hosting.md` | **LIVE** | Manter |
| `qa/jornadas-criticas.md` | **LIVE** | Manter |

### 2.6 `docs/assets/`

| Arquivo | Zona | Ação |
|---|---|---|
| `assets/README.md` | **LIVE** | Manter |

### 2.7 `docs/planning/` — zona mais crítica (misturada)

| Arquivo | Zona | Ação | Justificativa |
|---|---|---|---|
| `planning/README.md` | **ACTIVE** | Reescrever como índice da zona ACTIVE | Deve descrever o que é ACTIVE e por quê |
| `planning/PLANO_EXECUCAO_WHITE_LABEL_MVP.md` | **ACTIVE** | Manter em `docs/active/` | Plano corrente de produto |
| `planning/ROADMAP_GANTT.md` | **ACTIVE** | Manter em `docs/active/` | Roadmap vivo |
| `planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md` | **ACTIVE** | Manter em `docs/active/` | DNA de negócio |
| `planning/PREMISSA_SOLUCOES_POR_NICHO.md` | **ACTIVE** | Manter em `docs/active/` | DNA de negócio |
| `planning/RELATORIO_EXECUTIVO_CENARIOS_ROADMAP.md` | **ACTIVE** | Manter em `docs/active/` | Planejamento executivo corrente |
| `planning/IDEIA_VIVA_CUSTO_E_MONETIZACAO_TRIO.md` | **ACTIVE** | Manter em `docs/active/` | Doc vivo de monetização |
| `planning/BASE_TECNICA_REAPROVEITAVEL_WHITE_LABEL.md` | **ACTIVE** | Manter em `docs/active/` | Estratégia técnica de reúso |
| `planning/AGENTE_ESPECIALISTA_ARQUITETURA.md` | **PROCESS** | Mover para `docs/process/` | Como o squad de IA opera — não é produto |
| `planning/FRONTEIRAS_SQUAD_DUAL_TONE.md` | **PROCESS** | Mover para `docs/process/` | Governança do squad |
| `planning/ONBOARDING_FULL_DUAL_TONE.md` | **PROCESS** | Mover para `docs/process/` | Onboarding do squad |
| `planning/PROMPT_PLANO_MESTRE_WHITE_LABEL.md` | **PROCESS** | Mover para `docs/process/` | Prompt de IA — não é produto |
| `planning/CHECKLIST_LIFECYCLE_ADAPTADO.md` | **PROCESS** | Mover para `docs/process/` | Checklist de processo de construção |
| `planning/SANITIZACAO_DOCUMENTACAO_WHITE_LABEL.md` | **PROCESS** | Mover para `docs/process/` | Processo de sanitização — meta-doc |
| `planning/FRAMEWORK_EVOLUTION.md` | **PROCESS** | Mover para `docs/process/` | Evolução do framework de trabalho |
| `planning/ETAPA_DEV-001_AUTENTICACAO_PUSH.md` | **PROCESS** | Mover para `docs/process/` | Sprint específico — memória de execução |
| `planning/GUIA_RETOMADA_ROADMAP_AGIL.md` | **PROCESS** | Mover para `docs/process/` | Guia de retomada do squad |
| `planning/PLANNING_POKER_ESTIMATIVAS.md` | **PROCESS** | Mover para `docs/process/` | Sessão de planning — memória de processo |
| `planning/BACKLOG_DESENVOLVIMENTO.md` | **COLD** | Mover para `docs/history/` | Supersedido por `BACKLOG-TOS.md` no Hive |

### 2.8 `docs/evidencias/`

| Arquivo | Zona | Ação | Justificativa |
|---|---|---|---|
| `evidencias/README.md` | **PROCESS** | Mover para `docs/process/evidencias/` | Histórico de validações manuais |
| `evidencias/2026-05-16-dev-001-validacao-auth-push.md` | **PROCESS** | Mover para `docs/process/evidencias/` | Evidência de execução passada |
| `evidencias/2026-05-24-onboarding-full.md` | **PROCESS** | Mover para `docs/process/evidencias/` | Evidência de execução passada |

### 2.9 `docs/history/` — COLD (manter intacto)

| Arquivo | Zona | Ação |
|---|---|---|
| `history/` (todos) | **COLD** | Manter onde está — já é explicitamente histórico |

---

## 3. Estrutura alvo após refatoração

```
docs/
├── README.md                          ← LIVE — Mapa do Produto (reescrever)
├── adr/                               ← LIVE — Decision Records (sem mudança)
├── assets/                            ← LIVE (sem mudança)
├── infra/                             ← LIVE (sem mudança)
├── qa/                                ← LIVE (sem mudança)
├── runbooks/                          ← LIVE (sem mudança)
├── schema/                            ← LIVE (+ CONCEITO_ARQUITETURAL movido para cá)
├── active/                            ← ACTIVE — nova pasta
│   ├── README.md                      ← índice da zona ACTIVE
│   ├── PLANO_EXECUCAO_WHITE_LABEL_MVP.md
│   ├── ROADMAP_GANTT.md
│   ├── PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md
│   ├── PREMISSA_SOLUCOES_POR_NICHO.md
│   ├── RELATORIO_EXECUTIVO_CENARIOS_ROADMAP.md
│   ├── IDEIA_VIVA_CUSTO_E_MONETIZACAO_TRIO.md
│   ├── BASE_TECNICA_REAPROVEITAVEL_WHITE_LABEL.md
│   ├── BRANDING_VISUAL_TENANT_MVP.md
│   └── CAPTACAO_VISUAL_CLIENTE_V1.md
├── process/                           ← PROCESS — nova pasta
│   ├── README.md                      ← aviso: não ler automaticamente
│   ├── evidencias/                    ← evidências de execução
│   └── [arquivos de processo do planning/]
└── history/                           ← COLD (sem mudança)
```

---

## 4. Instruções de execução para o Copilot

### Onda 1 — Estrutura e índices (sem mover arquivos de conteúdo)
1. Criar `docs/active/` com `README.md` (índice da zona)
2. Criar `docs/process/` com `README.md` (aviso de não leitura automática)
3. Criar `docs/process/evidencias/`
4. Reescrever `docs/README.md` como Mapa do Produto (âncora de navegação)
5. Criar `docs/active/index.json` — mapa de zonas para agentes

### Onda 2 — Movimentação física
Executar na ordem abaixo. Para cada `git mv`:
1. Fazer o `git mv` origem → destino
2. Buscar referências ao caminho antigo: `grep -r "caminho_antigo" docs/ beehive/`
3. Atualizar referências encontradas
4. Só avançar para o próximo arquivo após confirmar ausência de links quebrados

**Ordem de movimentação (da menor para maior risco de referências):**
1. `schema/BACKLOG_INICIAL_CORE_MULTI_TENANT.md` → `process/`
2. `schema/BRANDING_VISUAL_TENANT_MVP.md` → `active/`
3. `schema/CAPTACAO_VISUAL_CLIENTE_V1.md` → `active/`
4. `docs/CONCEITO_ARQUITETURAL_WHITE_LABEL.md` → `schema/`
5. `planning/BACKLOG_DESENVOLVIMENTO.md` → `history/`
6. `evidencias/` → `process/evidencias/` (mover pasta inteira)
7. Arquivos PROCESS de `planning/` → `process/` (um a um)
8. Arquivos ACTIVE de `planning/` → `active/` (um a um)
9. Remover `planning/` se vazio

### Ponto de parada obrigatório
Após Onda 1: parar e reportar ao Claude antes de iniciar Onda 2.
Após Onda 2: parar e aguardar auditoria do Claude.

---

## 5. Entregáveis obrigatórios (critérios de aceite)

- [ ] `docs/README.md` reescrito como Mapa do Produto com links para cada zona
- [ ] `docs/active/index.json` com lista de arquivos e zona para cada um
- [ ] `docs/process/README.md` com aviso de "não ler automaticamente"
- [ ] Zero links quebrados (validar com `grep -r "planning/" docs/ runbooks/ adr/`)
- [ ] `planning/` removida ou vazia após movimentação
- [ ] `git status` limpo (sem arquivos não rastreados em `docs/`)
