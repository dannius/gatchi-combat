import { Fighter } from './Fighter';
import { getAcceptFightReplyMarkup, getChoseWeaponReplyMarkup } from 'src/lib/keyboards';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter, WeaponType, delay, guid } from 'src/lib';
import { BotListenerService } from 'src/services';

import { Mention } from './mention.type';
import { Dictionary } from 'src/lib/dictionary/dictionary';

// 10 min
const SCENE_LIVE_TIME = 10 * 1000 * 60;

const FIGHT_DELAY = 3 * 1000;

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
  fightFinished: [winner: Fighter, looser: Fighter, addedWin: number, addedLose: number];
  destroy: [finished: boolean];
};

export class Scene extends EventEmitter<SceneEvents> {
  public id = guid();

  private fightAccepter: Fighter;

  private readonly weapons = new Map<number, WeaponType>();

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

  public setWeapon(weaponType: WeaponType, fighterId: number): void {
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
      const caption = this.dictionary.FightEmitterSelectWeapon.getMessage({ fighter1Name: this.fightEmitter.name });
      const media = this.dictionary.FightEmitterSelectWeapon.getMedia();

      await this.tgBotListenerService.bot.editMessageMedia(
        {
          type: media.type,
          media: media.id,
          caption,
        },
        {
          chat_id: this.chatId,
          message_id: this.challengeMessageId,
          reply_markup: getChoseWeaponReplyMarkup(this.id),
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
      const caption = this.dictionary.FightAccepterSelectWeapon.getMessage({ fighter1Name: this.fightAccepter.name });
      const media = this.dictionary.FightAccepterSelectWeapon.getMedia();

      await this.tgBotListenerService.bot.editMessageMedia(
        {
          type: media.type,
          media: media.id,
          caption,
        },
        {
          chat_id: this.chatId,
          message_id: this.challengeMessageId,
          reply_markup: getChoseWeaponReplyMarkup(this.id),
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
      const { winner, looser, addedWin, addedLose } = this.fightEmitter.fight(this.fightAccepter);
      this.emit('fightFinished', winner, looser, addedWin, addedLose);
    });
  }

  private initFightFinishedListener(): void {
    // finish
    this.on('fightFinished', (winner, looser, addedWin, addedLose) => {
      winner.fights += 1;
      winner.wins += 1;

      looser.fights += 1;
      looser.looses += 1;

      const caption = this.dictionary.Final.getMessage({
        fighter1Name: winner.name,
        fighter2Name: looser.name,
        fighter1Weapon: this.weapons.get(winner.id),
        fighter2Weapon: this.weapons.get(looser.id),
        fighter1ScoresTotal: `${winner.scores}`,
        fighter2ScoresTotal: `${looser.scores}`,
        fighter1ScoresAdded: `+${addedWin}`,
        fighter2ScoresAdded: `-${addedLose}`,
      });

      const media = this.dictionary.Final.getMedia();

      if (media.type === 'photo') {
        this.tgBotListenerService.bot.sendPhoto(this.chatId, media.id, { caption });
      } else if (media.type === 'video') {
        this.tgBotListenerService.bot.sendAnimation(this.chatId, media.id, { caption });
      }
      this.emit('destroy', true);
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
