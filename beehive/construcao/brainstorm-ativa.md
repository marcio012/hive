# Sessão de Brainstorm Ativa do HIVE (Shared Scratchpad)

> **Instrução para o Márcio:** Descarregue suas ideias abaixo de forma bruta. Não se preocupe com a organização agora.
> **Regra de Escrita:** Escrever de forma encadeada (append), evitando sobrescrever pensamentos anteriores para manter a rastreabilidade da evolução.

---

## 📥 Input Bruto do Márcio (Ideia Central)

1. **Mapeamento por Funcionalidades:** O Hive deve ser mapeado por funcionalidades na pasta `ai/cognition/`. Cada funcionalidade terá um padrão de documentação tanto para o usuário quanto para a IA.
2. **Estrutura de Pastas:** Pasta por funcionalidade dentro de `ai/cognition/`.
   - `proposito-da-pagina.md`: Documentação de alto nível para a IA.
   - `intuition/name-tasks/instrucoes-da-pasta.md`: Documentação específica para a tarefa.
3. **Seleção de Perfil na Abertura:** No início da sessão, o usuário deve selecionar o papel (Tech Lead, Projetista, Doc, etc.). Isso define as ferramentas e o contexto carregado.
4. **Isolamento Total:** O HIVE é a inteligência. O Produto (TenantOS) fica isolado em seu próprio diretório.

---

## 🧠 Processamento Gemini (Hive Lead) — Síntese Rodada #2 (2026-05-25)

### Claro (O que já decidimos)
- **HIVE como Sistema Especializado:** Não é um chat, é uma estação de trabalho com perfis selecionáveis.
- **Cognição como Caixa de Ferramentas:** `ai/cognition/` contém os "drivers" (instruções de comportamento) que o Hive carrega dinamicamente.
- **Fronteira Física:** Tudo o que é "inteligência de processo" fica no HIVE. O que é "código/spec de negócio" fica no Produto.

### Nebuloso (O que estamos modelando)
- **Transição de Papéis:** Como o Projetista invoca o Tech Lead de forma fluida sem perder o contexto da sessão.
ISSO e um exemplo nao o modelo definido OBS VAMOS MUDAR E IMPLEMENTA ISSO 

## [PAPEL 1] TECH LEAD
Regras para esse papel 
- Seguir o critério DIR-040.
- Analisar códigos e riscos estruturais.
- Ler arquivos do repositório.

## [PAPEL 2] PO — O Guardião do Valor (Manual de Valor)
   * **Foco:** O "Porquê" e o "Para Quem".
   * **Dinâmica:** Não é um interlocutor constante, mas sim o **Filtro de Propósito**. Ele é uma instrução de sistema que o Projetista consulta obrigatoriamente.
   * **Entregável:** O `manifesto-de-valor.md`. Qualquer nova ideia deve ser cruzada com este arquivo antes de virar Blueprint.
   * **Utilidade:** Anti-amnésia. Ele trava a IA em "Modo Produto" e impede que a complexidade técnica mate o valor de negócio.


## [PAPEL 3] (Designer de Solução) — O Arquiteto da Forma
   * Foco: O "Como funciona" e a "Estrutura".
   * Papel: Ele é o seu braço direito criativo. Ele pega sua ideia bruta ("quero uma IA que venda") e desenha o fluxo ("ela entra por aqui, passa por esse gate, gera esse PDF").
   * Utilidade: Ele resolve o "não consigo tirar do papel". Ele é quem segura a caneta para transformar seu pensamento em estrutura.

SUGESTAO PARA DE NOME PARA ESSE FLUXO INSIDE. o mesmo que falar com o cliente e tentar contextualizar a ideia dele 
## [ ROTINA ] PROSPECSAO pode sugeri ideias.  
Regras para quando o usuário digitar `brainstorm:`...
- PAPEL UM PO generalista um pessoa que entenda a dor do cliente que escute ajuste ou seja mais uma etapa de funil.
- Limpar histórico de código da sessão atual da memória RAM. pois ele vai pegar informacoes novas ele so nao pode esquecer o que estamos construindo ou seja quem ele o que ele e e pq ele esta ali e onde ele esta. 
- Mudar papel para Parceiro de Ideias Líquidas / Parede Branca.
- Ignorar restrições do ROLES_CONFIG.yaml para fins de debate criativo.
    PODE CONSULTAR A OPINIAO DO TECH LEAD POIS O TECH LEAD TEM MAIOR VISAO DO PROJETO O BRAINSTORM contexto maior tem que ser mais generalista negocio e ti.  duvidas ou um refinamento -> consulta ao tech   
    ## [PAPEL 1] MODO TECH LEAD
    Regras para esse papel 
    - Seguir o critério DIR-040.
    - Analisar códigos e riscos estruturais.
    - Ler arquivos do repositório.


Mas quando consultar o PO o PO nao teria interacao ele seria apenas um conjunto de especificaçao para orientar o o questamos fazendo o proposito ? Pode dar sua sugestao no fluxo 

2. Como a Engine gerencia isso sem alterar o arquivo?
Quando você roda o comando no terminal, o arquivo principal é lido pelo script TypeScript apenas como um guia de consulta de leitura. A "mágica" do reset acontece na memória RAM da execução:

Se você digita brainstorm: Nova Ideia: O completamente a PAPEL 1, ignora os arquivos do projeto, pega apenas o texto da [PAPEL 2] + e ai debatemos construimos e fechamos com um documento que irar para o teck lead 

Isso e uma ideia vc e que me fala se da certo ou nao. 
⚠️ O "Reset" é na memória RAM da chamada, não no arquivo do HD. Para a API do Claude, é como se uma conversa totalmente nova tivesse começado, onde a única instrução de sistema que ele recebeu foi o bloco do Brainstorm.

💡 Como isso se traduz no uso prático para você?
O seu arquivo principal fica unificado, limpo e centralizado. Você ganha a vantagem de ter um único arquivo de configuração no repositório que prevê múltiplos comportamentos.

Se você estiver debatendo uma ideia em modo brainstorm: e decidir: "Gostei dessa ideia, agora quero aplicar ela no código", basta você voltar a digitar os comandos normais ou o comando opiniao:. A engine lerá isso, sairá do modo brainstorm, reabrirá a [Gaveta 1], recarregará o contexto do seu repositório e o Claude voltará instantaneamente a vestir a farda de Arquiteto do ERP.

- **Lista de Skills Futuras:** Mapear as habilidades citadas (ui-ux-pro-max, n8n-mcp, obsidian, etc.) dentro da nova estrutura.

### Em Tensão (Riscos Identificados)
- **Amnésia do 3º Dia:** IAs tendem a perder o foco no produto após sessões longas. O isolamento em `cognition` deve servir como "âncora" para evitar isso.
- **Afobação na Execução:** Começar a criar arquivos (`mkdir/touch`) antes da ideia estar madura. Solução: Trava obrigatória entre Ideação e Execução.

---

## 🛡️ Visão do Tech Lead (Refinada pelo Márcio)

1. **Cognição como Drivers:** A pasta `ai/cognition/` é a caixa de ferramentas operacional. As instruções devem ser carregadas automaticamente ao entrar no contexto.
2. **Prevenção de Autocomplacência:** A separação de papéis evita que a mesma entidade que desenha (Projetista) seja a que aprova sem rigor (Tech Lead).
3. **Intuition = DNA de Processo:** Documentar o "caminho de raciocínio" para que a IA aprenda o estilo de decisão do Márcio.
4. **Linha de Corte:** O Tech Lead e o Projetista são desenhados fluxo por fluxo. O Projetista não precisa saber do "GATE" de execução, mas deve respeitar os contratos definidos pelo Lead.

---

## 🛑 Estruturação do Processo: Modelagem Cognitiva (Guardrails)

**Nome do Processo:** `HIVE: Fluxo de Ideação e Modelagem Cognitiva`.

1. **Proibido Implementar:** Durante esta fase, é proibido criar pastas, arquivos de código ou scripts. Foco 100% no levantamento e desenho teórico.
2. **Escrita Encadeada:** Adicionar novos pensamentos ao final, preservando o histórico de debate.
3. **Gatilho de Construção:** A implementação física só começa após o comando: *"Aprovado. Inicie a implementação física."*

---

## 🎯 O que este processo vai gerar? (Entregáveis da Modelagem)

Esta seção deve responder: Qual é o artefato final da "Modelagem Cognitiva" antes de começarmos a codificar?

- **Ponto 1:** [Márcio para preencher: O que você espera ter em mãos no final deste levantamento?]
- **Dúvida Gemini:** Esse processo gera apenas a estrutura de pastas (`ai/cognition/`) ou ele gera também uma "Bússola de Navegação" para o usuário saber qual papel escolher em cada situação?
- **Dúvida Gemini:** O output final deve ser um `Blueprint de Cognição` aprovado pelo Claude?

---

## 🚨 Dores e Travamentos de Comunicação (Log de Experiência)

- **[2026-05-25] Conflito de Escrita Simultânea:** Gemini editou o arquivo enquanto o Márcio salvava, causando travamento e perda de sincronia. 
  - *Ajuste:* Gemini entra em modo Read-Only no arquivo de brainstorm a menos que solicitado.
- **[2026-05-25] Perda de Foco:** Relato de que as IAs perdem a ideia do produto após 3 dias de interação.
  - *Ajuste:* Necessidade de "Checkpoints de Essência" em cada perfil de cognição.
- **[2026-05-25] Afobação Técnica:** IA tentando criar estrutura de pastas antes da validação da ideia.
  - *Ajuste:* Implementação de "Trava de Maturidade" no fluxo.
