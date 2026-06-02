# Relatorio de Custo de Boot por Agente

**Data:** 2026-06-01  
**Origem:** WO-054 / HIVE-029  
**Referencia de custo:** ~R$ 0,01 por 1.000 tokens de input

---

## Resumo executivo

Hoje, o boot mais caro do squad e o do **Claude** e do **Copilot-Hive**, ambos na faixa de **5,8 mil tokens por sessao**. Em dinheiro, isso fica perto de **R$ 0,06 por abertura**.

O ponto mais pesado e tambem o mais simples de atacar e o **inbox-copilot-hive.md**, que cresceu com entradas ja consumidas. Depois dele, o maior peso recorrente esta no **BACKLOG.md** compartilhado por tres fluxos e no pacote fixo de governanca do **Claude**.

Se os cinco boots mapeados acontecerem uma vez cada, o custo combinado estimado e de **21.575 tokens**, ou **R$ 0,216 por rodada completa**.

## Custo por agente/papel

| Agente / papel | Palavras estimadas | Tokens estimados | Custo por boot |
|---|---:|---:|---:|
| Claude (Arquiteto / Auditor) | 4.086 | 5.836 | R$ 0,058 |
| Copilot-Hive | 4.056 | 5.794 | R$ 0,058 |
| Gemini — PO-Hive | 2.700 | 3.857 | R$ 0,039 |
| Gemini — PO-Produto | 2.134 | 3.049 | R$ 0,030 |
| Copilot-TOS | 2.127 | 3.039 | R$ 0,030 |
| **Total da rodada completa** | **15.103** | **21.575** | **R$ 0,216** |

## Leitura pratica

- **Faixa mais cara:** Claude e Copilot-Hive estao praticamente empatados.
- **Faixa intermediaria:** Gemini no papel PO-Hive.
- **Faixa mais leve:** Copilot-TOS e Gemini PO-Produto.

Em termos de gestao, isso significa que cada melhoria no boot do Claude ou do Copilot-Hive gera retorno mais rapido do que otimizar os fluxos menores primeiro.

## Gargalos

1. **inbox-copilot-hive.md (1.298 palavras)**  
   O arquivo carrega muito historico encerrado para pouquissimo trabalho ativo. E um custo recorrente sem gerar valor novo.

2. **BACKLOG.md (824 palavras)**  
   O mesmo bloco pesa no boot do Claude, do Copilot-Hive e do Gemini PO-Hive. Um arquivo unico esta cobrando tres vezes.

3. **CLAUDE.md + CLAUDE_REF.md (1.418 palavras)**  
   Esse pacote de governanca e importante, mas hoje entra com peso fixo alto antes mesmo da tarefa comecar.

## Otimizacoes sugeridas

| Acao | Esforco | Ganho estimado | Impacto financeiro |
|---|---|---|---|
| Limpar o inbox do Copilot-Hive e manter o historico separado | Baixo | ~1,0k a 1,4k tokens a menos por boot do Copilot-Hive | ~R$ 0,010 a R$ 0,014 por sessao |
| Separar `BACKLOG.md` em ativo + arquivo | Medio | ~500 tokens a menos em 3 boots diferentes | ~R$ 0,015 por rodada completa |
| Enxugar o pacote fixo do Claude com referencia curta + apendice | Medio | ~800 a 1,0k tokens a menos por boot do Claude | ~R$ 0,008 a R$ 0,010 por sessao |

## Analise financeira

### Custo atual

- **1 boot do Claude:** ~R$ 0,058
- **1 boot do Copilot-Hive:** ~R$ 0,058
- **1 rodada completa dos 5 boots mapeados:** ~R$ 0,216

### Economia potencial

- **Acao imediata:** a limpeza do inbox do Copilot-Hive ja devolve economia recorrente com esforco baixo e payback imediato.
- **Maior multiplicador:** dividir o `BACKLOG.md` traz pouco risco e reduz custo em tres fluxos ao mesmo tempo.
- **Maior oportunidade estrutural:** reduzir o pacote fixo do Claude diminui custo e libera contexto para auditoria tecnica de maior valor.

### Confianca da estimativa

- **Alta** para o custo atual por agente, porque os numeros base ja vieram medidos na WO.
- **Media** para a economia futura, porque depende do corte final de cada arquivo apos reorganizacao.

## Conclusao

O custo de boot do squad ainda e baixo em reais, mas ja mostra com clareza onde estao os desperdicios. O melhor retorno imediato esta em **tirar historico do inbox ativo**, depois **parar de carregar backlog arquivado** e, por fim, **enxugar o pacote fixo do Claude**.
