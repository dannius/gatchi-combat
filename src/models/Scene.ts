import { Fighter } from './Fighter';
import { getAcceptFightKeyboard, getChoseWeaponKeyboard } from 'src/lib/keyboards';
import TelegramBot = require('node-telegram-bot-api');
import { EventEmitter, delay, guid } from 'src/lib';
import { BotListenerService } from 'src/services';
import { WeaponTypes } from './weapon-types';
import { getFinalAnimation, getFinalMessage } from 'src/lib/dictionary';
import { Mention } from './mention.type';

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
  fightFinished: [winner: Fighter, looser: Fighter];
  sceneFinished: [];
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
    this.initFightFinishedListener();

    this.emit('sceneCreated');
  }

  public canAcceptFight({ id, username }: TelegramBot.User): boolean {
    const isSelfAccepted = this.sceneFighterId === id;

    if (this.isDuel) {
      const isValidDuel = this.mentionedUserName === `@${username}`;

      return isValidDuel;
    }

    return (isSelfAccepted && !!process.env.ALLOW_SELF_FIGHT) || !isSelfAccepted;
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
      await this.tgBotListenerService.bot.editMessageMedia(
        {
          type: 'photo',
          media: `AgACAgIAAxkBAAICE2ReUIvRGmfYuhYVvRIa3MWejmWSAALVyDEbIE35SsOjhK9RpiOyAQADAgADbQADLwQ`,
          caption: `@${this.fightEmitter.name} выбирай оружие`,
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
      await this.tgBotListenerService.bot.editMessageMedia(
        {
          type: 'photo',
          media: `AgACAgIAAxkBAAICI2ReUsIcbi9_znN-HMZECJx4iAUsAALoyDEbIE35SnGKbAeLK_hvAQADAgADbQADLwQ`,
          caption: `@${this.fightAccepter.name} выбирай оружие`,
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
      await this.fightStageTwo(challengeMessage.message_id);
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

      const caption = `${winner.name} -${winner.semen}(+10) мл.\n${looser.name} -${
        looser.semen
      }(+10) мл.\n\n${getFinalMessage(
        { fighter: winner, weapon: this.weapons.get(winner.id), semenDelta: 10 },
        { fighter: looser, weapon: this.weapons.get(looser.id), semenDelta: 10 },
      )}
      `;

      this.tgBotListenerService.bot.sendAnimation(this.chatId, getFinalAnimation(), { caption });
      this.emit('sceneFinished');
    });
  }

  private startChallenge(): void {
    this.tgBotListenerService.bot
      .sendPhoto(this.chatId, 'AgACAgIAAxkBAAIB7mReTBIFbiZsgxL40u1PAr3rc2d6AAK1yDEbIE35SrKQT0SCwsIJAQADAgADeAADLwQ', {
        caption: `@${this.fightEmitter.name} желает надрать кому нибудь зад`,
        reply_markup: getAcceptFightKeyboard(this.id).reply_markup,
      })
      .then((message: TelegramBot.Message) => {
        this.challengeMessageId = message.message_id;
        this.emit('challengeEmitted', message);
      });
  }

  private startDuel(mentionedUsername: Mention): void {
    this.tgBotListenerService.bot
      .sendPhoto(this.chatId, 'AgACAgIAAxkBAAIB7mReTBIFbiZsgxL40u1PAr3rc2d6AAK1yDEbIE35SrKQT0SCwsIJAQADAgADeAADLwQ', {
        caption: `@${this.fightEmitter.name} изьявил желание надрать ${mentionedUsername} зад, примет ли он бой?`,
        reply_markup: getAcceptFightKeyboard(this.id).reply_markup,
      })
      .then((message: TelegramBot.Message) => {
        this.challengeMessageId = message.message_id;
        this.emit('challengeEmitted', message);
      });
  }

  private async fightStageOne(): Promise<TelegramBot.Message> {
    return await this.tgBotListenerService.bot.sendAnimation(
      this.chatId,
      'CgACAgQAAxkBAAP8ZF1kU9QQZuZJCdEooHsWE6-UgyAAAnYDAAI7WYVSZHYv894om0UvBA',
    );
  }

  private async fightStageTwo(previousMessageId: number): Promise<boolean | TelegramBot.Message> {
    return await this.tgBotListenerService.bot.editMessageMedia(
      {
        type: 'video',
        media: 'CgACAgQAAxkBAAICHmReUgl12tN_3Ue120iaDgKmAAFhCAACEQMAAjjQBFPXWhNQFYei9S8E',
      },
      {
        message_id: previousMessageId,
        chat_id: this.chatId,
      },
    );
  }
}
