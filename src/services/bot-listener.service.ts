import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class BotListenerService {
  private token = '';

  public readonly bot = new TelegramBot(this.token, { polling: true });

  private readonly _callbackQuery$ = new Subject<TelegramBot.CallbackQuery>();

  private readonly _challengeQuery$ = new Subject<TelegramBot.Message>();

  public readonly challengeQuery$ = this._challengeQuery$.asObservable();

  public readonly callbackQuery$ = this._callbackQuery$.asObservable();

  constructor() {
    this.initMessageActionListeners();
    this.initCallbackQueryListener();
  }

  private initCallbackQueryListener(): void {
    this.bot.on('callback_query', (query) => {
      if (!query.data) {
        return;
      }

      this._callbackQuery$.next(query);
    });
  }

  private initMessageActionListeners(): void {
    this.bot.onText(/тест/, (msg) => this._challengeQuery$.next(msg));
  }
}
