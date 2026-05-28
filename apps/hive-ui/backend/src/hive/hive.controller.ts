import { Controller, Get } from '@nestjs/common';
import { HiveService, HiveState } from './hive.service';

@Controller('hive')
export class HiveController {
  constructor(private readonly hiveService: HiveService) {}

  @Get('state')
  getState(): Promise<HiveState> {
    return this.hiveService.getState();
  }
}
