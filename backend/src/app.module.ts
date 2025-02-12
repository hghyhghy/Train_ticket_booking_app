import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TrainModule } from './train/train.module';
import { BookingsModule } from './booking/booking.module';
@Module({
  imports: [AuthModule,TrainModule,BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
