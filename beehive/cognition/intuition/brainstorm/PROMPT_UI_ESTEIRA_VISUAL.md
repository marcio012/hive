# Prompt de Design UI — Esteira Visual (HIVE OS)
** thread:** debate-033-prompt-ui
** status:** rascunho-projetista
** data:** 2026-05-29
** responsavel:** Gemini (Projetista)

## 1. Persona e Estética
**Contexto:** O HIVE OS é um Kernel de Inteligência que coordena múltiplos agentes (Claude, Copilot, Gemini). A interface deve parecer um console de comando avançado, industrial e futurista.
**Estética:** Cyber-Industrial / Dark Mode Premium.
**Cores:** Fundo `#050505`, Detalhes `#FFD700` (Amarelo Colmeia), Acentos em Cyan e Esmeralda.

## 2. O Desafio: A Esteira de Processos
Substituir a visão estática de cards por uma **Esteira de Fluxo de Valor** (Horizontal Pipeline).

### Estrutura da Tela:
- **Eixo Y (Linhas):** Processos Ativos (ex: `HIVE-021`, `DEBATE-033`, `TOS-015`).
- **Eixo X (Colunas):** Fases do Ciclo de Vida HIVE:
  1. **Ideação (PO)**
  2. **Arquitetura (Arquiteto)**
  3. **Engenharia (Engenheiro)**
  4. **Auditoria (Auditor)**
  5. **Gate (The Gate)**
  6. **Concluído**

## 3. Comportamento e Feedback Visual
- **Cards de Processo:** Cards compactos que "deslizam" entre as colunas.
- **Estado de Lock:** O card deve brilhar com a cor do agente que detém o lock atual (ex: Roxo para Claude, Laranja para Copilot).
- **Indicadores de Status:** 
  - Pulsando: Atividade em andamento.
  - Sombra Vermelha: Bloqueado/Incidente.
  - Ampulheta: Aguardando parecer/handoff.
- **Animações:** Transições suaves de movimento horizontal (Spring physics).

## 4. Elementos de UI Específicos
- **Header:** Resumo do squad (Tokens totais, Sessão ativa).
- **Empty States:** "Fábrica silenciosa — Nenhuma WO ativa".
- **Toggle:** Botão discreto para alternar entre "Vista de Agentes (Cards)" e "Esteira Visual (Pipeline)".

## 5. Instrução para o Gerador (Claude AI Design)
> "Crie um componente React de alta fidelidade usando Tailwind ou CSS puro. O componente deve renderizar uma tabela de processos futurista onde as colunas representam as fases do HIVE OS. Use um esquema de cores Dark/Gold. Garanta que cada item de processo (linha) mostre claramente qual fase está ativa e qual agente está operando. Adicione um 'glow' sutil nos elementos ativos."

---
*Este rascunho será refinado após o veredito final do DEBATE-033.*
