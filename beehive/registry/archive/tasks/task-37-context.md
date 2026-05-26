---
issue: "#37"
titulo: "Issue #37 - Aplicar branding visual V1 no Login e Layout"
owner_atual: copilot
iniciado_em: 2026-05-21
ultimo_checkpoint: 2026-05-21T19:13:16Z
---

## Escopo

**Entra:**
- Login com logo, cover opcional, nome da marca, tagline e tema por cores
- Layout com logo, nome da marca e tema por cores
- fallback seguro para assets ausentes ou com erro

**Nao entra:**
- landing publica
- variacao de layout por tenant
- customizacao de menus

## Criterios de aceite

- [x] Login consome branding visual V1
- [x] Layout consome branding visual V1
- [x] Fallback seguro para logo no Login e Layout
- [x] Fallback seguro para cover no Login
- [x] Tema por cores aplicado sem ampliar escopo funcional
- [x] Login mantido em layout unico, sem variacao estrutural fora do escopo
- [x] Frontend sem erros de TypeScript
- [x] Build do frontend concluído
- [ ] Issue fechada

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-21T06:21:07Z | Entrega inicial registrada | fallback seguro de logo/capa entregue na issue |
| 2026-05-21T19:13:16Z | Ajuste de escopo no Login | remover layout em duas colunas por estar fora do escopo aprovado da #37 |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `apps/frontend/src/app/components/pages/Login.tsx` | cover opcional mantido como banner acima do card; removida variacao em duas colunas |
| `apps/frontend/src/app/components/Layout.tsx` | branding visual aplicado com tema e fallback de logo |
| `apps/frontend/src/app/tenant/useTenantBrandAssets.ts` | hooks de fallback seguro para logo e cover |

## Status das subtasks

- [x] Login consumindo `logo`, `coverImageUrl`, `brandName`, `tagline` e cores
- [x] Layout consumindo `logo`, `brandName` e cores
- [x] Fallback seguro para erros de asset
- [x] Revisao cruzada do Copilot concluida
- [ ] Fechamento da issue por decisao do owner

## Proximo passo imediato

Registrar devolutiva final da revisao na #37 e aguardar decisao do owner sobre fechamento.

## Restricoes ativas

- Nao variar layout por tenant nesta issue
- Nao abrir customizacao de menus
- Nao ampliar escopo para landing publica

## Checkpoints automaticos

- 2026-05-21T06:21:07Z | owner=copilot | last=Entrega inicial registrada na issue com fallback seguro de logo/capa e checks concluídos. | next=Revisao cruzada e validacao do escopo aprovado.
- 2026-05-21T19:13:16Z | owner=copilot | last=Login ajustado para manter layout unico e usar a cover como banner opcional sem variacao estrutural. | next=Registrar devolutiva final e aguardar decisao do owner.
