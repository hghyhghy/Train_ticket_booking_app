
import { Module } from '@nestjs/common';
import { BookingsService } from './booking.service';
import { BookingsController } from './booking.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService],
})
export class BookingsModule {}
