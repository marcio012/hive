# Handoff — #97: Onboarding Full (Lead -> Tenant)

**De:** Claude (Arquiteto)  
**Para:** Copilot (Executor)  
**Data:** 2026-05-24  
**Thread:** brainstorming-platform-admin  
**Issue:** #97  
**Status:** arquivo saneado para leitura estável em CLI

---

## Contexto

Design arquitetural aprovado pelo Márcio. O objetivo desta fase era implementar o onboarding completo de Lead para Tenant, sem decisões abertas de design.

Este arquivo foi **simplificado** para reduzir risco de crash em leitura de CLI:
- removidos blocos longos de TypeScript
- removidos paths legados do tipo `ai/construcao/...`
- mantido apenas o contrato operacional

---

## Escopo original da entrega

Implementar o fluxo completo de conversão:
1. receber um `leadId`
2. criar o `tenant`
3. aplicar módulos do blueprint escolhido
4. criar o usuário admin
5. marcar o lead como convertido

---

## Arquivos-alvo (layout atual)

- `backend/src/platform/blueprints.config.ts`
- `backend/src/platform/dto/convert-lead-to-tenant-full.dto.ts`
- `backend/src/platform/onboarding.service.ts`
- `backend/src/platform/platform.module.ts`
- `backend/src/platform/platform-tenant.controller.ts`

---

## Contrato funcional

### 1. Blueprints

Criar configuração com dois blueprints:
- `SERVICOS`
- `VAREJO`

Cada blueprint materializa uma lista fixa de módulos a serem inseridos em `TenantModulo`.

### 2. DTO de conversão

Criar DTO com os campos:
- `leadId`
- `slug`
- `blueprint`
- `admin.nome`
- `admin.email`
- `branding.corPrimaria` (opcional)
- `branding.logoUrl` (opcional)

### 3. Serviço de onboarding

O serviço deve:
1. buscar o lead
2. falhar se o lead não existir
3. falhar se o lead já estiver convertido
4. gerar senha temporária para o admin
5. fazer a escrita principal dentro de transação

Dentro da transação:
1. criar o tenant
2. inserir os módulos do blueprint em `TenantModulo`
3. criar o usuário admin
4. atualizar o lead para estado `CONVERTIDO`

### 4. Tratamento de conflito

Se houver conflito de slug (`P2002`), retornar erro de conflito com mensagem clara.

### 5. Endpoint

Adicionar endpoint:

- `POST /platform/tenants/convert-lead`

Esse endpoint deve delegar ao `OnboardingService`.

---

## Resultado esperado

Resposta com:
- `tenantId`
- `slug`
- `admin.id`
- `admin.email`
- `admin.senhaTemporaria`

---

## Testes obrigatórios

Cobrir pelo menos:
1. happy path para `SERVICOS`
2. happy path para `VAREJO`
3. rollback em slug duplicado
4. lead inexistente
5. lead já convertido

---

## Restrições

- não criar novo module NestJS
- adicionar ao `PlatformModule` existente
- não fazer leitura prévia de slug só para validar duplicidade
- deixar o erro do banco surfacar e tratar como conflito
- não alterar schema Prisma nesta task

---

## Ponto de parada

Parar antes de push e aguardar OK do Márcio após:
- typecheck OK
- testes OK
- integração implementada

---

## Observação

Se for necessário o conteúdo histórico detalhado, o ideal é consultar os próprios arquivos do backend em vez desta versão arquivada do handoff.
