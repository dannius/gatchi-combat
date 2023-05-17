type Listener<T extends Array<any>> = (...args: T) => void;
export declare class EventEmitter<EventMap extends Record<string, Array<any>>> {
    private eventListeners;
    on<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>): void;
    emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]): void;
}
export {};
