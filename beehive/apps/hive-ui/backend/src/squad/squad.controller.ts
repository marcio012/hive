import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SquadService } from './squad.service';
import { SquadMemberDto } from './squad.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('squad')
@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @Get()
  @ApiOperation({ summary: 'Listar membros do squad' })
  @ApiResponse({ status: 200, description: 'Array com os membros atuais do squad.' })
  getSquad(): Promise<SquadMemberDto[]> {
    return this.squadService.getSquad();
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar membros do squad' })
  @ApiResponse({ status: 200, description: 'Array com os membros atualizados do squad.' })
  updateSquad(@Body() members: SquadMemberDto[]): Promise<SquadMemberDto[]> {
    return this.squadService.updateSquad(members);
  }
}
