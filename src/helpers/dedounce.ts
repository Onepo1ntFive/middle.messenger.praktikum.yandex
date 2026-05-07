export const debounce = <T extends (...args: string[]) => ReturnType<T>>(
    callback: T,
    timeout: number,
    options: { leading?: boolean; trailing?: boolean } = { leading: false, trailing: true }
): ((...args: Parameters<T>) => void) => {
    let timer: ReturnType<typeof setTimeout>;
    let leadingCalled = false;

    return (...args: Parameters<T>) => {
        const callNow = options.leading && !leadingCalled;

        clearTimeout(timer);

        if (callNow) {
            leadingCalled = true;
            callback(...args);
        }

        timer = setTimeout(() => {
            leadingCalled = false;
            if (options.trailing) {
                callback(...args);
            }
        }, timeout);
    };
};