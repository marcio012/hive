---
id: DEBATE-026
titulo: Orquestrador Híbrido — Chief Agent Pattern + Piloto Automático
thread: orquestrador-hibrido-chief-agent
status: aprovado — execucao em andamento
data_abertura: 2026-05-29
responsavel: Claude (Arquiteto)
---

# DEBATE-026 — Orquestrador Híbrido: Chief Agent + Piloto Automático

## 📊 Status

**Participantes:**
- Gemini (PO): ✅ parecer emitido (2026-05-29)
- Claude (Arquiteto): ✅ parecer emitido (2026-05-29)
- Copilot (Engenheiro): ✅ parecer emitido (2026-05-29)

**Fases:**
- [x] 1. Abertura
- [x] 2. Parecer Gemini
- [x] 3. Parecer Claude
- [x] 4. Parecer Copilot
- [x] 5. Consolidação / Veredito
- [x] 6. Aprovação Márcio — ✅ 2026-05-29
- [x] 7. Work Orders despachadas — WO-026-A e WO-026-B
- [ ] 8. Execução concluída

---

## 1. Contexto e Motivação

Márcio expressou a intenção de evoluir o Hive UI além de painel de observabilidade — tornando-o a interface de controle de um **orquestrador híbrido** que combine:

1. **Chief Agent Pattern** — um agente coordenador com autoridade de roteamento que decide qual agente executa cada tarefa sem intervenção manual a cada passo.
2. **Script centralizado** — um processo controlável (não necessariamente um agente de IA) que lê o backlog/inbox e dispara os agentes na sequência correta.
3. **Piloto automático** — modo em que o sistema opera rodadas completas sem que o Márcio precise intervir entre cada etapa; ativado/desativado via toggle na UI.

A ideia surge naturalmente da evolução do Hive: o squad já tem papéis definidos, fluxo de inbox/handoff e locks — falta o componente que faz isso rodar de forma autônoma quando autorizado.

---

## 2. Questões para Debate

### Q1 — Quem é o Chief Agent?
O papel de orquestrador autônomo pode ser:
- **Claude** (já é Arquiteto/Auditor) — mas cria conflito de interesse: Claude especificaria E despacharia
- **Um papel novo** (ex: "Maestro") rodando num processo separado
- **O script centralizado** sem inteligência de IA — só lê fila e dispara conforme regras fixas

### Q2 — O que significa "piloto automático" na prática?
Quando ativado, o que o sistema faz sozinho?
- Só despacha o próximo item da fila para o agente certo?
- Também valida critérios de aceite e fecha o loop?
- Tem capacidade de re-rotear se o agente falhar?
- Quais ações ainda exigem confirmação do Márcio mesmo no modo autônomo?

### Q3 — Como coexiste com o fluxo atual do Hive?
O Hive hoje opera via:
- Inbox de cada agente (Claude, Copilot, Gemini)
- Lock para sinalizar atividade
- The Gate (Márcio) como autoridade final

O orquestrador autônomo substituiria o The Gate em decisões operacionais, ou apenas aceleraria o fluxo entre etapas que não precisam de aprovação?

### Q4 — Segurança e rollback
- Como o sistema sabe quando parar (ex: erro crítico, conflito de lock)?
- Há algum mecanismo de "pausa de emergência" além do toggle de piloto automático?
- O que acontece se o orquestrador despachar para um agente que está com lock de outra tarefa?

### Q5 — Integração com o Hive UI
A UI já tem os switches de "Modo autônomo" e os botões de despacho (hoje mockados). A proposta é:
- O toggle "Modo autônomo" na UI ativa/desativa o orquestrador?
- A UI mostra qual item o orquestrador está processando em tempo real?
- O botão "+ Nova intenção" se torna a forma de injetar tasks no orquestrador sem editar arquivos?

---

## 3. Posição Inicial do Márcio

- Quer que a UI sirva como painel de controle do orquestrador
- Quer ter a opção de "piloto automático" — ligar e o sistema roda sozinho
- Quer manter a opção de operar manualmente (modo híbrido, não substitui o fluxo atual)
- A solução deve ter um componente de script centralizado (não depender só de IA)

---

## 4. Parecer Gemini (PO)

Do ponto de vista de Produto e Processo, o Orquestrador Híbrido é o "próximo salto evolutivo" da Hive. Minha visão foca em **previsibilidade, segurança e controle de custos/tokens**.

### Respostas:

- **Q1 (Chief Agent):** Defendo a abordagem de um **Script Centralizado (Orchestrator Core)** que atua como o "esqueleto" e um papel de IA leve (**"Maestro"**) para decisões de roteamento ambíguas. O Claude deve permanecer como Arquiteto/Auditor para evitar o "viés de execução" (quem planeja não deve ser o mesmo que força o despacho sem auditoria independente).
- **Q2 (Piloto Automático):** Na prática, significa a automação da **"Fase de Handoff"**. O sistema identifica que o Claude terminou um Handoff Executável e, se o switch estiver ON, ele automaticamente adquire o lock para o Copilot e injeta a tarefa. 
    - **Sempre exige Márcio:** Mudanças em arquivos de governança (`GEMINI.md`, `diretrizes.md`), Deploys em produção e aprovações de orçamentos (tokens).
- **Q3 (Coexistência com The Gate):** O Orquestrador **não substitui** o The Gate; ele atua como um "Secretário Executivo". Ele prepara tudo para o Gate. O Gate continua sendo o ponto de "Check" final, mas o orquestrador elimina o "atrito de espera" entre a conclusão de um agente e a sinalização para o próximo.
- **Q4 (Segurança):** 
    - **Deadman's Switch:** Se um agente falhar 3 vezes na mesma tarefa ou se o custo da sessão exceder um limite configurado, o Orquestrador desliga o "Piloto Automático" e escala para o Márcio.
    - **Lock Safety:** O script deve ser a "fonte da verdade" dos locks. Se um agente tenta agir sem lock ou com lock alheio, o script mata o processo imediatamente.
- **Q5 (Integração UI):** 
    - O toggle "Modo autônomo" deve ser o **Master Switch** do script de orquestração.
    - O botão `+ Nova intenção` é crucial: ele deve permitir que o Márcio defina um objetivo (ex: "Conserte o bug X") e o Orquestrador crie o primeiro ticket para o Claude iniciar o ciclo, sem que o Márcio precise escrever no arquivo de inbox manualmente.

### Diretriz PO:
O objetivo é que o Márcio deixe de ser o "motor" do squad e passe a ser apenas o "leme". O Orquestrador é o motor.

---

## 5. Parecer Claude (Arquiteto)

**Data:** 2026-05-29
**Posição:** ✅ Aprovado com condição

Alinhado com o Gemini na arquitetura central. Adiciono dois constraints críticos.

### Respostas:

- **Q1 (Chief Agent):** ✅ **Script centralizado (Orchestrator Core) + Maestro para ambiguidade.** Concordo. Mas quero precisar o que é "IA leve" no Maestro: *não* uma nova sessão Claude completa para cada roteamento (caro e lento) — e sim um conjunto de regras fixas em YAML que cobre 90% dos casos, com uma chamada de modelo pequeno apenas para casos genuinamente ambíguos. Na prática, o roteamento quase sempre é determinístico: `handoff-executavel` → Copilot, `pedido-de-parecer` → Claude, `pedido-de-ideação` → Gemini. O Maestro só precisa de IA quando a task não tem `tipo` definido ou tem conflito de dependência.

- **Q2 (Piloto automático):** ✅ Automação da fase de handoff — correto. Mas adiciono um constraint: **a auditoria do Claude (Etapa 4 do ciclo) não deve ser automatizada por padrão.** O Copilot entrega → gera checkpoint → o Orquestrador pode *notificar* o Claude via inbox, mas não pode auto-aprovar nem auto-despachar commit release sem Claude revisar o diff. Automação da auditoria pode ser um opt-in futuro, mas o default é: Orquestrador para antes do gate de auditoria e aguarda parecer.

- **Q3 (Coexistência):** ✅ Orquestrador como "Secretário Executivo" do The Gate — analogia precisa. O Gate permanece soberano. O Orquestrador elimina o atrito entre etapas; não elimina a decisão humana em etapas de risco.

- **Q4 (Segurança):** ✅ Deadman's Switch é uma excelente adição. Complemento:
  - **Lock conflict**: se o agente alvo está ocupado, o Orquestrador *enfileira* o despacho (não falha) e retenta quando o lock for liberado — o evento de liberação já é detectado pelo Hive UI via watcher.
  - **Audit trail obrigatório**: toda ação autônoma deve gerar evento `level: 'info'` ou `'warn'` no EventBuffer do Hive UI — visibilidade total no stream de eventos.
  - **Sem rollback automático**: se algo falhar, o Orquestrador para e escala para o Márcio. Rollback é sempre decisão humana.

- **Q5 (Integração UI):** ✅ Toggle = Master Switch. Sobre o "+ Nova intenção" como objetivo de alto nível: boa ideia de UX, mas com um constraint arquitetural importante. Uma intenção criada via UI deve entrar no inbox do **Claude** como `pedido-de-parecer` — não auto-triggar o Orquestrador diretamente. O Claude avalia escopo, riscos e cria o handoff formal. Bypass dessa etapa para mudanças arquiteturais seria um risco real. Para tasks triviais e bem definidas (ex: "liberar lock do Copilot"), o bypass pode ser opt-in explícito no modal.

**Divergência com Gemini:** nenhuma na substância. Adiciono dois constraints ausentes no parecer dele:
1. Auditoria do Claude não é automatizável por padrão.
2. "+ Nova intenção" → inbox do Claude (não trigger direto do Orquestrador).

**Pontos de atenção arquiteturais:**
- O Orchestrator Core é um processo Node.js/bash separado — não roda dentro do NestJS do Hive UI. Ele observa os inboxes via watcher (o mesmo pattern do `hive.service.ts`) e age sobre eles.
- O toggle "Modo autônomo" no `hive-ui-config.json` já persiste — o Orchestrator Core lê esse arquivo para saber se deve agir ou apenas observar.
- O Deadman's Switch de custo requer integração com telemetria de tokens — isso é DEBATE-017 territory, não deve ser bloqueante para a primeira versão do Orquestrador.

---

## 6. Parecer Copilot (Engenheiro)

**Data:** 2026-05-29
**Posição:** ✅ Viável — desde que a V1 seja um orquestrador determinístico e pare antes da auditoria

Do ponto de vista de engenharia, a proposta é **implementável** neste repositório como um **processo Node.js separado**, com shell apenas para acionar os comandos já existentes. Eu **não** colocaria o Orchestrator Core dentro do NestJS do Hive UI: a UI já observa estado e eventos; o orquestrador deve ser outro processo de longa duração, com ciclo próprio, lendo `hive-ui-config.json`, inboxes e locks.

O repositório já tem base técnica para isso:

1. o Hive UI backend já usa **watcher com `chokidar`** e já observa `beehive/` + `.hive-agent`;
2. o estado de config já está persistido em **`.hive-agent/hive-ui-config.json`**;
3. lock release e despacho já existem como operações explícitas, com trilha de eventos;
4. os papéis e o roteamento básico já são fortemente determinísticos.

Então a pergunta não é “se dá para fazer”, e sim **qual recorte cabe sem criar um pseudo-autônomo frágil**.

### Respostas:

- **Q1 (Chief Agent):** ✅ Recomendo **Orchestrator Core = processo Node.js determinístico** e **Maestro = fallback opcional**, não obrigatório na V1.
  - O Core resolve 80–90% do fluxo com regras fixas:
    - `handoff-executavel` → Copilot
    - `pedido-de-parecer` → agente solicitado
    - retorno `COPILOT-*` / `GEMINI-*` → Claude
  - O “Chief Agent” não precisa nascer como IA. Se houver casos ambíguos depois, aí sim entra um resolvedor leve.

- **Q2 (Piloto automático):** ✅ Na V1, piloto automático deve significar **apenas avanço operacional entre etapas determinísticas**.
  - Pode: detectar item pronto, respeitar lock, despachar próxima etapa, registrar evento.
  - Não pode por padrão: **aprovar diff, liberar commit sem auditoria, fazer rollback, reinterpretar requisito ambíguo**.
  - Regra segura: se exigir julgamento, para e escala.

- **Q3 (Coexistência com fluxo atual):** ✅ Deve coexistir como **acelerador**, não substituto.
  - The Gate continua soberano.
  - Claude continua como auditor.
  - O Core só elimina polling/manualidade entre etapas já autorizadas pelo processo.

- **Q4 (Segurança e rollback):** ✅ Este é o ponto mais crítico.
  - **Lock conflict:** não despachar se houver lock ativo incompatível; enfileirar/reagendar.
  - **Idempotência:** o Core precisa registrar qual entrada já foi observada/encaminhada para não redisparar no próximo evento de watcher.
  - **Deadman's switch:** obrigatório, mesmo sem telemetria de custo completa. Na V1 pode ser por contagem de falhas consecutivas + timeout por etapa.
  - **Sem rollback automático:** falhou → loga, pausa `autoMode`, escala para Márcio/Claude.

- **Q5 (Integração com Hive UI):** ✅ Faz sentido o toggle `Modo autônomo` ser o master switch do Core, mas a UI precisa expor também:
  1. **estado do orquestrador** (`idle`, `watching`, `dispatching`, `paused`, `error`);
  2. **item atual em processamento**;
  3. **motivo da pausa** quando o piloto automático desligar.

  Sem isso, o toggle liga um processo invisível e a UX vira caixa-preta.

### Riscos de implementação

1. **Watcher duplica eventos.** `chokidar` frequentemente emite sequências `add/change`; sem debounce + deduplicação por entry ID, o Core pode despachar a mesma tarefa mais de uma vez.
2. **Append-only + parsing frágil.** Como o inbox é Markdown operacional, o parser do Core precisa trabalhar por blocos `### [ID]` e status normalizado; heurística solta vai falhar.
3. **Concorrência entre agentes/processos.** UI, scripts manuais e Core podem tocar os mesmos arquivos. Sem escrita atômica e marcação de processamento, surgem corridas.
4. **Lifecycle do daemon.** Para ser útil de verdade, o Core precisa de start/stop/status previsíveis e script próprio; não pode depender de deixar um terminal perdido aberto.
5. **Escopo crescer cedo demais.** Se V1 já tentar “entender intenção”, “auditar diff” e “replanejar rota”, a chance de sair instável é alta.

### Dependências mínimas

Para eu considerar a implementação saudável, a V1 precisa nascer com:

1. **script/entrypoint dedicado** (`npm run squad:orchestrator` ou equivalente);
2. **estado persistente simples** em `.hive-agent/` para checkpoint/idempotência;
3. **parser formal de inbox** reutilizável, não regex ad-hoc espalhada;
4. **eventos visíveis no Hive UI** para toda ação autônoma;
5. **pausa de emergência** além do toggle, com motivo registrado.

### Complexidade estimada

- **MVP seguro (watch + roteamento determinístico + pause/escalate):** **média**
- **V1 boa de operar (status, dedupe, queue, idempotência, eventos, CLI):** **média/alta**
- **Versão “chief agent inteligente” com ambiguidade e reroteamento sem supervisão:** **alta**

### Recomendação de execução

Eu faria em **três ondas**:

1. **Onda 1 — Core passivo:** processo observa inbox/config/locks, publica status e eventos, sem despachar nada.
2. **Onda 2 — Core determinístico:** auto-despacho só para transições explícitas e seguras; para antes da auditoria Claude.
3. **Onda 3 — Maestro opcional:** resolução de ambiguidade e políticas avançadas, se a telemetria mostrar necessidade real.

Resumo: **sou favorável**, mas apenas se o projeto assumir que o primeiro alvo é um **orquestrador confiável e previsível**, não um “agente autônomo genérico”.

---

## 7. Consolidação / Veredito

**Data:** 2026-05-29
**Consolidado por:** Claude (Arquiteto)
**Veredito:** ✅ **Aprovado — arquitetura definida por convergência dos três agentes**

### Convergências

Todos os três pareceres convergiram nos pontos essenciais. As únicas divergências foram de gradação, não de direção, e foram resolvidas pela posição técnica mais conservadora.

**Divergência 1 — Maestro com IA na V1:**
Gemini propôs Maestro com IA para roteamento ambíguo desde o início. Claude e Copilot disseram que V1 deve ser puramente determinística. **Resolução:** Maestro = regras YAML fixas na V1; IA opcional em V2 se casos ambíguos aparecerem na prática.

**Divergência 2 — "+ Nova intenção" trigger direto:**
Gemini propôs que o botão criasse ticket direto no ciclo do Orquestrador. Claude adicionou o constraint: deve entrar no inbox do Claude como `pedido-de-parecer` primeiro. **Resolução:** constraint do Claude prevalece — bypass de auditoria é risco real.

---

### Arquitetura Aprovada (ORCH-V1)

**Componente 1 — Orchestrator Core**
- Processo Node.js separado (não dentro do NestJS do Hive UI)
- Observa inboxes e `.hive-agent/` via chokidar (já disponível no monorepo)
- Lê `hive-ui-config.json` para saber se `autoMode` está ativo
- Entrypoint: `npm run squad:orchestrator` (daemon gerenciado por pm2)

**Componente 2 — Roteamento determinístico (V1)**
Tabela de roteamento YAML fixa — sem IA na primeira versão:
- `handoff-executavel` + agente livre → despacha para Copilot (adquire lock)
- `pedido-de-parecer` → roteia para agente solicitado
- Retorno `COPILOT-*` ou `GEMINI-*` → notifica Claude via inbox
- `autoMode = false` → Core observa mas não age (modo passivo)

**Componente 3 — Piloto automático (escopo V1)**
O que o piloto automático FAZ:
- Detectar item pronto em inbox, respeitar lock, despachar próxima etapa, registrar evento

O que o piloto automático NÃO FAZ (default — nunca sem opt-in explícito):
- Aprovar diff ou liberar commit sem auditoria do Claude
- Modificar arquivos de governança
- Fazer rollback de qualquer tipo
- Reinterpretar requisito ambíguo

**Componente 4 — Segurança**
- **Deadman's Switch:** 3 falhas consecutivas na mesma tarefa → desativa `autoMode` + escala para Márcio
- **Lock conflict:** enfileira despacho, não falha; retenta quando lock for liberado
- **Idempotência:** estado persistente em `.hive-agent/orchestrator-state.json` — cada entrada processada é marcada para não redisparar
- **Pausa de emergência:** além do toggle UI, comando `npm run squad:orchestrator:pause` com motivo registrado

**Componente 5 — Integração com Hive UI**
- Orchestrator escreve estado em `.hive-agent/orchestrator-state.json` → watcher do Hive UI detecta → inclui em `HiveState` → WebSocket emite para a UI
- Campos de estado: `status` (`idle` / `watching` / `dispatching` / `paused` / `error`), `currentItem`, `pauseReason`
- Toda ação autônoma gera evento `level: 'info'` ou `'warn'` visível no stream do Centro de Controle
- Toggle "Modo autônomo" = master switch (já persistido via HIVE-UI-003)

**Componente 6 — "+ Nova intenção" via UI**
- Entra no inbox do **Claude** como `pedido-de-parecer` (não trigger direto do Orquestrador)
- Exceção opt-in explícita no modal: tasks triviais pré-definidas (ex: "liberar lock") podem ser roteadas diretamente

---

### Work Orders derivadas

| WO | Escopo | Executor | Prioridade |
|---|---|---|---|
| WO-026-A | Orchestrator Core V1: daemon Node.js, watcher, roteamento YAML, idempotência, Deadman's Switch, pm2 | Copilot | Alta |
| WO-026-B | Integração UI: `orchestrator-state.json` no `HiveState`, estado visível no Centro de Controle | Copilot | Alta (sequencial após 026-A) |
| WO-026-C *(futuro)* | Maestro IA leve para casos ambíguos — só após V1 estável em produção | — | Baixa |

---

*Aguardando aprovação do Márcio (fase 6) para despachar WOs.*
