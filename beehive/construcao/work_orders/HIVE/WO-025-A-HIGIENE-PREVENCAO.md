---
id: WO-025-A
titulo: Higiene de Inbox — Onda 1: Prevenção
debate_ref: DEBATE-025
thread: higiene-inbox-copilot
executor: Copilot
status: pendente
data: 2026-05-29
---

# WO-025-A — Higiene de Inbox: Onda 1 — Prevenção

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

DEBATE-025 aprovado por Márcio em 2026-05-29. Política DIR-088 definida.
O inbox-copilot.md recidivou de 556 → 1478 linhas em 24h por WOs coladas diretamente no inbox.
Esta WO implementa a camada de prevenção: template + lint.

## O que implementar

### 1. Criar `beehive/construcao/work_orders/TEMPLATE_HANDOFF.md`

Template formal de entrada de inbox para handoffs executáveis:

```markdown
### [CLAUDE-YYYY-MM-DD-NNN] Título curto (≤ 8 palavras)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** YYYY-MM-DD
**tipo:** handoff-executavel
**backlog_ref:** ID-XXX
**thread:** nome-da-thread
**wo_ref:** beehive/construcao/work_orders/PASTA/ARQUIVO.md
**Status:** pendente

Contexto em 1–3 linhas: o quê e por quê agora.
Critérios-chave: AC-01, AC-02, AC-03.

---
```

Incluir seção `## Regras de uso` explicando:
- corpo variável (após `Status:`) ≤ 30 linhas
- toda especificação técnica vai no arquivo de WO referenciado em `wo_ref`
- `wo_ref` é obrigatório em todo `handoff-executavel`

### 2. Atualizar `beehive/.claude/CLAUDE.md`

Na seção `## Canal de comunicacao entre agentes (inbox)`, após a linha sobre "Campos obrigatorios em handoff executavel multi-repo (DIR-082)", adicionar:

```
**Padrão de handoff executável (DIR-088):**
- Criar arquivo de WO em `beehive/construcao/work_orders/<PASTA>/<ID>.md` com o contrato técnico completo
- Criar entrada de inbox CURTA com `wo_ref` apontando para o arquivo
- Corpo variável da entrada (após `Status:`) ≤ 30 linhas — sem colar conteúdo da WO
- Template: `beehive/construcao/work_orders/TEMPLATE_HANDOFF.md`
```

### 3. Criar script `scripts/inbox-lint.js`

Script Node.js que:
1. Lê `beehive/construcao/inbox-claude.md`, `inbox-copilot.md`, `inbox-gemini.md`
2. Divide por blocos `### [` 
3. Para cada bloco: conta linhas do corpo variável (após a linha `**Status:**`)
4. Reporta entradas com corpo > 30 linhas com: arquivo, ID da entrada, linha count
5. Exit code 0 mesmo se encontrar violações (não bloqueante — apenas reporta)

Formato de saída:
```
⚠️  inbox-copilot.md — [CLAUDE-2026-05-29-059] — 178 linhas (limite: 30)
✅  inbox-claude.md — sem violações
```

### 4. Adicionar ao `package.json` (raiz)

```json
"squad:inbox:lint": "node scripts/inbox-lint.js"
```

### 5. Integrar ao script `npm run squad:inbox`

Localizar o script atual de `squad:inbox` em `package.json` e adicionar chamada ao lint antes ou após a exibição do inbox. Se o script for shell, adicionar:
```bash
node scripts/inbox-lint.js
```

## Critérios de Aceite

- [ ] `TEMPLATE_HANDOFF.md` criado e legível
- [ ] `CLAUDE.md` atualizado com padrão DIR-088
- [ ] `npm run squad:inbox:lint` executa sem erro e reporta violações existentes
- [ ] `npm run squad:inbox` inclui output do lint
- [ ] `npm run check:types` (se aplicável ao script) → OK

## Restrições

- NÃO limpar entradas longas existentes — isso é escopo da WO-025-B
- NÃO criar pre-commit hook — isso é escopo da WO-025-B
- NÃO modificar arquivos de inbox — apenas criar template e script

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Confirmação dos critérios
- Output de exemplo do `squad:inbox:lint` nos inboxes atuais
- Hash do commit (sem commitar — aguardar auditoria)
