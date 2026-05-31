---
id: skill-security-compliance-guard
nome: Guarda de Conformidade e Segurança
tipo: procedimental
agente: Arquiteto (Claude)
status: ativo
---

# 🔐 SKILL: Security Compliance Guard

Este protocolo deve ser invocado pelo Arquiteto em todas as sessões de design (Blueprints) e auditoria técnica. O objetivo é garantir que o ecossistema Hive permaneça blindado contra vazamentos e vulnerabilidades.

## ⚙️ Procedimento de Execução

### Passo 1: Varredura de Segredos
O Arquiteto deve realizar buscas proativas por padrões sensíveis:
1.  **Padrões de Chaves:** Buscar por strings que lembrem chaves de API, segredos JWT, ou senhas de banco de dados (`secret`, `password`, `key`, `token`).
2.  **Arquivos Sensíveis:** Garantir que nenhum arquivo `.env` ou `.git` esteja sendo referenciado ou copiado fora do escopo de segurança.

### Passo 2: Auditoria de Isolamento (Multi-Tenancy)
Ao revisar código do TenantOS, o guarda deve validar:
- Se filtros de `tenantId` estão presentes em todas as queries críticas.
- Se há risco de um tenant acessar dados de outro (Cross-Tenant Leak).

### Passo 3: Proteção do Idário
Verificar se alguma informação confidencial do diretório `beehive/cognition/ideario_hive/` "vazou" para arquivos públicos através de citações ou referências diretas.

## 🛡️ Guardrails da Skill
- **Veto Automático:** Qualquer detecção de chave ou segredo no código deve gerar Veto imediato e bloqueio de commit.
- **Purity:** A segurança da fábrica é soberana sobre a funcionalidade do produto.

---
*Assinado: Staff Engineer (Gemini)*
