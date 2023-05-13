import { Injectable } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter } from 'src/lib';
import { Mention } from 'src/models';

type BotEvents = {
  callbackQuery: [query: TelegramBot.CallbackQuery];
  challengeQuery: [message: TelegramBot.Message];
  duel: [message: TelegramBot.Message, mentionedUser: Mention];
};

@Injectable()
export class BotListenerService extends EventEmitter<BotEvents> {
  public readonly bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
  public me: TelegramBot.User;

  constructor() {
    super();

    this.setMe().then(() => {
      this.initMessageActionListeners();
      this.initCallbackQueryListener();
      this.initDuelListener();
    });
  }

  private async setMe(): Promise<TelegramBot.User> {
    return this.bot.getMe().then((me) => {
      this.me = me;

      return me;
    });
  }

  private initCallbackQueryListener(): void {
    this.bot.on('callback_query', (query) => {
      if (!query.data) {
        return;
      }

      this.emit('callbackQuery', query);
    });
  }

  private initDuelListener(): void {
    const mentionRegexp = new RegExp(`@${this.me.username} @[a-zA-Z0-9]*`);

    this.bot.onText(mentionRegexp, (msg) => {
      const mentions = msg.text.split(' ');
      const [botName, mentionedUsername] = mentions;

      if (mentionedUsername === botName) {
        return;
      }

      const isDuel = msg.entities?.length === 2 && mentions.length === 2;

      if (isDuel) {
        this.emit('duel', msg, mentionedUsername as Mention);
      }
    });
  }

  private initMessageActionListeners(): void {
    const mentionRegexp = new RegExp(`@${this.me.username}`);

    this.bot.onText(mentionRegexp, (msg) => {
      const mentions = msg.text.split(' ');

      if (mentions.length !== 1) {
        return;
      }

      this.emit('challengeQuery', msg);
    });
  }
}
