# Handoff Copilot — Issue #90: aprovação manual dispara notificação WhatsApp

**Data:** 2026-05-23
**Issue:** https://github.com/marcio012/white-label-mvp/issues/90
**Epic:** #64 — V2 Agente de Vendas
**Agente executor:** Copilot
**Dependência resolvida:** #65 ✅ (Twilio webhook validado end-to-end)

---

## Contexto

Hoje, quando o platform admin move um lead para `aprovado` no pipeline, nada acontece.
O Agente de Vendas só envia proposta quando o lead responde "SIM" pelo WhatsApp.
Esta issue conecta a ação manual do admin ao disparo automático via `PropostaService.enviarFinal`.

---

## O que fazer

### Único arquivo a alterar

`apps/core/src/platform/platform-leads.service.ts`

### 1. Injetar PropostaService

```typescript
// imports — adicionar:
import { PropostaService } from '../agente-vendas/proposta.service';

// constructor — adicionar PropostaService:
constructor(
  private readonly prisma: PrismaService,
  private readonly propostaService: PropostaService,  // ← adicionar
) {}
```

### 2. Alterar updateGate

O método atual atualiza o gate e retorna. Adicionar o disparo após o update:

```typescript
async updateGate(id: string, dto: UpdatePlatformLeadGateDto): Promise<PlatformLeadDetailResponse> {
  const gate = dto.gate.trim();

  if (!gate) {
    throw new BadRequestException('gate nao pode ser vazio');
  }

  try {
    const lead = await this.prisma.lead.update({
      where: { id },
      data: { gate },
      select: PLATFORM_LEAD_SELECT,
    });

    // ← ADICIONAR ESTE BLOCO:
    if (
      gate === 'aprovado' &&
      lead.gate !== 'proposta_enviada' &&
      lead.telefone
    ) {
      void this.propostaService.enviarFinal(lead.id);
    }

    return this.toDetail(lead);
  } catch (error) {
    // ... resto do catch existente, não mexer
  }
}
```

### 3. Registrar PropostaService no módulo

Verificar se `PlatformModule` já importa `AgenteVendasModule` ou se precisa adicionar `PropostaService` nos providers. Checar `apps/core/src/platform/platform.module.ts`.

---

## Critérios de aceite

- [ ] Mover lead para `aprovado` no pipeline → lead recebe WhatsApp com proposta
- [ ] Se lead não tiver telefone, gate muda normalmente sem erro
- [ ] Não reenviar se `gate` já for `proposta_enviada`

---

## Não mexer

- `PropostaService` já existe e está funcional — só injetar e chamar
- Frontend do pipeline (`#78` — Claude) — nenhuma mudança necessária
- Lógica de envio WhatsApp — não alterar

---

## Referências

- `apps/core/src/agente-vendas/proposta.service.ts` — `enviarFinal(leadId: string)`
- `apps/core/src/platform/platform-leads.service.ts` — `updateGate` (linha ~115)
- `apps/core/src/platform/platform.module.ts` — verificar imports
