export default function prettyNumber(a) {
    if (!a) return a;
    return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}