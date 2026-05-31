---
titulo: Core Guards (Regras Vitais de Segurança e Governança)
tipo: governanca/seguranca
status: ativo
ultima_revisao: 2026-05-31
responsavel: Diretor (Márcio) | Staff Engineer (Gemini)
---

# 🛡️ CORE GUARDS — Hive Framework

Este arquivo contém as regras de **Vida ou Morte** do ecossistema. Estas regras devem ser respeitadas por todos os agentes em todas as sessões. O descumprimento destas regras é considerado uma falha sistêmica crítica.

---

## 1. Segurança e Isolamento
- **Independência de Contexto:** IAs de execução nunca recebem o diretório `hive/` ao atuar em produtos. Elas operam apenas sobre o código da obra alvo.
- **Sigilo de Ideação:** O diretório `beehive/cognition/ideario_hive/` é de acesso exclusivo do Diretor e do Staff Engineer. Claude e Copilot estão terminantemente proibidos de ler esta área.
- **Protocolo de Segredos:** Credenciais e chaves NUNCA entram no repositório.

## 2. Governança de Qualidade
- **Veto do Arquiteto:** O Arquiteto (Claude) DEVE bloquear qualquer implementação que divirja dos contratos ou blueprints aprovados.
- **Contratos Obrigatórios:** Nenhuma implementação inicia sem um arquivo de contrato técnico validado.
- **Rigor de Cano (DIR-091):** Proibido pular fases (Ideação -> Debate -> Blueprint -> Implementação -> SR).

## 3. Arquitetura de Cognição
- **Role vs Process (DIR-060):** As regras de Papel (Como a IA pensa) são independentes das regras de Processo (O que a IA faz). O Processo sempre invoca o Papel.
- **DIR-093 — Dual-Layer Vision:** Todo artefato estratégico deve ter duas versões:
    1. **HUMANA (`_HUMANO.md`):** Propósito, mística e inspiração para o Diretor.
    2. **CLÍNICA (`_CLINICAL.md`):** Lógica, restrições e diagramas para a IA.

## 4. Padrões de Operação
- **The Gate:** Nenhuma IA possui autoridade de commit final. O `push` é soberania exclusiva do Diretor.
- **Higiene de Contexto:** Ler apenas o necessário. Proibido carregar arquivos legados inteiros sem necessidade imediata.
- **Saída Operacional (DIR-085):** Encerrar sempre com Estado Atual, Próximo Passo e Ação Esperada.

---
*Assinado: Staff Engineer (Gemini)*
