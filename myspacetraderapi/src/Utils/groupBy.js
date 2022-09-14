// Credit to
// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
export default function groupBy(arr, key) {
    return arr.reduce(function (newArr, x) {
        (newArr[x[key]] = newArr[x[key]] || []).push(x);
        return newArr;
    }, {});
};