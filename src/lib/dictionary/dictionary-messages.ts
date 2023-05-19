import { ActionType, WeaponType } from '../types';

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
  fighter1ScoresTotal: '$fighter1ScoresTotal',
  fighter1ScoresAdded: '$fighter1ScoresAdded',
  fighter2Name: '$fighter2Name',
  fighter2Weapon: '$fighter2Weapon',
  fighter2ScoresTotal: '$fighter2ScoresTotal',
  fighter2ScoresAdded: '$fighter2ScoresAdded',
};

export type DictionaryMessageKeys =
  | 'StartChallenge'
  | 'StartDuel'
  | 'FightAccepterSelectWeapon'
  | 'FightEmitterSelectWeapon'
  | 'FightStageOne'
  | 'FightStageTwo'
  | 'FightStageThree'
  | 'Final';

export const DictionaryActionTitles: Record<ActionType | WeaponType, string> = {
  [ActionType.AcceptFight]: 'Спуститься в ♂dungeon♂',
  [WeaponType.Rock]: 'Ass',
  [WeaponType.Scissors]: 'Finger',
  [WeaponType.Paper]: 'Dick',
};

export const DictionaryMessages: Record<DictionaryMessageKeys, DictionaryBaseParams> = {
  StartChallenge: {
    messagesBody: [
      `${TextKeys.fighter1Name} желает надрать кому-нибудь зад`,
      `${TextKeys.fighter1Name} спускается в ♂dungeon♂ и желает помериться ♂semen♂`,
      `${TextKeys.fighter1Name}: "Я новый ♂dungeon master♂! Кто не согласен, отзовись или молчи вечно!"`,
      `${TextKeys.fighter1Name}: спустился в ♂dungeon♂ и провозгласил себя ♂boss of gym♂`,
    ],
    medias: [
      {
        type: 'photo',
        id: 'AgACAgIAAxkBAANRZGAiLRGdv_GqcjTqxsT8MbOcKnYAAprGMRuPBQhLIK8h7VRC-AoBAAMCAANtAAMvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANkZGA2YbkRkCBJObW1qMZZe2OW-IAAAp8rAAKPBQhLjhZczgmGy-QvBA',
      },
    ],
  },
  StartDuel: {
    messagesBody: [
      `${TextKeys.fighter1Name} изьявил желание надрать ${TextKeys.fighter2Name} ⚣ass⚣, примет ли он бой?`,
      `${TextKeys.fighter1Name} хочет проверить ${TextKeys.fighter2Name} на прочность`,
      `${TextKeys.fighter2Name} отказался страховать ${TextKeys.fighter1Name} на жиме лежа, в этом ⚣gym⚣ такое не прощают`,
    ],
    medias: [
      {
        type: 'photo',
        id: 'AgACAgIAAxkBAANRZGAiLRGdv_GqcjTqxsT8MbOcKnYAAprGMRuPBQhLIK8h7VRC-AoBAAMCAANtAAMvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKM2RmpBtso_vs-DJFVgUIlBWpmJYhAAJnKQACReQ5S332ZyL8SDm5LwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKNGRmpEC85GH_N9mdAzipHiY_CzezAAJoKQACReQ5S_Bc3H4E2b6zLwQ',
      },
    ],
  },
  FightEmitterSelectWeapon: {
    messagesBody: [
      `${TextKeys.fighter1Name} выбирай оружие`,
      `Чем же ${TextKeys.fighter1Name} хочет ♂fuck♂ очередного ♂slave♂`,
      `${TextKeys.fighter1Name} очень серьезен в выборе ♂weapon♂`,
    ],
    medias: [
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOTZGA4UnhbOz5Md9AJ6NJGxDo16wAD0SsAAo8FCEtYavStbLa2US8E',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOUZGA4Ut2tsDBAijARE0UyhruTtG4AAtIrAAKPBQhLX0B7Sy4K94ovBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOVZGA4UuM7dL6G5mc3Izhoz_9jVBYAAtMrAAKPBQhL9HSv5Be0MjkvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOWZGA4U9supnchAAEGcNzEVhy0H-_GAALUKwACjwUIS_Rwlk-HvfFLLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOXZGA4U18C7A6XkT50JVal51Y7bKQAAtUrAAKPBQhLfdIaVdEyKTYvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOYZGA4VPvSLC9rFU3AvkR2y4KmO44AAtYrAAKPBQhLbRDP4dlCt8EvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOZZGA4VFfriqPgUhVdK3d_4raVGmwAAtcrAAKPBQhLCim-e_yJ30MvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOaZGA4VbOyUP1YgPFTMHmj0P-OA00AAtgrAAKPBQhL0fTtibunbikvBA',
      },
    ],
  },
  FightAccepterSelectWeapon: {
    messagesBody: [
      `Твой ход ${TextKeys.fighter2Name}`,
      `${TextKeys.fighter2Name} выбери лучший ⚣fuck way⚣`,
      `${TextKeys.fighter2Name} выбирает свой ⚣favorite fuck way⚣`,
    ],
    medias: [
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAObZGA4gfiJDECWRkCcOjogL1FNr44AAtkrAAKPBQhLdlt_Wo58Y54vBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOcZGA4gbafo9d_U_GAmg1XvDSIfAoAAtorAAKPBQhLJGTGprp1uOkvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOdZGA4gRhbr2sOi5vHdcco3GntEegAAtsrAAKPBQhLWVe6DFczts4vBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOeZGA4gaJ4uieQwqHBJQrUkQeghLsAAtwrAAKPBQhL8BipRN17tqkvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOfZGA4gQN2lm7lmC0E9aLkTJzI22AAAt0rAAKPBQhLXCE8lr2YKcQvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOgZGA4gtaTmDClYzw5ZmTuc7NR-lkAAt4rAAKPBQhLr6JYVFTusJIvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOhZGA4gv_g_v124rH2bOJEw_qPcDoAAt8rAAKPBQhLbp6cmfNPk2IvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKMmRmo-RZa8pF2c3nTPdxofxuUmF0AAJlKQACReQ5SxILG8O8WZe5LwQ',
      },
    ],
  },
  FightStageOne: {
    medias: [
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOOZGA3vIksSVV9iZt8VJ39Y8jC4xAAAskrAAKPBQhLy_qtpGHMJa8vBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOPZGA3vbRKXP5wzA2j1LOK_S5PWU0AAsorAAKPBQhLG56pvecj-JovBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOQZGA3ve6CQ-I721xH-upQlwNUDH8AAssrAAKPBQhL8xJGMXc8HF0vBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAORZGA3vjkv46Mf66LTvNcbok7yNycAAswrAAKPBQhLdmJXOe5O274vBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAOSZGA3vhONfqE45fnrOmjsKfDtZ0QAAs0rAAKPBQhL9WLpdkCvwG4vBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKN2RmpJBUqOjazIz1pOnXHMMzJ4B0AAJsKQACReQ5SxHEDvwL8kkTLwQ',
      },
    ],
  },
  FightStageTwo: {
    medias: [
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANzZGA299UxwrqAY3BRRwPG9lAAAWJYAAKuKwACjwUIS6xJ106X0o9vLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKNmRmpH7kwbJ6GvfJnotZa1d24C5DAAJrKQACReQ5S7vom7doXwaULwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIBdWRg0-K9jRn6a3Cd4ntWssL41c0gAAK8LgACjwUIS_RXuZ51YabTLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN0ZGA2-HzLjBgc3yI1L5o3LIXC10QAAq8rAAKPBQhLVTiD_lIcszQvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN1ZGA2-F76zQKCsVeK2JVv_Ru8oG4AArArAAKPBQhLtM2_MITW9DIvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN2ZGA2-dmtAAFsTiXhBmv_P7iJnfG9AAKxKwACjwUIS1p7hkEh7o5SLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN3ZGA2-a_KLHRi897uHcM5V9L4hr4AArIrAAKPBQhLx4QjHaNOZS4vBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN4ZGA2-XJaCmJOGrpNbwP-eA0IbokAArMrAAKPBQhLGdeqkvNwSmgvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN5ZGA2-g72zW7o0X1ceD8hF12qwhcAArQrAAKPBQhLZrn58AurcVgvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN6ZGA2-lBX81jjIrtc-epV46Oq7HkAArUrAAKPBQhLly3JxcRp2iQvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN7ZGA2-t90tC57lYOfEiYD_W8UN5UAArYrAAKPBQhLmpacT_2GSLQvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAN8ZGA2-5Ho3tZ_LTv50iQpUxBGDx8AArcrAAKPBQhLiWVIkXp_FbgvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKL2Rmo4wifxVUcpb0qCfgVlvaDA5IAAJiKQACReQ5S7ow1yhRD029LwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKMWRmo8Dk4hmzVXUNSixhs59y7y0jAAJkKQACReQ5S9kI_vHW1uxQLwQ',
      },
    ],
  },
  FightStageThree: {
    medias: [
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANoZGA2vb3J5IG7NsP_8PoyyPoCIVgAAqMrAAKPBQhLiswbe8-n3eIvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKLmRmo2GD_9iBXWbwm2SdEk9a0B0LAAJhKQACReQ5S6FmQK8wqQxVLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIBdmRg0-bk1GzzB1QaSQkWNnWs69_zAAK9LgACjwUIS_DqM3ftZ8BRLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANpZGA2vVDH8274dDCs5CWtYbqfzRQAAqQrAAKPBQhLwwik9imRquMvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANqZGA2vjkFb50rkAAB8jcS45POLzFeAAKlKwACjwUIS6i078vZqf_fLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANrZGA2vrAct04So7WHQ0xNIVEj_tEAAqYrAAKPBQhLAaRnkMk4aiEvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANsZGA2vzFVrVoPDyKakCZ22iGvpLcAAqcrAAKPBQhL91VSV0w1ZJIvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANtZGA2v40DMfsJ2YhyaRoQBiHbbuwAAqgrAAKPBQhL56YTXjzbG8wvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANuZGA2wGaj4EY2yZsWp4W_MH4cHxQAAqkrAAKPBQhLoBs4boYa9XcvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANvZGA2wAKeFdnWL88pYLXZrx2msA0AAqorAAKPBQhL7uRrXLeMNGYvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANwZGA2wZUKVTUv7GTt3C9L3T1jTpkAAqsrAAKPBQhLBvRaS6Gmm5gvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANxZGA2wVkgwTsgkYFoR7zGP3xu_kUAAqwrAAKPBQhLx23ZFrdjoEAvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANyZGA2wvM2MecIRvQNzF5uWYVRIXgAAq0rAAKPBQhLqWSJV0NRDVcvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKMGRmo6WzLkanMslraeS8jkOP5Ps0AAJjKQACReQ5S8G7SGGkd6p7LwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKNWRmpFXZtWTWS2G5V0n8KVy-Mg8sAAJqKQACReQ5SxHXvE50umvyLwQ',
      },
    ],
  },
  Final: {
    messagesBody: [
      `Ебать ты!\nВсе белое!\n${TextKeys.fighter1Name} доказал, что он ⚣man⚣.\nУмело используя ${TextKeys.fighter1Weapon} он лишает ${TextKeys.fighter2Name} ${TextKeys.fighter2ScoresAdded} мл. ⚣semen⚣.`,
      `${TextKeys.fighter2Name}, дружок пирожок,\nкажется ты ошибся дверью,\nклуб для ♂slaves♂ на 2 блока ниже`,
      `${TextKeys.fighter1Name} Вот это ты дал используя ${TextKeys.fighter1Weapon},\nвсе в semen, ${TextKeys.fighter2Name} обесчестен,\nу него стало на ${TextKeys.fighter2ScoresAdded} мл. меньше ⚣semen⚣ и сломанный ${TextKeys.fighter2Weapon}`,
      `У ${TextKeys.fighter2Name} ${TextKeys.fighter2Weapon} из стали,\nно у ${TextKeys.fighter1Name} ${TextKeys.fighter1Weapon} из алмаза!\n${TextKeys.fighter1Name}  забирает у ${TextKeys.fighter2Name} ${TextKeys.fighter2ScoresAdded} мл. ⚣semen⚣.`,
      `${TextKeys.fighter1Name} проводит болевой на ${TextKeys.fighter2Weapon} бедного ⚣jabroni⚣ ${TextKeys.fighter2Name}`,
      `${TextKeys.fighter1Name} наносит открытый перелом ${TextKeys.fighter2Weapon} ${TextKeys.fighter2Name} и забирает ${TextKeys.fighter2ScoresAdded} мл. ⚣semen⚣.`,
      `${TextKeys.fighter2Name} неождал, такой резкой атаки с помощью ${TextKeys.fighter1Weapon} от ${TextKeys.fighter1Name}.${TextKeys.fighter2Name} опустошен на ${TextKeys.fighter2ScoresAdded} мл. ⚣semen⚣.`,
      `${TextKeys.fighter2Weapon} у ${TextKeys.fighter2Name} оказался как у настоящего ♂slaves♂. Такой ♂dungeon master♂ как ${TextKeys.fighter1Name} не прощает бедного ⚣jabroni⚣.\n${TextKeys.fighter2Name} нужно чаще посещать ♂gym♂`,
    ],
    messagesHeader: [
      `${TextKeys.fighter1Name} - ${TextKeys.fighter1ScoresTotal}(${TextKeys.fighter1ScoresAdded}) мл.\n${TextKeys.fighter2Name} - ${TextKeys.fighter2ScoresTotal}(${TextKeys.fighter2ScoresAdded}) мл.\n\n`,
    ],
    medias: [
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANhZGA2YBzC6fBzMtjHaIzfn_wrLqoAApwrAAKPBQhL82bZ6RdruFQvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANiZGA2YFo81benenunHg6G-3ZElawAAp0rAAKPBQhLknqkaCw5uqEvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANjZGA2YZj0DSB1YjdRiSOT0NUpRgIAAp4rAAKPBQhLURuQKbsdHFgvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANlZGA2Ycr6JFgSMPCfP7NKMgAB1W4zAAKgKwACjwUIS1FC9AznJLYlLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANmZGA2YTt9-aMNXvBpIwNcp6-SiSsAAqErAAKPBQhLMkfD4FLzKZcvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAANnZGA2Yj1954NePo0MbbFyho55el8AAqIrAAKPBQhLRBPmwGGae0wvBA',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIBdGRg07KbShCenFh7mk9Sn3OD34UkAAK4LgACjwUIS4FlUk_jRbdoLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIJzmRmamOlEvUUQFNfGFBUoZAv8CCsAAIrKAACReQ5S9n0kp2iPpudLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKLWRmozDX6YEERLepCBgJAQwLBnt4AAJgKQACReQ5S0RkFTXdZo5fLwQ',
      },
      {
        type: 'video',
        id: 'CgACAgIAAxkBAAIKOGRmpKAWjXuXqJExCAdUqOOHnDvvAAJuKQACReQ5S6CIaNq_AijSLwQ',
      },
    ],
  },
};
