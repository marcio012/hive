import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getRequiredConfig, type SessionUser } from './auth.config';

const DUMMY_BCRYPT_HASH = '$2b$10$7EqJtq98hPqEX7fNZaFWoOHi7q/yL1TfXYy3jACzmvVs0TqLZfGWy';

@Injectable()
export class AuthService {
  private readonly expectedUser: string;

  private readonly expectedHash: string;

  constructor(
    config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.expectedUser = getRequiredConfig(config, 'HIVE_USER');
    this.expectedHash = getRequiredConfig(config, 'HIVE_PASS_HASH');
  }

  async login(username: string, password: string): Promise<{ token: string; user: SessionUser }> {
    const userMatch = username === this.expectedUser;
    const passMatch = await bcrypt.compare(
      password,
      userMatch ? this.expectedHash : DUMMY_BCRYPT_HASH,
    );

    if (!userMatch || !passMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return {
      token: await this.jwt.signAsync({ sub: this.expectedUser }),
      user: { username: this.expectedUser },
    };
  }
}
