---
titulo: Roteiro de Teste de Amnésia — Copilot
tipo: checklist
status: ativo
ultima_revisao: 2026-05-22
responsavel: Claude - Arquiteto
destino: Copilot - Dev
---

# Roteiro de Teste de Amnésia — Copilot

Execute este roteiro no início de qualquer sessão nova ou após uma pausa longa.
Se algum item falhar, o contexto está incompleto — não comece trabalho de código.

---

## Passo 1 — Estado da sessão

```bash
npm run squad:inbox
```

**O que validar:**
- [ ] `Issue ativa` está preenchida e faz sentido
- [ ] `Ultima acao` descreve algo reconhecível
- [ ] `Proximo passo` aponta para um arquivo ou ação clara
- [ ] Se `NEXT_STEP` referenciar um arquivo → ler o arquivo antes de continuar

---

## Passo 2 — Fluxo do squad (DIR-040)

Leia a seção `## Roteamento de execucao por agente` em:
```
ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md
```

**O que validar:**
- [ ] Entendo que debate e refinamento de escopo sempre começam com o Claude
- [ ] Sei o que vai para mim (contrato fechado, boilerplate, execução pura)
- [ ] Sei o que vai para o Claude (contexto acumulado, conceito + código, doc estratégica)
- [ ] Sei que o Gemini é auxiliar opcional, não um passo fixo

---

## Passo 3 — Diretrizes ativas

Leia as últimas entradas em:
```
ai/construcao/DIRETRIZES_ATIVAS.md
```

**O que validar:**
- [ ] DIR-038: só movo card até `In Progress` — a partir daí é o Márcio
- [ ] DIR-039: ao entregar uma issue, posto o template fixo de entrega como comentário
- [ ] DIR-040: roteamento por natureza da task, não por papel fixo
- [ ] DIR-041: ideias durante execução viram issue com label `idea:inside` + link da originadora

---

## Passo 4 — Separação de documentos

**O que validar respondendo estas perguntas:**

- [ ] Se quero registrar estado operacional (issue ativa, próximo passo) → uso `session-state` via `npm run squad:session:update`
- [ ] Se quero registrar contexto do produto Agente de Vendas → uso `handoff-agente-vendas-contexto-copilot.md`
- [ ] Se quero registrar debate entre agentes → uso `debates-abertos.md`
- [ ] Se quero registrar uma regra nova do squad → uso `OPERACAO_COMPARTILHADA_SQUAD.md` + `DIRETRIZES_ATIVAS.md`
- [ ] Nunca misturar conteúdo operacional dentro de documento de produto

---

## Passo 5 — Debates abertos

```
ai/construcao/debates-abertos.md
```

**O que validar:**
- [ ] Há debates pendentes de resposta minha?
- [ ] Se sim → responder antes de executar qualquer issue

---

## Passo 6 — Verificação rápida do board

```bash
gh issue list --state open --assignee @me --json number,title,labels \
  | jq -r '.[] | "#\(.number) \(.title) [\(.labels | map(.name) | join(", "))]"'
```

**O que validar:**
- [ ] Sei quais issues estão atribuídas a mim
- [ ] Nenhuma está `in-progress` sem eu saber o motivo
- [ ] A issue que vou trabalhar tem escopo 100% fechado — se não tiver, sinalizo ao Claude antes

---

## Passo 7 — Confirmação final

Responda mentalmente antes de começar:

1. Qual é a issue que vou trabalhar agora?
2. O contrato (escopo + critério de aceite) está 100% fechado?
3. Sei onde vai o resultado (arquivo, endpoint, commit)?
4. Sei qual template de entrega vou postar ao concluir?

Se respondeu tudo → pode começar.
Se travou em alguma → resolve antes de escrever código.
