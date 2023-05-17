import { GroupDTO } from 'src/db/groups';
import { FinisSceneFighter } from './Scene';
export declare class Group implements GroupDTO {
    groupId: number;
    allowDailyQuote: boolean;
    fighters: Map<string, {
        name: string;
        scores: number;
    }>;
    constructor(data: Partial<GroupDTO>);
    updateFightersScores(winner: FinisSceneFighter, looser: FinisSceneFighter): void;
}
