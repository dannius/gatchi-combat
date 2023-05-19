"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    eventListeners = {};
    on(eventName, listener) {
        const listeners = this.eventListeners[eventName] ?? new Set();
        listeners.add(listener);
        this.eventListeners[eventName] = listeners;
    }
    emit(eventName, ...args) {
        const listeners = this.eventListeners[eventName] ?? new Set();
        for (const listener of listeners) {
            listener(...args);
        }
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=event-emitter.js.map