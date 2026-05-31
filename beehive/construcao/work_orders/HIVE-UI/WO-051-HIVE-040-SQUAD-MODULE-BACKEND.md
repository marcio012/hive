---
id: WO-051
titulo: SquadModule Backend — GET/PUT /api/squad + squad.json
executor: Copilot-Hive
status: concluida
prioridade: alta
backlog_ref: HIVE-UI
thread: gestao-squad
debate_ref: DEBATE-040
---

# WO-051: SquadModule — API de Gestão de Squad (Backend)

## 1. Contexto

DEBATE-040 aprovado por Márcio em 2026-05-31. O mapeamento modelo → papel está
pulverizado em `roles.yaml`, `MapaFabrica.tsx` e `governance.repository.ts`, todos hardcoded.
Esta WO cria a camada de persistência e API para centralizar esses dados em `squad.json`.

## 2. Tarefas Técnicas

### 2.1 Criar `beehive/squad.json` com os valores atuais

Criar o arquivo com os 4 membros fixos. **Este é o seed inicial:**

```json
[
  {
    "id": "gemini",
    "name": "Gemini",
    "role": "Facilitador Estratégico / PO",
    "model": "gemini-1.5-pro",
    "initial": "G",
    "inbox": "beehive/construcao/inbox-gemini.md",
    "active": true
  },
  {
    "id": "claude",
    "name": "Claude",
    "role": "Arquiteto + Auditor Técnico",
    "model": "claude-sonnet-4-6",
    "initial": "C",
    "inbox": "beehive/construcao/inbox-claude.md",
    "active": true
  },
  {
    "id": "copilot",
    "name": "Copilot",
    "role": "Engenheiro / Executor",
    "model": "gpt-4o",
    "initial": "P",
    "inbox": "beehive/construcao/inbox-copilot-hive.md",
    "active": true
  },
  {
    "id": "marcio",
    "name": "Márcio",
    "role": "Owner / The Gate",
    "model": "Human",
    "initial": "M",
    "active": true
  }
]
```

### 2.2 Criar `SquadModule` no NestJS

Localização: `beehive/apps/hive-ui/backend/src/squad/`

Arquivos a criar:
- `squad.module.ts`
- `squad.service.ts`
- `squad.controller.ts`
- `squad.dto.ts`

**`squad.dto.ts`** — shape fechado:
```typescript
export class SquadMemberDto {
  id: string;
  name: string;
  role: string;
  model: string;
  initial: string;
  inbox?: string;
  active: boolean;
}
```

**`squad.service.ts`** — lê/escreve `squad.json` via `HIVE_ROOT`:
```typescript
@Injectable()
export class SquadService {
  private get filePath(): string {
    return path.join(this.config.get('HIVE_ROOT'), 'beehive', 'squad.json');
  }

  async getSquad(): Promise<SquadMemberDto[]> {
    const raw = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(raw);
  }

  async updateSquad(members: SquadMemberDto[]): Promise<SquadMemberDto[]> {
    await fs.writeFile(this.filePath, JSON.stringify(members, null, 2), 'utf-8');
    return members;
  }
}
```

**`squad.controller.ts`** — endpoints protegidos por `JwtAuthGuard`:
```typescript
@Controller('api/squad')
@UseGuards(JwtAuthGuard)
export class SquadController {
  @Get()
  getSquad() { return this.squadService.getSquad(); }

  @Put()
  updateSquad(@Body() members: SquadMemberDto[]) {
    return this.squadService.updateSquad(members);
  }
}
```

### 2.3 Registrar `SquadModule` no `AppModule`

Importar e declarar no `app.module.ts`.

### 2.4 Migrar `defaultRole` hardcoded em `governance.repository.ts`

Substituir os valores hardcoded de `defaultRole` pelos valores lidos do `squad.json`
via `SquadService`. Injetar o serviço ou passar os dados como parâmetro.

## 3. Critérios de Aceite

- [x] `beehive/squad.json` criado com os 4 membros seed
- [x] `GET /api/squad` retorna array de `SquadMemberDto`
- [x] `PUT /api/squad` persiste alterações em `squad.json` (escrita atômica)
- [x] `governance.repository.ts` lê `role` do `squad.json` (não hardcoded)
- [x] `check:types` verde
- [x] `build` verde

## 4. Escopo Negativo

- **Não** modificar `roles.yaml`
- **Não** criar endpoints para adicionar/remover membros (IDs são fixos na V1)
- **Não** expor capabilities (`can_audit_code`, etc.) via API
- **Não** criar tabela no SQLite — `squad.json` é a persistência

---
*Redigido por: Claude (Arquiteto) — 2026-05-31*
