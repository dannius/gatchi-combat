"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.random = random;
//# sourceMappingURL=random.js.map