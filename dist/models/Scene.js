"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const keyboards_1 = require("../lib/keyboards");
const lib_1 = require("../lib");
const dictionary_messages_1 = require("../lib/dictionary/dictionary-messages");
const SCENE_LIVE_TIME = 10 * 1000 * 60;
const FIGHT_DELAY = 3 * 1000;
class Scene extends lib_1.EventEmitter {
    get sceneFighterId() {
        return this.fightEmitter.userId;
    }
    get isDuel() {
        return !!this.mentionedUserName;
    }
    constructor(tgBotListenerService, fighterService, dictionary, chatId, fightEmitter, mentionedUserName) {
        super();
        this.tgBotListenerService = tgBotListenerService;
        this.fighterService = fighterService;
        this.dictionary = dictionary;
        this.chatId = chatId;
        this.fightEmitter = fightEmitter;
        this.mentionedUserName = mentionedUserName;
        this.id = (0, lib_1.guid)();
        this.weapons = new Map();
        if (this.mentionedUserName) {
            this.startDuel(mentionedUserName);
        }
        else {
            this.startChallenge();
        }
        this.initSceneCreatedListener();
        this.initСhallengeEmittedListener();
        this.initFightAcceptedListener();
        this.beforeFightEmitterWeaponChooseListener();
        this.afterFightEmitterWeaponChooseListener();
        this.beforeFightAccepterWeaponChooseListener();
        this.afterFightAccepterWeaponChooseListener();
        this.initFightStageOneListener();
        this.initFightStageTwoListener();
        this.initFightStageThreeListener();
        this.initFightFinishedListener();
        this.emit('sceneCreated');
        setTimeout(async () => {
            try {
                await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
            }
            catch (_a) { }
            this.emit('destroy');
        }, SCENE_LIVE_TIME);
    }
    canAcceptFight({ id, username }) {
        const isSelfAccepted = this.sceneFighterId === `${id}`;
        if (this.isDuel) {
            const isValidDuel = this.mentionedUserName === `@${username}`;
            return isValidDuel;
        }
        return (isSelfAccepted && process.env.ALLOW_SELF_FIGHT === 'true') || !isSelfAccepted;
    }
    setWeapon(weaponType, fighterId) {
        const emitterWeapon = this.getWeapon(this.fightEmitter.userId);
        if (!emitterWeapon && this.fightEmitter.userId === fighterId) {
            this.emit('afterFightEmitterWeaponChoosen', weaponType);
        }
        else if (!!emitterWeapon && this.fightAccepter.userId === fighterId) {
            this.emit('afterFightAccepterWeaponChoosen', weaponType);
        }
    }
    fight(fightAccepter) {
        this.emit('fightAccepted', fightAccepter);
    }
    getWeapon(userId) {
        return this.weapons.get(userId);
    }
    initSceneCreatedListener() {
        this.on('sceneCreated', () => {
        });
    }
    initСhallengeEmittedListener() {
        this.on('challengeEmitted', () => {
        });
    }
    initFightAcceptedListener() {
        this.on('fightAccepted', (fighter) => {
            this.fightAccepter = fighter;
            this.emit('beforeFightEmitterWeaponChoosen');
        });
    }
    beforeFightEmitterWeaponChooseListener() {
        this.on('beforeFightEmitterWeaponChoosen', async () => {
            const caption = this.dictionary.FightEmitterSelectWeapon.getMessage({
                fighter1Name: this.fightEmitter.username ? `@${this.fightEmitter.username}` : this.fightEmitter.name,
                fighter2Name: this.fightAccepter.username ? `@${this.fightAccepter.username}` : this.fightAccepter.name,
            });
            const media = this.dictionary.FightEmitterSelectWeapon.getMedia();
            const reply_markup = (0, keyboards_1.getChoseWeaponReplyMarkup)(this.id);
            const params = { caption, reply_markup };
            try {
                await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
                if (media.type === 'photo') {
                    const message = await this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, params);
                    this.challengeMessageId = message.message_id;
                }
                else if (media.type === 'video') {
                    const message = await this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, params);
                    this.challengeMessageId = message.message_id;
                }
            }
            catch (_a) { }
        });
    }
    afterFightEmitterWeaponChooseListener() {
        this.on('afterFightEmitterWeaponChoosen', (weapon) => {
            this.weapons.set(this.fightEmitter.userId, weapon);
            this.emit('beforeFightAccepterWeaponChoosen');
        });
    }
    beforeFightAccepterWeaponChooseListener() {
        this.on('beforeFightAccepterWeaponChoosen', async () => {
            const caption = this.dictionary.FightAccepterSelectWeapon.getMessage({
                fighter1Name: this.fightEmitter.username ? `@${this.fightEmitter.username}` : this.fightEmitter.name,
                fighter2Name: this.fightAccepter.username ? `@${this.fightAccepter.username}` : this.fightAccepter.name,
                fighter1Weapon: this.getWeapon(this.fightEmitter.userId),
            });
            const media = this.dictionary.FightAccepterSelectWeapon.getMedia();
            const reply_markup = (0, keyboards_1.getChoseWeaponReplyMarkup)(this.id);
            const params = { caption, reply_markup };
            try {
                await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
                if (media.type === 'photo') {
                    const message = await this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, params);
                    this.challengeMessageId = message.message_id;
                }
                else if (media.type === 'video') {
                    const message = await this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, params);
                    this.challengeMessageId = message.message_id;
                }
            }
            catch (_a) { }
        });
    }
    afterFightAccepterWeaponChooseListener() {
        this.on('afterFightAccepterWeaponChoosen', async (weapon) => {
            try {
                await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
                this.weapons.set(this.fightAccepter.userId, weapon);
                this.emit('fightStageOne');
            }
            catch (_a) { }
        });
    }
    initFightStageOneListener() {
        this.on('fightStageOne', async () => {
            const message = await this.fightStageOne();
            await (0, lib_1.delay)(FIGHT_DELAY);
            this.emit('fightStageTwo', message);
        });
    }
    initFightStageTwoListener() {
        this.on('fightStageTwo', async (challengeMessage) => {
            const message = await this.fightStageTwo(challengeMessage.message_id);
            await (0, lib_1.delay)(FIGHT_DELAY);
            this.emit('fightStageThree', message);
        });
    }
    initFightStageThreeListener() {
        this.on('fightStageThree', async (challengeMessage) => {
            await this.fightStageThree(challengeMessage.message_id);
            await (0, lib_1.delay)(FIGHT_DELAY);
            await this.tgBotListenerService.bot.deleteMessage(this.chatId, challengeMessage.message_id);
            const { winner, looser, addedWin, addedLose } = this.fightEmitter.fight(this.getWeapon(this.fightEmitter.userId), this.fightAccepter, this.getWeapon(this.fightAccepter.userId));
            const latestWinnerDto = await this.fighterService.get({ userId: winner.userId });
            const latestLooserDto = await this.fighterService.get({ userId: looser.userId });
            winner.scores = latestWinnerDto.scores + addedWin;
            looser.scores = latestLooserDto.scores - addedLose;
            const winObject = {
                fighter: winner,
                addedScores: addedWin,
                weapon: this.getWeapon(winner.userId),
            };
            const loseObject = {
                fighter: looser,
                addedScores: addedLose,
                weapon: this.getWeapon(looser.userId),
            };
            this.emit('fightFinished', winObject, loseObject);
        });
    }
    initFightFinishedListener() {
        this.on('fightFinished', (winner, looser) => {
            winner.fighter.fights += 1;
            winner.fighter.wins += 1;
            looser.fighter.fights += 1;
            looser.fighter.looses += 1;
            this.fighterService.update(winner.fighter);
            this.fighterService.update(looser.fighter);
            const caption = this.dictionary.Final.getMessage({
                fighter1Name: this.fightEmitter.username ? this.fightEmitter.username : this.fightEmitter.name,
                fighter2Name: this.fightAccepter.username ? this.fightAccepter.username : this.fightAccepter.name,
                fighter1Weapon: dictionary_messages_1.DictionaryActionTitles[this.getWeapon(winner.fighter.userId)],
                fighter2Weapon: dictionary_messages_1.DictionaryActionTitles[this.getWeapon(looser.fighter.userId)],
                fighter1ScoresTotal: `${winner.fighter.scores}`,
                fighter2ScoresTotal: `${looser.fighter.scores}`,
                fighter1ScoresAdded: `+${winner.addedScores}`,
                fighter2ScoresAdded: `-${looser.addedScores}`,
            });
            const media = this.dictionary.Final.getMedia();
            if (media.type === 'photo') {
                this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, { caption });
            }
            else if (media.type === 'video') {
                this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, { caption });
            }
            this.emit('destroy');
        });
    }
    startChallenge() {
        const caption = this.dictionary.StartChallenge.getMessage({
            fighter1Name: this.fightEmitter.username ? `@${this.fightEmitter.username}` : this.fightEmitter.name,
        });
        const media = this.dictionary.StartChallenge.getMedia();
        if (media.type === 'photo') {
            this.tgBotListenerService.bot
                .sendPhoto(this.chatId, media.id, {
                caption,
                reply_markup: (0, keyboards_1.getAcceptFightReplyMarkup)(this.id),
            })
                .then((message) => {
                this.challengeMessageId = message.message_id;
                this.emit('challengeEmitted', message);
            });
        }
        else if (media.type === 'video') {
            this.tgBotListenerService.bot
                .sendAnimation(this.chatId, media.id, {
                caption,
                reply_markup: (0, keyboards_1.getAcceptFightReplyMarkup)(this.id),
            })
                .then((message) => {
                this.challengeMessageId = message.message_id;
                this.emit('challengeEmitted', message);
            });
        }
    }
    startDuel(mentionedUsername) {
        const caption = this.dictionary.StartDuel.getMessage({
            fighter1Name: this.fightEmitter.username ? `@${this.fightEmitter.username}` : this.fightEmitter.name,
            fighter2Name: mentionedUsername,
        });
        const media = this.dictionary.StartDuel.getMedia();
        if (media.type === 'photo') {
            this.tgBotListenerService.bot
                .sendPhoto(this.chatId, media.id, {
                caption,
                reply_markup: (0, keyboards_1.getAcceptFightReplyMarkup)(this.id),
            })
                .then((message) => {
                this.challengeMessageId = message.message_id;
                this.emit('challengeEmitted', message);
            });
        }
        else if (media.type === 'video') {
            this.tgBotListenerService.bot
                .sendAnimation(this.chatId, media.id, {
                caption,
                reply_markup: (0, keyboards_1.getAcceptFightReplyMarkup)(this.id),
            })
                .then((message) => {
                this.challengeMessageId = message.message_id;
                this.emit('challengeEmitted', message);
            });
        }
    }
    async fightStageOne() {
        const media = this.dictionary.FightStageOne.getMedia();
        if (media.type === 'photo') {
            return this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id);
        }
        else if (media.type === 'video') {
            return await this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id);
        }
    }
    async fightStageTwo(previousMessageId) {
        const media = this.dictionary.FightStageTwo.getMedia();
        return await this.tgBotListenerService.bot.editMessageMedia({
            type: media.type,
            media: media.id,
        }, {
            message_id: previousMessageId,
            chat_id: this.chatId,
        });
    }
    async fightStageThree(previousMessageId) {
        const media = this.dictionary.FightStageThree.getMedia();
        return await this.tgBotListenerService.bot.editMessageMedia({
            type: media.type,
            media: media.id,
        }, {
            message_id: previousMessageId,
            chat_id: this.chatId,
        });
    }
}
exports.Scene = Scene;
//# sourceMappingURL=Scene.js.map