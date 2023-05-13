import { random } from '../util/random';
import { DictionaryBaseParams, Media, TextKeys } from './dictionary-messages';

type MessageDataset = { [P in keyof typeof TextKeys]: string };

export class DictionaryBase {
  protected medias: Media[] = [];
  protected messagesHeader = [];
  protected messagesBody: string[] = [];

  constructor({ messagesBody, messagesHeader, medias }: DictionaryBaseParams) {
    if (messagesBody) {
      this.messagesBody = messagesBody;
    }

    if (messagesHeader) {
      this.messagesHeader = messagesHeader;
    }

    if (medias) {
      this.medias = medias;
    }
  }

  getMedia(): Media {
    return this.medias[random(0, this.medias.length - 1)];
  }

  getMessage(params: Partial<MessageDataset>): string {
    const bodyIndex = random(0, this.messagesBody.length - 1);
    const message = this.messagesBody[bodyIndex];

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
    return Object.entries(params).reduce((msg, [textKey, textVal]) => msg.replace(TextKeys[textKey], textVal), msg);
  }
}
