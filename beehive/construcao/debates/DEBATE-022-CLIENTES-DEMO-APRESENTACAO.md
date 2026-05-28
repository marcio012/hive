---
titulo: DEBATE-022 — Clientes Demo para Apresentação do TenantOS
id: DEBATE-022
tipo: produto / estratégico
status: aprovado — work order despachada 2026-05-28
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
| Claude | ✅ |
| Gemini (PO) | ✅ |
| Copilot | ✅ |
| Márcio | ✅ |

**Fases:**
- [x] Abertura
- [x] Parecer Gemini (PO)
- [x] Parecer Claude
- [x] Parecer Copilot
- [x] Consolidação / Veredito
- [x] Aprovação Márcio
- [x] Work Orders despachadas
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

---

## 3.3 Parecer do Gemini (PO) — [DEBATE-022]
**Data:** 2026-05-28
**Posição:** ✅ Opção B (Script de Carga Resetável)

Como PO, priorizo a **confiabilidade da narrativa comercial**. A Opção B é a única que remove o fator "erro humano" ou "sujeira de teste" antes de uma apresentação. O Márcio deve ter a segurança de que o palco será resetado para o estado ideal com um único comando.

### Respostas às Questões de Valor:

1. **Os 4 Nichos de Impacto:**
   - **💈 Barbearia/Salão (The Barber Shop):** Explora 100% o Branding Dinâmico e o módulo de Agenda (TOS-015). É um nicho visual e de fácil compreensão.
   - **🩺 Clínica/Consultório (Health Hub):** Foco em Agenda e Narrativa de Organização/Profissionalismo.
   - **🍔 Alimentação (Burger Flow):** Nicho clássico para demonstrar Branding em menus e interfaces de pedido.
   - **🧘 Personal/Studio (Mind & Body):** Explora Agenda (aulas coletivas/individuais) e Recorrência.

2. **Narrativa Mínima:**
   - Cada tenant deve ter: **Logo fictícia**, **Paleta de Cores** (via TOS-013), **2-3 serviços cadastrados** e **1 usuário admin**.
   - O segredo está no Branding: a transição entre esses 4 nichos deve mostrar como o TenantOS "muda de cara" instantaneamente.

3. **Mecanismo de Proteção:**
   - Acompanho o Claude na salvaguarda do `is_demo: true`. Isso é vital para que, em apresentações futuras, possamos filtrar "Dados de Demo" de "Métricas Reais" sem poluir o BI do produto.

**Impacto no backlog:** Crucial para o fechamento do Ciclo 2. TOS-019 deve ser o bocal de saída para a materialização comercial do produto.

---

## 4. ❓ Questões para o Squad

### Para o Márcio (Owner):
1. Os 4 nichos selecionados (Barbearia, Clínica, Hamburgueria, Personal) atendem à sua agenda imediata de apresentações?
2. O tempo de reset (alguns segundos) da Opção B é aceitável para o seu workflow de demo?

---

## 6. 🏛️ Consolidação / Veredito — Claude (Arquiteto)
**Data:** 2026-05-28
**Veredito:** ✅ Opção B + salvaguarda `is_demo`

### Convergência total do squad

Os três pareceres convergem sem divergência: Opção B (script resetável) com o campo `is_demo: Boolean` no schema Prisma como mecanismo de isolamento primário.

### Decisões consolidadas

**1. Mecanismo de demo**
- Script `npm run demo:reset` idempotente no `tenantOS`
- Identifica tenants demo por `is_demo = true` (não por slug)
- Slug prefixado `demo-*` mantido como convenção visual, mas o reset opera por `is_demo`

**2. Isolamento técnico**
- Campo `is_demo: Boolean @default(false)` no model `Tenant` (migration non-breaking)
- Reset: `DELETE WHERE is_demo = true` + re-seed dos fixtures
- Operações sensíveis (webhooks reais, cobrança) bloqueadas quando `is_demo = true`

**3. Os 4 nichos aprovados pelo squad**

| Slug | Nome fictício | Nicho | Foco de demo |
|---|---|---|---|
| `demo-barbearia` | The Barber Shop | Barbearia/Salão | Branding dinâmico + Agenda |
| `demo-clinica` | Health Hub | Clínica/Consultório | Agenda + Profissionalismo |
| `demo-hamburgueria` | Burger Flow | Alimentação | Branding em cardápio |
| `demo-studio` | Mind & Body | Personal/Studio | Agenda coletiva + Recorrência |

**4. Spec mínima por tenant**
- Logo fictícia + paleta de cores (via TOS-013 quando disponível, ou hard-coded no seed)
- 2–3 serviços cadastrados
- 1 usuário admin
- `is_demo: true`

**5. Backlog**
- TOS-019 abre como item próprio para materializar o seed + script de reset

### Questões para o Márcio (The Gate)

1. Os 4 nichos (Barbearia, Clínica, Hamburgueria, Personal/Studio) cobrem sua agenda de apresentações?
2. O tempo de reset de alguns segundos é aceitável antes de uma demo?
3. Aprovação para abrir TOS-019 e despachar work order para o Copilot?

### Análise Financeira (DIR-080)

| Dimensão | Valor |
|---|---|
| Custo desta consolidação | R$ 0,20 estimado |
| Custo total de implementação | R$ 0,90–1,30 (migration + 4 fixtures + script) |
| Confiança | Alta |
| Valor gerado | Demo profissional e repetível para apresentações comerciais |
| Payback | Primeira apresentação |
| Custo de não fazer | Apresentação com telas vazias ou improviso operacional |

---

## 5. ✅ Resultado Esperado (Pós-Veredito)

1. Migration do campo `is_demo` no TenantOS.
2. Criação dos fixtures de seed para os 4 nichos em `beehive/assets/tenantOS/seeds/`.
3. Script `demo:reset` no `package.json` do TenantOS.
4. Materialização da narrativa em `beehive/docs/materializacao/TOS-019-DEMO-SCENARIOS.md`.
