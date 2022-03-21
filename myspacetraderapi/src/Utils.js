export function prettyNumber(a) {
    return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}