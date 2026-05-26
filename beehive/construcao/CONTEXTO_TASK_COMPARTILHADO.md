# Mecanismo de Contexto Compartilhado de Task
# Status: aprovado

---

## Quando usar (e quando não usar)

O mecanismo tem custo real: tokens consumidos a cada checkpoint e manutenção do arquivo ao longo da task. Usar somente quando o benefício superar esse custo.

**Usar quando a task tiver ao menos dois destes fatores:**
- Estimativa >= 5 SP
- Envolve mais de 3 arquivos modificados
- Tem dependências entre subtasks (ordem importa)
- Participação de mais de um agente (handoff esperado)
- Restrições de escopo não óbvias definidas no início da conversa

**Não usar quando:**
- Task simples, estimativa <= 3 SP
- Escopo autoexplicativo pela descrição da issue
- Execução em uma única sessão curta sem handoff

---

## Problema resolvido

Em tasks longas ou complexas, o contexto da conversa é comprimido automaticamente pelo sistema.
Decisões, restrições e o estado de execução se perdem silenciosamente — o agente continua
respondendo, mas com visão parcial do que foi combinado.

---

## Solução

Um arquivo de contexto vivo por task ativa, mantido pelos agentes e compartilhado entre eles.
Se o Copilot inicia e Claude assume a revisão (ou vice-versa), o contexto já está disponível
sem necessidade de reexplicar o histórico.

---

## Localização

`ai/construcao/tasks/task-NNN-context.md`

Um arquivo por task ativa. A pasta `tasks/` é espaço compartilhado do trio.

---

## Quem cria e atualiza

- O agente que adquire o lock para a task cria o arquivo no início.
- O agente com lock ativo no momento é responsável por atualizar.
- O lock já garante que apenas um agente escreve por vez.

---

## Quando atualizar (granularidade)

Ao final de cada **marco maior** dentro da task:
- Análise concluída
- Implementação de uma subtask concluída
- Revisão ou ajuste significativo concluído

O agente também deve atualizar quando perceber que o contexto da conversa está pesado
(muitos arquivos lidos, muitas tentativas, conversa longa).

---

## Gatilho manual

Quando o usuário digitar **`checkpoint`**, o agente com lock ativo deve:
1. Ler `ai/construcao/tasks/task-NNN-context.md`
2. Confirmar o estado atual em voz alta
3. Atualizar o arquivo se houver divergência

---

## Template do arquivo de task

```markdown
---
issue: "#NNN"
titulo: "<título da task>"
owner_atual: claude | copilot
iniciado_em: YYYY-MM-DD
ultimo_checkpoint: YYYY-MM-DD HH:MM
---

## Escopo

**Entra:**
- ...

**Não entra:**
- ...

## Critérios de aceite
- [ ] ...

## Decisões e motivos

| Quando | Decisão | Motivo |
|---|---|---|
| YYYY-MM-DD HH:MM | | |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|

## Status das subtasks

- [x] subtask concluída
- [ ] subtask pendente

## Próximo passo imediato

...

## Restrições ativas

- ...
```

---

## Teste de perda de contexto (Copilot)

A ser executado após implementação simétrica para o Copilot.

**Objetivo:** verificar se o Copilot perde restrições definidas no início de uma conversa longa.

**Roteiro:**
1. Iniciar uma task com o Copilot definindo 3 restrições explícitas de escopo.
2. Conduzir uma conversa longa com leitura de arquivos e execução de subtasks.
3. Após ~20 trocas, perguntar: *"Quais são as restrições de escopo que definimos no início?"*
4. Comparar a resposta com as restrições originais.
5. Registrar o resultado aqui como evidência.

---

## Regra de limpeza

Ao fechar a issue (status: done), mover o arquivo de task para `ai/construcao/tasks/historico/`
como evidência — não deletar.
