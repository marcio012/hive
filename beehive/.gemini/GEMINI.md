# Operacao do Gemini neste repositorio (HIVE OS - Kernel)
# Ultima revisao: 2026-05-28 | Simplificado

---

## PROTOCOLO DE INICIALIZAÇÃO

### Fluxo de Boot:
1. Verificar `beehive/construcao/inbox-gemini.md` — listar entradas `pendente`.
2. Carregar o cartucho correspondente à tarefa:
   - PO → `beehive/roles/po.md`
   - Projetista → `beehive/roles/projetista.md`
   - Coordenador → `beehive/roles/coordenador.md`

**Boundary de sessão:**
- **1 sessão Gemini = 1 cartucho**.
- Para trocar de cartucho ou modo, encerrar a sessão atual e iniciar o novo cartucho.

---

## Fontes de contexto (DNA — sempre carregar)
- `beehive/dna/manifesto.md`
- `beehive/dna/HIVE_PROCESS_TOPOLOGY.md`
- `beehive/MAPA_DA_COLMEIA.md`
- `beehive/cognition/diretrizes.md`

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
- Rodar `npm run squad:session:gemini` ao iniciar no terminal
- Se a sessão usar cartucho específico, iniciar direto com `gemini:po`, `gemini:projetista` ou `gemini:coordenador`
- Antes de mudar de cartucho/modo: fechar a CLI atual + `npm run squad:session:end:gemini`
- Verificar `beehive/construcao/inbox-gemini.md` para tarefas pendentes
- Se regras operacionais mudaram → recarregar contexto antes de prosseguir
- Em roteamentos multi-repo, sempre informar `workspace_hive`, `workspace_target`, `repo_target` e `cwd_exec`

---

## Padrão de Saída Operacional (DIR-085)

Toda interação operacional deve encerrar com:

```
Estado atual:    [o que foi concluido / o que esta em aberto]
Proximo passo:   [o que vem agora]
Acao esperada:   [o que o Marcio deve fazer]
```

Aplica-se a: boot/menu, plano de voo, encerramento de cartucho, checkpoint, pedido de aprovacao.
Nao aplica-se a: perguntas informativas, confirmacoes curtas, analises conceituais.
Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`

---

## Gestão de Tokens e Higiene (DIR-071)

- **Proibido Prolixidade:** Documentos de contexto em tópicos diretos.
- **Context Packs:** Diferenciar Core Pack (leitura obrigatória) de Task Pack (leitura sob demanda).
- **Higiene Header:** Todo artefato de controle deve conter `thread`, `source_of_truth` e `supersedes`.
- **Handoffs:** Usar blocos `[LER AGORA]`, `[NÃO LER]` e `[FONTE OFICIAL]`.
- **Flush:** Realizar limpeza de contexto ao trocar de fase.

### Registro de custo por interação (obrigatório)

Após **cada resposta**, o Gemini deve registrar os tokens usados chamando:

```bash
bash beehive/bin/hive-telemetry.sh "Gemini [MODO]" "[MODELO]" [TOKENS_IN] [TOKENS_OUT] [CUSTO_BRL]
```

**Onde:**
- `[MODO]` = cartucho ativo: `PO`, `Projetista` ou `Coordenador`
- `[MODELO]` = modelo usado nessa resposta (ex: `gemini-1.5-pro`)
- `[TOKENS_IN]` = tokens de entrada da interação (disponível via `/stats` no CLI)
- `[TOKENS_OUT]` = tokens de saída gerados
- `[CUSTO_BRL]` = estimativa em BRL (gemini-1.5-pro: input R$0.0000375/token, output R$0.00015/token)

---
*Refatorado em 2026-05-28 — Remoção de hierarquia Lead*
