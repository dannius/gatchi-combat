import { Fighter } from './Fighter';
import { guid } from 'src/lib/guid';
import { getAcceptFightKeyboard, getChoseWeaponKeyboard } from 'src/lib/keyboards';
import { BehaviorSubject, Observable, Subject, merge, take, takeUntil, tap } from 'rxjs';
import TelegramBot = require('node-telegram-bot-api');
import { delay } from 'src/lib';
import { BotListenerService } from 'src/services';
import { WeaponTypes } from './weapon-types';
import { getFinalAnimation, getFinalMessage } from 'src/lib/dictionary';

export interface SceneEvents {
  sceneCreated$: Observable<void>;
  challengeEmitted$: Observable<TelegramBot.Message>;
  fightAccepted$: Observable<Fighter>;
  beforeFightEmitterWeaponChoosen$: Observable<void>;
  afterFightEmitterWeaponChoosen$: Observable<WeaponTypes>;
  beforeFightAccepterWeaponChoosen$: Observable<void>;
  afterFightAccepterWeaponChoosen$: Observable<WeaponTypes>;
  fightStageOne$: Observable<void>;
  fightStageTwo$: Observable<TelegramBot.Message>;
  fightFinished$: Observable<{ winner: Fighter; looser: Fighter }>;
  sceneFinished$: Observable<void>;
}

export class Scene implements SceneEvents {
  public id = guid();

  private fightAccepter: Fighter;

  private readonly weapons = new Map<number, WeaponTypes>();

  private challengeMessageId: number;

  private _sceneCreated$ = new BehaviorSubject<void>(undefined);
  private _challengeEmitted$ = new Subject<TelegramBot.Message>();
  private _fightAccepted$ = new Subject<Fighter>();
  private _beforeFightEmitterWeaponChoosen$ = new Subject<void>();
  private _afterFightEmitterWeaponChoosen$ = new Subject<WeaponTypes>();
  private _beforeFightAccepterWeaponChoosen$ = new Subject<void>();
  private _afterFightAccepterWeaponChoosen$ = new Subject<WeaponTypes>();
  private _fightStageOne$ = new Subject<void>();
  private _fightStageTwo$ = new Subject<TelegramBot.Message>();
  private _fightFinished$ = new Subject<{ winner: Fighter; looser: Fighter }>();
  private _sceneFinished$ = new Subject<void>();

  public sceneCreated$ = this._sceneCreated$.asObservable().pipe(take(1));
  public challengeEmitted$ = this._challengeEmitted$.asObservable().pipe(take(1));
  public fightAccepted$ = this._fightAccepted$.asObservable().pipe(take(1));
  public beforeFightEmitterWeaponChoosen$ = this._beforeFightEmitterWeaponChoosen$.asObservable().pipe(take(1));
  public afterFightEmitterWeaponChoosen$ = this._afterFightEmitterWeaponChoosen$.asObservable().pipe(take(1));
  public beforeFightAccepterWeaponChoosen$ = this._beforeFightAccepterWeaponChoosen$.asObservable().pipe(take(1));
  public afterFightAccepterWeaponChoosen$ = this._afterFightAccepterWeaponChoosen$.asObservable().pipe(take(1));
  public fightStageOne$ = this._fightStageOne$.asObservable().pipe(take(1));
  public fightStageTwo$ = this._fightStageTwo$.asObservable().pipe(take(1));
  public fightFinished$ = this._fightFinished$.asObservable().pipe(take(1));
  public sceneFinished$ = this._sceneFinished$.asObservable().pipe(take(1));

  public get sceneFighterId(): number {
    return this.fightEmitter.id;
  }

  constructor(private tgBotListenerService: BotListenerService, private fightEmitter: Fighter, private chatId: number) {
    this._sceneCreated$.next();
    this.startChallenge();

    merge(
      this.initSceneCreatedListener(),
      this.initСhallengeEmittedListener(),
      this.initFightAcceptedListener(),
      this.beforeFightEmitterWeaponChooseListener(),
      this.afterFightEmitterWeaponChooseListener(),
      this.beforeFightAccepterWeaponChooseListener(),
      this.afterFightAccepterWeaponChooseListener(),
      this.initFightStageOneListener(),
      this.initFightStageTwoListener(),
      this.initFightFinishedListener(),
    )
      .pipe(takeUntil(this.sceneFinished$))
      .subscribe();
  }

  public setWeapon(weaponType: WeaponTypes, fighterId: number): void {
    const emitterWeapon = this.weapons.get(this.fightEmitter.id);

    if (!emitterWeapon && this.fightEmitter.id === fighterId) {
      this._afterFightEmitterWeaponChoosen$.next(weaponType);
    } else if (!!emitterWeapon && this.fightAccepter.id === fighterId) {
      this._afterFightAccepterWeaponChoosen$.next(weaponType);
    }
  }

  public fight(fightAccepter: Fighter): void {
    this._fightAccepted$.next(fightAccepter);
  }

  public destroyScene(): void {
    this._sceneFinished$.next(undefined);
  }

  private initSceneCreatedListener(): Observable<void> {
    return this.sceneCreated$.pipe(
      tap(() => {
        console.log('scene created');
      }),
    );
  }

  private initСhallengeEmittedListener(): Observable<TelegramBot.Message> {
    return this.challengeEmitted$.pipe(
      tap(() => {
        console.log('Challenge emitted');
      }),
    );
  }

  private initFightAcceptedListener(): Observable<Fighter> {
    return this.fightAccepted$.pipe(
      tap(async (fighter) => {
        this.fightAccepter = fighter;
        this._beforeFightEmitterWeaponChoosen$.next();
      }),
    );
  }

  private beforeFightEmitterWeaponChooseListener(): Observable<void> {
    return this._beforeFightEmitterWeaponChoosen$.pipe(
      tap(async () => {
        await this.tgBotListenerService.bot.editMessageMedia(
          {
            type: 'photo',
            media: `AgACAgIAAxkBAAICE2ReUIvRGmfYuhYVvRIa3MWejmWSAALVyDEbIE35SsOjhK9RpiOyAQADAgADbQADLwQ`,
            caption: `${this.fightEmitter.name} выбирай оружие`,
          },
          {
            chat_id: this.chatId,
            message_id: this.challengeMessageId,
            reply_markup: getChoseWeaponKeyboard(this.id).reply_markup,
          },
        );
      }),
    );
  }

  private afterFightEmitterWeaponChooseListener(): Observable<WeaponTypes> {
    return this._afterFightEmitterWeaponChoosen$.pipe(
      tap(async (weaponType) => {
        this.weapons.set(this.fightEmitter.id, weaponType);
        this._beforeFightAccepterWeaponChoosen$.next();
      }),
    );
  }

  private beforeFightAccepterWeaponChooseListener(): Observable<void> {
    return this._beforeFightAccepterWeaponChoosen$.pipe(
      tap(async () => {
        await this.tgBotListenerService.bot.editMessageMedia(
          {
            type: 'photo',
            media: `AgACAgIAAxkBAAICI2ReUsIcbi9_znN-HMZECJx4iAUsAALoyDEbIE35SnGKbAeLK_hvAQADAgADbQADLwQ`,
            caption: `${this.fightAccepter.name} выбирай оружие`,
          },
          {
            chat_id: this.chatId,
            message_id: this.challengeMessageId,
            reply_markup: getChoseWeaponKeyboard(this.id).reply_markup,
          },
        );
      }),
    );
  }

  private afterFightAccepterWeaponChooseListener(): Observable<WeaponTypes> {
    return this._afterFightAccepterWeaponChoosen$.pipe(
      tap(async (weaponType) => {
        await this.tgBotListenerService.bot.deleteMessage(this.chatId, this.challengeMessageId);
        this.weapons.set(this.fightAccepter.id, weaponType);

        this._fightStageOne$.next();
      }),
    );
  }

  private initFightStageOneListener(): Observable<void> {
    return this.fightStageOne$.pipe(
      tap(async () => {
        const message = await this.fightStageOne();
        await delay(2000);

        this._fightStageTwo$.next(message);
      }),
    );
  }

  private initFightStageTwoListener(): Observable<TelegramBot.Message> {
    return this.fightStageTwo$.pipe(
      tap(async (challengeMessage) => {
        await this.fightStageTwo(challengeMessage.message_id);
        await delay(2000);

        await this.tgBotListenerService.bot.deleteMessage(this.chatId, challengeMessage.message_id);
        this._fightFinished$.next(this.fightEmitter.fight(this.fightAccepter));
      }),
    );
  }

  private initFightFinishedListener(): Observable<{ winner: Fighter; looser: Fighter }> {
    // finish
    return this.fightFinished$.pipe(
      tap(async ({ winner, looser }) => {
        const caption = `${winner.name} -${winner.semen}(+10) мл.\n${looser.name} -${
          looser.semen
        }(+10) мл.\n\n${getFinalMessage(
          { fighter: winner, weapon: this.weapons.get(winner.id), semenDelta: 10 },
          { fighter: looser, weapon: this.weapons.get(looser.id), semenDelta: 10 },
        )}
        `;

        this.tgBotListenerService.bot.sendAnimation(this.chatId, getFinalAnimation(), { caption });
        this._sceneFinished$.next();
      }),
    );
  }

  private startChallenge(): void {
    this.tgBotListenerService.bot
      .sendPhoto(this.chatId, 'AgACAgIAAxkBAAIB7mReTBIFbiZsgxL40u1PAr3rc2d6AAK1yDEbIE35SrKQT0SCwsIJAQADAgADeAADLwQ', {
        caption: `${this.fightEmitter.name} желает надрать кому нибудь зад`,
        reply_markup: getAcceptFightKeyboard(this.id).reply_markup,
      })
      .then((message: TelegramBot.Message) => {
        this.challengeMessageId = message.message_id;
        this._challengeEmitted$.next(message);
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
