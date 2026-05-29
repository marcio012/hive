---
id: WO-025-B
titulo: Higiene de Inbox — Onda 2: Contenção
debate_ref: DEBATE-025
thread: higiene-inbox-copilot
executor: Copilot
status: pendente
dependencia: WO-025-A (executar somente após Onda 1 aprovada)
data: 2026-05-29
---

# WO-025-B — Higiene de Inbox: Onda 2 — Contenção

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

Executar somente após WO-025-A auditada e aprovada.
Esta WO adiciona a camada de contenção: hook diff-aware + limpeza de entradas longas ainda ativas.

## O que implementar

### 1. Pre-commit hook diff-aware

Criar `.husky/pre-commit` (ou adicionar ao existente) que:
1. Obtém arquivos de inbox modificados no staging: `git diff --cached --name-only | grep "inbox-.*\.md"`
2. Para cada inbox modificado, extrai apenas os blocos `### [` **adicionados** no diff (`git diff --cached <file>`)
3. Conta linhas do corpo variável de cada novo bloco (após `**Status:**`)
4. Se algum bloco novo exceder 30 linhas: imprime aviso + exit 1 (bloqueia commit)

Mensagem de erro padrão:
```
❌ DIR-088: entrada [ID] em inbox-copilot.md tem 178 linhas no corpo (limite: 30)
   Mova o contrato técnico para beehive/construcao/work_orders/ e referencie via wo_ref.
   Template: beehive/construcao/work_orders/TEMPLATE_HANDOFF.md
```

Se `husky` não estiver instalado, usar `package.json` `"pre-commit"` script com `simple-git-hooks` ou verificar o mecanismo de hook já em uso no repositório antes de escolher a abordagem.

### 2. Limpeza de entradas longas ainda ativas

Executar `npm run squad:inbox:lint` e para cada entrada com corpo > 30 linhas e status **não** `consumida`/`executada`:
1. Extrair o corpo longo para `beehive/construcao/work_orders/legacy-inbox/<ID>.md`
2. Substituir o corpo na entrada de inbox por:
   ```
   Conteúdo movido para: beehive/construcao/work_orders/legacy-inbox/<ID>.md
   ```
3. Manter todos os campos de metadata intactos

Entradas com status `consumida` ou `executada`: mover para histórico via processo normal, sem extração de WO.

### 3. Atualizar `beehive/construcao/debates-abertos.md`

Marcar DEBATE-025 como `Execução concluída` após esta WO aprovada.

## Critérios de Aceite

- [ ] Pre-commit hook bloqueia commit com nova entrada de inbox > 30 linhas no corpo
- [ ] Pre-commit hook NÃO bloqueia commits que não tocam arquivos de inbox
- [ ] Pre-commit hook NÃO bloqueia commits com entradas existentes (só novas/alteradas no diff)
- [ ] `npm run squad:inbox:lint` reporta 0 violações ativas após a limpeza
- [ ] Entradas limpas têm referência para `legacy-inbox/<ID>.md`
- [ ] Arquivos de legacy-inbox criados e legíveis

## Restrições

- NÃO apagar conteúdo — apenas mover para `legacy-inbox/`
- NÃO tocar entradas já `consumida`/`executada` com corpo longo — essas vão para o histórico normal
- Executar SOMENTE após WO-025-A aprovada

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Confirmação dos critérios
- Output do lint antes e depois da limpeza
- Hash do commit (sem commitar — aguardar auditoria)
