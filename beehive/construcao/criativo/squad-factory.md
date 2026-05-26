---
titulo: Squad como Fábrica de Software portável
status: qualificado
proximo: marcio
criado_em: 2026-05-23
criado_por: gemini
fonte: briefing-squad-factory.md
---

# Squad como Fábrica de Software

## Visão

Transformar o framework de orquestração de IAs em uma Fábrica de Software portável. O White Label passa a ser o Caso de Uso #1 — a fábrica em si é o produto.

## Pilares

- **Orquestração multi-agente** — papéis especializados (Claude/Copilot/Gemini) com canais formais
- **Multicontexto e portabilidade** — separação total entre "Motor do Squad" (scripts, regras) e "Contexto do Projeto" (código, regras de negócio do cliente)
- **Independência tecnológica** — atuar em stacks diferentes sem alterar a lógica de orquestração

## Ciclo de vida completo

1. Concepção (Claude — ADRs, tese)
2. Planejamento (quebra em Work Orders, estimativa)
3. Execução (Copilot — commit + teste + evidência)
4. Implantação (scripts/ops — esteira de montagem)
5. Sustentação (futuro — agente de QA/Ops monitorando produção)

## Tensões / pontos nebulosos

- Como transformar o desejo do usuário em Work Orders acionáveis de forma autônoma?
- Como a squad reage a alertas de produção?
- Roteiro técnico para separar configs dos agentes do código do White Label

## Parecer do Claude — 2026-05-24

✅ Segurar — visão aprovada como norte estratégico, não como próximo passo.
Pré-requisitos: DEBATE-008 (Squad Vault) e DEBATE-009 (Portabilidade) precisam fechar primeiro.
Quando ambos fecharem, promover para DEBATE-010.

## Origem

Sessão de brainstorm Gemini/Márcio — 2026-05-23
