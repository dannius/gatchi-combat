import { Controller, Get } from '@nestjs/common';
import { BotButtonActionType, Fighter, Scene, WeaponTypes } from './models';
import { BotListenerService } from './services';
import TelegramBot from 'node-telegram-bot-api';

@Controller()
export class AppController {
  private scenes = new Map<string, Scene>();
  private fighters = new Map<number, Fighter>();
  private finishedScenes = 0;

  constructor(private readonly botListenerService: BotListenerService) {
    this.initCallbackQuerySubscription();
    this.initChallangeQuerySubscription();
    this.initDuelSubscription();
  }

  private initDuelSubscription(): void {
    this.botListenerService.on('duel', (message, mentionedUsername) => {
      const fighter = this.createOrGetExistingFighter(message.from.id, message.from.username);

      const scene = new Scene(this.botListenerService, message.chat.id, fighter, mentionedUsername);
      this.scenes.set(scene.id, scene);

      scene.on('sceneFinished', () => {
        this.scenes.delete(scene.id);
        this.finishedScenes++;
      });
    });
  }

  private initChallangeQuerySubscription(): void {
    this.botListenerService.on('challengeQuery', (message) => {
      const fighter = this.createOrGetExistingFighter(message.from.id, message.from.username);

      const scene = new Scene(this.botListenerService, message.chat.id, fighter);
      this.scenes.set(scene.id, scene);

      scene.on('sceneFinished', () => {
        this.scenes.delete(scene.id);
        this.finishedScenes++;
      });
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
        case BotButtonActionType.AcceptFight:
          this.acceptFight(scene, query);

          return;
        case BotButtonActionType.ChoseAssWeapon:
          scene.setWeapon(WeaponTypes.Ass, query.from.id);
          return;
        case BotButtonActionType.ChoseFingerWeapon:
          scene.setWeapon(WeaponTypes.Finger, query.from.id);
          return;
        case BotButtonActionType.ChoseDickWeapon:
          scene.setWeapon(WeaponTypes.Dick, query.from.id);
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

  @Get()
  getHello(): string {
    const fighters = Array.from(this.fighters.values())
      .sort((a, b) => (a.semen > b.semen ? 1 : -1))
      .reduce(
        (acc, curr) =>
          `${acc} </br> ${curr.name} (${curr.semen} semen) / fights: ${curr.fights}, wins: ${curr.wins}, looses: ${curr.looses}`,
        '',
      );

    return `<h3>Битв сыграно: ${this.finishedScenes}</h3> </br> <h3>воины подземелья: </h3> </br> ${fighters}`;
  }
}
