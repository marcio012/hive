# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [COPILOT-014] Implementar sistema real de locks e corrigir hive-insight.sh
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** bin-scripts-debttech
**Status:** pendente

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
**Status:** pendente

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

