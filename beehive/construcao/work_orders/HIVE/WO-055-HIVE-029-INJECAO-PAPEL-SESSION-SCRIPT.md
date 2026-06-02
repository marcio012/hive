---
id: WO-055
titulo: Injeção de Papel via Script de Sessão (--role)
backlog_ref: HIVE-029
executor: Copilot
executor_role: engenheiro
auditor: Claude
auditor_role: arquiteto
status: pendente
data: 2026-06-01
workspace_hive: /home/marcio/job/hive
cwd_exec: /home/marcio/job/hive
---

# WO-055 — Injeção de Papel via Script de Sessão

## Contexto
DIR-094 define que papéis são da sessão, não do agente, e devem ser injetados via script.
Os arquivos de papel existem em `beehive/roles/<papel>.md` como fonte de verdade.
O `hive-session-start.sh` já aceita `--role` mas não injeta o conteúdo do arquivo de papel no contexto da sessão.

## Objetivo
Atualizar `hive-session-start.sh` (e scripts relacionados) para que `--role <nome>` leia `beehive/roles/<nome>.md` e injete seu conteúdo como contexto da sessão.

## Catálogo de papéis disponíveis
```
arquiteto | auditor | engenheiro | dev | qa | code-review | conselheiro | documentador | po-hive | po-produto
```
Arquivos em: `beehive/roles/<papel>.md`

## Comportamento esperado

### Com papel
```bash
npm run squad:session:gemini -- --role conselheiro
# → lê beehive/roles/conselheiro.md
# → injeta conteúdo como contexto de sessão (system prompt ou arquivo de contexto)
# → sessão inicia com expertise e restrições do papel

npm run squad:session:gemini -- --role dev --modo rapido
# → lê beehive/roles/dev.md
# → sobrescreve config.modo = rapido (frontmatter do papel)
```

### Sem papel (Gemini neutro)
```bash
npm run squad:session:gemini
# → nenhum arquivo de papel carregado
# → sessão inicia neutra
```

### Claude (papel padrão)
```bash
npm run squad:session:claude
# → carrega CLAUDE.md normalmente (papel Arquiteto é o default do Claude)
# → --role substitui o default quando especificado
```

## Critérios de aceite
- [ ] `hive-session-start.sh --role <nome>` lê `beehive/roles/<nome>.md` e injeta conteúdo
- [ ] Flag `--modo <valor>` sobrescreve o campo `config.modo` do frontmatter do papel
- [ ] Sem `--role`: Gemini inicia sem papel; Claude mantém comportamento atual (Arquiteto)
- [ ] Papel inválido (arquivo não existe): erro explícito com lista dos papéis disponíveis
- [ ] Nenhuma alteração em arquivos de governança (CLAUDE.md, CORE_GUARDS.md, roles.yaml)

## Notas de implementação
- O conteúdo do papel pode ser injetado como variável de ambiente, arquivo temporário ou passado via stdin para o CLI do agente — escolher o mecanismo que o Gemini CLI e Claude CLI suportam
- O frontmatter YAML do arquivo de papel contém `config:` com os valores padrão de `modo`, `rigor` e `foco` — parsear com `yq` ou similar
- Verificar se `hive-session-start.sh` já tem estrutura de `--role` para reaproveitar
