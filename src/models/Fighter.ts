import { FighterDTO } from 'src/db/fighters';
export const DEFAULT_STATING_SCORES = 600;

export class Fighter implements FighterDTO {
  public userId: string;
  public name: string;
  public scores = DEFAULT_STATING_SCORES;
  public fights = 0;
  public wins = 0;
  public looses = 0;
  private resultStatuses = ['win', 'lose'];

  constructor(dto: Partial<FighterDTO>) {
    if (dto.userId !== undefined) this.userId = dto.userId;
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.scores !== undefined) this.scores = dto.scores;
    if (dto.fights !== undefined) this.fights = dto.fights;
    if (dto.wins !== undefined) this.wins = dto.wins;
    if (dto.looses !== undefined) this.looses = dto.looses;
  }

  public fight(enemy: Fighter): { winner: Fighter; looser: Fighter; addedWin: number; addedLose: number } {
    const rand = this.resultStatuses[Math.floor(Math.random() * 2)];

    switch (rand) {
      case 'win':
        return this.getWinner(this, enemy);
      case 'lose':
        return this.getWinner(enemy, this);
    }
  }

  private getScoreResult(scoreWin: number, scoreLose: number): { winnerScore: number; looserScore: number } {
    const scoreWinAbs = Math.abs(scoreWin);
    const scoreLoseAbs = Math.abs(scoreLose);
    const mathScores =
      scoreWinAbs > scoreLoseAbs
        ? Math.floor(scoreLoseAbs * 0.11 + Math.random() * 50)
        : Math.floor(scoreLoseAbs * 0.11 + Math.random() * 50 + 10);
    let finalWinScore = mathScores;
    let finalLoseScore = mathScores;

    const isLuckyWin = 1 === Math.floor(Math.random() * 15);
    const isLuckyLose = 2 === Math.floor(Math.random() * 15);

    // lucky lose
    if (isLuckyLose) {
      const result = Math.floor(Math.random() * 10 + 1);
      return { winnerScore: result, looserScore: result };
      // lucky win
    } else if (isLuckyWin) {
      let result;
      if (finalWinScore > finalLoseScore) {
        result = Math.floor(finalWinScore * 0.4 + Math.random() * 80 + 30);
      } else {
        result = Math.floor(finalLoseScore * 0.4 + Math.random() * 80 + 30);
      }
      return { winnerScore: result, looserScore: result };
    }

    if ((scoreLoseAbs / scoreWinAbs) * 100 < 60) {
      const result = Math.floor(scoreLoseAbs * 0.05 + Math.random() * 30);
      finalWinScore = result;
      finalLoseScore = result;
    } else if ((scoreWinAbs / scoreLoseAbs) * 100 < 60) {
      const result = Math.floor(scoreLoseAbs * 0.2 + Math.random() * 60 + 10);
      finalWinScore = result;
      finalLoseScore = result;
    }

    return { winnerScore: finalWinScore, looserScore: finalLoseScore };
  }

  private getWinner(
    winner: Fighter,
    loser: Fighter,
  ): { winner: Fighter; looser: Fighter; addedWin: number; addedLose: number } {
    const resultScore = this.getScoreResult(winner.scores, loser.scores);
    winner.scores += resultScore.winnerScore;
    loser.scores -= resultScore.looserScore;

    return {
      winner: winner,
      looser: loser,
      addedWin: resultScore.winnerScore,
      addedLose: resultScore.looserScore,
    };
  }
}
