export function getAcceptFightKeyboard(callback_data: string) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Принять бой',
            callback_data,
          },
        ],
      ],
    },
  };
}
