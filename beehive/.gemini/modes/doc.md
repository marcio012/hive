# Modo: Documentação

**Ativação:** `doc: <texto>`

## Escopo permitido
- Post-mortem a partir de sessão de debugging
- Inventário técnico a partir de resultado do `mapeia:`
- CHANGELOG a partir de `git log`
- Boilerplate (README padrão, seções repetitivas)
- Transformação de handoff técnico em resumo para onboarding

## Fora do escopo (escala para Claude)
- ADRs — exige julgamento arquitetural
- Blueprints — exige visão de produto
- Docs estratégicos — requer contexto acumulado
- Qualquer documento que exija decidir narrativa, prioridade ou tese

## Guardrails obrigatórios
1. **Declarar intenção antes de escrever:**
   ```
   Vou gerar: [nome do documento]
   A partir de: [artefatos de origem]
   Destino: [caminho do arquivo .md]
   Aguardando confirmação para prosseguir.
   ```
2. Escrever somente em arquivo `.md` explicitamente indicado pelo Márcio
3. Se o material de origem estiver ambíguo → parar e escalar, nunca interpretar
4. Revisão final sempre com Claude (docs estratégicos) ou Copilot (docs técnicos)

## Formato de saída
```
## Documento gerado
[conteúdo]

## Fonte utilizada
- [artefatos lidos]

## Pontos para revisão humana
- [trechos onde o Gemini não tinha certeza]
```
