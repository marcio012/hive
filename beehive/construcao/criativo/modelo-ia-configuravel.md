---
titulo: Modelo de IA configurável via variável de ambiente
status: contrato
proximo: copilot
criado_em: 2026-05-24
criado_por: gemini
fonte: output-gemini.md (GEMINI-003/004)
---

# Modelo de IA Configurável

## Problema

O modelo do `IaMarketingService` está hardcoded (`gemini-3.5-flash`). Trocar o modelo exige alteração de código e redeploy — como ficou evidente quando o `gemini-2.0-flash` foi descontinuado.

## Proposta

Ler o modelo via variável de ambiente:

```typescript
const GEMINI_MODEL = process.env.AI_MARKETING_MODEL_NAME ?? 'gemini-3.5-flash';
```

Troca de modelo vira só atualização de env no servidor — sem commit, sem deploy.

## Análise de opções (Gemini)

| Opção | Complexidade | Valor |
|---|---|---|
| Variável de ambiente | Baixa | Imediato — padrão 12-factor |
| PlatformConfig (DB) | Média | Troca em runtime sem restart |
| Platform Admin (UI) | Alta | Baixo no momento |

**Recomendação:** Fase 1 via env var. Fase 2 (DB) só se a troca de modelo virar rotina.

## Tensões

- Env var exige restart do container para aplicar — melhor que redeploy, mas não é zero downtime
- Quem controla qual modelo está ativo? (Márcio via SSH no HML hoje)

## Parecer do Claude — 2026-05-24

✅ Fase 1 via env var aprovada. `ConfigService` já existe no serviço — ler `GEMINI_MODEL` de lá em vez da constante. Fallback `?? 'gemini-3.5-flash'` obrigatório. Restart do container é aceitável como custo de aplicação. Fase 2 (DB) só quando troca de modelo virar rotina — não é o caso agora.

Contrato para o Copilot quando Márcio aprovar: trocar a constante hardcoded por `this.config.get<string>('GEMINI_MODEL') ?? 'gemini-3.5-flash'` e adicionar `GEMINI_MODEL=gemini-3.5-flash` em `~/wl-envs/core.env` no HML.

## Origem

Output Gemini GEMINI-003/004 — 2026-05-24
