import { DictionaryActionTitles } from '../dictionary/dictionary-messages';
import { ActionType } from '../types';

export function getAcceptFightReplyMarkup(sceneId: string) {
  return {
    inline_keyboard: [
      [
        {
          text: DictionaryActionTitles.acceptFight,
          callback_data: `${ActionType.AcceptFight}~${sceneId}`,
        },
      ],
    ],
  };
}
