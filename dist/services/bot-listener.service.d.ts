import { Mention } from 'src/lib';
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
    bdMode: [username: Mention, status: boolean];
};
export declare class BotListenerService extends EventEmitter<BotEvents> {
    readonly bot: TelegramBot;
    me: TelegramBot.User;
    constructor();
    notifyChats(chatIds: number[], notification: NotifyMessage): void;
    private setMe;
    private initCallbackQueryListener;
    private initDuelListener;
    private initBdModeListener;
    private initDailyQuoteListener;
    private initRanodmQuoteListener;
    private initStatisticListener;
    private initGroupStatisticListener;
    private initDailyQuoteSwitcherListener;
    private initMessageActionListeners;
}
export {};
