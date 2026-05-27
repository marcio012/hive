# Processo Simplificado — Hive Framework
**Data:** 2026-05-26 | **Versão:** 2.0 — Escala Solo

Este documento substitui o fluxo de 7 canos para o contexto de operação solo (1 owner + squad de IAs).
O processo completo de 7 etapas continua válido para mudanças estruturais críticas.

---

## O Princípio: 3 Níveis de Processo

A pergunta que determina o nível é sempre a mesma:
> **"Se eu errar aqui, o quanto é difícil voltar atrás?"**

---

## Nível 1 — Execução Direta
**Quando usar:** Bug fix, ajuste de estilo, texto, config, feature pequena e reversível.
**Critério:** Erro é fácil de reverter em < 10 minutos.

```
Descrição curta do que vai fazer
         ↓
    Copilot executa
         ↓
    The Gate (OK do Márcio)
         ↓
        Commit
```

**Artefato necessário:** Nenhum. Descrição no commit é suficiente.

---

## Nível 2 — Feature com Blueprint
**Quando usar:** Nova funcionalidade de negócio, endpoint novo, nova entidade no banco.
**Critério:** Erro exige refatoração de 1+ hora ou pode quebrar dados.

```
Work Order (spec + critério de aceite)
         ↓
    Copilot executa
         ↓
    Claude revisa (opcional: apenas se tiver risco arquitetural)
         ↓
    Evidência (arquivo em docs/evidencias/)
         ↓
    The Gate (OK do Márcio)
         ↓
        Commit
```

**Artefato necessário:** Work Order com: objetivo, spec técnica, critérios de aceite.
**Template:** `beehive/construcao/templates/STATUS_REPORT_TEMPLATE.md`

---

## Nível 3 — Decisão Arquitetural (Processo Completo)
**Quando usar:** Troca de banco, novo serviço, mudança de autenticação, migração de módulo.
**Critério:** Erro tem impacto irreversível ou afeta segurança/dados de produção.

```
Debate entre agentes (DEBATE-NNN.md)
         ↓
    Veredito consolidado
         ↓
    Blueprint aprovado
         ↓
    Work Orders por módulo
         ↓
    Execução por lotes
         ↓
    Evidência obrigatória (narrativa + diagrama)
         ↓
    The Gate (OK do Márcio)
         ↓
        Commit
```

**Artefatos necessários:** Debate + Blueprint + Work Orders + Evidência.

---

## Tabela de Decisão Rápida

| Situação | Nível | Tempo estimado de processo |
|----------|-------|---------------------------|
| Corrigir texto, CSS, label | 1 | 0 min |
| Adicionar campo no formulário | 1 | 0 min |
| Novo endpoint simples | 2 | 15 min |
| Nova entidade no banco | 2 | 20 min |
| Novo módulo completo (ex: Estoque) | 3 | 1-2h |
| Troca de framework/banco/auth | 3 | 2-4h |
| Migração de sistema legado | 3 | planejamento extenso |

---

## The Gate — permanece obrigatório em TODOS os níveis

Independente do nível, **nenhum commit entra sem o OK do Márcio**.
Isso não é burocracia — é a única proteção real contra erros irreversíveis em produção.

O Gate no nível 1 é simples: "Fiz X. Commit?" → OK → commit.
O Gate no nível 3 é formal: relatório completo + veredito.

---

## O que foi eliminado vs o que foi preservado

| Processo | Status | Motivo |
|----------|--------|--------|
| 7 Canos para features simples | ❌ Eliminado | Overhead maior que o risco |
| Narrativa + 2 diagramas para cada entrega | ❌ Eliminado | Obrigatório apenas no nível 3 |
| The Gate Protocol | ✅ Preservado | Proteção crítica, custo mínimo |
| Debates para decisões arquiteturais | ✅ Preservado | ROI positivo |
| Rastreabilidade (DEBATE-NNN, BLUEPRINT) | ✅ Preservado | Memória de longo prazo |
| Evidências em docs/evidencias/ | ✅ No nível 2+ | Prova objetiva de entrega |

---
*Este documento não revoga o processo completo — ele define quando aplicar cada nível.*
