---
titulo: Arquitetura Balcão Central (Central Broker)
tipo: documentacao_estrategica
status: ativo (em implementacao)
data_criacao: 2026-05-31
responsavel: Staff Engineer (Gemini)
---

# 🏛️ Arquitetura Balcão Central (Central Broker)
**O novo Sistema Operacional da Squad Hive**

Este documento serve como o Guia de Estudo e Visão Futura para o Diretor (Márcio). Ele detalha a transição do modelo atual de "Arquivos de Texto" (Push) para o modelo de "Estado Gerenciado" (Pull) através do Balcão Central.

---

## 1. O Paradigma: Por que estamos mudando?

### 1.1 O Modelo Antigo (Push/Inbox)
- **Como funcionava:** O Orquestrador lia uma intenção e **copiava o texto** para um arquivo `.md` (ex: `inbox-copilot.md`). O agente lia o arquivo.
- **O Problema:** Falta de estado. Se dois agentes lessem o mesmo arquivo, eles poderiam duplicar o trabalho. Se o orquestrador caísse no meio da escrita, o estado corrompia. O contexto dos agentes ficava "sujo" com histórico antigo.

### 1.2 O Novo Modelo (Pull/Balcão Central)
- **Como funciona:** O Orquestrador é extinto como "copiador de texto". Em seu lugar, nasce o **Balcão**. As demandas viram **Tasks** (registros em um banco de dados SQLite).
- **A Solução:** Quando um agente "acorda", ele **pergunta** ao Balcão: *"Qual a próxima task pendente para o meu papel no domínio X?"*. O Balcão responde e **trava** a task (lock atômico).

---

## 2. Anatomia do Balcão Central

A fundação do Balcão é o banco de dados local `.hive-agent/tasks.db` (SQLite em modo WAL).

### 2.1 O Contrato da Task
A tabela central que dita o trabalho de todos os agentes.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador único (ex: TASK-20260531-001) |
| `domain` | Enum | **O coração do isolamento.** (`hive`, `product`, `shared`) |
| `status` | Enum | `pending` \| `in_progress` \| `done` \| `failed` |
| `assignee` | String | Quem assumiu a task (`claude`, `copilot-hive`, nulo) |
| `payload` | Text | O que deve ser feito (link para a WO ou instrução) |
| `skills` | JSON | Skills que devem ser ativadas no runtime (Mecanismo) |

### 2.2 A Evolução das "Skills"
No modelo antigo, Skills eram apenas "dicas de prompt" em arquivos `.md`. No Balcão, elas são **Mecanismos Verificáveis**.
- Se uma Task exige a skill `cognitive-reset`, o Balcão executa um script que limpa o cache de contexto do agente *antes* de lhe dar a Task.

---

## 3. O Fluxo de Vida de uma Task

1. **Gênese:** Márcio (ou Claude) cria uma Task. O status inicial é `pending`.
2. **Claim (Assunção):** O Copilot executa um script (ex: `hive-claim`). O SQLite garante que se o Copilot-A pegar a task, o Copilot-B recebe um aviso de "Task indisponível" (Atomicidade).
3. **Injeção de Skill:** O Balcão lê o campo `skills` e injeta a "Amnésia Cognitiva" no Copilot, isolando sua visão apenas para o domínio da Task.
4. **Execução e Resolução:** O Copilot executa o código e manda um `hive-complete`. O status muda para `done`.

---

## 4. O Plano de Implementação (Faseado)

O Squad está operando sob **Freeze Estratégico** para entregar isso sem quebrar a fábrica atual:

- **Fase 0 (Design):** Claude desenha as tabelas e interfaces (TypeScript).
- **Fase 1 (Dual-Write):** Copilot instala o SQLite. O Hive passa a escrever a Task no Banco de Dados **E** no arquivo `.md` antigo. Isso permite que você continue lendo o terminal como sempre fez.
- **Fase 2 (Migração Pull):** O Copilot para de ler arquivos `.md` e passa a consultar apenas o Banco de Dados.
- **Fase 3 (Morte do Legado):** Os arquivos `.md` param de receber atualizações e o Hive UI se torna a visualização oficial do Balcão.

---

## 5. Visão de Futuro (O que isso destrava?)

O Balcão Central é o alicerce para transformar o Hive em um verdadeiro Sistema Operacional:

1. **Múltiplos Produtos Simultâneos:** Com o campo `domain`, você pode ter a Squad trabalhando no TenantOS de manhã e em um novo produto à tarde, sem que um agente confunda o código do outro.
2. **Escala Horizontal de Copilots:** No futuro, você pode instanciar 3 Copilots. Todos eles consultarão o mesmo Balcão. O SQLite impedirá que eles peguem a mesma Task.
3. **Telemetria Absoluta:** Como toda interação é um registro no Banco de Dados, o Hive UI poderá mostrar painéis de BI em tempo real (ex: "Copilot gasta 30% do tempo refazendo código").
4. **Resistência a Quedas:** Se a internet cair ou você reiniciar o PC no meio de uma geração, a Task continua como `in_progress` no banco. Basta reiniciar o agente e ele retomará do mesmo ponto.
