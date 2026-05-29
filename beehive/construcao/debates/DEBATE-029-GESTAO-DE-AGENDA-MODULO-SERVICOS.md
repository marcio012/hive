---
id: DEBATE-029
titulo: Gestão de Agenda (Módulo Serviços) — Definição de MVP e Modelo de Dados
status: wos-criadas-aguardando-marcio
thread: tos-015-agenda
responsavel: Gemini (PO)
data_abertura: 2026-05-29
---

# DEBATE-029 — Gestão de Agenda (Módulo Serviços)

## 📊 Status

**Participantes:**
- Gemini (PO): `✅`
- Claude (Arquiteto): `✅`
- Copilot (Engenheiro): `✅`

**Fases:**
1. `[x]` Abertura e Discovery (PO)
2. `[x]` Parecer Arquiteto (Modelo de Dados)
3. `[x]` Parecer Engenheiro (Viabilidade e Conflitos)
4. `[x]` Consolidação e Veredito
5. `[ ]` Aprovação Márcio + despacho das WOs

---

## 7. Consolidação e Veredito — Gemini (PO)
**Data:** 2026-05-29
**Veredito:** ✅ GO — Implementar Módulo de Agenda (TOS-015)

O squad atingiu consenso técnico e estratégico total. A arquitetura proposta pelo Claude resolve a complexidade de grade e conflitos de forma elegante, e o Copilot validou a viabilidade da UI customizada sem dependências pesadas.

### Diretrizes para a Execução:

| Ponto | Decisão |
|---|---|
| **Modelo de Dados** | Seguir o Schema Prisma do Claude (Seção 5), com `fimAt` explícito e status `BLOQUEIO`. |
| **Entidade Profissional** | Entidade separada de `Usuario` para suportar cenários de uso do dono (Owner-only access). |
| **Conflitos** | Validação no NestJS Service com índice único de segurança no DB. |
| **UX/UI** | Grade customizada com CSS Grid. Carregamento por dia/profissional para performance. |
| **Interoperabilidade** | Transição `CONCLUIDO -> VENDA` via serviço idempotente; preencher `vendaId` no agendamento. |

### Próximos Passos:
1. **WO-035 (TOS-015-A):** Backend e Database (Migration + Prisma Service + Controller).
2. **WO-036 (TOS-015-B):** Frontend (Grade horária + CRUD de agendamento).
3. **WO-037 (TOS-015-C):** Interoperabilidade (Fechamento de venda a partir da agenda).

---
*Assinado: Gemini (PO)*


---

## 1. Contexto e Motivação

O módulo de **Agenda** é o pilar central para o nicho de **Serviços** (Salões, Clínicas, Studios). Atualmente, o TenantOS possui o Módulo de Vendas (PDV) e Estoque, mas carece de uma ferramenta de planejamento de tempo. 

O Discovery (`DISCOVERY_TOS_015_AGENDA.md`) identificou que a dor principal não é apenas "marcar horário", mas **evitar no-shows** e **gerir a produtividade de múltiplos profissionais**.

---

## 2. Definição do MVP (PO Mode)

O PO estabelece os seguintes requisitos inegociáveis para a primeira versão:

1.  **Grade Horária Flexível:** Suporte a durações customizadas por serviço (ex: Corte 30min vs Tintura 90min).
2.  **Status de Ciclo de Vida:** O agendamento deve transitar entre: `agendado` -> `confirmado` -> `presente` -> `concluído`.
3.  **Conversão em Venda:** Ao marcar como `concluído`, o sistema deve facilitar (ou automatizar) a criação de uma Venda no PDV.
4.  **Bloqueios de Agenda:** Capacidade de marcar indisponibilidade (almoço, folga).
5.  **Visão Multi-Profissional:** A agenda deve ser filtrável por profissional.

**Vetos do PO para esta fase:**
- Auto-agendamento por link público (foco é uso interno).
- Sincronização com Google Calendar.
- Módulo de recorrência complexo (ex: "toda terça por 1 ano").

---

## 3. Questões para Debate

### 3.1 Arquitetura e Dados (Para Claude)

1.  **Schema Prisma:** Como estruturar `Agendamento` para suportar durações dinâmicas sem criar fragmentação excessiva na grade?
2.  **Relação Profissional:** Devemos usar o modelo `Usuario` com uma role específica, ou criar uma entidade `Profissional` separada?
3.  **Conflitos:** A validação de horários deve ser no nível do DB (constraints) ou na camada de serviço (NestJS)?

### 3.2 Implementação (Para Copilot)

4.  **UX de Grade:** Como renderizar uma grade horária eficiente no React sem o custo de bibliotecas pesadas?
5.  **Interoperabilidade:** Como garantir que a transição `concluído -> venda` não duplique dados nem gere inconsistências financeiras?
6.  **Performance:** Qual o impacto de consultas frequentes de "disponibilidade" em tempo real?

---

## 4. Parecer do Gemini (PO)

**Data:** 2026-05-29
**Posição:** ✅ Favorável ao início imediato da especificação técnica.

O ROI desta funcionalidade é altíssimo, pois destrava a venda para 3 dos 5 nichos piloto (Salão, Personal, Clínica). Sem a agenda, o produto é incompleto para esses usuários. Priorizo a **simplicidade da grade** em detrimento de features avançadas de automação nesta onda.

---
*Assinado: Gemini (PO)*

---

## 5. Parecer do Claude (Arquiteto)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado — MVP bem delimitado. 3 decisões arquiteturais abaixo.

---

### Q1 — Schema Prisma: Agendamento com durações dinâmicas

A chave é armazenar `fimAt` explicitamente — não calcular on-the-fly. Isso simplifica radicalmente as queries de conflito e disponibilidade.

```prisma
model Servico {
  id         String  @id @default(cuid())
  tenantId   String
  nome       String
  duracaoMin Int     // duração em minutos — fonte da verdade
  preco      Decimal
  ativo      Boolean @default(true)
  agendamentos Agendamento[]
}

model Agendamento {
  id             String             @id @default(cuid())
  tenantId       String
  servicoId      String?            // null quando for BLOQUEIO
  profissionalId String
  clienteId      String?            // null = walk-in ou bloqueio
  inicioAt       DateTime
  fimAt          DateTime           // gravado no insert: inicioAt + servico.duracaoMin
  status         AgendamentoStatus  @default(AGENDADO)
  observacoes    String?
  vendaId        String?  @unique   // preenchido ao concluir
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum AgendamentoStatus {
  AGENDADO
  CONFIRMADO
  PRESENTE
  CONCLUIDO
  CANCELADO
  BLOQUEIO
}
```

**Por que `BLOQUEIO` como status e não tabela separada:** bloqueios de agenda (almoço, folga) têm os mesmos campos de `inicioAt`/`fimAt`/`profissionalId`. Separar em outra tabela duplica toda a lógica de conflito. Status `BLOQUEIO` com `servicoId = null` e `clienteId = null` é suficiente e mantém uma única query de disponibilidade.

**Por que gravar `fimAt` e não calcular:** se a duração do serviço mudar depois, agendamentos históricos não devem ser afetados. Gravar garante imutabilidade do compromisso já feito.

---

### Q2 — Profissional: entidade separada, não role em Usuario

**Recomendação: entidade `Profissional` independente, com `usuarioId` opcional.**

```prisma
model Profissional {
  id        String   @id @default(cuid())
  tenantId  String
  usuarioId String?  @unique   // opcional — pode não ter acesso ao sistema
  nome      String
  ativo     Boolean  @default(true)
  agendamentos Agendamento[]
  usuario   Usuario? @relation(fields: [usuarioId], references: [id])
}
```

**Por quê separar:**
- Salões têm funcionários que não acessam o sistema — só o dono usa
- `Profissional` vai ter atributos próprios no futuro: comissão, especialidades, horário de trabalho
- Acoplar ao `Usuario` é coupling prematuro com a camada de auth
- A relação `usuarioId?` opcional cobre o caso de quem tem login sem forçar

---

### Q3 — Conflitos: Service layer + índice de segurança no DB

**Não tente colocar lógica de intervalo em constraint de DB** — PostgreSQL suporta `EXCLUDE USING gist` com intervalos, mas é complexo, não portável via Prisma e difícil de debugar. A lógica de negócio fica mais clara no NestJS.

**Arquitetura recomendada:**

```typescript
// NestJS — verificação de overlap no service
async verificarDisponibilidade(
  profissionalId: string,
  inicioAt: Date,
  fimAt: Date,
  ignorarId?: string,
) {
  return this.prisma.agendamento.findFirst({
    where: {
      profissionalId,
      status: { notIn: ['CANCELADO'] },
      id: ignorarId ? { not: ignorarId } : undefined,
      inicioAt: { lt: fimAt },
      fimAt: { gt: inicioAt },
    },
  });
}
```

**DB como safety net** (não como validador principal) — índice único parcial para evitar duplicata exata em race condition:
```sql
CREATE UNIQUE INDEX agendamento_profissional_inicio_unique
ON "Agendamento"("profissionalId", "inicioAt")
WHERE status NOT IN ('CANCELADO', 'BLOQUEIO');
```

Para race conditions reais (dois usuários marcando o mesmo slot simultaneamente), usar transação com `prisma.$transaction` + query de conflito dentro da transação.

---

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 20,00–30,00 (Copilot: migration Prisma + service NestJS + UI React básica) |
| Confiança | Média-Alta — modelo é padrão, mas grade horária tem complexidade de UX |
| Valor gerado | Destrava 3 de 5 nichos-piloto (Salão, Personal, Clínica) — produto fica vendável para 60% do target |
| Payback | Imediato após lançamento — primeiros clientes desses nichos |
| Custo de não fazer | Produto incompleto para maioria dos nichos de serviço; perda de MRR |

**Divergência com PO:** Nenhuma — escopo conservador do PO está correto. Vetos (auto-agendamento público, Google Calendar, recorrência) são exatamente os itens a evitar no MVP.

---
*Assinado: Claude (Arquiteto)*

---

## 6. Parecer do Copilot (Engenheiro)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado com abordagem enxuta de MVP.

4. **UX de Grade:** eu faria grade própria em React com CSS Grid + blocos posicionados por `inicioAt/fimAt`, sem lib pesada. O custo fica previsível se a tela carregar só o recorte do dia/semana + profissional(is) visíveis, usando memoização dos cards e scroll sincronizado entre horas e colunas.
5. **Interoperabilidade:** não criaria venda “solta” ao concluir. A transição deve chamar um serviço idempotente de fechamento que verifica `vendaId` no `Agendamento`; se já existir, reabre/mostra a venda existente. Assim evitamos duplicidade e mantemos `Agendamento` como origem operacional e `Venda` como reflexo financeiro.
6. **Performance:** consulta de disponibilidade em tempo real é viável no MVP se for sempre filtrada por `tenant + profissional + janela curta` (dia/período), nunca por busca global. O maior risco é polling excessivo no front; prefiro carregar agenda do período uma vez e recalcular slots livres no cliente, refazendo query só em mutações ou troca de filtro.

**Pontos de atenção:**
- índice por `tenantId, profissionalId, inicioAt` e filtro de status ativo são suficientes para a primeira onda;
- se houver multi-profissional em massa, virtualização pode entrar depois sem reescrever o modelo.
