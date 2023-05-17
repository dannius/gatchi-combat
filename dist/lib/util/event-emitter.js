"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    constructor() {
        this.eventListeners = {};
    }
    on(eventName, listener) {
        var _a;
        const listeners = (_a = this.eventListeners[eventName]) !== null && _a !== void 0 ? _a : new Set();
        listeners.add(listener);
        this.eventListeners[eventName] = listeners;
    }
    emit(eventName, ...args) {
        var _a;
        const listeners = (_a = this.eventListeners[eventName]) !== null && _a !== void 0 ? _a : new Set();
        for (const listener of listeners) {
            listener(...args);
        }
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=event-emitter.js.map