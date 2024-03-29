import { GroupDTO } from 'src/db/groups';
import { FinisSceneFighter } from './Scene';
import { DEFAULT_STATING_SCORES } from './Fighter';

export class Group implements GroupDTO {
  groupId: number;
  allowDailyQuote: boolean;
  fighters: Map<string, { username: string; scores: number; name: string }>;

  constructor(data: Partial<GroupDTO>) {
    this.groupId = data.groupId;
    this.allowDailyQuote = data.allowDailyQuote === undefined || data.allowDailyQuote;
    this.fighters = data.fighters || new Map<string, { username: string; scores: number, name: string }>();
  }

  public updateFightersScores(winner: FinisSceneFighter, looser: FinisSceneFighter): void {
    const winnerGroup = this.fighters.get(`${winner.fighter.userId}`);
    const looserGroup = this.fighters.get(`${looser.fighter.userId}`);

    const winnerScores = winnerGroup
      ? winnerGroup.scores + winner.addedScores
      : DEFAULT_STATING_SCORES + winner.addedScores;
    const looserScores = looserGroup
      ? looserGroup.scores - looser.addedScores
      : DEFAULT_STATING_SCORES - looser.addedScores;

    this.fighters.set(`${winner.fighter.userId}`, {
      username: winner.fighter.username,
      name: winner.fighter.name,
      scores: winnerScores,
    });
    this.fighters.set(`${looser.fighter.userId}`, {
      username: looser.fighter.username,
      name: looser.fighter.name,
      scores: looserScores,
    });
  }
}
