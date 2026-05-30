import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { getRequiredConfig, HIVE_SESSION_COOKIE, type SessionUser } from './auth.config';

type JwtPayload = {
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request | undefined) => req?.cookies?.[HIVE_SESSION_COOKIE] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: getRequiredConfig(config, 'JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): SessionUser {
    return { username: payload.sub };
  }
}
