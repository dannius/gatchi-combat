"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
async function delay(ms) {
    return new Promise((res) => {
        setTimeout(() => res(), ms);
    });
}
exports.delay = delay;
//# sourceMappingURL=delay.js.map