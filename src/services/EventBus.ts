interface Listeners {
    [eventName: string]: ((...args: unknown[]) => void)[];
}

export default class EventBus<E extends string> {
    private readonly listeners: Listeners = {}

    on(event: E, callback: (...args: unknown[]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    off(event: E, callback: (...args: unknown[]) => void): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${ event }`);
        }

        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }

    emit<T extends unknown[] = []>(event: E, ...args: T) {
        if (!this.listeners[event]) {
            return;
            // throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event].forEach((listener) => {
            listener(...args);
        });
    }
}
