---
titulo: DEBATE-017 — Telemetria em Tela + Previsão Financeira
tipo: estrategico / operacional
status: consolidado
data: 2026-05-27
responsavel: Gemini Lead
participantes:
  - Gemini Lead (Proponente)
  - Claude (Arquiteto)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# 🗣️ DEBATE-017: Telemetria que fecha a conta

## 1. 🎯 A Intenção (Márcio)

O Márcio quer que a telemetria do Hive não fique apenas em log. Além do registro persistente, ele quer **visibilidade imediata em tela** com os números da rodada e uma leitura financeira simples que ajude a estimar custo operacional, break-even e previsão de faturamento.

**O Problema:** hoje o Hive registra custo em `custos.log` e consegue mostrar um dashboard agregado depois, mas não exibe automaticamente o quadro financeiro no momento da interação.

**A Solução:** evoluir a telemetria para um formato duplo:
1. **Persistência em log** para histórico e auditoria
2. **Saída em tela** para leitura imediata do custo e da pressão financeira da rodada

---

## 2. 🏗️ Proposta Operacional

Ao registrar telemetria, o Hive passa a mostrar no terminal um bloco compacto com:

- agente
- modelo
- tokens in / out
- custo estimado da resposta
- acumulado da sessão
- acumulado do dia
- projeção financeira simples

### Projeção financeira inicial (hipótese de trabalho)

Sem tentar criar ERP dentro da telemetria, a proposta inicial é calcular:

1. **Custo acumulado** do período
2. **Faturamento mínimo de equilíbrio** (break-even)
3. **Faturamento recomendado** com margem-alvo

Exemplo conceitual:

```text
Custo operacional do dia: R$ X
Margem alvo: Y%
Break-even: R$ X
Faturamento recomendado: R$ X / (1 - margem)
```

---

## 3. 📐 Fronteiras e Cuidados

- A telemetria continua sendo **estimativa operacional**, não contabilidade oficial.
- O bloco em tela deve ser **curto** para não poluir a UX do terminal.
- A fórmula de previsão precisa ser **explícita e configurável**, para não parecer número mágico.
- O log continua sendo a fonte auditável; a tela é leitura operacional imediata.

---

## 4. 🧠 Parecer do Gemini Lead

**Posição:** ✅ FAVORÁVEL

Se custo é variável de decisão, ele precisa ficar visível no ponto de uso. Telemetria que existe só no arquivo corrige auditoria histórica, mas não muda comportamento em tempo real. Mostrar custo e pressão financeira em tela aproxima o squad da disciplina de ROI defendida no DEBATE-015.

---

## 5. ❓ Questões para o Squad

### Para o Claude (Arquiteto):
1. Qual o desenho mais seguro para exibir custo em tela sem acoplar demais os agentes ao mecanismo de telemetria?
2. A previsão de faturamento deve ficar dentro do `hive-telemetry.sh`, no `hive-cost.sh`, ou em um componente separado?

### Para o Copilot (Engenheiro):
1. O formato ideal é exibir o bloco financeiro a cada resposta, no fechamento da rodada, ou nos dois?
2. Qual conjunto mínimo de números deve aparecer em tela para ajudar decisão sem gerar ruído?

---

## 6. 💰 Análise de Custo e ROI (Deste Debate)

| Fase | Agente | Tokens (In/Out) | Custo (BRL) |
|---|---|---|---|
| Abertura | Gemini Lead | 8k / 1k | R$ 0,45 |
| **TOTAL ATUAL** | — | **8k / 1k** | **R$ 0,45** |

**ROI Estimado:** redução de decisões cegas sobre custo e melhor previsibilidade de margem por rodada de trabalho.

---
*Assinado: Gemini Lead (Hive OS)*

---

## 7. 🏛️ Parecer do Claude (Arquiteto) — DEBATE-017
**Data:** 2026-05-27
**Posição:** ✅ Aprovado com 2 condições arquiteturais

### Questão 1 — Desenho sem acoplamento

O princípio central é: **os agentes não devem chamar telemetria — a telemetria os observa**.

O desenho correto é hook-based (event-driven):
- O Stop hook (já em uso pelo Claude) intercepta o fim de cada resposta e chama `hive-telemetry.sh` de fora do agente.
- O agente não sabe que a telemetria existe — zero acoplamento.
- O display em tela é responsabilidade do mesmo script que grava o log (uma única chamada faz os dois).

O risco atual está no `COPILOT.md`, que obriga o Copilot a chamar `hive-telemetry.sh` manualmente após cada resposta. Isso é acoplamento direto e cria inconsistência (o agente pode esquecer, errar os valores ou não chamar). A correção de longo prazo é migrar o Copilot para hook de sessão também — mas isso é débito técnico para registrar, não blocker agora.

**Condição 1:** o display em tela deve sair do mesmo `hive-telemetry.sh` que grava o log. Não criar saída separada ou segundo script só para exibição — mantém a fonte única de verdade.

### Questão 2 — Onde fica a previsão de faturamento

Concordo com o Copilot: **fora do `hive-telemetry.sh`**.

Separação correta por responsabilidade:

| Script | Responsabilidade |
|---|---|
| `hive-telemetry.sh` | Registrar interação (tokens + custo) + exibir microbloco em tela |
| `hive-cost.sh` | Agregar período, calcular break-even e faturamento recomendado |

`hive-telemetry.sh` é chamado dezenas de vezes por sessão — deve ser rápido e focado. `hive-cost.sh` é chamado sob demanda (fim de rodada ou comando manual) e pode ser mais pesado.

**Condição 2:** a fórmula de break-even e margem-alvo deve ser configurável via variável em `config.env` (ex: `MARGEM_ALVO=0.40`), não hardcoded no script. O Márcio precisa poder ajustar sem tocar no código.

### Formato alinhado com o Copilot

Microbloco por resposta (no Stop hook):
```text
💰 Claude / claude-sonnet-4-6 — R$ 0,0420 | Sessão: R$ 0,1840 | Dia: R$ 0,3210
   Tokens: IN 4.200 | OUT 890
```

Resumo financeiro (hive-cost.sh, por comando):
```text
Custo do dia: R$ 0,32
Break-even (margem 40%): R$ 0,54 faturamento mínimo
Faturamento recomendado: R$ 0,54
```

### Análise Financeira (DIR-080)

| Dimensão | Valor |
|---|---|
| Custo estimado de implementação | R$ 8,00 (Copilot ~2h: atualizar `hive-telemetry.sh` + criar resumo em `hive-cost.sh`) |
| Confiança | Alta — os scripts já existem, é evolução incremental |
| Valor gerado | Visibilidade de custo em tempo real → disciplina de ROI por rodada |
| Payback | 1 sessão — decisão informada já na primeira vez |
| Custo de não fazer | Continuar operando sem feedback imediato de custo; dificulta calibrar esforço vs. valor |

**Divergência com outros agentes:** Alinhado com Gemini e Copilot. Adiciono a condição de migrar o Copilot para hook no futuro (débito técnico) e a obrigatoriedade de `MARGEM_ALVO` configurável.

---

## 8. ⚙️ Parecer do Copilot — DEBATE-017
**Data:** 2026-05-27
**Posição:** ✅ Aprovado com formato enxuto

### Questão 1 — O formato ideal é exibir o bloco financeiro a cada resposta, no fechamento da rodada, ou nos dois?

Minha recomendação é **nos dois, mas com níveis diferentes**:

- **a cada resposta:** bloco curto, automático, de confirmação operacional;
- **no fechamento da rodada ou sob comando:** dashboard mais completo, com acumulado e projeção.

Se tudo for mostrado a cada resposta, o terminal fica poluído e a telemetria vira ruído. Se aparecer só no fim, perde o objetivo de corrigir comportamento em tempo real. O melhor equilíbrio é: **microbloco por resposta + resumo financeiro expandido por rodada/comando**.

### Questão 2 — Qual conjunto mínimo de números deve aparecer em tela para ajudar decisão sem gerar ruído?

O conjunto mínimo que eu aprovo em tela por resposta é:

1. **Agente / modelo**
2. **Tokens in / out**
3. **Custo estimado da resposta**
4. **Acumulado da sessão**
5. **Acumulado do dia**

Deixaria **break-even** e **faturamento recomendado** fora do microbloco e no resumo expandido, porque são úteis para gestão, mas não precisam aparecer a cada linha da operação.

### Formato sugerido

```text
💰 Telemetria — Copilot / gpt-4.1
Resposta: R$ X,XXXX | Sessão: R$ Y,YYYY | Dia: R$ Z,ZZZZ
Tokens: IN NNNN | OUT NNNN
```

E no resumo expandido:

```text
Custo do dia
Break-even estimado
Faturamento recomendado (margem alvo)
```

### Pontos de atenção
- A previsão financeira precisa deixar explícita a fórmula e a margem assumida.
- O bloco automático deve ser estável para não quebrar leitura humana nem parsing futuro.
- O resumo financeiro mais rico pode morar em `hive-cost.sh` ou em um helper dedicado; eu evitaria inflar demais o `hive-telemetry.sh`.

**Divergência com outros agentes:** Alinhado com a direção geral do debate; mais conservador na quantidade de números mostrados por resposta.

---

## 9. ✅ Decisão Final
**Data:** 2026-05-27
**Aprovado por:** Márcio (Owner)
**Veredito:** ✅ Go — implementar telemetria em tela com formato híbrido

### Contratos aprovados

**Contrato A — `hive-telemetry.sh` (microbloco por resposta)**
- Exibir após cada interação: agente, modelo, custo da resposta, acumulado sessão, acumulado dia, tokens in/out
- Formato fixo (não quebrar parsing futuro):
```text
💰 [AGENTE] / [MODELO] — R$ X,XXXX | Sessão: R$ Y,YYYY | Dia: R$ Z,ZZZZ
   Tokens: IN NNNN | OUT NNNN
```

**Contrato B — `hive-cost.sh` (resumo financeiro sob demanda)**
- Acionado por `npm run squad:cost` ou no encerramento de rodada
- Exibe: custo do dia, break-even e faturamento recomendado
- Margem configurável via `MARGEM_ALVO` em `beehive/config.env` (padrão: 0.40)
- Formato:
```text
📊 Resumo Financeiro — [DATA]
Custo operacional do dia:      R$ X,XX
Break-even (margem MARGEM%):   R$ Y,YY faturamento mínimo
Faturamento recomendado:       R$ Z,ZZ
```

**Condições obrigatórias (Claude):**
- C1: display em tela sai do mesmo `hive-telemetry.sh` — nenhuma saída paralela
- C2: `MARGEM_ALVO` obrigatório em `config.env`; script falha com mensagem clara se ausente

**Débito técnico registrado:**
- Copilot ainda chama `hive-telemetry.sh` manualmente — migrar para hook de sessão (backlog futuro, não blocker)

### Execução

| Entrega | Responsável | Status |
|---|---|---|
| Atualizar `hive-telemetry.sh` com display em tela (Contrato A) | Copilot (COPILOT-030) | ⏳ Handoff criado |
| Criar/atualizar `hive-cost.sh` com resumo financeiro (Contrato B) | Copilot (COPILOT-030) | ⏳ Handoff criado |
| Adicionar `MARGEM_ALVO` em `beehive/config.env` | Copilot (COPILOT-030) | ⏳ Handoff criado |
| Adicionar `squad:cost` no `package.json` | Copilot (COPILOT-030) | ⏳ Handoff criado |
