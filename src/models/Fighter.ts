import { FighterDTO } from 'src/db/fighters';

export class Fighter implements FighterDTO {
  public userId: number;
  public name: string;
  public scores = 600;
  public fights = 0;
  public wins = 0;
  public looses = 0;
  private resultStatuses = ['win', 'lose'];

  constructor(dto: Partial<FighterDTO>) {
    if (dto.userId) this.userId = dto.userId;
    if (dto.name) this.name = dto.name;
    if (dto.scores) this.scores = dto.scores;
    if (dto.fights) this.fights = dto.fights;
    if (dto.wins) this.wins = dto.wins;
    if (dto.looses) this.looses = dto.looses;
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
    let finalWinScore = Math.floor(scoreLoseAbs * 0.11 + Math.random() * 50);
    let finalLoseScore = Math.floor(scoreWinAbs * 0.11 + Math.random() * 50);

    const isLuckyWin = 1 === Math.floor(Math.random() * 10);
    const isLuckyLose = 2 === Math.floor(Math.random() * 10);

    // lucky lose
    if (isLuckyLose) {
      finalWinScore = Math.floor(Math.random() * 10);
      finalLoseScore = Math.floor(Math.random() * 10);
      return { winnerScore: finalWinScore, looserScore: finalLoseScore };
      // lucky win
    } else if (isLuckyWin) {
      finalWinScore = Math.floor(scoreLoseAbs * 0.25 + Math.random() * 80);
      finalLoseScore = Math.floor(scoreWinAbs * 0.25 + Math.random() * 80);
      return { winnerScore: finalWinScore, looserScore: finalLoseScore };
    }

    if ((scoreLoseAbs / scoreWinAbs) * 100 < 70) {
      finalWinScore = Math.floor(scoreLoseAbs * 0.05 + Math.random() * 40);
      finalLoseScore = Math.floor(scoreWinAbs * 0.05 + Math.random() * 40);
    } else if ((scoreWinAbs / scoreLoseAbs) * 100 < 60) {
      finalWinScore = Math.floor(scoreLoseAbs * 0.15 + Math.random() * 60);
      finalLoseScore = Math.floor(scoreWinAbs * 0.15 + Math.random() * 60);
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
