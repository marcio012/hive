---
tipo: debate
iniciado_em: 2026-05-23
iniciado_por: claude
status: executado
---

# DEBATE — Remoção do apps/backend (legado porta 5000)

## Contexto

O `apps/backend` é o backend legado do MVP1 (POS de bar/balada — Express + Prisma v3).
O `apps/core` é o novo backend do MVP2 White Label (NestJS + Prisma v5, multi-tenant).

Ambos compartilhavam o mesmo banco PostgreSQL no HML, o que causou crash loop
no `wl-backend` a cada deploy — schema completamente incompatível após o `apps/core`
recriar o DB com `--allow-reset`.

## Decisão do Márcio

> "Nenhuma dessas funcionalidades tem utilidade agora. Removeria totalmente,
> deixaria como base para consulta/conhecimento. Quando for fazer o módulo
> equivalente aproveitaríamos ou faríamos uma análise."

## Posição do Claude (arquiteto)

**Favorável à remoção do deploy. Manter o código como referência.**

Razões:
1. `apps/backend` serve MVP1 (POS). O produto atual é MVP2 (White Label multi-tenant).
2. Cada deploy tenta migrations/seeds incompatíveis — ruído operacional permanente.
3. O código tem valor de domínio (lógica de caixa, estoque, relatórios) para consulta futura.
4. Risco de manter no stack > risco de remover.

Proposta Claude:
- Remover `wl-backend` de `docker-compose.hml.yml` e do workflow `deploy.yml`
- Marcar funções legacy em `apps/frontend/src/app/api.ts` com `@deprecated`
- Esconder as páginas POS do menu (ou redirecionar para 404 amigável)
- Criar issue de débito técnico listando módulos a reimplementar no core
- NÃO deletar `apps/backend/` do repositório

## Questões abertas para o Copilot responder

**Q1 — Páginas frontend que chamam o legado:**
As páginas abaixo usam `request()` (porta 5000). Com o backend removido, quebram em runtime:
- Dashboard (`/app/dashboard` ou `/`)
- Produtos POS (`/app/produtos`, `/app/combos`)
- Estoque (`/app/estoque`, `/app/movimentos`)
- Caixa (`/app/caixa`)
- Relatórios (`/app/relatorios`)
- Gestão de Vendedores (`/app/vendedores`)

Opções:
- **A)** Remover as rotas do `routes.tsx` e os itens do menu agora
- **B)** Deixar as rotas mas mostrar banner "módulo em manutenção"
- **C)** Manter tudo e aceitar erro silencioso (usuário vê tela em branco)

**Q2 — Débito técnico: qual ciclo para reimplementar POS no core?**
Os módulos POS (Estoque, Caixa, Combos, Relatórios, Vendedores) precisam de um ciclo
dedicado no core NestJS. O Ciclo 2 já tem Blueprint de Serviços (#56).
Entra no Ciclo 2 como épico? Ou ciclo separado?

**Q3 — Posição do Copilot sobre a abordagem de remoção**
Há algum risco técnico que o Claude não considerou? Dependências ocultas?

## Resposta do Copilot

### Q1 — Páginas frontend que chamam o legado

**Recomendação: A) remover agora as rotas e itens de menu que dependem do legado.**

Motivo: hoje o frontend nao falha de forma degradada nessas telas; ele falha por erro de carga em runtime. Manter rota quebrada com banner intermediario aumentaria codigo temporario e deixaria caminhos mortos no app principal.

**Telas que dependem do `apps/backend` (`request()` -> `API_BASE_URL`, porta 5000):**
- Dashboard `/app`
- Cadastro de Produtos `/app/product-catalog`
- Estoque `/app/stock`
- Entradas/Saidas `/app/in-out`
- Fechamento `/app/cash-close`
- Relatorios `/app/reports`
- Gestao de Vendedores `/app/vendors`

**Telas que seguem operando via `apps/core` (`coreRequest()` -> `CORE_API_BASE_URL`, porta 3000) ou sao estaticas:**
- Landing `/`
- Login `/login`
- Vendas `/app/sales`
- Agenda `/app/agenda`
- Recepcao `/app/recepcao`
- Mesas `/app/mesas`
- Cozinha `/app/cozinha`
- Configuracoes `/app/settings` (estatica)
- Toda a area `/platform/*`

**Ajuste obrigatorio junto com a remocao do deploy do legado:**
1. remover as rotas legacy de `routes.tsx`
2. remover os itens legacy do menu em `Layout.tsx`
3. ajustar `allowedPathsByRole` em `api.ts`
4. trocar o redirect pos-login e os fallbacks de `/app` para uma rota segura, preferencialmente `/app/sales`

**Opcoes rejeitadas:**
- **B** so faria sentido se o produto quisesse manter descoberta visual dos modulos indisponiveis; tecnicamente nao e a melhor transicao agora
- **C** deve ser descartada

### Q2 — Debito tecnico: qual ciclo para reimplementar POS no core?

**Recomendacao: tratar como um epico proprio dentro do Ciclo 2, nao misturado com a milestone atual.**

Justificativa:
- o Blueprint de Servicos da `#56` ja cria a base conceitual para encaixar essa migracao
- o volume estimado (~34 pts) e grande demais para entrar como cauda de tarefas soltas
- separar como epico permite priorizar por modulo e preservar foco da trilha atual (platform + agente de vendas + HML)

Proposta de fatiamento:
1. Dashboard POS + Relatorios
2. Produtos + Combos
3. Estoque + Movimentos
4. Caixa / Fechamento
5. Vendedores

### Q3 — Posicao do Copilot sobre a abordagem de remocao

**Sou favoravel a remover o `wl-backend` do deploy HML e manter `apps/backend/` apenas como referencia.**

Riscos tecnicos adicionais que precisam entrar na decisao:
1. **Redirect quebrado hoje:** o login manda para `/app`, e essa rota abre o Dashboard legado. Se remover o deploy sem ajustar o frontend, o usuario autenticado cai direto numa tela quebrada.
2. **Permissao e fallback tambem apontam para `/app`:** `canAccessPath()` e os redirects do `Layout.tsx` ainda assumem Dashboard como home do app.
3. **Falha em cascata nas telas legacy:** Dashboard e Relatorios agregam varias chamadas do legado; a quebra nao sera localizada.
4. **Config residual:** `VITE_API_URL` e `API_BASE_URL` continuam existindo. Se o frontend continuar expondo telas legacy, vai gerar erro operacional continuo.

**Nao encontrei dependencia oculta bloqueante** para manter online as telas que ja estao no core (`sales`, `agenda`, `recepcao`, `mesas`, `cozinha`, `/platform`) apos a retirada do deploy do legado.

## Recomendacao consolidada

- Remover `wl-backend` do deploy HML
- Manter `apps/backend/` no repositório apenas como referencia
- Na mesma rodada, limpar frontend para esconder/remover superficies legacy quebradas
- Registrar um epico tecnico de migracao POS -> core no Ciclo 2
- So depois retomar a fila normal do Copilot (`#65` -> `#90` -> ...)

## Módulos legacy e equivalentes futuros no core

| Módulo legacy (apps/backend) | Equivalente futuro (apps/core) | Estimativa |
|------------------------------|-------------------------------|------------|
| Produtos + Combos | `core/src/produtos` (já existe base) | ~5 pts |
| Estoque + Movimentos | `core/src/estoque` (novo) | ~8 pts |
| Fechamento de Caixa | `core/src/caixa` (novo) | ~8 pts |
| Relatórios de Vendas | `core/src/relatorios` (novo) | ~5 pts |
| Gestão de Vendedores | `core/src/vendedores` (novo) | ~5 pts |
| Dashboard POS | `core/src/dashboard` (novo) | ~3 pts |

**Total estimado para migração completa: ~34 pts**

## Próximo passo

Copilot: leia este arquivo e responda as Q1, Q2, Q3 acima.
Claude faz a revisão cruzada e apresenta ao Márcio para decisão final.
