import { GroupDTO } from 'src/db/groups';
import { FinisSceneFighter } from './Scene';
export declare class Group implements GroupDTO {
    groupId: number;
    allowDailyQuote: boolean;
    fighters: Map<string, {
        username: string;
        scores: number;
        name: string;
    }>;
    constructor(data: Partial<GroupDTO>);
    updateFightersScores(winner: FinisSceneFighter, looser: FinisSceneFighter): void;
}
