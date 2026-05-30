import type { ConfigService } from '@nestjs/config';
import type { CookieOptions } from 'express';

export const HIVE_SESSION_COOKIE = 'hive_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type SessionUser = {
  username: string;
};

type ConfigReader = Pick<ConfigService, 'get'>;

export function getRequiredConfig(config: ConfigReader, key: string): string {
  const value = config.get<string>(key)?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getAllowedOrigins(hiveUiOrigin?: string): string[] {
  return Array.from(
    new Set(['http://localhost:5174', hiveUiOrigin?.trim() ?? ''].filter(Boolean)),
  );
}

export function buildSessionCookieOptions(isProduction: boolean): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
  };
}
