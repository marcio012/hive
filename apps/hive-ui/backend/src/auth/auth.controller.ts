import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { buildSessionCookieOptions, HIVE_SESSION_COOKIE, type SessionUser } from './auth.config';
import { Public } from './public.decorator';

type LoginPayload = {
  username?: unknown;
  password?: unknown;
};

type RequestWithUser = Request & {
  user?: SessionUser;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true; user: SessionUser }> {
    if (typeof body?.username !== 'string' || !body.username.trim()) {
      throw new BadRequestException('username inválido.');
    }

    if (typeof body?.password !== 'string' || !body.password) {
      throw new BadRequestException('password inválido.');
    }

    const result = await this.auth.login(body.username.trim(), body.password);
    res.cookie(
      HIVE_SESSION_COOKIE,
      result.token,
      buildSessionCookieOptions(this.isProduction()),
    );

    return { ok: true, user: result.user };
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response): { ok: true } {
    res.clearCookie(HIVE_SESSION_COOKIE, buildSessionCookieOptions(this.isProduction()));
    return { ok: true };
  }

  @Get('session')
  @HttpCode(200)
  session(@Req() req: RequestWithUser): { ok: true; user: SessionUser } {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return { ok: true, user: req.user };
  }

  private isProduction(): boolean {
    return this.config.get<string>('NODE_ENV') === 'production';
  }
}
