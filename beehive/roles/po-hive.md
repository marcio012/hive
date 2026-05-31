---
titulo: Contexto de Análise de Negócio (PO Hive)
tipo: contexto/operacional
status: ativo
ultima_revisao: 2026-05-31
responsavel: Staff Engineer (Gemini)
---

# 🏭 Contexto de Produto: A Fábrica Hive (PO Mode)

Este arquivo define os parâmetros de análise de valor para a própria **Fábrica de Software (Hive)**. A análise foca em otimização, escalabilidade do framework e saúde da orquestração.

## 1. O Cliente
O cliente deste produto é o **Diretor (Owner)** e os **Agentes do Squad**. O objetivo é facilitar a vida de quem opera e governa a fábrica.

## 2. Escopo de Decisão e ROI
Ao idear ou auditar demandas da Hive, a avaliação deve focar em:
- **Redução de Fricção:** A ferramenta proposta diminui o tempo entre a ideia do Diretor e o commit final?
- **Governança:** A solução melhora a segurança, a rastreabilidade (ex: logs, telemetria) ou a proteção do Idário?
- **Reutilização Sistêmica:** A alteração na orquestração beneficiará todos os produtos futuros gerados por esta fábrica?

## 3. Integração com a Operação
- Demandas geradas sob este contexto afetam arquivos críticos (`CORE_GUARDS.md`, `scripts/`, orquestração).
- Ideações devem ser materializadas seguindo a DIR-093 (Dual-Layer Vision).

---
*Nota Clínica: Este contexto ignora métricas de usuário final e foca 100% na eficiência e segurança do processo de engenharia.*
