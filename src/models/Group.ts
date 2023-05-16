import { GroupDTO } from 'src/db/groups';
import { FinisSceneFighter } from './Scene';

export class Group implements GroupDTO {
  groupId: number;
  allowDailyQuote: boolean;
  fighters: Map<string, { name: string; scores: number }>;

  constructor(data: Partial<GroupDTO>) {
    this.groupId = data.groupId;
    this.allowDailyQuote = data.allowDailyQuote || false;
    this.fighters = data.fighters || new Map<string, { name: string; scores: number }>();
  }

  public updateFightersScores(winner: FinisSceneFighter, looser: FinisSceneFighter): void {
    const winnerGroup = this.fighters.get(`${winner.fighter.userId}`);
    const looserGroup = this.fighters.get(`${looser.fighter.userId}`);

    const winnerScores = winnerGroup ? winnerGroup.scores - winner.addedScores : winner.fighter.scores;
    const looserScores = looserGroup ? looserGroup.scores + looser.addedScores : looser.fighter.scores;

    this.fighters.set(`${winner.fighter.userId}`, { name: winner.fighter.name, scores: winnerScores });
    this.fighters.set(`${looser.fighter.userId}`, { name: looser.fighter.name, scores: looserScores });
  }
}
