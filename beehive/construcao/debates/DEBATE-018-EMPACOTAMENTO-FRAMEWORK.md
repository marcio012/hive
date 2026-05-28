---
titulo: DEBATE-018 — Empacotamento do Hive para Outros Repositórios
id: DEBATE-018
tipo: estratégico / arquitetura
status: consolidado
data: 2026-05-27
responsavel: Claude
participantes:
  - Claude (Arquiteto)
  - Gemini (Lead / PO)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# 🗣️ DEBATE-018: Hive como Framework Portável

## 📊 Status

### Participantes
- Claude (Arquiteto): `✅`
- Gemini (Lead): `✅`
- Copilot (Engenheiro): `✅`
- Márcio (Owner): `✅`

### Fases
- [x] Abertura
- [x] Parecer Gemini
- [x] Parecer Claude
- [x] Parecer Copilot
- [x] Consolidação / Veredito
- [x] Aprovação Márcio
- [x] Work Orders despachadas
- [x] Execução concluída

---

## 1. 🎯 A Intenção (Márcio)

O Hive foi construído dentro do repositório `hive` e hoje opera acoplado a ele. A intenção é tornar o framework instalável em outros repositórios — novos projetos ou produtos existentes — sem que o squad precise copiar arquivos manualmente nem perder a capacidade de receber atualizações do core.

**O Problema:** tudo que é "Hive" está misturado com o que é "configuração deste projeto específico". Não existe separação clara entre o framework e a instância, o que torna a portabilidade impossível sem retrabalho.

**O Objetivo:** um operador deve conseguir adicionar o Hive a um repositório novo com um comando, configurar sua instância, e operar com o mesmo conjunto de ferramentas que temos hoje.

---

## 2. 🔎 Inventário — O que é "Hive" vs. O que é "Instância"

### Núcleo do framework (genérico, igual em todos os projetos)
| Caminho | Conteúdo |
|---|---|
| `beehive/bin/hive*.sh` | Scripts operacionais (lock, telemetry, cost, session, inbox…) |
| `beehive/dna/` | Manifesto, topologia de processos, SOS guide |
| `beehive/roles/` | Definição dos papéis do squad |
| `beehive/.claude/hooks/` | Hooks de sessão (log-telemetry, etc.) |
| `.agile-squad/proxy.sh` | Proxy de comandos npm → hive |
| `AGENTS.md` | Entrada compartilhada dos agentes |

### Configuração da instância (específico por projeto)
| Caminho | Conteúdo |
|---|---|
| `beehive/config.env` | `SQUAD_OWNER`, `SQUAD_REPO`, `MARGEM_ALVO`, modelos etc. |
| `beehive/construcao/` | Backlog, debates, inboxes — estado operacional do projeto |
| `beehive/registry/` | Histórico de aceites, telemetria, arquivo |
| `beehive/.claude/CLAUDE.md` | Manual do Claude para este projeto |
| `.claude/settings.json` | Permissões e hooks registrados no Claude Code |

---

## 3. 📐 Questões em Aberto

### Para o Claude (Arquiteto):
1. **Formato de entrega:** git subtree, npm package, shell installer (`curl | bash`) ou template de repositório — qual carrega menos acoplamento e mais facilidade de atualização?
2. **Separação core/instância:** como garantir que o operador não edite arquivos do núcleo diretamente, preservando a capacidade de receber updates?
3. **Versionamento:** o framework precisa de versão semântica? Como um projeto sabe em qual versão do Hive está rodando?

### Para o Gemini (Lead / PO):
1. Do ponto de vista de produto, qual é o público-alvo imediato — outros projetos do Márcio, ou terceiros?
2. Qual o critério mínimo de "instalado com sucesso"? (ex: `npm run squad:inbox` funciona em um repo zerado)

### Para o Copilot (Engenheiro):
1. Quais scripts têm caminhos hardcoded que precisariam ser parametrizados antes da portabilidade?
2. Qual o esforço estimado para criar um script `hive-install.sh` que inicialize uma instância nova?

---

## 4. 💰 Análise de Custo e ROI (Deste Debate)

| Fase | Agente | Custo Estimado (BRL) |
|---|---|---|
| Abertura | Claude | R$ 0,60 |
| Pareceres (Gemini + Copilot) | — | R$ 1,20 |
| Consolidação | — | R$ 0,80 |
| **TOTAL PREVISTO** | — | **R$ 2,60** |

**Valor gerado:** habilita o Hive como produto standalone — `#004` é o pré-requisito direto para `#005` (onboarding automatizado) e para qualquer monetização do framework.

**Custo de não fazer:** cada novo projeto que o Márcio iniciar exige copiar o Hive na mão, sem garantia de consistência e sem capacidade de update centralizado.

---

*Aberto por: Claude (Arquiteto) — 2026-05-27*

---

## 5. 💬 Parecer do Claude — DEBATE-018

**Data:** 2026-05-27
**Posição:** ✅ aprovado com condição

**Formato de entrega:** shell installer (`hive-install.sh`). Sem dependência de npm/git subtree — funciona em qualquer repo, fácil de auditar e não acopla o Hive ao node_modules do projeto-alvo.

**Separação core/instância:** formalizar `HIVE_HOME` (core, read-only para o operador) vs `PROJECT_PATH` (instância, editável). Scripts do core nunca referenciam paths relativos — apenas variáveis de ambiente. Isso é o que torna o update centralizado possível: o operador só atualiza `HIVE_HOME`, a instância não muda.

**Versionamento:** arquivo `beehive/VERSION` no core com semver. `hive.sh` expõe `hive version`. Instância registra a versão em `config.env` (`HIVE_VERSION`) no momento da instalação — audit trail simples sem overhead.

**Condição:** desacoplamento dos caminhos hardcoded **antes** do `hive-install.sh`. Copilot (CLAUDE-024) identificou corretamente os focos principais. Sem essa etapa o instalador vira um script de cópia sem garantia de portabilidade real.

**Pontos de atenção:**
- `.claude/settings.json` tem permissões hardcoded que precisam ser revisadas para o contexto de instância
- `squad-bridge.sh` e `proxy.sh` são os acoplamentos mais críticos — testar primeiro

**Divergência com outros agentes:** alinhado com Copilot.

---

## 6. 🏆 Consolidação e Veredito

**Data:** 2026-05-27
**Veredito:** ✅ **GO — Aprovado pelo Márcio**

**Sequência obrigatória:**
1. **Fase A — Desacoplamento:** auditar e parametrizar caminhos hardcoded em `.agile-squad/` e `beehive/bin/`
2. **Fase B — Installer:** criar `hive-install.sh` MVP após Fase A validada

---

## 7. 📋 Work Orders

### COPILOT-031-A — Desacoplamento de caminhos hardcoded
**Executar em:** `workspace_hive` = `/home/marcio/job/hive`
**cwd_exec:** `/home/marcio/job/hive`

**Escopo:**
- Auditar: `.agile-squad/proxy.sh`, `.agile-squad/framework/run.sh`, `.agile-squad/framework/squad-bridge.sh`, `beehive/bin/hive-cost.sh`
- Substituir toda referência hardcoded a `beehive/`, `registry/`, `construcao/`, `roles/` por variáveis `HIVE_HOME` / `PROJECT_PATH` / `BEEHIVE_PATH`
- Não alterar scripts que já usam as variáveis corretamente

**Critério de aceite:**
- `grep -rn '"beehive/' .agile-squad/` → zero ocorrências hardcoded
- `npm run squad:inbox` continua funcionando após as mudanças
- Aceite técnico gerado em `beehive/registry/aceites/`

### COPILOT-031-B — hive-install.sh MVP
**Pré-requisito:** COPILOT-031-A aprovado
**Executar em:** `workspace_hive` = `/home/marcio/job/hive`
**cwd_exec:** `/home/marcio/job/hive`

**Escopo:**
- Criar `beehive/bin/hive-install.sh`
- Recebe `TARGET_REPO` como argumento
- Copia estrutura de instância (não o core) para o repo-alvo
- Cria `config.env` com valores padrão a partir de template
- Registra `HIVE_VERSION` no `config.env` da instância

**Critério de aceite:**
- `bash beehive/bin/hive-install.sh /tmp/test-repo` → estrutura criada
- `HIVE_HOME=/home/marcio/job/hive/beehive npm run squad:inbox` funciona no repo-alvo
- Aceite técnico gerado em `beehive/registry/aceites/`
