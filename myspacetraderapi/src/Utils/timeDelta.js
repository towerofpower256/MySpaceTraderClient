import padZero from "./padZero";

export default function timeDelta(delta, options) {
    if (!options) options = {};

    let deltaAbs = Math.abs(delta);
    var sign = delta < 0 ? '-' : '';

    // Get time components
    var hours = deltaAbs / 3.6e6 | 0;
    var mins = deltaAbs % 3.6e6 / 6e4 | 0;
    var secs = Math.floor(deltaAbs % 6e4 / 1e3);

    // Return formatted string
    if (options.variant === "hms") {
        if (hours > 0) return sign + hours + "h" + padZero(mins, 2) + "m" + padZero(secs, 2) + "s";
        if (mins > 0) return sign + mins + "m" + padZero(secs, 2) + "s";
        return sign + secs + "s";
    } else {
        return sign + padZero(hours, 2) + ':' + padZero(mins, 2) + ':' + padZero(secs, 2);
    }

}