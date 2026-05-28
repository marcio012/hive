---
id: BLUEPRINT_TOS_018_DASHBOARD
titulo: TOS-018 — Painel Operacional do Dia
backlog_ref: TOS-018
thread: tos-018-painel-dia
status: aprovado
data: 2026-05-28
responsavel: Claude (Arquiteto)
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target: tenantOS
cwd_exec: /home/marcio/job/tenantOS
---

# Blueprint — TOS-018: Painel Operacional do Dia

## 1. Contexto

`Dashboard.tsx` já existe no frontend mas está **desconectado** (sem rota) e chama
`api.getDashboard()` marcado como `@deprecated Legacy POS — Removed from HML`.

O backend NestJS não tem endpoint `/dashboard`. Os dados que o componente consumia
vêm do legado. Esta WO cria o endpoint correto e reconecta o frontend.

Dados necessários já existem no schema atual — **sem migration**.

---

## 2. Escopo

### O que entra

| # | Camada | Entrega |
|---|--------|---------|
| 1 | Backend | Novo módulo `src/dashboard/` com `GET /dashboard/dia` |
| 2 | Frontend | Novo tipo `DashboardDiaResponse` em `api.ts` |
| 3 | Frontend | `Dashboard.tsx` reescrito para usar endpoint novo |
| 4 | Frontend | Rota `/app/dashboard` adicionada em `routes.tsx` |
| 5 | Frontend | Home redirect alterado de `/app/sales` para `/app/dashboard` |

### O que NÃO entra

- Gráficos de 7 dias (recharts) — removidos nesta versão; complexidade sem retorno para showroom
- Radar de anomalias — depende de `perdas` e `fechamentos` (legacy); fora do escopo
- Somatório por vendedor — pode ser adicionado em onda futura
- `@Modulo('dashboard')` guard — dashboard disponível a todos os tenants autenticados

---

## 3. Backend — `src/dashboard/`

### Estrutura de arquivos a criar

```
src/dashboard/
  dashboard.module.ts
  dashboard.controller.ts
  dashboard.service.ts
```

### 3.1 DTO de resposta

```typescript
export interface DashboardDiaDto {
  // Vendas
  totalVendasHoje: number;          // soma de Venda.total onde data >= hoje 00:00
  quantidadeVendasHoje: number;     // count de vendas hoje
  ticketMedioHoje: number;          // média de Venda.total hoje (0 se sem vendas)
  ticketMedioOntem: number;         // média de Venda.total ontem (para delta)

  // Agendamentos
  proximosAgendamentos: Array<{
    id: string;
    dataHora: string;               // ISO string
    clienteNome: string;
    servicoNome: string;
    profissionalNome: string | null;
    duracaoMinutos: number;
    status: string;
  }>;

  // Estoque
  estoqueCritico: Array<{
    id: string;
    nome: string;
    quantidade: number;
    quantidadeMinima: number;
  }>;
}
```

### 3.2 DashboardService — queries

Todas as queries filtram por `tenantId` obtido via `TenantContext.getRequiredTenantId()`.

**Período do dia:**
```typescript
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);
const amanha = new Date(hoje);
amanha.setDate(amanha.getDate() + 1);

const ontem = new Date(hoje);
ontem.setDate(ontem.getDate() - 1);
```

**Vendas hoje:**
```typescript
const vendasHoje = await prisma.venda.findMany({
  where: {
    tenant_id: tenantId,
    data: { gte: hoje, lt: amanha },
    status: { not: 'cancelada' },
  },
  select: { total: true },
});
const totalVendasHoje = vendasHoje.reduce((s, v) => s + v.total, 0);
const quantidadeVendasHoje = vendasHoje.length;
const ticketMedioHoje = quantidadeVendasHoje > 0
  ? totalVendasHoje / quantidadeVendasHoje
  : 0;
```

**Ticket médio ontem:**
```typescript
const vendasOntem = await prisma.venda.findMany({
  where: {
    tenant_id: tenantId,
    data: { gte: ontem, lt: hoje },
    status: { not: 'cancelada' },
  },
  select: { total: true },
});
const ticketMedioOntem = vendasOntem.length > 0
  ? vendasOntem.reduce((s, v) => s + v.total, 0) / vendasOntem.length
  : 0;
```

**Próximos agendamentos (hoje, status agendado, a partir de agora, limit 10):**
```typescript
const agora = new Date();
const proximosAgendamentos = await prisma.agendamento.findMany({
  where: {
    tenant_id: tenantId,
    data_hora: { gte: agora, lt: amanha },
    status: 'agendado',
  },
  orderBy: { data_hora: 'asc' },
  take: 10,
  select: {
    id: true,
    data_hora: true,
    duracao_minutos: true,
    status: true,
    cliente: { select: { nome: true } },
    servico: { select: { nome: true } },
    profissional: { select: { nome: true } },
  },
});
```

**Estoque crítico:**
```typescript
const estoqueCritico = await prisma.produto.findMany({
  where: {
    tenant_id: tenantId,
    quantidade: { lte: prisma.produto.fields.quantidade_minima },
  },
  select: { id: true, nome: true, quantidade: true, quantidade_minima: true },
  orderBy: { quantidade: 'asc' },
});
```

> **Nota:** Prisma não suporta comparação entre dois campos diretamente.
> Usar query raw ou buscar todos e filtrar em memória:
```typescript
const produtos = await prisma.produto.findMany({
  where: { tenant_id: tenantId },
  select: { id: true, nome: true, quantidade: true, quantidade_minima: true },
});
const estoqueCritico = produtos.filter(p => p.quantidade <= p.quantidade_minima);
```

### 3.3 Controller

```typescript
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('dia')
  getDia(): Promise<DashboardDiaDto> {
    return this.service.getDia();
  }
}
```

### 3.4 Module

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
```

Registrar em `AppModule.imports`.

---

## 4. Frontend

### 4.1 Novo tipo em `api.ts`

Adicionar abaixo do `DashboardResponse` existente (manter o antigo — só adicionar):

```typescript
export type ProximoAgendamento = {
  id: string;
  dataHora: string;
  clienteNome: string;
  servicoNome: string;
  profissionalNome: string | null;
  duracaoMinutos: number;
  status: string;
};

export type ItemEstoqueCritico = {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
};

export type DashboardDiaResponse = {
  totalVendasHoje: number;
  quantidadeVendasHoje: number;
  ticketMedioHoje: number;
  ticketMedioOntem: number;
  proximosAgendamentos: ProximoAgendamento[];
  estoqueCritico: ItemEstoqueCritico[];
};
```

Adicionar método na `api`:
```typescript
getDashboardDia: () => request<DashboardDiaResponse>('/dashboard/dia', 'GET'),
```

### 4.2 Dashboard.tsx — reescrita

Substituir o componente atual por versão simplificada e conectada ao novo endpoint.

**Layout:** cards de KPI no topo (grid 4 colunas) + lista de agendamentos abaixo + estoque crítico.

**KPI Cards (4):**
1. Vendas do Dia — `totalVendasHoje` formatado como R$
2. Quantidade de Vendas — `quantidadeVendasHoje`
3. Ticket Médio Hoje — `ticketMedioHoje` como R$
4. Ticket Médio Ontem — `ticketMedioOntem` + delta percentual vs hoje

**Delta ticket médio:**
```typescript
const delta = ticketMedioOntem > 0
  ? ((ticketMedioHoje - ticketMedioOntem) / ticketMedioOntem) * 100
  : null;
// positivo → verde com ↑, negativo → vermelho com ↓, null → cinza "—"
```

**Próximos Agendamentos:**
- Lista vertical, até 10 itens
- Cada item: horário (formatado HH:mm) + nome do cliente + serviço + profissional + duração
- Se lista vazia: "Nenhum agendamento para hoje"

**Estoque Crítico:**
- Lista compacta com badge de alerta
- Cada item: nome + quantidade atual + quantidade mínima
- Se lista vazia: não renderizar a seção

**Cores:** usar `useTenantBranding` para cores primária e secundária nos ícones/badges dos cards.

### 4.3 routes.tsx

Adicionar rota e alterar redirect:

```typescript
import Dashboard from "./components/pages/Dashboard";

// Alterar redirect:
function AppHomeRedirect() {
  return <Navigate to="/app/dashboard" replace />;
}

// Adicionar à lista de children do /app:
{ path: "dashboard", Component: Dashboard },
```

---

## 5. Critérios de Aceite

- [ ] `GET /dashboard/dia` retorna JSON com os 4 campos de KPI + agendamentos + estoque
- [ ] Frontend conectado: cards exibem dados reais do tenant autenticado
- [ ] Demo tenant `demo-barbearia` acessa `/app/dashboard` e vê KPIs (podem ser zerados se sem vendas hoje — isso é correto)
- [ ] Lista de agendamentos renderiza quando há dados seeded, ou mostra estado vazio
- [ ] Estoque crítico aparece quando `quantidade <= quantidade_minima`
- [ ] `npm run check:types` (frontend) → OK
- [ ] `npm run check:types` (backend) → OK
- [ ] `npm test -- --runInBand` (backend) → sem regressão

---

## 6. Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 8–12 (backend novo + frontend reescrito) |
| Confiança | Alta — schema pronto, endpoint clean, componente base existe |
| Valor gerado | Showroom completo: demo tenant abre no dashboard com dados reais |
| Payback | Imediato para apresentação comercial |
| Custo de não fazer | Demo mostra tela de vendas vazia como home — sem narrativa de produto |

---

## 7. Débito Técnico Rastreável

- **DT-003:** `Dashboard.tsx` legacy (com recharts e chamadas deprecated) pode ser removido após esta onda ser validada em HML. Manter por ora para referência.
- **DT-004:** Endpoint `GET /dashboard` (legacy, sem módulo) — remover da `api.ts` em onda futura após validar que nada mais o referencia.
