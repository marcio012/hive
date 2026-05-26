---
titulo: Agente de Vendas V1 — Blueprint de Execução
tipo: blueprint
status: pronto-para-implementacao
ultima_revisao: 2026-05-22
responsavel: Claude - Arquiteto
executor: Copilot - Dev
urgencia: alta — implementar hoje
---

# Agente de Vendas V1 — Blueprint

## Objetivo

Sair hoje com algo funcional que prove o funil de venda do White Label.
Não é a automação completa. É a prova de conceito que valida a ideia e já pode gerar receita.

---

## O que é V1

Uma landing page pública que:
1. Mostra um cliente fictício usando o White Label (prova visual do produto)
2. Coleta o contato de quem se interessar
3. Abre WhatsApp do Márcio com mensagem pré-preenchida
4. Márcio conduz o restante manualmente com script de qualificação

---

## Entregáveis do Copilot hoje

### 1. Landing Page — `/landing` ou domínio separado

**Seções:**

```
[Header]
"Seu sistema personalizado no ar em horas"
Subtítulo: "Solução completa com a cara do seu negócio — sem complicação"
Botão CTA: "Quero ver como fica o meu"

[Seção Demo — O motor]
Título: "Veja um exemplo real"
Mostrar o tenant demo rodando com marca fictícia
Usar o tenant existente: demo / admin@demo.com / admin123
Iframe ou link direto para o sistema com esse tenant ativo
Legenda: "Este é o sistema da [Nome Fictício]. O seu pode estar assim em horas."

[Seção Como funciona]
3 passos simples:
1. Você nos conta sobre seu negócio (5 min)
2. Geramos uma prévia com a sua cara
3. Você decide — sem compromisso

[Formulário de captação]
Campos:
- Nome do negócio (texto)
- Segmento (select: Restaurante | Clínica | Loja | Studio | Outro)
- Seu WhatsApp (telefone)
- [Botão] "Quero minha prévia gratuita"

[Ao submeter o formulário]
Não precisa de backend agora.
Opção A (mais simples): abre wa.me com mensagem pré-preenchida
Opção B: salva em JSON local / localStorage e exibe tela de confirmação

Mensagem pré-preenchida para WhatsApp:
"Olá! Sou [Nome do negócio], tenho um [Segmento] e quero ver como ficaria meu sistema. Vi no site."

[Footer]
WhatsApp direto | "Desenvolvido com White Label MVP"
```

**Stack:**
- Pode ser React (dentro do frontend existente em nova rota `/landing`)
- Ou HTML + Tailwind standalone se for mais rápido
- Prioridade: velocidade de entrega, não perfeição

---

### 2. Demo fictício pré-configurado

Usar o tenant `demo` já existente no sistema.
Se precisar de branding mais apresentável:
- brandName: "Restaurante Mesa Viva"
- tagline: "Sabor e aconchego em cada mesa"
- primaryColor: #C0392B (vermelho restaurante)
- pageBackgroundColor: #FDF6EC
- Usar logo placeholder se não tiver logo real

Objetivo: quando o visitante ver o demo, deve parecer um sistema real de um restaurante de verdade.

---

### 3. Script de qualificação manual (documento)

Criar `docs/sales/script-qualificacao-v1.md`

**Premissa do script:** a qualificação não é coleta de dados. É uma conversa consultiva
que revela ao cliente problemas que ele não sabia que tinha.
O cliente chega na proposta tendo aprendido algo sobre o próprio negócio.
Referência: `docs/planning/PREMISSA_SOLUCOES_POR_NICHO.md`

Estrutura do script:

**1. Abertura consultiva**
Não começar vendendo. Começar perguntando.
"Me conta um pouco do seu dia a dia — o que mais te toma tempo e energia hoje?"

**2. Perguntas de revelação (adaptar por segmento)**
- O que acontece quando [situação crítica do nicho] e você não sabe na hora?
- Quantas vezes por semana você perde tempo com [tarefa repetitiva óbvia do nicho]?
- Seus clientes conseguem te encontrar/acompanhar facilmente quando precisam?
- Se você pudesse eliminar uma dor hoje, qual seria?

**3. Perguntas do gate de qualificação**
Adaptar as 5 perguntas de `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`
após o cliente já ter revelado suas dores.

**4. Síntese consultiva**
Antes de apresentar qualquer solução, devolver o que foi ouvido:
"Pelo que você me contou, o que mais te custa hoje é [X]. E a maioria dos [nicho]
nem percebe isso até parar para medir. Posso te mostrar como outros resolveram?"

**5. Próximo passo**
Pedir logo e cores para gerar a prévia visual do sistema com a cara do cliente.

---

### 4. WhatsApp mock

Número do Márcio configurado em variável de ambiente: `VITE_WHATSAPP_CONTATO`
Link: `https://wa.me/[numero]?text=[mensagem pré-preenchida com dados do form]`

---

## O que NÃO entra hoje

- Automação de qualificação (chatbot)
- Geração automática de dossier
- Motor de orçamento automatizado
- Claude.ai Designer automatizado (Márcio faz manualmente na V1)
- Canal de aprovação por WhatsApp (Márcio opera manualmente)
- Múltiplos tenants criados pelo formulário

---

## Fluxo manual do Márcio (pós-landing)

```
1. Notificação chega no WhatsApp (mensagem do formulário)
2. Márcio usa o script de qualificação (docs/sales/script-qualificacao-v1.md)
3. Coleta: nome, segmento, dor principal, logo, cores
4. Cola as respostas no Claude Code → Claude gera o dossier
5. Claude calcula orçamento com base nos blueprints
6. Márcio roda prompt no Claude.ai Designer → gera mockup
7. Márcio monta PDF (ou Claude monta)
8. Márcio envia proposta pelo WhatsApp
9. Prospect aprova → Copilot cria o tenant real no sistema
```

---

## Critério de aceite da V1

- [ ] Landing page abre no browser
- [ ] Demo fictício visível e com cara de sistema real
- [ ] Formulário funciona e abre WhatsApp com mensagem pré-preenchida
- [ ] Script de qualificação existe e está pronto para uso
- [ ] Márcio consegue simular o fluxo completo manualmente do zero

---

## Referências

- Tenant demo existente: `demo / admin@demo.com / admin123`
- Gate de qualificação: `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`
- Contrato visual: `docs/schema/CAPTACAO_VISUAL_CLIENTE_V1.md`
- Premissa do produto: `docs/planning/PREMISSA_SOLUCOES_POR_NICHO.md`
- Contexto completo da ideia: `ai/produto/agente-vendas-ideia-viva.md`
- Handoff de contexto: `ai/construcao/handoff-agente-vendas-contexto-copilot.md`
- Layout de referência: Claude.ai Designer (compartilhar quando disponível)
