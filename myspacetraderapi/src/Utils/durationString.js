
export default function durationString(aInput, options) {
    if (!options) options = {};
    let a = parseInt(aInput);
    if (isNaN(a)) return aInput;

    const suffix = (a >= 0 ? options.suffix_future : options.suffix_past);
    const aAbs = Math.abs(a);
    if (aAbs < 1000) return options.suffix_now || "just now";
    if (aAbs < 6e4) {
        if (options.hide_seconds) return ["< 1 minute", suffix].join(' ');
        else return [Math.round(aAbs / 1e3), "seconds", suffix].join(' ');
    }
    if (aAbs < 3.6e6) {
        if (options.hide_minutes) return ["< 1 hour", suffix].join(' ');
        else return [Math.round(aAbs / 6e4), "minutes", suffix].join(' ');
    }
    if (aAbs < 8.64e7) return [Math.round(aAbs / 3.6e6), "hours", suffix].join(' ');
    return [Math.round(aAbs / 8.64e7), "days", suffix].join(' ');
}