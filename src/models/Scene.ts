import { Fighter } from './Fighter';
import { getAcceptFightReplyMarkup, getChoseWeaponReplyMarkup } from 'src/lib/keyboards';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter, WeaponType, delay, guid, Mention } from 'src/lib';
import { BotListenerService } from 'src/services';

import { Dictionary } from 'src/lib/dictionary/dictionary';
import { DictionaryActionTitles } from 'src/lib/dictionary/dictionary-messages';
import { FighterService } from 'src/db/fighters';

// 10 min
const SCENE_LIVE_TIME = 10 * 1000 * 60;
const FIGHT_DELAY = 3 * 1000;

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
  // scene might be removed and not finished
  destroy: [];
};

export class Scene extends EventEmitter<SceneEvents> {
  public id = guid();

  private fightAccepter: Fighter;

  private readonly weapons = new Map<string, WeaponType>();

  private challengeMessageId: number;

  private get sceneFighterId(): string {
    return this.fightEmitter.userId;
  }

  private get isDuel(): boolean {
    return !!this.mentionedUserName;
  }

  constructor(
    private tgBotListenerService: BotListenerService,
    private fighterService: FighterService,
    private dictionary: typeof Dictionary,
    private chatId: number,
    private fightEmitter: Fighter,
    private mentionedUserName?: Mention,
  ) {
    super();

    if (this.mentionedUserName) {
      this.startDuel(mentionedUserName);
    } else {
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

    // destroy scene if no resonse
    setTimeout(async () => {
      try {
        await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
      } catch {}

      this.emit('destroy');
    }, SCENE_LIVE_TIME);
  }

  public canAcceptFight({ id, username }: TelegramBot.User): boolean {
    const isSelfAccepted = this.sceneFighterId === `${id}`;

    if (this.isDuel) {
      const isValidDuel = this.mentionedUserName === `@${username}`;

      return isValidDuel;
    }

    return (isSelfAccepted && process.env.ALLOW_SELF_FIGHT === 'true') || !isSelfAccepted;
  }

  public setWeapon(weaponType: WeaponType, fighterId: string): void {
    const emitterWeapon = this.getWeapon(this.fightEmitter.userId);

    if (!emitterWeapon && this.fightEmitter.userId === fighterId) {
      this.emit('afterFightEmitterWeaponChoosen', weaponType);
    } else if (!!emitterWeapon && this.fightAccepter.userId === fighterId) {
      this.emit('afterFightAccepterWeaponChoosen', weaponType);
    }
  }

  public fight(fightAccepter: Fighter): void {
    this.emit('fightAccepted', fightAccepter);
  }

  private getWeapon(userId: string): WeaponType {
    return this.weapons.get(userId);
  }

  private initSceneCreatedListener(): void {
    this.on('sceneCreated', () => {
      ///
    });
  }

  private initСhallengeEmittedListener(): void {
    this.on('challengeEmitted', () => {
      ///
    });
  }

  private initFightAcceptedListener(): void {
    this.on('fightAccepted', (fighter) => {
      this.fightAccepter = fighter;
      this.emit('beforeFightEmitterWeaponChoosen');
    });
  }

  private beforeFightEmitterWeaponChooseListener(): void {
    this.on('beforeFightEmitterWeaponChoosen', async () => {
      const caption = this.dictionary.FightEmitterSelectWeapon.getMessage({ fighter1Name: this.fightEmitter.name });
      const media = this.dictionary.FightEmitterSelectWeapon.getMedia();
      const reply_markup = getChoseWeaponReplyMarkup(this.id);
      const params = { caption, reply_markup };

      try {
        await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
        if (media.type === 'photo') {
          const message = await this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, params);
          this.challengeMessageId = message.message_id;
        } else if (media.type === 'video') {
          const message = await this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, params);
          this.challengeMessageId = message.message_id;
        }
      } catch {}
    });
  }

  private afterFightEmitterWeaponChooseListener(): void {
    this.on('afterFightEmitterWeaponChoosen', (weapon) => {
      this.weapons.set(this.fightEmitter.userId, weapon);
      this.emit('beforeFightAccepterWeaponChoosen');
    });
  }

  private beforeFightAccepterWeaponChooseListener(): void {
    this.on('beforeFightAccepterWeaponChoosen', async () => {
      const caption = this.dictionary.FightAccepterSelectWeapon.getMessage({ fighter1Name: this.fightAccepter.name });
      const media = this.dictionary.FightAccepterSelectWeapon.getMedia();
      const reply_markup = getChoseWeaponReplyMarkup(this.id);
      const params = { caption, reply_markup };

      try {
        await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
        if (media.type === 'photo') {
          const message = await this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, params);
          this.challengeMessageId = message.message_id;
        } else if (media.type === 'video') {
          const message = await this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, params);
          this.challengeMessageId = message.message_id;
        }
      } catch {}
    });
  }

  private afterFightAccepterWeaponChooseListener(): void {
    this.on('afterFightAccepterWeaponChoosen', async (weapon) => {
      try {
        await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
        this.weapons.set(this.fightAccepter.userId, weapon);
        this.emit('fightStageOne');
      } catch {}
    });
  }

  private initFightStageOneListener(): void {
    this.on('fightStageOne', async () => {
      const message = await this.fightStageOne();
      await delay(FIGHT_DELAY);

      this.emit('fightStageTwo', message);
    });
  }

  private initFightStageTwoListener(): void {
    this.on('fightStageTwo', async (challengeMessage) => {
      const message = await this.fightStageTwo(challengeMessage.message_id);
      await delay(FIGHT_DELAY);

      this.emit('fightStageThree', message as TelegramBot.Message);
    });
  }

  private initFightStageThreeListener(): void {
    this.on('fightStageThree', async (challengeMessage) => {
      await this.fightStageThree(challengeMessage.message_id);
      await delay(FIGHT_DELAY);

      await this.tgBotListenerService.bot.deleteMessage(this.chatId, challengeMessage.message_id);
      const { winner, looser, addedWin, addedLose } = this.fightEmitter.fight(
        this.getWeapon(this.fightEmitter.userId),
        this.fightAccepter,
        this.getWeapon(this.fightAccepter.userId),
      );

      const latestWinnerDto = await this.fighterService.get({ userId: winner.userId });
      const latestLooserDto = await this.fighterService.get({ userId: looser.userId });

      const latestWinner = new Fighter({ ...latestWinnerDto, scores: latestWinnerDto.scores + addedWin });
      const latestLooser = new Fighter({ ...latestLooserDto, scores: latestLooserDto.scores - addedLose });

      const winObject = {
        fighter: latestWinner,
        addedScores: addedWin,
        weapon: this.getWeapon(winner.userId),
      };

      const loseObject = {
        fighter: latestLooser,
        addedScores: addedLose,
        weapon: this.getWeapon(looser.userId),
      };

      this.emit('fightFinished', winObject, loseObject);
    });
  }

  private initFightFinishedListener(): void {
    // finish
    this.on('fightFinished', (winner, looser) => {
      winner.fighter.fights += 1;
      winner.fighter.wins += 1;

      looser.fighter.fights += 1;
      looser.fighter.looses += 1;

      const caption = this.dictionary.Final.getMessage({
        fighter1Name: winner.fighter.name,
        fighter2Name: looser.fighter.name,
        fighter1Weapon: DictionaryActionTitles[this.getWeapon(winner.fighter.userId)],
        fighter2Weapon: DictionaryActionTitles[this.getWeapon(looser.fighter.userId)],
        fighter1ScoresTotal: `${winner.fighter.scores}`,
        fighter2ScoresTotal: `${looser.fighter.scores}`,
        fighter1ScoresAdded: `+${winner.addedScores}`,
        fighter2ScoresAdded: `-${looser.addedScores}`,
      });

      const media = this.dictionary.Final.getMedia();

      if (media.type === 'photo') {
        this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, { caption });
      } else if (media.type === 'video') {
        this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, { caption });
      }
      this.emit('destroy');
    });
  }

  private startChallenge(): void {
    const caption = this.dictionary.StartChallenge.getMessage({ fighter1Name: this.fightEmitter.name });
    const media = this.dictionary.StartChallenge.getMedia();

    if (media.type === 'photo') {
      this.tgBotListenerService.bot
        .sendPhoto(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightReplyMarkup(this.id),
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    } else if (media.type === 'video') {
      this.tgBotListenerService.bot
        .sendAnimation(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightReplyMarkup(this.id),
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    }
  }

  private startDuel(mentionedUsername: Mention): void {
    const caption = this.dictionary.StartDuel.getMessage({
      fighter1Name: this.fightEmitter.name,
      fighter2Name: mentionedUsername,
    });

    const media = this.dictionary.StartDuel.getMedia();

    if (media.type === 'photo') {
      this.tgBotListenerService.bot
        .sendPhoto(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightReplyMarkup(this.id),
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    } else if (media.type === 'video') {
      this.tgBotListenerService.bot
        .sendAnimation(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightReplyMarkup(this.id),
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    }
  }

  private async fightStageOne(): Promise<TelegramBot.Message> {
    const media = this.dictionary.FightStageOne.getMedia();

    if (media.type === 'photo') {
      return this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id);
    } else if (media.type === 'video') {
      return await this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id);
    }
  }

  private async fightStageTwo(previousMessageId: number): Promise<boolean | TelegramBot.Message> {
    const media = this.dictionary.FightStageTwo.getMedia();

    return await this.tgBotListenerService.bot.editMessageMedia(
      {
        type: media.type,
        media: media.id,
      },
      {
        message_id: previousMessageId,
        chat_id: this.chatId,
      },
    );
  }

  private async fightStageThree(previousMessageId: number): Promise<boolean | TelegramBot.Message> {
    const media = this.dictionary.FightStageThree.getMedia();

    return await this.tgBotListenerService.bot.editMessageMedia(
      {
        type: media.type,
        media: media.id,
      },
      {
        message_id: previousMessageId,
        chat_id: this.chatId,
      },
    );
  }
}
