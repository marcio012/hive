import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HiveModule } from './hive/hive.module';
import { SquadModule } from './squad/squad.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, HiveModule, SquadModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
