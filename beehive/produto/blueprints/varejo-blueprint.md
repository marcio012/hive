---
nicho: varejo
versao: 2.0.0
status: ativo
atualizado_em: 2026-05-21
responsavel: Claude - Arquiteto
---

# Blueprint: Varejo

## Objetivo de negócio

Permitir que operadores de varejo físico (lojas, mercearias, restaurantes) registrem vendas com agilidade, controlem estoque com visibilidade real e acompanhem a operação do dia sem depender de planilhas, cadernos ou memória.

## Nichos de referência (dossiês)

| Cliente | Cidade | Dor principal | Módulo crítico |
|---|---|---|---|
| Mercearia Boa Praça | Juiz de Fora - MG | estoque fraco, ruptura silenciosa, caixa no caderno | PDV + estoque |
| Restaurante Mesa Viva | Ribeirão Preto - SP | pedidos em canais diferentes, fechamento manual, sem visibilidade | pedidos + painel |

---

## Mapa de módulos

```
BLUEPRINT VAREJO
├── [CORE obrigatório]
│   ├── Autenticação JWT
│   ├── Tenant + Branding
│   ├── Produto CRUD
│   └── Venda + VendaItem
│
├── [COMPOSIÇÃO VAREJO — este blueprint]
│   ├── Frente de Vendas (PDV)
│   ├── Controle de Estoque
│   ├── Painel Operacional do Dia
│   └── Fechamento de Caixa
│
└── [EXTENSÃO opcional por nicho]
    └── Pedido por Mesa (Restaurante)
        ├── Número de mesa
        └── Painel de status de pedido
```

---

## Módulos ativados

### 1. Frente de Vendas (PDV)

**Objetivo:** registrar uma venda com o menor número de passos possível.  
**Usuários:** vendedor, caixa, atendente.

| Funcionalidade | Descrição |
|---|---|
| Busca de produto | por nome, SKU ou leitura de código |
| Composição de carrinho | adicionar/remover itens, ajustar quantidade |
| Aplicação de desconto | desconto por item ou por total |
| Finalização de venda | confirmar totais e registrar meios de pagamento |
| Cancelamento de item | remover item antes de finalizar |
| Cancelamento de venda | cancela venda após registro (admin) |

**Regra:** a venda só é registrada quando o operador confirmar o pagamento. Nenhuma venda fica em estado de rascunho persistido.

---

### 2. Controle de Estoque

**Objetivo:** manter visibilidade do quanto tem em estoque e alertar quando um produto está crítico.  
**Usuários:** gerente, dono.

| Funcionalidade | Descrição |
|---|---|
| Leitura de quantidade atual | exibe `quantidade` atual por produto |
| Alerta de criticidade | produto abaixo do estoque mínimo configurado |
| Baixa automática por venda | cada venda baixa quantidade dos produtos vendidos |
| Entrada manual de estoque | operador registra reposição sem nota fiscal |
| Painel de itens críticos | lista produtos abaixo do mínimo ordenados por urgência |

**Regra:** movimentação de estoque é sempre rastreada com `tipo` (venda, entrada, ajuste) e `usuário_responsável`. Não há estorno automático — cancelamento de venda gera movimento de ajuste reverso.

---

### 3. Painel Operacional do Dia

**Objetivo:** dar ao gerente uma visão consolidada da operação sem precisar rodar relatórios.  
**Usuários:** gerente, dono.

| Indicador | Cálculo |
|---|---|
| Total de vendas do dia | soma de `venda.total` com `data_hora >= hoje 00:00` |
| Quantidade de vendas | contagem de vendas do dia |
| Ticket médio | total / quantidade |
| Produtos mais vendidos | top 5 por `venda_item.quantidade` no dia |
| Itens críticos em estoque | produtos com `quantidade <= estoque_minimo` |
| Último fechamento de caixa | data e valor do último snapshot |

---

### 4. Fechamento de Caixa

**Objetivo:** gerar um snapshot financeiro do turno ou dia para conferência e arquivamento.  
**Usuários:** gerente, admin.

| Funcionalidade | Descrição |
|---|---|
| Fechamento por período | define início e fim do período (turno ou dia) |
| Consolidação de vendas | soma todas as vendas no período |
| Detalhamento por meio de pagamento | dinheiro, cartão crédito, débito, Pix |
| Registro do fechamento | persiste snapshot imutável com data, total e operador |
| Histórico de fechamentos | lista de fechamentos anteriores com totais |

**Regra:** fechamentos são imutáveis após registro. Um novo fechamento não apaga o anterior — gera um novo registro com período distinto.

---

### 5. Pedido por Mesa (extensão — Restaurante)

**Objetivo:** adicionar controle de mesa ao fluxo de vendas sem alterar o core.  
**Usuários:** garçom, caixa, cozinha.

| Funcionalidade | Descrição |
|---|---|
| Abertura de mesa | associar número de mesa a uma venda em andamento |
| Status de pedido | em preparo → pronto → entregue → fechado |
| Painel de cozinha | lista de pedidos em aberto por status, ordenados por hora |
| Transferência de mesa | mover itens de uma mesa para outra |
| Divisão de conta | partir total entre N pagantes |

**Regra:** "mesa" é uma extensão de `Venda` via campo opcional `mesa_numero`. O painel de cozinha lê vendas com status diferente de `fechada` agrupadas por mesa.

---

## Modelo de dados

### Entidades do core usadas por este blueprint

```
Tenant          → isolamento e branding (já existe)
Usuario         → auth e operador de caixa (já existe)
Produto         → catálogo com quantidade e estoque mínimo (já existe, precisa de evolução)
Venda           → cabeçalho da transação (já existe, parcial)
VendaItem       → linha de produto na venda (já existe)
```

### Entidades novas necessárias para este blueprint

```
┌─────────────────────────────────────────────────────┐
│  MOVIMENTO_ESTOQUE                                   │
│  id (cuid)                                           │
│  tenant_id          FK → Tenant                      │
│  produto_id         FK → Produto                     │
│  tipo               enum: venda | entrada | ajuste   │
│  quantidade         Int (positivo = entrada,         │
│                          negativo = saída)           │
│  referencia_id      opcional (FK → Venda para tipo   │
│                          "venda")                    │
│  usuario_id         FK → Usuario (responsável)       │
│  observacao         String?                          │
│  criado_em          DateTime                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  FECHAMENTO_CAIXA                                    │
│  id (cuid)                                           │
│  tenant_id          FK → Tenant                      │
│  usuario_id         FK → Usuario (operador)          │
│  periodo_inicio     DateTime                         │
│  periodo_fim        DateTime                         │
│  total_vendas       Float                            │
│  total_dinheiro     Float                            │
│  total_cartao_cred  Float                            │
│  total_cartao_deb   Float                            │
│  total_pix          Float                            │
│  qtd_vendas         Int                              │
│  criado_em          DateTime                         │
│  [UNIQUE: tenant_id + periodo_inicio + periodo_fim]  │
└─────────────────────────────────────────────────────┘
```

### Evolução necessária em entidades existentes

```
Produto:
  + estoque_minimo    Int?     → threshold de alerta crítico
  + categoria         String?  → agrupamento no catálogo
  + ativo             Boolean  → ocultar sem deletar

Venda:
  + mesa_numero       String?  → extensão para restaurante
  + status            enum: aberta | fechada | cancelada
  + meio_pagamento    enum: dinheiro | credito | debito | pix | misto
```

---

## Fluxos operacionais

### Fluxo de venda padrão (mercearia)

```
Operador abre frente de vendas
  ↓
Busca produto (nome / SKU)
  ↓
Adiciona ao carrinho → repete para todos os itens
  ↓
Confirma total → seleciona meio de pagamento
  ↓
Registra venda → POST /vendas
  ↓
Sistema gera VendaItems + baixa estoque (MovimentoEstoque tipo=venda)
  ↓
Painel do dia atualiza totais em tempo real
```

### Fluxo de pedido por mesa (restaurante)

```
Garçom abre mesa (número)
  ↓
Lança itens do pedido → venda com mesa_numero preenchido
  ↓
Pedido vai para painel da cozinha (status: em preparo)
  ↓
Cozinha atualiza status → pronto
  ↓
Garçom confirma entrega → entregue
  ↓
Cliente pede conta → garçom fecha mesa → fechada
  ↓
Caixa recebe pagamento e finaliza a venda
```

### Fluxo de fechamento de caixa

```
Gerente acessa fechamento
  ↓
Define período (turno/dia)
  ↓
Sistema consolida todas as vendas do período
  ↓
Exibe totais por meio de pagamento para conferência
  ↓
Gerente confirma → POST /fechamentos
  ↓
Snapshot persistido como imutável
```

---

## Endpoints necessários (API surface)

```
── Produtos ─────────────────────────────────────────────
GET    /api/produtos                → lista com filtro ativo/criticidade
POST   /api/produtos                → cadastrar produto
PUT    /api/produtos/:id            → editar produto
DELETE /api/produtos/:id            → inativar (soft delete)

── Vendas ───────────────────────────────────────────────
GET    /api/vendas                  → lista com filtros de data e status
POST   /api/vendas                  → registrar venda com itens
GET    /api/vendas/:id              → detalhe da venda
PATCH  /api/vendas/:id/cancelar     → cancelar venda (admin)

── Estoque ──────────────────────────────────────────────
GET    /api/estoque/criticos        → produtos abaixo do mínimo
POST   /api/estoque/entrada         → entrada manual de estoque
GET    /api/estoque/movimentos      → histórico de movimentos por produto

── Painel ───────────────────────────────────────────────
GET    /api/relatorios/painel-dia   → resumo operacional do dia

── Fechamento ───────────────────────────────────────────
GET    /api/fechamentos             → histórico de fechamentos
POST   /api/fechamentos             → registrar novo fechamento
GET    /api/fechamentos/:id         → detalhe de um fechamento

── Pedidos (extensão restaurante) ───────────────────────
GET    /api/pedidos/abertos         → painel da cozinha (vendas em aberto)
PATCH  /api/vendas/:id/status       → atualizar status do pedido
```

---

## Regras de negócio

| Gatilho | Condição | Ação |
|---|---|---|
| Venda registrada | qualquer | baixar estoque de cada produto vendido via MovimentoEstoque |
| Produto cadastrado ou editado | estoque_minimo definido | avaliar criticidade imediata |
| Quantidade de produto ≤ estoque_minimo | — | marcar `critico = true` no produto |
| Venda cancelada | status = fechada | gerar MovimentoEstoque tipo=ajuste, reverter quantidade |
| Fechamento criado | período sobreposto | retornar erro 409, não permitir duplicidade |
| Produto inativo | — | não aparecer na busca do PDV nem no carrinho |

---

## IA integrada

| Capacidade | Caso de uso | Entrada | Saída |
|---|---|---|---|
| Resumo diário | consolidar vendas, ticket médio e alertas para o gerente | vendas + estoque do dia | texto com destaques e riscos |
| Sugestão de reposição | recomendar quais produtos repor e em que quantidade | histórico de movimentos + criticidade | lista priorizada de reposição |
| Próxima ação | sugerir ação comercial ao gerente no fim do dia | painel do dia + histórico semanal | uma ação de alto impacto |
| Preenchimento assistido | sugerir categoria e unidade ao cadastrar produto | nome do produto | sugestões de campos |

---

## O que NÃO entra neste blueprint

- Emissão fiscal (NF-e, NFC-e, SAT, SEFAZ)
- Integração com balança ou leitor de código externo
- Marketplace ou integração com iFood/Rappi
- Programa de fidelidade ou pontuação
- Comanda eletrônica nativa para garçom (app mobile)
- Controle de ficha técnica de prato (custo por ingrediente)
- Delivery com rastreamento de entregador
- Multi-unidade (gestão de mais de uma filial)

---

## Dependências do core

| Módulo core | Status | Necessidade |
|---|---|---|
| Auth JWT | ❌ ausente | obrigatório — todas as rotas de operação |
| Tenant CRUD | ❌ ausente | obrigatório — criar tenant do cliente |
| Produto CRUD | ⚠️ parcial (só GET) | obrigatório — PDV e catálogo |
| Venda + VendaItem | ⚠️ parcial | obrigatório — registrar venda |
| Usuário CRUD | ❌ ausente | obrigatório — caixa, gerente, admin |

---

## Critério de aceite técnico

- [ ] Venda é registrada com todos os itens e baixa estoque automaticamente
- [ ] Produto marcado como crítico aparece em destaque no painel
- [ ] Fechamento de caixa gera snapshot imutável com totais por meio de pagamento
- [ ] Cancelamento de venda reverte o estoque via MovimentoEstoque
- [ ] Painel do dia reflete as vendas do dia atual sem refresh manual
- [ ] Extensão de mesa não altera comportamento do fluxo de venda padrão
- [ ] Todos os endpoints respeitam isolamento de tenant_id
- [ ] Produto inativo não aparece na busca do PDV

---

## Métricas de adoção por tenant

| Indicador | Meta | Janela |
|---|---|---|
| % de usuários usando PDV semanalmente | ≥ 80% | D+30 |
| % de operadores usando painel do dia | ≥ 60% | D+30 |
| % de closings via fechamento de caixa | ≥ 50% | D+30 |
| % de uso de ao menos 1 feature de IA | ≥ 30% | D+30 |

---

## Questões abertas

1. **Meio de pagamento "misto":** quando o cliente paga parte em dinheiro e parte em cartão, como registrar os dois meios em uma única venda? Campo múltiplo vs. dois registros de pagamento?

2. **Estoque negativo:** permitir venda mesmo com quantidade zero (modo emergência) ou bloquear? Configurável por tenant ou fixo no core?

3. **FechamentoCaixa no core ou no blueprint?** A entidade é genérica o suficiente para entrar no core MVP ou é especialização de varejo?

4. **Painel da cozinha:** é uma tela separada (modo kiosk) ou uma aba do painel gerencial? Impacta o design de frontend.
