export class Fighter {
  public scores = 200;

  public fights = 0;
  public wins = 0;
  public looses = 0;
  private resultStatuses = ['win', 'lose'];

  constructor(public id: number, public name: string) {}

  public fight(enemy: Fighter): { winner: Fighter; looser: Fighter } {
    const rand = this.resultStatuses[Math.floor(Math.random() * 2)];

    switch (rand) {
      case 'win':
        return this.getWinner(this, enemy);
      case 'lose':
        return this.getWinner(enemy, this);
    }
  }

  private getScoreResult(scoreWin: number, scoreLose: number): { winnerScore: number; looserScore: number } {
    let finalWinScore = Math.floor(scoreLose * 0.1);
    let finalLoseScore = Math.floor(scoreWin * 0.1);

    if ((finalLoseScore / finalWinScore) * 100 < 80) {
      finalWinScore = Math.floor(scoreLose * 0.05);
      finalLoseScore = Math.floor(scoreWin * 0.15);
    }

    if ((finalWinScore / finalLoseScore) * 100 < 80) {
      finalWinScore = Math.floor(scoreLose * 0.15);
      finalLoseScore = Math.floor(scoreWin * 0.05);
    }

    // lucky win
    const isLuckyWin = 1 === Math.floor(Math.random() * 10);

    if (isLuckyWin) {
      finalWinScore = Math.floor(scoreLose * 0.25);
      finalLoseScore = Math.floor(scoreWin * 0.25);
    }

    return { winnerScore: finalWinScore, looserScore: finalLoseScore };
  }

  private getWinner(winner: Fighter, loser: Fighter): { winner: Fighter; looser: Fighter } {
    const resultScore = this.getScoreResult(winner.scores, loser.scores);
    winner.scores -= resultScore.winnerScore;
    loser.scores += resultScore.looserScore;

    return {
      winner: winner,
      looser: loser,
    };
  }
}
