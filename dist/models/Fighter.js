"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fighter = exports.DEFAULT_STATING_SCORES = void 0;
const lib_1 = require("../lib");
exports.DEFAULT_STATING_SCORES = 600;
class Fighter {
    userId;
    username;
    name;
    scores = exports.DEFAULT_STATING_SCORES;
    fights = 0;
    wins = 0;
    looses = 0;
    bdMode = false;
    constructor(dto) {
        if (dto.userId !== undefined)
            this.userId = dto.userId;
        if (dto.name !== undefined)
            this.name = dto.name;
        if (dto.username !== undefined)
            this.username = dto.username;
        if (dto.scores !== undefined)
            this.scores = dto.scores;
        if (dto.fights !== undefined)
            this.fights = dto.fights;
        if (dto.wins !== undefined)
            this.wins = dto.wins;
        if (dto.looses !== undefined)
            this.looses = dto.looses;
        if (dto.bdMode !== undefined)
            this.bdMode = dto.bdMode;
    }
    fight(emitterWeapon, enemy, enemyWeapon) {
        let res = 0;
        if (this.bdMode && emitterWeapon === lib_1.WeaponType.Rock) {
            res = (0, lib_1.random)(0, 1) === 0 || (0, lib_1.random)(0, 1) === 0 ? 0 : 1;
        }
        else if (enemy.bdMode && enemyWeapon === lib_1.WeaponType.Rock) {
            res = (0, lib_1.random)(0, 1) === 1 || (0, lib_1.random)(0, 1) === 1 ? 1 : 0;
        }
        else {
            res = (0, lib_1.random)(0, 1);
        }
        switch (res) {
            case 0:
                return this.getWinner(this, enemy);
            case 1:
                return this.getWinner(enemy, this);
        }
    }
    getScoreResult(scoreWin, scoreLose) {
        const scoreWinAbs = Math.abs(scoreWin);
        const scoreLoseAbs = Math.abs(scoreLose);
        const mathScores = scoreWinAbs > scoreLoseAbs
            ? Math.floor(scoreLoseAbs * 0.11 + Math.random() * 50)
            : Math.floor(scoreLoseAbs * 0.11 + Math.random() * 50 + 10);
        let finalWinScore = mathScores;
        let finalLoseScore = mathScores;
        const isLuckyWin = 1 === Math.floor(Math.random() * 15);
        const isLuckyLose = 2 === Math.floor(Math.random() * 15);
        if (isLuckyLose) {
            const result = Math.floor(Math.random() * 10 + 1);
            return { winnerScore: result, looserScore: result };
        }
        else if (isLuckyWin) {
            let result;
            if (finalWinScore > finalLoseScore) {
                result = Math.floor(finalWinScore * 0.4 + Math.random() * 80 + 30);
            }
            else {
                result = Math.floor(finalLoseScore * 0.4 + Math.random() * 80 + 30);
            }
            return { winnerScore: result, looserScore: result };
        }
        if ((scoreLoseAbs / scoreWinAbs) * 100 < 60) {
            const result = Math.floor(scoreLoseAbs * 0.05 + Math.random() * 30);
            finalWinScore = result;
            finalLoseScore = result;
        }
        else if ((scoreWinAbs / scoreLoseAbs) * 100 < 60) {
            const result = Math.floor(scoreLoseAbs * 0.2 + Math.random() * 60 + 10);
            finalWinScore = result;
            finalLoseScore = result;
        }
        return { winnerScore: finalWinScore, looserScore: finalLoseScore };
    }
    getWinner(winner, loser) {
        const resultScore = this.getScoreResult(winner.scores, loser.scores);
        return {
            winner: winner,
            looser: loser,
            addedWin: resultScore.winnerScore,
            addedLose: resultScore.looserScore,
        };
    }
}
exports.Fighter = Fighter;
//# sourceMappingURL=Fighter.js.map