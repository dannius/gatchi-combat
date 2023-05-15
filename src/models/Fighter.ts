export class Fighter {
  public scores = 600;

  public fights = 0;
  public wins = 0;
  public looses = 0;
  private resultStatuses = ['win', 'lose'];

  constructor(public id: number, public name: string) {}

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
    let finalWinScore = Math.floor(scoreLose * 0.11 + Math.random() * 50);
    let finalLoseScore = Math.floor(scoreWin * 0.11 + Math.random() * 50);

    const isLuckyWin = 1 === Math.floor(Math.random() * 10);
    const isLuckyLose = 2 === Math.floor(Math.random() * 10);

    // lucky lose
    if (isLuckyLose) {
      finalWinScore = Math.floor(Math.random() * 10);
      finalLoseScore = Math.floor(Math.random() * 10);
      return { winnerScore: finalWinScore, looserScore: finalLoseScore };
      // lucky win
    } else if (isLuckyWin) {
      finalWinScore = Math.floor(scoreLose * 0.25 + Math.random() * 80);
      finalLoseScore = Math.floor(scoreWin * 0.25 + Math.random() * 80);
      return { winnerScore: finalWinScore, looserScore: finalLoseScore };
    }

    if ((finalLoseScore / finalWinScore) * 100 < 70) {
      finalWinScore = Math.floor(scoreLose * 0.05 + Math.random() * 40);
      finalLoseScore = Math.floor(scoreWin * 0.05 + Math.random() * 40);
    } else if ((finalWinScore / finalLoseScore) * 100 < 60) {
      finalWinScore = Math.floor(scoreLose * 0.15 + Math.random() * 60);
      finalLoseScore = Math.floor(scoreWin * 0.15 + Math.random() * 60);
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
