

export default function humanizeString(input, options) {
    if (!options) options = {};

    let a = (""+input)
    .trim()
    .toLowerCase()
    .replace(/_/g, " ") // Replace underscores with spaces

    let aSplit = a.split(" ");
    if (!options.capitalize || options.capitalize === "first") {
        aSplit[0] = _capitalize(aSplit[0])
    } else if (options.capitalize === "word") {
        aSplit = aSplit.map((_a) => _capitalize(_a));
    }
    a = aSplit.join(" ");

    return a;
}

function _capitalize(a) {
    return a.substr(0, 1).toUpperCase() + a.substr(1);
}