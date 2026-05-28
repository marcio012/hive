---
id: BLUEPRINT-TOS-013
titulo: Branding Dinâmico — Auditoria e Gaps
backlog_ref: TOS-013
thread: branding-dinamico-white-label
status: pronto-para-execucao
data: 2026-05-28
responsavel: Claude (Arquiteto)
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target: tenantOS
cwd_exec: /home/marcio/job/tenantOS
---

# Blueprint TOS-013 — Branding Dinâmico

## 1. Auditoria do Estado Atual

O núcleo do branding **já está implementado**. A ideação não sabia disso.

| Camada | Arquivo | Status |
|---|---|---|
| Schema Prisma | `backend/prisma/schema.prisma` — model `Tenant` | ✅ 11 campos de branding |
| Backend Service | `backend/src/tenant/tenant-branding.service.ts` | ✅ `getBySlug()` com fallback |
| API Endpoint | `GET /tenant/:slug/branding` (público, sem auth) | ✅ funcional |
| Frontend Hook | `frontend/src/app/tenant/useTenantBranding.ts` | ✅ com cache in-memory |
| CSS Injection | `frontend/src/app/tenant/TenantThemeProvider.tsx` | ⚠️ parcial — 3 de 8 vars |
| Fallback Brand | `frontend/src/app/tenant/configs.ts` — `DEFAULT_BRAND` | ❌ cores erradas |
| Admin Panel | — | ❌ ausente |
| FOUC prevention | — | ❌ ausente |

---

## 2. Gaps Identificados

### G1 — CSS vars incompletas no `TenantThemeProvider`

**Arquivo:** `frontend/src/app/tenant/TenantThemeProvider.tsx`

Apenas 3 vars são injetadas no `document.documentElement`:
```
--tenant-primary        ✅
--tenant-secondary      ✅
--tenant-text-on-primary ✅
```

Faltam:
```
--tenant-page-bg        ← branding_fundo_pagina
--tenant-panel-bg       ← branding_fundo_painel
--tenant-text-primary   ← branding_texto_primario
--tenant-text-secondary ← branding_texto_secundario
--tenant-logo-url       ← branding_logo_url
--tenant-cover-url      ← branding_cover_url
```

**Critério de aceite:** todas as 9 vars presentes no `useEffect` do provider.

---

### G2 — Fallback com identidade errada

**Arquivo:** `frontend/src/app/tenant/configs.ts` (DEFAULT_BRAND) e `backend/src/tenant/tenant-branding.service.ts` (DEFAULT_TENANT_BRANDING)

Hoje usa "Fluxo Pub" com cores neutras. Deve usar **FluxoLabel Standard**:

| Campo | Valor atual | Valor correto |
|---|---|---|
| `brandName` | `"Fluxo Pub"` | `"FluxoLabel"` |
| `tagline` | `"Sistema de Gestão para Bares e Pubs"` | `"Sua marca. Nosso sistema."` |
| `primaryColor` | `"#ffffff"` | `"#6C3CE1"` |
| `secondaryColor` | `"#A9A9A9"` | `"#00E5A0"` |
| `textOnPrimary` | `"#000000"` | `"#FFFFFF"` |
| `pageBackgroundColor` | `undefined` | `"#09090B"` |

**Critério de aceite:** tenant sem branding configurado exibe cores `#6C3CE1` / `#00E5A0` / `#09090B`.

---

### G3 — FOUC no carregamento

**Arquivo:** `frontend/index.html` ou equivalente (ponto de entrada HTML)

O `TenantThemeProvider` injeta vars via `useEffect` — client-side, após hidratação. Isso causa flash das cores padrão antes das cores do tenant carregarem.

**Solução:** injetar as vars do FluxoLabel Standard diretamente no `<head>` como `<style>` inline, para que o fallback visual já esteja correto antes do React montar:

```html
<style>
  :root {
    --tenant-primary: #6C3CE1;
    --tenant-secondary: #00E5A0;
    --tenant-text-on-primary: #FFFFFF;
    --tenant-page-bg: #09090B;
    --tenant-panel-bg: #09090B;
    --tenant-text-primary: #FFFFFF;
    --tenant-text-secondary: #A9A9A9;
  }
</style>
```

Assim o app nasce com as cores FluxoLabel e a transição para as cores do tenant é suave.

**Critério de aceite:** recarregar a página não exibe flash de cores brancas/neutras antes das cores do tenant aparecerem.

---

### G4 — Admin Panel para edição de branding

**Escopo:** formulário no painel admin do tenant para editar os campos de branding.

- Campos: nome, tagline, logo_url, cover_url, cores (color picker), fundo
- Endpoint destino: `PATCH /tenant/admin/branding` (a criar ou verificar se já existe)
- Preview em tempo real das variáveis CSS no formulário

**Este gap é o maior e deve ser tratado como work order separada.**
Verificar antes da execução se já existe endpoint admin para branding:

```bash
grep -rn "branding" /home/marcio/job/tenantOS/backend/src/tenant/tenant.controller.ts
grep -rn "branding" /home/marcio/job/tenantOS/backend/src/tenant/tenant-admin.service.ts
```

**Critério de aceite:** alterar a cor primária no painel Admin e ver a mudança refletida na Dashboard sem reload de página.

---

## 3. Sequência de Execução Recomendada

| Onda | Gaps | Risco | Observação |
|---|---|---|---|
| **Onda 1** | G1 + G2 + G3 | Baixo | Pura configuração; sem migration |
| **Onda 2** | G4 | Médio | Requer auditoria de endpoint admin antes de criar |

---

## 4. O que NÃO está no escopo

- `theme_mode` (dark/light) — campo não está no schema; se decidido pelo Márcio, exige migration Prisma separada
- Upload real de logo (storage/CDN) — o campo `logo_url` aceita URL externa; upload de arquivo é funcionalidade futura
- Presets por nicho (varejo, serviços, premium) — citado na ideação como mitigação de risco de contraste; fora do escopo desta entrega

---

## 5. Análise Financeira (DIR-080)

| Dimensão | Valor |
|---|---|
| Custo deste blueprint | R$ 0,80 estimado |
| Confiança | Alta — produto já existe, gaps são cirúrgicos |
| Custo da Onda 1 (G1+G2+G3) | R$ 0,40 estimado — mudanças pontuais em 3 arquivos |
| Custo da Onda 2 (G4) | R$ 1,20–2,00 — depende do estado do endpoint admin |
| Valor gerado | Identidade visual real do produto; cliente vê sua marca no sistema |
| Payback | Imediato para demo e vendas |
| Custo de não fazer | Produto entregue com "Fluxo Pub" como marca padrão — erro de produto em demo |

---

## 6. Critérios de Aceite Globais (TOS-013 Done)

- [ ] Tenant com branding configurado exibe cores próprias sem flash
- [ ] Tenant sem branding configurado exibe FluxoLabel Standard (`#6C3CE1` / `#00E5A0` / `#09090B`)
- [ ] Todas as 9 CSS vars presentes no provider
- [ ] `npm run build` no frontend sem erros de tipo
- [ ] Admin pode editar branding e ver mudança refletida (G4 — Onda 2)
