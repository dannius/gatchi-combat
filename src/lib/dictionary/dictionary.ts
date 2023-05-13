import { DictionaryBase } from './dictionary-base';
import { DictionaryMessages } from './dictionary-messages';

export const Dictionary = {
  startChallenge: new DictionaryBase(DictionaryMessages.StartChallenge),
  startDuel: new DictionaryBase(DictionaryMessages.StartDuel),
  fightEmitterSelectWeapon: new DictionaryBase(DictionaryMessages.FightEmitterSelectWeapon),
  fightAccepterSelectWeapon: new DictionaryBase(DictionaryMessages.FightAccepterSelectWeapon),
  fightStageOne: new DictionaryBase(DictionaryMessages.FightStageOne),
  fightStageTwo: new DictionaryBase(DictionaryMessages.FightStageTwo),
  fightStageThree: new DictionaryBase(DictionaryMessages.FightStageThree),
  final: new DictionaryBase(DictionaryMessages.Final),
};
