---
titulo: Script de Qualificacao Consultiva V1
tipo: sales
status: ativo
ultima_revisao: 2026-05-22
responsavel: Márcio - Dev
executor: Claude - Arquiteto
issue: "#54"
---

# Script de Qualificação Consultiva V1

## Para que serve este script

Conduzir a primeira conversa com um prospect via WhatsApp — do primeiro contato
até o momento em que ele pede para ver como seria o sistema para o negócio dele.

A lógica é simples: **revelar a dor antes de vender qualquer coisa.**
O prospect precisa sentir que você entende o problema dele antes de você
falar em sistema, software ou proposta.

---

## Como usar

- Cada bloco tem o texto pronto para copiar e colar no WhatsApp.
- `[colchetes]` = instrução para o Márcio, não envia para o cliente.
- `→ sim` / `→ não` = ramificação dependendo da resposta.
- Não pule etapas. A ordem importa.

---

## Etapa 1 — Abertura

> [Use quando o prospect chegar pela landing page ou por indicação.
> O objetivo é confirmar o negócio e criar rapport antes de qualquer pergunta.]

```
Olá, [Nome]! Vi que você tem interesse no sistema para [segmento que ele preencheu].

Me conta um pouco mais: você trabalha com isso há quanto tempo?
E hoje você usa algum sistema para organizar a operação, ou ainda é tudo no
caderno / planilha / WhatsApp mesmo?
```

**→ Usa sistema:** avança para Etapa 2 com atenção redobrada — ele já tem referência, a conversa vai virar comparação.

**→ Não usa sistema / planilha/caderno:** ótimo sinal. Avança para Etapa 2 — a dor costuma ser mais crua e mais fácil de revelar.

---

## Etapa 2 — Descoberta de dor por segmento

> [Escolha o bloco do segmento do prospect. Envie a pergunta de revelação
> e aguarde a resposta antes de continuar.]

---

### Restaurante / Lanchonete / Café

```
Deixa eu te perguntar uma coisa que a maioria dos donos de restaurante nunca
parou pra medir:

Quando o movimento está cheio, você consegue ver em tempo real quais mesas
estão esperando há mais tempo — sem precisar perguntar pro garçom?
```

**→ "Não, a gente não tem isso":** perfeito. Continue:
```
Isso é mais comum do que parece. O que acontece normalmente é que a mesa
espera, o cliente fica na dúvida se foi esquecido e o garçom nem sabe a
ordem certa de atender.

Você sente que isso já fez cliente embora sem consumir o que poderia?
```

**→ "Sim, tenho pelo sistema":** entenda qual sistema e o que falta:
```
Que legal! E o sistema que você usa hoje te avisa quando alguma mesa
está parada há mais de X minutos sem pedido?
```

---

### Escola de Educação Infantil / Creche

```
Uma coisa que quase toda coordenadora de escola pequena me fala: quando
abre uma vaga, começa a correria de ligar pra lista de espera uma por uma.

Você passa por isso? Quando uma vaga abre, como você avisa quem está esperando?
```

**→ "A gente liga / manda WhatsApp na mão":**
```
E quantas vezes você tentou e a família não atendeu, e a vaga ficou parada
enquanto outras poderiam ter entrado?

Esse tempo perdido, em média, você diria que é de horas ou de dias?
```

**→ "A gente tem uma lista mas é difícil de gerenciar":**
```
Faz sentido. O problema é que sem o sistema correto, você depende de
alguém lembrar de olhar a lista — e quando a pessoa esquece, a vaga demora
mais para ser preenchida do que deveria.

Você gostaria que isso fosse automático?
```

---

### Mercearia / Mercadinho de Bairro

```
Me faz uma pergunta: quando um produto tá acabando na sua prateleira, quem
percebe primeiro — você, ou o vendedor do fornecedor que aparece toda semana?
```

**→ "O vendedor, porque eu não fico controlando":**
```
Isso é o que acontece na maioria dos mercadinhos. O problema é que você
depende do fornecedor aparecer no momento certo — e quando ele não aparece,
você fica sem estoque sem nem saber.

E quando você fica sem um produto que vende bem, você consegue medir quanto
você deixou de faturar?
```

**→ "Eu que controlo, no caderno / planilha":**
```
Entendo. E quando você está no caixa atendendo cliente e o estoque está
acabando lá atrás, alguém te avisa em tempo real ou você só descobre quando
vai pegar o produto?
```

---

### Barbearia / Salão

```
Deixa eu te perguntar: quando um cliente falta sem avisar e o horário fica
em aberto no meio do dia, o que acontece com aquele tempo?
```

**→ "A gente perde o horário, não tem o que fazer":**
```
E se o sistema avisasse automaticamente outros clientes que estão esperando
que abriu um horário antes do previsto?

Você acha que conseguiria preencher esse horário antes de perder?
```

**→ "A gente tenta ligar pra alguém":**
```
Faz sentido. O problema é que isso toma um tempo que você poderia estar
usando com outro cliente — e muitas vezes não resolve, o horário fica vazio
do mesmo jeito.

Quantas vezes por semana isso acontece?
```

---

### Transporte Escolar

```
Deixa eu te perguntar uma coisa que todo transportador escolar conhece bem:

Quando um pai avisa que o filho não vai hoje, você precisa mudar a rota
manualmente — ou você faz o percurso completo mesmo assim?
```

**→ "Eu faço a rota normal, não dá pra mudar":**
```
Entendo. E você já calculou quanto combustível você gasta por mês indo
buscar crianças que avisaram que não iriam?

Esse custo, em geral, aparece ou fica invisível no dia a dia?
```

**→ "Eu mudo, mas é na cabeça mesmo, de forma manual":**
```
Esse esforço mental no volante é cansativo e caro. Uma saída errada de rota
pode custar 15 minutos — e no transporte escolar, atraso é reclamação de pai.

Você já perdeu algum contrato por causa de imprevisibilidade?
```

---

## Etapa 3 — Gate de qualificação

> [Depois da descoberta de dor, avalie internamente antes de continuar.
> Não precisa verbalizar esse gate para o cliente.]

| Critério | Passa | Estaciona | Rejeita |
|----------|-------|-----------|---------|
| Dor identificada | Clara e específica | Vaga, mas real | Não existe ou é fora do escopo |
| Horizonte de decisão | Até 60 dias | Acima de 60 dias com interesse | Sem intenção declarada |
| Porte do negócio | Compatível com o ticket | A avaliar | Claramente incompatível |
| Maturidade digital | Qualquer nível | — | Resistência total a sistema |

**→ Passa:** avance para Etapa 4.

**→ Estaciona:**
```
[Nome], faz todo sentido. Isso que você está descrevendo é exatamente
o tipo de problema que o sistema resolve — mas eu entendo que agora
pode não ser o momento certo.

Posso te deixar meu contato e quando você estiver avaliando de verdade,
retomamos de onde paramos?
```

**→ Rejeita:** encerre com respeito, sem insistir.

---

## Etapa 4 — Apresentação da solução

> [Não fale em "sistema White Label" nem em "software".
> Fale no resultado concreto para o negócio dele.]

```
[Nome], o que eu faço é criar um sistema com a cara do seu negócio —
nome, logo e cores suas — mas que já vem configurado para resolver
exatamente o que você me descreveu.

No caso do seu [segmento], o que mais faz diferença é:
```

**Completar com o bloco do segmento:**

**Restaurante:**
```
→ Painel de mesas em tempo real para o garçom e para você
→ Alerta automático quando uma mesa passa de X minutos sem atendimento
→ Histórico de pedidos por mesa para o caixa
```

**Educação Infantil:**
```
→ Lista de espera com notificação automática quando abre vaga
→ Controle de mensalidades e vencimentos
→ Comunicação com os pais direto pelo sistema
```

**Mercearia:**
```
→ Alerta automático quando produto chega no estoque mínimo
→ Agendamento de visita do fornecedor a partir do alerta
→ Histórico de saída por produto para você saber o que gira mais
```

**Barbearia:**
```
→ Agenda online com confirmação automática
→ Notificação para lista de espera quando abre horário
→ Histórico de cliente para o barbeiro saber o que ele prefere
```

**Transporte Escolar:**
```
→ Pai avisa ausência → rota recalculada automaticamente
→ Acompanhamento em tempo real para os pais
→ Estimativa de chegada em cada ponto da rota
```

---

## Etapa 5 — Próximo passo

> [Esse é o momento de fechar o próximo passo concreto.
> Não fale em "proposta" ainda — fale em "como ficaria para o seu negócio".]

```
Para eu te mostrar como ficaria o sistema com a cara do seu negócio,
preciso de duas coisas simples:

1. O nome comercial que você quer no sistema
2. Sua logo (pode ser a que você usa no WhatsApp mesmo) e as cores
   principais da sua marca

Me manda isso aqui que eu já monto um exemplo real para você ver.
```

> [Com essas informações, abra o Dossier do nicho e monte a proposta
> conforme `docs/planning/dossies/templates/TEMPLATE_DOSSIE_NICHO.md`.]

---

## Referências

- Gate de qualificação completo: `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`
- Premissa de nicho: `docs/planning/PREMISSA_SOLUCOES_POR_NICHO.md`
- Template do dossier: `docs/planning/dossies/templates/TEMPLATE_DOSSIE_NICHO.md`
- Blueprints por nicho: `ai/produto/blueprints/`
