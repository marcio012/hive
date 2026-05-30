# Prompt de Design UI — Esteira Visual (HIVE OS)
** thread:** debate-033-prompt-ui
** status:** pronto-para-prototipo
** data:** 2026-05-29
** responsavel:** Gemini (Projetista)

## 1. Persona e Estética
**Contexto:** O HIVE OS é um Kernel de Inteligência que coordena múltiplos agentes (Claude, Copilot, Gemini). A interface deve parecer um console de comando avançado, industrial e futurista.
**Estética:** Cyber-Industrial / Dark Mode Premium.
**Cores:** Fundo `#050505`, Detalhes `#FFD700` (Amarelo Colmeia), Acentos em Cyan e Esmeralda.

## 2. A Esteira de Processos (Horizontal Pipeline)
Substituir a visão estática de cards por uma **Esteira de Fluxo de Valor**.

### Estrutura da Tabela de Fluxo:
- **Eixo Y (Linhas / Lanes):** Itens de trabalho ativos:
  - **Work Orders (HIVE-NNN / TOS-NNN):** Cards de tarefas técnicas.
  - **Debates (DEBATE-NNN):** Cards de discussões estratégicas.
  - **Status Reports (SR-NNN):** Cards aguardando afirmação do Owner.

- **Eixo X (Colunas / Fases):** 
  1. **Arquitetura:** Itens em fase de spec ou debate com Claude.
  2. **Execução:** Itens com lock ativo de Copilot ou em implementação.
  3. **Auditoria:** Itens em revisão técnica pelo Claude.
  4. **Gate:** Itens aguardando validação final do Márcio (The Gate).
  5. **Concluído:** Itens com SR afirmado (saída elegante à direita).

## 3. Comportamento e Feedback Visual (Micro-interações)
- **O Card Ativo:** Pequenos cards retangulares que deslizam entre colunas.
- **Identidade do Agente (Lock):** O card deve ter uma borda ou "glow" na cor do agente que detém o lock:
  - **Laranja:** Copilot (Engenharia)
  - **Roxo:** Claude (Arquitetura/Auditoria)
  - **Cyan:** Gemini (PO/Planning)
  - **Dourado:** Márcio (Soberano)
- **Status do Movimento:** 
  - **Pulsando:** Trabalho em andamento (lock ativo).
  - **Estático (Ghost):** Aguardando ação (handoff pendente).
  - **Alerta (Sombra Vermelha):** Incidente ativo no sistema (`error-state.json`).
- **Heurística de Posição:** O card "sabe" onde estar baseado no `lock`, `inbox` e status do debate.

## 4. Elementos de UI Complementares
- **Header Operacional:** Indicador de saúde do sistema (OK / Alerta) e contador de tokens da sessão.
- **Empty State:** "Silêncio na Colmeia — Nenhuma atividade detectada na esteira."
- **Toggle de Vista:** Alternância fluida entre "Agentes" (cards por pessoa) e "Processo" (esteira).

## 5. Instrução para o Gerador (Claude AI Design)
> "Crie um componente React (`EsteiraPorProcesso.tsx`) usando Tailwind. O componente deve renderizar um grid horizontal futurista (CSS Grid). As linhas são os itens ativos e as colunas são as fases do HIVE. Os cards de processo devem ter animações de entrada e transição horizontal suaves. Use um tema ultra-dark com detalhes em dourado metálico. Adicione um efeito de vidro (glassmorphism) sutil nos cards e brilhos neon (glow) para indicar qual agente está com o lock."

---
*Prompt finalizado por Gemini (Projetista) conforme veredito do DEBATE-033.*

