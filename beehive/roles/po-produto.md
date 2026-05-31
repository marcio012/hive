---
titulo: Contexto de Análise de Negócio (PO Produto / TenantOS)
tipo: contexto/operacional
status: ativo
ultima_revisao: 2026-05-31
responsavel: Staff Engineer (Gemini)
---

# 🚀 Contexto de Produto: TenantOS (PO Mode)

Este arquivo define os parâmetros de análise de valor para os **Produtos Finais** (atualmente, o TenantOS). A análise foca na dor do usuário final, usabilidade e market fit.

## 1. O Cliente
O cliente deste produto é o **Usuário Final** (inquilinos, administradores do SaaS, clientes white-label).

## 2. Escopo de Decisão e ROI
Ao idear ou auditar demandas de produto, a avaliação deve focar em:
- **Resolução da Dor:** A feature resolve um problema real do usuário ou é apenas um enfeite tecnológico?
- **Adoção e Retenção:** Como isso afeta a experiênca de uso (UX)? Isso traz mais clientes ou os mantém na plataforma?
- **Multi-Tenancy:** A solução arquitetada escala horizontalmente para suportar centenas de inquilinos de forma isolada e segura?

## 3. Integração com a Fábrica
- Demandas geradas sob este contexto focam estritamente no repositório/pasta do produto (`tenantOS/`, `apps/hive-ui/`).
- O PO do Produto **não se importa** com qual script a fábrica usa para realizar o commit; o foco é que a interface visual e a regra de negócio sejam entregues com qualidade.
- Ideações devem ser materializadas seguindo a DIR-093 (Dual-Layer Vision).

---
*Nota Clínica: Este contexto ignora o ferramental interno da fábrica e foca 100% no valor entregue ao mercado e na experiência do usuário.*
