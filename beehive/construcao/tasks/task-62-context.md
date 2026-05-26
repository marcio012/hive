# Task #62 — Pedido por Mesa

## Status: implementado, layout pendente de refinamento

## O que foi feito (2026-05-22)

### Backend ✅
- Migration: `mesa_numero String?` e `status_pedido String?` adicionados ao model `Venda`
- Migration aplicada: `20260522125240_add_mesa_pedido_to_venda`
- DTOs novos: `AssociarMesaDto`, `AtualizarStatusPedidoDto`
- `CriarVendaDto` atualizado com campo opcional `mesa_numero`
- `VendasService`: métodos `associarMesa`, `atualizarStatusPedido`, `listarCozinha`, `listarMesas`
- `VendasController`: endpoints `GET /mesas`, `GET /cozinha`, `PATCH /:id/mesa`, `PATCH /:id/status-pedido`
- `VENDA_SELECT` atualizado com os novos campos

### Frontend ✅ (funcional, layout a refinar)
- `api.ts`: tipo `VendaMVP` atualizado, `StatusPedido` exportado, novos métodos `listarMesasMVP`, `listarCozinhaMVP`, `associarMesaMVP`, `atualizarStatusPedidoMVP`, `registrarVendaMVP` com `mesa_numero` opcional, `RequestMethod` atualizado com `"PATCH"`
- `Mesas.tsx`: grid 12 mesas, modal abrir mesa, painel lateral com transições de status
- `Cozinha.tsx`: painel cozinha com polling 30s, colunas por status, botões de avanço
- `routes.tsx`: rotas `/app/mesas` e `/app/cozinha` adicionadas
- `Layout.tsx`: itens "Mesas" e "Cozinha" adicionados ao menu lateral
- `api.ts`: `canAccessPath` atualizado para admin e vendedor

## Próximo passo: refinamento visual

O Márcio quer melhorar o layout das telas. Pontos a revisar:
- Grid de mesas (tamanho dos cards, ícones, informações)
- Modal de abertura de mesa
- Painel lateral da mesa ativa
- Painel da cozinha (cards, colunas)

## Fluxo de negócio implementado

```
Garçom → /app/mesas → clica mesa livre → modal com itens → "Abrir mesa"
→ mesa fica azul "Aberto" → painel lateral aparece
→ "Enviar para cozinha" → mesa fica amarela "Preparando"
→ Cozinha vê em /app/cozinha → "Iniciar preparo" → "Marcar entregue"
→ Caixa fecha em /app/mesas → "Fechar mesa" → mesa volta a Livre
```

## Arquivos relevantes
- `apps/core/src/vendas/vendas.controller.ts`
- `apps/core/src/vendas/vendas.service.ts`
- `apps/core/src/vendas/dto/associar-mesa.dto.ts`
- `apps/core/src/vendas/dto/atualizar-status-pedido.dto.ts`
- `apps/core/prisma/schema.prisma`
- `apps/frontend/src/app/components/pages/Mesas.tsx`
- `apps/frontend/src/app/components/pages/Cozinha.tsx`
- `apps/frontend/src/app/routes.tsx`
- `apps/frontend/src/app/components/Layout.tsx`
- `apps/frontend/src/app/api.ts`
