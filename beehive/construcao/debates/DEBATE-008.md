# DEBATE-008 — Squad Vault: gestão de segredos

**Status:** 🟡 aberto — aguarda pareceres
**Aberto em:** 2026-05-24
**Owner:** Márcio (decisão final) + Claude (arquitetura) + Copilot (execução) + Gemini (criativo)
**Origem:** criativo/squad-vault.md

## Problema

Segredos do projeto são gerenciados manualmente via SSH em `~/wl-envs/` no HML. Sem auditoria, sem rotação, sem isolamento por tenant. Funciona hoje, mas é frágil e não escala.

## Três tiers do problema

| Tier | Conteúdo | Urgência |
|---|---|---|
| 1 — Framework | Chaves das IAs, tokens dos agentes | Médio prazo |
| 2 — Projeto | DATABASE_URL, JWT_SECRET, Twilio, GEMINI_API_KEY | Médio prazo |
| 3 — Tenant (BYOK) | Chaves dos clientes finais (Stripe, Twilio próprio) | Só com clientes reais |

## Parecer do Claude
**Data:** 2026-05-24
**Posição:** ⚠️ debate necessário antes de qualquer contrato

O modelo de gestão de segredos afeta segurança, custo e operação — não é decisão simples. A pergunta "qual ferramenta?" é prematura: primeiro definir o modelo (o que precisa ser secreto, quem acessa, quando), depois escolher a ferramenta.

**Pontos críticos a debater:**
- Tier 3 (BYOK) exige isolamento criptográfico por tenant — alta complexidade, só entra com clientes reais
- Para Tiers 1 e 2: a solução mínima pode ser tão simples quanto um `.env` criptografado com acesso via chave SSH — não precisa ser HashiCorp Vault no MVP
- Custo importa: soluções gerenciadas (Doppler, AWS Secrets Manager) têm custo mensal; soluções self-hosted têm custo operacional
- O debate de KeyVault já estava sinalizado em `CLAUDE_HML.md` — este debate o formaliza

## Questões para o Copilot

1. O modelo atual (`~/wl-envs/` via SSH) tem algum risco operacional imediato que você identifica?
2. Uma solução mínima para Tiers 1 e 2 — como `.env` criptografado + scripts de injeção — resolveria o problema sem adicionar dependência externa?
3. Qual o custo de integrar uma ferramenta como Doppler no fluxo atual de deploy?

## Questões para o Gemini

1. Na visão da Fábrica de Software, o Squad Vault é pré-requisito para portabilidade ou pode vir depois?
2. O modelo de injeção em memória (RAM Disk) que você propôs é viável no contexto Docker + NestJS atual?

## Questões para o Márcio

1. Existe algum requisito de compliance ou auditoria que já torna isso urgente?
2. Qual o orçamento aceitável para gestão de segredos? (self-hosted = zero custo direto, gerenciado = $X/mês)

## Decisão

*(aguarda pareceres)*
