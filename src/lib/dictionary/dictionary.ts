import { DictionaryBase } from './dictionary-base';
import { DictionaryMessageKeys, DictionaryMessages } from './dictionary-messages';

export const Dictionary = Object.entries(DictionaryMessages).reduce((acc, [key, val]) => {
  acc[key] = new DictionaryBase(val);

  return acc;
}, {} as Record<DictionaryMessageKeys, DictionaryBase>);
