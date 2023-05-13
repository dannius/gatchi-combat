export interface Media {
  id: string;
  type: 'video' | 'photo';
}

export interface DictionaryBaseParams {
  messagesBody?: string[];
  messagesHeader?: string[];
  medias?: Media[];
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
  | 'FightStageThree'
  | 'Final';

export const DictionaryMessages: Record<DictionaryMessageKeys, DictionaryBaseParams> = {
  StartChallenge: {
    messagesBody: [`@${TextKeys.fighter1Name} желает надрать кому нибудь зад`],
    medias: [
      {
        type: 'photo',
        id: 'AgACAgIAAxkBAAIB7mReTBIFbiZsgxL40u1PAr3rc2d6AAK1yDEbIE35SrKQT0SCwsIJAQADAgADeAADLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAID32Rf9NYuETvYVepJS3D8PsLqxyXjAALYAgACPFkMU_EQyoCfDo7ILwQ',
      },
    ],
  },
  StartDuel: {
    messagesBody: [`@${TextKeys.fighter1Name} изьявил желание надрать ${TextKeys.fighter2Name} зад, примет ли он бой?`],
    medias: [
      {
        type: 'photo',
        id: 'AgACAgIAAxkBAAIB7mReTBIFbiZsgxL40u1PAr3rc2d6AAK1yDEbIE35SrKQT0SCwsIJAQADAgADeAADLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAID32Rf9NYuETvYVepJS3D8PsLqxyXjAALYAgACPFkMU_EQyoCfDo7ILwQ',
      },
    ],
  },
  FightEmitterSelectWeapon: {
    messagesBody: [`@${TextKeys.fighter1Name} выбирай оружие`],
    medias: [
      {
        type: 'photo',
        id: 'AgACAgIAAxkBAAICE2ReUIvRGmfYuhYVvRIa3MWejmWSAALVyDEbIE35SsOjhK9RpiOyAQADAgADbQADLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAID82Rf9c49WcrqNpU4Mj5kTePaXIXCAAI0AwACUhYFU2e5v6be_iCSLwQ',
      },
    ],
  },
  FightAccepterSelectWeapon: {
    messagesBody: [`@${TextKeys.fighter1Name} выбирай оружие`],
    medias: [
      {
        type: 'photo',
        id: 'AgACAgIAAxkBAAICI2ReUsIcbi9_znN-HMZECJx4iAUsAALoyDEbIE35SnGKbAeLK_hvAQADAgADbQADLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAID8mRf9ao3-5c2GT2XUYGtm6yZ5u6dAAIOAwACIf8EU4xXiz_M6f9lLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIEC2Rf9ugWtZjIrqXZCrIQoZoM98tYAAI-AwACqcB0Up_UUwccf_zRLwQ',
      },
    ],
  },
  FightStageOne: {
    medias: [
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIEDWRf-UDn0UPFY02ujHakoBMX2aphAAIwAwACuK0EU0eFUlnDDmciLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIETWRf_dMcLqGNzeKW_ZPP5BNcgT_2AALIAgACCkoNU-20zVscn8i3LwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIEUGRf_gxSEYhQwCBDtVtA5VS8mPcBAAIrAwACGvgMU0EZL5c0Fv8TLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIEVWRf_qz_P1D54cYxEsN2LxlxmuVJAAIxAwACzuQEU7l8tn8_Te-rLwQ',
      },
    ],
  },
  FightStageTwo: {
    medias: [
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAP8ZF1kU9QQZuZJCdEooHsWE6-UgyAAAnYDAAI7WYVSZHYv894om0UvBA',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIEA2Rf9kxSz-Kd5OBOczTHJUTGkZ_zAAIwAwACsNcFUw8O9xaV3yb_LwQ',
      },
    ],
  },
  FightStageThree: {
    medias: [
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICHmReUgl12tN_3Ue120iaDgKmAAFhCAACEQMAAjjQBFPXWhNQFYei9S8E',
      },
      // {
      //   type: 'video',
      //   id: 'CgACAgQAAxkBAAIEBGRf9mZumkVjZ93duYzIlcfV6n3tAAKPAwACKmKEUlzh-KyQdyOlLwQ',
      // },
    ],
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
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICKGReUxZb5InnO6WATPATDv7A8t9nAALYAgACPFkMU_EQyoCfDo7ILwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICZWReXfg6ExQ1yyzkCu5F-DZXbXHBAAILAwACl81EUmhWtU51srqWLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICZmReXfoOZ3zi0K9nLMvt1i4u8-x0AAKyAgACFztMUtQLGxMv5-7gLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICZ2ReXfwlMSE6AcB7wzbG_VmpdT-fAAIVAwACP91EUsLiLjUFVfDhLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICaGReXf1ZQvYSh_BRJV5nX0X3tKiRAALfAgACm0BMUtl5i3cZ0cZfLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICaWReXhq9TJQu44uDSc43Q3rtq7gWAALMAgACNKRMUpVDFwvIn-5mLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAICamReXhwDrBtgiQOOBY9Hlpv5vUTrAAMDAAIIIk1SNBSI17OddkQvBA',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIEDGRf9wmrcH5dNNFnNh8hHRwZAsYpAALXAgACOeMNU7Y8GBc3iTRhLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgQAAxkBAAIEUmRf_jgVs9XGwd0iundkmLiDjS5hAAIzAwACBAAB_VE8oVpziDnivy8E',
      },
    ],
  },
};
