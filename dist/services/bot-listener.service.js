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
const adminId = 506020211;
let BotListenerService = class BotListenerService extends lib_1.EventEmitter {
    bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    me;
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
            this.initBdModeListener();
            this.initMyStatisticListener();
        });
    }
    notifyChats(chatIds, notification) {
        if (!notification.media && !notification.message) {
            return;
        }
        try {
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
        catch { }
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
            const mentions = msg.text.split(' ');
            const [botName, mentionedUsername] = mentions;
            if (mentionedUsername === botName) {
                return;
            }
            const isDuel = msg.entities?.length === 2 && mentions.length === 2;
            if (isDuel) {
                this.emit('duel', msg, mentionedUsername);
            }
        });
    }
    initBdModeListener() {
        const bdMode = new RegExp(`bdmode\:(true|false) @${this.me.username} @[a-zA-Z0-9]*`);
        this.bot.onText(bdMode, (msg) => {
            if (msg.from.id !== adminId) {
                return;
            }
            try {
                const status = msg.text.split(' ')[0].split(':')[1];
                const username = msg.text.split(' ')[2].split('@')[1];
                const statusBool = JSON.parse(status);
                this.emit('bdMode', username, statusBool);
            }
            catch { }
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
    initMyStatisticListener() {
        const StatsReg = new RegExp(`^\/my_stats`);
        this.bot.onText(StatsReg, (msg) => {
            this.emit('myStats', msg);
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