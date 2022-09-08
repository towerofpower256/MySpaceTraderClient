export default function sortCompareNumerically(_a, _b, descending) {
    const a = (!descending ? _a : _b);
    const b = (!descending ? _b : _a);
    return (a - b);
}