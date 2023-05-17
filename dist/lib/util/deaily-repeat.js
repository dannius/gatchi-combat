"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyRepeat = void 0;
const day_ms_1 = require("./day-ms");
function dailyRepeat(hourse, minutes, callback) {
    const now = new Date();
    const repeatTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourse, minutes, 0, 0);
    let millisTillTime = repeatTime.getTime() - now.getTime();
    if (millisTillTime < 0) {
        millisTillTime += day_ms_1.DAY_MS;
    }
    setTimeout(() => {
        callback();
        dailyRepeat(hourse, minutes, callback);
    }, millisTillTime);
}
exports.dailyRepeat = dailyRepeat;
//# sourceMappingURL=deaily-repeat.js.map