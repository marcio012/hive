---
id: DEBATE-036
titulo: Login e Landing Page do Hive UI
thread: login-landing-hive
status: em-andamento
data_abertura: 2026-05-30
responsavel: Claude (Arquiteto)
backlog_ref: HIVE-026
---

# DEBATE-036 — Login e Landing Page do Hive UI

## 📊 Status

**Participantes:**
- Claude (Arquiteto): ✅ parecer emitido (2026-05-30)
- Gemini (PO): ✅ parecer emitido (2026-05-30)
- Copilot (Engenheiro): ✅ parecer emitido (2026-05-30)

**Fases:**
- [x] 1. Abertura
- [x] 2. Parecer Claude
- [x] 3. Parecer Gemini
- [x] 4. Parecer Copilot
- [ ] 5. Consolidação / Veredito
- [ ] 6. Aprovação Márcio
- [ ] 7. Work Orders despachadas
- [ ] 8. Execução concluída

---

## 1. Contexto e Motivação

O Hive UI (`apps/hive-ui/`) é atualmente aberto — qualquer pessoa com acesso à URL do servidor HML entra direto no dashboard sem autenticação. Isso é um risco de segurança e impede apresentações controladas a terceiros.

Márcio quer duas coisas distintas:
1. **Login no Hive UI** — proteger o dashboard com autenticação própria (independente do auth do TenantOS/produto).
2. **Landing page pública do Hive** — vitrine para apresentar o Hive a terceiros (investidores, potenciais parceiros).

O auth do produto (TenantOS) já tem WO separada (`CORE-001-AUTH`). O login do Hive é um sistema completamente independente.

---

## 2. Questões para Debate

### Bloco A — Login do Hive UI

**Q1 — Mecanismo de autenticação (backend)**
- **Opção A:** Credenciais em variável de ambiente (`HIVE_USER` + `HIVE_PASS` com hash bcrypt). V1 de usuário único — zero banco, zero migração.
- **Opção B:** Multi-usuário em PostgreSQL com tabela `hive_users` (mesmo padrão da CORE-001-AUTH do produto).
- **Opção C:** Token estático longo (Bearer token secreto em `.env`) — sem formulário de login, integração direta por HTTP header.

**Q2 — Persistência da sessão no frontend**
- **Opção A:** JWT em HttpOnly cookie — mais seguro contra XSS; transparente para o React.
- **Opção B:** JWT em localStorage — simples, mas exposto a XSS.
- **Opção C:** Sessão stateful no servidor (NestJS session + Redis) — mais complexo.

**Q3 — Proteção de rotas no backend**
- **Opção A:** `JwtAuthGuard` global no NestJS + decorator `@Public()` para rotas abertas (`/api/auth/*`, `/` da landing).
- **Opção B:** Middleware global verificando Authorization header — sem módulo auth dedicado.

**Q4 — AuthModule: dedicado ou inline?**
- **Opção A:** `AuthModule` no NestJS com `AuthController`, `AuthService`, `JwtStrategy` (Passport-JWT). Padrão do framework.
- **Opção B:** Validação inline no guard existente — menos arquivos, mais acoplamento.

### Bloco B — Landing Page

**Q5 — Onde fica a landing?**
- **Opção A:** Rota pública `/` na mesma app React — `pages/Landing.tsx`. O app protegido move para `/app`. Uma única implantação.
- **Opção B:** Projeto/subdomínio separado (Vercel/GitHub Pages). Duas implantações independentes.
- **Opção C:** NestJS serve HTML estático — sem React na landing.

**Q6 — Escopo de conteúdo da V1**
- **Opção A:** Landing mínima — hero + 3 features + CTA "Acessar o Hive" → `/login`. Uma tela, sem scroll.
- **Opção B:** Landing completa — hero + features + screenshots do dashboard + roadmap + contato.
- **Opção C:** Landing com demo read-only — acesso ao dashboard em modo visualização sem login.

**Q7 — Relação landing ↔ auth**
- **Opção A:** Landing totalmente pública, CTA leva para `/login` separado. Separação clara.
- **Opção B:** Formulário de login inline na landing — menos cliques, menos páginas.

---

## 3. Parecer do Claude — DEBATE-036
**Data:** 2026-05-30
**Posição:** ✅ GO — com escolhas claras

### Bloco A — Login

**Q1 — Mecanismo:** ✅ **Opção A** (env vars para V1).

`HIVE_USER` + `HIVE_PASS` (com hash bcrypt pré-gerado, não em texto puro na ENV). Zero banco, zero migração. O Hive é ferramenta de um operador — multi-usuário pode esperar até o PostgreSQL do Hive estar consolidado (DEBATE-031). Misturar com a `CORE-001-AUTH` do produto seria acoplamento indevido entre sistemas que têm papéis completamente distintos.

**Q2 — Sessão:** ✅ **Opção A** (JWT em HttpOnly cookie).

A diferença de implementação entre HttpOnly cookie e localStorage é mínima. O ganho de segurança contra XSS justifica. Não há argumento técnico para aceitar a fragilidade do localStorage quando a alternativa segura custa o mesmo esforço.

**Q3 — Proteção backend:** ✅ **Opção A** (`JwtAuthGuard` global + `@Public()`).

NestJS guard global é o padrão do framework — é o mesmo padrão que já usamos. `@Public()` no controller de auth e nas rotas da landing é idiomático e explícito.

**Q4 — AuthModule:** ✅ **Opção A** (módulo dedicado).

NestJS é modular por design. Um `AuthModule` com `AuthController` + `AuthService` + `JwtStrategy` é o caminho canônico. Inline vai contra a arquitetura que já estabelecemos e cria dívida imediata.

### Bloco B — Landing

**Q5 — Onde fica:** ✅ **Opção A** (mesma app React, rota `/`).

Uma única implantação é o caminho mais simples para V1. O React Router já gerencia rotas — adicionar `/` como rota pública e mover o app para `/app` é trivial. Dois projetos separados introduzem complexidade de deploy sem ganho proporcional agora.

**Q6 — Conteúdo V1:** ✅ **Opção A** (landing mínima).

O Hive ainda está em construção ativa. Uma landing completa seria over-engineering. O objetivo declarado — "apresentar a terceiros" — é cumprido com hero bem escrito + 3 features diferenciadas + screenshot do dashboard + CTA. Menos é mais aqui.

**Q7 — Relação landing/auth:** ✅ **Opção A** (separação clara: landing → `/login` → app).

Landing pública sem formulário. CTA leva para `/login`. Separação de responsabilidades: a landing convence, o login autentica.

### Resumo das escolhas Claude

| # | Escolha |
|---|---|
| Q1 | Env vars (`HIVE_USER` + `HIVE_PASS` com bcrypt hash) |
| Q2 | JWT em HttpOnly cookie |
| Q3 | `JwtAuthGuard` global + `@Public()` |
| Q4 | `AuthModule` dedicado no NestJS |
| Q5 | Rota `/` na mesma app React |
| Q6 | Landing mínima: hero + 3 features + screenshot + CTA |
| Q7 | Landing pública → `/login` → `/app` |

### Análise Financeira

| Item | Valor |
|---|---|
| Custo estimado | Baixo — 2 sessões (backend auth + frontend landing/login) |
| Confiança | Alta — stack já conhecida (NestJS + React + JWT) |
| Valor gerado | Alto — habilita apresentações externas; elimina risco de acesso aberto |
| Payback | Imediato — próxima demonstração já se beneficia |
| Custo de não fazer | Médio — dashboard aberto é risco real; sem landing impossibilita apresentação formal do produto |

### Proposta de divisão de WOs

Se o veredito for GO:
- **WO-042** → Copilot: backend `AuthModule` (controller, service, strategy, guard global)
- **WO-043** → Gemini + Copilot: frontend — `Landing.tsx` + `Login.tsx` + `PrivateRoute` + ajuste de rotas no `App.tsx`

---

## 4. Parecer do Gemini (PO) — DEBATE-036
**Data:** 2026-05-30
**Posição:** ✅ Aprovado (GO!)

**Q1 — Mecanismo:** ✅ **Opção A**. Para o contexto atual do Hive (operador único), variáveis de ambiente com hash bcrypt são a solução de menor custo e maior agilidade. Evitamos dívida de migração de banco antes da consolidação do PostgreSQL.

**Q2 — Sessão:** ✅ **Opção A**. Segurança não é negociável. HttpOnly cookies protegem contra a classe mais comum de ataques (XSS) e são triviais de implementar no NestJS.

**Q3/Q4 — Backend:** ✅ **Opções A**. Seguir os padrões idiomáticos do NestJS (`AuthModule`, `JwtAuthGuard`, `@Public()`) garante que qualquer novo agente ou desenvolvedor que entre no projeto entenda a estrutura imediatamente.

**Q5/Q6/Q7 — Landing:** ✅ **Opções A**. Uma landing mínima integrada ao app atual é o MVP perfeito. O objetivo é comunicar o valor do Hive a terceiros de forma profissional, sem criar complexidade de infraestrutura desnecessária agora.

**Visão Estratégica:** A proteção do Hive UI é o marco que transforma uma "ferramenta interna" em um "produto de software". A landing page é o cartão de visitas necessário para a fase de captação e parcerias.

---

## 5. Parecer do Copilot — DEBATE-036
**Data:** 2026-05-30
**Posição:** ✅ Aprovado (GO)

---

**Q1 — Mecanismo:** ✅ **Opção A**. Para V1, `HIVE_USER` + `HIVE_PASS_HASH` em env é o menor delta técnico: hoje o backend nem depende de banco e o `package.json` não traz stack de auth/ORM; abrir com Postgres agora cria infraestrutura antes da necessidade real.

**Q2 — Sessão:** ✅ **Opção A**. HttpOnly cookie encaixa bem no NestJS, mas exige fechar o pacote completo: `cookie-parser`, `credentials: true` no CORS, `SameSite` ajustado ao ambiente e endpoint explícito de logout para expirar o cookie.

**Q4 — Estrutura:** ✅ **Opção A**. `AuthModule` dedicado evita espalhar regra de segurança pelo `HiveModule`, preserva o backend file-based atual e deixa claro o limite entre `/api/auth/*` público e o resto protegido por guard global.

**Leitura de implementação:** o frontend já tem `/landing` + `/login`, porém ainda usa `localStorage` (`hive-ui-demo-session`). O caminho mais seguro é trocar esse flag demo por `GET /api/auth/session` + login/logout reais, sem reabrir a discussão de UX.

**Risco / esforço:** baixo para médio. O maior trabalho está menos no formulário e mais em endurecer cookie/CORS entre `5174` e `3001`. Com isso fechado, o restante é refactor controlado.
