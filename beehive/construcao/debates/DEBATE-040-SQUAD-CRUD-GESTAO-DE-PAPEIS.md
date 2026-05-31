---
id: DEBATE-040
titulo: Gestão de Squad — CRUD de Papéis e Agentes no Hive UI
status: em andamento
thread: gestao-squad
responsavel: Claude (Arquiteto)
data_abertura: 2026-05-31
backlog_ref: HIVE-UI
---

# DEBATE-040 — Gestão de Squad: CRUD de Papéis e Agentes no Hive UI

## 📊 Status

**Participantes:**
- Gemini (PO): `✅`
- Claude (Arquiteto): `✅`
- Copilot (Engenheiro): `✅`

**Fases:**
- `[x]` 1. Abertura
- `[x]` 2. Parecer Claude (Arquitetura)
- `[x]` 3. Parecer Gemini (PO / ROI)
- `[x]` 4. Parecer Copilot (Implementação)
- `[x]` 5. Consolidação / Veredito
- `[x]` 6. Aprovação Márcio ✅ — 2026-05-31
- `[x]` 7. Work Orders despachadas
- `[ ]` 8. Execução concluída

---

## 1. Problema — Modelo ≠ Agente com Papel

Hoje o Hive trata modelo e papel como sinônimos. Na prática:

- **`gemini`** é um modelo (Gemini 1.5 Pro / Flash), mas pode operar como PO, Projetista ou Coordenador.
- **`claude`** é um modelo (Claude Sonnet), mas pode ser Arquiteto, Auditor ou Staff Dev.
- **`copilot`** é um modelo (GPT-4o), mas pode ser Copilot-Hive ou Copilot-TOS.

O mapeamento modelo → papel está hoje pulverizado em:
- `beehive/roles/roles.yaml` (fonte de verdade, editada manualmente)
- `MapaFabrica.tsx` (hardcoded: `role: 'Orquestrador'`, `role: 'Arquiteto'`)
- `governance.repository.ts` (defaultRole hardcoded como fallback)
- `hive-session-start.sh` (lê o campo `role:` do YAML em runtime)

Qualquer ajuste de papel exige editar múltiplos arquivos — sem UI, sem validação, sem histórico.

---

## 2. Proposta — Márcio

Criar um botão **"Equipe"** no Centro de Controle (V3 Controles), seguindo o padrão visual dos demais botões da seção (ex: "Liberar lock Copilot"), que abre um **modal de gestão de squad** com CRUD dos membros e seus papéis.

---

## 3. Parecer do Claude — Arquiteto ✅

**Data:** 2026-05-31
**Posição:** ✅ GO — com escopo e modelo de dados bem definidos antes de implementar

### 3.1 Distinção fundamental que a feature precisa capturar

```
Modelo (engine)     →  Papel (função no squad)  →  Cartucho (specialização)
─────────────────────────────────────────────────────────────────────────────
gemini-1.5-pro      →  Facilitador Estratégico   →  PO | Projetista | Coordenador
claude-sonnet-4-6   →  Arquiteto + Auditor        →  (sem cartucho hoje)
gpt-4o              →  Engenheiro / Executor      →  copilot-hive | copilot-tos
Human / Márcio      →  Owner / The Gate           →  (sem modelo)
```

A UI precisa gerenciar a camada **Papel**, não a camada **Modelo** (que é configuração de infra).

### 3.2 Modelo de dados proposto — `SquadMember`

```typescript
interface SquadMember {
  id: string;          // slug único: 'gemini', 'claude', 'copilot', 'marcio'
  name: string;        // nome de exibição: 'Gemini', 'Claude'
  role: string;        // papel legível: 'Facilitador Estratégico / PO'
  model: string;       // engine: 'gemini-1.5-pro', 'claude-sonnet-4-6'
  initial: string;     // avatar: 'G', 'C', 'P', 'M'
  inbox?: string;      // caminho do inbox: 'beehive/construcao/inbox-claude.md'
  active: boolean;     // aparece na fila / mapa
}
```

### 3.3 Persistência — onde salvar

**Opção A — `roles.yaml` como SSoT (edição via backend)**
O NestJS lê e escreve o `roles.yaml`. A UI reflete o YAML.
- ✅ Uma única fonte de verdade
- ✅ `hive-session-start.sh` continua funcionando sem mudança
- ⚠️ Parser YAML no backend (adicionar dependência `js-yaml`)
- ⚠️ Escrita em YAML é frágil (comentários podem ser perdidos)

**Opção B — Novo arquivo `squad.json` como SSoT da UI**
O `roles.yaml` vira referência imutável de capabilities/regras; a UI lê/escreve `squad.json`.
- ✅ JSON é trivial de ler/escrever no NestJS
- ✅ Não mexe no YAML (que tem comentários de governança importantes)
- ⚠️ Dois arquivos para manter em sincronia (YAML de regras + JSON de exibição)
- ⚠️ `hive-session-start.sh` precisaria ler JSON também (ou o YAML continua como fallback)

**Opção C — SQLite `tasks.db` (tabela `squad_members`)**
Nova tabela no Broker DB gerenciada pelo Orchestrator.
- ✅ Já temos infraestrutura de leitura (BrokerModule em debate no DEBATE-038)
- ✅ Sem arquivos extras
- ⚠️ Acoplamento excessivo — squad config não é uma "task"
- ❌ `hive-session-start.sh` (Bash) não consulta SQLite facilmente

**Minha posição:** Opção B. `squad.json` é simples, não contamina o YAML de governança e o `hive-session-start.sh` pode ter fallback para YAML se o JSON não existir.

### 3.4 UI — padrão de botão e modal

O padrão dos botões de controle no `CentroDeControle.tsx` é `ctrl-row` com `cmeta` + `button`. O modal de despacho (`dispatch-modal`) já existe e pode ser replicado.

```
┌─────────────────────────────────────────────────────┐
│  Controles                                           │
│  ─────────────────────────────────────────────────  │
│  Modo autônomo          agentes despacham...  [ON]  │
│  Auto-merge em verde    merge se CI...        [OFF] │
│  Notificar Márcio       push em pendências... [ON]  │
│  ─────────────────────────────────────────────────  │
│  Equipe do Squad        4 membros ativos      [→]   │ ← novo botão
└─────────────────────────────────────────────────────┘

Modal "Equipe do Squad":
┌──────────────────────────────────────────────────────┐
│  [G]  Gemini     Facilitador Estratégico / PO   [✎] │
│  [C]  Claude     Arquiteto + Auditor Técnico    [✎] │
│  [P]  Copilot    Engenheiro / Executor          [✎] │
│  [M]  Márcio     Owner / The Gate               [✎] │
│                                                      │
│                                    [+ Adicionar]     │
└──────────────────────────────────────────────────────┘
```

Ao clicar em `[✎]`: abre form inline ou segundo modal com campos `nome`, `papel`, `modelo`, `inicial`.

### 3.5 Impacto nos sistemas existentes

| Sistema | Impacto | Ação necessária |
|---|---|---|
| `MapaFabrica.tsx` | `agents[]` hardcoded | Substituir por leitura da API `/api/squad` |
| `governance.repository.ts` | `defaultRole` hardcoded | Substituir por leitura do `squad.json` / API |
| `hive-session-start.sh` | Lê `role:` do YAML | Sem mudança se YAML permanece como fallback |
| `roles.yaml` | SSoT de capabilities/regras | Não mexer — separar exibição de governança |

### 3.6 Escopo recomendado para V1

- **Incluir:** listar membros, editar `name`, `role`, `model`, `initial`
- **Excluir:** adicionar/remover membros (risco de quebrar roteamento de inbox)
- **Excluir:** editar capabilities (`can_audit_code`, etc.) — isso é governança, não UI

### 3.7 Análise Financeira (DIR-080)

- **Custo estimado:** R$ 120–180 (~2 WOs: backend `/api/squad` + modal frontend)
- **Confiança:** Alta — padrão já existe no codebase (dispatch-modal + ctrl-row)
- **Valor gerado:** Márcio gerencia papéis sem editar arquivos; elimina inconsistências entre YAML / TSX / .ts
- **Payback:** Imediato — remove ~4 lugares de manutenção manual de papel
- **Custo de não fazer:** Confusão de nomenclatura cresce a cada novo agente ou papel; Mapa Fábrica fica desatualizado silenciosamente

---

## 4. Parecer Gemini — PO / ROI

**Data:** 2026-05-31
**Posição:** ✅ GO — Alta prioridade, excelente ROI operacional.

### Análise de Prioridade e ROI
A proposta de implementar um CRUD de Papéis e Agentes no Hive UI é de **alta prioridade**. O problema atual de mapeamento inconsistente e manual entre modelos e papéis, pulverizado em diversos arquivos, gera um débito técnico significativo e um alto custo operacional. Cada alteração manual aumenta o risco de inconsistências e erros, impactando a orquestração e a governança do squad.

A centralização da gestão de papéis através de uma interface dedicada no Centro de Controle oferece um **retorno sobre investimento operacional excelente e imediato**:
- **Eficiência Operacional:** Permite que Márcio (Owner) gerencie a equipe de forma autônoma, eliminando a dependência de edições manuais e intervenções técnicas para ajustes simples de papéis.
- **Redução de Erros:** Minimiza drasticamente as inconsistências e erros de configuração decorrentes da manutenção manual em múltiplos locais.
- **Transparência e Governança:** Proporciona uma visão clara e centralizada da estrutura da equipe, facilitando a governança e a auditoria.
- **Base para Evolução:** Estabelece uma base sólida para futuras expansões na gestão de squad, como o gerenciamento de cartuchos ou permissões mais granulares.

### Alinhamento de Custo e Orçamento
O custo estimado de R$ 120–180 (equivalente a 2 Work Orders) é **totalmente justificado e alinhado com o budget do squad**. Trata-se de um investimento com retorno rápido, pois os ganhos de eficiência e a redução de riscos operacionais superarão rapidamente o custo de desenvolvimento. A alta confiança na estimativa do Claude reforça a viabilidade do projeto.

### Restrições de Agenda e Execução
Não foram identificadas restrições de agenda impeditivas. A proposta de escopo para V1, focando na listagem e edição de campos essenciais (`name`, `role`, `model`, `initial`) e excluindo a adição/remoção de membros e a edição de capacidades complexas, é pragmática e permite uma entrega ágil.

**Recomendação:** Aprovo a execução desta feature com alta prioridade, seguindo a estrutura de dados proposta (`SquadMember`) e a opção de persistência via `squad.json` (Opção B), garantindo que `hive-session-start.sh` mantenha sua resiliência via fallback. Recomendo iniciar com as WOs para a API de `/squad` e o modal frontend, conforme sugestão do Claude.

---

## 5. Parecer Copilot — Engenheiro

**Data:** 2026-05-31
**Posição:** ✅ GO — com V1 restrita a membros fixos e uma fonte única de exibição compartilhada.

### 5.1 Complexidade de `GET/PUT /api/squad`

**Complexidade: baixa para média**, desde que a feature seja tratada como **configuração operacional da UI** e não como extensão do repositório de governança.

O backend já tem os blocos que importam para isso:
- leitura file-based e parsing local (`governance.repository.ts`);
- escrita atômica de JSON já usada em config (`hive.service.ts`);
- endpoints simples no controller com validação explícita (`hive.controller.ts`).

Ou seja: ler e escrever um `squad.json` no NestJS é direto. O risco real não está no I/O, e sim em **modelagem e fronteira de responsabilidade**. Minha recomendação é:

- criar um repositório/serviço dedicado de `squad`;
- validar DTO com shape fechado (`id`, `name`, `role`, `model`, `initial`, `active`, `inbox?`);
- **não** acoplar escrita no `governance.repository.ts`, porque hoje ele é leitor de governança (`roles.yaml` + fallback markdown), não storage operacional editável.

### 5.2 Viabilidade do modal no padrão `dispatch-modal`

**Viável sem refatoração maior.**

O `CentroDeControle.tsx` já tem exatamente o que essa feature precisa:
- linha de controle no padrão `ctrl-row`;
- modal funcional com estado local, erro, loading e ação assíncrona (`dispatch-modal`);
- estrutura de painel consistente para encaixar um novo botão "Equipe".

Portanto, o trabalho aqui é mais de **replicação controlada do padrão existente** do que de redesenho da tela. O cuidado principal é só garantir refresh consistente após salvar, para não deixar Centro de Controle, Mapa da Fábrica e Telemetria divergirem.

### 5.3 Risco de migrar `agents[]` hardcoded do `MapaFabrica.tsx`

**Risco baixo/médio se a V1 apenas editar os 4 membros atuais.**
**Risco alto se a V1 tentar virar CRUD realmente livre (adicionar/remover IDs arbitrários).**

Hoje o acoplamento com agentes fixos aparece em vários pontos:

- `useHiveSocket.ts` tipa `AgentName` como `'claude' | 'copilot' | 'gemini'`;
- `MapaFabrica.tsx` usa `Record<AgentName, ...>` e `switch` por agente;
- `AgentCard.tsx` tem ícones, lock e contexto amarrados a esse conjunto fixo;
- `Telemetria` e `hive.service.ts` ainda têm papéis hardcoded (`AGENT_ROLES`);
- já existe até divergência de chave (`diretor` no mapa vs `marcio` em outros pontos), sinal de que a tipagem atual não está pronta para lista arbitrária.

Então, **trocar o array hardcoded por dados vindos da API não quebra o build por si só** se:

1. os IDs continuarem restritos a `claude`, `copilot`, `gemini` e `marcio/diretor`;
2. a ordem/renderização continuar controlada no frontend;
3. a API só hidratar metadados (`name`, `role`, `model`, `initial`, `active`) com fallback local;
4. os papéis de telemetria e governança também passarem a ler a mesma fonte para evitar inconsistência visual.

Se a proposta for permitir adicionar/remover membros já na V1, aí não é mais uma troca simples de fonte: vira refactor transversal de tipos, cards, métricas, esteiras e estado websocket.

### 5.4 Recomendação de implementação

**Minha recomendação é GO com escopo travado:**

- **V1:** editar somente os membros fixos do squad;
- `squad.json` como fonte de **exibição operacional**;
- `roles.yaml` continua como fonte de **governança/capabilities**;
- backend expõe `GET/PUT /api/squad`;
- frontend mantém a malha tipada atual e só substitui labels/metadados, sem abrir cadastro livre.

Nesse formato, a entrega é segura, incremental e resolve o problema central sem forçar uma refatoração ampla do Hive UI.

---

## 6. Consolidação / Veredito

**Data:** 2026-05-31
**Veredito:** ✅ GO — escopo V1 travado, dois agentes envolvidos (backend + frontend)

### Consenso dos três pareceres

| Ponto | Claude | Gemini | Copilot |
|---|---|---|---|
| Opção B (`squad.json`) | ✅ | ✅ | ✅ |
| V1: editar apenas membros fixos | ✅ | ✅ | ✅ |
| `roles.yaml` imutável | ✅ | ✅ | ✅ |
| Prioridade alta | ✅ | ✅ | ✅ |
| Modal no padrão `dispatch-modal` | ✅ | — | ✅ viável sem refatoração |

### Decisões consolidadas

**D1 — Persistência:** `beehive/squad.json` como SSoT de exibição. `roles.yaml` continua como SSoT de capabilities/governança. Nenhum agente mexe no YAML pela UI.

**D2 — Escopo V1 (travado):** Editar `name`, `role`, `model`, `initial`, `active` dos 4 membros fixos (`claude`, `copilot`, `gemini`, `marcio`). **Sem** adicionar/remover membros — o tipo `AgentName` e os hooks do WebSocket dependem dos IDs fixos.

**D3 — Backend:** `SquadModule` próprio no NestJS (não acoplar ao `governance.repository.ts`). Endpoints `GET /api/squad` e `PUT /api/squad`. Escrita atômica em `squad.json`.

**D4 — Frontend:** Botão "Equipe" na seção Controles (padrão `ctrl-row`). Modal no padrão `dispatch-modal`. Hidrata `MapaFabrica.tsx` e `governance.repository.ts` com dados da API — fallback local mantido para resiliência.

**D5 — Telemetria e consistência:** `hive.service.ts` (`AGENT_ROLES` hardcoded) também passa a ler da API para evitar divergência visual entre Mapa, Telemetria e Centro de Controle.

### Work Orders a despachar

- **WO-A:** Backend — `SquadModule` + `GET/PUT /api/squad` + `squad.json` seed com valores atuais
- **WO-B:** Frontend — botão "Equipe" + modal CRUD + hidratação de `MapaFabrica.tsx`

### Aprovado por Márcio — 2026-05-31

WOs despachadas: WO-051 (backend) e WO-052 (frontend).

---

*Debate aberto por Márcio em 2026-05-31. Arquitetura proposta por Claude.*
