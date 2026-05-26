---
issue: "#28"
titulo: "[Frontend] Adaptar vendas ao core MVP"
owner_atual: copilot
iniciado_em: 2026-05-20
ultimo_checkpoint: 2026-05-20T20:57:17-03:00
---

## Escopo

**Entra:**
- Novos tipos MVP (`VendaMVP`, `VendaItemMVP`) em `api.ts` com IDs string (cuid).
- Helper `coreRequest` que aponta para `VITE_CORE_API_URL` e injeta `X-Tenant-ID`.
- Funções `api.getVendasMVP(tenantSlug)` e `api.registrarVendaMVP(tenantSlug, payload)`.
- `Sales.tsx` adaptado: sem `Combo`, sem `Vendedor`, sem paginação, usando `usuario_id` do usuário logado.
- `GET /api/produtos` adicionado no core para remover a dependência da seleção de produtos no backend legado.

**Nao entra:**
- Estoque, fechamento, produtos, relatórios, vendors — sem toque.
- Auth própria do core (usa token legado por ora).
- Endpoint `GET /api/produtos` no core (pendente).

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-20 | Adicionar `coreRequest` separado em vez de modificar `request` | Preserva todos os outros endpoints legacy sem risco de regressão |
| 2026-05-20 | `tenantSlug` derivado do campo `tenantSlug` da sessão, com fallback `"demo"` | Solução mínima — TODO centralizar quando core tiver auth própria |
| 2026-05-20 | Adicionar `GET /api/produtos` no core e consumir `getProdutosMVP()` no frontend | Remove a dependência de IDs de produto do legado e alinha a seleção ao schema do core |
| 2026-05-20 | Listagem exibe uma linha por venda (não por item) | Core não retorna `produto.nome` no include de `itens`; evita lookup impossível |
| 2026-05-20 | Filtro de data aplicado no cliente | `GET /api/vendas` do core não suporta query params de data ainda |
| 2026-05-20 | `usuario_id = String(user.id)` | IDs numéricos do legado convertidos para string; ver pendências de alinhamento |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `apps/frontend/src/app/api.ts` | Adicionado `CORE_API_BASE_URL`, tipos `VendaMVP`/`VendaItemMVP`, helper `coreRequest`, métodos `getVendasMVP` e `registrarVendaMVP` |
| `apps/frontend/src/app/components/pages/Sales.tsx` | Removidos: `Combo`, `Vendedor`, paginação, seletor de vendedor, lógica de combo. Adaptado para tipos MVP e contrato do core |
| `apps/core/src/produtos/*` | Adicionado endpoint mínimo `GET /api/produtos` tenant-scoped para seleção de produtos no frontend |

## O que foi simplificado / removido em Sales.tsx

- **Estado removido:** `combos`, `sellers`, `salesMeta`, `currentPage`, `vendedorId`, `selectedSeller`
- **Chamadas API removidas:** `api.getCombos()`, `api.getVendedores()`
- **Lógica removida:** agrupamento de itens de combo por `combo_id`, expansão de combo em linhas de produto, cálculo de `quantidadeCombo`
- **UI removida:** filtro de vendedor na barra de filtros, seletor de vendedor no modal, coluna "Vendedor" na tabela, paginação (botões Anterior/Próxima)
- **Tabela simplificada:** de 6 colunas (Produto, Qtd, Valor, Pagamento, Vendedor, Data) para 5 (Venda ID, Itens, Total, Pagamento, Data)
- **Import removido:** `salesCombo` utils (não necessário sem combos)

## Status das subtasks

- [x] Tipos MVP adicionados em `api.ts`
- [x] `coreRequest` implementado com `X-Tenant-ID`
- [x] `getVendasMVP` e `registrarVendaMVP` adicionados
- [x] `Sales.tsx` sem combos e vendedores
- [x] `npm run check:all` — passou (types + build)
- [x] `npm run test` (frontend) — 7/7 passou

## Pendencias e pontos de revisao para Copilot-Dev

1. **Alinhamento de `usuario_id`:** `String(user.id)` converte o ID numérico do legado. O core valida que `usuario_id` exista na tabela `Usuario` do tenant. Em produção, usuários precisam ser semeados no core com o mesmo ID (ou o core precisa de auth própria que emita `usuario_id` correto).

2. **`tenantSlug` na sessão:** Hardcoded como `"demo"` via fallback. Quando o core tiver auth própria, o `tenantSlug` deve vir do JWT ou da resposta de login e ser armazenado em `AuthUser`.

3. **Filtro de data no servidor:** `GET /api/vendas` do core não aceita `startDate`/`endDate`. O filtro está sendo aplicado no cliente sobre todos os registros. Para escalar, adicionar query params ao controller do core.

4. **Nome do produto na listagem:** Core inclui `itens` mas não inclui `produto { nome }`. Para mostrar nomes de produto na listagem, o `VendasService.listar()` precisa de `include: { itens: { include: { produto: true } } }`.

5. **`salesCombo.ts` e seus testes:** O utilitário e testes de combo permanecem no repositório pois são usados por outras partes (ou futura reativação). Não foram deletados intencionalmente.

## Proximo passo imediato

Fechar o alinhamento de identidade/tenant da sessão do frontend com o core para remover os fallbacks temporários (`tenantSlug` e `usuario_id` do legado).

## Restricoes ativas

- Não reintroduzir `Combo`, `combo_id`, `Vendedor` ou endpoints legados na trilha principal de venda.
- Não mexer em estoque, fechamento, vendors, relatórios.
- Não fazer commit desta issue.
