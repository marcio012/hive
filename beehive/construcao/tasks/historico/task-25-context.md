---
issue: "#25"
titulo: "Issue 25 - Debate core vs nicho e modelo minimo de banco para MVP"
owner_atual: trio
iniciado_em: 2026-05-20
ultimo_checkpoint: 2026-05-20T20:13:36-03:00
---

## Escopo

**Entra:**
- revisar o que do schema atual/proposto e realmente core de plataforma;
- identificar entidades, campos e regras que parecem acoplados ao nicho atual;
- definir o minimo de documentacao de banco que o MVP precisa para andar com velocidade;
- propor um recorte pragmatico de modelo minimo para o MVP sem over-engineering.

**Nao entra:**
- reescrever o schema inteiro nesta rodada;
- implementar camada completa de dados ou migracoes finais;
- transformar o debate em purismo arquitetural;
- misturar este debate com fechamento de auth, strangler ou regras de nicho detalhadas.

## Perguntas centrais

1. Quais entidades sao realmente core de plataforma e quais parecem especializacao de nicho?
2. O core do MVP precisa carregar todas essas entidades desde ja ou pode operar com um subconjunto menor?
3. Qual documentacao de banco e obrigatoria para decidir o recorte do MVP com seguranca?
4. O que deve virar configuracao/extensao de nicho em vez de entidade base do core?

## Hipotese de trabalho

- Para ganhar velocidade no MVP, o core deve nascer com o **minimo estrutural reutilizavel**:
  - `Tenant`
  - `Usuario`
  - uma representacao de catalogo (`Produto` ou equivalente)
  - uma representacao de transacao (`Venda` e itens)
- Entidades mais carregadas de operacao de nicho devem ser debatidas antes de entrarem como base fixa do core.

## O que ainda precisamos planejar

- recorte entre **core de plataforma** e **modelo de nicho atual**;
- conjunto minimo de entidades do MVP;
- quais invariantes sao universais vs especificas do nicho;
- estrategia de documentacao de banco:
  - leitura do legado atual;
  - modelo-alvo minimo do core;
  - mapa do que fica fora do core inicial.

## Artefatos-base para o debate

- `docs/schema/MODELAGEM_ATUAL_BACKEND.md`
- `docs/schema/ARQUITETURA_ALVO_MULTI_TENANT.md`
- `apps/core/prisma/schema.prisma`

## Status das subtasks

- [x] Encerrar a #24 e mover o debate para a #25
- [x] Revisar entidades propostas sob a lente core vs nicho
- [x] Definir o recorte minimo de banco para o MVP
- [x] Decidir qual documentacao de banco precisa ficar viva
- [x] Converter o debate em proxima frente executavel

## Proximo passo imediato

Executar a issue derivada #26 para reduzir o schema do core ao recorte MVP aprovado.

## Estado final

- O debate da #25 consolidou o recorte MVP do core em `Tenant`, `Usuario`, `Produto`, `Venda` e `VendaItem`.
- `Cliente` nao entrou nesta rodada.
- `Vendedor` foi tratado como papel de `Usuario` para o MVP.
- `Combo`, `ComboItem`, `MovimentoEstoque`, `PerdaMercadoria` e `FechamentoCaixa` ficaram explicitamente adiados como segunda onda/nicho.
- A thread foi operacionalizada na issue #26.
