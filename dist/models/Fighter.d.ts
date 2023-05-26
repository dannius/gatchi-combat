import { FighterDTO } from 'src/db/fighters';
import { WeaponType, TFightResultType } from 'src/lib';
export declare const DEFAULT_STATING_SCORES = 600;
export declare class Fighter implements FighterDTO {
    userId: string;
    username: string;
    name: string;
    scores: number;
    fights: number;
    wins: number;
    looses: number;
    bdMode: boolean;
    constructor(dto: Partial<FighterDTO>);
    fight(emitterWeapon: WeaponType, enemy: Fighter, enemyWeapon: WeaponType): {
        winner: Fighter;
        looser: Fighter;
        addedWin: number;
        addedLose: number;
        fightResultType: TFightResultType;
    };
    private getScoreResult;
    private getWinner;
}
