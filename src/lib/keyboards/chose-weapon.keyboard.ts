import { BotButtonActionTitles, BotButtonActionType, WeaponTypes } from 'src/models';

export function getChoseWeaponKeyboard(sceneId: string) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: BotButtonActionTitles[BotButtonActionType.ChoseAssWeapon],
            callback_data: `${BotButtonActionType.ChoseAssWeapon}~${sceneId}`,
          },
          {
            text: BotButtonActionTitles[BotButtonActionType.ChoseDickWeapon],
            callback_data: `${BotButtonActionType.ChoseDickWeapon}~${sceneId}`,
          },
          {
            text: BotButtonActionTitles[BotButtonActionType.ChoseFingerWeapon],
            callback_data: `${BotButtonActionType.ChoseFingerWeapon}~${sceneId}`,
          },
        ],
      ],
    },
  };
}
