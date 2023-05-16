import { Controller, Get } from '@nestjs/common';
import { Fighter, Scene } from './models';
import { BotListenerService } from './services';
import TelegramBot from 'node-telegram-bot-api';
import { Dictionary } from './lib/dictionary/dictionary';
import { DictionaryBase } from './lib/dictionary/dictionary-base';
import { ActionType, NotifyMessage, WeaponType, Mention } from './lib';
import { getQuote } from './lib/dictionary/quotes';
import { dailyRepeat } from './lib/util/deaily-repeat';
import { FighterService } from './db/fighters';

@Controller()
export class AppController {
  private scenes = new Map<string, Scene>();
  private finishedScenes = 0;

  private quoteOfTheDay: NotifyMessage;

  constructor(
    private readonly botListenerService: BotListenerService,
    private readonly fightersService: FighterService,
  ) {
    this.initCallbackQuerySubscription();
    this.initChallangeQuerySubscription();
    this.initDuelSubscription();
    this.initRandomQuoteListener();
    this.initDailyQuoteListener();
    this.initStatsListener();

    // debug
    if (process.env.DEBUG === 'true') {
      this.debugListeners();
    }

    // if (process.env.FILES === 'true') {
    // this.filesListener();
    // }

    this.quoteOfTheDay = getQuote();

    dailyRepeat(17, 54, () => {
      this.quoteOfTheDay = getQuote();
      // this.botListenerService.notifyChats([1], this.quoteOfTheDay);
    });
  }

  private initRandomQuoteListener(): void {
    this.botListenerService.on('randomQuote', (message) => {
      this.botListenerService.notifyChats([message.chat.id], getQuote());
    });
  }

  private initDailyQuoteListener(): void {
    this.botListenerService.on('dailyQuote', (message) => {
      this.botListenerService.notifyChats([message.chat.id], this.quoteOfTheDay);
    });
  }

  private initStatsListener(): void {
    this.botListenerService.on('stats', async (message) => {
      const fighters = await this.fightersService.findAll();

      const stats = Array.from(fighters)
        .sort((a, b) => (a.scores > b.scores ? -1 : 1))
        .reduce(
          (acc, curr) =>
            `${acc} </br> ${curr.name} (${curr.scores} scores) / fights: ${curr.fights}, wins: ${curr.wins}, looses: ${curr.looses}`,
          '',
        );

      this.botListenerService.notifyChats([message.chat.id], { message: stats || 'Пусто' });
    });
  }

  private initDuelSubscription(): void {
    this.botListenerService.on('duel', (message, mentionedUsername) => {
      this.createFightScene(message, mentionedUsername);
    });
  }

  private initChallangeQuerySubscription(): void {
    this.botListenerService.on('challengeQuery', (message) => this.createFightScene(message));
  }

  private async createFightScene(message: TelegramBot.Message, mentionedUsername?: Mention): Promise<void> {
    const fighter = await this.createOrGetExistingFighter(message.from.id, message.from.username);

    const scene = new Scene(this.botListenerService, Dictionary, message.chat.id, fighter, mentionedUsername);
    this.scenes.set(scene.id, scene);

    scene.on('destroy', (isFinished) => {
      if (isFinished) {
        this.finishedScenes++;
        this.fightersService.update(scene.fightEmitter);
        this.fightersService.update(scene.fightAccepter);
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

  private async acceptFight(scene: Scene, query: TelegramBot.CallbackQuery): Promise<void> {
    if (!scene.canAcceptFight(query.from)) {
      return;
    }

    const acceptFighter = await this.createOrGetExistingFighter(query.from.id, query.from.username);
    scene.fight(acceptFighter);
  }

  private async createOrGetExistingFighter(id: number, name: string): Promise<Fighter> {
    const fighterDTO = await this.fightersService.get(id);

    if (fighterDTO) {
      return new Fighter(fighterDTO);
    }

    const newFighter = new Fighter({ userId: id, name });
    this.fightersService.create(newFighter).then(() => console.log('created'));

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
  async getHello(): Promise<string> {
    const fighters = await this.fightersService.findAll();
    fighters
      .sort((a, b) => (a.scores > b.scores ? -1 : 1))
      .reduce(
        (acc, curr) =>
          `${acc} </br> ${curr.name} (${curr.scores} scores) / fights: ${curr.fights}, wins: ${curr.wins}, looses: ${curr.looses}`,
        '',
      );

    return `<h3>Битв сыграно: ${this.finishedScenes}</h3> </br> <h3>воины подземелья: </h3> </br> ${fighters}`;
  }
}
