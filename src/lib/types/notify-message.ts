import { Media } from '../dictionary/dictionary-messages';

export interface NotifyMessage {
  message: string;
  media?: Media;
}
