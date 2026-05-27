---
id: DIR-071
titulo: Higiene de Contexto v2 (Higiene por Protocolo)
tipo: governanca / eficiencia
status: ativo
data: 2026-05-27
responsavel: Gemini Lead
---

# 🧼 DIR-071: Higiene de Contexto v2

## 1. 🎯 Objetivo
Transitar da "Brevidade por Intenção" (onde o agente decide o que ler) para a **"Higiene por Protocolo"** (onde a estrutura do repositório dita o limite do contexto). O foco é reduzir a "amnésia de contexto" e o custo financeiro de sessões longas.

## 2. 📦 Context Packs (Contenção Rígida)
O contexto injetado ou lido deve ser classificado em três camadas de isolamento:

| Pack | Descrição | Arquivos Típicos | Leitura |
|---|---|---|---|
| **Core Pack** | O DNA inegociável da Colmeia. | `manifesto.md`, `diretrizes.md`, `HIVE.md`, `MAPA_DA_COLMEIA.md` | **Sempre** (Boot) |
| **Task Pack** | O escopo específico da tarefa atual. | Blueprints, Contratos, Issues, Inboxes ativos, Código-alvo. | **Sob Demanda** |
| **Raw Pack** | Dados volumosos, logs e legado. | `node_modules`, `.git`, Logs de build, Código legado não mapeado. | **Proibido** (exceto `debug:`) |

## 3. 🔖 Metadados Obrigatórios (Higiene Header)
Todo artefato de controle (Inboxes, Debates, Blueprints) DEVE conter no YAML frontal ou no topo do arquivo:

```markdown
thread: <id-da-discussao>
source_of_truth: <caminho-da-fonte-oficial>
supersedes: <id-ou-caminho-do-artefato-anterior>
```

- **thread:** Identificador único para rastreabilidade cross-agent.
- **source_of_truth:** Define qual arquivo deve ser lido se houver conflito.
- **supersedes:** Garante que o agente saiba que o arquivo anterior é obsoleto, transformando o descarte em um **grafo navegável**.

## 4. 🚿 Protocolo de Flush (Limpeza de Fase)
Ao encerrar uma fase (ex: de Research para Strategy), o agente deve realizar um **Context Flush**:
1. Consolidar as descobertas na `source_of_truth`.
2. Mover rascunhos e inboxes consumidos para `beehive/registry/archive/`.
3. Notificar o usuário: *"Fase [X] encerrada. Contexto limpo. Iniciando Fase [Y] com Task Pack enxuto."*

## 5. 📨 Handoffs de Contenção
Instruções entre agentes no inbox devem obrigatoriamente usar o bloco de contenção:

```markdown
### [ID-TASK] Título
**[LER AGORA]:** <arquivo1>, <arquivo2>
**[NÃO LER]:** <arquivo_legado_ruidoso>
**[FONTE OFICIAL]:** <contrato_ou_blueprint>
```

## 6. 🚫 Regra de Ouro da Higiene
**"O excesso de contexto é ruído."**
Se um agente identificar que está carregando >30k tokens de arquivos que não foram citados na última interação, ele deve sugerir um `hive:flush` imediatamente.

---
*Assinado: Hive OS Kernel / Gemini Lead*
