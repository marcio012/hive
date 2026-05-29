import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  HiveConfig,
  HiveService,
  HiveState,
  type DispatchPayload,
  type HiveActionResult,
} from './hive.service';

type HiveConfigPatch = Partial<HiveConfig>;

@Controller('hive')
export class HiveController {
  constructor(private readonly hiveService: HiveService) {}

  @Get('state')
  getState(): Promise<HiveState> {
    return this.hiveService.getState();
  }

  @Get('config')
  getConfig(): Promise<HiveConfig> {
    return this.hiveService.readConfig();
  }

  @Post('config')
  updateConfig(@Body() payload: HiveConfigPatch): Promise<HiveConfig> {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new BadRequestException('Payload de config inválido.');
    }

    const partial: HiveConfigPatch = {};

    if ('autoMode' in payload) {
      if (typeof payload.autoMode !== 'boolean') {
        throw new BadRequestException('autoMode deve ser boolean.');
      }
      partial.autoMode = payload.autoMode;
    }

    if ('autoMerge' in payload) {
      if (typeof payload.autoMerge !== 'boolean') {
        throw new BadRequestException('autoMerge deve ser boolean.');
      }
      partial.autoMerge = payload.autoMerge;
    }

    if ('notifyMarcio' in payload) {
      if (typeof payload.notifyMarcio !== 'boolean') {
        throw new BadRequestException('notifyMarcio deve ser boolean.');
      }
      partial.notifyMarcio = payload.notifyMarcio;
    }

    if (Object.keys(partial).length === 0) {
      throw new BadRequestException('Nenhuma configuração válida enviada.');
    }

    return this.hiveService.updateConfig(partial);
  }

  @Post('lock/release/:agent')
  releaseLock(@Param('agent') agent: string): Promise<HiveActionResult> {
    if (!this.hiveService.isAgentName(agent)) {
      throw new BadRequestException('Agente inválido.');
    }

    return this.hiveService.releaseLock(agent);
  }

  @Post('dispatch')
  dispatch(@Body() payload: Partial<DispatchPayload>): Promise<HiveActionResult> {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new BadRequestException('Payload de dispatch inválido.');
    }

    if (typeof payload.agent !== 'string' || !this.hiveService.isAgentName(payload.agent)) {
      throw new BadRequestException('Agente inválido.');
    }

    if (typeof payload.message !== 'string') {
      throw new BadRequestException('Mensagem inválida.');
    }

    return this.hiveService.dispatchIntent({
      agent: payload.agent,
      message: payload.message,
    });
  }
}
