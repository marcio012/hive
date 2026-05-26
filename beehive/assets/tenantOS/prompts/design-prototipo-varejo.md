# Prompt de Design — Protótipo White Label: Nicho Varejo

**Uso:** colar este prompt diretamente no Claude Design (claude.ai/design ou artefato interativo)  
**Objetivo:** gerar um protótipo de alta fidelidade da interface white-label para o nicho de varejo  
**Referência técnica:** `ai/produto/blueprints/varejo-blueprint.md`

---

## PROMPT PARA O CLAUDE DESIGN

Crie um protótipo de interface web white-label para um sistema de gestão de varejo chamado **"Boa Praça"** — uma mercearia de bairro.

### Identidade visual

Use rigorosamente esta paleta:
- **Cor primária:** `#CC0000` (vermelho vibrante)
- **Cor secundária:** `#FFD700` (amarelo âmbar)
- **Fundo da página:** `#FFFFFF` (branco)
- **Fundo de painéis/cards:** `#F9F9F9` (cinza muito claro)
- **Texto principal:** `#1A1A1A` (quase preto)
- **Texto secundário:** `#666666` (cinza médio)
- **Texto sobre primária:** `#FFFFFF` (branco)

**Logo:** use as iniciais "BP" em círculo vermelho com borda dourada  
**Nome da marca:** "Boa Praça"  
**Tagline:** "Sua mercearia de sempre, mais organizada"  
**Tom visual:** vibrante, próximo, comercial — transmite promoção e agilidade

---

### Telas a criar (navegação em abas ou sidebar)

#### Tela 1 — Login
- Logo BP centralizado no topo
- Nome "Boa Praça" e tagline abaixo do logo
- Card de formulário com campos: E-mail e Senha
- Botão "Entrar" na cor primária (#CC0000)
- Fundo branco, sem imagem de capa (mercearia simples)
- Link "Esqueceu sua senha?" em cinza

#### Tela 2 — Painel do Dia (Dashboard)
- Header com logo BP pequeno + nome "Boa Praça" + nome do usuário
- Menu lateral com itens: Dashboard, Vendas, Estoque, Produtos, Fechamento, Configurações
- Item ativo com fundo vermelho (#CC0000) e texto branco
- **Cards de indicadores do dia** (linha horizontal):
  - Total de vendas: R$ 1.847,50 (ícone carteira)
  - Qtd. vendas: 43 (ícone carrinho)
  - Ticket médio: R$ 42,96 (ícone gráfico)
  - Itens críticos: 3 (ícone alerta em amarelo)
- **Seção: Produtos mais vendidos hoje** (tabela simples: nome, qtd, total)
  - Arroz 5kg — 12 unid — R$ 298,80
  - Feijão 1kg — 9 unid — R$ 89,91
  - Leite Integral — 18 unid — R$ 107,82
- **Seção: Itens com estoque crítico** (alerta em card com borda amarela)
  - Açúcar 1kg — 2 unidades restantes (mínimo: 10)
  - Óleo de Soja — 1 unidade restante (mínimo: 8)
  - Farinha de Trigo — 3 unidades restantes (mínimo: 12)

#### Tela 3 — Frente de Vendas (PDV)
- Layout em duas colunas: busca/catálogo à esquerda, carrinho à direita
- **Coluna esquerda:**
  - Campo de busca de produto (placeholder: "Buscar por nome ou código")
  - Grade de produtos como cards compactos: nome + preço + botão "+"
  - Exemplos: Coca-Cola 2L R$9,99 | Pão de Forma R$7,50 | Café 500g R$18,90
- **Coluna direita (carrinho):**
  - Lista de itens adicionados com quantidade editável e subtotal
  - Linha de total em destaque
  - Seletor de meio de pagamento: Dinheiro | Débito | Crédito | Pix (botões)
  - Botão grande "Finalizar Venda" na cor primária (#CC0000)
  - Botão secundário "Cancelar" em cinza

#### Tela 4 — Estoque
- Tabela de produtos com colunas: Nome | Categoria | Qtd. atual | Estoque mín. | Status
- Status visual: 
  - Verde "OK" quando quantidade > mínimo
  - Amarelo "Atenção" quando quantidade ≤ mínimo × 1.5
  - Vermelho "Crítico" quando quantidade ≤ mínimo
- Botão "Registrar Entrada" em vermelho no topo
- Filtro por status: Todos | OK | Atenção | Crítico

---

### Especificações de UI

- **Fonte:** Inter ou similar — moderna e legível
- **Border-radius:** 8px em cards, 6px em botões
- **Sombra dos cards:** leve, `box-shadow: 0 1px 4px rgba(0,0,0,0.08)`
- **Sidebar:** fundo branco com borda direita sutil, itens com ícone + label
- **Tabelas:** linhas alternadas em branco e #F9F9F9, sem bordas pesadas
- **Modo:** claro (light mode)
- **Responsividade:** desktop first (1280px), mas sidebar colapsável em telas menores

---

### Comportamento do white-label

O sistema usa a identidade da "Boa Praça" em toda a interface. Não há nenhuma menção à plataforma base. O produto parece ter sido feito exclusivamente para esta mercearia.

---

### Variação alternativa — Restaurante Mesa Viva

Se quiser gerar uma segunda versão com outra identidade visual do mesmo nicho:

- **Nome:** Mesa Viva
- **Tagline:** "Sabor e organização em cada mesa"
- **Cor primária:** `#2D5016` (verde escuro)
- **Cor secundária:** `#C84B31` (terracota)
- **Fundo:** `#FDF6EE` (creme claro)
- **Texto principal:** `#1C1C1C`
- **Texto secundário:** `#5A5A5A`
- **Tom visual:** artesanal, acolhedor, casual
- **Diferença de tela:** substituir Tela 3 (PDV) por **Tela de Pedidos por Mesa**:
  - Grade de mesas (4×3): cada mesa mostra número, status (livre/ocupada/aguardando) e tempo aberto
  - Mesas ocupadas com borda terracota, livres com borda verde escura
  - Clicar em mesa abre painel de pedido com itens e status (em preparo / pronto / entregue)
