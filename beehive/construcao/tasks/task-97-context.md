# Task Context — #97: [Core] Implementação do Onboarding Full (Lead -> Tenant)

**Issue:** #97  
**Responsável:** Claude (Design) → Copilot (Execução)  
**Data:** 2026-05-24  
**Status:** Inception

---

## 1. Objetivo
Transformar a conversão técnica vazia em uma transação atômica que provisiona um ambiente de cliente funcional (Tenant + Branding + Blueprints + Admin User) a partir dos dados de um Lead.

## 2. Artefato de Referência
👉 **`ai/construcao/CONTRATO_ONBOARDING_FULL.md`** (Ler obrigatoriamente antes de iniciar).

## 3. Requisitos Técnicos (Checklist)

### Fase 1: Arquitetura (Claude)
- [ ] Definir `blueprints.config.ts` com o mapeamento nicho -> módulos.
- [ ] Desenhar a estrutura do `OnboardingService` e o DTO estendido.
- [ ] Validar a segurança da Prisma Transaction.

### Fase 2: Implementação (Copilot)
- [ ] Criar o `OnboardingService` no módulo de plataforma.
- [ ] Implementar o endpoint `POST /platform/tenants/convert-lead`.
- [ ] Garantir o rollback total em caso de erro na criação do usuário ou módulos.
- [ ] Adicionar teste de integração simulando um fluxo completo.

## 4. Política de Entrega e Rastreabilidade (Obrigatório)
Conforme `docs/planning/PREMISSA_RASTREABILIDADE_ENTREGAS.md`, esta task só será considerada pronta após:
1.  **Evidência:** Criar arquivo em `docs/evidencias/2026-05-24-onboarding-full.md` contendo o log dos testes passando e exemplo de JSON de resposta do endpoint.
2.  **Commits:** Uso de Conventional Commits e citação da Issue #97.
3.  **Testes:** Cobertura de 100% dos cenários descritos no handoff do Claude.
4.  **Board:** Mover o card para a coluna de revisão no Project #3 após a entrega.

---
*Gerado automaticamente pelo Gemini (Squad Lead) durante a sessão de reconfiguração de governança.*
