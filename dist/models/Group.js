"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const Fighter_1 = require("./Fighter");
class Group {
    groupId;
    allowDailyQuote;
    fighters;
    constructor(data) {
        this.groupId = data.groupId;
        this.allowDailyQuote = data.allowDailyQuote === undefined || data.allowDailyQuote;
        this.fighters = data.fighters || new Map();
    }
    updateFightersScores(winner, looser) {
        const winnerGroup = this.fighters.get(`${winner.fighter.userId}`);
        const looserGroup = this.fighters.get(`${looser.fighter.userId}`);
        const winnerScores = winnerGroup
            ? winnerGroup.scores + winner.addedScores
            : Fighter_1.DEFAULT_STATING_SCORES + winner.addedScores;
        const looserScores = looserGroup
            ? looserGroup.scores - looser.addedScores
            : Fighter_1.DEFAULT_STATING_SCORES - looser.addedScores;
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
exports.Group = Group;
//# sourceMappingURL=Group.js.map