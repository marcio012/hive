---
id: WO-035
titulo: TOS-015-A — Agenda: Backend Delta (Conflito + venda_id)
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

# WO-035 — TOS-015-A: Agenda Backend Delta

## Contexto

O módulo de agendamentos já existe em `backend/src/agendamentos/` com CRUD, transições de status, remarcação e observação de sessão. Esta WO implementa apenas o **delta** necessário para o DEBATE-029: verificação de conflito de horário e link bidirecional com vendas.

## Escopo

### 1. `backend/prisma/schema.prisma` — Migration delta

Adicionar campo `venda_id` nullable no modelo `Agendamento`:

```prisma
model Agendamento {
  // ... campos existentes ...
  venda_id        String?  @unique    // ← novo: preenchido ao concluir com venda
  venda           Venda?   @relation(fields: [venda_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
}
```

Adicionar índice de segurança parcial (raw migration, não via schema) para evitar race condition em insert simultâneo no mesmo slot:

```sql
-- Em uma nova migration Prisma (raw SQL via prisma/migrations/)
CREATE UNIQUE INDEX agendamento_profissional_inicio_unique
ON agendamentos(profissional_id, data_hora)
WHERE status NOT IN ('cancelado', 'remarcado', 'bloqueio');
```

### 2. `backend/src/agendamentos/agendamentos.service.ts` — verificarDisponibilidade

Adicionar método privado:

```typescript
private async verificarDisponibilidade(
  profissionalId: string,
  tenantId: string,
  dataHora: Date,
  duracaoMin: number,
  ignorarId?: string,
): Promise<void> {
  const fimAt = new Date(dataHora.getTime() + duracaoMin * 60_000);

  const conflito = await this.prisma.agendamento.findFirst({
    where: {
      tenant_id: tenantId,
      profissional_id: profissionalId,
      status: { notIn: ['cancelado', 'remarcado'] },
      id: ignorarId ? { not: ignorarId } : undefined,
      data_hora: { lt: fimAt },
      // fim calculado on-the-fly via query raw ou comparação com campo calculado
      // equivalente a: dataHora < existente.data_hora + duracao, ou seja:
      // existente começa antes do novo fim E o novo começa antes do existente terminar
    },
    select: { id: true, data_hora: true, duracao_minutos: true },
  });

  // Como o schema usa data_hora + duracao_minutos, filtrar o overlap no código:
  if (conflito) {
    const fimConflito = new Date(
      new Date(conflito.data_hora).getTime() + conflito.duracao_minutos * 60_000,
    );
    if (dataHora < fimConflito) {
      throw new BadRequestException(
        `Conflito de horário: profissional já tem agendamento das ${new Date(conflito.data_hora).toISOString()} com ${conflito.duracao_minutos}min`,
      );
    }
  }
}
```

**Integrar no `criar()`:** chamar `verificarDisponibilidade` dentro de `prisma.$transaction` se `profissional_id` estiver presente.

**Integrar no `remarcar()`:** chamar `verificarDisponibilidade` com `ignorarId = id` para excluir o agendamento sendo remarcado.

### 3. `backend/src/agendamentos/agendamentos.service.ts` — suporte a status `bloqueio`

Adicionar `'bloqueio'` à lista de status aceitos no `AtualizarStatusAgendamentoDto`. No `criar()`, permitir criação com `status: 'bloqueio'` e `cliente_id` opcional (nullable no DTO via `IsOptional`).

Atualizar `transicaoValida()` no DTO para incluir transições do status `bloqueio` (sem transições — bloqueio só pode ser cancelado/removido).

### 4. `backend/src/agendamentos/dto/criar-agendamento.dto.ts`

Tornar `cliente_id` opcional (`@IsOptional()`) para suportar criação de bloqueios sem cliente.

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `POST /agendamentos` com profissional e horário já ocupado retorna `400 Bad Request` com mensagem de conflito |
| AC-02 | `PATCH /agendamentos/:id/remarcar` verifica conflito excluindo o próprio agendamento |
| AC-03 | Campo `venda_id` existe no schema e migration foi gerada sem erros |
| AC-04 | `POST /agendamentos` com `status: 'bloqueio'` e `cliente_id` ausente cria bloqueio corretamente |
| AC-05 | Dois agendamentos sem conflito (horários não sobrepostos) passam pela verificação sem erro |
| AC-06 | `npm run build` e typecheck limpos em `backend/` |

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 3,00–5,00 (migration + método de conflito + integração) |
| Confiança | Alta — padrão Prisma, service existente |
| Valor gerado | Evita double-booking; base para interoperabilidade Onda C |
| Payback | Imediato — sem conflito de horário desde o primeiro agendamento |
| Custo de não fazer | Double-booking silencioso; dados inconsistentes para Onda C |
