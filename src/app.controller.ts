import { Controller, Get } from '@nestjs/common';
import { Fighter, Group, Scene } from './models';
import { BotListenerService } from './services';
import TelegramBot from 'node-telegram-bot-api';
import { Dictionary } from './lib/dictionary/dictionary';
import { DictionaryBase } from './lib/dictionary/dictionary-base';
import { ActionType, NotifyMessage, WeaponType, Mention } from './lib';
import { getQuote } from './lib/dictionary/quotes';
import { dailyRepeat } from './lib/util/deaily-repeat';
import { FighterDTO, FighterService } from './db/fighters';
import { GroupService } from './db/groups';
import { SceneService } from './db/scene';

@Controller()
export class AppController {
  private scenes = new Map<string, Scene>();
  private finishedScenes = 0;

  private quoteOfTheDay: NotifyMessage;

  constructor(
    private readonly botListenerService: BotListenerService,
    private readonly fightersService: FighterService,
    private readonly groupService: GroupService,
    private readonly sceneService: SceneService,
  ) {
    this.initCallbackQuerySubscription();
    this.initChallangeQuerySubscription();
    this.initDuelSubscription();
    this.initRandomQuoteListener();
    this.initDailyQuoteListener();
    this.initStatsListener();
    this.initGroupStatsListener();
    this.toggleDailyQuoteListener();

    // debug
    if (process.env.DEBUG === 'true') {
      this.debugListeners();
    }

    // if (process.env.FILES === 'true') {
    // this.filesListener();
    // }

    this.setDailyQuote();

    dailyRepeat(12, 1, async () => {
      this.setDailyQuote();
      const groups = await this.groupService.findDailyQuotesGroups();

      if (groups.length) {
        const ids = groups.map((g) => g.groupId);
        this.botListenerService.notifyChats(ids, this.quoteOfTheDay);
      }
    });
  }

  private setDailyQuote(): void {
    this.quoteOfTheDay = getQuote();
    this.quoteOfTheDay.message = `Цитата дня:\n${this.quoteOfTheDay.message}`;
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
      const fighters = await this.fightersService.findAllWithLimit(10);
      const stats = await this.getGroupStatsMessage(fighters);

      this.botListenerService.notifyChats([message.chat.id], {
        message: stats ? `Мировой рейтинг:${stats}` : 'Пусто',
      });
    });
  }

  private initGroupStatsListener(): void {
    this.botListenerService.on('chatStats', async (message) => {
      const groupDto = await this.groupService.get(message.chat.id);

      if (!groupDto) {
        return;
      }

      const fighters = Array.from(groupDto.fighters)
        .map(([userId, rest]) => ({ userId, ...rest }))
        .sort((a, b) => (a.scores > b.scores ? -1 : 1));
      const stats = await this.getGroupStatsMessage(fighters);

      this.botListenerService.notifyChats([message.chat.id], {
        message: stats ? `Групповой рейтинг:${stats}` : 'Пусто',
      });
    });
  }

  private toggleDailyQuoteListener(): void {
    this.botListenerService.on('toggleDailyQuote', async (message) => {
      const group = await this.getOrCreateGroup(message.chat.id);
      group.allowDailyQuote = !group.allowDailyQuote;

      await this.groupService.update(group);
      const notificationMessage = group.allowDailyQuote ? 'Цитаты дня включены' : 'Цитаты дня выключены';

      this.botListenerService.notifyChats([message.chat.id], { message: notificationMessage });
    });
  }

  private async getOrCreateGroup(groupId: number): Promise<Group> {
    const dto = await this.groupService.get(groupId);

    if (dto) {
      return new Group(dto);
    }

    const newGroup = new Group({ groupId });
    this.groupService.create(newGroup);

    return newGroup;
  }

  private async getGroupStatsMessage(fighters: Pick<FighterDTO, 'userId' | 'scores' | 'name'>[]): Promise<string> {
    const stats = Array.from(fighters)
      .sort((a, b) => (a.scores > b.scores ? -1 : 1))
      .reduce((acc, curr, index) => `${acc}\n${index + 1}) ${curr.name} - (${curr.scores} scores)`, '');

    return stats;
  }

  private async getGlobalStatsMessage(fighters: FighterDTO[]): Promise<string> {
    const stats = Array.from(fighters).reduce(
      (acc, curr, index) =>
        `${acc}\n${index + 1}) ${curr.name} (${curr.scores} scores) / fights: ${curr.fights}, wins: ${
          curr.wins
        }, looses: ${curr.looses}`,
      '',
    );

    return stats;
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
    const fighter = await this.createOrGetExistingFighter(`${message.from.id}`, message.from.username);

    const scene = new Scene(this.botListenerService, Dictionary, message.chat.id, fighter, mentionedUsername);
    this.scenes.set(scene.id, scene);

    scene.on('fightFinished', async (winner, looser) => {
      this.finishedScenes++;
      this.fightersService.update(winner.fighter);
      this.fightersService.update(looser.fighter);

      const groupDto = await this.groupService.get(message.chat.id);
      const group = new Group(groupDto ? groupDto : { groupId: message.chat.id });
      group.updateFightersScores(winner, looser);

      if (groupDto) {
        this.groupService.update(group);
      } else {
        this.groupService.create(group);
      }

      this.sceneService.create({
        winnerId: winner.fighter.userId,
        winnerWeapon: winner.weapon,
        looserId: looser.fighter.userId,
        looserWeapon: looser.weapon,
      });
    });

    scene.on('destroy', () => {
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
          scene.setWeapon(WeaponType.Rock, `${query.from.id}`);
          return;
        case WeaponType.Scissors:
          scene.setWeapon(WeaponType.Scissors, `${query.from.id}`);
          return;
        case WeaponType.Paper:
          scene.setWeapon(WeaponType.Paper, `${query.from.id}`);
          return;
      }
    });
  }

  private async acceptFight(scene: Scene, query: TelegramBot.CallbackQuery): Promise<void> {
    if (!scene.canAcceptFight(query.from)) {
      return;
    }

    const fighter = await this.createOrGetExistingFighter(`${query.from.id}`, query.from.username);
    scene.fight(fighter);
  }

  private async createOrGetExistingFighter(id: string, name: string): Promise<Fighter> {
    const dbFighter = await this.fightersService.get(id);

    if (dbFighter) {
      return new Fighter(dbFighter);
    }

    const newFighter = new Fighter({ userId: `${id}`, name });
    this.fightersService.create(newFighter);

    return newFighter;
  }

  // private filesListener(): void {
  //   this.botListenerService.bot.on('message', (query) => {
  //     // console.log(query?.photo);
  //     console.log(query?.document?.file_id);
  //   });
  // }

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
    const fighters = await this.fightersService.findAllWithLimit(999);
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
