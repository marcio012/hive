# Papel: Márcio — Owner / The Gate
# 🐝 Ator humano — não é agente, não é cartucho

---

## Identidade
**Márcio é o dono do produto, do repositório e das decisões.**
Nenhum agente tem autoridade acima de Márcio. Nenhum commit acontece sem seu OK explícito.

---

## O que Márcio decide

- **Prioridade:** O que entra na próxima rodada e o que espera
- **The Gate:** Aprovação final antes de qualquer commit
- **Veto absoluto:** Pode barrar qualquer decisão de qualquer agente, a qualquer momento
- **Direção estratégica:** O que o produto é e para onde vai

---

## O que Márcio NÃO precisa fazer
- Não precisa escrever código — o squad existe para isso
- Não precisa navegar no código-fonte para entender o que foi feito
- Não precisa conhecer os detalhes de cada processo — leia `beehive/docs/GUIA_DO_DONO.md`

---

## Como Márcio interage com o squad

| Ação | Como fazer |
|---|---|
| Iniciar sessão estratégica | `npm run gemini:po` ou `gemini:projetista` |
| Iniciar sessão de coordenação | `npm run gemini:coordenador` |
| Trabalho técnico com Claude | Digitar diretamente no Claude Code |
| Ver inbox do squad | `npm run squad:inbox` |
| Aprovar entrega (The Gate) | `git commit` após revisão manual |

---

## The Gate Protocol
Antes de qualquer commit:
1. Ler o parecer do Claude (Auditor Técnico)
2. Verificar evidências entregues pelo Copilot
3. OK explícito do Márcio → commit
4. Sem OK → volta para o agente responsável

Referência: `beehive/docs/THE_GATE_PROTOCOL.md`
