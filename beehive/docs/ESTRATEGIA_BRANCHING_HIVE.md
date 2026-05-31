---
titulo: Estratégia de Branching Dual-Track (Fábrica vs Produto)
tipo: governanca / gitflow
status: rascunho (aguarda Balcão Central)
data: 2026-05-31
responsavel: Staff Engineer (Gemini)
---

# 🌿 Estratégia de Branching Dual-Track

Para acompanhar a arquitetura de **Balcão Central**, o fluxo de Git deve espelhar o isolamento de domínios. A partir da Fase 3 do Balcão, adotaremos o modelo **Dual-Track**.

## 1. As Duas Trilhas (Tracks)

O repositório será dividido logicamente em duas esteiras de desenvolvimento que nunca devem colidir no mesmo commit.

### 1.1 Trilha da FÁBRICA (Hive Infrastructure)
- **Branch Base:** `main` (ou `factory/main`)
- **Branches de Feature:** `hive/feat-<nome>` | `hive/fix-<nome>`
- **Escopo:** `beehive/`, `apps/hive-ui/`, `scripts/`, `.agile-squad/`.
- **Regra de Ouro:** Commits nestas branches **não podem** alterar arquivos dentro de `tenantOS/`.

### 1.2 Trilha do PRODUTO (TenantOS)
- **Branch Base:** `product/main` (ou manter `main` com tags de release)
- **Branches de Feature:** `tos/feat-<nome>` | `tos/fix-<nome>`
- **Escopo:** `tenantOS/`, `apps/mobile/`, etc.
- **Regra de Ouro:** Commits nestas branches **não podem** alterar arquivos dentro de `beehive/`.

---

## 2. O Balcão Central como Gatekeeper de Git

A grande inovação é que o **Balcão Central automatizará a troca de branch** para o agente.

### 2.1 O Fluxo Automatizado
1. **Claim:** O Copilot dá claim na Task `TASK-123` (Domain: `product`).
2. **Auto-Checkout:** O script de claim detecta o domínio e executa:
   `git checkout -b tos/task-123 product/main`
3. **Isolamento:** A Task injeta o `cognitive-reset-gate`.
4. **Commit & Push:** O agente commita apenas no escopo `tos/`.
5. **Merge:** O Claude (Arquiteto) revisa o PR e faz o merge para `product/main`.

---

## 3. Benefícios do Dual-Track

- **Zero Conflito:** Desenvolvedores (ou IAs) trabalhando na UI do Hive não bloqueiam quem está corrigindo um bug no TenantOS.
- **Deploy Independente:** Podemos atualizar o motor da fábrica sem precisar gerar um novo build do produto.
- **Histórico Limpo:** O `git log` do produto não fica "sujo" com commits de refatoração de scripts internos da fábrica.

---

## 4. O Papel do Diretor (The Gate)

Você continua sendo a autoridade de **Merge Final**. 
- As IAs preparam as branches e abrem os PRs (via Balcão).
- Você revisa visualmente no Hive UI e clica em "Aprovar & Merge".
- O Balcão detecta o merge e marca a Task como `done`.

---
*Assinado: Staff Engineer (Gemini)*
