# CLAUDE_REF — Referências detalhadas do Claude
# Lido sob demanda — não faz parte do Core Pack
# Core Pack: beehive/.claude/CLAUDE.md

---

## Template — Análise Financeira (DIR-080)

### Para implementações
```
## Análise Financeira
- Custo estimado: R$ X,XX (tokens + horas Copilot estimadas)
- Confiança: Alta / Média / Baixa
- Valor gerado: [métrica concreta e mensurável]
- Payback: em N sessões/semanas
- Custo de não fazer: [risco quantificado]
```

### Para correções
```
## Análise Financeira
- Custo de corrigir: R$ X,XX estimado
- Custo de não corrigir: N sessões afetadas / R$ Y em retrabalho
- Urgência: Crítico / Alta / Normal
- Previsibilidade: Alta / Média / Baixa — [justificativa 1 linha]
```

Após parecer GO: sinalizar ao Copilot para gerar Aceite Técnico em `beehive/registry/aceites/`.

---

## Fases padrão de Debate (DIR-083)

```
## 📊 Status

**Participantes:**
- Gemini (PO): ✅ / [ ] / [-]
- Claude (Arquiteto): ✅ / [ ] / [-]
- Copilot (Engenheiro): ✅ / [ ] / [-]

**Fases:**
- [x] 1. Abertura
- [ ] 2. Parecer Gemini
- [ ] 3. Parecer Claude
- [ ] 4. Parecer Copilot
- [ ] 5. Consolidação / Veredito
- [ ] 6. Aprovação Márcio
- [ ] 7. Work Orders despachadas
- [ ] 8. Execução concluída
```

Marcadores de fase: `[x]` concluída · `[F]` falhou · `[ ]` pendente · `[-]` não se aplica

---

## Formato de parecer (comando opiniao)

```
## Parecer do Claude — [DEBATE-NNN ou tema]
**Data:** YYYY-MM-DD
**Posição:** ✅ / ❌ / ⚠️

[justificativa]

**Pontos de atenção:**
- [riscos arquiteturais, impacto estrutural]

**Divergência com outros agentes:** [se houver] | Alinhado [se não houver]
```

Escrever diretamente no arquivo do debate, na seção correspondente.

---

## Assinaturas de commit válidas (DIR-006)

```
Dev: Claude - Arquiteto
Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Dev: Gemini Lead / Copilot - Engenheiro
Dev: Márcio - PO
Dev: Márcio - PO (substituindo Claude - Arquiteto)
Dev: Márcio - PO (substituindo Copilot - Engenheiro)
Approved by: Márcio   ← quando houver gate do owner
```

---

## Márcio como Agente Ativo (DIR-092)

```bash
npm run squad:lock:acquire -- marcio "<atividade>"           # sem bloqueio por outros agentes
npm run squad:lock:acquire -- marcio "<atividade>" --force   # quebra lock existente
npm run squad:lock:acquire -- marcio "<atividade>" --delegate <agent>
```

---

## Fluxo recomendado por rodada

1. `npm run squad:session:claude` + colar contexto
2. Definir prioridade da rodada
3. Gemini (opcional) faz triagem se contexto volumoso
4. Claude verifica Guard de Cano (DIR-091)
5. Claude debate, afina escopo e riscos
6. Márcio aprova decisão final
7. Roteamento: Claude (contexto/conceito) ou Copilot (contrato fechado)
8. Revisão cruzada entre agentes
9. OK final do Márcio + SR gerado (DIR-086)
10. `npm run squad:lock:release -- <owner>` + atualizar `session-state.env`
11. **Limpeza (DIR-087):** verificar processos/portas abertas com `lsof -i :<porta>` ou `ss -tlnp`

---

## Política de Context Packs (DIR-071)

- **Core Pack:** `CLAUDE.md`, manifesto, diretrizes — sempre no boot
- **Task Pack:** só arquivos da issue ativa
- **Higiene Header:** artefatos devem incluir `thread`, `source_of_truth`, `supersedes`
- **Handoffs:** respeitar blocos `[LER AGORA]`, `[NÃO LER]`, `[FONTE OFICIAL]`

### Anchor Set (obrigatório em todo Task Pack / handoff)

| Arquivo | Por quê é sentinela |
|---|---|
| `beehive/construcao/BACKLOG.md` | Evita implementar item descartado ou fora de prioridade |
| `beehive/construcao/debates-abertos.md` | Evita decisão que ignore debate ativo |
| `beehive/roles/roles.yaml` | Evita roteamento para agente errado |
| `beehive/config.env` | Evita valor hardcoded que conflite com config vigente |

### Formato de telemetria (log de custo)

```
==================================================
📊 TELEMETRIA DE TOKENS — [AGENTE]
Data/Hora: YYYY-MM-DD HH:mm:ss
Modelo Ativo: [modelo]
--------------------------------------------------
Tokens de Entrada (Prompt): XXX.XXX
Tokens de Saída (Completion): XX.XXX
Custo Estimado da Rodada: R$ X.XXXX BRL
==================================================
```

---

## Referências locais

- `AGENTS.md` — entrada compartilhada do repositório
- `beehive/roles/claude.md` — papel do Claude no squad
- `beehive/cognition/diretrizes.md` — regras globais do framework
- `beehive/dna/HIVE_PROCESS_TOPOLOGY.md` — topologia de processos (DIR-060/070)
- `.claude/CLAUDE_HML.md` — estado do servidor HML (ler antes de qualquer SSH)
- `.claude/CLAUDE_ERP.md`, `.claude/CLAUDE_WhiteLabel.md`
- `docs/planning/GUIA_RETOMADA_ROADMAP_AGIL.md`
- `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
