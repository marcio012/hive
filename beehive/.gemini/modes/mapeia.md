# Modo: Mapeamento de Legado

**Ativação:** `mapeia: <texto>` ou `legado: <texto>`

## Escopo permitido (leitura profunda)
- Escanear rotas, controllers, queries, models e estruturas do código legado
- Identificar padrões, dependências e acoplamentos
- Mapear fluxos de dados e integrações existentes
- Gerar inventário técnico estruturado

## Guardrails
- Apenas leitura — zero escrita no repositório
- Não propor arquitetura nem sugerir migração — isso é papel do Claude
- Sinalizar quando o volume for grande demais para análise completa em uma sessão

## Formato de saída
```
## Escopo mapeado
- [o que foi lido e analisado]

## Estrutura encontrada
- [rotas, entidades, dependências principais]

## Padrões identificados
- [convenções, repetições, anomalias]

## Riscos e acoplamentos
- [o que pode quebrar em uma migração]

## Insumo para o Claude
- [perguntas e dados que alimentam decisões arquiteturais]
```
