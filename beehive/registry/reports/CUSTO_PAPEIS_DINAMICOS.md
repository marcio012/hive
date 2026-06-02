# Relatório de Custo por Papéis Dinâmicos

**Data:** 2026-06-01  
**Origem:** WO-056 / HIVE-029  
**Referência de custo:** ~R$ 0,01 por 1.000 tokens de input

---

## Resumo executivo

O modelo mais barato continua sendo o **Gemini neutro**, com cerca de **340 tokens** por abertura, ou algo perto de **R$ 0,003**. Ele é a melhor porta de entrada para triagem, investigação curta e validações simples.

Quando um papel é injetado, o custo sobe pouco na maior parte dos casos. Os papéis **dev** e **conselheiro** acrescentam só **~R$ 0,003** por sessão, o que torna esse reforço de especialidade praticamente negligenciável no orçamento.

O salto mais caro aparece quando o papel entra sobre o **Claude**, porque ali o peso maior não vem do papel em si, mas do pacote fixo de governança e âncoras que o Claude já carrega. Em outras palavras: o papel custa pouco; o contexto-base do Claude é que encarece a sessão.

## Custo adicional por papel

| Papel | Arquivo | Palavras | Tokens est. | Custo adicional |
|---|---|---:|---:|---:|
| dev | `roles/dev.md` | 192 | 274 | R$ 0,003 |
| conselheiro | `roles/conselheiro.md` | 213 | 304 | R$ 0,003 |
| documentador | `roles/documentador.md` | 290 | 414 | R$ 0,004 |
| qa | `roles/qa.md` | 299 | 427 | R$ 0,004 |
| arquiteto | `roles/claude.md` | 348 | 497 | R$ 0,005 |
| code-review | `roles/code-review.md` | 334 | 477 | R$ 0,005 |
| po-hive | `roles/po-hive.md` | 349 | 499 | R$ 0,005 |
| po-produto | `roles/po-produto.md` | 411 | 587 | R$ 0,006 |

## Custo total por combinação agente + papel

| Combinação | Tokens base | + Papel | Total tokens | Custo total |
|---|---:|---:|---:|---:|
| Gemini neutro | 340 | — | 340 | R$ 0,003 |
| Gemini + dev | 340 | 274 | 614 | R$ 0,006 |
| Gemini + conselheiro | 340 | 304 | 644 | R$ 0,006 |
| Gemini + documentador | 340 | 414 | 754 | R$ 0,008 |
| Gemini + qa | 340 | 427 | 767 | R$ 0,008 |
| Gemini + code-review | 340 | 477 | 817 | R$ 0,008 |
| Gemini + po-hive | 340 | 499 | 839 | R$ 0,008 |
| Gemini + po-produto | 340 | 587 | 927 | R$ 0,009 |
| Copilot + dev | 631 | 274 | 905 | R$ 0,009 |
| Copilot + qa | 631 | 427 | 1.058 | R$ 0,011 |
| Copilot + code-review | 631 | 477 | 1.108 | R$ 0,011 |
| Claude + code-review | 3.857* | 477 | 4.334 | R$ 0,043 |
| Claude + qa | 3.857* | 427 | 4.284 | R$ 0,043 |

\* Claude com âncoras completas de governança.

## Quando usar cada papel

| Papel | Quando vale a pena | Leitura prática de custo |
|---|---|---|
| dev | Implementação direta com contrato fechado | Muito barato para ganhar foco de execução |
| conselheiro | Opinião, validação e crítica antes de construir | Quase sem impacto financeiro |
| documentador | Transformar código e decisões em material legível | Custo baixo para alto ganho de clareza |
| qa | Revisão de cenários, regressão e cobertura | Vale quando o risco de quebra é real |
| arquiteto | Decisão estrutural, desenho e definição técnica | Mais caro, mas útil quando a decisão errada custaria mais |
| code-review | Auditoria técnica e análise de risco | Bom para etapas de aprovação ou investigação crítica |
| po-hive | Priorização e ROI da fábrica | Usar quando a discussão é sobre custo e capacidade da operação |
| po-produto | Priorização pelo valor ao usuário | Melhor quando a decisão depende de impacto no produto |

## Qual agente para cada função

| Função | Melhor escolha | Motivo |
|---|---|---|
| Triagem rápida | Gemini neutro | Menor custo de abertura do catálogo |
| Implementação pontual | Gemini + dev ou Copilot + dev | Especialidade com custo ainda baixo |
| Validação antes de agir | Gemini + conselheiro | Quase o mesmo custo de uma triagem simples |
| Teste e regressão | Gemini + qa ou Copilot + qa | Custo controlado para elevar segurança |
| Revisão de código | Copilot + code-review ou Claude + code-review | Escolha depende do quanto a governança pesa no caso |
| Priorização da fábrica | Gemini + po-hive | Boa profundidade com custo baixo |
| Priorização de produto | Gemini + po-produto | Melhor custo-benefício para decisões de valor |
| Arquitetura e auditoria pesada | Claude + papel apropriado | Mais caro, porém justificado quando o contexto acumulado importa |

## Leitura prática

1. **Mais barato de todos:** Gemini neutro.
2. **Melhor custo-benefício para tarefas pontuais:** Gemini com papel leve, como `dev` ou `conselheiro`.
3. **Papéis médios ainda são baratos:** `documentador`, `qa` e `code-review` continuam na faixa de centavos baixos.
4. **Claude deve ser reservado para casos em que o contexto pesa a favor da decisão**, porque o custo-base dele já é alto antes do papel entrar.

## Análise financeira

### Custo atual

- **Gemini neutro:** R$ 0,003 por sessão
- **Gemini + papel leve (`dev` / `conselheiro`):** R$ 0,006 por sessão
- **Copilot + `code-review`:** R$ 0,011 por sessão
- **Claude + `code-review`:** R$ 0,043 por sessão

### Valor gerado

- Os papéis dinâmicos permitem subir especialidade sob demanda sem precisar abrir sempre a sessão mais cara.
- Isso reduz desperdício porque o papel certo pode ser ativado só quando o trabalho realmente pede profundidade.
- O ganho financeiro aparece menos no preço absoluto e mais na **disciplina de escolher o agente certo para cada tipo de tarefa**.

### Payback

- **Imediato** para o uso de papéis leves no Gemini: o acréscimo é muito baixo e já melhora foco e qualidade da resposta.
- **Rápido** para `qa` e `code-review` quando evitam uma regressão ou uma rodada extra de correção.
- **Condicional** para Claude: compensa quando a decisão errada geraria retrabalho, risco arquitetural ou custo político maior.

### Custo de não fazer

- Sem esse entendimento, a tendência é usar agentes mais caros por padrão, mesmo quando uma sessão leve resolveria.
- Isso aumenta custo recorrente, carrega contexto desnecessário e deixa o fluxo mais lento do que precisa ser.
- O principal risco não é financeiro isolado, e sim **operacional**: gastar profundidade onde bastava foco.

### Confiança da estimativa

- **Alta** para os números deste relatório, porque os valores vieram fechados na WO.
- **Média** para extrapolar volume mensal, porque isso depende da frequência real de uso de cada papel na rotina.

## Conclusão

Papéis dinâmicos são baratos o suficiente para serem usados como ferramenta de precisão. O melhor retorno está em manter o **Gemini neutro** como entrada padrão, ativar **papéis leves** para tarefas focadas e reservar o **Claude com papel** para situações em que governança, arquitetura ou auditoria realmente justificam o peso extra.
