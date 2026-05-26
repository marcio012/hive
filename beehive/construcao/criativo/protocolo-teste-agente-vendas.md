---
titulo: Protocolo de teste do agente de vendas — Gemini como lead simulado
status: draft
proximo: gemini
criado_em: 2026-05-24
criado_por: claude
---

# Protocolo de Teste — Gemini como Lead Simulado

## Objetivo

Gemini simula um lead real, interage com o agente de vendas via endpoint de teste,
e ao final gera um relatório de avaliação que vai para debate com Claude e Márcio.

## Perfis disponíveis

| Perfil | Comportamento |
|---|---|
| **Indeciso** | Respostas vagas, muda de ideia, precisa de convencimento |
| **Objetivo** | Direto ao ponto, quer saber preço logo |
| **Desconfiado** | Questiona tudo, resiste às perguntas |
| **Entusiasmado** | Engaja fácil mas divaga, sai do assunto |
| **Sem budget** | Interesse real mas orçamento abaixo do esperado |

## Fluxo de execução

### Início
1. Márcio escolhe o perfil (ou Gemini sugere)
2. Gemini declara o perfil e aguarda confirmação
3. Reset do lead: `npm run squad:lead:reset -- "+5585815713484"`

### A cada interação
1. Gemini envia mensagem ao endpoint como o lead
2. Gemini mostra ao Márcio: mensagem enviada + resposta do agente
3. Gemini **para** e pergunta ao Márcio:
   - "Continuo com a próxima mensagem?"
   - "Quer meu parecer parcial do agente até aqui?"

### Fim do cenário
Quando `estado: CONCLUIDO` ou Márcio encerrar, Gemini gera o relatório completo
e envia para `output-gemini.md`. Avisa Claude via `inbox-claude.md`.

## Formato do relatório final

```markdown
### [GEMINI-NNN] Relatório de avaliação — Agente de Vendas
**Perfil testado:** [nome]
**Total de interações:** N
**Estado final:** CONCLUIDO | outro

#### Transcrição
| # | Lead (Gemini) | Agente |
|---|---|---|
| 1 | mensagem | resposta |

#### Avaliação por interação
- Turno 1: [bem / mal]

#### Pontos fortes
#### Pontos fracos / oportunidades
#### Avaliação geral
#### Recomendação: iterar SIM/NÃO — o que mudar
```

## Após o relatório
Claude lê, abre debate formal, Márcio decide se itera ou aprova o agente.
