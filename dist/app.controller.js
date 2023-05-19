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
const dictionary_messages_1 = require("./lib/dictionary/dictionary-messages");
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
    botListenerService;
    fightersService;
    groupService;
    sceneService;
    scenes = new Map();
    finishedScenes = 0;
    quoteOfTheDay;
    constructor(botListenerService, fightersService, groupService, sceneService) {
        this.botListenerService = botListenerService;
        this.fightersService = fightersService;
        this.groupService = groupService;
        this.sceneService = sceneService;
        this.initCallbackQuerySubscription();
        this.initChallangeQuerySubscription();
        this.initDuelSubscription();
        this.initRandomQuoteListener();
        this.initDailyQuoteListener();
        this.initStatsListener();
        this.initMyStatsListener();
        this.initGroupStatsListener();
        this.toggleDailyQuoteListener();
        this.initBdModeSubscription();
        if (process.env.DEBUG === 'true') {
            this.debugListeners();
        }
        if (process.env.FILES === 'true') {
            this.filesListener();
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
            const count = 20;
            const fighters = await this.fightersService.findAllWithLimit(count);
            const stats = await this.getGroupStatsMessage(fighters);
            this.botListenerService.notifyChats([message.chat.id], {
                message: stats ? `Топ ${count} ⚣masters⚣:${stats}` : 'Пусто',
            });
        });
    }
    initMyStatsListener() {
        this.botListenerService.on('myStats', async (message) => {
            const fighters = await this.fightersService.findAllWithLimit(999);
            const yourIndex = fighters.findIndex((fighter) => fighter.userId === `${message.from.id}`);
            if (yourIndex >= 0) {
                const fighter = fighters[yourIndex];
                this.botListenerService.notifyChats([message.chat.id], {
                    message: fighter
                        ? `(${yourIndex + 1} из ${fighters.length}). У тебя в баке ${fighter.scores} ⚣semen⚣\n${fighter.wins} Побед/${fighter.looses} Поражений`
                        : 'Пусто',
                });
            }
        });
    }
    initGroupStatsListener() {
        this.botListenerService.on('chatStats', async (message) => {
            const groupDto = await this.groupService.get(message.chat.id);
            if (!groupDto) {
                return;
            }
            const fighters = Array.from(groupDto.fighters)
                .map(([userId, rest]) => ({ userId, ...rest }))
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
            .reduce((acc, curr, index) => `${acc}\n${index + 1}) ${curr.username || curr.name} - ${curr.scores} мл.`, '');
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
        const fighter = await this.createOrGetExistingFighter(message.from);
        const scene = new models_1.Scene(this.botListenerService, this.fightersService, dictionary_1.Dictionary, message.chat.id, fighter, mentionedUsername);
        this.scenes.set(scene.id, scene);
        scene.on('fightFinished', async (winner, looser) => {
            this.finishedScenes++;
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
    initBdModeSubscription() {
        this.botListenerService.on('bdMode', async (name, status) => {
            const dbUser = await this.fightersService.get({ name });
            if (dbUser.bdMode === status) {
                return;
            }
            dbUser.bdMode = status;
            await this.fightersService.update(dbUser);
            const groups = await this.groupService.findAll();
            const filteredGroups = groups.filter((ch) => !!ch.fighters.get(`${dbUser.userId}`));
            if (filteredGroups.length) {
                const ids = filteredGroups.map((g) => g.groupId);
                const notify = this.getBdNotification(name, status);
                this.botListenerService.notifyChats(ids, notify);
            }
        });
    }
    getBdNotification(name, status) {
        if (status) {
            const media = {
                type: 'video',
                id: 'CgACAgIAAxkBAAIJzmRmamOlEvUUQFNfGFBUoZAv8CCsAAIrKAACReQ5S9n0kp2iPpudLwQ',
            };
            return {
                message: `@${name}\nВ день рождения ты получаешь магический ${dictionary_messages_1.DictionaryActionTitles[lib_1.WeaponType.Rock]},\nC ним шансы на победу увеличиваются в 2 раза. Используй ${dictionary_messages_1.DictionaryActionTitles[lib_1.WeaponType.Rock]} по назначению, докажи что ты ⚣man⚣, реализуй свои ⚣deep dark fantasies⚣`,
                media,
            };
        }
        else {
            const media = {
                type: 'video',
                id: 'CgACAgIAAxkBAAOZZGA4VFfriqPgUhVdK3d_4raVGmwAAtcrAAKPBQhLCim-e_yJ30MvBA',
            };
            return {
                message: `@${name}\nМагия исчезла, твой ${dictionary_messages_1.DictionaryActionTitles[lib_1.WeaponType.Rock]} вернулся в обычное состояние, но ты все еще можешь его использовать, жду тебя в ⚣dungeon⚣`,
                media,
            };
        }
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
        const fighter = await this.createOrGetExistingFighter(query.from);
        scene.fight(fighter);
    }
    async createOrGetExistingFighter(from) {
        const userId = `${from.id}`;
        const { username, first_name } = from;
        const dbFighter = await this.fightersService.get({ userId });
        if (dbFighter) {
            dbFighter.username = username;
            dbFighter.name = first_name;
            return new models_1.Fighter(dbFighter);
        }
        const newFighter = new models_1.Fighter({ userId, name: first_name, username });
        this.fightersService.create(newFighter);
        return newFighter;
    }
    filesListener() {
        this.botListenerService.bot.on('message', (query) => {
            console.log(query?.photo);
            console.log(query?.document?.file_id);
        });
    }
    debugListeners() {
        const stages = Object.keys(dictionary_1.Dictionary);
        this.botListenerService.bot.onText(/\/debug$/, (message) => {
            this.botListenerService.bot.sendMessage(message.chat.id, stages.join('\n'));
        });
        const reg = new RegExp(`\/debug\\s(${stages.join('|')})$`);
        this.botListenerService.bot.onText(reg, (message) => {
            const chatId = message.chat.id;
            const [_, stage] = message.text.split(' ');
            const stageObject = dictionary_1.Dictionary[stage];
            if (!stageObject?.medias?.length) {
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