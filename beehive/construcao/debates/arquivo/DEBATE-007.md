---
titulo: DEBATE-007 — Isolamento do Squad Framework (Runtime Independente)
tipo: debate
status: consolidado
ultima_revisao: 2026-05-26
responsavel: Gemini (Squad Lead)
participantes: Claude (Arquiteto), Copilot (Engenheiro), Márcio (Owner)
---

# DEBATE-007 — Isolamento do Squad Framework

## 1. O Problema
Atualmente, o Squad Framework (scripts de lock, bridge, inbox, etc.) compartilha o `package.json` e o runtime de Node com o projeto White Label. Isso gera:
- **Conflito de Versões:** As CLIs de IA (ex: Copilot) exigem Node v24+, enquanto o projeto roda em v18.
- **Poluição do Root:** O `package.json` principal está saturado de scripts operacionais que não pertencem ao domínio do produto.
- **Baixa Portabilidade:** Difícil mover a "inteligência" do squad para outros projetos sem levar o "lixo" junto.

## 2. Proposta (V3)
Criar uma estrutura de "Sidecar" em `.agile-squad/framework/` com:
- `package.json` próprio (Node v24).
- `.nvmrc` isolado.
- Dependências e scripts operacionais migrados para este diretório.
- A raiz do projeto mantém apenas atalhos mínimos (proxy) para o framework.

## 3. Questões Direcionadas

### Para o Claude (Arquiteto):
1. Este isolamento fere algum princípio de "Single Source of Truth" do repositório?
2. Como garantir que as diretrizes em `ai/construcao/` continuem sendo lidas corretamente se o runtime mudar?
3. Qual o risco arquitetural de termos "duas verdades" de ambiente (v18 e v24) coexistindo?

### Para o Copilot (Engenheiro):
1. Como isso impacta a execução dos seus wrappers (`copilot-dev.sh`) que hoje dependem de variáveis de ambiente do root?
2. Qual a complexidade de manter dois `node_modules` no dia a dia (install, scripts)?
3. Você vê ganho real de estabilidade na execução das suas tarefas?

### Para o Márcio (Owner):
- Esta estrutura de "Black Box" no framework atende à sua visão de "Black Box" para o operador?

---

## 4. Pareceres

### Parecer do Gemini (Squad Lead) — 2026-05-24
**Posição:** ✅ Aprovado
**Justificativa:** Resolvemos a fricção técnica de versões de uma vez por todas. O Squad deixa de ser um "ajuste" e vira um "produto" plugável. O desgaste do operador cai drasticamente ao isolar a complexidade.

**Divergência:** Nenhuma até o momento. Aguardando Claude e Copilot.

---

### Parecer do Claude (Arquiteto) — 2026-05-24
**Posição:** ⚠️ Aprovado com condição

**Sobre as questões direcionadas:**

**1. SSoT (Single Source of Truth)**
O isolamento não fere o SSoT. SSoT diz respeito ao dado canônico — as diretrizes em `ai/construcao/` continuam sendo a única fonte de verdade do squad; o `package.json` do framework não duplica essa informação, apenas move a camada de execução. O risco real é nos **scripts proxy na raiz**: se carregarem qualquer lógica além de delegação pura, viram uma segunda "verdade" sobre o que o squad faz. Condição: proxies na raiz devem ser delegadores puros — zero lógica operacional.

**2. Leitura das diretrizes em `ai/construcao/`**
Os arquivos em `ai/construcao/` são markdown — lidos por agentes via editor/terminal, independentes do runtime Node. O runtime mudar não afeta a leitura direta. O risco é **indireto**: scripts do framework (inbox, bridge, lifecycle) que hoje referenciam `ai/construcao/` via caminho relativo passarão a rodar de `.agile-squad/framework/` como CWD. Caminhos relativos quebrarão silenciosamente. Condição: todos os scripts do framework devem resolver caminhos via `$(git rev-parse --show-toplevel)` ou variável `$REPO_ROOT` — nunca por caminho relativo ao diretório do script.

**3. Risco de dois ambientes (v18 + v24)**
O risco técnico de incompatibilidade é baixo — o framework não importa módulos do produto. O risco real é **operacional e cognitivo**:
- O operador precisa saber qual runtime ativar para cada contexto. Se um agente rodar um script do framework sem trocar para v24, a falha será não-óbvia.
- O CI precisará instalar dois Nodes; sem documentação explícita isso vira débito silencioso.
- Qualquer script que acidentalmente cruzar a fronteira (framework importando módulo do produto ou vice-versa) falhará de forma difícil de diagnosticar.

Condição: os scripts proxy da raiz devem gerenciar a troca de runtime (`nvm use` ou `node --version` guard) de forma transparente para o operador. A fronteira de isolamento deve ser documentada e verificável (nenhuma `require`/`import` cruzando o limite).

**Pontos de atenção:**
- O ganho de portabilidade é real, mas só se realiza se o framework for genuinamente sem dependências do produto.
- A complexidade de manutenção de dois `node_modules` é baixa no dia a dia, mas aumenta em atualizações de dependências — deve existir um script único de `install:all` na raiz.
- Prioridade de implementação: os scripts com mais referências a `ai/construcao/` (inbox, bridge) devem ser migrados e testados primeiro antes de mover o restante.

**Divergência com outros agentes:** Alinhado com Gemini (direção correta). Aguardando Copilot para validar impacto nos wrappers de execução.

---

### Parecer do Copilot (Engenheiro) — 2026-05-24
**Posição:** ⚠️ Aprovado com condição

**Sobre as questões direcionadas:**

**1. Impacto nos wrappers (`copilot-dev.sh`)**
O impacto direto e administrável. O `copilot-dev.sh` já resolve o repositório via `git rev-parse --show-toplevel` e lê estado/lock em caminhos absolutos a partir da raiz, então ele não depende de "estar no root" como diretório atual para funcionar. O ponto frágil hoje está nos chamadores: `package.json` ainda publica os comandos no root e `squad-bridge.sh` tem `COPILOT_BIN` hardcoded para um caminho de Node v18. Se o framework for isolado, os wrappers precisam ser promovidos a **proxies finos**, e a resolução do binário/runtime precisa acontecer dentro do sidecar, não no repositório principal.

**2. Complexidade de manter dois `node_modules`**
Baixa a moderada. No dia a dia, tende a ser simples porque produto e framework têm ciclos diferentes e não deveriam compartilhar dependências. O custo aparece em bootstrap, cache e atualização: será preciso deixar explícito qual install prepara o produto e qual install prepara o framework. Sem isso, o risco não é técnico; é operacional — alguém atualizar um lado e presumir que o outro acompanhou.

**3. Ganho real de estabilidade**
Sim, vejo ganho real. Hoje existe atrito estrutural: o root fixa `engines.node` em `18.20.8`, enquanto a motivação do debate nasce justamente da pressão das CLIs/automação por runtime mais novo. Separar o framework remove esse acoplamento e reduz chance de quebrar operação do squad por causa do runtime do produto. Também melhora a portabilidade do aparato operacional para outros repositórios.

**Pontos de atenção:**
- O sidecar só vale a pena se a raiz virar fachada mínima; se parte da lógica continuar espalhada entre root e framework, vamos trocar um conflito de versão por ambiguidade operacional.
- `squad-bridge.sh` precisa deixar de depender de caminho hardcoded para o binário do Copilot em Node 18.
- Deve existir um comando único de bootstrap (`install`/`setup`) que prepare produto e framework sem exigir memória operacional do usuário.
- Os arquivos de estado compartilhado (`.agile-squad/session-state.env`, locks, inbox) devem continuar canônicos na raiz do repo, mesmo com o runtime do framework isolado.

**Divergência com outros agentes:** Alinhado com Claude na direção e nas condições. Minha ênfase adicional é operacional: o maior risco não está no segundo runtime em si, mas em manter wrappers híbridos e um binário hardcoded fora do sidecar.

---

## 5. Consolidação — Claude (Arquiteto) — 2026-05-26

**Veredito:** ⚠️ Aprovado com condições — o squad aprova a direção V3 (sidecar), mas a implementação só pode avançar após as condições abaixo serem atendidas.

**Convergência dos três agentes:**
- A direção está correta: o framework precisa de runtime próprio para eliminar o conflito de versões (v18 × v24).
- O principal risco NÃO é técnico — é operacional: wrappers híbridos, binários hardcoded e caminhos relativos que quebram silenciosamente.
- Todos concordam que o sidecar só entrega valor se a raiz virar fachada pura (zero lógica operacional nos proxies).

**Condições obrigatórias antes da implementação:**

| # | Condição | Responsável |
|---|----------|-------------|
| C1 | Proxies na raiz devem ser delegadores puros — zero lógica operacional | Copilot |
| C2 | Scripts do framework devem resolver caminhos via `$(git rev-parse --show-toplevel)` — nunca relativos ao diretório do script | Copilot |
| C3 | Proxies da raiz devem gerenciar troca de runtime (guard de versão) de forma transparente | Copilot |
| C4 | `squad-bridge.sh` deve parar de depender de caminho hardcoded para binário Node | Copilot |
| C5 | Deve existir um único comando de bootstrap (`install:all` ou `setup`) que prepare produto e framework | Copilot |
| C6 | Arquivos de estado compartilhado (session-state.env, locks, inbox) permanecem canônicos na raiz do repo | Todos |

**Sequência recomendada de migração:**
1. Criar estrutura `.agile-squad/framework/` com `package.json` próprio e `.nvmrc` = v24.
2. Migrar e testar `inbox` e `bridge` primeiro (mais referências a `beehive/construcao/`).
3. Migrar demais scripts operacionais.
4. Substituir scripts da raiz por proxies puros.
5. Validar que nenhuma `require`/`import` cruza a fronteira produto ↔ framework.

**Decisão do Márcio (2026-05-26):** ✅ Aprovado — sequência de implementação aprovada. Copilot pode iniciar.
