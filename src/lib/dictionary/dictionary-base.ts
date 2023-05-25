import { random } from '../util/random';
import { DictionaryBaseParams, ISpecialMessagesBody, Media, TextKeys } from './dictionary-messages';

type MessageDataset = { [P in keyof typeof TextKeys]: string };

export class DictionaryBase {
  public medias: Media[] = [];
  protected messagesHeader = [];
  protected messagesBody: string[] = [];
  protected specialMessagesBody: ISpecialMessagesBody = { lose: [], win: [] };

  constructor({ messagesBody, messagesHeader, medias, specialMessagesBody }: DictionaryBaseParams) {
    if (messagesBody) {
      this.messagesBody = messagesBody;
    }

    if (messagesHeader) {
      this.messagesHeader = messagesHeader;
    }

    if (specialMessagesBody) {
      this.specialMessagesBody = specialMessagesBody;
    }

    if (medias) {
      this.medias = medias;
    }
  }

  getMedia(): Media {
    return this.medias[random(0, this.medias.length - 1)];
  }

  getMessage(params: Partial<MessageDataset>): string {
    let message: string;
    if (params.fightResultType && (params.fightResultType === 'luckyLose' || params.fightResultType === 'luckyWin')) {
      if (params.fightResultType === 'luckyLose') {
        const bodyIndex = random(0, this.specialMessagesBody.lose.length - 1);
        message = this.specialMessagesBody.lose[bodyIndex];
      } else {
        const bodyIndex = random(0, this.specialMessagesBody.win.length - 1);
        message = this.specialMessagesBody.win[bodyIndex];
      }
    } else {
      const bodyIndex = random(0, this.messagesBody.length - 1);
      message = this.messagesBody[bodyIndex];
    }
    let header = '';

    if (this.messagesHeader.length) {
      const headerIndex = random(0, this.messagesHeader.length - 1);
      const headerMessage = this.messagesHeader[headerIndex];

      header = this.replaceMessageVars(params, headerMessage);
    }

    const body = this.replaceMessageVars(params, message);

    return `${header}${body}`;
  }

  private replaceMessageVars(params: Partial<MessageDataset>, msg: string): string {
    return Object.entries(params).reduce((msg, [textKey, textVal]) => msg.replaceAll(TextKeys[textKey], textVal), msg);
  }
}
