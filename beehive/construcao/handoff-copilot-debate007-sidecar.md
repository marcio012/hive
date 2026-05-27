# Handoff: Implementação do Sidecar V3 (DEBATE-007)

**De:** Claude (Arquiteto)  
**Para:** Copilot (Engenheiro)  
**Data:** 2026-05-26  
**Debate de origem:** `beehive/construcao/debates/arquivo/DEBATE-007.md`  
**Status do debate:** Consolidado e aprovado pelo Márcio

---

## Contexto

O squad aprovou o isolamento do Squad Framework em runtime próprio (sidecar V3). A proposta cria `.agile-squad/framework/` com `package.json` independente (Node v24), enquanto a raiz do repo mantém apenas proxies finos para o framework.

---

## Sequência de implementação (obrigatória — nesta ordem)

### Etapa 1 — Estrutura do sidecar
- Criar `.agile-squad/framework/package.json` com `engines.node: ">=24"`.
- Criar `.agile-squad/framework/.nvmrc` com valor `24`.
- Mover dependências operacionais do squad (não do produto) para este `package.json`.

### Etapa 2 — Migrar inbox e bridge primeiro
- São os scripts com mais referências a `beehive/construcao/` — testar antes dos demais.
- Após migração, validar que leitura de inbox funciona a partir do novo CWD.

### Etapa 3 — Migrar demais scripts operacionais
- Lock, session, health, check e demais scripts do squad.

### Etapa 4 — Proxies na raiz
- Substituir scripts operacionais do `package.json` raiz por proxies puros (sem lógica).
- Proxy padrão: troca para v24 via guard + delega para o script do sidecar.

### Etapa 5 — Validação final
- Confirmar que nenhuma `require`/`import` cruza a fronteira produto ↔ framework.
- Rodar `npm run squad:inbox` e `npm run squad:bridge` a partir da raiz e confirmar funcionamento.

---

## Condições obrigatórias (C1–C6)

| # | Regra | Verificação |
|---|-------|-------------|
| C1 | Proxies na raiz = delegadores puros, zero lógica operacional | Inspeção manual |
| C2 | Scripts do framework resolvem caminhos via `$(git rev-parse --show-toplevel)` — nunca relativos ao script | Grep no código |
| C3 | Proxies gerenciam troca de runtime (guard de versão Node) de forma transparente para o operador | Teste manual |
| C4 | `squad-bridge.sh` não depende de caminho hardcoded para binário Node | Inspeção do script |
| C5 | Um único comando de bootstrap (`npm run setup` ou similar) prepara produto E framework | Teste em ambiente limpo |
| C6 | Arquivos de estado (session-state.env, locks, inbox) permanecem canônicos na raiz do repo | Inspeção de caminhos |

---

## Restrições

- **NÃO** mover arquivos de estado compartilhado para dentro do sidecar.
- **NÃO** fazer o framework importar módulos do produto (e vice-versa).
- **NÃO** alterar o `package.json` raiz além de remover scripts migrados e adicionar proxies.
- Parar e retornar ao Claude se qualquer script atual não puder ser migrado sem reescrever lógica significativa.

## Mapa de scripts — o que vai para onde (CLAUDE-014)

> Análise do `package.json` raiz atual. Use este mapa na Etapa 4.

### Scripts que MIGRAM para o sidecar (implementação real)
Estes scripts saem do `package.json` raiz e passam a viver **apenas** em `.agile-squad/framework/package.json`:

| Script raiz atual | Implementação |
|---|---|
| `hive` | `bash beehive/bin/hive.sh` |
| `hive:inbox` | `npm run hive -- inbox` |
| `hive:status` | `npm run hive -- status` |
| `hive:lock` | `npm run hive -- lock` |
| `hive:gate` | `npm run hive -- gate` |
| `hive:check` | `npm run hive -- check` |
| `hive:health` | `bash beehive/bin/hive-health.sh` |
| `hive:telemetry` | `bash beehive/bin/hive-telemetry.sh` |
| `hive:insight` | `npm run hive -- insight` |
| `hive:view` | `bash beehive/bin/hive-view.sh` |
| `hive:session:gemini` | `npm run hive -- session-start gemini` |
| `hive:session:claude` | `npm run hive -- session-start claude` |
| `hive:session:copilot` | `npm run hive -- session-start copilot` |
| `hive:session:state` | `npm run hive -- session-update` |
| `gemini:po` | `npm run hive -- session-start gemini --role po` |
| `gemini:projetista` | `npm run hive -- session-start gemini --role projetista` |
| `gemini:coordenador` | `npm run hive -- session-start gemini --role coordenador` |

### Scripts que PERMANECEM na raiz como proxies finos
Estes são a interface estável do operador — ficam no `package.json` raiz como **delegadores puros** para o sidecar:

| Script raiz (proxy) | Delega para |
|---|---|
| `squad:inbox` | sidecar: `hive:inbox` |
| `squad:session:claude` | sidecar: `hive:session:claude` |
| `squad:session:gemini` | sidecar: `hive:session:gemini` |
| `squad:session:copilot` | sidecar: `hive:session:copilot` |
| `squad:lock:acquire` | sidecar: `hive -- lock set` |
| `squad:lock:release` | sidecar: `hive -- lock release` |
| `squad:lock:assert` | sidecar: `hive -- lock check` |
| `squad:cost` | sidecar: executa `hive-cost.sh` via sidecar |
| `squad:cost:all` | sidecar: idem com `--all` |
| `squad:cost:log` | sidecar: idem com `--log` |
| `po:demand` | sidecar: executa `hive-po-demand.sh` via sidecar |

### Padrão de proxy (C1 + C3)
Cada proxy na raiz deve seguir este modelo — **sem lógica além da delegação**:
```json
"squad:inbox": "node -e \"const {execSync}=require('child_process');const v=parseInt(execSync('node -v').toString().replace('v',''));if(v<24){process.stderr.write('Node v24+ requerido\\n');process.exit(1)}\" && cd .agile-squad/framework && npm run hive:inbox"
```
Ou, mais legível via script shell delegador:
```bash
#!/usr/bin/env bash
# .agile-squad/proxy.sh — chamado por todos os proxies da raiz
ROOT="$(git rev-parse --show-toplevel)"
exec bash "$ROOT/.agile-squad/framework/run.sh" "$@"
```

---

## Ponto de parada

Após concluir a Etapa 5, retornar ao Claude com:
- Lista dos scripts migrados.
- Resultado do `npm run squad:inbox` e `npm run squad:bridge` pós-migração.
- Qualquer exceção encontrada nas condições C1–C6.
