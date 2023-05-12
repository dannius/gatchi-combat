import { Fighter, WeaponTypes } from 'src/models';
import { getRandomItem } from '../min-max';

type FighterInfo = {
  fighter: Fighter;
  weapon: WeaponTypes;
  semenDelta: number;
};

export function getFinalAnimation(): string {
  return gifs[getRandomItem(0, gifs.length - 1)];
}

export function getFinalMessage(winner: FighterInfo, looser: FighterInfo): string {
  const index = getRandomItem(0, messages.length - 1);

  return messages[index]
    .replace(TextVars.WinnerName, winner.fighter.name)
    .replace(TextVars.LooserName, looser.fighter.name)
    .replace(TextVars.WinnerWeapon, winner.weapon)
    .replace(TextVars.LooserWeapon, looser.weapon)
    .replace(TextVars.WinSemen, `${winner.semenDelta}`)
    .replace(TextVars.LooseSemen, `${looser.semenDelta}`);
}

//variables
enum TextVars {
  WinnerName = '$winnerName',
  WinnerWeapon = '$winnerWeapon',
  WinSemen = '$winSemen',
  LooserName = '$looserName',
  LooserWeapon = '$looserWeapon',
  LooseSemen = '$looseSemen',
}

const messages = [
  `Ебать ты!\nВсе белое!\n${TextVars.WinnerName} доказал, что он ⚣man⚣.\nУмело используя ${TextVars.WinnerWeapon} он лишает ${TextVars.LooserName} ${TextVars.LooseSemen} мл. ⚣semen⚣.`,
  `${TextVars.LooserName}, дружок пирожок,\nкажется ты ошибся дверью,\nклуб для ♂slaves♂ на 2 блока ниже`,
  `${TextVars.WinnerName} Вот это ты дал используя ${TextVars.WinnerWeapon},\nвсе в semen, ${TextVars.LooserName} обесчестен,\nу него теперь ${TextVars.LooseSemen} на мл. меньше ⚣semen⚣ и сломанный ${TextVars.LooserWeapon}`,
];

const gifs = [
  'CgACAgQAAxkBAAICKGReUxZb5InnO6WATPATDv7A8t9nAALYAgACPFkMU_EQyoCfDo7ILwQ',
  'CgACAgQAAxkBAAICZWReXfg6ExQ1yyzkCu5F-DZXbXHBAAILAwACl81EUmhWtU51srqWLwQ',
  'CgACAgQAAxkBAAICZmReXfoOZ3zi0K9nLMvt1i4u8-x0AAKyAgACFztMUtQLGxMv5-7gLwQ',
  'CgACAgQAAxkBAAICZ2ReXfwlMSE6AcB7wzbG_VmpdT-fAAIVAwACP91EUsLiLjUFVfDhLwQ',
  'CgACAgQAAxkBAAICaGReXf1ZQvYSh_BRJV5nX0X3tKiRAALfAgACm0BMUtl5i3cZ0cZfLwQ',
  'CgACAgQAAxkBAAICaWReXhq9TJQu44uDSc43Q3rtq7gWAALMAgACNKRMUpVDFwvIn-5mLwQ',
  'CgACAgQAAxkBAAICamReXhwDrBtgiQOOBY9Hlpv5vUTrAAMDAAIIIk1SNBSI17OddkQvBA',
];
