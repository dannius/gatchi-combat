import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BotListenerService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { FightersModule } from './db/fighters';
import { GroupsModule } from './db/groups';
import { ScenesModule } from './db/scene';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/gachitest'),
    FightersModule,
    GroupsModule,
    ScenesModule,
  ],
  controllers: [AppController],
  providers: [BotListenerService],
})
export class AppModule {}
