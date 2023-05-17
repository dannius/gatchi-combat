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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const models_1 = require("./models");
const services_1 = require("./services");
const dictionary_1 = require("./lib/dictionary/dictionary");
const lib_1 = require("./lib");
const quotes_1 = require("./lib/dictionary/quotes");
const deaily_repeat_1 = require("./lib/util/deaily-repeat");
const fighters_1 = require("./db/fighters");
const groups_1 = require("./db/groups");
const scene_1 = require("./db/scene");
let AppController = class AppController {
    constructor(botListenerService, fightersService, groupService, sceneService) {
        this.botListenerService = botListenerService;
        this.fightersService = fightersService;
        this.groupService = groupService;
        this.sceneService = sceneService;
        this.scenes = new Map();
        this.finishedScenes = 0;
        this.initCallbackQuerySubscription();
        this.initChallangeQuerySubscription();
        this.initDuelSubscription();
        this.initRandomQuoteListener();
        this.initDailyQuoteListener();
        this.initStatsListener();
        this.initGroupStatsListener();
        this.toggleDailyQuoteListener();
        if (process.env.DEBUG === 'true') {
            this.debugListeners();
        }
        this.setDailyQuote();
        (0, deaily_repeat_1.dailyRepeat)(12, 1, async () => {
            this.setDailyQuote();
            const groups = await this.groupService.findDailyQuotesGroups();
            if (groups.length) {
                const ids = groups.map((g) => g.groupId);
                this.botListenerService.notifyChats(ids, this.quoteOfTheDay);
            }
        });
    }
    setDailyQuote() {
        this.quoteOfTheDay = (0, quotes_1.getQuote)();
        this.quoteOfTheDay.message = `Цитата дня:\n${this.quoteOfTheDay.message}`;
    }
    initRandomQuoteListener() {
        this.botListenerService.on('randomQuote', (message) => {
            this.botListenerService.notifyChats([message.chat.id], (0, quotes_1.getQuote)());
        });
    }
    initDailyQuoteListener() {
        this.botListenerService.on('dailyQuote', (message) => {
            this.botListenerService.notifyChats([message.chat.id], this.quoteOfTheDay);
        });
    }
    initStatsListener() {
        this.botListenerService.on('stats', async (message) => {
            const fighters = await this.fightersService.findAllWithLimit(50);
            const stats = await this.getGroupStatsMessage(fighters);
            this.botListenerService.notifyChats([message.chat.id], {
                message: stats ? `Мировой рейтинг ⚣semen⚣:${stats}` : 'Пусто',
            });
        });
    }
    initGroupStatsListener() {
        this.botListenerService.on('chatStats', async (message) => {
            const groupDto = await this.groupService.get(message.chat.id);
            if (!groupDto) {
                return;
            }
            const fighters = Array.from(groupDto.fighters)
                .map(([userId, rest]) => (Object.assign({ userId }, rest)))
                .sort((a, b) => (a.scores > b.scores ? -1 : 1));
            const stats = await this.getGroupStatsMessage(fighters);
            this.botListenerService.notifyChats([message.chat.id], {
                message: stats ? `Групповой рейтинг ⚣semen⚣:${stats}` : 'Пусто',
            });
        });
    }
    toggleDailyQuoteListener() {
        this.botListenerService.on('toggleDailyQuote', async (message) => {
            const group = await this.getOrCreateGroup(message.chat.id);
            group.allowDailyQuote = !group.allowDailyQuote;
            await this.groupService.update(group);
            const notificationMessage = group.allowDailyQuote ? 'Цитаты дня включены' : 'Цитаты дня выключены';
            this.botListenerService.notifyChats([message.chat.id], { message: notificationMessage });
        });
    }
    async getOrCreateGroup(groupId) {
        const dto = await this.groupService.get(groupId);
        if (dto) {
            return new models_1.Group(dto);
        }
        const newGroup = new models_1.Group({ groupId });
        this.groupService.create(newGroup);
        return newGroup;
    }
    async getGroupStatsMessage(fighters) {
        const stats = Array.from(fighters)
            .sort((a, b) => (a.scores > b.scores ? -1 : 1))
            .reduce((acc, curr, index) => `${acc}\n${index + 1}) ${curr.name} - ${curr.scores} мл.`, '');
        return stats;
    }
    async getGlobalStatsMessage(fighters) {
        const stats = Array.from(fighters).reduce((acc, curr, index) => `${acc}\n${index + 1}) ${curr.name} (${curr.scores} scores) / fights: ${curr.fights}, wins: ${curr.wins}, looses: ${curr.looses}`, '');
        return stats;
    }
    initDuelSubscription() {
        this.botListenerService.on('duel', (message, mentionedUsername) => {
            this.createFightScene(message, mentionedUsername);
        });
    }
    initChallangeQuerySubscription() {
        this.botListenerService.on('challengeQuery', (message) => this.createFightScene(message));
    }
    async createFightScene(message, mentionedUsername) {
        const fighter = await this.createOrGetExistingFighter(`${message.from.id}`, message.from.username);
        const scene = new models_1.Scene(this.botListenerService, dictionary_1.Dictionary, message.chat.id, fighter, mentionedUsername);
        this.scenes.set(scene.id, scene);
        scene.on('fightFinished', async (winner, looser) => {
            this.finishedScenes++;
            this.fightersService.update(winner.fighter);
            this.fightersService.update(looser.fighter);
            const groupDto = await this.groupService.get(message.chat.id);
            const group = new models_1.Group(groupDto ? groupDto : { groupId: message.chat.id });
            group.updateFightersScores(winner, looser);
            if (groupDto) {
                this.groupService.update(group);
            }
            else {
                this.groupService.create(group);
            }
            this.sceneService.create({
                winnerId: winner.fighter.userId,
                winnerWeapon: winner.weapon,
                looserId: looser.fighter.userId,
                looserWeapon: looser.weapon,
            });
        });
        scene.on('destroy', () => {
            this.scenes.delete(scene.id);
        });
    }
    initCallbackQuerySubscription() {
        this.botListenerService.on('callbackQuery', (query) => {
            const [action, id] = query.data.split('~');
            const scene = this.scenes.get(id);
            if (!scene) {
                return;
            }
            switch (action) {
                case lib_1.ActionType.AcceptFight:
                    this.acceptFight(scene, query);
                    return;
                case lib_1.WeaponType.Rock:
                    scene.setWeapon(lib_1.WeaponType.Rock, `${query.from.id}`);
                    return;
                case lib_1.WeaponType.Scissors:
                    scene.setWeapon(lib_1.WeaponType.Scissors, `${query.from.id}`);
                    return;
                case lib_1.WeaponType.Paper:
                    scene.setWeapon(lib_1.WeaponType.Paper, `${query.from.id}`);
                    return;
            }
        });
    }
    async acceptFight(scene, query) {
        if (!scene.canAcceptFight(query.from)) {
            return;
        }
        const fighter = await this.createOrGetExistingFighter(`${query.from.id}`, query.from.username);
        scene.fight(fighter);
    }
    async createOrGetExistingFighter(id, name) {
        const dbFighter = await this.fightersService.get(id);
        if (dbFighter) {
            return new models_1.Fighter(dbFighter);
        }
        const newFighter = new models_1.Fighter({ userId: `${id}`, name });
        this.fightersService.create(newFighter);
        return newFighter;
    }
    debugListeners() {
        const stages = Object.keys(dictionary_1.Dictionary);
        this.botListenerService.bot.onText(/\/debug$/, (message) => {
            this.botListenerService.bot.sendMessage(message.chat.id, stages.join('\n'));
        });
        const reg = new RegExp(`\/debug\\s(${stages.join('|')})$`);
        this.botListenerService.bot.onText(reg, (message) => {
            var _a;
            const chatId = message.chat.id;
            const [_, stage] = message.text.split(' ');
            const stageObject = dictionary_1.Dictionary[stage];
            if (!((_a = stageObject === null || stageObject === void 0 ? void 0 : stageObject.medias) === null || _a === void 0 ? void 0 : _a.length)) {
                return;
            }
            stageObject.medias.forEach((media) => {
                const caption = media.id;
                if (media.type === 'photo') {
                    this.botListenerService.bot.sendPhoto(chatId, media.id, { caption });
                }
                else if (media.type === 'video') {
                    this.botListenerService.bot.sendAnimation(chatId, media.id, { caption });
                }
            });
        });
    }
    async getHello() {
        const fighters = await this.fightersService.findAllWithLimit(999);
        fighters
            .sort((a, b) => (a.scores > b.scores ? -1 : 1))
            .reduce((acc, curr) => `${acc} </br> ${curr.name} (${curr.scores} scores) / fights: ${curr.fights}, wins: ${curr.wins}, looses: ${curr.looses}`, '');
        return `<h3>Битв сыграно: ${this.finishedScenes}</h3> </br> <h3>воины подземелья: </h3> </br> ${fighters}`;
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [services_1.BotListenerService,
        fighters_1.FighterService,
        groups_1.GroupService,
        scene_1.SceneService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map