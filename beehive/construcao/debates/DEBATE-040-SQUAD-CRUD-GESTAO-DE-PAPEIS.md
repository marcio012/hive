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
- Copilot (Engenheiro): `[ ]`

**Fases:**
- `[x]` 1. Abertura
- `[x]` 2. Parecer Claude (Arquitetura)
- `[x]` 3. Parecer Gemini (PO / ROI)
- `[ ]` 4. Parecer Copilot (Implementação)
- `[ ]` 5. Consolidação / Veredito
- `[ ]` 6. Aprovação Márcio
- `[ ]` 7. Work Orders despachadas
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

*Aguardando.*

---

## 6. Consolidação / Veredito

*Aguardando pareceres de Gemini e Copilot.*

---

*Debate aberto por Márcio em 2026-05-31. Arquitetura proposta por Claude.*
