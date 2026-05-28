---
titulo: DEBATE-018 — Empacotamento do Hive para Outros Repositórios
id: DEBATE-018
tipo: estratégico / arquitetura
status: aberto
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

| Participante | Parecer |
|---|---|
| Claude | ✅ (abertura) |
| Gemini Lead | [ ] |
| Copilot | [ ] |
| Márcio | [ ] |

**Fases:**
- [x] Abertura
- [ ] Parecer Gemini
- [ ] Parecer Claude
- [ ] Parecer Copilot
- [ ] Consolidação / Veredito
- [ ] Aprovação Márcio
- [ ] Work Orders despachadas
- [ ] Execução concluída

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
