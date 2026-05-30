---
id: WO-042
titulo: HIVE-026-A — Auth Backend: AuthModule + JwtAuthGuard global
backlog_ref: HIVE-026
debate_ref: beehive/construcao/debates/DEBATE-036-LOGIN-LANDING-HIVE.md
thread: login-landing-hive
executor: Copilot
status: executada
data: 2026-05-30
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui/backend
---

# WO-042 — Auth Backend: AuthModule + JwtAuthGuard global

## Contexto

O Hive UI está atualmente aberto — sem autenticação. O `App.tsx` do frontend já tem landing e login implementados, mas usando `localStorage` com flag demo (`hive-ui-demo-session`). Esta WO implementa o backend real de autenticação: credenciais em variáveis de ambiente, JWT em HttpOnly cookie, guard global no NestJS.

**Dependência:** nenhuma — pode ser executada imediatamente.

---

## Escopo

### 1. Pacotes a instalar

```bash
cd apps/hive-ui/backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt cookie-parser
npm install -D @types/passport-jwt @types/bcrypt @types/cookie-parser
```

### 2. Variáveis de ambiente

Adicionar em `apps/hive-ui/backend/.env` (e em `.env.example` se existir):

```env
HIVE_USER=marcio
HIVE_PASS_HASH=<bcrypt hash gerado com bcrypt.hash('hive-os', 10)>
JWT_SECRET=<string aleatória longa>
JWT_EXPIRY=7d
```

**Como gerar o hash:**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('hive-os', 10).then(h => console.log(h));"
```

### 3. Estrutura de arquivos a criar

```
apps/hive-ui/backend/src/auth/
  auth.module.ts
  auth.controller.ts
  auth.service.ts
  jwt.strategy.ts
  jwt-auth.guard.ts
  public.decorator.ts
```

### 4. `public.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### 5. `jwt-auth.guard.ts`

```typescript
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

### 6. `jwt.strategy.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['hive_session'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: { sub: string }) {
    return { username: payload.sub };
  }
}
```

### 7. `auth.service.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    const expectedUser = this.config.get<string>('HIVE_USER');
    const expectedHash = this.config.get<string>('HIVE_PASS_HASH');

    if (username !== expectedUser) throw new UnauthorizedException();
    const match = await bcrypt.compare(password, expectedHash ?? '');
    if (!match) throw new UnauthorizedException();

    return this.jwt.sign({ sub: username });
  }
}
```

### 8. `auth.controller.ts`

```typescript
import {
  Body, Controller, Get, HttpCode, Post, Req, Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.auth.login(body.username, body.password);
    res.cookie('hive_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { ok: true };
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('hive_session');
    return { ok: true };
  }

  @Get('session')
  session(@Req() req: Request) {
    return { ok: true, user: (req as any).user };
  }
}
```

### 9. `auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRY', '7d') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### 10. Atualizar `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HiveModule } from './hive/hive.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    HiveModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
```

### 11. Atualizar `main.ts`

Adicionar `cookie-parser` e ajustar CORS:

```typescript
import * as cookieParser from 'cookie-parser';
// ...dentro do bootstrap():
app.use(cookieParser());
app.enableCors({
  origin: [
    'http://localhost:5174',
    process.env.HIVE_UI_ORIGIN ?? 'http://localhost:5174',
  ],
  credentials: true,
});
```

### 12. Gateway WebSocket — marcar como `@Public()`

O `HiveGateway` deve receber o decorator `@Public()` na classe para que o guard global não bloqueie as conexões Socket.IO (V1: auth no WebSocket fica para V2).

```typescript
import { Public } from '../auth/public.decorator';

@Public()
@WebSocketGateway(...)
export class HiveGateway { ... }
```

---

## Critérios de Aceite

- **AC-01:** `POST /api/auth/login` com credenciais corretas retorna `{ ok: true }` e seta cookie `hive_session` (HttpOnly)
- **AC-02:** `POST /api/auth/login` com credenciais erradas retorna 401
- **AC-03:** `GET /api/auth/session` com cookie válido retorna `{ ok: true, user: { username: 'marcio' } }`
- **AC-04:** `GET /api/auth/session` sem cookie retorna 401
- **AC-05:** `GET /api/hive/state` sem cookie retorna 401
- **AC-06:** `POST /api/auth/logout` limpa o cookie
- **AC-07:** WebSocket `ws://localhost:3001/hive` conecta sem autenticação (marcado `@Public()`)
- **AC-08:** `npm run check:types` e `npm run build` passam sem erros novos

## Validação

```bash
cd apps/hive-ui/backend && npm run check:types
cd apps/hive-ui/backend && npm run build

# Login correto
curl -c /tmp/hive-cookies.txt -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"marcio","password":"hive-os"}' -v

# Session com cookie
curl -b /tmp/hive-cookies.txt http://localhost:3001/api/auth/session

# Rota protegida sem cookie → 401
curl http://localhost:3001/api/hive/state
```
