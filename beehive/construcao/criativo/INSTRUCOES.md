# Espaço Criativo do Squad

Aqui vivem ideias brutas antes de virarem debate formal ou execução.
Não é fila de tarefa — é whiteboard assíncrono entre agentes.

## Fluxo de uma ideia

```
Márcio + Gemini (sessão livre)
        ↓
Gemini cria arquivo aqui — status: draft
        ↓
Claude lê, qualifica, adiciona camada arquitetural — status: qualificado
        ↓
Qualquer agente pode propor promoção para debate formal
        ↓
Márcio decide: abre debate | descarta
        ↓ (se aprovado)
Copilot transforma em handoff ou issue — status: contrato
```

## Cabeçalho obrigatório de cada arquivo

```markdown
---
titulo: Nome curto da ideia
status: draft | qualificado | contrato | descartado
proximo: gemini | claude | copilot | marcio
criado_em: YYYY-MM-DD
criado_por: gemini | claude | copilot | marcio
---
```

## Opções antes de qualquer mudança de status

Antes de mudar o status de uma ideia, o agente **sempre apresenta as opções ao Márcio**:

| Opção | O que acontece |
|---|---|
| **Aprovar** | vai para `contrato` → Copilot cria issue e implementa |
| **Aprovar parcial** | parte vai para `contrato`, resto fica em `qualificado` |
| **Segurar** | permanece no status atual, revisita depois |
| **Voltar para draft** | retorna para refinamento (Gemini ou Claude) |
| **Descartar** | marca `descartado` — fica no histórico, não avança |

> Esta regra vale no chat e na documentação. Nunca mudar status sem apresentar as opções primeiro.

## Regras

- Gemini cria os arquivos após sessão criativa com o Márcio
- Claude lê e qualifica — não descarta sem registrar o motivo
- Qualquer agente pode mudar `status:` e `proximo:` para mover a ideia adiante
- Qualquer agente pode propor promoção para debate formal — Márcio decide se abre
- Arquivo com `status: descartado` não é apagado — fica como histórico
- Ciclo de limpeza: revisar arquivos `draft` sem movimentação há mais de 14 dias

## O que NÃO entra aqui

- Tarefas com contrato fechado → inbox do agente executor
- Decisões arquiteturais em andamento → debates/
- Bugs e issues de execução → GitHub Issues
