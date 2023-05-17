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
export declare const TextKeys: {
    fighter1Name: string;
    fighter1Weapon: string;
    fighter1ScoresTotal: string;
    fighter1ScoresAdded: string;
    fighter2Name: string;
    fighter2Weapon: string;
    fighter2ScoresTotal: string;
    fighter2ScoresAdded: string;
};
export type DictionaryMessageKeys = 'StartChallenge' | 'StartDuel' | 'FightAccepterSelectWeapon' | 'FightEmitterSelectWeapon' | 'FightStageOne' | 'FightStageTwo' | 'FightStageThree' | 'Final';
export declare const DictionaryActionTitles: Record<ActionType | WeaponType, string>;
export declare const DictionaryMessages: Record<DictionaryMessageKeys, DictionaryBaseParams>;
