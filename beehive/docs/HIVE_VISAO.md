# Hive Framework — Visão do Produto
**Versão:** 1.0 | **Data:** 2026-05-26 | **Autor:** Squad Hive

---

## O que é o Hive Framework?

O Hive é um **sistema operacional para desenvolvimento de software com IA**.

Não é uma biblioteca. Não é um template. É uma metodologia operacional que organiza como um desenvolvedor sênior trabalha com múltiplas IAs ao mesmo tempo — sem perder controle, sem criar caos, sem depender de uma única ferramenta.

A metáfora é a colmeia: cada abelha (agente de IA) tem um papel fixo, opera dentro de regras definidas, e o resultado coletivo é muito maior do que qualquer uma conseguiria sozinha. O desenvolvedor (Márcio, ou quem opera o framework) é o apicultor — ele define a direção, aprova o resultado, e nenhuma abelha commita código sem sua ordem.

---

## O problema que resolve

Um desenvolvedor sênior solo hoje enfrenta um paradoxo:

- As IAs são poderosas, mas sem estrutura viram ruído
- Usar Gemini, Claude e Copilot ao mesmo tempo sem um protocolo = 3 opiniões conflitantes, contexto duplicado, retrabalho
- Projetos complexos exigem papéis diferentes: alguém que pensa no negócio, alguém que projeta, alguém que revisa, alguém que executa
- Um humano não consegue fazer todos esses papéis com a mesma qualidade ao mesmo tempo

**O Hive resolve isso atribuindo papéis fixos às IAs — e mantendo o humano como único ponto de decisão e aprovação.**

---

## Os 4 atores

```
┌─────────────────────────────────────────────────────────┐
│                        MÁRCIO                           │
│              Owner · The Gate · Decisão Final           │
│         (único com autoridade de commit)                │
└────────────┬────────────┬──────────────────────────────┘
             │            │
    ┌─────────▼──┐   ┌────▼──────────────────────────┐
    │   GEMINI   │   │          CLAUDE                │
    │ Facilitador│   │   Arquiteto + Auditor Técnico  │
    │ Estratégico│   │                                │
    │            │   │  Especifica → Copilot executa  │
    │ PO         │   │  Copilot entrega → Claude audita│
    │ Projetista │   └────────────┬───────────────────┘
    │ Coordenador│                │
    └────────────┘   ┌────────────▼──────────────────┐
                     │          COPILOT               │
                     │    Engenheiro / Executor       │
                     │    Opera via CLI no terminal   │
                     └───────────────────────────────┘
```

| Ator | Papel | Quando entra |
|---|---|---|
| **Márcio** | Owner. Decide tudo. Único que commita. | Início e fim de cada ciclo |
| **Gemini** | Facilita o pensamento estratégico. 3 modos: negócio, design, coordenação. | Quando precisa clareza de visão ou direção |
| **Claude** | Transforma intenção em spec técnica. Depois audita o que foi feito. | Sempre que há decisão de design ou entrega para revisar |
| **Copilot** | Recebe contrato fechado, implementa via CLI, entrega evidência. | Quando a spec está 100% definida |

**Regra de ouro:** Nenhum agente revisa o próprio trabalho. Gemini não audita o que projetou. Claude audita o que Copilot escreveu.

---

## Como funciona na prática

O Hive tem **3 níveis de operação**, escolhidos pela complexidade da tarefa:

### Nível 1 — Execução direta
> Para ajustes simples, sem decisão de design.

```
Márcio identifica o que fazer
      ↓
Copilot executa via CLI
      ↓
Márcio revisa e commita
```
*Exemplo: corrigir um bug trivial, ajustar um texto, renomear uma variável.*

---

### Nível 2 — Work Order
> Para features com contrato definido, mas sem debate arquitetural.

```
Márcio descreve a necessidade
      ↓
Claude escreve a spec técnica (Work Order)
      ↓
Copilot implementa via CLI
      ↓
Claude audita a entrega
      ↓
Márcio aprova → commit
```
*Exemplo: novo endpoint, nova migration, novo componente de UI.*

---

### Nível 3 — Debate completo
> Para decisões com impacto arquitetural, risco alto ou escopo nebuloso.

```
Márcio traz a ideia ou o problema
      ↓
Gemini facilita: clarifica o valor, desenha a solução
      ↓
Claude debate: especifica tecnicamente, identifica riscos
      ↓
Márcio aprova a direção
      ↓
Claude escreve Blueprint + Work Order
      ↓
Copilot implementa
      ↓
Claude audita
      ↓
Márcio → The Gate → commit
```
*Exemplo: novo módulo, mudança de arquitetura, integração com serviço externo.*

---

## O que está no repositório

```
hive/
├── beehive/              ← o sistema operacional
│   ├── dna/              ← manifesto, princípios, topologia de processos
│   ├── roles/            ← papel de cada ator documentado
│   ├── docs/             ← guias de operação e protocolos
│   ├── construcao/       ← inboxes dos agentes (canal de comunicação)
│   ├── registry/         ← telemetria, logs, arquivos históricos
│   ├── .claude/          ← configuração operacional do Claude
│   ├── .gemini/          ← configuração operacional do Gemini
│   └── .copilot/         ← configuração operacional do Copilot
└── [produto]/            ← o produto que está sendo construído (ex: tenantOS)
```

O framework é **separado do produto**. Você pode usar o Hive para construir qualquer produto — ele não tem dependência de stack.

---

## O que torna o Hive diferente

| Sem Hive | Com Hive |
|---|---|
| 3 IAs, 3 opiniões, você no meio tentando decidir | Cada IA tem papel fixo — você decide uma vez |
| Contexto se perde entre sessões | Inboxes persistem o contexto entre agentes |
| Não sabe quanto custou a rodada | Telemetria registra custo por agente e por sessão |
| Qualquer IA pode "sugerir" um commit | Só Márcio commita — The Gate Protocol |
| IAs revisam o próprio trabalho | Anti-conflito de interesse codificado nos papéis |
| Processo vira overhead para projeto solo | 3 níveis — usa só o que a complexidade exige |

---

## Para quem é

**Perfil primário:** Desenvolvedor sênior solo (ou liderando uma equipe pequena) que:
- Usa múltiplas IAs e sente que gasta mais tempo gerenciando elas do que entregando
- Tem projetos complexos que exigem design, execução e revisão — papéis que não cabe a uma única IA
- Precisa de rastreabilidade: saber o que foi decidido, por quem, e quanto custou
- Quer escalar sem contratar — usar IA como time, não como ferramenta

**Perfil secundário:** Agências e consultorias que entregam software customizado para múltiplos clientes e precisam de um processo repetível e auditável.

---

## Valor de negócio

Para o operador do framework:
- **Velocidade:** Ciclos de entrega mais rápidos com menos retrabalho
- **Controle:** Nenhuma decisão de design passa despercebida
- **Rastreabilidade:** Todo debate, blueprint e work order documentado
- **Custo visível:** Telemetria por agente permite entender e otimizar o gasto com IA

Para clientes do operador:
- Entregas com spec documentada — não "o que a IA achou melhor"
- Auditable: cada feature tem debate, blueprint, evidência de teste
- Escalável: o mesmo processo funciona para projetos pequenos e grandes

---

## Status atual

| Componente | Status |
|---|---|
| Framework core (roles, inboxes, hooks) | ✅ Operacional |
| Gemini — cartuchos PO, Projetista, Coordenador | ✅ Operacional |
| Claude — Arquiteto + Auditor Técnico | ✅ Operacional |
| Copilot — Executor via CLI | ✅ Operacional |
| Telemetria de custo | ⚠️ Parcial (Gemini registra, Claude e Copilot pendente) |
| Produto de referência (TenantOS) | 🔄 Em construção — migração Express→NestJS em andamento |

---

## Próximos passos para comercialização

1. **Completar telemetria** — custo visível para todos os agentes
2. **Estabilizar o produto de referência** — TenantOS como caso de uso concreto
3. **Empacotar o framework** — tornar portável para outros repositórios com um comando
4. **Documentação de onboarding** — guia de instalação para um novo operador
5. **Precificação** — baseada nos dados reais de custo por sessão coletados
