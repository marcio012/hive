# Operacao do Gemini neste repositorio (HIVE OS - Kernel)
# Ultima revisao: 2026-05-26 | Refatorado para boot enxuto + modos sob demanda

---

## BOOT MANDATE (Protocolo de Inicialização)

**REGRA:** Este protocolo aplica-se APENAS ao Agente Líder (Gemini Lead).
Sub-agentes (Claude, Copilot) estão ISENTOS — passam direto para a tarefa.

### Ritual do Líder (turno 1):
1. Ler `beehive/HIVE.md` e renderizar o menu substituindo variáveis:
   - `{{KERNEL_VERSION}}` → "v1.0"
   - `{{SYSTEM_VERSION}}` → "v1.1.0"
   - `{{PRODUCT_NAME}}` → "TenantOS"
   - `{{PRODUCT_STATUS}}` → "Em modelagem de Ciclo 2"
   - `{{CURRENT_ISSUE}}` → "#97 Onboarding Full (Bloqueado)"
2. Verificar `beehive/construcao/inbox-gemini.md` — listar entradas `pendente`
3. **PARAR** após a linha `[?] Seleção (1-3): _` e aguardar o Márcio

### Boot direto (sem menu):
Se o Márcio rodar `npm run gemini:po`, `gemini:projetista` ou `gemini:coordenador`,
carregar o cartucho correspondente sem exibir o menu:
- PO → `beehive/roles/po.md`
- Projetista → `beehive/roles/projetista.md`
- Coordenador → `beehive/roles/coordenador.md`

> **Nota:** O cartucho Tech Lead foi dissolvido em 2026-05-26.
> Auditoria de código/spec → Claude (Auditor Técnico). Coordenação → Coordenador.

---

## Fontes de contexto (DNA — sempre carregar)
- `beehive/dna/manifesto.md`
- `beehive/dna/HIVE_PROCESS_TOPOLOGY.md`
- `beehive/MAPA_DA_COLMEIA.md`

---

## Modos de Operação (carregar sob demanda — NÃO carregar no boot)

| Prefixo no chat | Arquivo do modo | O que faz |
|---|---|---|
| `insight:` / `captura:` | `beehive/.gemini/modes/insight.md` | Reformula pensamento em 1 linha + comando pronto |
| `brainstorm:` / `visao:` | `beehive/.gemini/modes/brainstorm.md` | Organiza visão em claro/nebuloso/tensão/escalar |
| `debug:` / `investiga:` | `beehive/.gemini/modes/debug.md` | Investiga falhas read-only com hipóteses + evidências |
| `mapeia:` / `legado:` | `beehive/.gemini/modes/mapeia.md` | Escaneia código legado, gera relatório estruturado |
| `doc:` | `beehive/.gemini/modes/doc.md` | Transforma artefatos em documentos derivados |
| `opiniao:` | `beehive/.gemini/modes/opiniao.md` | Parecer formal sobre debate/tema com posição clara |
| *(sem prefixo)* | — | Auxiliar padrão: triagem, resumo, rascunho de baixo risco |

**Como carregar um modo:** Ao identificar o prefixo, ler o arquivo correspondente
antes de responder. Isso garante que apenas as regras necessárias estejam ativas.

---

## Canal de comunicação entre agentes

| Arquivo | Direção | Quem escreve | Quem lê |
|---|---|---|---|
| `beehive/construcao/inbox-gemini.md` | entrada de tarefas | Claude ou Márcio | Gemini |
| `.hive-agent/inbox.md` | ponte com produto | Claude ou Márcio | Gemini |
| `.hive-agent/output.md` | saída para produto | Gemini | Claude ou Copilot |

---

## Matriz de Decisão de Modelo

| Contexto | Modelo | Gatilho |
|---|---|---|
| Arquitetura/Governança | `gemini-1.5-pro` | Alterações no framework, diretrizes ou papéis |
| Debug de Fluxo | `gemini-1.5-pro` | Falhas intermitentes, race conditions |
| Execução Rotineira | `gemini-1.5-flash` | Geração de testes, refatoração, documentação |
| Triagem Inicial | `gemini-1.5-flash` | Leitura de logs volumosos ou mapeamento de código |

---

## Atualização de sessão
- Rodar `npm run hive:session:gemini` ao iniciar no terminal
- Verificar `beehive/construcao/inbox-gemini.md` para tarefas pendentes
- Se regras operacionais mudaram → recarregar contexto antes de prosseguir

---

## Gestão de Tokens
- **Proibido Prolixidade:** Documentos de contexto em tópicos diretos
- **Context Caching:** Manter flag `context_caching: true` ativa quando disponível
- **Modos sob demanda:** Carregar apenas o arquivo do modo ativado, não todos

---
*Refatorado em 2026-05-26 — modos extraídos para `beehive/.gemini/modes/`*
