---
nicho: servicos
versao: 2.0.0
status: ativo
atualizado_em: 2026-05-21
responsavel: Claude - Arquiteto
---

# Blueprint: Serviços

## Objetivo de negócio

Permitir que prestadores de serviço (salões, personal trainers, clínicas) organizem sua agenda, acompanhem clientes de forma recorrente e operem o dia com visibilidade real — substituindo WhatsApp, papel e planilhas por um produto com identidade própria.

## Nichos de referência (dossiês)

| Cliente | Cidade | Dor principal | Módulo crítico |
|---|---|---|---|
| Studio Bella Corte | Campinas - SP | agenda no WhatsApp, choque de horários, encaixes errados | agendamento |
| Movimento Particular Personal | Belo Horizonte - MG | alunos dispersos, frequência não rastreada, sem visão de evolução | agenda + acompanhamento |
| Clínica Pediátrica Crescer Bem | Sorocaba - SP | remarcações, encaixes, retorno sem previsibilidade, recepção via WhatsApp | agenda + recepção |

---

## Mapa de módulos

```
BLUEPRINT SERVIÇOS
├── [CORE obrigatório]
│   ├── Autenticação JWT
│   ├── Tenant + Branding
│   ├── Produto CRUD (usado como catálogo de serviços)
│   └── Venda + VendaItem (registra o serviço cobrado)
│
├── [COMPOSIÇÃO SERVIÇOS — este blueprint]
│   ├── Cadastro de Clientes
│   ├── Agenda de Atendimento
│   ├── Painel da Recepção / Dia
│   └── Acompanhamento Recorrente
│
└── [EXTENSÃO opcional por nicho]
    ├── Profissional (salão / clínica com múltiplos prestadores)
    │   ├── Agenda por profissional
    │   └── Disponibilidade e turnos
    └── Observação de Sessão (personal / clínica)
        └── Registro mínimo por atendimento
```

---

## Módulos ativados

### 1. Cadastro de Clientes

**Objetivo:** registrar e manter o perfil do cliente, aluno ou paciente vinculado ao tenant.  
**Usuários:** recepcionista, operador, profissional.

| Funcionalidade | Descrição |
|---|---|
| Cadastro básico | nome, telefone, email, data de nascimento |
| Vínculo com responsável | campo opcional para responsável (clínica pediátrica) |
| Histórico de atendimentos | lista de sessões/consultas anteriores do cliente |
| Status do cliente | ativo, inativo, aguardando retorno |
| Busca de cliente | por nome, telefone ou email |
| Anotação livre | campo de observação operacional sem estrutura clínica |

**Regra:** `Cliente` é sempre scoped por `tenant_id`. O mesmo email pode existir em tenants diferentes. Não há compartilhamento de dados de cliente entre tenants.

---

### 2. Agenda de Atendimento

**Objetivo:** controlar horários marcados, encaixes e confirmações sem depender de papel ou WhatsApp.  
**Usuários:** recepcionista, profissional, gerente.

| Funcionalidade | Descrição |
|---|---|
| Novo agendamento | data, horário, cliente, serviço, profissional |
| Encaixe | marcar sessão fora do horário padrão com flag visual |
| Confirmação de presença | operador confirma que o cliente compareceu |
| Remarcação | alterar data/hora de um agendamento existente |
| Cancelamento | cancelar com registro de motivo |
| Visão semanal | grade horária da semana por profissional ou geral |
| Bloqueio de horário | marcar período como indisponível (folga, reunião) |

**Regra:** um agendamento tem sempre `data_hora`, `cliente_id`, `servico_id` e `status`. O campo `profissional_id` é opcional quando o tenant opera com profissional único.

**Status do agendamento:**
```
agendado → confirmado → presente → concluído
                     ↘ ausente
          ↘ remarcado
          ↘ cancelado
```

---

### 3. Painel da Recepção / Dia

**Objetivo:** dar à recepção e ao gerente uma visão instantânea da agenda do dia sem precisar rodar consultas.  
**Usuários:** recepcionista, gerente.

| Indicador | Cálculo |
|---|---|
| Agenda do dia | todos os agendamentos com data = hoje, ordenados por horário |
| Confirmados | agendamentos com status = confirmado |
| Presentes | agendamentos com status = presente |
| Ausentes | agendamentos com status = ausente |
| Próximo atendimento | próximo agendamento com status = agendado ou confirmado |
| Taxa de comparecimento | presentes / (presentes + ausentes) × 100 — janela dos últimos 30 dias |
| Encaixes do dia | agendamentos com flag `encaixe = true` |

---

### 4. Acompanhamento Recorrente

**Objetivo:** manter visibilidade de clientes que deveriam retornar mas ainda não agendaram.  
**Usuários:** recepcionista, gerente, profissional.

| Funcionalidade | Descrição |
|---|---|
| Cliente sem retorno | lista clientes que tiveram atendimento mas não têm próximo agendamento |
| Intervalo esperado | prazo configurado por serviço para retorno esperado |
| Alerta de inatividade | cliente sem agenda após N dias do último atendimento |
| Registro de observação | anotação breve por atendimento (operacional, não clínica) |
| Histórico por cliente | linha do tempo de sessões do cliente |

**Regra:** "intervalo esperado" é configurado por serviço (ex.: corte = 30 dias, consulta pediátrica = 90 dias). O sistema usa esse intervalo para calcular quando um cliente está "atrasado".

---

### 5. Profissional (extensão — multi-profissional)

**Objetivo:** quando o tenant tem mais de um profissional, cada um tem sua própria agenda e disponibilidade.  
**Usuários:** admin, gerente.

| Funcionalidade | Descrição |
|---|---|
| Cadastro de profissional | nome, especialidade, turno |
| Agenda por profissional | filtra agendamentos por profissional |
| Disponibilidade | define dias e horários de atendimento de cada profissional |
| Bloqueio individual | marcar período de um profissional como indisponível |

**Regra:** `Profissional` é uma extensão de `Usuario` com tipo `profissional`. O campo `profissional_id` em `Agendamento` é opcional — quando ausente, o tenant opera com profissional único (o próprio usuário logado).

---

### 6. Observação de Sessão (extensão — acompanhamento)

**Objetivo:** para nichos que precisam registrar algo da sessão (personal, clínica leve), guardar uma anotação mínima por atendimento.  
**Usuários:** profissional.

| Funcionalidade | Descrição |
|---|---|
| Registro por sessão | texto livre vinculado ao agendamento concluído |
| Histórico de observações | linha do tempo de registros por cliente |
| Visibilidade restrita | visível apenas para o profissional e admin do tenant |

**Regra:** este módulo é **operacional**, não clínico. Não há prontuário, receituário, CID, faturamento TISS ou qualquer estrutura regulatória de saúde. Apenas texto livre com data.

---

## Modelo de dados

### Entidades do core usadas por este blueprint

```
Tenant          → isolamento e branding (já existe)
Usuario         → auth e operador (já existe) — usado também como Profissional
Produto         → catálogo de serviços: corte, consulta, sessão (já existe, precisa de evolução)
Venda           → faturamento do atendimento cobrado (já existe, parcial)
VendaItem       → item de serviço na venda (já existe)
```

### Entidades novas necessárias para este blueprint

```
┌──────────────────────────────────────────────────────────────┐
│  CLIENTE                                                      │
│  id (cuid)                                                    │
│  tenant_id          FK → Tenant                               │
│  nome               String                                    │
│  telefone           String?                                   │
│  email              String?                                   │
│  data_nascimento    DateTime?                                  │
│  responsavel_nome   String?    (para clínicas pediátricas)    │
│  responsavel_fone   String?                                   │
│  status             enum: ativo | inativo | aguardando_retorno│
│  observacao         String?                                   │
│  criado_em          DateTime                                  │
│  [UNIQUE: tenant_id + email (quando email preenchido)]        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  AGENDAMENTO                                                  │
│  id (cuid)                                                    │
│  tenant_id          FK → Tenant                               │
│  cliente_id         FK → Cliente                              │
│  servico_id         FK → Produto (tipo=servico)               │
│  profissional_id    FK → Usuario? (opcional)                  │
│  data_hora          DateTime                                  │
│  duracao_minutos    Int                                       │
│  status             enum: agendado | confirmado | presente |  │
│                           concluido | ausente | cancelado |   │
│                           remarcado                          │
│  encaixe            Boolean (default: false)                  │
│  motivo_cancelamento String?                                  │
│  remarcado_de_id    FK → Agendamento? (auto-referência)       │
│  criado_em          DateTime                                  │
│  atualizado_em      DateTime                                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  OBSERVACAO_SESSAO                                            │
│  id (cuid)                                                    │
│  tenant_id          FK → Tenant                               │
│  agendamento_id     FK → Agendamento                          │
│  cliente_id         FK → Cliente                              │
│  profissional_id    FK → Usuario                              │
│  texto              String                                    │
│  criado_em          DateTime                                  │
│  [UNIQUE: agendamento_id]                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  BLOQUIO_AGENDA                                               │
│  id (cuid)                                                    │
│  tenant_id          FK → Tenant                               │
│  profissional_id    FK → Usuario? (null = bloqueia todos)     │
│  inicio             DateTime                                  │
│  fim                DateTime                                  │
│  motivo             String?                                   │
└──────────────────────────────────────────────────────────────┘
```

### Evolução necessária em entidades existentes

```
Produto (para funcionar como Serviço):
  + tipo             enum: produto | servico  (default: produto)
  + duracao_minutos  Int?    → duração padrão do serviço
  + intervalo_retorno_dias Int?  → prazo esperado para retorno do cliente
```

---

## Fluxos operacionais

### Fluxo de novo agendamento

```
Recepcionista abre agenda
  ↓
Seleciona data e horário disponível
  ↓
Busca cliente (ou cadastra novo se primeira vez)
  ↓
Seleciona serviço → duracao preenchida automaticamente
  ↓
Seleciona profissional (se multi-profissional)
  ↓
Confirma → POST /agendamentos
  ↓
Agendamento aparece na grade e no painel do dia
```

### Fluxo do dia na recepção

```
Recepção abre painel do dia
  ↓
Lista todos os agendamentos de hoje em ordem de horário
  ↓
Cliente chega → recepcionista clica "presente"
  ↓
Profissional conclui atendimento → status = concluído
  ↓
Se cobrado → venda é registrada vinculada ao agendamento
  ↓
Se ausente → recepcionista marca "ausente" → sistema adiciona cliente à lista de retorno
```

### Fluxo de acompanhamento recorrente

```
Sistema identifica clientes com última sessão há mais de N dias
(N = intervalo_retorno_dias do serviço)
  ↓
Lista aparece no painel "Clientes sem retorno"
  ↓
Recepcionista contata cliente (WhatsApp externo por ora)
  ↓
Novo agendamento criado → cliente sai da lista
```

### Fluxo de remarcação

```
Cliente pede remarcação
  ↓
Recepcionista abre agendamento existente
  ↓
Clica "remarcar" → seleciona nova data/hora
  ↓
Agendamento original fica com status = remarcado + referência ao novo
  ↓
Novo agendamento criado com remarcado_de_id preenchido
```

---

## Endpoints necessários (API surface)

```
── Clientes ──────────────────────────────────────────────────
GET    /api/clientes                 → lista com busca e filtro de status
POST   /api/clientes                 → cadastrar cliente
GET    /api/clientes/:id             → perfil + histórico de atendimentos
PUT    /api/clientes/:id             → editar cliente
PATCH  /api/clientes/:id/status      → ativar / inativar / aguardando retorno

── Agenda ────────────────────────────────────────────────────
GET    /api/agendamentos             → lista com filtros: data, profissional, status
POST   /api/agendamentos             → criar agendamento
GET    /api/agendamentos/:id         → detalhe do agendamento
PATCH  /api/agendamentos/:id/status  → atualizar status (confirmar, presente, concluir, ausente, cancelar)
POST   /api/agendamentos/:id/remarcar → criar remarcação (gera novo, fecha atual)

── Painel ────────────────────────────────────────────────────
GET    /api/relatorios/painel-dia    → agenda do dia + indicadores
GET    /api/relatorios/retorno       → clientes sem agendamento futuro (retorno pendente)

── Observações ───────────────────────────────────────────────
POST   /api/agendamentos/:id/observacao  → registrar observação da sessão
GET    /api/clientes/:id/observacoes     → histórico de observações por cliente

── Bloqueios ─────────────────────────────────────────────────
GET    /api/agenda/bloqueios         → listar bloqueios ativos
POST   /api/agenda/bloqueios         → criar bloqueio de período
DELETE /api/agenda/bloqueios/:id     → remover bloqueio
```

---

## Regras de negócio

| Gatilho | Condição | Ação |
|---|---|---|
| Agendamento criado | horário sobreposto com outro agendamento do mesmo profissional | retornar erro de conflito |
| Agendamento criado | horário dentro de um bloqueio de agenda | retornar erro de indisponibilidade |
| Agendamento atualizado para concluído | — | verificar se cliente deve entrar na lista de retorno |
| Agendamento marcado como ausente | — | adicionar cliente à lista de retorno pendente |
| Cliente sem agendamento futuro | dias desde último atendimento > intervalo_retorno_dias do serviço | aparecer em "clientes sem retorno" |
| Encaixe criado | qualquer horário | flag visual no painel, sem restrição de conflito (encaixe é intencional) |
| Remarcação criada | — | agendamento original → status=remarcado; novo agendamento referencia o original |

---

## IA integrada

| Capacidade | Caso de uso | Entrada | Saída |
|---|---|---|---|
| Resumo diário | consolidar atendimentos, ausências e retornos pendentes do dia | agenda do dia + status finais | texto com destaques e próximos passos |
| Lista de retorno prioritário | identificar quais clientes inativos têm maior urgência de contato | histórico de sessões + intervalo por serviço | lista priorizada de clientes para contactar |
| Próxima ação | sugerir uma ação de alto impacto para o profissional no fim do dia | painel do dia + lista de retorno | uma ação de alto impacto |
| Preenchimento assistido | sugerir duração e intervalo de retorno ao cadastrar serviço | nome do serviço | sugestões de campos |

---

## O que NÃO entra neste blueprint

- Prontuário médico completo (CID, anamnese clínica, receituário)
- Faturamento TISS / convênio / plano de saúde
- Assinatura digital clínica
- Telemedicina
- App mobile para o cliente final fazer autoagendamento
- Plano de treino adaptativo com IA
- Integração com wearables ou dispositivos de monitoramento
- Automatizações de cobrança (mensalidades, inadimplência)
- Programa de fidelidade por pontos
- Multi-unidade

---

## Dependências do core

| Módulo core | Status | Necessidade |
|---|---|---|
| Auth JWT | ❌ ausente | obrigatório — todas as rotas de operação |
| Tenant CRUD | ❌ ausente | obrigatório — criar tenant do cliente |
| Produto CRUD | ⚠️ parcial (só GET) | obrigatório — catálogo de serviços |
| Usuário CRUD | ❌ ausente | obrigatório — recepcionista, profissional, admin |
| Venda + VendaItem | ⚠️ parcial | obrigatório — cobrar o atendimento |

---

## Critério de aceite técnico

- [ ] Agendamento é criado com validação de conflito de horário
- [ ] Status do agendamento segue a máquina de estados definida
- [ ] Remarcação cria novo agendamento e fecha o original com referência
- [ ] Painel do dia exibe todos os agendamentos do dia com status atual
- [ ] Cliente ausente aparece automaticamente na lista de retorno
- [ ] Intervalo de retorno configurado por serviço alimenta a lista de clientes inativos
- [ ] Observação de sessão fica vinculada ao agendamento e visível no histórico do cliente
- [ ] Bloqueio de agenda impede novos agendamentos no período bloqueado
- [ ] Todos os endpoints respeitam isolamento de tenant_id
- [ ] Multi-profissional: agenda por profissional funciona sem afetar profissional único

---

## Métricas de adoção por tenant

| Indicador | Meta | Janela |
|---|---|---|
| % de atendimentos registrados via sistema (vs. WhatsApp/papel) | ≥ 80% | D+30 |
| % de ausências registradas (vs. ignoradas) | ≥ 70% | D+30 |
| % de clientes em retorno que receberam novo agendamento | ≥ 40% | D+30 |
| % de profissionais usando o painel do dia diariamente | ≥ 60% | D+30 |
| % de uso de ao menos 1 feature de IA | ≥ 25% | D+30 |

---

## Questões abertas

1. **Cliente no core ou no blueprint?** O `Cliente` é usado apenas por serviços — varejo raramente precisa. Deveria ser entidade do blueprint ou entrar no core como opcional?

2. **Agendamento e cobrança:** quando o atendimento é concluído, a venda deve ser criada automaticamente ou é um passo manual da recepção? Automático reduz atrito mas pode gerar venda de atendimento não cobrado.

3. **Multi-profissional como flag:** a extensão de multi-profissional deveria ser ativada por uma configuração no tenant (`features.multi_profissional = true`) em vez de sempre estar disponível?

4. **Intervalo de retorno:** quando o serviço não tem `intervalo_retorno_dias` definido, o cliente entra na lista de retorno? Ou a lista só funciona para serviços com intervalo configurado?

5. **Notificações:** os dossiês mencionam confirmação e lembrança via WhatsApp. Esse canal fica fora do produto (o operador manda manualmente) ou há um módulo de notificação no roadmap?
