
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from '../common/email.service';
@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService,EmailService], // Provide PrismaService
})
export class PaymentModule {}
