# Prompt de Design — Protótipo White Label: Nicho Serviços

**Uso:** colar este prompt diretamente no Claude Design (claude.ai/design ou artefato interativo)  
**Objetivo:** gerar um protótipo de alta fidelidade da interface white-label para o nicho de serviços  
**Referência técnica:** `ai/produto/blueprints/servicos-blueprint.md`

---

## PROMPT PARA O CLAUDE DESIGN

Crie um protótipo de interface web white-label para um sistema de gestão de salão de beleza chamado **"Studio Bella Corte"**.

### Identidade visual

Use rigorosamente esta paleta:
- **Cor primária:** `#1A1A1A` (preto profundo)
- **Cor secundária:** `#D4AF37` (dourado)
- **Fundo da página:** `#0D0D0D` (preto suave)
- **Fundo de painéis/cards:** `#1E1E1E` (cinza escuro)
- **Texto principal:** `#F5F5F5` (branco quente)
- **Texto secundário:** `#A0A0A0` (cinza claro)
- **Texto sobre primária:** `#D4AF37` (dourado — sobre o preto)
- **Borda de destaque:** `#D4AF37` (dourado em elementos ativos)

**Logo:** iniciais "BC" em serif elegante, dourado sobre círculo preto  
**Nome da marca:** "Studio Bella Corte"  
**Tagline:** "Seu estilo, com a nossa dedicação"  
**Tom visual:** premium, elegante, moderno — transmite profissionalismo e cuidado

---

### Telas a criar (navegação em sidebar)

#### Tela 1 — Login
- Fundo preto com detalhe dourado sutil (linha ou gradiente leve na borda)
- Logo BC centralizado, dourado
- Nome "Studio Bella Corte" em fonte serif dourada
- Tagline em cinza claro abaixo
- Card de formulário com fundo `#1E1E1E`, bordas `rgba(212,175,55,0.3)`
- Campos: E-mail (ícone usuário) e Senha (ícone cadeado) — texto branco
- Botão "Entrar" com fundo dourado `#D4AF37` e texto preto
- Link "Esqueceu sua senha?" em cinza

#### Tela 2 — Painel do Dia (Recepção)
- Sidebar escura com logo BC pequeno no topo
- Menu: Dashboard, Agenda, Clientes, Serviços, Financeiro, Configurações
- Item ativo com borda esquerda dourada e texto dourado
- **Cabeçalho do dia:** "Quinta-feira, 22 de maio · 9 agendamentos hoje"
- **Cards de indicadores** (linha horizontal):
  - Agendados: 9 (ícone calendário)
  - Confirmados: 6 (ícone check em verde)
  - Presentes: 2 (ícone usuário em dourado)
  - Ausentes: 0 (ícone X em cinza)
- **Seção: Agenda do dia** — timeline vertical por horário:
  - 09:00 — Ana Beatriz — Escova progressiva — Camila (profissional) — 🟡 confirmado
  - 10:30 — Fernanda Luz — Coloração — Ricardo — 🟢 presente
  - 11:00 — Marcia Alves — Corte feminino — Camila — ⚪ agendado
  - 13:00 — BLOQUEADO — Almoço (Camila)
  - 14:00 — Julia Santos — Hidratação — Ricardo — ⚪ agendado
- Cada linha com botões de ação: "Confirmar" | "Presente" | "Ausente"

#### Tela 3 — Agenda Semanal
- Grade horária semanal (segunda a sábado, 08h às 20h)
- Cada agendamento como bloco colorido na grade:
  - Azul suave: agendado
  - Dourado: confirmado
  - Verde: presente/concluído
  - Cinza: cancelado/ausente
- Bloqueios de agenda como faixas cinzas hachuradas
- Filtro por profissional (dropdown): Todos | Camila | Ricardo
- Botão "+ Novo Agendamento" em dourado no topo direito
- Ao clicar em um bloco: popover com nome do cliente, serviço, horário e botões de ação

#### Tela 4 — Novo Agendamento (modal ou drawer lateral)
- Título "Novo Agendamento" com linha dourada abaixo
- Campos em sequência:
  1. **Cliente** — busca com autocomplete (digitar nome exibe sugestões)
     - Opção "+ Cadastrar novo cliente" ao não encontrar
  2. **Serviço** — lista com duração: Corte (45 min) | Escova (60 min) | Coloração (120 min) | Hidratação (90 min)
  3. **Profissional** — Camila | Ricardo
  4. **Data** — date picker com destaque nos dias com disponibilidade
  5. **Horário** — botões de horários disponíveis (vermelho = indisponível, dourado = disponível)
  6. **Encaixe?** — toggle "Sim / Não"
- Botão "Confirmar Agendamento" em dourado
- Botão "Cancelar" em cinza

#### Tela 5 — Clientes sem Retorno
- Título "Retorno Pendente" com contador: "7 clientes aguardando"
- Tabela com colunas: Cliente | Último serviço | Há quanto tempo | Serviço esperado | Ação
  - Patricia Lima | Coloração | 38 dias | Coloração (esperado: 35 dias) | [Agendar]
  - Renata Moura | Corte feminino | 42 dias | Corte (esperado: 30 dias) | [Agendar]
  - Sonia Teixeira | Hidratação | 31 dias | Hidratação (esperado: 30 dias) | [Agendar]
- Linha com atraso em vermelho suave
- Botão "Agendar" abre o modal de novo agendamento pré-preenchido com o cliente

---

### Especificações de UI

- **Fonte:** Inter para corpo; Playfair Display ou similar serif para títulos e nome da marca
- **Border-radius:** 10px em cards, 6px em botões e campos
- **Sombra dos cards:** `box-shadow: 0 2px 8px rgba(0,0,0,0.4)` (sombra mais pronunciada no modo escuro)
- **Sidebar:** fundo `#111111`, largura 240px, separador de seção em dourado tênue
- **Tabelas:** fundo `#181818` para linhas ímpares, `#1E1E1E` para pares; sem bordas pesadas
- **Badges de status:** pequenas pílulas coloridas (verde, amarelo, vermelho, cinza)
- **Modo:** dark mode (tema escuro premium)
- **Responsividade:** desktop first (1280px), sidebar colapsável em mobile

---

### Comportamento do white-label

O sistema usa exclusivamente a identidade "Studio Bella Corte". A interface transmite um produto feito sob medida para este salão — não há nenhuma menção à plataforma base.

---

### Variação alternativa 1 — Movimento Particular Personal

Se quiser gerar uma segunda versão com outra identidade visual do mesmo nicho:

- **Nome:** Movimento Particular Personal
- **Tagline:** "Constância transforma. Começa aqui."
- **Cor primária:** `#1A237E` (azul escuro)
- **Cor secundária:** `#76FF03` (verde lima vibrante)
- **Fundo:** `#121212` (preto com leve tom)
- **Texto principal:** `#FFFFFF`
- **Texto secundário:** `#9E9E9E`
- **Tom visual:** energético, motivador, focado em performance
- **Diferença de tela:** substituir Tela 5 por **Painel do Aluno**:
  - Card por aluno com: foto (avatar), nome, último treino, frequência da semana (barras)
  - Status: Regular | Em dia | Inativo (colorido por performance)
  - Botão "Ver histórico" abre timeline de sessões do aluno

---

### Variação alternativa 2 — Clínica Crescer Bem

Se quiser gerar uma terceira versão para clínica pediátrica:

- **Nome:** Crescer Bem
- **Tagline:** "Cuidado que acompanha cada fase"
- **Cor primária:** `#1E88E5` (azul médio — acolhedor, não hospitalar)
- **Cor secundária:** `#80CBC4` (verde água suave)
- **Fundo:** `#FAFAFA` (branco levíssimo)
- **Fundo painel:** `#FFFFFF`
- **Texto principal:** `#212121`
- **Texto secundário:** `#757575`
- **Tom visual:** acolhedor, claro, suave — confiança e tranquilidade
- **Modo:** light mode
- **Diferença de tela:** na agenda, cada paciente exibe nome do responsável entre parênteses:
  - 09:00 — Pedro Alves (resp: Ana Alves) — Consulta pediátrica — Dr. Carlos
  - Painel de recepção com destaque para "Próxima consulta" e sala de espera
