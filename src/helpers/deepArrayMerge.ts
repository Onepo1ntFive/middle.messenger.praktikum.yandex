import { isPlainObject } from './isEqual';

type TPlainObject = {
    [key: string]: unknown;
};

type TIsEqualItem = Array<unknown> | TPlainObject | string

function deepArrayMerge(target: Array<unknown>, source: Array<unknown>) {
    const result: Array<unknown> = [...target];

    source.forEach(item => {
        if (!result.some(existing => isEqualArr(existing, item))) {
            result.push(item);
        }
    });

    return result;
}

function isEqualArr(a: TIsEqualItem, b: TIsEqualItem): boolean {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object') return false;
    if (a === null || b === null) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    if (isPlainObject(a) && isPlainObject(b)) {
        return keysA.every(key => {
            return a[`${ key }`] === b[`${ key }`]
        });
    }
}

export default deepArrayMerge;
