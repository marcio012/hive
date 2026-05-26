---
issue: "#38"
titulo: "Issue #38 - Validar fluxo visual V1 do intake ao rendering"
owner_atual: copilot
iniciado_em: 2026-05-21
ultimo_checkpoint: 2026-05-21T19:56:28Z
---

## Objetivo

Validar ponta a ponta que o branding visual V1 sai da persistencia no `Tenant`, aparece no endpoint publico e produz efeito real no frontend em `Login` e `Layout`.

## Escopo

**Entra:**
- verificar persistencia dos dados visuais no banco
- verificar resposta do endpoint `GET /api/tenants/:slug/branding`
- verificar rendering de `logo`, `cover` e cores no `Login`
- verificar rendering de `logo` e cores no `Layout`
- publicar evidencia objetiva da validacao

**Nao entra:**
- landing publica
- comportamento por tenant
- variacao de layout
- CMS ou motor generico

## Preparacao da validacao

### Subir stack local

```bash
npm run dev:up:all
```

### Injetar branding visivel no tenant `demo`

```bash
podman exec fluxo-dev-postgres psql -U fluxo -d fluxopub -c "
UPDATE \"Tenant\"
SET
  branding_nome = 'Demo White Label',
  branding_tagline = 'Branding V1 visual',
  branding_logo_url = 'https://placehold.co/256x256/png?text=Demo+Logo',
  branding_cover_url = 'https://placehold.co/1200x400/png?text=Demo+Cover',
  branding_cor_primaria = '#7c3aed',
  branding_cor_secundaria = '#22c55e',
  branding_texto_sobre_primaria = '#ffffff',
  branding_fundo_pagina = '#111827',
  branding_fundo_painel = '#1f2937',
  branding_texto_primario = '#f9fafb',
  branding_texto_secundario = '#cbd5e1'
WHERE slug = 'demo';
"
```

### Confirmar persistencia/endpoint

```bash
curl -s http://localhost:3000/api/tenants/demo/branding | jq
```

## Validacao visual esperada

### Login

Abrir:

```text
http://localhost:5173/?tenant=demo
```

Conferir:
- `cover` renderizada como banner acima do card
- `logo` do tenant aplicada
- `brandName` e `tagline` visiveis
- cores aplicadas em fundo, painel, textos e botao
- sem layout em duas colunas

### Layout

Login com:

```text
admin@fluxopub.com / 123456
```

Depois, no console do navegador:

```js
const user = JSON.parse(localStorage.getItem('fluxo_user') || '{}');
localStorage.setItem('fluxo_user', JSON.stringify({ ...user, tenantSlug: 'demo' }));
location.reload();
```

Conferir:
- `logo` do tenant no shell da aplicacao
- `brandName` no header/sidebar
- cores aplicadas no fundo e itens ativos

## Evidencia objetiva esperada

- payload do endpoint com os 11 campos do contrato visual V1
- screenshots do `Login` e do `Layout`
- confirmacao de que a `cover` aparece como banner e nao como layout alternativo
- confirmacao de que o `Layout` consome branding publico pelo `tenantSlug`

## Status atual

- [x] Contrato visual V1 implementado no core
- [x] Renderizacao do branding implementada no frontend
- [x] Ajuste de escopo do `Login` concluido na #37
- [x] Validacao visual executada por Márcio
- [x] Evidencia publicada na #38
- [x] Issue fechada

## Proximo passo imediato

#38 encerrada apos validacao visual manual confirmada pelo owner.
