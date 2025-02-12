import { Module } from '@nestjs/common';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TrainController],
  providers: [TrainService, PrismaService],
  exports: [TrainService],
})
export class TrainModule {}
