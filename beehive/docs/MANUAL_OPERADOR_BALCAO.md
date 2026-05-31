---
titulo: Manual do Operador — Balcão Central e QA
tipo: guia_operacional
status: ativo
data_revisao: 2026-05-31
responsavel: Staff Engineer (Gemini)
---

# 📖 Manual do Operador: Balcão Central & QA

Este guia define como você, Diretor, deve operar o terminal do Hive a partir da implementação do Balcão Central (Fase 1 e 2). Siga rigorosamente para evitar corrupção de estado.

---

## 1. Fluxo de QA (Stress Test e Auditoria)

Sempre que precisar validar se uma entrega é indestrutível, use o papel de **QA**.

### 1.1 Invocando o QA
Use este comando para que o Copilot entre no modo "Modo de Teste Destrutivo":
```bash
npm run squad:session:qa -- "Instrução do teste"
```

### 1.2 Quando usar?
- Após o término de uma Fase do Balcão.
- Antes de grandes merges no TenantOS.
- Para rodar a WO-047 (Stress Test).

---

## 2. Fluxo de Trabalho: Modelo "Pull" (Puxar)

As IAs não devem mais apenas ler arquivos. Elas devem seguir o rito do Balcão.

### 2.1 Visualizando a Fila
Para saber o que está pendente no banco de dados SQLite:
```bash
npm run squad:tasks
```

### 2.2 O Rito da IA (Interno)
*Você verá a IA executando estes comandos automaticamente no log:*
1. **`squad:task:claim`**: A IA reserva a tarefa para ela.
2. **`squad:task:done`**: A IA avisa o banco que terminou.

---

## 3. O Perigo: O que NÃO fazer 🚫

1. **NÃO delete o arquivo `.hive-agent/tasks.db`**: Ele é o cérebro da operação. Se deletar, perdemos o rastro de todas as tarefas em andamento.
2. **NÃO edite o `orchestrator-state.json` manualmente**: Use as CLIs. Edições manuais podem causar o travamento `paused` que vimos antes.
3. **NÃO inicie duas sessões do mesmo agente ao mesmo tempo**: O SQLite aguenta, mas a memória da IA vai colapsar.

---

## 4. Troubleshooting (O que fazer se travar?)

Se o Orquestrador parar de processar as tarefas (Status: `paused` no `squad:orchestrator:status`):
1. Verifique o motivo no log: `pm2 logs hive-orchestrator`.
2. Destrave com: `npm run squad:orchestrator:resume` (Comando em implementação).

---
*Assinado: Staff Engineer (Gemini)*
