"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guid = void 0;
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.guid = guid;
//# sourceMappingURL=guid.js.map