import { DictionaryActionTitles } from '../dictionary/dictionary-messages';
import { WeaponType } from '../types';

export function getChoseWeaponReplyMarkup(sceneId: string) {
  return {
    inline_keyboard: [
      [
        {
          text: DictionaryActionTitles[WeaponType.Rock],
          callback_data: `${WeaponType.Rock}~${sceneId}`,
        },
        {
          text: DictionaryActionTitles[WeaponType.Scissors],
          callback_data: `${WeaponType.Scissors}~${sceneId}`,
        },
        {
          text: DictionaryActionTitles[WeaponType.Paper],
          callback_data: `${WeaponType.Paper}~${sceneId}`,
        },
      ],
    ],
  };
}
