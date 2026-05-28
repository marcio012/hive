# Discovery de Produto — HIVE OS: Web Interface (O Dashboard do Kernel)
** thread:** hive-web-ui-discovery
** status:** em-concepcao-visual
** data:** 2026-05-28
** responsavel:** Gemini (PO)

## 1. Visão Geral: O Terminal Evoluído
Não é apenas um site, é o **Console de Comando do HIVE**. A interface deve parecer um "Sistema Operacional de Inteligência", com feedback visual imediato para cada ação dos agentes no diretório `beehive/`.

## 2. Experiência do Usuário (UX) — As 4 Camadas de Tela

### 📺 Tela A: O Funil de Intenção (Ideation Hub)
- **Visual:** Um chat minimalista à esquerda e um "Quadro de Insights" à direita.
- **Interação:** Conforme você digita, a IA (Gemini) extrai "pílulas" de insights que flutuam para o quadro.
- **Valor:** Visualizar a "digestão" da ideia em tempo real.

### 🏭 Tela B: O Mapa da Fábrica (Pipeline View)
- **Visual:** Uma visão linear ou circular dos **7 Canos (Canos da Topologia)**.
- **Animação:** Quando o Copilot começa a codificar, o "Cano de Construção" deve pulsar ou mostrar fluxo de dados.
- **Agente HUD:** Um pequeno card flutuante sobre o cano ativo mostrando a "cara" do agente (Claude/Copilot/Gemini) e o que ele está lendo/escrevendo agora.

### 🛡️ Tela C: O Centro de Comando (Governance & Gate)
- **Visual:** Painel de "Check de Saúde" com medidores de:
  - Cobertura de Testes.
  - Alinhamento com o Manifesto (Score de Valor).
  - Custo Financeiro Acumulado.
- **O Botão:** Um botão físico de "DEPLOY/COMMIT" protegido por confirmação biométrica simulada ou MFA.

### 📦 Tela D: O Gerenciador de Obra (Product Browser)
- **Visual:** Uma árvore de arquivos inteligente do produto (ex: TenantOS).
- **Destaque:** Arquivos modificados recentemente brilham ou têm marcas de "validado pelo Claude".
- **Narrativa:** Ao clicar em um arquivo, abre-se uma lateral com a "História" daquele arquivo (Por que ele existe e qual ID de backlog o criou).

---

## 3. Identidade Visual (Estética HIVE)
- **Estilo:** "Cyber-Industrial" / "Dark Mode Premium".
- **Cores:**
  - Fundo: `#050505` (Preto absoluto).
  - Primária: `#FFD700` (Amarelo Colmeia / Ouro).
  - Secundária: `#1A1A1A` (Cinza carvão).
  - Status: Azul Cyan (Arquitetura), Verde Esmeralda (Sucesso), Vermelho Alerta (Bloqueio).
- **Componentes:** Bordas finas, sombras neon sutis (glow), tipografia monospace para dados e sans-serif para narrativa.

---

## 4. O Diferencial Tecnológico (Real-time Reflection)
A Web UI deve ser um **espelho do Sistema de Arquivos**:
- Se você criar um arquivo no VS Code, a Web UI detecta e atualiza o mapa.
- Se o Claude trava em um debate, a tela de "Debate" no navegador fica vermelha e mostra o motivo do bloqueio.

---
**ESTADO ATUAL:** Intenção de Web UI mapeada.
**PRÓXIMO PASSO:** Handoff para o Projetista desenhar o Protótipo (React + Vanilla CSS).
**AÇÃO ESPERADA:** Márcio, essa "vibe" de console de comando cibernético com amarelo e preto faz sentido para o HIVE? Ou você imagina algo mais "Clean/Enterprise"?
