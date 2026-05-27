# Handoff Executável — [TEMA]

**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** YYYY-MM-DD
**Thread:** [thread-id]
**Debate/Blueprint de origem:** `beehive/construcao/[arquivo de origem]`
**Status do debate:** Consolidado e aprovado pelo Márcio

---

## Destino Operacional (DIR-082 — obrigatório em handoffs multi-repo)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/[repo-alvo]
repo_target:      [nome-do-repo ou URL]
cwd_exec:         [caminho absoluto onde os comandos devem ser executados]
```

> ⚠️ Handoff sem este bloco está incompleto e não deve ser executado pelo Copilot.

---

## Contexto

[Descrever em 2–4 linhas o que motivou este handoff, qual problema resolve e qual é o contrato fechado.]

---

## Sequência de implementação (obrigatória — nesta ordem)

### Etapa 1 — [Nome da etapa]
- [Ação concreta]
- [Ação concreta]

### Etapa 2 — [Nome da etapa]
- [Ação concreta]

### Etapa N — Validação final
- [Verificação de funcionamento pós-implementação]

---

## Análise Financeira (DIR-080 — obrigatório)

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ X,XX (tokens estimados + horas Copilot) |
| Confiança da estimativa | Alta / Média / Baixa |
| Valor gerado | [métrica concreta e mensurável] |
| Payback | [em N sessões ou semanas] |
| Custo de não fazer | [risco quantificado] |

---

## Condições obrigatórias (C1–CN)

| # | Regra | Verificação |
|---|-------|-------------|
| C1 | [Condição] | [Como verificar] |
| C2 | [Condição] | [Como verificar] |

---

## Restrições

- **NÃO** [o que não deve ser feito]
- Parar e retornar ao Claude se [condição de bloqueio].

### 🔒 Checklist de governança (verificar antes do commit)

Se qualquer arquivo abaixo aparecer no diff deste handoff, **não commitar sem parecer explícito do Claude**:

- [ ] `AGENTS.md` / `GEMINI.md` / `beehive/.gemini/GEMINI.md`
- [ ] `beehive/.claude/CLAUDE.md` / `beehive/.copilot/COPILOT.md`
- [ ] `beehive/cognition/diretrizes.md` / `beehive/cognition/OPERACAO_COMPARTILHADA_HIVE.md`
- [ ] `beehive/roles/*.md`
- [ ] `beehive/bin/*.sh`

Se algum estiver marcado: abrir entrada em `inbox-claude.md` com o diff antes de prosseguir.

---

## Critérios de aceite

- [ ] [Critério verificável e binário — passa/falha]
- [ ] [Critério verificável e binário]

---

## Ponto de parada

Após concluir, retornar ao Claude com:
- [O que deve ser reportado]
- [Resultado esperado de comandos de validação]
- [Qualquer exceção encontrada nas condições C1–CN]
