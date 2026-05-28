---
titulo: DEBATE-022 — Clientes Demo para Apresentação do TenantOS
id: DEBATE-022
tipo: produto / estratégico
status: aberto
data: 2026-05-28
responsavel: Claude
participantes:
  - Márcio (Owner / The Gate)
  - Claude (Arquiteto)
  - Gemini (PO)
  - Copilot (Engenheiro)
backlog_ref: TOS-019
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target: tenantOS
cwd_exec: /home/marcio/job/tenantOS
---

# 🗣️ DEBATE-022: Clientes Demo para Apresentação do TenantOS

## 📊 Status

| Participante | Parecer |
|---|---|
| Claude | [x] |
| Gemini (PO) | [ ] |
| Copilot | [x] |
| Márcio | [ ] |

**Fases:**
- [x] Abertura
- [ ] Parecer Gemini (PO)
- [x] Parecer Claude
- [x] Parecer Copilot
- [ ] Consolidação / Veredito
- [ ] Aprovação Márcio
- [ ] Work Orders despachadas
- [ ] Execução concluída

---

## 1. 🎯 Contexto e Motivação

Márcio quer ter 4 clientes demo/mockados no TenantOS para uso em apresentações comerciais. O objetivo é demonstrar o produto com dados reais de narrativa por nicho — não telas vazias ou mocks visuais soltos.

---

## 2. 🔎 Diagnóstico Inicial (Copilot)

A abordagem de mock visual no frontend foi descartada como inferior. A proposta é ter **4 tenants demo seedados** com:
- slug próprio
- branding configurado
- usuário admin
- dados mínimos de narrativa por nicho
- mecanismo de reset antes da apresentação

**Questões abertas:**
1. Seed persistente em HML ou carga resetável?
2. Quais 4 nichos?
3. Volume mínimo de dados por tenant
4. Como isolar de dados reais/operacionais
5. Entra como item de backlog próprio?

---

## 3. 💡 Opções em Análise

### Opção A — Seeds fixos em HML (estado persistente)
4 tenants criados via seed script, mantidos em HML. Reset manual antes de cada apresentação.

**Prós:** dados ricos, narrativa consistente, sem rebuild.
**Contras:** pode ser contaminado por testes operacionais; precisa de disciplina de reset.

### Opção B — Script de carga resetável
Script `npm run demo:seed` que apaga tenants demo e recria do zero. Idempotente.

**Prós:** apresentação sempre começa limpa; isolamento garantido.
**Contras:** demora alguns segundos antes da apresentação; exige rodar o script.

### Opção C — Ambiente demo separado
Container ou branch própria para demo, isolada do HML operacional.

**Prós:** zero risco de contaminação.
**Contras:** overhead de manutenção de segundo ambiente; fora do escopo do MVP.

---

## 4. ❓ Questões para o Squad

### Para o Gemini (PO):
1. Quais 4 nichos geram mais impacto em apresentação? (Restaurante, Barbearia, Clínica, Academia?)
2. Qual a narrativa mínima que cada nicho precisa contar para convencer?
3. Opção A ou B — qual protege melhor a experiência do Márcio numa apresentação real?

### Para o Claude (Arquiteto):
1. Como isolar seeds demo de dados operacionais sem criar segundo ambiente?
2. O mecanismo de reset deve ser uma migration reversa, truncate ou recriação dos tenants?
3. Risco de conflito com slugs existentes no HML?

---

## 5. 💰 Análise Financeira

| Dimensão | Valor |
|---|---|
| Custo de abertura | R$ 0,20 estimado |
| Custo estimado de implementação | R$ 0,80–1,20 (seed script + dados) |
| Confiança | Alta |
| Valor gerado | Demo profissional sem tela vazia em apresentação comercial |
| Payback | Imediato — primeira apresentação |
| Custo de não fazer | Apresentação com dados vazios ou improviso |

---

## 6. ✅ Resultado Esperado

1. Decisão entre Opção A, B ou híbrido
2. Lista dos 4 nichos aprovada pelo Márcio/Gemini
3. Spec mínima de dados por tenant
4. TOS-019 aberto no backlog com work order para Copilot

---

## 3.1 Parecer do Copilot (Engenheiro) — 2026-05-28

**Posição:** ✅ Opção B — script resetável

Seed persistente cria dependência de disciplina operacional que eventualmente falha. Um `npm run demo:reset` idempotente é mais confiável antes de apresentação: apaga os 4 tenants demo por slug e recria do zero.

**Spec técnica mínima:**
- Identificar tenants demo por slug prefixado: `demo-*` (ex: `demo-restaurante`, `demo-barbearia`)
- Script de seed: cria tenant + branding + 1 usuário admin + dados mínimos por nicho
- Script de reset: `DELETE WHERE slug LIKE 'demo-%'` + re-seed

**Risco principal:** se o slug `demo-*` colidir com tenant real, o reset apaga dado real. Mitigação: validar no script que só apaga slugs que existem no seed fixture.

### Análise Financeira (DIR-080)

| Dimensão | Valor |
|---|---|
| Custo deste parecer | R$ 0,30 estimado |
| Custo da implementação | R$ 0,80 (seed script + fixtures + package.json) |
| Confiança | Alta |
| Urgência | Alta — impacta apresentações comerciais |

---

## 3.2 Parecer do Claude (Arquiteto) — 2026-05-28

**Posição:** ✅ Opção B com uma salvaguarda

Alinho com o Copilot na Opção B. O script resetável é o único que garante estado limpo garantido. Adiciono uma salvaguarda arquitetural: os tenants demo devem ter um campo `is_demo: Boolean @default(false)` no schema Prisma. Isso permite:

1. Reset por `WHERE is_demo = true` — sem depender de convenção de slug
2. Filtrar tenants demo da listagem operacional sem lógica de string
3. Bloquear operações sensíveis (ex: webhook real) quando `is_demo = true`

**Sobre o schema:** o campo `is_demo` é uma migration simples, não breaking. Valor default `false` garante zero impacto nos tenants existentes.

**Sobre os 4 nichos:** deixo para o Gemini (PO) — é decisão de valor de negócio/narrativa comercial, não arquitetural.

**Risco único relevante:** se o HML for o mesmo ambiente de demo e operacional, um tenant demo com `is_demo = false` acidentalmente pode ser tratado como real. O campo `is_demo` no schema elimina esse risco.

### Análise Financeira (DIR-080)

| Dimensão | Valor |
|---|---|
| Custo deste parecer | R$ 0,25 estimado |
| Custo da migration `is_demo` | R$ 0,10 — campo Boolean simples |
| Valor gerado | Isolamento técnico robusto; sem dependência de convenção de nome |
| Payback | Imediato |
| Custo de não fazer | Reset por slug pode apagar dado real em caso de erro de digitação |
