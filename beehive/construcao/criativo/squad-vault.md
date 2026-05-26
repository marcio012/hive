---
titulo: Squad Vault — cofre unificado de segredos
status: qualificado
proximo: marcio
criado_em: 2026-05-23
criado_por: gemini
fonte: insights-buffer.md
---

# Squad Vault

## Visão

Camada unificada de gestão de segredos para a fábrica e para o produto. Hoje os segredos são gerenciados manualmente (arquivos `.env` no servidor, gestão SSH). Isso não escala e é risco de segurança.

## Três tiers

- **Tier 1 (Framework):** chaves das IAs e infra do squad (GEMINI_API_KEY, tokens dos agentes)
- **Tier 2 (Projeto):** credenciais da solução sendo construída (DATABASE_URL, JWT_SECRET, Twilio)
- **Tier 3 (Tenant/BYOK):** chaves dos clientes finais (Stripe, Twilio próprio) — isoladas e criptografadas

## Mecanismo desejado

Injeção de segredos em tempo de execução (RAM/memória), impedindo que chaves toquem disco em texto claro ou vazem no histórico do chat.

## Tensões / pontos nebulosos

- Qual ferramenta? (HashiCorp Vault, AWS Secrets Manager, Doppler, solução própria?)
- O debate de KeyVault está aberto em CLAUDE_HML.md — esse item é a versão expandida
- Tier 3 exige isolamento por tenant — complexidade alta, só faz sentido quando houver clientes reais

## Origem

Insights-buffer — 2026-05-23
