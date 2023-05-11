import TelegramBot from 'node-telegram-bot-api';
import { Fighter } from './Fighter';
import { guid } from 'src/lib/guid';
import { getAcceptFightKeyboard } from 'src/lib/keygoards';
import { delay } from 'src/lib';

export enum SceneActionType {
  AcceptFight = 'acceptFight',
}

export class Scene {
  public id = guid();

  private get acceptFightEvent(): string {
    return `${SceneActionType.AcceptFight}~${this.id}`;
  }

  private challengeMessageId: number;

  constructor(
    private tgBot: TelegramBot,
    private fightEmitter: Fighter,
    private chatId: number,
  ) {}

  public emmitChallenge(chatId: number): void {
    this.tgBot
      .sendMessage(
        chatId,
        `${this.fightEmitter.name} желает надрать кому нибудь зад`,
        getAcceptFightKeyboard(this.acceptFightEvent),
      )
      .then((message) => {
        this.challengeMessageId = message.message_id;
      });
  }

  public async fight(fightAccepter: Fighter): Promise<TelegramBot.Message> {
    this.tgBot.deleteMessage(this.chatId, this.challengeMessageId);

    const msg = await this.fightStageOne();
    await delay(2000);
    await this.fightStageTwo(msg.message_id);
    await delay(2000);

    await this.tgBot.deleteMessage(this.chatId, msg.message_id);

    const { winner, looser } = this.fightEmitter.fight(fightAccepter);

    return this.tgBot.sendMessage(
      this.chatId,
      `${winner.name} (${winner.semen}) Вот это ты дал, все в semen, ${looser.name} обесчестен, у него осталось ${looser.semen}`,
    );
  }

  private async fightStageOne(): Promise<TelegramBot.Message> {
    return await this.tgBot.sendAnimation(
      this.chatId,
      'CgACAgQAAxkBAAP8ZF1kU9QQZuZJCdEooHsWE6-UgyAAAnYDAAI7WYVSZHYv894om0UvBA',
    );
  }

  private async fightStageTwo(
    previousMessageId: number,
  ): Promise<boolean | TelegramBot.Message> {
    return await this.tgBot.editMessageMedia(
      {
        type: 'video',
        media:
          'CgACAgEAAxkBAANNZF0S2K6bl2rsZ2Mn-yENaRo9Iw0AAgEAA41wYUVeuTbdqYUVVC8E',
      },
      {
        message_id: previousMessageId,
        chat_id: this.chatId,
      },
    );
  }
}
