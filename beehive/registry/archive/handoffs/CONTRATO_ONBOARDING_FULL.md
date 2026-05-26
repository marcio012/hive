# Contrato de Onboarding Full — Especificação Técnica

**Status:** Draft / Proposto  
**Data:** 2026-05-24  
**Responsável:** Gemini (Auxiliar Técnico)  
**Objetivo:** Eliminar o "vão" entre o fechamento da venda (Lead) e a operação do sistema (Tenant).

---

## 1. Visão Geral

O processo de conversão **Lead -> Tenant** deixa de ser uma simples criação de registro e passa a ser uma **transação atômica** que configura o ambiente completo do cliente em um único clique.

## 2. O Contrato de Conversão (DTO)

Para garantir que o Onboarding seja completo, o endpoint de conversão deve receber:

```typescript
interface ConvertLeadToTenantFullDto {
  leadId: string;           // Origem dos dados
  slug: string;             // URL do tenant (ex: petshop-joao)
  blueprint: 'SERVICOS' | 'VAREJO'; // Define o set de módulos
  admin: {
    nome: string;           // Nome do primeiro usuário
    email: string;          // E-mail de login (pode vir do lead)
  };
  branding?: {
    corPrimaria?: string;   // Se omitido, usa padrão do nicho
    logoUrl?: string;       // Se omitido, usa do lead ou padrão
  };
}
```

## 3. Mapeamento de Blueprints (Módulos)

O `OnboardingService` deve injetar automaticamente os seguintes módulos via `TenantModulo`:

### Blueprint: SERVICOS
*Indicado para: Salões, Clínicas, Personal Trainers.*
*   `modulo-agenda`
*   `modulo-clientes`
*   `modulo-servicos`
*   `modulo-vendas` (Financeiro básico)

### Blueprint: VAREJO
*Indicado para: Restaurantes, Mercearias, Lojas.*
*   `modulo-pdv`
*   `modulo-estoque`
*   `modulo-pedidos`
*   `modulo-vendas`

---

## 4. O Fluxo Atômico (OnboardingService)

O serviço deve executar as seguintes etapas dentro de uma **Prisma Transaction**:

1.  **Validar Disponibilidade:** Checar se o `slug` está livre.
2.  **Criar Tenant:** Inserir na tabela `Tenant` com os dados de branding.
3.  **Configurar Módulos:** Inserir registros na tabela `TenantModulo` conforme o `blueprint` escolhido.
4.  **Criar Usuário Admin:** 
    *   Gerar senha temporária.
    *   Criar usuário com `tipo: 'admin'`.
    *   Vincular ao `tenant_id` recém-criado.
5.  **Vincular e Encerrar Lead:**
    *   `lead.tenant_id = tenant.id`
    *   `lead.estado = 'CONVERTIDO'`
    *   `lead.gate = 'closed_won'`

---

## 5. Interface do Platform Admin (UX)

Quando o Márcio clica em "Converter" no Pipeline, o painel deve abrir um **Resumo de Pré-onboarding**:

*   **Identidade:** "Vou pintar o sistema de [Cor] e usar a logo [Imagem]."
*   **Capacidade:** "Vou ativar os módulos de [Blueprint]."
*   **Acesso:** "O convite será enviado para [E-mail/WhatsApp]."
*   **Preview:** Um pequeno card mostrando como o login do cliente vai ficar.

---

## 6. Critérios de Aceite para Implementação

- [ ] A conversão falha (rollback total) se qualquer etapa (ex: criação de usuário) falhar.
- [ ] O tenant criado deve conseguir logar imediatamente com a senha temporária.
- [ ] O sistema já deve exibir os módulos corretos no menu lateral após o login.
- [ ] O `branding_cor_primaria` deve estar refletido no CSS do painel do tenant.

---

## Fontes Relacionadas
- `apps/core/prisma/schema.prisma` (Entidades: Lead, Tenant, TenantModulo, Usuario)
- `apps/core/src/platform/platform-tenant.service.ts` (Implementação parcial atual)
- `ai/produto/blueprints/agente-vendas-v2-blueprint.md` (Processo comercial)
