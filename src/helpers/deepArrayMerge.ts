type TIsEqualItem = unknown | Record<string, unknown> | Array<unknown>

function deepArrayMerge(target: Array<unknown>, source: Array<unknown>) {
    const result: Array<unknown> = [...target];

    source.forEach(item => {
        if (!result.some(existing => isEqual(existing, item))) {
            result.push(item);
        }
    });

    return result;
}

function isEqual(a: TIsEqualItem, b: TIsEqualItem): boolean {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object') return false;
    if (a === null || b === null) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => isEqual(a[`${key}`], b[`${key}`]));
}

export default deepArrayMerge;
