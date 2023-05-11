import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Fighter, Scene } from './models';
import { SceneActionType } from './models/Scene';
import TelegramBot = require('node-telegram-bot-api');

@Controller()
export class AppController {
  private scenes = new Map<string, Scene>();
  private fighters = new Map<number, Fighter>();
  private finishedScenes = 0;

  private token = '';

  private bot = new TelegramBot(this.token, { polling: true });

  constructor(private readonly appService: AppService) {
    this.bot.on('callback_query', (d) => {
      if (!d.data) {
        return;
      }

      const [action, id] = d.data.split('~');

      const scene = this.scenes.get(id);

      if (!scene) {
        return;
      }

      switch (action) {
        case SceneActionType.AcceptFight:
          const acceptFighter = this.createOrGetExistingFighter(
            d.from.id,
            d.from.username,
          );

          scene.fight(acceptFighter).then(() => {
            this.scenes.delete(scene.id);
            this.finishedScenes++;
          });
      }
    });

    this.bot.onText(/тест/, (msg) => {
      const fighter = this.createOrGetExistingFighter(
        msg.from.id,
        msg.from.username,
      );

      const scene = new Scene(this.bot, fighter, msg.chat.id);
      this.scenes.set(scene.id, scene);

      scene.emmitChallenge(msg.chat.id);
    });

    // this.bot.on('message', (msg) => {
    //   console.log(msg);
    // });
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
      .sort((a, b) => (a.semen > b.semen ? 1 : 0))
      .reduce(
        (acc, curr) => `${acc} </br> ${curr.name} (${curr.semen} semen)`,
        '',
      );

    return `<h3>Битв сыграно: ${this.finishedScenes}</h3> </br> <h3>воины подземелья: </h3> </br> ${fighters}`;
  }
}
