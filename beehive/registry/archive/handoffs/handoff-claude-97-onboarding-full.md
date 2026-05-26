# Handoff — #97: Onboarding Full (Lead → Tenant)

**De:** Claude (Arquiteto)
**Para:** Copilot (Executor)
**Data:** 2026-05-24
**Thread:** brainstorming-platform-admin
**Issue:** #97

---

## Contexto

Design arquitetural aprovado pelo Márcio. Copilot implementa a Fase 2 sem decisões de design pendentes — contrato fechado.

Referência: `ai/construcao/CONTRATO_ONBOARDING_FULL.md`

---

## Arquivos a criar

### 1. `apps/core/src/platform/blueprints.config.ts`

```typescript
export const BLUEPRINTS = {
  SERVICOS: ['modulo-agenda', 'modulo-clientes', 'modulo-servicos', 'modulo-vendas'],
  VAREJO:   ['modulo-pdv', 'modulo-estoque', 'modulo-pedidos', 'modulo-vendas'],
} as const;

export type BlueprintKey = keyof typeof BLUEPRINTS;
```

---

### 2. `apps/core/src/platform/dto/convert-lead-to-tenant-full.dto.ts`

```typescript
import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BlueprintKey } from '../blueprints.config';

export class ConvertLeadAdminDto {
  @IsString() @IsNotEmpty() nome: string;
  @IsEmail() email: string;
}

export class ConvertLeadBrandingDto {
  @IsOptional() @IsString() corPrimaria?: string;
  @IsOptional() @IsString() logoUrl?: string;
}

export class ConvertLeadToTenantFullDto {
  @IsString() @IsNotEmpty() leadId: string;
  @IsString() @IsNotEmpty() slug: string;
  @IsIn(['SERVICOS', 'VAREJO']) blueprint: BlueprintKey;
  @ValidateNested() @Type(() => ConvertLeadAdminDto) admin: ConvertLeadAdminDto;
  @IsOptional() @ValidateNested() @Type(() => ConvertLeadBrandingDto) branding?: ConvertLeadBrandingDto;
}
```

---

### 3. `apps/core/src/platform/onboarding.service.ts`

```typescript
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { BLUEPRINTS, BlueprintKey } from './blueprints.config';
import { ConvertLeadToTenantFullDto } from './dto/convert-lead-to-tenant-full.dto';

export interface OnboardingResultAdmin {
  id: string;
  email: string;
  senhaTemporaria: string;
}

export interface OnboardingResult {
  tenantId: string;
  slug: string;
  admin: OnboardingResultAdmin;
}

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async convertLead(dto: ConvertLeadToTenantFullDto): Promise<OnboardingResult> {
    // Guards fora da TX — reads baratos, não precisam ser atômicos com os writes
    const lead = await this.prisma.lead.findUnique({ where: { id: dto.leadId }, select: { id: true, estado: true } });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    if (lead.estado === 'CONVERTIDO') throw new ConflictException('Lead já foi convertido');

    // Hash antes da TX para manter a transação curta (bcrypt é CPU-intensivo)
    const senhaTemporaria = this.generateTemporaryPassword();
    const senhaHash = await this.authService.hashPassword(senhaTemporaria);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Criar Tenant — conflito de slug surfaceado como P2002 → capturado abaixo
        const tenant = await tx.tenant.create({
          data: {
            slug: dto.slug.trim(),
            nome: dto.slug.trim(),
            branding_cor_primaria: dto.branding?.corPrimaria ?? null,
            branding_logo_url: dto.branding?.logoUrl ?? null,
          },
          select: { id: true, slug: true },
        });

        // 2. Inserir módulos do blueprint
        await tx.tenantModulo.createMany({
          data: BLUEPRINTS[dto.blueprint].map((modulo) => ({
            tenant_id: tenant.id,
            modulo,
          })),
        });

        // 3. Criar usuário admin
        const usuario = await tx.usuario.create({
          data: {
            tenant_id: tenant.id,
            nome: dto.admin.nome.trim(),
            email: dto.admin.email.toLowerCase().trim(),
            senha_hash: senhaHash,
            tipo: 'admin',
          },
          select: { id: true, email: true },
        });

        // 4. Encerrar Lead
        await tx.lead.update({
          where: { id: dto.leadId },
          data: {
            tenant_id: tenant.id,
            estado: 'CONVERTIDO',
            gate: 'closed_won',
          },
        });

        return { tenant, usuario };
      });

      return {
        tenantId: result.tenant.id,
        slug: result.tenant.slug,
        admin: { id: result.usuario.id, email: result.usuario.email, senhaTemporaria },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        (error.meta.target as string[]).includes('slug')
      ) {
        throw new ConflictException('Slug de tenant já cadastrado');
      }
      throw error;
    }
  }

  private generateTemporaryPassword(): string {
    return randomBytes(8).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
  }
}
```

---

## Arquivos a modificar

### 4. Registrar no `PlatformModule`

No arquivo `apps/core/src/platform/platform.module.ts`:
- Importar e adicionar `OnboardingService` em `providers`

### 5. Adicionar endpoint no `PlatformTenantController`

```typescript
@Post('convert-lead')
async convertLead(@Body() dto: ConvertLeadToTenantFullDto): Promise<OnboardingResult> {
  return this.onboardingService.convertLead(dto);
}
```

- Rota final: `POST /platform/tenants/convert-lead`
- Injetar `OnboardingService` no construtor do controller

---

## Teste de integração obrigatório

Cobrir em `onboarding.service.spec.ts` ou no arquivo de integração da plataforma:

1. **Happy path SERVICOS**: lead válido → tenant criado com 4 módulos, usuário admin com senha temporária, lead com estado CONVERTIDO.
2. **Happy path VAREJO**: idem com 4 módulos diferentes.
3. **Rollback — slug duplicado**: slug já existente → ConflictException, nenhuma escrita persistida.
4. **Lead não encontrado**: NotFoundException.
5. **Lead já convertido**: ConflictException antes da TX.

---

## Restrições

- Não criar novo NestJS module — adicionar ao `PlatformModule` existente.
- Não fazer read prévio de slug — deixar o P2002 surfaçar.
- Não mover o `generateTemporaryPassword` para um helper compartilhado — duplicação intencional por ora.
- Não alterar o schema Prisma nesta task (Lead sem FK para Tenant é dívida pré-existente).

## Ponto de parada

Parar antes de fazer push e aguardar OK do Márcio após: typecheck OK + testes passando + teste de integração implementado.
