# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

---

### [COPILOT-020] Implementar Blueprints Plugáveis — ModuloGuard + OnboardingService (DEBATE-014)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-014-modulos-plugaveis
**Status:** pendente

DEBATE-014 consolidado e aprovado. Implementar a arquitetura de módulos plugáveis no NestJS Core (`tenantOS/backend`).

**Sequência obrigatória:**

**1. `ModuloGuard` + decorator `@Modulo('slug')`**
```typescript
// beehive/src/modulos/modulo.guard.ts
// beehive/src/modulos/modulo.decorator.ts
@Modulo('pdv') // aplica nos controllers
```
- Guard consulta `TenantModulo` onde `tenantId = contexto` e `moduloSlug = slug`
- Retorna 403 se o tenant não tiver o módulo ativo

**2. Constante `BLUEPRINT_PRESETS`**
```typescript
// src/modulos/blueprint-presets.ts
export const BLUEPRINT_PRESETS = {
  varejo:      ['pdv', 'estoque', 'clientes'],
  servicos:    ['agenda', 'clientes'],
  restaurante: ['pdv', 'estoque', 'clientes', 'mesas', 'cozinha'],
}
```

**3. `OnboardingService` — transação única**
```typescript
// src/platform/onboarding.service.ts
async onboard(dto: OnboardingDto) {
  return this.prisma.$transaction([
    prisma.tenant.create(...),
    prisma.tenantModulo.createMany({ data: presets }),
    prisma.usuario.create(...admin...),
  ])
}
```

**4. `/session/me` retorna `modulosAtivos`**
- Adicionar ao response: `modulosAtivos: string[]` — lista dos slugs ativos do tenant

**5. Aplicar `@Modulo()` nos controllers existentes**
- `VendasController` → `@Modulo('pdv')`
- `ProdutosController` → `@Modulo('estoque')`
- `ClientesController` → `@Modulo('clientes')`
- `AgendamentosController` → `@Modulo('agenda')`

**Critérios de aceite:**
- [ ] Tenant sem módulo `pdv` recebe 403 em `POST /vendas`
- [ ] `OnboardingService` com `blueprint=varejo` cria tenant + 3 módulos + admin em transação única
- [ ] `GET /session/me` retorna `modulosAtivos: ['pdv', 'estoque', 'clientes']` para tenant Varejo
- [ ] Adicionar Blueprint novo = 1 linha em `BLUEPRINT_PRESETS`, zero migration

**Ponto de parada:** retornar ao Claude com evidência de `POST /vendas` retornando 403 para tenant sem `pdv`.

---

### [COPILOT-019] Script `squad:next` — Roteamento do Coordenador (DEBATE-013)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-013-orquestrador
**Status:** executada

**Contexto:** DEBATE-013 aprovado. O Gemini Coordenador propõe um Plano de Voo numerado. O `squad:next` executa o item escolhido pelo Márcio.

**Contrato fechado:**

Criar `beehive/bin/hive-next.sh` e registrar como `squad:next` no `package.json`.

```bash
# Uso: npm run squad:next <número>
# Exemplo: npm run squad:next 1
```

**Comportamento esperado:**
1. Recebe o número do item do Plano de Voo como argumento
2. Lê `session-state.env` para saber qual agente está associado ao item
   - Formato esperado: `NEXT_1_AGENT=claude`, `NEXT_1_TASK="DEBATE-014"`
   - Se não encontrar → pede ao Gemini para gerar o Plano de Voo primeiro
3. Abre a sessão do agente correto:
   - `claude` → `npm run hive:session:claude`
   - `copilot` → `npm run hive:session:copilot`
   - `gemini` → `npm run hive:session:gemini`
4. Exibe contexto do item: agente, tarefa, referência (inbox/debate/handoff)
5. Registra em `session-state.env`: `CURRENT_ITEM=<N>`, `CURRENT_AGENT=<agente>`

**Alternativa simples (se session-state não tiver os itens):**
Exibir mensagem: `"Plano de Voo não encontrado. Rode npm run gemini:coordenador primeiro."`

**Adicionar ao package.json:**
```json
"squad:next": "bash beehive/bin/hive-next.sh"
```

**Critérios de aceite:**
- [ ] `npm run squad:next 1` abre sessão do agente do item 1 sem erro
- [ ] Exibe tarefa e referência do item antes de abrir sessão
- [ ] Falha graciosamente se Plano de Voo não existir no session-state

---

### [COPILOT-018] Parecer técnico no DEBATE-014 — Módulos Plugáveis
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-modulos-plugaveis
**Status:** executada

Ler `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md` e responder na seção **"Parecer do Copilot"**.

Questões direcionadas (seção 3 do debate):
1. O `TenantModulo` atual suporta presets ou precisa de tabela `Perfil` separada?
2. Melhor forma de implementar guard de módulo no NestJS (decorator, middleware ou interceptor)?
3. Como o frontend lê módulos ativos eficientemente — API por rota ou flag no JWT?
4. Risco de performance: flags por request vs. cache no token?

---

### [COPILOT-016] Sidecar V3 — Implementação do runtime isolado do Squad Framework
**thread:** DEBATE-007
**de:** claude
**para:** copilot
**status:** executada
**data:** 2026-05-26

DEBATE-007 consolidado e aprovado pelo Márcio. Implementar o isolamento do Squad Framework em `.agile-squad/framework/` com runtime Node v24 próprio.

**Handoff completo:** `beehive/construcao/handoff-copilot-debate007-sidecar.md`

Sequência obrigatória: estrutura do sidecar → migrar inbox/bridge → demais scripts → proxies na raiz → validação final.
Condições C1–C6 são gate de entrega — ver handoff.

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [COPILOT-014] Implementar sistema real de locks e corrigir hive-insight.sh
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** bin-scripts-debttech
**Status:** executada

---

#### Contexto
Auditoria dos scripts em `beehive/bin/` identificou dois itens com implementação incompleta:
1. `hive-lock.sh` — os comandos `set` e `release` são placeholders que imprimem mensagem mas **não persistem nada**. O sistema de lock que protege contra conflitos de agentes é não-funcional.
2. `hive-insight.sh` — referencia `insights-buffer.md` que pode não existir; a inserção via `sed` por linha-âncora é frágil.

**Débito técnico registrado pelo Claude (2026-05-26).**

---

#### Contrato fechado — implementar exatamente isso:

**Entrega 1 — `beehive/bin/hive-lock.sh` (reescrita real)**

Implementar persistência real usando `jq` + arquivo JSON em `.hive-agent/locks.json`.

Estrutura do `locks.json`:
```json
{
  "owner": "claude",
  "activity": "blueprinting DEBATE-007",
  "acquired_at": "2026-05-26T14:30:00Z"
}
```

Comandos a implementar:
- `set <owner> "<activity>"` → escreve `locks.json`; falha com exit 1 se já existe lock de outro owner
- `release <owner>` → remove `locks.json` se owner confere; falha com exit 1 se owner diverge
- `check <owner> read|write` → lê `locks.json`; exit 0 se livre ou mesmo owner; exit 1 se bloqueado

Requisitos:
- Criar `.hive-agent/` se não existir
- Se `jq` não estiver instalado → `echo "ERRO: jq requerido" && exit 1`
- Saída colorida (GREEN=acquired, YELLOW=warning, RED=blocked)
- Mensagens em português, consistentes com os outros scripts

**Entrega 2 — `beehive/bin/hive-insight.sh` (correção de robustez)**

Problemas atuais:
- `BUFFER_FILE` pode não existir → criar automaticamente se ausente, incluindo o cabeçalho padrão
- Inserção por linha-âncora via `sed` quebra se a âncora não existe → usar `echo >>` como fallback seguro

Correções:
1. Se `insights-buffer.md` não existir → criar com cabeçalho:
   ```markdown
   # Insights Buffer — Hive Framework
   > Registro de aprendizados e padrões capturados durante a operação.
   > Append-only. Não deletar entradas.

   <!-- insights abaixo -->
   ```
2. Substituir a inserção `sed` por append confiável ao final do arquivo, preservando a seção
3. Manter o formato de entrada existente: `**[DATA] [AGENTE]:** texto`

---

#### Critérios de aceite
- [ ] `npm run hive:lock` (via `hive.sh lock set claude "teste"`) persiste `locks.json` em `.hive-agent/`
- [ ] Segundo `set` com owner diferente retorna exit 1 e mensagem de erro
- [ ] `release` com owner correto remove o arquivo; com owner errado retorna exit 1
- [ ] `hive-insight.sh` cria o buffer se não existir e adiciona a entrada sem erro
- [ ] Ambos os scripts funcionam com `set -euo pipefail` (sem variáveis não definidas)

#### Observação de débito técnico
O lock atual é advisory (convenção). Esta implementação ainda não previne condição de corrida real entre processos paralelos — isso é aceitável para o nível atual do framework (operação sequencial). Registrar esse limite como comentário no script.

---

### [COPILOT-013] Sistema de backlog e abertura de demandas do PO
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** po-backlog
**Status:** executada

---

#### Contexto
Márcio precisa de uma forma simples de registrar e abrir demandas como PO,
sem precisar navegar no código ou lembrar de formatos complexos.
O modelo de referência é o que já existe no tenantOS — simples, direto, funcional.

---

#### Contrato fechado — implementar exatamente isso:

**Entrega 1 — `beehive/construcao/BACKLOG.md`**

Criar o arquivo com a estrutura abaixo. Popular com os itens já conhecidos:

```markdown
# Backlog do Produto — Hive Framework
> Gerenciado pelo PO (Márcio). Uma linha por demanda.
> Para abrir nova demanda: `npm run po:demand`

## 🔴 Alta prioridade
- [ ] #002 — Documentação oficial do Hive (delegado ao Gemini — GEMINI-2026-05-26-02)

## 🟡 Média prioridade
- [ ] #003 — Status report por entrega
- [ ] #004 — Empacotar framework para outros repositórios

## 🟢 Baixa prioridade / Ideias
- [ ] #005 — Onboarding automatizado para novo operador

## ✅ Concluído
- [x] #001 — Redesign dos 4 atores do squad (2026-05-26)
- [x] #006 — Telemetria de custo por agente (2026-05-26)
- [x] #007 — Simplificação da estrutura de pastas (2026-05-26)
```

---

**Entrega 2 — `beehive/bin/hive-po-demand.sh`**

Script que cria uma nova entrada no BACKLOG.md.
Fluxo:
1. Lê o próximo número disponível (último `#NNN` + 1)
2. Pergunta: `Título da demanda:`
3. Pergunta: `Prioridade? [1=Alta / 2=Média / 3=Baixa]:`
4. Adiciona a linha `- [ ] #NNN — <título>` na seção correta do BACKLOG.md
5. Exibe confirmação: `✅ Demanda #NNN adicionada ao backlog`

```bash
#!/usr/bin/env bash
# Uso: npm run po:demand
```

---

**Entrega 3 — `package.json`**

Adicionar o script na seção `// --- HIVE FRAMEWORK ---`:
```json
"po:demand": "bash beehive/bin/hive-po-demand.sh"
```

---

#### Critérios de aceite
- [ ] `npm run po:demand` executa sem erro
- [ ] BACKLOG.md existe com os itens populados
- [ ] Novo item é adicionado na seção correta conforme prioridade escolhida
- [ ] Script é idempotente — rodar duas vezes não duplica entradas existentes

#### Evidência esperada
Após execução, rodar `npm run po:demand`, criar uma demanda de teste e confirmar
que o BACKLOG.md foi atualizado corretamente. Registrar saída no terminal.

### [COPILOT-017] Legacy Death Módulo 2 — Vendas com estoque e MovimentoEstoque
**De:** Claude (Arquiteto)
**Para:** Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** legacy-death-sales
**Status:** executada

Blueprint completo em `beehive/construcao/blueprints/BLUEPRINT_LEGACY_DEATH_SALES.md` (v2.0).

**Resumo dos 4 gaps a fechar:**
- G1: Validar estoque antes de criar venda
- G2: Decrementar estoque na `$transaction`
- G3: Criar model `MovimentoEstoque` no schema Prisma
- G4: Filtros de data + paginação no `listar()`

Implementar na sequência: schema → migration → service → controller → testes.

---

### [COPILOT-015] Implementar script de migração de usuários (Legacy Death - Módulo 1)
**De:** Gemini (Lead) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** legacy-death-auth
**Status:** executada (2026-05-26)

#### Contexto
Conforme DEBATE-012 e BLUEPRINT_LEGACY_DEATH_AUTH.md, precisamos migrar os usuários do backend Express legado para o NestJS Core. O legado armazena senhas em texto plano; o Core exige BCrypt.

#### Tarefas:
1. **Schema Update:** Adicionar `legacy_id Int? @unique` ao model `Usuario` no `../tenantOS/backend/prisma/schema.prisma`.
2. **Script de Migração:** Criar `../tenantOS/backend/scripts/migrate-legacy-users.ts`.
   - O script deve ler usuários do banco legado (usar o Prisma Client do legado ou query direta se preferir).
   - Para cada usuário:
     - Gerar hash BCrypt da senha.
     - Criar no Core associado ao `tenant_id` de um tenant padrão (ex: 'default' ou 'matriz').
     - Mapear `tipo` (legado) para `role` (core).
3. **Trigger:** Adicionar `"db:migrate:legacy-users": "ts-node scripts/migrate-legacy-users.ts"` ao package.json do core.

#### Critérios de Aceite:
- [ ] `npm run db:migrate:legacy-users` executa sem erros.
- [ ] Usuários aparecem no banco do Core com senhas hasheadas.
- [ ] Login via `POST /auth/login` no Core funciona para um usuário migrado.
