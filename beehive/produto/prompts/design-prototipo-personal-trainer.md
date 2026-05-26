# Prompt de Design — Protótipo White Label: Movimento Particular Personal

**Uso:** colar este prompt diretamente no Claude Design  
**Objetivo:** protótipo completo cobrindo todos os módulos do nicho de personal trainer  
**Referência:** dossiê `EXEMPLO_DOSSIE_NICHO_PERSONAL_TRAINER_MOVIMENTO_PARTICULAR.md` + `servicos-blueprint.md`

---

## PROMPT PARA O CLAUDE DESIGN

Crie um protótipo de interface web white-label para um sistema de gestão de personal trainer chamado **"Movimento Particular Personal"**.

O produto deve parecer feito exclusivamente para este profissional — premium, energético e pessoal. Não deve lembrar app genérico de academia.

---

### Identidade visual

- **Nome da marca:** Movimento Particular Personal
- **Tagline:** "Constância transforma. Começa aqui."
- **Logo:** iniciais "MP" em bold com detalhe de barra oblíqua verde lima
- **Cor primária:** `#1A237E` (azul escuro profundo)
- **Cor de acento:** `#76FF03` (verde lima elétrico)
- **Fundo da página:** `#0A0F1E` (azul-preto)
- **Fundo de cards:** `#111827` com borda `rgba(118,255,3,0.1)`
- **Texto principal:** `#F9FAFB`
- **Texto secundário:** `#9CA3AF`
- **Texto sobre primária:** `#FFFFFF`
- **Elemento ativo:** borda esquerda verde lima `#76FF03` + fundo `rgba(118,255,3,0.08)`

**Tom visual:** dark mode energético — sem ser pesado. Contraste alto, tipografia forte, acentos verdes que sinalizam movimento e progresso. Como se fosse o Strava ou Nike Training numa versão de gestão operacional.

---

### Telas a criar

---

#### Tela 1 — Login

- Fundo preto com textura sutil (linhas diagonais ou ruído muito leve)
- Logo MP centralizado com brilho verde lima por baixo (glow)
- Nome da marca em bold, branco
- Tagline "Constância transforma. Começa aqui." em verde lima tênue
- Card de formulário: fundo `#111827`, borda `rgba(118,255,3,0.2)`
- Campos: E-mail e Senha (ícones brancos, texto branco)
- Botão "Entrar": fundo `#1A237E`, borda verde lima, texto branco — hover com brilho verde
- Link "Esqueceu sua senha?" em cinza

---

#### Tela 2 — Painel do Dia (Dashboard)

Sidebar esquerda + área principal.

**Sidebar:**
- Logo MP + "Movimento Particular" no topo
- Itens de menu: Dashboard, Alunos, Agenda, Sessões, Acompanhamento, Financeiro, Configurações
- Item ativo: borda esquerda `#76FF03`, texto verde lima, fundo sutil
- Logout no rodapé

**Área principal — conteúdo do dia:**

- Saudação no topo: "Boa manhã, Rafael — você tem 6 sessões hoje"
- **Faixa de indicadores rápidos** (4 cards horizontais):
  - Sessões hoje: **6** (ícone raio)
  - Confirmados: **4** (ícone check verde)
  - Alunos ativos: **23** (ícone grupo)
  - Retorno pendente: **3** (ícone alerta — borda verde lima)

- **Bloco: Sessões de hoje** — timeline vertical por horário:
  ```
  06:00  ●  Lucas Mendes     — Treino funcional    ✓ Presente
  07:00  ●  Ana Paula Ramos  — HIIT               ✓ Confirmado
  08:30  ●  Carlos Vieira    — Musculação          ○ Agendado
  ────────  BLOQUEADO ────────────────────────────── (09:30–10:30)
  17:00  ●  Fernanda Costa   — Funcional           ○ Agendado
  18:00  ●  Bruno Almeida    — Corrida             ○ Agendado
  19:00  ●  Patrícia Lima    — Pilates solo        ○ Agendado
  ```
  Cada linha: avatar colorido, nome, tipo de treino, status + botões "Presente" / "Ausente"

- **Bloco: Alunos sem retorno** (card com borda verde lima tênue):
  - 3 alunos listados: nome, último treino, dias de inatividade
  - Botão "Agendar" em cada linha

---

#### Tela 3 — Alunos

- Barra de busca + botão "Novo Aluno" em azul escuro com acento verde
- **Grade de cards de alunos** (3 colunas):
  Cada card contém:
  - Avatar circular com inicial do nome (fundo azul escuro)
  - Nome em branco, objetivo em cinza (ex: "Emagrecimento e condicionamento")
  - **Barra de frequência semanal** — 5 bolinhas: verde=presente, cinza=ausente/futuro
  - Status: `Em dia` (verde) | `Atenção` (amarelo) | `Inativo` (vermelho tênue)
  - Última sessão: "há 3 dias"
  - Próxima sessão: "Sexta, 17h"

- **Exemplos de alunos:**
  - Lucas Mendes — Hipertrofia — 🟢 Em dia
  - Ana Paula Ramos — Emagrecimento — 🟢 Em dia
  - Carlos Vieira — Condicionamento — 🟡 Atenção (7 dias sem treino)
  - Fernanda Costa — Funcional — 🟢 Em dia
  - Bruno Almeida — Corrida — 🔴 Inativo (18 dias)
  - Patrícia Lima — Mobilidade — 🟢 Em dia

---

#### Tela 4 — Perfil do Aluno

Ao clicar em um aluno, abre painel de detalhe completo:

**Cabeçalho:**
- Avatar grande + nome + objetivo + status atual
- Botões: "Nova Sessão" | "Registrar Observação" | "Editar"

**Seção: Frequência dos últimos 30 dias**
- Grade de quadradinhos estilo GitHub contributions:
  - Verde elétrico = sessão realizada
  - Verde escuro = confirmado (não aconteceu ainda)
  - Cinza = ausente / sem sessão

**Seção: Próximas sessões**
- Lista das próximas 3 sessões: data, horário, tipo de treino, status

**Seção: Histórico de observações**
- Timeline de registros operacionais do personal:
  ```
  21/05 — "Aluno evoluiu bem no agachamento. Aumentar carga na próxima."
  17/05 — "Referiu dor leve no joelho esquerdo. Adaptar treino de pernas."
  14/05 — "Excelente energia hoje. Bateu PR no deadlift."
  ```

**Seção: Sessões do mês**
- Mini-tabela: data, tipo de treino, duração, status (realizado/ausente)

---

#### Tela 5 — Agenda Semanal

- Grade horária semanal: segunda a sábado, 05h30 às 21h
- Blocos de sessão coloridos:
  - Azul escuro `#1A237E`: sessão agendada
  - Verde lima `#76FF03` (texto preto): sessão confirmada
  - Cinza: ausente/cancelado
  - Hachurado cinza: bloqueio pessoal
- Cada bloco mostra: nome do aluno + tipo de treino
- Botão "+ Agendar" no topo direito (verde lima)
- Ao clicar em horário vazio: modal de novo agendamento

---

#### Tela 6 — Novo Agendamento (modal)

- Título: "Nova Sessão"
- Campos em sequência:
  1. **Aluno** — autocomplete com avatares
  2. **Tipo de treino** — seleção: Funcional | HIIT | Musculação | Corrida | Pilates Solo | Mobilidade | Avaliação
  3. **Data** — date picker (dias com disponibilidade em verde lima)
  4. **Horário** — botões de horário: disponível (azul escuro) | indisponível (cinza) | bloqueado (hachurado)
  5. **Recorrente?** — toggle "Sim — repetir toda semana"
- Botão "Confirmar Sessão" — fundo azul escuro, borda verde lima

---

#### Tela 7 — Financeiro (Mensalidades)

- Resumo do mês no topo:
  - Recebido: **R$ 4.200** (verde)
  - Pendente: **R$ 800** (amarelo)
  - Inadimplente: **R$ 0** (cinza)
- Tabela de alunos + status de pagamento:
  | Aluno | Plano | Vencimento | Status | Ação |
  |---|---|---|---|---|
  | Lucas Mendes | 3x/semana | 01/06 | 🟢 Pago | Ver |
  | Ana Paula | 2x/semana | 01/06 | 🟡 Pendente | Cobrar |
  | Carlos Vieira | 4x/semana | 28/05 | 🔴 Atrasado | Cobrar |
- Filtro por status: Todos | Pagos | Pendentes | Atrasados

---

### Especificações de UI

- **Fonte:** Inter para corpo; Barlow Condensed ou Oswald para headlines (fontes com energia esportiva)
- **Border-radius:** 12px cards, 8px botões, 50% avatares
- **Sombra:** `0 0 20px rgba(118,255,3,0.08)` em cards ativos — glow verde lima sutil
- **Sidebar:** 240px, fundo `#070D1A`, borda direita `rgba(118,255,3,0.1)`
- **Tabelas:** fundo alternado `#111827` e `#0E1520`
- **Badges de status:** pílulas pequenas arredondadas (verde, amarelo, vermelho, cinza)
- **Modo:** dark mode exclusivo
- **Responsividade:** desktop first 1280px

---

### Comportamento do white-label

Toda a interface usa exclusivamente a marca "Movimento Particular Personal". O produto parece feito sob medida para este profissional — não há nenhuma referência à plataforma base.
