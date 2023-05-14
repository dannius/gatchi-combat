import { Controller, Get } from '@nestjs/common';
import { Fighter, Mention, Scene } from './models';
import { BotListenerService } from './services';
import TelegramBot from 'node-telegram-bot-api';
import { Dictionary } from './lib/dictionary/dictionary';
import { DictionaryBase } from './lib/dictionary/dictionary-base';
import { ActionType, WeaponType } from './lib';

@Controller()
export class AppController {
  private scenes = new Map<string, Scene>();
  private fighters = new Map<number, Fighter>();
  private finishedScenes = 0;

  constructor(private readonly botListenerService: BotListenerService) {
    this.initCallbackQuerySubscription();
    this.initChallangeQuerySubscription();
    this.initDuelSubscription();

    // debug
    if (process.env.DEBUG === 'true') {
      this.debugListeners();
    }

    // if (process.env.FILES === 'true') {
    //   this.filesListener();
    // }
  }

  private initDuelSubscription(): void {
    this.botListenerService.on('duel', (message, mentionedUsername) => {
      this.createFightScene(message, mentionedUsername);
    });
  }

  private initChallangeQuerySubscription(): void {
    this.botListenerService.on('challengeQuery', (message) => this.createFightScene(message));
  }

  private createFightScene(message: TelegramBot.Message, mentionedUsername?: Mention): void {
    const fighter = this.createOrGetExistingFighter(message.from.id, message.from.username);

    const scene = new Scene(this.botListenerService, Dictionary, message.chat.id, fighter, mentionedUsername);
    this.scenes.set(scene.id, scene);

    scene.on('destroy', (isFinished) => {
      if (isFinished) {
        this.finishedScenes++;
      }

      this.scenes.delete(scene.id);
    });
  }

  private initCallbackQuerySubscription(): void {
    this.botListenerService.on('callbackQuery', (query) => {
      const [action, id] = query.data.split('~');

      const scene = this.scenes.get(id);

      if (!scene) {
        return;
      }

      switch (action) {
        case ActionType.AcceptFight:
          this.acceptFight(scene, query);

          return;
        case WeaponType.Rock:
          scene.setWeapon(WeaponType.Rock, query.from.id);
          return;
        case WeaponType.Scissors:
          scene.setWeapon(WeaponType.Scissors, query.from.id);
          return;
        case WeaponType.Paper:
          scene.setWeapon(WeaponType.Paper, query.from.id);
          return;
      }
    });
  }

  private acceptFight(scene: Scene, query: TelegramBot.CallbackQuery): void {
    if (!scene.canAcceptFight(query.from)) {
      return;
    }

    const acceptFighter = this.createOrGetExistingFighter(query.from.id, query.from.username);
    scene.fight(acceptFighter);
  }

  private createOrGetExistingFighter(id: number, name: string): Fighter {
    const existingFighter = this.fighters.get(id);

    if (existingFighter) {
      return existingFighter;
    }

    const newFighter = new Fighter(id, name);
    this.fighters.set(id, newFighter);

    return newFighter;
  }

  private filesListener(): void {
    this.botListenerService.bot.on('message', (query) => {
      // console.log(query?.photo);
      console.log(query?.document?.file_id);
    });
  }

  private debugListeners(): void {
    const stages = Object.keys(Dictionary);

    this.botListenerService.bot.onText(/\/debug$/, (message) => {
      this.botListenerService.bot.sendMessage(message.chat.id, stages.join('\n'));
    });

    const reg = new RegExp(`\/debug\\s(${stages.join('|')})$`);

    this.botListenerService.bot.onText(reg, (message) => {
      const chatId = message.chat.id;
      const [_, stage] = message.text.split(' ');

      const stageObject = Dictionary[stage] as DictionaryBase;

      if (!stageObject?.medias?.length) {
        return;
      }

      stageObject.medias.forEach((media) => {
        const caption = media.id;

        if (media.type === 'photo') {
          this.botListenerService.bot.sendPhoto(chatId, media.id, { caption });
        } else if (media.type === 'video') {
          this.botListenerService.bot.sendAnimation(chatId, media.id, { caption });
        }
      });
    });
  }

  @Get()
  getHello(): string {
    const fighters = Array.from(this.fighters.values())
      .sort((a, b) => (a.scores > b.scores ? -1 : 1))
      .reduce(
        (acc, curr) =>
          `${acc} </br> ${curr.name} (${curr.scores} scores) / fights: ${curr.fights}, wins: ${curr.wins}, looses: ${curr.looses}`,
        '',
      );

    return `<h3>Битв сыграно: ${this.finishedScenes}</h3> </br> <h3>воины подземелья: </h3> </br> ${fighters}`;
  }
}
