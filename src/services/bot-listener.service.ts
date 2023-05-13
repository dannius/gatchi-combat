import { Injectable } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter } from 'src/lib';

type BotEvents = {
  callbackQuery: [query: TelegramBot.CallbackQuery];
  challengeQuery: [message: TelegramBot.Message];
};

@Injectable()
export class BotListenerService extends EventEmitter<BotEvents> {
  public readonly bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

  constructor() {
    super();

    this.initMessageActionListeners();
    this.initCallbackQueryListener();
  }

  private initCallbackQueryListener(): void {
    this.bot.on('callback_query', (query) => {
      if (!query.data) {
        return;
      }

      this.emit('callbackQuery', query);
    });
  }

  private initMessageActionListeners(): void {
    this.bot.onText(/тест/, (msg) => this.emit('challengeQuery', msg));
  }
}
