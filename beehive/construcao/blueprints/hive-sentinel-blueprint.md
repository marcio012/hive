# Blueprint: HIVE SENTINEL (Integrity & Governance)
**Status:** Proposto (Aguardando Aprovação Tech Lead/Owner)
**Tipo:** Ferramenta de Infraestrutura de Orquestração
**Vínculo:** SANEAMENTO_GOVERNANCA_20260526.md

---

## 1. 🎯 Objetivo
Automatizar a fiscalização das "Regras de Ouro" da Colmeia, garantindo que o estado do Kernel (`beehive/config/`) esteja sempre em sincronia com o estado da Obra e que nenhuma entrega falte com o rigor de evidências.

## 2. 🏗️ Arquitetura Técnica

### 2.1 Ponto de Entrada
- **Comando:** `npm run hive:check` (ou `bash beehive/bin/hive-check.sh`)
- **Frequência sugerida:** Início de sessão e pré-gate.

### 2.2 Módulos de Verificação (Os 4 Pilares)

#### A. Pilar de Rastreabilidade (Evidence Guard)
- **Lógica:** Se `SQUAD_ACTIVE_ISSUE` estiver definida, buscar em `beehive/docs/evidencias/` um arquivo que contenha o ID da issue no nome ou no corpo.
- **Falha:** Bloqueia a execução do `squad:gate`.

#### B. Pilar de Sincronia de Kernel (Kernel Sync)
- **Lógica:** Comparar `SQUAD_ACTIVE_ISSUE` em `beehive/config/config.env` com `ACTIVE_ISSUE` em `.hive-agent/session-state.env`.
- **Ação:** Se divergentes, perguntar ao usuário qual é a correta e atualizar ambos os arquivos.

#### C. Pilar de Alinhamento de Agentes (DIR-035 Audit)
- **Lógica:** Verificar se a data de `ultima_revisao` em `beehive/cognition/diretrizes.md` é posterior à última leitura registrada nos arquivos de contexto dos agentes (`.claude/`, `.copilot/`, `.gemini/`).
- **Ação:** Sinalizar necessidade de `squad:sync` se os agentes estiverem com diretrizes obsoletas.

#### D. Pilar de Saúde de Ambiente (System Ping)
- **Lógica:** Tentar conexão nas portas `3000` (Core) e `5000` (Legado).
- **Ação:** Reportar se algum serviço essencial estiver offline.

## 3. 📜 Contrato de Interface (Saída Esperada)

```text
🐝 HIVE SENTINEL - Integridade do Sistema
-----------------------------------------
[PASS] Sincronia de Kernel (Issue #97)
[WARN] Evidências: Nenhuma evidência encontrada para #97!
[FAIL] Agentes: Claude está com diretrizes desatualizadas (DIR-035).
[PASS] Ambiente: Core (:3000) e Legado (:5000) ativos.
-----------------------------------------
Status Final: ⚠️ ALERTA DE GOVERNANÇA
```

## 4. 🛠️ Plano de Implementação
1. Criar `beehive/bin/hive-check.sh`.
2. Integrar chamada no `beehive/bin/hive-gate.sh`.
3. Adicionar script ao `package.json` raiz.

---
## 🛡️ Parecer do Tech Lead
"Esta ferramenta elimina o 'fator humano' na burocracia do framework, transformando diretrizes passivas em travas ativas de software."
