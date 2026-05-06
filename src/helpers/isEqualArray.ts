function deepEqualArray(arr1: Array<unknown>, arr2: Array<unknown>) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return arr1 === arr2;
    }

    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (!deepEqualArray(arr1[i] as Array<unknown>, arr2[i] as Array<unknown>)) return false;
    }
    return true;
}
export default deepEqualArray;
