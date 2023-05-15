import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BotListenerService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { FightersModule } from './db/fighters';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot('mongodb://127.0.0.1:27017/testdb'), FightersModule],
  controllers: [AppController],
  providers: [BotListenerService],
})
export class AppModule {}
