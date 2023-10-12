import { DictionaryActionTitles, Media } from './lib/dictionary/dictionary-messages';
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
    this.initMyStatsListener();
    this.initGroupStatsListener();
    this.toggleDailyQuoteListener();
    this.initBdModeSubscription();
    this.initResetUserListener();

    // debug
    if (process.env.DEBUG === 'true') {
      this.debugListeners();
    }

    if (process.env.FILES === 'true') {
      this.filesListener();
    }

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
      const count = 20;
      const fighters = await this.fightersService.findAllWithLimit(count);
      const stats = await this.getGroupStatsMessage(fighters);

      this.botListenerService.notifyChats([message.chat.id], {
        message: stats ? `Топ ${count} ⚣masters⚣:${stats}` : 'Пусто',
      });
    });
  }

  private initMyStatsListener(): void {
    this.botListenerService.on('myStats', async (message) => {
      const fighters = await this.fightersService.findAllWithLimit(999);

      const yourIndex = fighters.findIndex((fighter) => fighter.userId === `${message.from.id}`);
      if (yourIndex >= 0) {
        const fighter = fighters[yourIndex];

        this.botListenerService.notifyChats([message.chat.id], {
          message: fighter
            ? `(${yourIndex + 1} из ${fighters.length}). У тебя в баке ${fighter.scores} ⚣semen⚣\n${
                fighter.wins
              } Побед/${fighter.looses} Поражений`
            : 'Пусто',
        });
      }
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
        message: stats ? `Групповой рейтинг ⚣semen⚣:${stats}` : 'Пусто',
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

  private async getGroupStatsMessage(
    fighters: Pick<FighterDTO, 'userId' | 'scores' | 'username' | 'name'>[],
  ): Promise<string> {
    const stats = Array.from(fighters)
      .sort((a, b) => (a.scores > b.scores ? -1 : 1))
      .reduce((acc, curr, index) => `${acc}\n${index + 1}) ${curr.username || curr.name} - ${curr.scores} мл.`, '');

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
    this.botListenerService.on('duel', async (message, mentionedUsername) => {
      const mentionedUserFromDb = await this.fightersService.get({ username: mentionedUsername });

      if (mentionedUserFromDb?.userId === `${message.from.id}`) {
        this.botListenerService.notifyChats([message.chat.id], {
          message: 'Лох',
          media: {
            type: 'audio',
            // fuck audio
            id: 'AwACAgIAAxkBAAEBcMplKFbK8mXC11YSkGj8xHu54cbGdgACukAAArrbQEkHSbmpDd1hWzAE',
          },
        });

        return;
      }

      this.createFightScene(message, `@${mentionedUsername}`);
    });
  }

  private initChallangeQuerySubscription(): void {
    this.botListenerService.on('challengeQuery', (message) => this.createFightScene(message));
  }

  private async createFightScene(message: TelegramBot.Message, mentionedUsername?: Mention): Promise<void> {
    const fighter = await this.createOrGetExistingFighter(message.from);

    const scene = new Scene(
      this.botListenerService,
      this.fightersService,
      Dictionary,
      message.chat.id,
      fighter,
      mentionedUsername,
    );
    this.scenes.set(scene.id, scene);

    scene.on('fightFinished', async (winner, looser) => {
      this.finishedScenes++;

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

  private initBdModeSubscription(): void {
    this.botListenerService.on('bdMode', async (username, status) => {
      const dbUser = await this.fightersService.get({ username });

      if (!dbUser || dbUser.bdMode === status) {
        return;
      }

      dbUser.bdMode = status;

      await this.fightersService.update(dbUser);
      const groups = await this.groupService.findAll();

      const filteredGroups = groups.filter((ch) => !!ch.fighters.get(`${dbUser.userId}`));

      if (filteredGroups.length) {
        const ids = filteredGroups.map((g) => g.groupId);
        const notify = this.getBdNotification(username, status);

        this.botListenerService.notifyChats(ids, notify);
      }
    });
  }

  private initResetUserListener(): void {
    this.botListenerService.on('resetUser', async (username) => {
      const dbUser = await this.fightersService.get({ username });

      if (!dbUser) {
        return;
      }

      const updatedUser = this.resetUser(dbUser);
      await this.fightersService.update(updatedUser);

      const groups = await this.groupService.findAll();
      const filteredGroups = groups.filter((ch) => !!ch.fighters.get(`${updatedUser.userId}`));

      if (filteredGroups.length) {
        filteredGroups.forEach((g) => {
          g.fighters.set(updatedUser.userId, updatedUser);
          this.groupService.update(g);
        });
      }
    });
  }

  private resetUser(existingUser: FighterDTO): FighterDTO {
    const newFighter = new Fighter({
      userId: existingUser.userId,
      name: existingUser.name,
      username: existingUser.username,
    });

    return newFighter;
  }

  private getBdNotification(name: string, status: boolean): { message: string; media: Media } {
    if (status) {
      const media = {
        type: 'video',
        id: 'CgACAgIAAxkBAAIJzmRmamOlEvUUQFNfGFBUoZAv8CCsAAIrKAACReQ5S9n0kp2iPpudLwQ',
      } as Media;

      return {
        message: `@${name}\nТы только что получил магический ${
          DictionaryActionTitles[WeaponType.Rock]
        },\nC ним шансы на победу увеличиваются в 2 раза. Используй ${
          DictionaryActionTitles[WeaponType.Rock]
        } по назначению, докажи что ты ⚣man⚣, реализуй свои ⚣deep dark fantasies⚣`,
        media,
      };
    } else {
      const media = {
        type: 'video',
        id: 'CgACAgIAAxkBAAOZZGA4VFfriqPgUhVdK3d_4raVGmwAAtcrAAKPBQhLCim-e_yJ30MvBA',
      } as Media;

      return {
        message: `@${name}\nМагия исчезла, твой ${
          DictionaryActionTitles[WeaponType.Rock]
        } вернулся в обычное состояние, но ты все еще можешь его использовать, жду тебя в ⚣dungeon⚣`,
        media,
      };
    }
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

    const fighter = await this.createOrGetExistingFighter(query.from);
    scene.fight(fighter);
  }

  private async createOrGetExistingFighter(from: TelegramBot.User): Promise<Fighter> {
    const userId = `${from.id}`;
    const { username, first_name } = from;

    const dbFighter = await this.fightersService.get({ userId });

    if (dbFighter) {
      // in case of changed
      dbFighter.username = username;
      dbFighter.name = first_name;
      //

      return new Fighter(dbFighter);
    }

    const newFighter = new Fighter({ userId, name: first_name, username });
    this.fightersService.create(newFighter);

    return newFighter;
  }

  private filesListener(): void {
    this.botListenerService.bot.on('message', (query) => {
      console.log(query?.photo);
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
