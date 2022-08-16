export default function insertOrUpdate(arr, obj, findFunc) {
    if (!Array.isArray(arr)) return arr; // Do nothing

    let i = arr.findIndex(findFunc);
    if (i === -1) {
        arr.push(obj);
    } else {
        arr[i] = obj;
    }

    return arr;
}