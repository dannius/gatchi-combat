import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BotListenerService } from './services';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [BotListenerService],
})
export class AppModule {}
