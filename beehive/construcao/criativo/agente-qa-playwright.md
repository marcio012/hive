---
titulo: Gemini como Agente de QA E2E com Playwright
status: qualificado
proximo: marcio
criado_em: 2026-05-23
criado_por: gemini
fonte: debates/viabilidade-agente-qa.md
---

# Agente de QA Executivo

## Visão

Gemini assume papel de Engenheiro de Testes E2E — usa Playwright para abrir o navegador, executar ações e validar comportamento visual do White Label. Fecha o ciclo da fábrica sem depender de testes manuais do Márcio.

## Capacidades propostas

- Escrever cenários BDD (Dado/Quando/Então) a partir de requisitos
- Executar testes E2E via Playwright
- Analisar screenshots para validar branding (cores, logo, layout)
- Atuar como gate de qualidade no inbox do Copilot — reprovar implementações que não passam nos testes

## Prós

- Velocidade e consistência — sem fadiga, testa edge cases em toda rodada
- Rastreabilidade — cada entrega com laudo automatizado
- Libera o Márcio para estratégia

## Contras

- Custo de tokens de visão para análise de screenshots
- Manutenção dos scripts quando a UI mudar propositalmente
- Complexidade inicial de infra (Playwright no projeto)

## Estimativa de custo (100 testes/mês)

- Execução lógica (Gemini Flash): ~$0.50–$2.00
- Análise visual (Claude Sonnet): ~$5.00–$15.00 (uso pontual)
- Infra/CI: incluso no plano atual

## Tensões / pontos nebulosos

- Quando ativar esse papel? Só após MVP estabilizado
- Quem mantém os scripts quando a UI evolui?
- Como o "veto do QA" se encaixa no fluxo de review cruzado atual?

## Origem

Sessão de brainstorm Gemini/Márcio — 2026-05-23
