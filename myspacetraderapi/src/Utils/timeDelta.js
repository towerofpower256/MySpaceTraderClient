import padZero from "./padZero";

export default function timeDelta(a, b, options) {
    if (!options) options = {};
    if (!b) b = new Date(); // Use now

    let aDate = new Date(a);
    let bDate = new Date(b);

    let diff = aDate-bDate;
    let diffAbs = Math.abs(diff);

    // TODO handle invalid times

    // Allow for previous times
    var sign = diff < 0? '-' : '';
    diff = Math.abs(diff);

    // Get time components
    var hours = diff/3.6e6 | 0;
    var mins  = diff%3.6e6 / 6e4 | 0;
    var secs  = Math.round(diff%6e4 / 1e3);

    // Return formatted string
    return sign + padZero(hours, 2) + ':' + padZero(mins, 2) + ':' + padZero(secs, 2);
}