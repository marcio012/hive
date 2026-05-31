import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { SquadService } from './squad.service';
import { type SquadMember } from './squad.types';

@Public()
@ApiTags('squad')
@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @Get()
  @ApiOperation({ summary: 'Listar membros do squad' })
  @ApiResponse({ status: 200, description: 'Array com os membros atuais do squad.' })
  getSquad(): Promise<SquadMember[]> {
    return this.squadService.getSquad();
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar membros do squad' })
  @ApiResponse({ status: 200, description: 'Array com os membros atualizados do squad.' })
  updateSquad(@Body() members: unknown): Promise<SquadMember[]> {
    return this.squadService.updateSquad(members);
  }
}
