# Aceite Técnico — hive-install.sh MVP
**ID:** ACEITE-2026-05-27-003
**Tipo:** Implementação
**Gerado por:** Copilot
**Data:** 2026-05-27
**Trigger:** Debate Go
**Thread:** debate-018-empacotamento-framework
**Ref. Arquitetural:** CLAUDE-024 / COPILOT-031-B
**Status:** ✅ Aprovado pelo Owner e implementado

---

## Resumo Executivo
Criar um instalador MVP que inicializa uma instância nova do Hive sem copiar o core, preparando a estrutura mínima para operar o inbox em outro repositório.

## Escopo — O que será / foi feito
- [x] Criar `beehive/bin/hive-install.sh` recebendo `TARGET_REPO`
- [x] Gerar estrutura mínima da instância, sidecar local e `package.json` com scripts do squad
- [x] Criar `beehive/config.env` no alvo com template padrão e `HIVE_VERSION`

---

## Análise Financeira

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ 1,30 |
| Confiança da estimativa | Média |
| Valor gerado | Permite bootstrap repetível de uma nova instância Hive em minutos |
| Payback | 1 onboarding de repositório já paga o esforço |
| Custo de não fazer | Cada novo repo exigiria montagem manual, com alto risco de drift operacional |

---

## Critérios de Aceite
- [x] `bash beehive/bin/hive-install.sh /tmp/test-repo` cria a estrutura mínima da instância
- [x] `HIVE_HOME=/home/marcio/job/hive/beehive npm run --silent squad:inbox` funciona no repo-alvo
- [x] `beehive/config.env` do alvo registra `HIVE_VERSION="1.0.0"`

## Riscos e Ressalvas
- O MVP instala apenas a estrutura mínima para operação do squad; integrações extras de editor e hooks ficam fora deste escopo
- Em repositórios com scripts conflitantes, o instalador preserva comandos existentes e só adiciona os que estiverem ausentes

---

## Aprovação do Owner
**Status:** ✅ Aprovado por Márcio
**Aprovado em:** 2026-05-27
**Observações:**
> Márcio liberou a execução ao responder "Pode atuar nelas".
