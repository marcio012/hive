# 📖 Guia do Dono — Hive Framework
**Para:** Márcio | **Leitura:** ~10 minutos | **Última atualização:** 2026-05-26

Este guia explica o framework em linguagem humana.
Você não precisa ler nenhum outro arquivo para entender como a colmeia funciona.

---

## O que é o Hive, em uma frase

O Hive é um **método de trabalho com IAs** que funciona como um mini-escritório:
cada IA tem um papel fixo, uma caixa de entrada e regras claras do que pode e não pode fazer.
Você é o único que aprova o que vai para produção.

---

## Quem faz o quê

| Quem | Papel | Analogia humana | O que faz na prática |
|------|-------|-----------------|----------------------|
| **Você (Márcio)** | Owner / Diretor | O dono do negócio | Define o que será construído. Aprova tudo antes do commit. |
| **Gemini** | Squad Lead | O gerente de projeto | Organiza ideias, facilita debates, faz perguntas estratégicas, coordena os outros agentes |
| **Claude (eu)** | Arquiteto | O tech lead sênior | Revisa decisões técnicas, cria blueprints, detecta riscos antes da implementação |
| **Copilot** | Engenheiro | O dev executor | Escreve o código, segue o contrato definido pelo Claude, não toma decisões de design |

**Regra de ouro:** Copilot só executa o que Claude especificou. Claude só especifica o que você aprovou.

---

## Como uma ideia vira código (o caminho completo)

```
Você tem uma ideia
      ↓
  Conta para o Gemini (brainstorm: ...)
      ↓
  Gemini organiza o que está claro / nebuloso / em tensão
      ↓
  Se for simples → Copilot executa direto
  Se for nova feature → Claude cria a Work Order (especificação)
  Se for decisão grande → Debate formal entre os 3 agentes
      ↓
  Copilot implementa
      ↓
  Você vê o resultado e dá OK  ← THE GATE (o momento mais importante)
      ↓
  Commit no repositório
```

---

## O que é "The Gate" e por que ele existe

The Gate é o momento em que **você** decide se o código entra ou não no projeto.

Nenhuma IA faz commit sozinha. Isso existe porque:
- IAs cometem erros silenciosos — parece certo mas não é
- Código errado em produção custa muito para corrigir
- Você precisa saber o que está no seu sistema

Na prática é simples: o Gemini ou Claude apresenta um resumo do que foi feito, e você responde "OK" ou "não, refaz X".

---

## Os 3 níveis de processo (quando usar cada um)

**Nível 1 — Execução direta** (bugs, ajustes pequenos)
> "Corrige o texto do botão" → Copilot faz → você aprova → commit

**Nível 2 — Feature nova** (novo endpoint, nova tela)
> Você descreve → Claude especifica → Copilot executa → você aprova → commit

**Nível 3 — Decisão grande** (trocar banco, migrar sistema, nova arquitetura)
> Debate entre agentes → veredito → blueprints → execução por partes → você aprova cada parte

**Regra prática:** Se você achar que pode precisar desfazer em menos de 10 minutos, é Nível 1. Se pode quebrar dados ou segurança, é Nível 3.

---

## Como iniciar uma sessão de trabalho

```bash
# Com o Gemini (para planejar / brainstorm):
npm run squad:session:gemini

# Com o Claude (para arquitetura / revisão):
cd beehive && claude   # Claude Code abre aqui

# Com o Copilot (para implementar):
npm run squad:session:copilot
```

Ao abrir o Claude, ele automaticamente verifica se há mensagens pendentes para você no inbox.

---

## Onde ficam as coisas importantes

| O que você quer ver | Onde está |
|---------------------|-----------|
| O que está sendo construído agora | `beehive/construcao/work_orders/` |
| Decisões técnicas tomadas | `beehive/construcao/debates/` |
| Histórico de entregas | `beehive/registry/archive/tasks/` |
| Custo de tokens das sessões | `beehive/registry/telemetria/custos.log` |
| Regras que todos os agentes seguem | `beehive/cognition/diretrizes.md` |
| O que o Gemini está fazendo | `beehive/construcao/inbox-gemini.md` |
| O que o Claude está fazendo | `beehive/construcao/inbox-claude.md` |
| O que o Copilot está fazendo | `beehive/construcao/inbox-copilot.md` |

---

## Os papéis do Gemini (cartuchos)

O Gemini muda de "personalidade" dependendo do que você precisa:

| Papel | Ativar com | Usa para |
|-------|-----------|----------|
| **PO (Guardião do Valor)** | `npm run gemini:po` | Validar se uma ideia gera valor real |
| **Projetista** | `npm run gemini:projetista` | Desenhar fluxos, modelar soluções |
| **Coordenador** | `npm run gemini:coordenador` | Planejar fluxo, destravar e orquestrar handoffs |

Você também pode usar **prefixos no chat** sem trocar de papel:
- `brainstorm: [sua ideia]` → Gemini organiza o pensamento
- `insight: [observação]` → Gemini formata como captura para o buffer
- `debug: [problema]` → Gemini investiga read-only
- `mapeia: [módulo]` → Gemini escaneia o código legado

---

## O que o Hive NÃO faz (limites importantes)

- **Não faz deploy sozinho** — você aprova cada commit
- **Não decide sozinho** — toda decisão estrutural passa por debate com você
- **Não substitui seu julgamento de negócio** — as IAs otimizam o como, você define o o quê
- **Não é infalível** — o sistema tem processos para minimizar erros, não para eliminá-los

---

## O produto: TenantOS

O TenantOS é o primeiro produto sendo construído pelo Hive.
É um sistema ERP/PDV multi-tenant (vários clientes na mesma plataforma).

**Estado atual:**
- Backend antigo (Express) → sendo migrado para NestJS
- Decisão tomada no DEBATE-012: reescrita completa
- Próximo passo: implementar autenticação (CORE-001) — isso desbloqueia tudo

---

## O que mudou nesta versão do framework (2026-05-26)

| O que mudou | Por que mudou |
|-------------|---------------|
| GEMINI.md reduzido de 450 para 80 linhas | Carregava tudo na memória o tempo todo — desperdício de tokens |
| Modos do Gemini em arquivos separados | Cada modo só carrega quando você usa o prefixo correspondente |
| Inbox do Copilot limpo (12 entradas arquivadas) | Arquivo crescia sem fim, poluía o contexto de sessão |
| Referência a arquivo morto removida do Copilot | O arquivo `CHECKPOINT_RETOMADA.md` não existe há meses |
| Processo simplificado em 3 níveis | O fluxo de 7 etapas era overhead excessivo para operação solo |
| Claude verifica inbox automaticamente | Antes dependia de você lembrar de ler manualmente |

---
*Este guia é atualizado a cada mudança significativa no framework.*
*Dúvidas ou ajustes: abra um debate ou fale diretamente com qualquer agente.*
