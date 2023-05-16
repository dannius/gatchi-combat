import { Mention } from 'src/lib';
import { Injectable } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter, NotifyMessage } from 'src/lib';

type BotEvents = {
  callbackQuery: [query: TelegramBot.CallbackQuery];
  challengeQuery: [message: TelegramBot.Message];
  addedToGroup: [message: TelegramBot.Message];
  duel: [message: TelegramBot.Message, mentionedUser: Mention];
  dailyQuote: [message: TelegramBot.Message];
  randomQuote: [message: TelegramBot.Message];
  stats: [message: TelegramBot.Message];
  chatStats: [message: TelegramBot.Message];
  toggleDailyQuote: [message: TelegramBot.Message];
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
      this.initRanodmQuoteListener();
      this.initDailyQuoteListener();
      this.initStatisticListener();
      this.initGroupStatisticListener();
      this.initDailyQuoteSwitcherListener();
    });
  }

  public notifyChats(chatIds: number[], notification: NotifyMessage): void {
    if (!notification.media && !notification.message) {
      return;
    }

    chatIds.forEach((id) => {
      if (!notification.media) {
        this.bot.sendMessage(id, notification.message);
      } else if (notification.media.type === 'photo') {
        this.bot.sendPhoto(id, notification.media.id, { caption: notification.message });
      } else if (notification.media.type === 'video') {
        this.bot.sendAnimation(id, notification.media.id, { caption: notification.message });
      }
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
    const mentionRegexp = new RegExp(`^@${this.me.username} @[a-zA-Z0-9]*`);

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

  private initDailyQuoteListener(): void {
    const quoteReg = new RegExp(`^\/daily_quote`);

    this.bot.onText(quoteReg, (msg) => {
      this.emit('dailyQuote', msg);
    });
  }
  private initRanodmQuoteListener(): void {
    const quoteReg = new RegExp(`^\/random_quote`);

    this.bot.onText(quoteReg, (msg) => {
      this.emit('randomQuote', msg);
    });
  }

  private initStatisticListener(): void {
    const StatsReg = new RegExp(`^\/stats`);

    this.bot.onText(StatsReg, (msg) => {
      this.emit('stats', msg);
    });
  }

  private initGroupStatisticListener(): void {
    const StatsReg = new RegExp(`^\/chat_stats`);

    this.bot.onText(StatsReg, (msg) => {
      this.emit('chatStats', msg);
    });
  }

  private initDailyQuoteSwitcherListener(): void {
    const StatsReg = new RegExp(`^\/toggle_daily_quote`);

    this.bot.onText(StatsReg, (msg) => {
      this.emit('toggleDailyQuote', msg);
    });
  }

  private initMessageActionListeners(): void {
    const mentionRegexp = new RegExp(`^@${this.me.username}`);

    this.bot.onText(mentionRegexp, (msg) => {
      const mentions = msg.text.split(' ');

      if (mentions.length !== 1) {
        return;
      }

      this.emit('challengeQuery', msg);
    });
  }
}
