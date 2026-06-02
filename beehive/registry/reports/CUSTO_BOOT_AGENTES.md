# Relatório de Custo de Boot por Agente

**Data:** 2026-06-01  
**Origem:** WO-054 / HIVE-029  
**Referência de custo:** ~R$ 0,01 por 1.000 tokens de input

---

## Resumo executivo

Hoje, o boot mais caro do squad é o do **Claude** e do **Copilot-Hive**, ambos na faixa de **5,8 mil tokens por sessão**. Em dinheiro, isso fica perto de **R$ 0,06 por abertura**.

O ponto mais pesado é também o mais simples de atacar: o **inbox-copilot-hive.md**, que cresceu com entradas já consumidas. Depois dele, o maior peso recorrente está no **BACKLOG.md** compartilhado por três fluxos e no pacote fixo de governança do **Claude**.

Se os cinco boots mapeados acontecerem uma vez cada, o custo combinado estimado é de **21.575 tokens**, ou **R$ 0,216 por rodada completa**.

## Custo por agente/papel

| Agente / papel | Palavras estimadas | Tokens estimados | Custo por boot |
|---|---:|---:|---:|
| Claude (Arquiteto / Auditor) | 4.086 | 5.836 | R$ 0,058 |
| Copilot-Hive | 4.056 | 5.794 | R$ 0,058 |
| Gemini — PO-Hive | 2.700 | 3.857 | R$ 0,039 |
| Gemini — PO-Produto | 2.134 | 3.049 | R$ 0,030 |
| Copilot-TOS | 2.127 | 3.039 | R$ 0,030 |
| **Total da rodada completa** | **15.103** | **21.575** | **R$ 0,216** |

## Leitura prática

- **Faixa mais cara:** Claude e Copilot-Hive estão praticamente empatados.
- **Faixa intermediária:** Gemini no papel PO-Hive.
- **Faixa mais leve:** Copilot-TOS e Gemini PO-Produto.

Em termos de gestão, isso significa que cada melhoria no boot do Claude ou do Copilot-Hive gera retorno mais rápido do que otimizar os fluxos menores primeiro.

## Gargalos

1. **inbox-copilot-hive.md (1.298 palavras)**  
   O arquivo carregava muito histórico encerrado para pouquíssimo trabalho ativo. Era um custo recorrente sem gerar valor novo. *(Resolvido na WO-054)*

2. **BACKLOG.md (824 palavras)**  
   O mesmo bloco pesa no boot do Claude, do Copilot-Hive e do Gemini PO-Hive. Um arquivo único está cobrando três vezes.

3. **CLAUDE.md + CLAUDE_REF.md (1.418 palavras)**  
   Esse pacote de governança é importante, mas hoje entra com peso fixo alto antes mesmo da tarefa começar.

## Otimizações sugeridas

| Ação | Esforço | Ganho estimado | Impacto financeiro |
|---|---|---|---|
| Limpar o inbox do Copilot-Hive e manter o histórico separado | Baixo | ~1,0k a 1,4k tokens a menos por boot do Copilot-Hive | ~R$ 0,010 a R$ 0,014 por sessão |
| Separar `BACKLOG.md` em ativo + arquivo | Médio | ~500 tokens a menos em 3 boots diferentes | ~R$ 0,015 por rodada completa |
| Enxugar o pacote fixo do Claude com referência curta + apêndice | Médio | ~800 a 1,0k tokens a menos por boot do Claude | ~R$ 0,008 a R$ 0,010 por sessão |

## Análise financeira

### Custo atual

- **1 boot do Claude:** ~R$ 0,058
- **1 boot do Copilot-Hive:** ~R$ 0,058
- **1 rodada completa dos 5 boots mapeados:** ~R$ 0,216

### Economia potencial

- **Ação imediata:** a limpeza do inbox do Copilot-Hive já devolve economia recorrente com esforço baixo e payback imediato.
- **Maior multiplicador:** dividir o `BACKLOG.md` traz pouco risco e reduz custo em três fluxos ao mesmo tempo.
- **Maior oportunidade estrutural:** reduzir o pacote fixo do Claude diminui custo e libera contexto para auditoria técnica de maior valor.

### Confiança da estimativa

- **Alta** para o custo atual por agente, porque os números base já vieram medidos na WO.
- **Média** para a economia futura, porque depende do corte final de cada arquivo após reorganização.

## Conclusão

O custo de boot do squad ainda é baixo em reais, mas já mostra com clareza onde estão os desperdícios. O melhor retorno imediato está em **tirar histórico do inbox ativo**, depois **parar de carregar backlog arquivado** e, por fim, **enxugar o pacote fixo do Claude**.
