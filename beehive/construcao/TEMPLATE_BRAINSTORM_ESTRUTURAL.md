# Template: Entrada para Brainstorm Estrutural

> **Propósito:** Facilitar a comunicação do Owner (Márcio) com o Gemini CLI para iniciar um debate de ideação técnica ou arquitetural. Use este formato para organizar os pensamentos antes de acionar o modo `brainstorm:`.
> **Onde preencher:** Você pode copiar este bloco, preencher em um rascunho rápido e colar no terminal, ou salvar como um arquivo local temporário e pedir para o Gemini ler.

---

```markdown
brainstorm: [Nome Curto da Ideia / Tema Central]

## O que eu quero resolver (Dores / Oportunidades)
- [Ponto 1: Ex: O processo atual é muito manual e custoso]
- [Ponto 2: Ex: Precisamos de uma forma de plugar novos clientes sem mexer no código core]

## Como eu imagino que vai funcionar (Visão Bruta)
- [Descreva o fluxo ideal de forma solta. Não se preocupe com arquitetura perfeita aqui. Ex: O usuário entra, clica num botão e a IA faz o resto no background.]

## O que é inegociável (Premissas e Restrições)
- [Ex: Tem que ser isolado por Tenant]
- [Ex: O custo de infraestrutura não pode passar de X]

## O que eu não sei ainda (Dúvidas abertas)
- [Ex: Qual a melhor estratégia de banco de dados para isso?]
- [Ex: Vale a pena trazer o Claude para esse fluxo agora ou resolvemos no código?]

```

---

### Como o Gemini vai responder:

Ao receber essa estrutura com o prefixo `brainstorm:`, o Gemini não tomará decisões nem escreverá código. Ele aplicará o **Modo Brainstorm** e retornará um mapa consolidado nos seguintes blocos, preparando o terreno para uma futura `Issue` ou escala para o Claude (Arquiteto):

1. **Claro:** O que já é sólido na sua ideia.
2. **Nebuloso:** O que precisa de mais definição.
3. **Em Tensão:** Conflitos aparentes (ex: rapidez vs. custo).
4. **Escalar para o Claude:** Perguntas formais de arquitetura derivadas do seu brainstorm.
