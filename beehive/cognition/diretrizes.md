---
titulo: Índice de Diretrizes (Biblioteca de Governança)
tipo: governanca/referencia
status: ativo
ultima_revisao: 2026-05-31
responsavel: Staff Engineer (Gemini)
---

# 📚 Biblioteca de Diretrizes — Hive

Este arquivo é um índice de referência. Para regras de execução obrigatória em tempo real, consulte o arquivo **`CORE_GUARDS.md`**.

---

## 🚦 Fontes de Verdade
1. **Regras Vitais (Core):** `beehive/cognition/CORE_GUARDS.md`
2. **Histórico Completo (Vade Mecum):** `beehive/cognition/registry/DIRETRIZES_ATIVAS.md`

---

## 📋 Sumário de Diretrizes (DIR)

| ID | Título | Onde consultar |
|---|---|---|
| DIR-001 | Escopo Padrão | `DIRETRIZES_ATIVAS.md` |
| DIR-040 | Governança V2 (Papéis) | `DIRETRIZES_ATIVAS.md` |
| DIR-060 | Role vs Process | `CORE_GUARDS.md` |
| DIR-085 | Saída Operacional | `CORE_GUARDS.md` |
| DIR-090 | Taxonomia de Falhas | `DIRETRIZES_ATIVAS.md` |
| DIR-091 | Rigor de Cano | `CORE_GUARDS.md` |
| DIR-092 | Márcio como Agente Ativo | `DIRETRIZES_ATIVAS.md` |
| **DIR-093** | **Dual-Layer Vision** | `CORE_GUARDS.md` |
| **DIR-094** | **Isolamento de Papel por Sessão** | `CORE_GUARDS.md` |


## 🏗️ Normas de Implementação

### Documentação de Scripts Shell (.sh)
Todos os scripts localizados em `beehive/bin/` devem conter um cabeçalho de documentação padrão logo após o shebang (`#!/usr/bin/env bash`):

```bash
# ==============================================================================
# SCRIPT: <FILENAME>
# FINALIDADE: <Descrição concisa do propósito do script>
# CONTEXTO: <Referência a WO, Debate ou contexto sistêmico>
# ==============================================================================
```

---
**Instrução para IAs:** Não carregue o arquivo de histórico completo (`DIRETRIZES_ATIVAS.md`) a menos que precise consultar o texto detalhado de uma regra específica via `read_file`. Priorize sempre o `CORE_GUARDS.md`.
