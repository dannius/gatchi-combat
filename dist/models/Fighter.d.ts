import { FighterDTO } from 'src/db/fighters';
export declare const DEFAULT_STATING_SCORES = 600;
export declare class Fighter implements FighterDTO {
    userId: string;
    name: string;
    scores: number;
    fights: number;
    wins: number;
    looses: number;
    constructor(dto: Partial<FighterDTO>);
    fight(enemy: Fighter): {
        winner: Fighter;
        looser: Fighter;
        addedWin: number;
        addedLose: number;
    };
    private getScoreResult;
    private getWinner;
}
