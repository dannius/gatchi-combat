export interface DictionaryBaseParams {
  messagesBody?: string[];
  messagesHeader?: string[];
  medias?: string[];
}

export const TextKeys = {
  fighter1Name: '$fighter1Name',
  fighter1Weapon: '$fighter1Weapon',
  fighter1SemenTotal: '$fighter1SemenTotal',
  fighter1SemenAdded: '$fighter1SemenAdded',
  fighter2Name: '$fighter2Name',
  fighter2Weapon: '$fighter2Weapon',
  fighter2SemenTotal: '$fighter2SemenTotal',
  fighter2SemenAdded: '$fighter2SemenAdded',
};

type DictionaryMessageKeys =
  | 'StartChallenge'
  | 'StartDuel'
  | 'FightAccepterSelectWeapon'
  | 'FightEmitterSelectWeapon'
  | 'FightStageOne'
  | 'FightStageTwo'
  | 'Final';

export const DictionaryMessages: Record<DictionaryMessageKeys, DictionaryBaseParams> = {
  StartChallenge: {
    messagesBody: [`@${TextKeys.fighter1Name} желает надрать кому нибудь зад`],
    medias: ['AgACAgIAAxkBAAIB7mReTBIFbiZsgxL40u1PAr3rc2d6AAK1yDEbIE35SrKQT0SCwsIJAQADAgADeAADLwQ'],
  },
  StartDuel: {
    messagesBody: [`@${TextKeys.fighter1Name} изьявил желание надрать ${TextKeys.fighter2Name} зад, примет ли он бой?`],
    medias: ['AgACAgIAAxkBAAIB7mReTBIFbiZsgxL40u1PAr3rc2d6AAK1yDEbIE35SrKQT0SCwsIJAQADAgADeAADLwQ'],
  },
  FightAccepterSelectWeapon: {
    messagesBody: [`@${TextKeys.fighter1Name} выбирай оружие`],
    medias: ['AgACAgIAAxkBAAICI2ReUsIcbi9_znN-HMZECJx4iAUsAALoyDEbIE35SnGKbAeLK_hvAQADAgADbQADLwQ'],
  },
  FightEmitterSelectWeapon: {
    messagesBody: [`@${TextKeys.fighter1Name} выбирай оружие`],
    medias: ['AgACAgIAAxkBAAICE2ReUIvRGmfYuhYVvRIa3MWejmWSAALVyDEbIE35SsOjhK9RpiOyAQADAgADbQADLwQ'],
  },
  FightStageOne: {
    medias: ['CgACAgQAAxkBAAP8ZF1kU9QQZuZJCdEooHsWE6-UgyAAAnYDAAI7WYVSZHYv894om0UvBA'],
  },
  FightStageTwo: {
    medias: ['CgACAgQAAxkBAAICHmReUgl12tN_3Ue120iaDgKmAAFhCAACEQMAAjjQBFPXWhNQFYei9S8E'],
  },
  Final: {
    messagesBody: [
      `Ебать ты!\nВсе белое!\n${TextKeys.fighter1Name} доказал, что он ⚣man⚣.\nУмело используя ${TextKeys.fighter1Weapon} он лишает ${TextKeys.fighter2Name} ${TextKeys.fighter2SemenTotal} мл. ⚣semen⚣.`,
      `${TextKeys.fighter2Name}, дружок пирожок,\nкажется ты ошибся дверью,\nклуб для ♂slaves♂ на 2 блока ниже`,
      `${TextKeys.fighter1Name} Вот это ты дал используя ${TextKeys.fighter1Weapon},\nвсе в semen, ${TextKeys.fighter2Name} обесчестен,\nу него теперь ${TextKeys.fighter2SemenTotal} на мл. меньше ⚣semen⚣ и сломанный ${TextKeys.fighter2Weapon}`,
    ],
    messagesHeader: [
      `${TextKeys.fighter1Name} - ${TextKeys.fighter1SemenTotal}(${TextKeys.fighter1SemenAdded}) мл.\n${TextKeys.fighter2Name} - ${TextKeys.fighter2SemenTotal}(${TextKeys.fighter2SemenAdded}) мл.\n\n`,
    ],
    medias: [
      'CgACAgQAAxkBAAICKGReUxZb5InnO6WATPATDv7A8t9nAALYAgACPFkMU_EQyoCfDo7ILwQ',
      'CgACAgQAAxkBAAICZWReXfg6ExQ1yyzkCu5F-DZXbXHBAAILAwACl81EUmhWtU51srqWLwQ',
      'CgACAgQAAxkBAAICZmReXfoOZ3zi0K9nLMvt1i4u8-x0AAKyAgACFztMUtQLGxMv5-7gLwQ',
      'CgACAgQAAxkBAAICZ2ReXfwlMSE6AcB7wzbG_VmpdT-fAAIVAwACP91EUsLiLjUFVfDhLwQ',
      'CgACAgQAAxkBAAICaGReXf1ZQvYSh_BRJV5nX0X3tKiRAALfAgACm0BMUtl5i3cZ0cZfLwQ',
      'CgACAgQAAxkBAAICaWReXhq9TJQu44uDSc43Q3rtq7gWAALMAgACNKRMUpVDFwvIn-5mLwQ',
      'CgACAgQAAxkBAAICamReXhwDrBtgiQOOBY9Hlpv5vUTrAAMDAAIIIk1SNBSI17OddkQvBA',
    ],
  },
};
