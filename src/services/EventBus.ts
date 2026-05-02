interface Listeners {
    [eventName: string]: ((...args: unknown[]) => void)[];
}

export default class EventBus {
    private readonly listeners: Listeners = {}

    on(event: string, callback: (...args: unknown[]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    off(event: string, callback: (...args: unknown[]) => void): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${ event }`);
        }

        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }

    emit(event: string, ...args: unknown[]): void {
        if (!this.listeners[event]) {
            return;
            // throw new Error(`Нет события: ${ event }`);
        }

        this.listeners[event].forEach(function (listener) {
            listener(...args);
        });
    }
}
