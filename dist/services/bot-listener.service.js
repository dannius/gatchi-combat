"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotListenerService = void 0;
const common_1 = require("@nestjs/common");
const TelegramBot = require("node-telegram-bot-api");
const lib_1 = require("../lib");
let BotListenerService = class BotListenerService extends lib_1.EventEmitter {
    constructor() {
        super();
        this.bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
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
    notifyChats(chatIds, notification) {
        if (!notification.media && !notification.message) {
            return;
        }
        chatIds.forEach((id) => {
            if (!notification.media) {
                this.bot.sendMessage(id, notification.message);
            }
            else if (notification.media.type === 'photo') {
                this.bot.sendPhoto(id, notification.media.id, { caption: notification.message });
            }
            else if (notification.media.type === 'video') {
                this.bot.sendAnimation(id, notification.media.id, { caption: notification.message });
            }
        });
    }
    async setMe() {
        return this.bot.getMe().then((me) => {
            this.me = me;
            return me;
        });
    }
    initCallbackQueryListener() {
        this.bot.on('callback_query', (query) => {
            if (!query.data) {
                return;
            }
            this.emit('callbackQuery', query);
        });
    }
    initDuelListener() {
        const mentionRegexp = new RegExp(`^@${this.me.username} @[a-zA-Z0-9]*`);
        this.bot.onText(mentionRegexp, (msg) => {
            var _a;
            const mentions = msg.text.split(' ');
            const [botName, mentionedUsername] = mentions;
            if (mentionedUsername === botName) {
                return;
            }
            const isDuel = ((_a = msg.entities) === null || _a === void 0 ? void 0 : _a.length) === 2 && mentions.length === 2;
            if (isDuel) {
                this.emit('duel', msg, mentionedUsername);
            }
        });
    }
    initDailyQuoteListener() {
        const quoteReg = new RegExp(`^\/daily_quote`);
        this.bot.onText(quoteReg, (msg) => {
            this.emit('dailyQuote', msg);
        });
    }
    initRanodmQuoteListener() {
        const quoteReg = new RegExp(`^\/random_quote`);
        this.bot.onText(quoteReg, (msg) => {
            this.emit('randomQuote', msg);
        });
    }
    initStatisticListener() {
        const StatsReg = new RegExp(`^\/stats`);
        this.bot.onText(StatsReg, (msg) => {
            this.emit('stats', msg);
        });
    }
    initGroupStatisticListener() {
        const StatsReg = new RegExp(`^\/chat_stats`);
        this.bot.onText(StatsReg, (msg) => {
            this.emit('chatStats', msg);
        });
    }
    initDailyQuoteSwitcherListener() {
        const StatsReg = new RegExp(`^\/toggle_daily_quote`);
        this.bot.onText(StatsReg, (msg) => {
            this.emit('toggleDailyQuote', msg);
        });
    }
    initMessageActionListeners() {
        const mentionRegexp = new RegExp(`^@${this.me.username}`);
        this.bot.onText(mentionRegexp, (msg) => {
            const mentions = msg.text.split(' ');
            if (mentions.length !== 1) {
                return;
            }
            this.emit('challengeQuery', msg);
        });
    }
};
BotListenerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BotListenerService);
exports.BotListenerService = BotListenerService;
//# sourceMappingURL=bot-listener.service.js.map