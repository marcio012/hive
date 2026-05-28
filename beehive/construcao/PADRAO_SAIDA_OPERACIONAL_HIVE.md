---
titulo: Padrao de Saida Operacional do Hive
tipo: ux operacional / governanca / especificacao
status: ativo
data: 2026-05-28
responsavel: Copilot (Executor)
backlog_ref: HIVE-011
source_of_truth: DEBATE-023
---

# Padrão de Saída Operacional do Hive

> **Objetivo:** definir como os agentes do Hive devem encerrar interações operacionais para que o Márcio saiba, sem inferência, o estado atual e o próximo passo esperado.

---

## 1. Regra central

Sempre que uma interação for **operacional**, o encerramento deve deixar explícito:

1. **estado atual**
2. **próximo responsável**
3. **ação esperada agora**

Se a ação esperada for do Márcio, isso deve aparecer de forma direta e inequívoca.

---

## 2. Onde a regra é obrigatória

| Interação | Obrigatório | Observação |
|---|---|---|
| Boot / menu inicial | Sim | precisa orientar a seleção |
| Plano de Voo | Sim | precisa dizer o que o Márcio responde/aprova |
| Handoff / work order | Sim | precisa indicar quem executa em seguida |
| Checkpoint | Sim | precisa orientar retomada |
| Status | Sim | não pode virar só resumo |
| Pedido de aprovação / The Gate | Sim | precisa dizer qual decisão é esperada |
| Encerramento de execução para auditoria | Sim | precisa informar que a próxima etapa é auditoria |

---

## 3. Onde a regra não deve ser forçada

| Tipo de resposta | Aplicação |
|---|---|
| Resposta conceitual | Não obrigatória |
| Explicação técnica pontual | Não obrigatória |
| Confirmação curta sem fluxo ativo | Não obrigatória |
| Debate puramente analítico sem decisão pedida | Não obrigatória |

**Critério prático:** se existe uma próxima ação operacional identificável, a regra deve aparecer.

---

## 4. Estrutura mínima obrigatória

O encerramento operacional deve conter, no mínimo:

### 4.1 Estado atual
Resumo curto do que acabou de acontecer ou do estado em que o fluxo está.

### 4.2 Próximo passo
O que vem agora no fluxo.

### 4.3 Ação esperada
O que o Márcio ou o próximo agente deve fazer agora.

### 4.4 Motivo
Obrigatório em falha ou bloqueio. Deve ser a causa específica e identificável — nunca genérico.

---

## 5. Template canônico

```text
Estado atual:
- [resumo operacional curto]

Próximo passo:
- [o que acontece agora]

Ação esperada:
- [o que o Márcio ou o próximo agente deve fazer]
```

```text
--- (usar apenas em falha ou bloqueio) ---
Estado atual: [o que falhou/bloqueou]
Motivo: [causa específica]
Próximo passo: [como retomar/corrigir]
Ação esperada: [o que Márcio ou agente deve fazer]
```

---

## 6. Variações permitidas

O padrão pode ser:
- em bloco curto;
- em tabela curta;
- em lista objetiva;
- embutido no fechamento, desde que os 3 elementos permaneçam inequívocos.

O que **não** pode acontecer:
- resposta terminar sem ação explícita quando há fluxo ativo;
- próximo passo ficar implícito;
- o responsável seguinte não ficar claro.

---

## 7. Regras por tipo de interação

### 7.1 Boot / menu inicial

Deve deixar claro:
- que o sistema está aguardando uma seleção;
- quais opções existem;
- qual entrada o Márcio deve fornecer.

### 7.2 Plano de Voo

Deve deixar claro:
- ordem sugerida;
- item aguardando aprovação/seleção;
- qual resposta destrava o próximo movimento.

### 7.3 Handoff

Deve deixar claro:
- contrato entregue;
- executor esperado;
- se depende de aprovação do Márcio ou auditoria de Claude.

### 7.4 Checkpoint

Deve deixar claro:
- onde o trabalho parou;
- o que já foi concluído;
- o que falta para retomar.

### 7.5 Status

Deve deixar claro:
- estado atual;
- trava/issue/ponto de execução relevante;
- próximo passo operacional.

### 7.6 Aprovação / The Gate

Deve deixar claro:
- o que está pronto para decisão;
- quais evidências sustentam a decisão;
- qual resposta do Márcio libera ou bloqueia o fluxo.

### 7.7 Falha / Bloqueio

Deve deixar claro:
- o que falhou;
- o motivo específico;
- próximo passo para retomar;
- e de quem é a ação.

---

## 8. Exemplos canônicos

### 8.1 Exemplo de status

```text
Estado atual:
- TOS-019 foi implementada e enviada para auditoria do Claude.

Próximo passo:
- Claude revisar a entrega e emitir parecer.

Ação esperada:
- Márcio aguardar a auditoria ou pedir revisão em lote agora.
```

### 8.2 Exemplo de checkpoint

```text
Estado atual:
- Matriz de teste sistêmico concluída; documento de estados ainda não iniciado.

Próximo passo:
- Consolidar o documento de estados das interações críticas.

Ação esperada:
- Márcio aprovar a continuação da sequência ou revisar a matriz atual.
```

### 8.3 Exemplo de aprovação

```text
Estado atual:
- Implementação concluída com evidências anexadas.

Próximo passo:
- Decisão do The Gate sobre aprovação final.

Ação esperada:
- Márcio responder "aprovado", "vetado" ou "aprovado com condição".
```

---

## 9. Relação com os demais artefatos

- `MATRIZ_INTERACOES_SISTEMICAS_HIVE.md` define o universo das interações
- `MATRIZ_TESTE_SISTEMICO_INTERACOES_HIVE.md` define como validar
- `ESTADOS_INTERACOES_SISTEMICAS_HIVE.md` define os estados e transições
- `PADRAO_SAIDA_OPERACIONAL_HIVE.md` define como a saída deve ser apresentada

---

## 10. Critério de aceitação para futura implementação

A implementação só deve ser considerada correta quando:

1. os três elementos mínimos aparecem nas interações obrigatórias;
2. as exceções continuam enxutas;
3. o padrão permanece consistente entre Gemini, Claude e Copilot;
4. a matriz de teste sistêmico passar com evidências suficientes por papel e por atividade.
