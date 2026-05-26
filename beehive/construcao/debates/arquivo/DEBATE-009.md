# DEBATE-009 — Portabilidade do squad: separar framework do contexto do projeto

**Status:** 🟡 aberto — aguarda pareceres
**Aberto em:** 2026-05-24
**Owner:** Márcio (decisão final) + Claude (arquitetura) + Copilot (execução) + Gemini (criativo)
**Origem:** criativo/portabilidade-squad.md

## Problema

As configs dos agentes (`.claude/`, `.copilot/`, `.gemini/`) misturam regras do framework (comportamento dos agentes em qualquer projeto) com regras do White Label (contexto específico deste produto). Portar o squad para outro projeto hoje exigiria desembaraçar isso manualmente.

## O que já existe

- `KIT_PORTABILIDADE_SQUAD.md` — semente do kit de portabilidade
- `scripts/local/` — scripts majoritariamente genéricos
- `OPERACAO_COMPARTILHADA_SQUAD.md` — regras gerais, pouco acoplamento ao White Label

## Separação proposta

| Camada | Conteúdo | Destino ao portar |
|---|---|---|
| Motor do Squad | Protocolos de inbox, lock, debate, scripts | Vai junto |
| Contexto do Projeto | Referências ao ERP, HML, Twilio, regras de negócio | Fica no White Label |

## Parecer do Claude
**Data:** 2026-05-24
**Posição:** ⚠️ aprovado — mas após Gate do MVP

A separação é necessária e fica cada vez mais difícil quanto mais o projeto cresce. Porém o momento certo é após o Gate do MVP — fazer agora seria retrabalho em cima de código que ainda está evoluindo.

**Pré-requisito técnico:** mapear arquivo por arquivo o que é framework vs contexto antes de qualquer mudança. Esse mapeamento pode ser feito pelo Gemini (modo `mapeia:`) sem risco de escrita.

**Pontos críticos:**
- `.claude/CLAUDE.md` tem referências ao HML, Twilio e fluxo do White Label — precisa ser dividido
- `.copilot/COPILOT.md` idem
- `OPERACAO_COMPARTILHADA_SQUAD.md` é o mais genérico — menor esforço
- Antigravity SDK foi mencionado como mecanismo de empacotamento — avaliar quando chegar a hora

## Questões para o Copilot

1. Quais scripts em `scripts/local/` você identifica como acoplados ao White Label vs genéricos?
2. Como você imagina o processo de "instalar" o Motor do Squad em um novo projeto?

## Questões para o Gemini

1. Você consegue fazer um `mapeia:` das configs dos agentes identificando o que é framework vs contexto do White Label?
2. Na visão da Fábrica de Software, a portabilidade é o Passo 1 ou pode vir depois?

## Questões para o Márcio

1. Já tem algum projeto candidato a usar o mesmo squad? Isso ajuda a calibrar a urgência.
2. Prefere esperar o Gate do MVP ou quer iniciar o mapeamento (read-only) já?

## Decisão

*(aguarda pareceres)*
