---
id: WO-TOS-013-ONDA-1
titulo: Implementação de Branding Dinâmico — Onda 1
backlog_ref: TOS-013
status: executada
data: 2026-05-28
responsavel: Copilot (Executor)
blueprint_ref: BLUEPRINT-TOS-013
---

# Work Order TOS-013 — Onda 1: Gaps G1, G2 e G3

Esta Work Order cobre a primeira onda de implementação do Branding Dinâmico no **TenantOS**, focando em garantir que as variáveis CSS estejam completas, os fallbacks estejam corretos (FluxoLabel) e o FOUC seja mitigado.

## 🎯 Escopo

### 1. G1: CSS Vars Incompletas (Frontend)
**Arquivo:** `/home/marcio/job/tenantOS/frontend/src/app/tenant/TenantThemeProvider.tsx`

**Ação:** Atualizar o `useEffect` para injetar todas as 11 variáveis CSS no `document.documentElement`.
- `--tenant-primary`: `config.primaryColor`
- `--tenant-secondary`: `config.secondaryColor`
- `--tenant-text-on-primary`: `config.textOnPrimary`
- `--tenant-page-bg`: `config.pageBackgroundColor`
- `--tenant-panel-bg`: `config.panelBackgroundColor`
- `--tenant-text-primary`: `config.textPrimaryColor`
- `--tenant-text-secondary`: `config.textSecondaryColor`
- `--tenant-logo-url`: `url('${config.logoUrl}')` (se existir)
- `--tenant-cover-url`: `url('${config.coverImageUrl}')` (se existir)

**Nota:** Garanta que valores `undefined` tenham fallbacks seguros ou não sejam injetados para não quebrar o CSS.

---

### 2. G2: Fallbacks para FluxoLabel Standard
**Arquivos:**
1. `/home/marcio/job/tenantOS/frontend/src/app/tenant/configs.ts` (`DEFAULT_BRAND`)
2. `/home/marcio/job/tenantOS/backend/src/tenant/tenant-branding.service.ts` (`DEFAULT_TENANT_BRANDING`)

**Ação:** Substituir a identidade "Fluxo Pub" pela "FluxoLabel Standard":
- `brandName`: `"FluxoLabel"`
- `tagline`: `"Sua marca. Nosso sistema."`
- `primaryColor`: `"#6C3CE1"`
- `secondaryColor`: `"#00E5A0"`
- `textOnPrimary`: `"#FFFFFF"`
- `pageBackgroundColor`: `"#09090B"`
- `panelBackgroundColor`: `"#09090B"`
- `textPrimaryColor`: `"#FFFFFF"`
- `textSecondaryColor`: `"#A9A9A9"`

---

### 3. G3: Mitigação de FOUC e Title (Frontend)
**Arquivo:** `/home/marcio/job/tenantOS/frontend/index.html`

**Ação:**
- Alterar `<title>` para `FluxoLabel`.
- Injetar bloco `<style>` no `<head>` com as variáveis default do FluxoLabel (conforme valores acima) para evitar o flash de cores brancas antes da hidratação do React.

---

## ✅ Critérios de Aceite
- [ ] Todas as 9 variáveis de cor/fundo estão presentes no `document.documentElement` após o carregamento.
- [ ] A marca "FluxoLabel" aparece como fallback em vez de "Fluxo Pub".
- [ ] As cores primária/secundária default são `#6C3CE1` e `#00E5A0`.
- [ ] Ao recarregar a página, não há flash de tela branca (o fundo `#09090B` deve ser aplicado imediatamente via CSS inline no HTML).

## 🛠️ Instruções para o Copilot
- Use `run_shell_command` com `sed` ou ferramentas de edição de arquivo se o arquivo estiver fora do workspace atual (conforme permissões do ambiente).
- Valide as mudanças reiniciando os serviços se necessário (embora sejam mudanças de frontend/config).
