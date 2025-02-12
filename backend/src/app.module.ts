import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TrainModule } from './train/train.module';
@Module({
  imports: [AuthModule,TrainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
