---
id: WO-037
titulo: TOS-015-C — Agenda: Interoperabilidade concluir → venda
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

# WO-037 — TOS-015-C: Interoperabilidade Agenda → Venda

## Contexto

Esta WO implementa a transição `concluído → venda`: ao concluir um agendamento, o sistema facilita a criação de uma Venda vinculada. O `Agendamento` ganha `venda_id` (WO-035 já adiciona o campo). A Venda é criada via serviço idempotente — se `venda_id` já existir, retorna a venda existente sem criar duplicata.

**Dependência:** WO-035 deve estar executada (campo `venda_id` no schema).

## Escopo

### 1. `backend/src/agendamentos/agendamentos.service.ts` — `concluirComVenda`

Novo método:

```typescript
async concluirComVenda(
  id: string,
  user: JwtPayload,
): Promise<{ agendamento: AgendamentoResponse; venda_id: string; venda_criada: boolean }> {
  const tenantId = this.tenantContext.getRequiredTenantId();

  const agendamento = await this.prisma.agendamento.findFirst({
    where: { id, tenant_id: tenantId },
    include: { servico: { select: { id: true, preco: true, nome: true } } },
  });

  if (!agendamento) throw new NotFoundException('Agendamento não encontrado');

  if (!['presente', 'confirmado'].includes(agendamento.status)) {
    throw new BadRequestException(
      `Status atual '${agendamento.status}' não permite conclusão com venda`,
    );
  }

  // Idempotência: se venda_id já existe, retornar sem criar nova venda
  if (agendamento.venda_id) {
    const atualizado = await this.prisma.agendamento.update({
      where: { id },
      data: { status: 'concluido' },
      select: AGENDAMENTO_SELECT,
    });
    return { agendamento: atualizado, venda_id: agendamento.venda_id, venda_criada: false };
  }

  // Transação: criar Venda + VendaItem + atualizar Agendamento
  const resultado = await this.prisma.$transaction(async (tx) => {
    const venda = await tx.venda.create({
      data: {
        tenant_id: tenantId,
        usuario_id: user.sub,
        total: Number(agendamento.servico?.preco ?? 0),
        status: 'fechada',
        meio_pagamento: 'outro',
      },
    });

    if (agendamento.servico) {
      await tx.vendaItem.create({
        data: {
          tenant_id: tenantId,
          venda_id: venda.id,
          produto_id: agendamento.servico.id,
          quantidade: 1,
          valor_unitario: Number(agendamento.servico.preco),
        },
      });
    }

    const agendamentoAtualizado = await tx.agendamento.update({
      where: { id },
      data: { status: 'concluido', venda_id: venda.id },
      select: AGENDAMENTO_SELECT,
    });

    return { agendamento: agendamentoAtualizado, venda_id: venda.id };
  });

  return { ...resultado, venda_criada: true };
}
```

### 2. `backend/src/agendamentos/agendamentos.controller.ts`

Novo endpoint:

```typescript
@Patch(':id/concluir-com-venda')
concluirComVenda(
  @Param('id') id: string,
  @CurrentUser() user: JwtPayload,
) {
  return this.agendamentosService.concluirComVenda(id, user);
}
```

### 3. `frontend/src/app/api.ts`

Adicionar função:

```typescript
concluirAgendamentoComVenda: (id: string) =>
  api.patch<{ agendamento: AgendamentoMVP; venda_id: string; venda_criada: boolean }>(
    `/agendamentos/${id}/concluir-com-venda`
  ).then(r => r.data),
```

Adicionar `venda_id?: string` ao tipo `AgendamentoMVP`.

### 4. `frontend/src/app/components/pages/Agenda.tsx`

Na ação de "Concluir" (dentro de `PROXIMAS_ACOES`):
- Substituir o `PATCH /:id/status` para o status `concluido` pelo novo endpoint `concluir-com-venda`
- Após conclusão bem-sucedida: exibir toast/badge com "Venda criada" e botão "Ver venda" (navegar para `/vendas/:venda_id`)
- Se `venda_criada === false`: exibir "Venda já registrada" com botão "Ver venda"

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `PATCH /agendamentos/:id/concluir-com-venda` cria Venda + VendaItem + atualiza `status` e `venda_id` no Agendamento |
| AC-02 | Segunda chamada ao endpoint para o mesmo agendamento retorna `venda_criada: false` sem criar nova venda |
| AC-03 | Agendamento com status diferente de `presente`/`confirmado` retorna `400` |
| AC-04 | Frontend exibe feedback visual após conclusão com link para a venda |
| AC-05 | Build e typecheck limpos em `backend/` e `frontend/` |

## Nota sobre responsabilidade financeira

A venda criada tem `total = servico.preco` e `meio_pagamento = 'outro'`. A edição do meio de pagamento ou desconto fica na tela de Vendas — este endpoint apenas cria a entrada inicial. Essa simplificação foi validada no DEBATE-029.

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 3,00–5,00 (novo endpoint + transação + UI feedback) |
| Confiança | Alta — padrão de criação de Venda já existe no sistema |
| Valor gerado | Fecha o ciclo operacional: agendamento → atendimento → venda |
| Payback | Imediato — elimina etapa manual de abrir PDV separado para registrar venda de serviço |
| Custo de não fazer | Usuário precisa criar a venda manualmente no PDV após atender — fricção operacional |
