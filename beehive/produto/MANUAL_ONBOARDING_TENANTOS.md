# 📘 Manual Técnico: Onboarding Service (TenantOS)

**Data:** 2026-05-25  
**Responsável:** Gemini 3.5 Auto (Hive Tech Lead)  
**Escopo:** `produto/tenantOS/backend`  

---

## 🛠️ Visão Técnica (Dev Tone)

O `OnboardingService` é o motor atômico responsável por transformar um Lead qualificado em um Tenant operacional. Ele deve ser utilizado sempre que uma venda for fechada.

### 1. Localização
- **Service:** `src/platform/onboarding.service.ts`
- **DTO:** `src/platform/dto/convert-lead-to-tenant-full.dto.ts`
- **Testes:** `src/platform/onboarding.service.spec.ts`

### 2. Contrato de Entrada (DTO)
```typescript
{
  leadId: string;        // ID do Lead qualificado
  slug: string;          // Slug único (ex: 'pizzaria-do-jorge')
  blueprint: string;     // 'VAREJO' | 'SERVICOS'
  admin: {
    nome: string;
    email: string;       // Será o login do proprietário
  };
  branding?: {           // Opcional
    corPrimaria: string;
    logoUrl: string;
  };
}
```

### 3. Mecânica de Transação (Atomicidade)
O serviço executa uma **Prisma Transaction**. Se qualquer passo falhar, o banco sofre rollback total:
1.  **Criação de Tenant:** Registra os dados básicos e branding.
2.  **Ativação de Módulos:** Lê de `blueprints.config.ts` e injeta os módulos correspondentes.
3.  **Criação de Usuário Admin:** Gera um usuário com tipo `admin` vinculado ao novo Tenant.
4.  **Encerramento de Lead:** Muda o estado do Lead para `CONVERTIDO` e o gate para `closed_won`.

---

## 🐝 Visão Operacional (Hive Lead Tone)

### 1. Quando acionar este serviço?
Este serviço deve ser chamado pelo **Agente de Vendas** ou pelo **Dashboard Admin** assim que o Márcio (Owner) clicar em "Aprovar Proposta".

### 2. Segurança de Senha
O serviço gera uma **Senha Temporária** segura (10 caracteres, Base64). 
- **Onde ela vai?** Ela é retornada no objeto de resposta do método.
- **Ação Obrigatória:** O Agente/Sistema deve capturar essa senha e enviá-la IMEDIATAMENTE para o cliente (via WhatsApp), pois ela não fica salva em texto plano no banco de dados.

### 3. Tabela de Blueprints Ativos
| Blueprint | Módulos Injetados |
| :--- | :--- |
| **VAREJO** | PDV, Estoque, Pedidos, Vendas |
| **SERVICOS** | Agendamentos, Clientes, Vendas |

### 4. Tratamento de Erros Comuns
- **Conflito de Slug (409):** Ocorrerá se o nome do negócio já estiver sendo usado por outro tenant.
- **Lead Já Convertido (409):** Proteção contra disparos duplicados do botão de aprovação.

---
*Assinado: Hive Tech Lead — Garantindo o crescimento escalável do TenantOS.*
