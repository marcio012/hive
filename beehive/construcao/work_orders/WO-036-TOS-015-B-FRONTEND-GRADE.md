---
id: WO-036
titulo: TOS-015-B — Agenda: Frontend Grade Horária Visual
backlog_ref: TOS-015
debate_ref: beehive/construcao/debates/DEBATE-029-GESTAO-DE-AGENDA-MODULO-SERVICOS.md
status: despachada
executor: Copilot
auditor: Claude
data: 2026-05-29
thread: tos-015-agenda
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target: tenantOS
cwd_exec: /home/marcio/job/tenantOS
---

# WO-036 — TOS-015-B: Agenda Frontend Grade Horária

## Contexto

O frontend já tem `Agenda.tsx` (450 linhas) com vista de lista de cards por dia. Esta WO adiciona uma **vista de grade horária** como modo alternativo, sem remover a lista existente. O usuário alterna entre lista e grade via toggle.

## Escopo

### 1. `frontend/src/app/components/pages/Agenda.tsx`

Adicionar estado de vista:
```typescript
const [vistaGrade, setVistaGrade] = useState(false);
```

Adicionar toggle de vista (ao lado dos controles de data existentes):
```tsx
<button onClick={() => setVistaGrade(false)} className={!vistaGrade ? 'active' : ''}>
  Lista
</button>
<button onClick={() => setVistaGrade(true)} className={vistaGrade ? 'active' : ''}>
  Grade
</button>
```

**Componente `GradeHoraria`** (pode ser função dentro do mesmo arquivo ou arquivo separado `GradeHoraria.tsx`):

**Estrutura visual:**
```
│ Hora │ [Profissional A] │ [Profissional B] │
│ 08h  │ [Bloco 30min]   │                  │
│ 08:30│                  │ [Bloco 60min]   │
│ 09h  │ [Bloco 60min]   │                  │
│ ...  │                  │                  │
```

**Implementação com CSS Grid:**
- Container principal: `display: grid; grid-template-columns: 60px repeat(N, 1fr)` onde N = número de profissionais visíveis
- Slots de tempo: linhas de 15min ou 30min (configurável, default 30min)
- Cada agendamento posicionado por `grid-row-start` calculado a partir de `data_hora` relativo ao início da grade (ex: 08:00)
- Altura de cada bloco proporcional a `duracao_minutos`

**Cálculo de posição:**
```typescript
function calcularGridRow(dataHora: Date, inicio: Date, slotMin: number): number {
  const diffMin = (dataHora.getTime() - inicio.getTime()) / 60_000;
  return Math.floor(diffMin / slotMin) + 2; // +2 por causa do header
}

function calcularGridSpan(duracaoMin: number, slotMin: number): number {
  return Math.max(1, Math.ceil(duracaoMin / slotMin));
}
```

**Restrições de performance (per DEBATE-029):**
- Carregar apenas o dia/data selecionado (filtro já existe no `listar()`)
- Memoizar os cards de agendamento com `useMemo`
- Profissionais: mostrar todos os profissionais do dia com agendamentos + coluna "Sem profissional"

**Horário da grade:** 07:00 às 21:00 por padrão (pode ser configurável futuramente).

**Interações na grade:**
- Clicar em bloco abre o detalhe/modal do agendamento (mesma lógica da lista)
- Cores dos blocos: mesmos `STATUS_COLOR` da lista existente

**Bloqueios:** blocos com `status = 'bloqueio'` exibidos com estilo distinto (hachurado ou cor diferente).

### 2. CSS — estilos da grade

Adicionar no arquivo CSS correspondente (identificar se o projeto usa Tailwind inline ou arquivo CSS — o arquivo usa Tailwind, então inline):
- Classes `.grade-container`, `.grade-hora`, `.grade-bloco`, `.grade-bloco-bloqueio`
- Ou usar Tailwind com classes inline conforme padrão existente

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | Toggle Lista/Grade visível na tela de Agenda |
| AC-02 | Vista Grade exibe coluna de horas (07h–21h) + colunas por profissional |
| AC-03 | Agendamentos posicionados corretamente por horário e duração via CSS Grid |
| AC-04 | Clicar em bloco abre o detalhe do agendamento (mesma UX da lista) |
| AC-05 | Vista Lista original permanece funcional após a mudança |
| AC-06 | Agendamentos com `status: 'bloqueio'` exibidos com visual distinto |
| AC-07 | Build sem erros TypeScript em `frontend/` |

## Nota

Esta WO depende da AC-04 da WO-035 (status `bloqueio` disponível). Pode ser implementada em paralelo, mas deve ser testada após WO-035 estar em ambiente de desenvolvimento.

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 5,00–8,00 (grade visual é a parte mais complexa da feature) |
| Confiança | Média — CSS Grid posicional tem nuances de alinhamento |
| Valor gerado | Visibilidade de horários e conflitos visualmente — melhora UX significativamente |
| Payback | Imediato — diferencial de produto para nichos de serviço |
| Custo de não fazer | Produto com apenas lista de cards — sem sensação de "agenda" real |
