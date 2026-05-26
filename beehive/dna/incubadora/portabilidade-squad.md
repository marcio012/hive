---
titulo: Portabilidade do squad — separar framework do contexto do projeto
status: qualificado
proximo: marcio
criado_em: 2026-05-23
criado_por: gemini
fonte: insights-buffer.md
---

# Portabilidade do Squad

## Visão

O framework do squad (scripts, regras de orquestração, protocolos) é 70% portável hoje. O bloqueio é que as configs `.claude/`, `.copilot/`, `.gemini/` misturam regras do framework com contexto específico do White Label.

## O que já existe

- `KIT_PORTABILIDADE_SQUAD.md` como semente
- Scripts genéricos em `scripts/local/`
- Separação conceitual em `ai/construcao/` vs código do produto

## O que falta

- Separar explicitamente as duas camadas nas configs dos agentes
- Definir o que é "Motor do Squad" (vai junto ao portar) e o que é "Contexto do Projeto" (fica)
- Protocolo de onboarding para novo projeto usar o mesmo squad

## Tensões / pontos nebulosos

- Quando portar? Só faz sentido após o White Label MVP validado
- Antigravity SDK foi mencionado como mecanismo de empacotamento — avaliar quando chegar a hora
- Layer 3 (agentes dos tenants) depende dessa separação para escalar

## Origem

Insights-buffer — 2026-05-23
