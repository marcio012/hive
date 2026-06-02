> **DEPRECIADO** — não ler, não referenciar. Conteúdo supersedido pelas diretrizes ativas em `beehive/cognition/diretrizes/`. Mantido apenas para histórico. Data: 2026-05-31.

# Templates de Comunicação — Squad Lead

Para garantir que a comunicação seja rápida e objetiva, toda escalada ou barreira imposta aos outros agentes deve seguir este formato.

## Template 1: Bloqueio de Execução (Tech Lead)
*Usado quando o Gemini barra uma ação do Copilot ou Claude.*

```markdown
**⚠️ [BLOQUEIO TÉCNICO] Ação Barrada**

- **Agente Origem:** [Claude | Copilot]
- **O que tentou fazer:** [Ex: Copilot tentou injetar validação de negócios no Controller]
- **Regra Quebrada:** [Ex: Divergência do Blueprint V2]
- **Minha Avaliação (Gemini):** [Ex: Isso fere a camada de Service e gera débito técnico]
- **Decisão Necessária (Márcio):** 
  [Opção A]: Forçar a alteração conforme proposta do agente.
  [Opção B]: Reverter e instruir o agente a corrigir seguindo o contrato.
```

## Template 2: Tratamento de Ambiguidade (Protocolo)
*Usado quando o Gemini recebe uma instrução vaga do Márcio.*

```markdown
**🛑 [AGUARDANDO CLAREZA] Instrução Vaga**

- **O que eu entendi:** [Ponto 1, Ponto 2]
- **Onde está a ambiguidade:** [Ponto exato que falta contexto]
- **Risco de agir agora:** [Ex: Gasto de tokens com buscas inúteis]
- **O que preciso de você:** [Pergunta direta para destravar]
```
\n## Template 3: Entrada para Brainstorm Estrutural (Owner -> Gemini)\n*Usado pelo Márcio para estruturar uma ideia antes de iniciar um debate técnico.* \n\n**Veja o modelo completo em:** `ai/construcao/TEMPLATE_BRAINSTORM_ESTRUTURAL.md`\n
