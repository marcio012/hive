# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

---

<!-- novas entradas abaixo — mais recente no topo -->

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

