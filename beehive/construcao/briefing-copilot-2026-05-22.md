---
titulo: Briefing Copilot — Sessão 2026-05-22
tipo: briefing
status: ativo
ultima_revisao: 2026-05-22
responsavel: Claude - Arquiteto
destino: Copilot - Dev
---

# Briefing Copilot — o que mudou nesta sessão e o que você precisa fazer

> Leia este arquivo do início ao fim antes de qualquer ação.
> Ele substitui qualquer inferência que você faria lendo apenas o handoff ou o histórico de commits.

---

## 1. O que aconteceu nesta sessão (resumo)

Claude executou as issues #52 (landing page) e #54 (script de qualificação).
Você executou a #47 (onboarding de tenant). Ambas entregues e registradas.

Além das entregas, três decisões de governança foram aprovadas pelo Márcio
e estão agora em vigor para os dois agentes:

| Decisão | Diretriz | Onde está documentada |
|---|---|---|
| Roteamento Claude vs Copilot calibrado | DIR-040 | `DIRETRIZES_ATIVAS.md` + `OPERACAO_COMPARTILHADA_SQUAD.md` |
| label `idea:inside` para ideias durante execução | DIR-041 | `DIRETRIZES_ATIVAS.md` + `OPERACAO_COMPARTILHADA_SQUAD.md` |
| Template fixo de entrega de issue | DIR-039 | `DIRETRIZES_ATIVAS.md` + `OPERACAO_COMPARTILHADA_SQUAD.md` |

---

## 2. Separação de documentos — regra nova (importante)

Esta é a mudança que você não aplicou corretamente ao atualizar o handoff.

| Documento | O que vai aqui | O que NÃO vai aqui |
|---|---|---|
| `handoff-agente-vendas-contexto-copilot.md` | Contexto do produto Agente de Vendas: o que é, fluxo, decisões, artefatos | Status de issues, regras de board, debates, próximos passos operacionais |
| `ai/construcao/debates-abertos.md` | Debates entre agentes com posição do Claude e parecer do Copilot | Contexto de produto, artefatos, issues |
| `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md` | Regras comuns do squad, fluxo oficial, roteamento | Contexto de produto, status de issues |
| `session-state.env` (via `squad:inbox`) | Estado operacional: issue ativa, última ação, próximo passo | Qualquer coisa que não seja estado efêmero da sessão |

**Erro que você cometeu:** ao receber o handoff, você reinjetou conteúdo de governança
(debates, próxima ação operacional) de volta no arquivo de produto que o Claude
havia separado especificamente para manter limpo.

Regra simples: **se não é sobre o produto Agente de Vendas em si, não entra no handoff de produto.**

---

## 3. Novo fluxo do squad (DIR-040) — seu papel mudou

O modelo antigo definia você como executor técnico principal de tudo.
Isso mudou. O critério agora é a **natureza da task**, não o papel fixo.

```
Márcio traz a ideia ou issue
        ↓
   Gemini (opcional) — triagem de contexto volumoso
        ↓
   Claude — debate, afina escopo e riscos  ← sempre começa aqui
        ↓
   Roteamento por natureza da task
        ↙                    ↘
  Claude executa         Você executa
  (contexto acumulado,   (contrato 100% fechado,
  conceito + código,      endpoint, migration,
  doc estratégica)        boilerplate puro)
        ↘                    ↙
     Revisão cruzada Claude ↔ Copilot
                ↓
         OK final do Márcio
```

**O que vai para você:**
- Endpoints e migrations com contrato 100% definido
- Boilerplate e ajustes técnicos pontuais
- Execução pura sem decisão de design

**O que vai para o Claude:**
- Qualquer implementação que dependa de contexto acumulado entre sessões
- Features que misturam conceito e código
- Documentação estratégica e scripts
- Qualquer task onde a ideia ainda está se formando

**Implicação prática:** se uma task chegar até você sem escopo 100% fechado,
não assuma — sinalize ao Claude ou ao Márcio antes de implementar.

---

## 4. DIR-041 — label `idea:inside`

Quando uma ideia surgir durante a execução de uma issue:
1. Abrir nova issue com a label `idea:inside`
2. No corpo da issue, incluir link para a issue originadora
3. Não criar coluna nova no board — a ideia fica no backlog normal
4. Em momentos de planejamento, o Márcio decide se promove para `feat:`/`chore:` ou descarta

---

## 5. DIR-039 — template fixo de entrega

Ao concluir qualquer issue, postar este comentário na própria issue antes de pedir o OK do Márcio:

```
## Entrega — #NNN

**O que foi feito:** <resumo objetivo>

**Como validar:**
- <passo 1>
- <passo 2>

**Evidência:** <build/typecheck/smoke/screenshot>

**Débito técnico:** <item rastreável ou "nenhum">
```

---

## 6. Sua única ação imediata

**Criar a label `idea:inside` no GitHub.**

```bash
gh label create "idea:inside" --description "Ideia surgida durante execução de uma issue — revisar no planejamento" --color "#E4E669"
```

Depois de criar, postar confirmação na issue #54 (que originou o debate).

Nenhuma outra ação no código ou documentação até o Márcio definir a próxima prioridade.

---

## 7. O que NÃO fazer

- Não atualizar o handoff de produto com estado operacional
- Não começar nenhuma issue de código sem o Márcio definir prioridade
- Não mover cards no board além de `In Progress` (DIR-038)
- Não reescrever arquivos de governança que o Claude já consolidou
