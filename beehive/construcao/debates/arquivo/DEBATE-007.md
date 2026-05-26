# DEBATE-007 — Fluxo criativo entre agentes

**Status:** 🟡 aberto — aguarda decisão do Márcio
**Aberto em:** 2026-05-24
**Owner:** Márcio (decisão final) + Claude (arquitetura) + Copilot (execução) + Gemini (criativo)

## Problema

O Gemini é o ponto criativo do squad — ideias nascem em sessões livres com o Márcio, sem protocolo, sem contrato. Quando algo útil emerge, não existe caminho natural para chegar nos outros agentes sem o Márcio copiar manualmente.

O inbox foi criado para tarefas com contrato — é fila de execução, não de ideias. Usar o inbox para fluxo criativo engessa o papel do Gemini e cria atrito desnecessário.

**Sintoma observado:** Gemini produziu três documentos de brainstorm em sessão com o Márcio, mas o material chegou ao Claude via leitura manual — não por fluxo.

## Fluxo desejado

> Ideia nasce no Gemini → percorre os agentes em sequência → chega ao Márcio como sugestão consolidada — sem o Márcio copiar nada entre agentes.

## Proposta base (Gemini)

Criar `ai/construcao/criativo/` como espaço de arquivos evolutivos. Cada ideia é um arquivo `.md` com campos de controle no cabeçalho:

```
status: draft       → Gemini organizou a ideia bruta
status: qualificado → Claude leu e adicionou camada arquitetural
status: contrato    → Copilot transformou em handoff ou issue técnica
status: descartado  → não avança
proximo: claude | copilot | marcio
```

O campo `proximo:` indica quem lê a seguir — sem Márcio como roteador.

## Pareceres

### Claude
**Posição:** ✅ aprovado com ajuste

Proposta resolve o problema central. Ajuste: sem movimento de pasta entre etapas — só `status:` e `proximo:` no cabeçalho. A separação inbox (tarefa) vs criativo (ideia) deve ser explícita no protocolo.

Ponto de atenção: definir quando uma ideia em `criativo/` vira debate formal, e ciclo de limpeza para evitar depósito sem curadoria.

### Copilot
**Posição:** ✅ aprovado

Inbox fica como fila curta de contexto/tarefa. Artefato próprio para criação faz sentido. Board fica sob execução preferencial do Copilot; Claude pode acionar mas não vira operador recorrente.

### Gemini
**Posição:** ✅ aprovado (autor da proposta)

Gemini como "Filtro de Sinal" — organiza o caos criativo em estrutura que Claude qualifica e Copilot implementa. Modelo assíncrono, rastreável, sem Márcio como ponte.

---

## Decisões para o Márcio

**1.** Aprova o modelo `ai/construcao/criativo/` com arquivos evolutivos e campos `status:` / `proximo:`?

**2.** Quem promove uma ideia de `criativo/` para debate formal — só você, ou qualquer agente pode propor a promoção?

**3.** O board fica preferencialmente com o Copilot como regra registrada, mantendo Claude como alternativa explícita quando acionado diretamente?

---

## Decisão — 2026-05-24

**1. `ai/construcao/criativo/`** ✅ aprovado — arquivos evolutivos com `status:` e `proximo:` no cabeçalho.

**2. Promoção para debate formal** ✅ qualquer agente pode propor — Márcio decide se abre ou descarta.

**3. Board** ✅ preferencialmente Copilot, não exclusivo — Claude continua como alternativa quando acionado diretamente.

**Diretriz gerada:** DIR-042
**Status:** ✅ encerrado
