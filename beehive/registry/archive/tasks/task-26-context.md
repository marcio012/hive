---
issue: "#26"
titulo: "[Core] Enxugar schema do core para recorte MVP"
owner_atual: Claude - Dev
iniciado_em: 2026-05-21
ultimo_checkpoint: 2026-05-21
status: concluido
---

## Escopo

Reduzir o schema `apps/core/prisma/schema.prisma` ao nucleo minimo aprovado no debate da issue #25,
garantindo que o core MVP nao carregue entidades de nicho que atrasem a velocidade de entrega.

**Entra:**
- ajustar `apps/core/prisma/schema.prisma` para o recorte MVP;
- colapsar `Vendedor` em `Usuario` (`Venda` passa a referenciar `usuario_id`);
- remover entidades adiadas do schema e do modelo `Tenant`;
- atualizar documentacao de arquitetura do core;
- registrar esta frente em `task-26-context.md`.

**Nao entra:**
- migracao de banco (schema novo, sem DB de destino ainda);
- implementacao de servicos ou controllers;
- introducao de `Cliente` ou qualquer outra entidade nao aprovada;
- alteracoes no legado ou em outros apps.

## Decisoes adotadas

| Decisao | Racional |
| --- | --- |
| Manter: `Tenant`, `Usuario`, `Produto`, `Venda`, `VendaItem` | nucleo minimo estrutural aprovado |
| Remover: `Vendedor`, `Combo`, `ComboItem`, `MovimentoEstoque`, `PerdaMercadoria`, `FechamentoCaixa` | entidades de nicho ou segunda onda |
| `Venda.usuario_id` em vez de `vendedor_id` | Vendedor colapsado em Usuario |
| `Usuario.tipo` preservado para expressar papel operacional (ex: "operador", "admin") | alternativa simples ao modelo anterior |
| `VendaItem.combo_id` removido | sem Combo no MVP, campo orphan eliminado |
| Regra de evolucao: entidade nova so entra com caso de uso real | principio do recorte |

## Criterios de aceitacao

- [x] `prisma validate` passa sem erros
- [x] `prisma generate` conclui sem erros
- [x] schema contem exatamente 5 modelos: Tenant, Usuario, Produto, Venda, VendaItem
- [x] nenhuma referencia a Vendedor, Combo, MovimentoEstoque, PerdaMercadoria, FechamentoCaixa
- [x] `Venda` referencia `usuario_id` → `Usuario`
- [x] `tenant_id` presente em todos os modelos operacionais
- [x] documentacao atualizada

## Arquivos modificados

| Arquivo | Tipo de alteracao |
| --- | --- |
| `apps/core/prisma/schema.prisma` | schema reduzido ao nucleo MVP |
| `docs/schema/ARQUITETURA_ALVO_MULTI_TENANT.md` | tabela de entidades atualizada com status MVP / adiado |
| `ai/construcao/tasks/task-26-context.md` | criado (este arquivo) |

## Estado atual

**Concluido.** Schema validado e gerado com sucesso. Documentacao atualizada.

## Estado final

- A issue #26 foi aprovada pelo Márcio para seguir.
- O core MVP ficou reduzido ao recorte aprovado no debate da #25.
- O trabalho foi consolidado no commit `fd258b2`.

## Pontos de atencao para revisao

1. **Migracao nao aplicada:** o schema foi atualizado mas nenhuma migration foi criada ou aplicada.
   Quando houver banco-alvo do core, sera necessario rodar `prisma migrate dev`.

2. **Estoque via campo `quantidade` em `Produto`:** com `MovimentoEstoque` adiado, o controle de
   estoque no MVP e puramente via campo `quantidade`. Nao ha trilha auditavel de movimentacoes nesta fase.

3. **`Usuario.tipo` como papel operacional:** o campo `tipo` (string) e suficiente para o MVP, mas
   deve ser formalizado (enum ou tabela de roles) antes da segunda onda se o produto crescer.

4. **Segunda onda:** quando `Combo`, `MovimentoEstoque`, `PerdaMercadoria` ou `FechamentoCaixa`
   forem reintroduzidos, exigir caso de uso real documentado antes de incluir no schema.
