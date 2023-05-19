import { FighterDTO } from 'src/db/fighters';
import { WeaponType, random } from 'src/lib';
export const DEFAULT_STATING_SCORES = 600;

export class Fighter implements FighterDTO {
  public userId: string;
  public username: string;
  public name: string;
  public scores = DEFAULT_STATING_SCORES;
  public fights = 0;
  public wins = 0;
  public looses = 0;
  public bdMode = false;

  constructor(dto: Partial<FighterDTO>) {
    if (dto.userId !== undefined) this.userId = dto.userId;
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.username !== undefined) this.username = dto.username;
    if (dto.scores !== undefined) this.scores = dto.scores;
    if (dto.fights !== undefined) this.fights = dto.fights;
    if (dto.wins !== undefined) this.wins = dto.wins;
    if (dto.looses !== undefined) this.looses = dto.looses;
    if (dto.bdMode !== undefined) this.bdMode = dto.bdMode;
  }

  public fight(
    emitterWeapon: WeaponType,
    enemy: Fighter,
    enemyWeapon: WeaponType,
  ): { winner: Fighter; looser: Fighter; addedWin: number; addedLose: number } {
    let res = 0;

    if (this.bdMode && emitterWeapon === WeaponType.Rock) {
      res = random(0, 1) === 0 || random(0, 1) === 0 ? 0 : 1;
    } else if (enemy.bdMode && enemyWeapon === WeaponType.Rock) {
      res = random(0, 1) === 1 || random(0, 1) === 1 ? 1 : 0;
    } else {
      res = random(0, 1);
    }

    switch (res) {
      case 0:
        return this.getWinner(this, enemy);
      case 1:
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

    return {
      winner: winner,
      looser: loser,
      addedWin: resultScore.winnerScore,
      addedLose: resultScore.looserScore,
    };
  }
}
