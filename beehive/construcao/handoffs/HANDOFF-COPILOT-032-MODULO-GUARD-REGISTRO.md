# Handoff Executável — Registro do ModuleGuard como APP_GUARD

**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-27
**Thread:** gestao-tenants-core
**Debate/Blueprint de origem:** `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md`
**Status do debate:** Consolidado e aprovado pelo Márcio

---

## Destino Operacional (DIR-082 — obrigatório em handoffs multi-repo)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS/backend
```

---

## Contexto

O DEBATE-014 definiu a arquitetura de módulos plugáveis. A implementação está 95% concluída — `ModuleGuard`, decorator `@Modulo()`, `BLUEPRINT_PRESETS`, `OnboardingService` e `/session/me` estão todos implementados e o build passa sem erros.

**O único gap que impede o funcionamento real:** o `ModuleGuard` nunca foi registrado como `APP_GUARD` no `app.module.ts`. Os decorators existem nos controllers mas nenhuma guarda os executa — qualquer tenant sem módulo acessa tudo livremente.

Há também um `ModuloGuard` duplicado em `src/common/guards/` que é órfão e deve ser removido.

---

## Sequência de implementação (obrigatória — nesta ordem)

### Etapa 1 — Registrar `ModuleGuard` como `APP_GUARD` global

**Arquivo:** `apps/core/src/app.module.ts`

Adicionar o provider global:

```typescript
import { APP_GUARD } from '@nestjs/core';
import { ModuleGuard } from './modules/module.guard';

// No array providers do @Module:
providers: [
  {
    provide: APP_GUARD,
    useClass: ModuleGuard,
  },
],
```

O `app.module.ts` não tem `providers` atualmente — adicionar a propriedade.

### Etapa 2 — Remover duplicata órfã

Deletar os dois arquivos que não são referenciados por nenhum controller ou módulo:
- `src/common/guards/modulo.guard.ts`
- `src/common/decorators/modulo.decorator.ts`

Verificar antes da remoção:
```bash
grep -rn "common/guards/modulo\|common/decorators/modulo" src/
```
Deve retornar zero ocorrências.

### Etapa 3 — Validação

```bash
# Tipos sem erro
npm run check:types

# Build limpo
npm run build

# Verificar que guard está ativo: tenant sem módulo 'pdv' deve receber 403 em POST /vendas
# (teste manual ou via curl com token de tenant sem pdv no TenantModulo)
```

---

## Critérios de aceite

- [ ] `npm run check:types` → zero erros
- [ ] `npm run build` → zero erros
- [ ] `ModuleGuard` registrado como `APP_GUARD` em `app.module.ts`
- [ ] Arquivos órfãos removidos (`common/guards/modulo.guard.ts` e `common/decorators/modulo.decorator.ts`)
- [ ] Aceite técnico gerado em `beehive/registry/aceites/`

---

## O que NÃO fazer

- Não alterar a lógica do `ModuleGuard` existente em `src/modules/module.guard.ts`
- Não mover o decorator `@Modulo()` — controllers já importam de `../modules/module.decorator`
- Não tocar no `OnboardingService` nem no `SessionService`
- Não alterar o schema Prisma
