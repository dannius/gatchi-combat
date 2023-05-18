import { Fighter } from './Fighter';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter, WeaponType, Mention } from 'src/lib';
import { BotListenerService } from 'src/services';
import { Dictionary } from 'src/lib/dictionary/dictionary';
import { FighterService } from 'src/db/fighters';
export type FinisSceneFighter = {
    fighter: Fighter;
    weapon: WeaponType;
    addedScores: number;
};
type SceneEvents = {
    sceneCreated: [];
    challengeEmitted: [message: TelegramBot.Message];
    fightAccepted: [fighter: Fighter];
    beforeFightEmitterWeaponChoosen: [];
    afterFightEmitterWeaponChoosen: [weapon: WeaponType];
    beforeFightAccepterWeaponChoosen: [];
    afterFightAccepterWeaponChoosen: [weapon: WeaponType];
    fightStageOne: [];
    fightStageTwo: [message: TelegramBot.Message];
    fightStageThree: [message: TelegramBot.Message];
    fightFinished: [winner: FinisSceneFighter, looser: FinisSceneFighter];
    destroy: [];
};
export declare class Scene extends EventEmitter<SceneEvents> {
    private tgBotListenerService;
    private fighterService;
    private dictionary;
    private chatId;
    private fightEmitter;
    private mentionedUserName?;
    id: string;
    private fightAccepter;
    private readonly weapons;
    private challengeMessageId;
    private get sceneFighterId();
    private get isDuel();
    constructor(tgBotListenerService: BotListenerService, fighterService: FighterService, dictionary: typeof Dictionary, chatId: number, fightEmitter: Fighter, mentionedUserName?: Mention);
    canAcceptFight({ id, username }: TelegramBot.User): boolean;
    setWeapon(weaponType: WeaponType, fighterId: string): void;
    fight(fightAccepter: Fighter): void;
    private getWeapon;
    private initSceneCreatedListener;
    private initСhallengeEmittedListener;
    private initFightAcceptedListener;
    private beforeFightEmitterWeaponChooseListener;
    private afterFightEmitterWeaponChooseListener;
    private beforeFightAccepterWeaponChooseListener;
    private afterFightAccepterWeaponChooseListener;
    private initFightStageOneListener;
    private initFightStageTwoListener;
    private initFightStageThreeListener;
    private initFightFinishedListener;
    private startChallenge;
    private startDuel;
    private fightStageOne;
    private fightStageTwo;
    private fightStageThree;
}
export {};
