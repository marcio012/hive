---
id: WO-034
titulo: HIVE-021 — Painel de Diretrizes e Governança na Hive UI
backlog_ref: HIVE-021
debate_ref: beehive/construcao/debates/DEBATE-032-PAINEL-DIRETRIZES-GOVERNANCA.md
ideacao_ref: beehive/cognition/intuition/brainstorm/HIVE_UI_PAINEL_DIRETRIZES.md
status: concluída
executor: Copilot
auditor: Claude
data: 2026-05-29
thread: hive-ui-diretrizes-governanca
---

# WO-034 — HIVE-021: Painel de Diretrizes e Governança

## Contexto

O DEBATE-032 foi consolidado com veredito GO. O Painel de Governança torna as regras do Hive (DIRs, Manifesto, Roles) visíveis na UI sem abrir arquivos manualmente — valor imediato para auditoria e onboarding.

Decisão arquitetural: **não aguardar DEBATE-031** (Prisma/PG). Implementar file-based com `GovernanceRepository` abstrato que facilita migração posterior sem alterar contrato da UI.

## Escopo

### 1. `apps/hive-ui/backend/src/hive/governance.repository.ts`

Criar interface e adapter file-based:

```typescript
export interface DirectiveEntry {
  id: string;        // ex: "DIR-001"
  titulo: string;
  resumo: string;    // primeira linha não-vazia após o título
  data?: string;
  status?: string;   // "ativo" | "revogado" | undefined
}

export interface ManifestoContent {
  principios: Array<{ titulo: string; corpo: string }>;
}

export interface RoleEntry {
  agente: string;    // "claude" | "copilot" | "gemini" | "marcio"
  papel: string;
  descricao: string;
}

export interface GovernanceData {
  directives: DirectiveEntry[];
  manifesto: ManifestoContent;
  roles: RoleEntry[];
}

export interface GovernanceRepository {
  listDirectives(): Promise<DirectiveEntry[]>;
  getManifesto(): Promise<ManifestoContent>;
  listRoles(): Promise<RoleEntry[]>;
  getAll(): Promise<GovernanceData>;
}
```

**FileBasedGovernanceRepository** (adapter):
- `listDirectives()`: parser resiliente de `beehive/cognition/diretrizes.md` — extrair entradas `DIR-NNN` com título, resumo e status. Retorna `[]` se o arquivo não existir.
- `getManifesto()`: leitura de `beehive/dna/manifesto.md` — extrair seções `## N. Título` como princípios. Retorna objeto vazio `{ principios: [] }` se não existir.
- `listRoles()`: leitura de `beehive/roles/roles.yaml` — extrair agentes com papel e descrição. Fallback para `beehive/roles/*.md` se yaml falhar.

**Critério de resiliência:** nenhum método lança exceção — sempre retorna tipo vazio em caso de arquivo ausente ou parse error (logar `warn` internamente).

### 2. `apps/hive-ui/backend/src/hive/hive.service.ts`

- Instanciar `FileBasedGovernanceRepository` no construtor
- Adicionar campo `governance: GovernanceData` em `getHiveState()`
- Adicionar type `GovernanceData` (e sub-types) ao modelo de estado

### 3. `apps/hive-ui/frontend/src/hooks/useHiveSocket.ts`

Adicionar `governance` ao tipo `HiveState` (espelhar o DTO do backend).

### 4. `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx`

Adicionar nova aba **"Governança"** ao toggle de abas existente:

- **Explorador de DIRs:** lista de cards ou rows com `id`, `titulo`, `resumo`, `status` (badge "ativo"/"revogado")
- **Manifesto Vivo:** seções expansíveis com título e corpo de cada princípio
- **Mindset por Agente:** 4 cards (Claude, Copilot, Gemini, Márcio) com `papel` + `descricao`
- Empty state para cada bloco se dados não chegarem

**Não incluir:**
- Campo `origem_ref` ou links para debates/commits (V2)
- Nenhum controle de escrita ou edição

### 5. `apps/hive-ui/frontend/src/hive.css`

Classes prefixo `.gov-*`:
- `.gov-section` — bloco de seção (DIRs / Manifesto / Roles)
- `.gov-dir-row` — linha de diretriz
- `.gov-badge` — badge de status (ativo/revogado)
- `.gov-manifesto-item` — item de princípio (expansível)
- `.gov-role-card` — card de agente

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `GET /api/hive/state` retorna campo `governance` com `directives`, `manifesto`, `roles` |
| AC-02 | `governance.directives` lista pelo menos as DIRs do `diretrizes.md` com `id`, `titulo`, `resumo` |
| AC-03 | `governance.manifesto` retorna os princípios do `manifesto.md` com `titulo` e `corpo` |
| AC-04 | `governance.roles` retorna os 4 agentes com `agente`, `papel`, `descricao` |
| AC-05 | Falha de leitura de qualquer arquivo de governança retorna dado vazio — sem erro 500 |
| AC-06 | Nova aba "Governança" aparece no Centro de Controle e renderiza as 3 seções |
| AC-07 | Empty state exibido por bloco quando dados não chegam |
| AC-08 | Build e typecheck limpos (`npm run build` + `npm run check:types` no `apps/hive-ui`) |

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 2,00–4,00 (nova tela read-only + parser resiliente) |
| Confiança | Alta — padrão de parsing já existe no service para debates e inbox |
| Valor gerado | Governança visível sem abrir arquivos; reduz fricção de auditoria |
| Payback | Imediato — usado em toda sessão de auditoria do Márcio |
| Custo de não fazer | Governança invisível na UI; onboarding mais difícil para novos agentes/colaboradores |

## Não fazer

- Não aguardar DEBATE-031 — file-based é a fonte agora
- Não adicionar editor ou controles de escrita
- Não implementar alertas de quebra de regra em tempo real
- Não adicionar `origem_ref` (rastreabilidade DIR→entrega é V2)
- Não criar tela independente — aba dentro do Centro de Controle
