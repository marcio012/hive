# DEBATE-004 — Visão de Produto, Portabilidade do Squad e Evolução do Gemini

**Status:** ✅ encerrado — decisões registradas em 2026-05-24
**Aberto em:** 2026-05-23
**Owner:** Claude (design) + Márcio (decisão final) + Copilot (parecer)

## Origem

Sessão de 2026-05-23. O Márcio trouxe a descoberta do **Google Antigravity 2.0** (plataforma agent-first lançada no Google I/O 2026, disponível na assinatura Google AI Pro já paga) e a partir disso a conversa revelou uma visão mais ampla de produto que estava implícita no projeto.

## Visão de produto revelada

O Márcio não está construindo apenas o White Label MVP. Está construindo **três camadas interdependentes**:

| Camada | O que é | Status |
|---|---|---|
| **Layer 1 — Squad** | Framework de orquestração de IAs para construir produtos | ✅ Operando |
| **Layer 2 — Agentes do White Label** | IAs que servem ao negócio do Márcio (agente de vendas, funil, dossier) | 🔨 Em construção (DEBATE-003) |
| **Layer 3 — Agentes dos tenants** | IAs que servirão aos negócios dos clientes do White Label | 🌱 Visão — não implementar ainda |

**A meta-visão:** o squad em si é um produto portável. O framework de orquestração (lock, handoff, sessão, debate, buffer) pode ser aplicado a outros projetos e produtos futuros.

## Análise de portabilidade do squad (estado atual)

**O que já é portável:**
- `scripts/local/` — scripts de squad são 100% genéricos
- `docs/planning/KIT_PORTABILIDADE_SQUAD.md` — roteiro de portabilidade já existe
- `docs/planning/ESTRATEGIA_EVOLUCAO_SQUAD_AGENTES.md` — já menciona "Agentes de Nicho" (semente da Layer 3)
- `ai/produto/blueprints/` — blueprints por nicho prontos para agentes dos tenants

**Bloqueios para portabilidade total:**
- `.claude/`, `.copilot/`, `.gemini/` misturam instruções de framework com contexto do White Label — para portar, precisam ser separadas
- `ai/construcao/` tem arquivos ephemeral soltos no mesmo nível do framework permanente

**Portabilidade atual:** framework ~70%, Layer 3 ~10%.

**O que não muda agora:** nenhuma reestruturação antes de validar o White Label. Manter separação limpa enquanto constrói.

## Google Antigravity 2.0 — posição no squad

**O que é:** plataforma agent-first do Google (desktop app, CLI, SDK, Managed Agents API, Enterprise). Disponível via Google AI Pro (1.000 créditos/mês — já pago pelo Márcio).

**Onde encaixa:**
- **DEBATE-003:** Managed Agents API como alternativa ao Claude API para o IA Marketing Agent — custo marginal zero (já pago)
- **Futuro — empacotar o squad:** o Antigravity SDK é candidato natural para transformar o framework de shell scripts em produto instalável por outros projetos

**O que não faz sentido:** substituir o squad atual pelo Antigravity agora — o squad funciona e é o diferencial. Antigravity é ferramenta, não estratégia.

## Proposta: Modo Brainstorm no Gemini

**Contexto:** o Márcio perde o fio das ideias pelo volume de informação e múltiplas frentes simultâneas. O buffer de insights resolve captura. Mas falta uma camada que ajude a **organizar a visão antes de chegar ao Claude**.

**Proposta do Claude:**
Adicionar um **Modo Brainstorm** ao Gemini CLI:
- Gemini lê: `session-state` + handoff + `insights-buffer.md`
- Usuário joga pensamentos soltos
- Gemini devolve digest estruturado: o que está claro / o que está nebuloso / o que está em tensão
- Output sempre termina com: **"o que vai para o Claude"** — guarda que impede o Gemini de virar pseudo-decisão
- Claude qualifica o digest e abre debate formal quando necessário

```
Márcio (visão solta, múltiplas frentes)
        ↓
   Gemini lê contexto do projeto
        ↓  organiza — não decide
   Digest: claro / nebuloso / em tensão / vai pro Claude
        ↓
   Claude qualifica e debate
```

**Guarda essencial:** Gemini nunca responde "qual é a arquitetura certa" — responde "aqui está o que você parece estar pensando, organizado".

## Parecer do Copilot — ✅ aprovado com guarda forte

O Modo Brainstorm faz sentido porque resolve um problema real do fluxo: excesso de contexto disperso antes do debate. Como camada intermediária entre captura e arquitetura, ele ajuda o Márcio a chegar no Claude com material mais legível sem transformar o Gemini em decisor.

**Guardrails obrigatórios:**
1. Leitura obrigatória de `session-state`, último handoff e `insights-buffer` antes da resposta
2. Saída fixa em `Claro / Nebuloso / Em tensão / Escalar pro Claude`
3. Proibido decidir prioridade, arquitetura, escopo final ou promoção operacional
4. Se o usuário pedir "qual o melhor caminho", o Gemini não responde como árbitro — organiza a tensão e escala para o Claude

**Leitura adicional do Copilot:**
- Antigravity: promissor como ferramenta, mas não deve puxar reestruturação agora; primeiro validar a camada 2
- Portabilidade do squad: ~70%, tema de timing, não de execução imediata
- Layer 3: manter como visão; trazer para implementação agora misturaria produto validado com hipótese futura

## Decisão final — 2026-05-24

| Variável | Decisão |
|---|---|
| Modo Brainstorm Gemini | ✅ implementado em `.gemini/GEMINI.md` |
| Antigravity | ⏸ deferido — avaliar após White Label validar receita |
| Portabilidade | ⏸ deferido — framework ~70% portável, não reestruturar agora |
| Layer 3 | ⏸ deferido — manter como visão, não implementar antes do White Label |

**Encerrado por:** Márcio
**Motivo:** variáveis deferidas não bloqueiam o MVP. Antigravity e Layer 3 entram no roadmap após validação de receita.
