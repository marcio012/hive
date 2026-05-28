---
titulo: Matriz de Teste Sistêmico das Interações do Hive
tipo: teste / governanca / ux operacional
status: rascunho
data: 2026-05-28
responsavel: Copilot (Executor)
backlog_ref: HIVE-011
source_of_truth: DEBATE-023
---

# Matriz de Teste Sistêmico das Interações do Hive

> **Objetivo:** definir como validar, antes da implementação, que a futura regra de "próximo passo explícito" não quebra os fluxos do Hive e permanece consistente entre todos os papéis.

---

## 1. Escopo

Este teste cobre as **interações sistêmicas** em que:
- uma ação chama a próxima;
- há troca de responsabilidade entre papéis;
- o Márcio precisa saber claramente o que fazer em seguida;
- a saída do agente precisa ser operacional, não apenas informativa.

---

## 2. Papéis cobertos

- Gemini PO
- Gemini Projetista
- Gemini Coordenador
- Claude
- Copilot

---

## 3. Interações sistêmicas mínimas cobertas

1. boot/menu inicial
2. plano de voo
3. checkpoint
4. handoff
5. pedido de aprovação
6. resposta de status
7. the gate
8. encerramento com próximo passo explícito

---

## 4. Critério geral de aprovação

Uma interação sistêmica só passa se:
1. mostrar o **estado atual**;
2. mostrar **o que o Márcio pode fazer agora**;
3. mostrar a **ação esperada** de forma explícita;
4. não introduzir ruído desnecessário em respostas curtas ou puramente informativas;
5. preservar o papel correto de cada agente no fluxo.

---

## 5. Matriz principal

| ID | Papel | Interação sistêmica | Entrada simulada | Evidência esperada | Aprovação |
|---|---|---|---|---|---|
| TS-001 | Gemini Coordenador | Plano de Voo | `npm run gemini:coordenador` com pendências abertas | saída com ordem sugerida + indicação clara do que o Márcio deve responder | plano termina com próxima ação explícita |
| TS-002 | Gemini PO | Boot/menu inicial | abertura do cartucho/boot do Gemini | menu mostra estado + opções + instrução explícita de escolha | Márcio sabe o que digitar sem inferência |
| TS-003 | Gemini PO | Encerramento de ideação | ideia refinada e pronta para próxima etapa | saída informa se deve seguir para Projetista ou Claude e como acionar | próxima etapa do fluxo fica inequívoca |
| TS-004 | Gemini Projetista | Encerramento de esboço | intenção recebida do PO e esboço pronto | saída informa que o próximo passo é Claude validar/blueprintar | não há salto direto para Copilot |
| TS-005 | Claude | Handoff / work order | blueprint aprovado / debate fechado | saída informa que o próximo passo é o Copilot executar ou Márcio aprovar | ação esperada do Márcio ou do próximo agente fica clara |
| TS-006 | Claude | Pedido de aprovação | auditoria concluída / work order pronta | saída explicita o que o Márcio deve aprovar, vetar ou condicionar | formato permite decisão sem ambiguidade |
| TS-007 | Copilot | Checkpoint | implementação interrompida ou concluída para revisão | saída informa estado da entrega + o que o Márcio deve fazer agora | checkpoint não termina "solto" |
| TS-008 | Copilot | Status | comando `status` ou fluxo equivalente | saída mostra issue ativa, trava, próximo passo e ação esperada | status vira operacional, não só descritivo |
| TS-009 | Copilot | Entrega para auditoria | implementação concluída e enviada ao Claude | saída informa que o próximo passo é auditoria do Claude | preserva papel do Claude |
| TS-010 | Márcio / The Gate | Gate final | Claude aprovou + evidência pronta | saída informa se o Márcio deve aprovar, vetar ou condicionar | gate fica objetivo e rastreável |

---

## 6. Regras por tipo de interação

### 6.1 Boot / menu inicial
**Deve conter:**
- estado do sistema;
- opções disponíveis;
- instrução explícita de escolha.

**Não deve:**
- variar livremente de layout sem preservar a ação esperada;
- encerrar sem a linha de ação/entrada.

### 6.2 Plano de Voo
**Deve conter:**
- pendências detectadas;
- ordem sugerida;
- o que o Márcio deve fazer para avançar.

**Não deve:**
- seguir sem aprovação explícita;
- misturar planejamento com execução.

### 6.3 Checkpoint
**Deve conter:**
- ponto de parada;
- estado do trabalho;
- o que depende do Márcio ou do próximo agente.

**Não deve:**
- parecer fechamento definitivo quando ainda aguarda auditoria/aprovação.

### 6.4 Handoff
**Deve conter:**
- quem recebe a próxima ação;
- o que foi produzido;
- o que falta para o próximo passo.

**Não deve:**
- embaralhar autoria, responsabilidade ou papel.

### 6.5 Pedido de aprovação / The Gate
**Deve conter:**
- resumo do impacto;
- evidência mínima;
- decisão esperada do Márcio.

**Não deve:**
- forçar leitura implícita do contexto para entender o que aprovar.

### 6.6 Status
**Deve conter:**
- estado atual;
- travas relevantes;
- próximo passo;
- ação esperada.

**Não deve:**
- virar só diagnóstico passivo.

---

## 7. Evidências mínimas por papel

### Gemini PO
- captura da tela/saída do menu ou encerramento de ideação
- evidência de que a próxima ação está explícita

### Gemini Projetista
- saída de encerramento do esboço
- indicação inequívoca de passagem para Claude

### Gemini Coordenador
- Plano de Voo completo
- instrução clara do que o Márcio precisa responder

### Claude
- exemplo de pedido de aprovação
- exemplo de saída de handoff / consolidação com próxima ação clara

### Copilot
- exemplo de checkpoint
- exemplo de status
- exemplo de entrega enviada para auditoria

---

## 8. Resultado esperado do teste

Ao final, o Hive deve provar que:
1. todos os papéis críticos encerram interações operacionais com próxima ação explícita;
2. a regra não invade respostas puramente informativas;
3. a implementação mantém coerência entre papéis;
4. o Márcio consegue operar os fluxos sem precisar inferir o próximo passo.

---

## 9. Relação com documentos-fonte

- `beehive/construcao/MATRIZ_INTERACOES_SISTEMICAS_HIVE.md`
- `beehive/construcao/debates/DEBATE-023-PROXIMO-PASSO-EXPLICITO-NO-ENCERRAMENTO-DOS-AGENTES.md`
- `beehive/docs/FLUXO_CARTUCHOS.md`
- `beehive/docs/HIVE_DOC.md`
- `beehive/docs/THE_GATE_PROTOCOL.md`
- `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md`

