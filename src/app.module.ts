import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BotListenerService } from './services';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [BotListenerService],
})
export class AppModule {}
