import { Module } from '@nestjs/common';
import { HiveController } from './hive.controller';
import { HiveGateway } from './hive.gateway';
import { HiveService } from './hive.service';

@Module({
  controllers: [HiveController],
  providers: [HiveService, HiveGateway],
})
export class HiveModule {}
