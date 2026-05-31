import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

const DIAGRAMS_DIR = path.join(__dirname, '../../../../../assets/diagrams');
import {
  HiveConfig,
  HiveService,
  HiveState,
  TelemetryState,
  type OrchestratorEventLevel,
  type DispatchPayload,
  type HiveActionResult,
} from './hive.service';
import { Public } from '../auth/public.decorator';

type HiveConfigPatch = Partial<HiveConfig>;
type OrchestratorEventPayload = {
  level?: unknown;
  msg?: unknown;
};

@ApiTags('hive')
@Controller('hive')
export class HiveController {
  constructor(private readonly hiveService: HiveService) {}

  @Get('state')
  @ApiOperation({ summary: 'Estado completo do Hive', description: 'Retorna locks, config, inbox counts, gate, debates, pipeline, governança, telemetria de interações e eventos.' })
  @ApiResponse({ status: 200, description: 'Estado atual do Hive.' })
  getState(): Promise<HiveState> {
    return this.hiveService.getState();
  }

  @Get('telemetry')
  @ApiOperation({ summary: 'Telemetria de uso', description: 'Retorna uso de tokens, custos BRL, eficiência por agente e histórico de inits.' })
  @ApiResponse({ status: 200, description: 'Dados de telemetria.' })
  getTelemetry(): Promise<TelemetryState> {
    return this.hiveService.readTelemetry();
  }

  @Get('config')
  @ApiOperation({ summary: 'Configuração atual', description: 'Retorna a configuração ativa da Hive UI (autoMode, autoMerge, notifyMarcio).' })
  @ApiResponse({ status: 200, description: 'Configuração atual.' })
  getConfig(): Promise<HiveConfig> {
    return this.hiveService.readConfig();
  }

  @Post('config')
  @ApiOperation({ summary: 'Atualizar configuração', description: 'Atualiza parcialmente a configuração da Hive UI. Aceita autoMode, autoMerge e/ou notifyMarcio.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        autoMode:    { type: 'boolean', example: false },
        autoMerge:   { type: 'boolean', example: false },
        notifyMarcio: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Configuração atualizada.' })
  @ApiResponse({ status: 400, description: 'Payload inválido ou nenhuma propriedade reconhecida.' })
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
  @ApiOperation({ summary: 'Liberar lock de agente', description: 'Executa o script de release do lock para o agente informado (claude, copilot ou gemini).' })
  @ApiParam({ name: 'agent', enum: ['claude', 'copilot', 'gemini'], description: 'Nome do agente' })
  @ApiResponse({ status: 201, description: 'Lock liberado com sucesso. { ok: true }' })
  @ApiResponse({ status: 400, description: 'Agente inválido.' })
  releaseLock(@Param('agent') agent: string): Promise<HiveActionResult> {
    if (!this.hiveService.isAgentName(agent)) {
      throw new BadRequestException('Agente inválido.');
    }

    return this.hiveService.releaseLock(agent);
  }

  @Post('dispatch')
  @ApiOperation({ summary: 'Despachar mensagem para inbox de agente', description: 'Insere uma nova entrada no inbox-{agent}.md com a mensagem informada.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['agent', 'message'],
      properties: {
        agent:   { type: 'string', enum: ['claude', 'copilot', 'gemini'], example: 'claude' },
        message: { type: 'string', example: 'Revisar arquitetura do módulo de telemetria.' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Mensagem inserida no inbox. { ok: true }' })
  @ApiResponse({ status: 400, description: 'Agente inválido ou mensagem vazia.' })
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

  @Get('diagrams')
  @Public()
  @ApiOperation({ summary: 'Listar diagramas tldraw', description: 'Retorna os arquivos .tldr disponíveis em assets/diagrams.' })
  @ApiResponse({ status: 200, description: 'Lista de diagramas.' })
  listDiagrams(): { name: string; filename: string }[] {
    if (!fs.existsSync(DIAGRAMS_DIR)) return [];
    return fs
      .readdirSync(DIAGRAMS_DIR)
      .filter((f) => f.endsWith('.tldr'))
      .map((f) => ({ filename: f, name: f.replace(/\.tldr$/, '') }));
  }

  @Get('diagrams/:filename')
  @Public()
  @ApiOperation({ summary: 'Obter diagrama tldraw', description: 'Retorna o conteúdo JSON de um arquivo .tldr.' })
  @ApiParam({ name: 'filename', description: 'Nome do arquivo .tldr' })
  @ApiResponse({ status: 200, description: 'Conteúdo do diagrama.' })
  @ApiResponse({ status: 400, description: 'Nome de arquivo inválido.' })
  @ApiResponse({ status: 404, description: 'Diagrama não encontrado.' })
  getDiagram(@Param('filename') filename: string): unknown {
    if (!/^[\w.-]+\.tldr$/.test(filename)) {
      throw new BadRequestException('Nome de arquivo inválido.');
    }
    const filePath = path.join(DIAGRAMS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Diagrama não encontrado.');
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  @Post('orchestrator/event')
  @Public()
  @ApiOperation({ summary: 'Injetar evento do orchestrador', description: 'Adiciona um evento ao log interno e faz broadcast via WebSocket para todos os clientes conectados.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['level', 'msg'],
      properties: {
        level: { type: 'string', enum: ['info', 'warn', 'error'], example: 'info' },
        msg:   { type: 'string', example: 'Orchestrador iniciou processamento da fila.' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Evento registrado e broadcast enviado.' })
  @ApiResponse({ status: 400, description: 'level ou msg inválidos.' })
  async receiveOrchestratorEvent(@Body() payload: OrchestratorEventPayload): Promise<void> {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new BadRequestException('Payload de evento inválido.');
    }

    if (
      typeof payload.level !== 'string' ||
      !this.hiveService.isOrchestratorEventLevel(payload.level)
    ) {
      throw new BadRequestException('level inválido.');
    }

    if (typeof payload.msg !== 'string' || !payload.msg.trim()) {
      throw new BadRequestException('msg inválida.');
    }

    await this.hiveService.addOrchestratorEvent(
      payload.level as OrchestratorEventLevel,
      payload.msg.trim(),
    );
  }
}
