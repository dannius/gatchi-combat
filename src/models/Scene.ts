import { Fighter } from './Fighter';
import { getAcceptFightKeyboard, getChoseWeaponKeyboard } from 'src/lib/keyboards';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter, delay, guid } from 'src/lib';
import { BotListenerService } from 'src/services';
import { WeaponTypes } from './weapon-types';

import { Mention } from './mention.type';
import { Dictionary } from 'src/lib/dictionary/dictionary';

// 10 min
const SCENE_LIVE_TIME = 10 * 1000 * 60;

type SceneEvents = {
  sceneCreated: [];
  challengeEmitted: [message: TelegramBot.Message];
  fightAccepted: [fighter: Fighter];
  beforeFightEmitterWeaponChoosen: [];
  afterFightEmitterWeaponChoosen: [weapon: WeaponTypes];
  beforeFightAccepterWeaponChoosen: [];
  afterFightAccepterWeaponChoosen: [weapon: WeaponTypes];
  fightStageOne: [];
  fightStageTwo: [message: TelegramBot.Message];
  fightStageThree: [message: TelegramBot.Message];
  fightFinished: [winner: Fighter, looser: Fighter];
  destroy: [finished: boolean];
};

export class Scene extends EventEmitter<SceneEvents> {
  public id = guid();

  private fightAccepter: Fighter;

  private readonly weapons = new Map<number, WeaponTypes>();

  private challengeMessageId: number;

  private get sceneFighterId(): number {
    return this.fightEmitter.id;
  }

  private get isDuel(): boolean {
    return !!this.mentionedUserName;
  }

  constructor(
    private tgBotListenerService: BotListenerService,
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
      await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);

      this.emit('destroy', false);
    }, SCENE_LIVE_TIME);
  }

  public canAcceptFight({ id, username }: TelegramBot.User): boolean {
    const isSelfAccepted = this.sceneFighterId === id;

    if (this.isDuel) {
      const isValidDuel = this.mentionedUserName === `@${username}`;

      return isValidDuel;
    }

    return (isSelfAccepted && process.env.ALLOW_SELF_FIGHT === 'true') || !isSelfAccepted;
  }

  public setWeapon(weaponType: WeaponTypes, fighterId: number): void {
    const emitterWeapon = this.weapons.get(this.fightEmitter.id);

    if (!emitterWeapon && this.fightEmitter.id === fighterId) {
      this.emit('afterFightEmitterWeaponChoosen', weaponType);
    } else if (!!emitterWeapon && this.fightAccepter.id === fighterId) {
      this.emit('afterFightAccepterWeaponChoosen', weaponType);
    }
  }

  public fight(fightAccepter: Fighter): void {
    this.emit('fightAccepted', fightAccepter);
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
      const caption = this.dictionary.fightEmitterSelectWeapon.getMessage({ fighter1Name: this.fightEmitter.name });
      const media = this.dictionary.fightEmitterSelectWeapon.getMedia();

      await this.tgBotListenerService.bot.editMessageMedia(
        {
          type: media.type,
          media: media.id,
          caption,
        },
        {
          chat_id: this.chatId,
          message_id: this.challengeMessageId,
          reply_markup: getChoseWeaponKeyboard(this.id).reply_markup,
        },
      );
    });
  }

  private afterFightEmitterWeaponChooseListener(): void {
    this.on('afterFightEmitterWeaponChoosen', (weapon) => {
      this.weapons.set(this.fightEmitter.id, weapon);
      this.emit('beforeFightAccepterWeaponChoosen');
    });
  }

  private beforeFightAccepterWeaponChooseListener(): void {
    this.on('beforeFightAccepterWeaponChoosen', async () => {
      const caption = this.dictionary.fightAccepterSelectWeapon.getMessage({ fighter1Name: this.fightAccepter.name });
      const media = this.dictionary.fightAccepterSelectWeapon.getMedia();

      await this.tgBotListenerService.bot.editMessageMedia(
        {
          type: media.type,
          media: media.id,
          caption,
        },
        {
          chat_id: this.chatId,
          message_id: this.challengeMessageId,
          reply_markup: getChoseWeaponKeyboard(this.id).reply_markup,
        },
      );
    });
  }

  private afterFightAccepterWeaponChooseListener(): void {
    this.on('afterFightAccepterWeaponChoosen', async (weapon) => {
      await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
      this.weapons.set(this.fightAccepter.id, weapon);

      this.emit('fightStageOne');
    });
  }

  private initFightStageOneListener(): void {
    this.on('fightStageOne', async () => {
      const message = await this.fightStageOne();
      await delay(2000);

      this.emit('fightStageTwo', message);
    });
  }

  private initFightStageTwoListener(): void {
    this.on('fightStageTwo', async (challengeMessage) => {
      const message = await this.fightStageTwo(challengeMessage.message_id);
      await delay(2000);

      this.emit('fightStageThree', message as TelegramBot.Message);
    });
  }

  private initFightStageThreeListener(): void {
    this.on('fightStageThree', async (challengeMessage) => {
      await this.fightStageThree(challengeMessage.message_id);
      await delay(2000);

      await this.tgBotListenerService.bot.deleteMessage(this.chatId, challengeMessage.message_id);
      const { winner, looser } = this.fightEmitter.fight(this.fightAccepter);
      this.emit('fightFinished', winner, looser);
    });
  }

  private initFightFinishedListener(): void {
    // finish
    this.on('fightFinished', (winner, looser) => {
      winner.fights += 1;
      winner.wins += 1;

      looser.fights += 1;
      looser.looses += 1;

      const caption = this.dictionary.final.getMessage({
        fighter1Name: winner.name,
        fighter2Name: looser.name,
        fighter1Weapon: this.weapons.get(winner.id),
        fighter2Weapon: this.weapons.get(looser.id),
        fighter1SemenTotal: `${winner.semen}`,
        fighter2SemenTotal: `${looser.semen}`,
        fighter1SemenAdded: '+10',
        fighter2SemenAdded: '-10',
      });

      const media = this.dictionary.final.getMedia();

      if (media.type === 'photo') {
        this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, { caption });
      } else if (media.type === 'video') {
        this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, { caption });
      }
      this.emit('destroy', true);
    });
  }

  private startChallenge(): void {
    const caption = this.dictionary.startChallenge.getMessage({ fighter1Name: this.fightEmitter.name });
    const media = this.dictionary.startChallenge.getMedia();

    if (media.type === 'photo') {
      this.tgBotListenerService.bot
        .sendPhoto(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightKeyboard(this.id).reply_markup,
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    } else if (media.type === 'video') {
      this.tgBotListenerService.bot
        .sendAnimation(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightKeyboard(this.id).reply_markup,
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    }
  }

  private startDuel(mentionedUsername: Mention): void {
    const caption = this.dictionary.startDuel.getMessage({
      fighter1Name: this.fightEmitter.name,
      fighter2Name: mentionedUsername,
    });

    const media = this.dictionary.startDuel.getMedia();

    if (media.type === 'photo') {
      this.tgBotListenerService.bot
        .sendPhoto(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightKeyboard(this.id).reply_markup,
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    } else if (media.type === 'video') {
      this.tgBotListenerService.bot
        .sendAnimation(this.chatId, media.id, {
          caption,
          reply_markup: getAcceptFightKeyboard(this.id).reply_markup,
        })
        .then((message: TelegramBot.Message) => {
          this.challengeMessageId = message.message_id;
          this.emit('challengeEmitted', message);
        });
    }
  }

  private async fightStageOne(): Promise<TelegramBot.Message> {
    const media = this.dictionary.fightStageOne.getMedia();

    if (media.type === 'photo') {
      return this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id);
    } else if (media.type === 'video') {
      return await this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id);
    }
  }

  private async fightStageTwo(previousMessageId: number): Promise<boolean | TelegramBot.Message> {
    const media = this.dictionary.fightStageTwo.getMedia();

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
    const media = this.dictionary.fightStageThree.getMedia();

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
