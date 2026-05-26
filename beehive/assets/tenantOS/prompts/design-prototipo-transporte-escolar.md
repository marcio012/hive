# Prompt de Design — Protótipo White Label: Tio Robério Transporte Escolar

**Uso:** colar este prompt diretamente no Claude Design  
**Objetivo:** protótipo completo para sistema de gestão de transporte escolar  
**Nicho:** transporte escolar privado — novo nicho, fora dos blueprints existentes

---

## PROMPT PARA O CLAUDE DESIGN

Crie um protótipo de interface web white-label para um sistema de gestão de transporte escolar chamado **"Tio Robério"**.

O produto deve ter personalidade — jovial, acolhedor e confiável. Os pais precisam sentir segurança, as crianças precisam sentir que é "o van do Tio Robério mesmo", e o operador precisa de clareza para não errar nenhum embarque.

---

### Identidade visual

- **Nome da marca:** Tio Robério
- **Tagline:** "Seu filho chega bem. Todo dia."
- **Logo:** van escolar estilizada em traço simples + nome "Tio Robério" em fonte arredondada
- **Cor primária:** `#F5A623` (amarelo-âmbar escolar — quente, não infantil)
- **Cor secundária:** `#1B3A6B` (azul naval profundo)
- **Cor de acento:** `#FF5E5B` (coral — alertas e destaques urgentes)
- **Fundo da página:** `#F8F9FC` (branco suave, quase cinza)
- **Fundo de cards:** `#FFFFFF` com sombra leve
- **Texto principal:** `#1A1A2E`
- **Texto secundário:** `#6B7280`
- **Item ativo no menu:** fundo `#FFF3DC` (amarelo bem claro), borda esquerda `#F5A623`, texto `#1B3A6B`

**Tom visual:** light mode amigável, clean e organizado — como o Waze ou o Duolingo se fossem um sistema de gestão. Arredondado, colorido com parcimônia, sem peso visual. Transmite: confiança + proximidade + profissionalismo descontraído.

---

### Telas a criar

---

#### Tela 1 — Login

- Fundo `#F8F9FC` com ilustração leve no canto (van escolar em traço mínimo, laranja)
- Logo da van + "Tio Robério" centralizado em fonte arredondada bold
- Tagline "Seu filho chega bem. Todo dia." em azul naval
- Card de formulário branco, sombra leve, cantos arredondados (16px)
- Campos: E-mail e Senha — bordas `#E5E7EB`, foco com borda `#F5A623`
- Botão "Entrar": fundo `#F5A623`, texto azul naval bold — hover mais escuro
- Link "Esqueceu sua senha?" em cinza

---

#### Tela 2 — Painel do Dia (Dashboard)

Sidebar esquerda + área principal.

**Sidebar:**
- Logo Tio Robério no topo com ícone de van
- Menu: Dashboard, Alunos, Rotas, Presença, Motoristas, Mensalidades, Configurações
- Item ativo: fundo amarelo claro `#FFF3DC`, borda esquerda amarelo âmbar, texto azul naval
- Contadores ao lado dos itens: ex: "Presença (47)" em badge cinza
- Rodapé: nome do operador + logout

**Área principal:**

- Título do dia: "Quinta-feira, 22 de maio — Hoje tem escola ✓"
- **Faixa de resumo do dia** (4 cards):
  - Alunos hoje: **47** (ícone mochila)
  - Já embarcados: **31** (ícone check — verde)
  - Aguardando: **16** (ícone relogio — amarelo)
  - Mensalidades em aberto: **5** (ícone alerta — coral)

- **Bloco: Rotas em andamento** (cards horizontais por rota):
  ```
  🚐 Rota 1 — Manhã — Região Centro
     Saída: 06:30  |  Capacidade: 15/15  |  Status: Em rota
     Motorista: Robério (o próprio)
     [Ver alunos desta rota]

  🚐 Rota 2 — Manhã — Região Norte
     Saída: 06:45  |  Capacidade: 12/14  |  Status: Aguardando saída
     Motorista: Eduardo
     [Ver alunos desta rota]
  ```
  Cada card: borda esquerda amarelo (em andamento) ou cinza (aguardando)

- **Bloco: Alertas do dia** (card com borda coral):
  - ⚠ Carlos Mendes — Falta confirmada pela mãe
  - ⚠ 5 mensalidades vencem hoje

---

#### Tela 3 — Alunos

- Busca + filtro por rota + botão "Novo Aluno" em amarelo âmbar
- **Lista de alunos** (tabela compacta e limpa):

  | Avatar | Nome | Escola | Rota | Ponto de embarque | Responsável | Status |
  |---|---|---|---|---|---|---|
  | 🔵 M | Mateus Oliveira | EMEF João XXIII | Rota 1 | Rua das Flores, 45 | Ana Oliveira (Mãe) | 🟢 Ativo |
  | 🟠 J | Julia Santos | Col. São Paulo | Rota 2 | Av. Central, 120 | Paulo Santos (Pai) | 🟢 Ativo |
  | 🟣 B | Beatriz Alves | EMEF João XXIII | Rota 1 | Rua das Flores, 78 | Carla Alves (Mãe) | 🟡 Falta hoje |

- Clicar no aluno abre detalhe: dados pessoais, responsável, rota, histórico de presença do mês (calendário com bolinhas verde/vermelho/cinza), mensalidades

---

#### Tela 4 — Rotas

- Cards de rota com mapa minimalista (retângulo estilizado com paradas marcadas)
- Cada card mostra:
  - Nome da rota + turno (Manhã / Tarde / Integral)
  - Número de alunos na rota vs. capacidade da van
  - Horário de saída
  - Motorista responsável
  - Paradas em ordem: "Rua A → Escola B → Rua C → Rua D"
  - Botões: "Ver alunos" | "Editar rota"

- **Rota 1 — Manhã (Centro):**
  - 15 alunos / 15 vagas | Saída: 06:30 | Motorista: Robério
  - Paradas: Praça Central → R. das Flores → Av. Brasil → Escola EMEF João XXIII

- **Rota 2 — Manhã (Norte):**
  - 12 alunos / 14 vagas | Saída: 06:45 | Motorista: Eduardo
  - Paradas: R. Ipê → Condomínio Serrano → Colégio São Paulo

- **Rota 3 — Tarde (Retorno Geral):**
  - 27 alunos / 30 vagas | Saída: 11:45 | Motorista: Robério + Eduardo
  - Retorno das duas escolas

---

#### Tela 5 — Presença do Dia

Layout central — esta é a tela mais usada no dia a dia.

- Seletor de rota no topo: "Rota 1 — Manhã (Centro)" com dropdown
- Abaixo: data e horário de saída previsto
- **Lista de presença por ordem de embarque:**

  Cada linha da lista:
  - Avatar colorido com inicial
  - Nome do aluno + endereço de embarque
  - Escola destino
  - Dois botões grandes lado a lado:
    - ✓ **Embarcou** — verde, borda arredondada
    - ✗ **Faltou** — cinza claro, borda arredondada
  - Após marcar: linha fica verde (embarcou) ou cinza tênue com risco (faltou)

  Exemplos:
  ```
  [M] Mateus Oliveira — Rua das Flores, 45 — EMEF João XXIII
      [✓ Embarcou] [✗ Faltou]                            → marcado: ✓ verde

  [J] Julia Santos — Av. Central, 120 — Col. São Paulo
      [✓ Embarcou] [✗ Faltou]                            → não marcado ainda

  [B] Beatriz Alves — Rua das Flores, 78 — EMEF João XXIII
      [✓ Embarcou] [✗ Faltou]                            → marcado: ✗ cinza
  ```

- Barra de progresso no topo da lista: "31 de 47 marcados" com amarelo preenchendo
- Botão "Encerrar chamada" aparece quando todos forem marcados

---

#### Tela 6 — Mensalidades

- Resumo do mês:
  - Total a receber: **R$ 6.580** | Recebido: **R$ 5.230** (verde) | Pendente: **R$ 1.350** (amarelo) | Atrasado: **R$ 0** (cinza)
- Tabela de alunos com status de pagamento:

  | Aluno | Plano | Vencimento | Valor | Status | Ação |
  |---|---|---|---|---|---|
  | Mateus Oliveira | Mensal | 01/06 | R$ 280 | 🟢 Pago | Ver comprovante |
  | Julia Santos | Mensal | 01/06 | R$ 280 | 🟡 Pendente | Enviar lembrete |
  | Pedro Lima | Mensal | 25/05 | R$ 280 | 🔴 Atrasado 3 dias | Cobrar |

- Filtros: Todos | Pagos | Pendentes | Atrasados
- Botão "Registrar Pagamento" — abre modal simples: aluno + valor + data + forma (Pix, dinheiro, transferência)

---

#### Tela 7 — Novo Aluno (modal/drawer)

- Formulário em 3 seções colapsáveis:

  **Dados do aluno:**
  - Nome completo
  - Data de nascimento
  - Escola / turno (manhã / tarde / integral)

  **Responsável:**
  - Nome + grau de parentesco
  - Telefone principal (WhatsApp)
  - Telefone secundário (opcional)

  **Logística:**
  - Rota (dropdown das rotas cadastradas)
  - Endereço de embarque
  - Ponto de referência (opcional)
  - Valor mensal
  - Dia de vencimento

- Botão "Cadastrar Aluno" em amarelo âmbar

---

### Especificações de UI

- **Fonte:** Nunito ou Rounded Mplus 1c — fontes arredondadas, amigáveis, legíveis
- **Border-radius:** 16px em cards grandes, 12px em cards menores, 50px em botões de ação (pill)
- **Sombra dos cards:** `box-shadow: 0 2px 8px rgba(27,58,107,0.08)` — sutil e azulada
- **Sidebar:** fundo `#FFFFFF`, borda direita `#E5E7EB`, 240px de largura
- **Botões de presença:** grandes o suficiente para toque fácil (mínimo 44px altura)
- **Tabelas:** linhas com hover `#FFF8EC` (amarelo quase branco), sem bordas pesadas
- **Badges de status:** pílulas com fundo colorido suave (não saturado demais)
- **Ícones:** estilo outline amigável — Lucide ou similar
- **Modo:** light mode — clareza e leveza são essenciais para uso no dia a dia
- **Responsividade:** desktop first, mas Tela 5 (Presença) deve funcionar bem em tablet — operador usa dentro da van

---

### Comportamento do white-label

Toda a interface é exclusivamente do "Tio Robério". O operador sente que tem um produto próprio, feito para o seu negócio — não uma ferramenta genérica adaptada.

A interface transmite: **"eu cuido das crianças dos meus clientes com a mesma atenção que colocaria no meu próprio filho."**
