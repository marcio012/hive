# Aceite Técnico — Desacoplamento de Paths do Runtime Hive
**ID:** ACEITE-2026-05-27-002
**Tipo:** Implementação
**Gerado por:** Copilot
**Data:** 2026-05-27
**Trigger:** Debate Go
**Thread:** debate-018-empacotamento-framework
**Ref. Arquitetural:** CLAUDE-024 / COPILOT-031-A
**Status:** ✅ Aprovado pelo Owner e implementado

---

## Resumo Executivo
Desacoplar o runtime local do Hive para aceitar core externo via `HIVE_HOME`/`BEEHIVE_PATH`, destravando a portabilidade sem quebrar o fluxo atual.

## Escopo — O que será / foi feito
- [x] Centralizar a resolução de `HIVE_HOME`, `PROJECT_PATH` e `BEEHIVE_PATH` no sidecar do framework
- [x] Atualizar `proxy.sh`, `run.sh`, `squad-bridge.sh`, `package.json` do sidecar e `hive-cost.sh` para usar os paths resolvidos
- [x] Validar que `npm run squad:inbox` continua funcionando no repositório atual

---

## Análise Financeira

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ 0,90 |
| Confiança da estimativa | Alta |
| Valor gerado | Remove o principal bloqueio técnico para uso do core Hive fora da raiz atual |
| Payback | 1 a 2 instalações de novos repositórios |
| Custo de não fazer | O `hive-install.sh` viraria apenas cópia de arquivos, sem portabilidade real |

---

## Critérios de Aceite
- [x] Runtime do sidecar resolve `HIVE_HOME` como raiz do core e `BEEHIVE_PATH` como diretório real do `beehive/`
- [x] `npm run --silent squad:inbox` continua funcionando após o desacoplamento
- [x] `beehive/bin/hive-cost.sh` passou a ler `config.env`, `custos.log` e `hive-telemetry.sh` via `BEEHIVE_PATH`

## Riscos e Ressalvas
- Scripts fora do escopo de COPILOT-031-A ainda podem assumir `HIVE_HOME` como raiz; o helper mitiga o caso de `HIVE_HOME` apontando direto para `beehive/`
- O desacoplamento cobre o runtime auditado; hooks e fluxos de outras interfaces ficam para auditorias futuras

---

## Aprovação do Owner
**Status:** ✅ Aprovado por Márcio
**Aprovado em:** 2026-05-27
**Observações:**
> Márcio liberou a execução ao responder "Pode atuar nelas".
