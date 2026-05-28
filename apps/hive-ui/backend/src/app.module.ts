import { Module } from '@nestjs/common';
import { HiveModule } from './hive/hive.module';

@Module({
  imports: [HiveModule],
})
export class AppModule {}
