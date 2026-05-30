# COPILOT_REF — Referências detalhadas do Copilot
# Lido sob demanda — não faz parte do Core Pack
# Core Pack: beehive/.copilot/COPILOT.md

---

## Comandos de Chat

| Comando | O que faz |
|---|---|
| `inbox` | Lê inbox do domínio ativo e alerta debates com parecer pendente |
| `status` | Issue ativa, estado do lock e próximo passo |
| `checkpoint` | Ponto de parada técnico da última tarefa |

---

## Assinaturas de commit válidas (DIR-006)

```
Dev: Copilot - Engenheiro
Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Dev: Gemini Lead / Copilot - Engenheiro
Approved by: Márcio   ← quando houver gate do owner
```

---

## Aceite Técnico (DIR-081)

| Trigger | Tipo | Momento |
|---|---|---|
| Debate fechado com GO | ACEITE-PRE | Antes de iniciar execução |
| Blueprint aprovado | ACEITE-PRE | Antes de iniciar execução |
| Entrega de handoff concluída | ACEITE-ENTREGA | Antes do commit final |
| Bug fix solicitado | ACEITE-CORRECAO | Antes de executar |

**Destino:** `beehive/registry/aceites/ACEITE-YYYY-MM-DD-NNN-[tipo]-[tema].md`
**Template:** `beehive/construcao/templates/ACEITE_TECNICO_TEMPLATE.md`
- ACEITE-PRE deve ser aprovado pelo Márcio antes de iniciar.
- Preencher `Análise Financeira` com dados do parecer do Claude.

---

## Formato de parecer (comando opiniao)

```
## Parecer do Copilot — [DEBATE-NNN ou tema]
**Data:** YYYY-MM-DD
**Posição:** ✅ / ❌ / ⚠️

[justificativa]

**Pontos de atenção:**
- [riscos, ressalvas, impacto no escopo de execução]

**Divergência com outros agentes:** [se houver] | Alinhado [se não houver]
```

Escrever diretamente no arquivo do debate, na seção correspondente.

---

## Arquivos de referência no início da sessão

**Leitura obrigatória (mudam a cada sessão):**
- `inbox-copilot-hive.md` (Hive) **ou** `inbox-copilot-tos.md` (TOS) — ler PRIMEIRO
- `.hive-agent/session-state.env` — estado atual (issue ativa, NEXT_STEP)

**Leitura sob demanda:**
- `AGENTS.md` — estável, não reler a cada sessão
- `COPILOT.md` (raiz) — estável, não reler a cada sessão

**Regra DIR-071:** respeitar blocos `[LER AGORA]` e `[NÃO LER]` dos handoffs.

---

## Anchor Set (obrigatório em todo handoff / Task Pack)

| Arquivo | Por quê é sentinela |
|---|---|
| `beehive/construcao/BACKLOG.md` | Evita implementar item descartado |
| `beehive/construcao/debates-abertos.md` | Evita ignorar debate ativo |
| `beehive/roles/roles.yaml` | Evita roteamento errado |
| `beehive/config.env` | Evita valor hardcoded conflitante |

---

## Protocolo de Telemetria (DIR-071)

Após cada resposta, registrar tokens:

```bash
bash beehive/bin/hive-telemetry.sh "Copilot" "[MODELO]" [TOKENS_IN] [TOKENS_OUT] [CUSTO_BRL]
```

Taxas:
- `gpt-4o`: input R$0.000025/token, output R$0.0001/token
- `gpt-4o-mini`: input R$0.0000015/token, output R$0.000006/token

Log gravado em `beehive/registry/telemetria/custos.log` (gitignored).
