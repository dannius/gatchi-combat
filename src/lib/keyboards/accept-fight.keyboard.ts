import { BotButtonActionTitles, BotButtonActionType } from 'src/models';

export function getAcceptFightKeyboard(sceneId: string) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: BotButtonActionTitles[BotButtonActionType.AcceptFight],
            callback_data: `${BotButtonActionType.AcceptFight}~${sceneId}`,
          },
        ],
      ],
    },
  };
}
