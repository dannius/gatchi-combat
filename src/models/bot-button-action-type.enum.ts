export enum BotButtonActionType {
  AcceptFight = 'acceptFight',
  ChoseDickWeapon = 'dickWeapon',
  ChoseAssWeapon = 'assWeapon',
  ChoseFingerWeapon = 'fingerWeapon',
}

export const BotButtonActionTitles = {
  [BotButtonActionType.AcceptFight]: 'Принять бой',
  [BotButtonActionType.ChoseDickWeapon]: 'Dick',
  [BotButtonActionType.ChoseAssWeapon]: 'Ass',
  [BotButtonActionType.ChoseFingerWeapon]: 'Finger',
};
