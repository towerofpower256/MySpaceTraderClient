export default function sortAlphabetically(a, propName) {
    if (!Array.isArray(a)) return;

    a.sort((a, b) => ("" + a[propName]).localeCompare("" + b[propName]));
}